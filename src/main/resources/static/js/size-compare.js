/*
 * Size comparison: every item is drawn in millimetres inside one SVG,
 * so the relative sizes are true to scale. Each taxon uses the silhouette of
 * its group (flower chafer / stag beetle / rhinoceros beetle), traced from a specimen photo.
 *
 * BPSize.mount({ stage, species, objects, legend }, { taxa, chosen })
 */
(function () {
  "use strict";

  var App = window.App;

  // Silhouettes: the body length (mandible / horn tip → elytra end) spans y = 5 … 158 in a box w × 160.
  var TOP = 5, LEN = 153;
  function beetleWidth(groupId, len) { return len * App.silhouetteWidth(groupId) / LEN; }

  function beetle(groupId, x, y, len, color) {
    var s = len / LEN;
    return '<g transform="translate(' + x + " " + (y - TOP * s) + ") scale(" + s + ')" style="color:' + color + '">' + App.silhouette(groupId) + "</g>";
  }
  function drawHand(x, y) {
    return '<g transform="translate(' + (x + 16) + " " + y + ')" fill="#d9b99b">' +
      '<rect x="24" y="85" width="72" height="100" rx="16"/>' +
      '<rect x="24" y="18" width="17" height="82" rx="8.5"/>' +
      '<rect x="43" y="0" width="17" height="98" rx="8.5"/>' +
      '<rect x="62" y="8" width="17" height="92" rx="8.5"/>' +
      '<rect x="81" y="34" width="15" height="66" rx="7.5"/>' +
      '<rect x="16" y="92" width="20" height="66" rx="10" transform="rotate(-30 30 160)"/>' +
      "</g>";
  }
  function drawCard(x, y) {
    return '<g transform="translate(' + x + " " + y + ')">' +
      '<rect width="53.98" height="85.6" rx="3.18" fill="#5476a8"/>' +
      '<rect x="8" y="10" width="12" height="9" rx="1.5" fill="#e3c77a"/>' +
      '<rect x="8" y="66" width="36" height="3" rx="1" fill="#ffffff" fill-opacity="0.6"/>' +
      "</g>";
  }
  function drawCoin(x, y) {
    return '<g transform="translate(' + (x + 13.25) + " " + (y + 13.25) + ')">' +
      '<circle r="13.25" fill="#c9c9c2"/><circle r="11.2" fill="none" stroke="#9c9c94" stroke-width="0.6"/>' +
      '<text text-anchor="middle" dy="2.2" font-size="6.5" font-weight="700" fill="#55554f">500</text></g>';
  }

  var OBJECTS = [
    { id: "hand", label: "obj.hand", note: "obj.hand.note", h: 185, w: 114, draw: drawHand },
    { id: "card", label: "obj.card", note: "obj.card.note", h: 85.6, w: 53.98, draw: drawCard },
    { id: "coin", label: "obj.coin", note: "obj.coin.note", h: 26.5, w: 26.5, draw: drawCoin },
    { id: "dichotomus", label: "obj.dichotomus", note: "obj.dichotomus.note", h: 80, w: beetleWidth("dynastinae", 80),
      draw: function (x, y) { return beetle("dynastinae", x, y, 80, "#7a4a2a"); } }
  ];

  function mount(ids, cfg) {
    var stage = document.getElementById(ids.stage);
    if (!stage) return;
    var spBox = document.getElementById(ids.species);
    var objBox = document.getElementById(ids.objects);
    var legendBox = document.getElementById(ids.legend);

    var taxa = cfg.taxa.filter(function (x) { return App.maxMale(x); });
    var chosenSpecies = (cfg.chosen || taxa.slice(0, 3).map(function (x) { return x.id; })).slice();
    var chosenObjects = ["hand", "card", "coin"];

    function drawStage() {
      var items = [];
      taxa.forEach(function (x) {
        if (chosenSpecies.indexOf(x.id) === -1) return;
        var len = App.maxMale(x);
        items.push({
          w: beetleWidth(x.group, len), h: len, title: App.abbr(x.sci), sci: true, sub: len + " mm",
          draw: function (px, py) { return beetle(x.group, px, py, len, x.color); }
        });
      });
      OBJECTS.forEach(function (o) {
        if (chosenObjects.indexOf(o.id) === -1) return;
        items.push({ w: o.w, h: o.h, title: App.t(o.label), sub: (o.id === "coin" ? "Ø " : "") + o.h + " mm", draw: o.draw });
      });

      var gap = 16, pad = 10, labelH = 20;
      var maxH = items.reduce(function (m, it) { return Math.max(m, it.h); }, 60);
      var totalW = pad * 2 + items.reduce(function (s, it) { return s + Math.max(it.w, 34); }, 0) + gap * Math.max(items.length - 1, 0);
      totalW = Math.max(totalW, 120);
      var H = pad + maxH + labelH + pad;
      var baseY = pad + maxH;

      var grid = "";
      for (var gx = 0; gx <= totalW; gx += 10) {
        grid += '<line class="grid-line' + (gx % 50 === 0 ? " major" : "") + '" x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + baseY + '"/>';
      }
      for (var gy = baseY; gy >= 0; gy -= 10) {
        grid += '<line class="grid-line' + ((baseY - gy) % 50 === 0 ? " major" : "") + '" x1="0" y1="' + gy + '" x2="' + totalW + '" y2="' + gy + '"/>';
      }

      var x = pad, shapes = "";
      items.forEach(function (it) {
        var slot = Math.max(it.w, 34);
        shapes += it.draw(x + (slot - it.w) / 2, baseY - it.h);
        var cx = x + slot / 2;
        shapes += '<text class="label-main" x="' + cx + '" y="' + (baseY + 8) + '" text-anchor="middle" font-size="5.2"' +
          (it.sci ? ' font-style="italic"' : "") + ">" + App.esc(it.title) + "</text>" +
          '<text x="' + cx + '" y="' + (baseY + 15) + '" text-anchor="middle" font-size="4.6">' + App.esc(it.sub) + "</text>";
        x += slot + gap;
      });

      // Keep at least ~1.6 px per mm so small items stay legible; the stage scrolls on narrow screens.
      var minPx = Math.round(totalW * 1.6);
      stage.innerHTML = '<svg viewBox="0 0 ' + totalW + " " + H + '" style="min-width:' + minPx + 'px" role="img" aria-label="' +
        App.esc(App.t("size.aria")) + '">' + grid +
        '<line x1="0" x2="' + totalW + '" y1="' + baseY + '" y2="' + baseY + '" stroke="rgba(255,255,255,.35)" stroke-width="0.5"/>' +
        shapes + "</svg>";

      legendBox.innerHTML = "<span>" + App.esc(App.t("size.scale")) + "</span>" +
        OBJECTS.filter(function (o) { return chosenObjects.indexOf(o.id) !== -1; }).map(function (o) {
          return "<span>" + App.esc(App.t(o.label)) + ": " + App.sciText(App.t(o.note)) + "</span>";
        }).join("");
    }

    function drawPickers() {
      spBox.innerHTML = taxa.map(function (x) {
        return '<button type="button" class="chip small" style="--sp:' + x.color + '" data-sp="' + x.id + '" aria-pressed="' +
          (chosenSpecies.indexOf(x.id) !== -1) + '"><span class="dot" aria-hidden="true"></span><em class="sci">' +
          App.esc(App.abbr(x.sci)) + "</em> " + App.maxMale(x) + "mm</button>";
      }).join("");
      objBox.innerHTML = OBJECTS.map(function (o) {
        return '<button type="button" class="chip small" style="--sp:#b3bcae" data-obj="' + o.id + '" aria-pressed="' +
          (chosenObjects.indexOf(o.id) !== -1) + '"><span class="dot" aria-hidden="true"></span>' + App.esc(App.t(o.label)) + "</button>";
      }).join("");
    }

    function toggle(list, id) {
      var i = list.indexOf(id);
      if (i === -1) list.push(id); else list.splice(i, 1);
    }
    spBox.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-sp]");
      if (!b) return;
      toggle(chosenSpecies, b.getAttribute("data-sp"));
      b.setAttribute("aria-pressed", String(chosenSpecies.indexOf(b.getAttribute("data-sp")) !== -1));
      drawStage();
    });
    objBox.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-obj]");
      if (!b) return;
      toggle(chosenObjects, b.getAttribute("data-obj"));
      b.setAttribute("aria-pressed", String(chosenObjects.indexOf(b.getAttribute("data-obj")) !== -1));
      drawStage();
    });

    function all() { drawPickers(); drawStage(); }
    document.addEventListener("langchange", all);
    all();
  }

  window.BPSize = { mount: mount };
})();
