"""Group silhouettes traced from real specimen cut-outs.

    tools/cutout/.venv/Scripts/python tools/cutout/silhouette.py

For each group: take the background-removed photo made by cutout.py, keep the band between the two body-length
measuring points (front: tip of the mandibles / horn / clypeal horn; back: tip of the elytra on the midline), trace
the alpha mask with potrace and write
  * src/main/resources/static/data/silhouettes.js — SVG paths in a box 160 high; the measured length spans
    y = 5 … 158 (the size comparison relies on this), the width depends on the beetle;
  * src/main/resources/static/assets/images/silhouettes/<group>.webp — a grey, low-contrast copy of the same band,
    laid over the path (clipped to it) for gentle shading.
Review sheet: tools/cutout/.review/silhouettes.png
"""
import json
import os
from pathlib import Path

os.environ.setdefault("NUMBA_CACHE_DIR", str(Path(__file__).parent / ".cache"))

import numpy as np
import potrace
from PIL import Image, ImageDraw, ImageOps
from scipy import ndimage

HERE = Path(__file__).parent
STATIC = HERE.parent.parent / "src/main/resources/static"
CUTOUTS = STATIC / "assets/images/cutouts"
TOP, LEN, H = 5, 153, 160
TRACE_H = 340  # trace at this height (in pixels) — enough for leg segments and mandible teeth, light on nodes

GROUPS = {
    # front = "midline": the clypeal horn on the midline (the forelegs reach further forward and are left out)
    "cetoniinae": {"cutout": "goliathus-regius-hg.webp", "front": "midline", "species": "Goliathus regius",
                   "file": "Goliathus-regius hg.jpg", "author": "Hannes Grobe", "license": "CC BY-SA 4.0",
                   "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"},
    "lucanidae": {"cutout": "elapus.webp", "front": "top", "species": "Cyclommatus elaphus",
                  "file": "Elapus.JPG", "author": "keusju", "license": "Public domain",
                  "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/"},
    "dynastinae": {"cutout": "dynastes-hercules-lichyi-udo-male.webp", "front": "top", "species": "Dynastes hercules lichyi",
                   "file": "Dynastes hercules lichyi (Lachaume, 1985) male (8538222465).png", "author": "Udo Schmidt from Deutschland",
                   "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"},
}


def measuring_band(mask: np.ndarray, front: str) -> tuple[int, int]:
    h, w = mask.shape
    cols = np.nonzero(mask.any(0))[0]
    mid = (cols.min() + cols.max()) // 2
    band = mask[:, max(0, mid - w // 40): mid + w // 40 + 1].any(1)
    rows = np.nonzero(band)[0]
    top = int(np.nonzero(mask.any(1))[0].min()) if front == "top" else int(rows.min())
    return top, int(rows.max())  # the elytra end is the lowest body pixel on the midline


def path_d(mask: np.ndarray, scale: float, dx: float, dy: float) -> str:
    curves = potrace.Bitmap(~mask).trace(  # potracer fills the dark (False) pixels
       turdsize=6, alphamax=1.0, opticurve=True, opttolerance=0.5)
    f = lambda p: f"{p.x * scale + dx:.1f} {p.y * scale + dy:.1f}"
    out = []
    for c in curves:
        seg = ["M" + f(c.start_point)]
        for s in c.segments:
            seg.append(("L" + f(s.c) + "L" + f(s.end_point)) if s.is_corner else ("C" + f(s.c1) + " " + f(s.c2) + " " + f(s.end_point)))
        out.append("".join(seg) + "Z")
    return "".join(out)


def main() -> None:
    (STATIC / "assets/images/silhouettes").mkdir(parents=True, exist_ok=True)
    data, review = {}, []
    for gid, g in GROUPS.items():
        im = Image.open(CUTOUTS / g["cutout"]).convert("RGBA")
        alpha = np.asarray(im.getchannel("A")) > 128
        alpha = ndimage.binary_opening(alpha, iterations=1)
        top, bottom = measuring_band(alpha, g["front"])
        band = im.crop((0, top, im.width, bottom + 1))
        mask = np.asarray(band.getchannel("A")) > 128
        mask = ndimage.binary_opening(mask, iterations=1)
        lab, n = ndimage.label(mask)
        if n > 1:  # drop specks left after clipping (cut leg tips that are no longer attached stay if large)
            sizes = ndimage.sum(mask, lab, range(1, n + 1))
            mask = np.isin(lab, 1 + np.nonzero(sizes >= sizes.max() * 0.004)[0])
        cols = np.nonzero(mask.any(0))[0]
        left, right = int(cols.min()), int(cols.max()) + 1
        mask, band = mask[:, left:right], band.crop((left, 0, right, band.height))
        k = TRACE_H / mask.shape[0]
        small = np.asarray(Image.fromarray(mask).resize((max(1, round(mask.shape[1] * k)), TRACE_H), Image.LANCZOS)) > 0
        scale = LEN / small.shape[0]
        width = round(small.shape[1] * scale + 4)
        d = path_d(small, scale, (width - small.shape[1] * scale) / 2, TOP)

        # Shading texture: grey, low contrast, mid-grey average (soft-light leaves the colour as it is at 50 %).
        tex_h = 360
        tex = band.resize((round(band.width * tex_h / band.height), tex_h), Image.LANCZOS)
        grey = ImageOps.autocontrast(tex.convert("L"), cutoff=2)
        g_arr = np.asarray(grey, dtype=np.float32)
        g_arr = 128 + (g_arr - 128) * 0.55
        tex_rgba = Image.fromarray(np.dstack([g_arr] * 3 + [np.asarray(tex.getchannel("A"), dtype=np.float32)]).astype(np.uint8), "RGBA")
        tex_rgba.save(STATIC / f"assets/images/silhouettes/{gid}.webp", "WEBP", quality=80, method=6)
        data[gid] = {"w": width, "d": d, "tex": f"assets/images/silhouettes/{gid}.webp",
                     "texBox": [round((width - small.shape[1] * scale) / 2, 2), TOP, round(small.shape[1] * scale, 2), LEN],
                     "species": g["species"], "file": g["file"], "author": g["author"], "license": g["license"], "licenseUrl": g["licenseUrl"]}
        review.append((gid, width, d, len(d)))
        print(f"{gid}: box {width}x{H}, path {len(d) / 1024:.1f} KB, measured band {top}-{bottom}px of {im.height}")

    js = ("/* Generated by tools/cutout/silhouette.py — do not edit by hand.\n"
          " * Group silhouettes traced from specimen photos: box w × 160, body length (front tip → elytra end) spans y = 5 … 158. */\n"
          "window.BP_SILHOUETTES = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    (STATIC / "data/silhouettes.js").write_text(js, encoding="utf-8")

    # Review: the paths rasterised by a browser are checked in the page itself; here, quick SVG files.
    for gid, width, d, _ in review:
        (HERE / ".review" / f"silhouette-{gid}.svg").write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {H}" width="{width * 4}" height="{H * 4}" style="background:#0b100c">'
            f'<line x1="0" x2="{width}" y1="{TOP}" y2="{TOP}" stroke="#f55" stroke-width=".3"/><line x1="0" x2="{width}" y1="{TOP + LEN}" y2="{TOP + LEN}" stroke="#f55" stroke-width=".3"/>'
            f'<path d="{d}" fill="#c8692f" fill-rule="evenodd"/></svg>', encoding="utf-8")


if __name__ == "__main__":
    main()
