"""Background removal for the specimen photos (transparent WebP cut-outs).

    tools/cutout/.venv/Scripts/python tools/cutout/cutout.py            # every entry in manifest.json
    tools/cutout/.venv/Scripts/python tools/cutout/cutout.py elapus     # only entries whose "out" contains "elapus"

Each manifest entry: {"file": <Wikimedia Commons file>, "out": <name>.webp, optional "rotate" (degrees,
counter-clockwise), "method" ("combo" | "rembg" | "colour"), "de" ([low, high] colour-distance ramp), "floor"
(colour distance below which a pixel is always background: removes shadows on the mount)}.

The photos are specimens on a plain light background, so two masks are combined:
  * rembg (a neural salient-object model) finds the body reliably but tends to drop thin legs and antenna tips;
  * a colour-distance mask against a smooth model of the background keeps every dark leg segment.
The colour mask only counts inside a generous zone around the rembg mask (so labels, pins' shadows and dirt far
from the beetle are ignored), holes are filled (white elytra on a white background), and the white fringe left in
the semi-transparent edge is removed by un-mixing the background colour.

Originals are cached in tools/cutout/.originals, review sheets go to tools/cutout/.review (both git-ignored).
Check every review sheet by eye: legs, tarsal claws, antennae and mandible teeth must survive.
"""
import io
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

os.environ.setdefault("NUMBA_CACHE_DIR", str(Path(__file__).parent / ".cache"))

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

HERE = Path(__file__).parent
ROOT = HERE.parent.parent
OUT_DIR = ROOT / "src/main/resources/static/assets/images/cutouts"
ORIG_DIR = HERE / ".originals"
REVIEW_DIR = HERE / ".review"
WORK = 1600      # long side used for processing
FINAL = 1200     # long side of the published cut-out
UA = "BeetlepediaCutout/1.0 (https://github.com/Sujemocchi; kimdongchan9973@gmail.com)"


def fetch(file: str) -> Image.Image:
    ORIG_DIR.mkdir(parents=True, exist_ok=True)
    cache = ORIG_DIR / (urllib.parse.quote(file.replace(" ", "_"), safe="") + ".bin")
    if not cache.exists():
        url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(file.replace(" ", "_")) + f"?width={WORK}"
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=120) as r:
            cache.write_bytes(r.read())
        time.sleep(1)  # be gentle with Commons
    im = Image.open(io.BytesIO(cache.read_bytes()))
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        white = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(white, im)
    return im.convert("RGB")


def srgb_to_lab(rgb: np.ndarray) -> np.ndarray:
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ m.T / np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def background_model(rgb: np.ndarray, guess_fg: np.ndarray) -> np.ndarray:
    """Smooth (quadratic) background surface fitted to pixels outside the rough foreground."""
    h, w, _ = rgb.shape
    ys, xs = np.mgrid[0:h, 0:w]
    sel = ~ndimage.binary_dilation(guess_fg, iterations=max(3, w // 80))
    yy, xx = ys[sel] / h, xs[sel] / w
    if yy.size > 200000:
        idx = np.random.default_rng(0).choice(yy.size, 200000, replace=False)
        yy, xx = yy[idx], xx[idx]
        vals = rgb[sel][idx]
    else:
        vals = rgb[sel]
    a = np.stack([np.ones_like(yy), xx, yy, xx * xx, yy * yy, xx * yy], 1)
    coef, *_ = np.linalg.lstsq(a, vals, rcond=None)
    full = np.stack([np.ones(h * w), (xs / w).ravel(), (ys / h).ravel(), ((xs / w) ** 2).ravel(),
                     ((ys / h) ** 2).ravel(), ((xs / w) * (ys / h)).ravel()], 1)
    return np.clip(full @ coef, 0, 255).reshape(h, w, 3)


def rembg_alpha(im: Image.Image) -> np.ndarray:
    from rembg import new_session, remove
    global _SESSION
    if "_SESSION" not in globals():
        _SESSION = new_session("isnet-general-use")
    out = remove(im, session=_SESSION, post_process_mask=True)
    return np.asarray(out.getchannel("A"), dtype=np.float32) / 255.0


def cut(entry: dict) -> tuple[Image.Image, Image.Image]:
    im = fetch(entry["file"])
    if entry.get("rotate"):
        im = im.rotate(entry["rotate"], expand=True, fillcolor=(255, 255, 255))
    scale = WORK / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    rgb = np.asarray(im, dtype=np.float32)
    method = entry.get("method", "combo")
    lo, hi = entry.get("de", [14, 34])

    a_nn = rembg_alpha(im) if method in ("combo", "rembg") else None
    if method == "rembg":
        alpha = a_nn
        bg = background_model(rgb, a_nn > 0.5)
    else:
        rough = a_nn > 0.5 if a_nn is not None else None
        if rough is None:
            # Without the network: anything clearly unlike the border colour is a first guess.
            border = np.concatenate([rgb[:8].reshape(-1, 3), rgb[-8:].reshape(-1, 3), rgb[:, :8].reshape(-1, 3), rgb[:, -8:].reshape(-1, 3)])
            rough = np.linalg.norm(rgb - np.median(border, 0), axis=-1) > 40
        bg = background_model(rgb, rough)
        de = np.linalg.norm(srgb_to_lab(rgb) - srgb_to_lab(bg), axis=-1)
        a_col = np.clip((de - lo) / (hi - lo), 0, 1)
        if a_nn is not None:
            zone = ndimage.binary_dilation(a_nn > 0.3, iterations=max(6, im.width // 25))
            a_col *= zone
            alpha = np.maximum(a_nn, a_col)
        else:
            alpha = a_col
        if entry.get("floor"):
            # Shadow on the mount: neutral and only a little darker than the background, unlike any body part.
            alpha = np.where(de < entry["floor"], 0, alpha)
        solid = alpha > 0.5
        # Keep the beetle and anything touching it; drop specks.
        lab, n = ndimage.label(solid)
        if n:
            sizes = np.concatenate([[0], ndimage.sum(solid, lab, range(1, n + 1))])
            big = sizes >= sizes.max() * 0.02
            if a_nn is not None:
                core = ndimage.binary_dilation(a_nn > 0.5, iterations=3)
                touching = np.isin(np.arange(n + 1), np.unique(lab[core & solid]))
                keep = (touching & (sizes >= 40)) | big
            else:
                keep = big
            keep[0] = True  # the soft, below-threshold edge stays as it is
            alpha = alpha * keep[lab]
        solid = alpha > 0.5
        filled = ndimage.binary_fill_holes(solid)
        holes = filled & ~solid
        if a_nn is not None:
            holes &= a_nn > 0.5  # pale body parts enclosed by a darker outline, not the gaps between legs and body
        if entry.get("floor"):
            holes &= de >= entry["floor"]  # nor background-coloured space enclosed by the mandibles
        alpha = np.where(holes, 1.0, alpha)
        filled = solid | holes
        alpha = np.where(ndimage.binary_dilation(filled, iterations=2), alpha, 0)

    # Un-mix the background from semi-transparent edge pixels (removes the white halo on dark pages).
    a3 = alpha[..., None]
    fg = np.where(a3 > 0.02, (rgb - (1 - a3) * bg) / np.maximum(a3, 0.02), rgb)
    fg = np.clip(fg, 0, 255)
    rgba = np.dstack([fg, alpha * 255]).astype(np.uint8)
    out = Image.fromarray(rgba, "RGBA")

    # Crop to the beetle with a small margin, then size for the web.
    ys, xs = np.nonzero(alpha > 0.04)
    pad = round(max(out.size) * 0.02)
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(out.width, xs.max() + pad + 1), min(out.height, ys.max() + pad + 1))
    out = out.crop(box)
    s = FINAL / max(out.size)
    if s < 1:
        out = shrink(out, (round(out.width * s), round(out.height * s)))
    return im, out


def shrink(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Resize with premultiplied alpha, so the colour of transparent pixels cannot bleed into the edges."""
    return im.convert("RGBa").resize(size, Image.LANCZOS).convert("RGBA")


def review(name: str, original: Image.Image, cutout: Image.Image) -> None:
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    h = 700
    o = original.copy(); o.thumbnail((h, h))
    k = min(h / cutout.width, h / cutout.height, 1)
    c = shrink(cutout, (round(cutout.width * k), round(cutout.height * k)))
    tiles = [o.convert("RGB")]
    for col in ((11, 16, 12), (230, 0, 160)):
        t = Image.new("RGB", c.size, col); t.paste(c, mask=c.getchannel("A")); tiles.append(t)
    sheet = Image.new("RGB", (sum(t.width for t in tiles) + 40, h + 30), (60, 60, 60))
    x = 10
    for t in tiles:
        sheet.paste(t, (x, 25)); x += t.width + 10
    ImageDraw.Draw(sheet).text((10, 6), name, fill=(255, 255, 255))
    sheet.save(REVIEW_DIR / (Path(name).stem + ".png"))


def main() -> None:
    manifest = json.loads((HERE / "manifest.json").read_text(encoding="utf-8"))
    only = sys.argv[1:]
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for e in manifest:
        if only and not any(o in e["out"] for o in only):
            continue
        original, out = cut(e)
        out.save(OUT_DIR / e["out"], "WEBP", quality=86, method=6, exact=False)
        review(e["out"], original, out)
        print(f'{e["out"]}: {out.width}x{out.height}, {(OUT_DIR / e["out"]).stat().st_size // 1024} KB')


if __name__ == "__main__":
    main()
