/*
 * Distribution maps. Each genus names a region map (assets/maps/<region>.js,
 * window.BP_MAPS); every polygon part of a country is its own path, so ranges
 * can be shown per island as well as per country.
 *
 * Range codes: ISO-3 country codes, or keys of BP.areas (see data/core.js).
 * Countries shared by several selected taxa get diagonal stripes in each colour.
 * Islands too small to see are drawn as dots.
 * First-level administrative regions (MAP.admin, Natural Earth) are outlined thinly on top; hovering one names it
 * as "region, island, country" with the taxa recorded there.
 *
 * BPMap.render(stage, opts) is used on genus pages (all taxa, with toggles)
 * and on taxon pages (one taxon, zoomed to its range).
 *
 * Pan and zoom: three fixed levels (whole region → countries / large islands → cities, where the largest cities
 * are labelled). Drag to move (kept inside the region frame), +/− buttons, Ctrl/⌘ + wheel at the cursor,
 * double-click, pinch, and arrow / + / − keys. Strokes, dots, stripes and labels keep their size on screen.
 */
(function () {
  "use strict";

  var App = window.App, BP = window.BP;
  var SVGNS = "http://www.w3.org/2000/svg";

  function inBox(p, b) { return p.lon >= b[0] && p.lon <= b[2] && p.lat >= b[1] && p.lat <= b[3]; }
  function matches(p, code) {
    var area = BP.areas[code];
    if (!area) return p.iso === code;
    if (area.countries.indexOf(p.iso) === -1) return false;
    if (area.box && !inBox(p, area.box)) return false;
    return !(area.exclude || []).some(function (b) { return inBox(p, b); });
  }
  function isPoint(code) { return !!(BP.areas[code] && BP.areas[code].point); }
  function el(name, attrs) {
    var e = document.createElementNS(SVGNS, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  /**
   * opts.region: map id; opts.taxa: taxa drawn on this map; opts.selected: ids shown at start;
   * opts.onInfo(html): description of the hovered/focused area; opts.fit: zoom to the selected ranges.
   * Returns { setSelected(ids), selected(), relabel() }.
   */
  function render(stage, opts) {
    var MAP = window.BP_MAPS && window.BP_MAPS[opts.region];
    stage.innerHTML = "";
    if (!MAP) return { setSelected: function () {}, selected: function () { return []; }, relabel: function () {} };

    var taxa = opts.taxa;
    var selected = (opts.selected || []).slice();
    var regionName = function () { return App.L(BP.maps[opts.region] && BP.maps[opts.region].name); };
    var svg = el("svg", { viewBox: MAP.viewBox, role: "group" });
    svg.setAttribute("aria-label", App.t("map.aria", { region: regionName() }));
    var defs = el("defs");
    var gBase = el("g");
    var gAdmin = el("g", { "class": "admin" });
    var gDots = el("g");
    var hl = el("path", { fill: "none", stroke: "#f4f1e6", "stroke-width": "1.6", "pointer-events": "none", "vector-effect": "non-scaling-stroke" });
    var gCities = el("g", { "class": "cities", "pointer-events": "none" });
    var uid = "m" + Math.random().toString(36).slice(2, 7);

    // Which taxa occur in each polygon part
    var parts = MAP.paths.map(function (p, i) {
      var here = taxa.filter(function (x) { return (x.distribution || []).some(function (c) { return !isPoint(c) && matches(p, c); }); });
      return { p: p, i: i, taxa: here, path: null, dot: null };
    });
    // Point areas (narrow endemics) become extra dots placed by longitude / latitude.
    var pr = MAP.projection;
    Object.keys(BP.areas).filter(isPoint).forEach(function (code) {
      var here = taxa.filter(function (x) { return (x.distribution || []).indexOf(code) !== -1; });
      if (!here.length || !pr) return;
      var a = BP.areas[code];
      parts.push({
        p: { iso: a.countries[0], name: code, area: code, d: "", tiny: 1, lon: a.point[0], lat: a.point[1],
          cx: +((a.point[0] - pr.lon0) * pr.k).toFixed(1), cy: +((pr.lat0 - a.point[1]) * pr.k).toFixed(1) },
        i: parts.length, taxa: here, path: null, dot: null
      });
    });

    parts.forEach(function (part) {
      var p = part.p;
      if (p.d) {
        part.path = el("path", { d: p.d, "class": "country", "data-i": part.i });
        gBase.appendChild(part.path);
      }
      if (part.taxa.length) {
        if (p.tiny) {
          part.dot = el("circle", { cx: p.cx, cy: p.cy, r: 3.6, "class": "country dot has", "data-i": part.i, tabindex: "0" });
          gDots.appendChild(part.dot);
          if (part.path) part.path.classList.add("has-dot");
        } else {
          part.path.classList.add("has");
          part.path.setAttribute("tabindex", "0");
        }
      }
    });

    // Administrative regions: [iso, outline, label lon, label lat, name en, ko, ja, island key] (0 = same as en / none)
    var admins = (MAP.admin || []).map(function (a, i) {
      var here = taxa.filter(function (x) {
        return (x.distribution || []).some(function (c) { return !isPoint(c) && matches({ iso: a[0], lon: a[2], lat: a[3] }, c); });
      });
      gAdmin.appendChild(el("path", { d: a[1], "class": "adm", "data-a": i }));
      return { a: a, taxa: here };
    });

    svg.appendChild(defs);
    svg.appendChild(gBase);
    svg.appendChild(gAdmin);
    svg.appendChild(gDots);
    svg.appendChild(gCities);
    svg.appendChild(hl);
    stage.appendChild(svg);

    function stripePattern(list) {
      var id = uid + "-" + list.map(function (x) { return x.id; }).join("-");
      if (!defs.querySelector("#" + id)) {
        var band = 5, w = band * list.length;
        var pat = el("pattern", { id: id, patternUnits: "userSpaceOnUse", width: w, height: w, patternTransform: patternTransform() });
        list.forEach(function (x, i) {
          pat.appendChild(el("rect", { x: i * band, width: band, height: w, fill: x.color }));
        });
        defs.appendChild(pat);
      }
      return "url(#" + id + ")";
    }

    function shown(part) {
      return part.taxa.filter(function (x) { return selected.indexOf(x.id) !== -1; });
    }
    function placeLabel(part) {
      var p = part.p;
      var codes = p.area ? [p.area] : [];
      if (!p.area) part.taxa.forEach(function (x) {
        (x.distribution || []).forEach(function (c) { if (BP.areas[c] && !isPoint(c) && matches(p, c) && codes.indexOf(c) === -1) codes.push(c); });
      });
      var country = countryName(p.iso) || p.name;
      return codes.length ? codes.map(App.areaName).join(", ") + " (" + country + ")" : country;
    }
    var LANG_I = { en: 0, ko: 1, ja: 2 };
    function countryName(iso) {
      if (BP.countries[iso]) return App.L(BP.countries[iso]);
      var c = MAP.countries && MAP.countries[iso];
      return c ? c[LANG_I[App.lang()]] || c[0] : "";
    }
    // "Bengkulu, Sumatra, Indonesia" / "벵쿨루, 수마트라섬, 인도네시아" / 「ブンクル州、スマトラ島、インドネシア」
    function adminLabel(a) {
      var lang = App.lang(), island = a[7] && MAP.islands && MAP.islands[a[7]];
      var name = lang === "ko" ? a[5] || a[4] : lang === "ja" ? a[6] || a[4] : a[4];
      return [name, island ? island[lang] || island.en : "", countryName(a[0])].filter(Boolean).join(lang === "ja" ? "、" : ", ");
    }
    function describeAdmin(ad) {
      var list = ad.taxa.filter(function (x) { return selected.indexOf(x.id) !== -1; });
      var names = list.length
        ? list.map(function (x) { return '<em class="sci">' + App.esc(x.sci) + "</em>"; }).join(", ")
        : App.esc(App.t("map.noSpecies"));
      return "<strong>" + App.esc(adminLabel(ad.a)) + "</strong>" + (ad.taxa.length ? " — " + names : "");
    }
    function describe(part) {
      var list = shown(part);
      var names = list.length
        ? list.map(function (x) { return '<em class="sci">' + App.esc(x.sci) + "</em>"; }).join(", ")
        : App.esc(App.t("map.noSpecies"));
      return "<strong>" + App.esc(placeLabel(part)) + "</strong> — " + names;
    }
    function updateAria() {
      parts.forEach(function (part) {
        var node = part.dot || (part.taxa.length ? part.path : null);
        if (!node) return;
        var div = document.createElement("div");
        div.innerHTML = describe(part);
        node.setAttribute("aria-label", div.textContent);
      });
    }
    function show(target) {
      if (target && target.getAttribute && target.getAttribute("data-a") != null) {
        var ad = admins[+target.getAttribute("data-a")];
        hl.setAttribute("d", ad.a[1]);
        if (opts.onInfo) opts.onInfo(describeAdmin(ad));
        return;
      }
      if (!target || !target.getAttribute || target.getAttribute("data-i") == null) return;
      var part = parts[+target.getAttribute("data-i")];
      if (part.dot) {
        var r = 6 / zoomScale(), cx = part.p.cx, cy = part.p.cy;
        hl.setAttribute("d", "M" + (cx - r) + " " + cy + "a" + r + " " + r + " 0 1 0 " + 2 * r + " 0a" + r + " " + r + " 0 1 0 " + -2 * r + " 0");
      } else {
        hl.setAttribute("d", part.p.d);
      }
      if (opts.onInfo) opts.onInfo(part.taxa.length ? describe(part) : "<strong>" + App.esc(placeLabel(part)) + "</strong>");
    }
    function hide() {
      hl.removeAttribute("d");
      if (opts.onInfo) opts.onInfo("");
    }
    svg.addEventListener("mouseover", function (e) { show(e.target); });
    svg.addEventListener("mouseleave", hide);
    svg.addEventListener("focusin", function (e) { show(e.target); });
    svg.addEventListener("focusout", hide);

    function apply() {
      parts.forEach(function (part) {
        if (!part.taxa.length) return;
        var list = shown(part);
        var fill = !list.length ? "" : list.length === 1 ? list[0].color : stripePattern(list);
        [part.path, part.dot].forEach(function (node) {
          if (!node) return;
          node.style.fill = fill;
          node.style.fillOpacity = list.length ? "0.9" : "";
          node.classList.toggle("on", !!list.length);
        });
      });
      updateAria();
    }

    // ---------- pan & zoom ----------
    var FULL = MAP.viewBox.split(" ").map(Number);
    var ZOOM = [1, 2.5, 6];
    var level = 1, view = { x: 0, y: 0, w: FULL[2], h: FULL[3] }, anim = 0;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function zoomScale() { return FULL[2] / view.w; }
    function patternTransform() { return "rotate(45) scale(" + (1 / zoomScale()).toFixed(4) + ")"; }
    function clampView(v) {
      v.x = Math.max(0, Math.min(FULL[2] - v.w, v.x));
      v.y = Math.max(0, Math.min(FULL[3] - v.h, v.y));
      return v;
    }
    // Screen ↔ map. The drawing is letterboxed (preserveAspectRatio meet) when the svg is height-limited.
    function screenBox() {
      var r = svg.getBoundingClientRect(), s = Math.min(r.width / view.w, r.height / view.h);
      return { s: s, left: r.left + (r.width - view.w * s) / 2, top: r.top + (r.height - view.h * s) / 2 };
    }
    function clientToMap(cx, cy) {
      var b = screenBox();
      return { x: view.x + (cx - b.left) / b.s, y: view.y + (cy - b.top) / b.s };
    }
    function applyView(final) {
      svg.setAttribute("viewBox", [view.x, view.y, view.w, view.h].map(function (n) { return n.toFixed(2); }).join(" "));
      var k = zoomScale();
      parts.forEach(function (part) { if (part.dot) part.dot.setAttribute("r", (3.6 / k).toFixed(3)); });
      defs.querySelectorAll("pattern").forEach(function (p) { p.setAttribute("patternTransform", patternTransform()); });
      gCities.style.display = level === 3 ? "" : "none";
      if (final) drawCities();
    }
    function goTo(target, animate) {
      clampView(target);
      cancelAnimationFrame(anim);
      if (!animate || reduceMotion) { view = target; applyView(true); return; }
      var from = { x: view.x, y: view.y, w: view.w, h: view.h }, t0 = performance.now();
      (function step(now) {
        var u = Math.min(1, (now - t0) / 240), e = 1 - Math.pow(1 - u, 3);
        view = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e,
          w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e };
        applyView(u === 1);
        if (u < 1) anim = requestAnimationFrame(step);
      })(t0);
    }
    // Change level keeping the map point (px, py) where it is on screen (default: the centre of the view).
    function zoomTo(n, px, py) {
      n = Math.max(1, Math.min(3, n));
      if (n === level) return;
      var w = FULL[2] / ZOOM[n - 1], h = FULL[3] / ZOOM[n - 1];
      var fx = px == null ? 0.5 : (px - view.x) / view.w, fy = py == null ? 0.5 : (py - view.y) / view.h;
      if (px == null) { px = view.x + view.w / 2; py = view.y + view.h / 2; }
      level = n;
      updateControls();
      goTo({ x: px - fx * w, y: py - fy * h, w: w, h: h }, true);
    }
    function panBy(dx, dy) { goTo({ x: view.x + dx, y: view.y + dy, w: view.w, h: view.h }, true); }

    // Cities at the closest zoom: largest first; a label is skipped when it would overlap one already placed.
    var measure = document.createElement("canvas").getContext("2d");
    function drawCities() {
      gCities.innerHTML = "";
      if (level !== 3 || !MAP.cities) return;
      var b = screenBox(), lang = App.lang(), placed = [], n = 0, fontPx = 11.5, px = 1 / b.s;
      measure.font = "600 " + fontPx + "px " + getComputedStyle(document.body).fontFamily;
      MAP.cities.some(function (c) {
        if (c[3] < view.x || c[3] > view.x + view.w || c[4] < view.y || c[4] > view.y + view.h) return false;
        var name = lang === "ko" ? c[1] || c[0] : lang === "ja" ? c[2] || c[0] : c[0];
        var sx = (c[3] - view.x) * b.s, sy = (c[4] - view.y) * b.s, tw = measure.measureText(name).width;
        var left = sx + 7 + tw > view.w * b.s;
        var box = left ? { x1: sx - 7 - tw, x2: sx + 4 } : { x1: sx - 4, x2: sx + 7 + tw };
        box.y1 = sy - fontPx * 0.75; box.y2 = sy + fontPx * 0.6;
        if (placed.some(function (o) { return box.x1 < o.x2 && box.x2 > o.x1 && box.y1 < o.y2 && box.y2 > o.y1; })) return false;
        placed.push(box);
        var g = el("g", { "class": "city" + (c[5] ? " capital" : "") });
        g.appendChild(el("circle", { cx: c[3], cy: c[4], r: ((c[5] ? 3 : 2.3) * px).toFixed(3) }));
        var t = el("text", { x: c[3] + (left ? -5 : 5) * px, y: c[4] + 3.8 * px, "font-size": (fontPx * px).toFixed(3), "text-anchor": left ? "end" : "start" });
        t.textContent = name;
        g.appendChild(t);
        gCities.appendChild(g);
        return ++n >= 60;
      });
    }

    // Controls
    var controls = document.createElement("div");
    controls.className = "map-zoom";
    controls.setAttribute("role", "group");
    controls.innerHTML = '<button type="button" data-z="in">+</button><span class="lvl" aria-live="polite"></span><button type="button" data-z="out">−</button>';
    var hint = document.createElement("div");
    hint.className = "map-hint";
    hint.hidden = true;
    stage.appendChild(controls);
    stage.appendChild(hint);
    stage.setAttribute("tabindex", "0");
    function updateControls() {
      var zin = controls.querySelector('[data-z="in"]'), zout = controls.querySelector('[data-z="out"]'), lvl = controls.querySelector(".lvl");
      controls.setAttribute("aria-label", App.t("map.zoomGroup"));
      zin.setAttribute("aria-label", App.t("map.zoomIn"));
      zout.setAttribute("aria-label", App.t("map.zoomOut"));
      zin.disabled = level === 3;
      zout.disabled = level === 1;
      lvl.textContent = level + " / 3";
      lvl.setAttribute("aria-label", App.t("map.level", { n: level }));
      // Whole region: let a finger scroll the page; zoomed in: a finger moves the map.
      svg.style.touchAction = level > 1 ? "none" : "pan-y";
    }
    controls.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-z]");
      if (b) zoomTo(level + (b.getAttribute("data-z") === "in" ? 1 : -1));
    });
    var hintTimer = 0;
    function showHint() {
      hint.textContent = App.t("map.wheelHint");
      hint.hidden = false;
      clearTimeout(hintTimer);
      hintTimer = setTimeout(function () { hint.hidden = true; }, 1400);
    }
    var lastWheel = 0;
    svg.addEventListener("wheel", function (e) {
      if (!(e.ctrlKey || e.metaKey)) { showHint(); return; } // plain wheel keeps scrolling the page
      e.preventDefault();
      var now = Date.now();
      if (now - lastWheel < 280) return; // one notch = one level, even with a trackpad's burst of events
      lastWheel = now;
      var m = clientToMap(e.clientX, e.clientY);
      zoomTo(level + (e.deltaY < 0 ? 1 : -1), m.x, m.y);
    }, { passive: false });
    svg.addEventListener("dblclick", function (e) {
      e.preventDefault();
      var m = clientToMap(e.clientX, e.clientY);
      zoomTo(level === 3 ? 1 : level + 1, m.x, m.y);
    });
    stage.addEventListener("keydown", function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest(".map-zoom")) return;
      var step = 0.2, handled = true;
      if (e.key === "ArrowLeft") panBy(-view.w * step, 0);
      else if (e.key === "ArrowRight") panBy(view.w * step, 0);
      else if (e.key === "ArrowUp") panBy(0, -view.h * step);
      else if (e.key === "ArrowDown") panBy(0, view.h * step);
      else if (e.key === "+" || e.key === "=") zoomTo(level + 1);
      else if (e.key === "-" || e.key === "_") zoomTo(level - 1);
      else handled = false;
      if (handled) e.preventDefault();
    });

    // Drag (mouse or one finger) and pinch (two fingers). A drag never counts as a click.
    var pointers = {}, drag = null, pinch = null, suppressClick = false;
    function spread() {
      var p = Object.keys(pointers).map(function (k) { return pointers[k]; });
      return { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 };
    }
    svg.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var n = Object.keys(pointers).length;
      if (n === 1) drag = { x: e.clientX, y: e.clientY, from: { x: view.x, y: view.y }, moved: false, id: e.pointerId };
      else if (n === 2) { pinch = { d: spread().d, done: false }; drag = null; }
    });
    svg.addEventListener("pointermove", function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (pinch) {
        var sp = spread(), r = sp.d / pinch.d;
        if (!pinch.done && (r > 1.3 || r < 0.77)) {
          var m = clientToMap(sp.x, sp.y);
          zoomTo(level + (r > 1 ? 1 : -1), m.x, m.y);
          pinch.done = true;
        }
        return;
      }
      if (!drag) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      if (!drag.moved) {
        drag.moved = true;
        try { svg.setPointerCapture(drag.id); } catch (err) { /* pointer already released */ }
        stage.classList.add("dragging");
      }
      var s = screenBox().s;
      cancelAnimationFrame(anim);
      view = clampView({ x: drag.from.x - dx / s, y: drag.from.y - dy / s, w: view.w, h: view.h });
      applyView(false);
    });
    function release(e) {
      if (!pointers[e.pointerId]) return;
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) pinch = null;
      if (drag && drag.id === e.pointerId) {
        if (drag.moved) { suppressClick = true; setTimeout(function () { suppressClick = false; }, 0); applyView(true); }
        drag = null;
        stage.classList.remove("dragging");
      }
    }
    svg.addEventListener("pointerup", release);
    svg.addEventListener("pointercancel", release);
    svg.addEventListener("click", function (e) {
      if (suppressClick) { e.stopImmediatePropagation(); e.preventDefault(); }
    }, true);

    // Taxon pages: frame the selected ranges at the closest level that shows them whole.
    function fit() {
      var box = null;
      parts.forEach(function (part) {
        if (!shown(part).length) return;
        var b = part.dot ? { x: part.p.cx - 4, y: part.p.cy - 4, width: 8, height: 8 } : part.path.getBBox();
        box = !box ? { x1: b.x, y1: b.y, x2: b.x + b.width, y2: b.y + b.height }
          : { x1: Math.min(box.x1, b.x), y1: Math.min(box.y1, b.y), x2: Math.max(box.x2, b.x + b.width), y2: Math.max(box.y2, b.y + b.height) };
      });
      if (!box) return;
      var w = (box.x2 - box.x1) * 1.25, h = (box.y2 - box.y1) * 1.25;
      level = 1;
      [2, 3].forEach(function (k) { if (w <= FULL[2] / ZOOM[k - 1] && h <= FULL[3] / ZOOM[k - 1]) level = k; });
      var vw = FULL[2] / ZOOM[level - 1], vh = FULL[3] / ZOOM[level - 1];
      view = clampView({ x: (box.x1 + box.x2) / 2 - vw / 2, y: (box.y1 + box.y2) / 2 - vh / 2, w: vw, h: vh });
    }

    apply();
    if (opts.fit) fit();
    updateControls();
    applyView(true);

    return {
      setSelected: function (ids) { selected = ids.slice(); apply(); },
      selected: function () { return selected.slice(); },
      relabel: function () { svg.setAttribute("aria-label", App.t("map.aria", { region: regionName() })); updateAria(); updateControls(); drawCities(); }
    };
  }

  /**
   * Full map with taxon toggles and legend (genus page).
   * ids: { stage, info, chips, legend, all, none }
   */
  function mountInteractive(region, taxa, ids) {
    var stage = document.getElementById(ids.stage);
    var info = document.getElementById(ids.info);
    var chips = document.getElementById(ids.chips);
    var legend = document.getElementById(ids.legend);
    var hint = function () { info.textContent = App.t("map.hoverHint"); };
    var all = taxa.map(function (x) { return x.id; });

    var map = render(stage, {
      region: region, taxa: taxa, selected: all,
      onInfo: function (html) { if (html) info.innerHTML = html; else hint(); }
    });

    function drawControls() {
      var sel = map.selected();
      chips.innerHTML = taxa.map(function (x) {
        return '<button type="button" class="chip" style="--sp:' + x.color + '" data-sp="' + x.id + '" aria-pressed="' +
          (sel.indexOf(x.id) !== -1) + '"><span class="dot" aria-hidden="true"></span><span><em class="sci">' +
          App.esc(App.abbr(x.sci)) + "</em>" + (App.taxonName(x) ? "<br><small>" + App.esc(App.taxonName(x)) + "</small>" : "") +
          "</span></button>";
      }).join("");
      legend.innerHTML = taxa.map(function (x) {
        return '<li style="--sp:' + x.color + '"' + (sel.indexOf(x.id) === -1 ? ' class="off"' : "") +
          '><span class="sw" aria-hidden="true"></span><span><em class="sci">' + App.esc(x.sci) + "</em> · " +
          App.esc(App.t("count.countries", { n: (x.distribution || []).length })) + "</span></li>";
      }).join("");
    }

    chips.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-sp]");
      if (!b) return;
      var id = b.getAttribute("data-sp");
      var sel = map.selected();
      var i = sel.indexOf(id);
      if (i === -1) sel.push(id); else sel.splice(i, 1);
      map.setSelected(sel);
      drawControls();
      var again = chips.querySelector('button[data-sp="' + id + '"]');
      if (again) again.focus();
    });
    document.getElementById(ids.all).addEventListener("click", function () { map.setSelected(all); drawControls(); });
    document.getElementById(ids.none).addEventListener("click", function () { map.setSelected([]); drawControls(); });

    document.addEventListener("langchange", function () { drawControls(); map.relabel(); hint(); });
    drawControls();
    hint();
    return map;
  }

  window.BPMap = { render: render, mountInteractive: mountInteractive };
})();
