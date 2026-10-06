/*
 * Distribution maps. Each genus names a region map (assets/maps/<region>.js,
 * window.BP_MAPS); every polygon part of a country is its own path, so ranges
 * can be shown per island as well as per country.
 *
 * Range codes: ISO-3 country codes, or keys of BP.areas (see data/core.js).
 * Countries shared by several selected taxa get diagonal stripes in each colour.
 * Islands too small to see are drawn as dots.
 *
 * BPMap.render(stage, opts) is used on genus pages (all taxa, with toggles)
 * and on taxon pages (one taxon, zoomed to its range).
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
    var gDots = el("g");
    var hl = el("path", { fill: "none", stroke: "#f4f1e6", "stroke-width": "1.6", "pointer-events": "none" });
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

    svg.appendChild(defs);
    svg.appendChild(gBase);
    svg.appendChild(gDots);
    svg.appendChild(hl);
    stage.appendChild(svg);

    function stripePattern(list) {
      var id = uid + "-" + list.map(function (x) { return x.id; }).join("-");
      if (!defs.querySelector("#" + id)) {
        var band = 5, w = band * list.length;
        var pat = el("pattern", { id: id, patternUnits: "userSpaceOnUse", width: w, height: w, patternTransform: "rotate(45)" });
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
      var country = BP.countries[p.iso] ? App.L(BP.countries[p.iso]) : p.name;
      return codes.length ? codes.map(App.areaName).join(", ") + " (" + country + ")" : country;
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
      if (!target || !target.getAttribute || target.getAttribute("data-i") == null) return;
      var part = parts[+target.getAttribute("data-i")];
      if (part.dot) {
        var r = 6, cx = part.p.cx, cy = part.p.cy;
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

    // Zoom to the selected ranges (taxon pages), keeping a sensible minimum size and aspect ratio.
    function fit() {
      var vb = MAP.viewBox.split(" ").map(Number);
      var box = null;
      parts.forEach(function (part) {
        if (!shown(part).length) return;
        var b = part.dot ? { x: part.p.cx - 4, y: part.p.cy - 4, width: 8, height: 8 } : part.path.getBBox();
        box = !box ? { x1: b.x, y1: b.y, x2: b.x + b.width, y2: b.y + b.height }
          : { x1: Math.min(box.x1, b.x), y1: Math.min(box.y1, b.y), x2: Math.max(box.x2, b.x + b.width), y2: Math.max(box.y2, b.y + b.height) };
      });
      if (!box) return;
      var w = box.x2 - box.x1, h = box.y2 - box.y1, cx = (box.x1 + box.x2) / 2, cy = (box.y1 + box.y2) / 2;
      w = Math.max(w * 1.5, 220); h = Math.max(h * 1.5, 160);
      if (w / h > 1.8) h = w / 1.8;
      if (h / w > 1.1) w = h / 1.1;
      w = Math.min(w, vb[2]); h = Math.min(h, vb[3]);
      var x = Math.max(0, Math.min(vb[2] - w, cx - w / 2)), y = Math.max(0, Math.min(vb[3] - h, cy - h / 2));
      svg.setAttribute("viewBox", [x, y, w, h].map(function (n) { return n.toFixed(1); }).join(" "));
      svg.classList.add("zoomed");
    }

    apply();
    if (opts.fit) fit();

    return {
      setSelected: function (ids) { selected = ids.slice(); apply(); },
      selected: function () { return selected.slice(); },
      relabel: function () { svg.setAttribute("aria-label", App.t("map.aria", { region: regionName() })); updateAria(); }
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
