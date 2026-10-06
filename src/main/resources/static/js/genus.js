/*
 * Genus page (genus.html?id=<genus>): overview, taxon cards, comparison table,
 * distribution map, size comparison, life cycle, conservation and sources.
 * All content comes from window.BP (loaded from /api/bootstrap by js/boot.js).
 */
(function () {
  "use strict";

  var App = window.App, BP = window.BP;
  var t = App.t, L = App.L, esc = App.esc;
  var g = App.genus(App.param("id"));
  var main = document.getElementById("main");
  if (!g) {
    main.innerHTML = '<section class="section"><div class="container"><h1>' + esc(t("detail.notFound")) +
      '</h1><p><a href="' + App.homeUrl() + '">← Beetlepedia</a></p></div></section>';
    return;
  }
  var grp = App.group(g.group);
  var taxa = App.taxaOf(g.id);
  document.body.style.setProperty("--sp", g.color);
  document.body.style.setProperty("--accent", grp.color);

  // Taxa grouped by species (a species with several subspecies gets its own block).
  function speciesBlocks() {
    var order = [], blocks = {};
    taxa.forEach(function (x) {
      var sp = App.speciesName(x);
      if (!blocks[sp]) { blocks[sp] = []; order.push(sp); }
      blocks[sp].push(x);
    });
    return order.map(function (sp) { return { sci: sp, taxa: blocks[sp], info: g.speciesInfo && g.speciesInfo[sp] }; });
  }

  var STAGE_ICONS = {
    egg: '<svg class="stage-icon" viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="26" rx="11" ry="14" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
    larva: '<svg class="stage-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M34 12a14 14 0 1 0 4 12" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><circle cx="36" cy="12" r="4" fill="currentColor"/></svg>',
    pupa: '<svg class="stage-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6c8 0 11 8 11 18s-3 18-11 18-11-8-11-18S16 6 24 6z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M15 18h18M14 25h20M15 32h18" stroke="currentColor" stroke-width="1.5"/></svg>'
  };

  function render() {
    var lang = App.lang();
    document.title = g.sci + " — " + L(g.name) + " · Beetlepedia";

    // Hero
    var hero = g.images && g.images.hero;
    var heroImg = document.getElementById("hero-img");
    heroImg.classList.toggle("plate", !!(hero && hero.white));
    heroImg.innerHTML = hero ? App.imgHTML(hero, { width: 1920, eager: true, priority: true }) : "";
    document.getElementById("hero-credit").innerHTML = hero ? App.creditHTML(hero) : "";
    document.getElementById("hero-crumbs").innerHTML = App.breadcrumbHTML([
      [App.homeUrl(), "Beetlepedia"],
      [App.groupUrl(grp.id), esc(L(grp.name))],
      [null, '<em class="sci">' + esc(g.sci) + "</em>"]
    ]);
    document.getElementById("hero-eyebrow").textContent = L(g.eyebrow);
    var titleEl = document.getElementById("hero-title");
    titleEl.textContent = L(g.shortName || g.name);
    titleEl.classList.toggle("long", titleEl.textContent.replace(/\s/g, "").length > 8);
    document.getElementById("hero-sci").innerHTML = '<em class="sci">' + esc(g.sci) + "</em> " + esc(g.authority);
    document.getElementById("hero-lead").innerHTML = App.sciText(L(g.lead));
    var longest = taxa.reduce(function (m, x) { return Math.max(m, App.maxMale(x) || 0); }, 0);
    var stats = (g.heroStats || [{ value: String(longest), unit: " mm", label: { ko: t("genus.statLength"), en: t("genus.statLength") } }])
      .concat([{ value: String(taxa.length), unit: "", label: { ko: t("genus.statTaxa"), en: t("genus.statTaxa") } }]);
    document.getElementById("hero-stats").innerHTML = stats.map(function (s) {
      return "<li><b>" + esc(s.value) + (s.unit ? "<small>" + esc(s.unit) + "</small>" : "") + "</b><span>" + esc(L(s.label)) + "</span></li>";
    }).join("");

    // Overview
    var ov = g.overview || {};
    document.getElementById("overview-kicker").innerHTML = App.sciText(L(ov.kicker) || g.sci + " " + g.authority);
    document.getElementById("overview-body").innerHTML = App.sciText(L(ov.body));
    document.getElementById("overview-cards").innerHTML = (ov.cards || []).map(function (c) {
      return '<div class="card-box"><h3>' + App.sciText(L(c.title)) + "</h3><p>" + App.sciText(L(c.text)) + "</p></div>";
    }).join("");
    var rows = App.ladder(g);
    document.getElementById("taxonomy").innerHTML = App.taxonomyHTML(rows, rows.length - (g.taxonomy || []).length);
    document.getElementById("overview-note").innerHTML = App.sciText(L(ov.speciesNote));
    var ovImg = g.images && g.images.overview;
    document.getElementById("overview-figure").innerHTML = ovImg ? App.figureHTML(ovImg) : "";

    // Species cards
    var blocks = speciesBlocks();
    var single = blocks.every(function (b) { return b.taxa.length === 1 && !b.info; });
    document.getElementById("species-groups").innerHTML = single
      ? '<div class="species-grid">' + taxa.map(App.taxonCardHTML).join("") + "</div>"
      : blocks.map(function (b) {
          var info = b.info || {};
          return '<div class="species-block">' +
            '<div class="species-block-head reveal"><h3><em class="sci">' + esc(b.sci) + "</em> <small>" + esc(info.authority || "") + "</small></h3>" +
            (info.name ? '<p class="kname">' + esc(L(info.name)) + "</p>" : "") +
            (info.text ? '<p class="note">' + App.sciText(L(info.text)) + "</p>" : "") + "</div>" +
            '<div class="species-grid">' + b.taxa.map(App.taxonCardHTML).join("") + "</div></div>";
        }).join("");

    renderCompare();

    // Life cycle
    var life = g.lifecycle || { stages: [] };
    document.getElementById("life-lead").innerHTML = App.sciText(L(life.lead));
    document.getElementById("timeline").innerHTML = life.stages.map(function (s) {
      var icon = STAGE_ICONS[s.stage] || '<span class="stage-icon">' + App.silhouetteSVG(g.group) + "</span>";
      return '<li class="reveal">' + icon + "<h3>" + esc(L(s.title)) + '</h3><span class="time">' + esc(L(s.time)) +
        "</span><p>" + App.sciText(L(s.text)) + "</p></li>";
    }).join("");

    // Conservation, care, facts
    document.getElementById("cons-status").innerHTML = App.sciText(L(g.conservation));
    document.getElementById("care-list").innerHTML = (g.care || []).map(function (c) { return "<li>" + App.sciText(L(c)) + "</li>"; }).join("");
    document.getElementById("facts-list").innerHTML = (g.facts || []).map(function (f) {
      return '<li class="reveal">' + App.sciText(L(f)) + "</li>";
    }).join("");

    // Weights
    var wb = document.getElementById("weights-block");
    wb.hidden = !(g.weights && g.weights.items && g.weights.items.length);
    if (!wb.hidden) document.getElementById("weights-note").innerHTML = App.sciText(L(g.weights.note));

    // References & credits
    var srcIds = Object.keys(g.sources || {}).concat(grp.sources || [], ["naturalearth"]);
    document.getElementById("refs-list").innerHTML = srcIds.filter(function (id, i) { return srcIds.indexOf(id) === i; }).map(App.sourceItemHTML).join("");
    var seen = {}, imgs = [];
    [g.images && g.images.hero, g.images && g.images.overview].forEach(function (img) { if (img) imgs.push(img); });
    taxa.forEach(function (x) { imgs = imgs.concat(x.images || []); });
    document.getElementById("credits-list").innerHTML = imgs.filter(function (img) {
      if (seen[img.file]) return false;
      seen[img.file] = 1;
      return true;
    }).map(function (img) {
      return '<li><a href="' + App.commonsPage(img.file) + '" target="_blank" rel="noopener">' + esc(img.file) + "</a> — " +
        esc(img.author) + ", " + '<a href="' + esc(img.licenseUrl) + '" target="_blank" rel="noopener">' + esc(img.license) + "</a></li>";
    }).join("");

    App.observeReveals();
  }

  // ---------- comparison table ----------
  var sortState = { key: null, dir: 1 };
  var COLUMNS = [
    { key: "sci", label: "compare.sci", value: function (x) { return x.sci; } },
    { key: "name", label: "compare.name", value: function (x) { return App.taxonName(x); } },
    { key: "male", label: "compare.male", num: true, value: function (x) { return x.size && x.size.male ? x.size.male[1] : null; } },
    { key: "female", label: "compare.female", num: true, value: function (x) { return x.size && x.size.female ? x.size.female[1] : null; } },
    { key: "pattern", label: "compare.pattern", value: function (x) { return L(x.pattern); } },
    { key: "countries", label: "compare.countries", num: true, value: function (x) { return (x.distribution || []).length; } },
    { key: "habitat", label: "compare.habitat", value: function (x) { return L(x.habitat); } },
    { key: "status", label: "compare.status", value: function (x) { return L(x.conservation && x.conservation.status); } }
  ];

  function renderCompare() {
    var table = document.getElementById("compare-table");
    var lang = App.lang();
    var rows = taxa.slice();
    if (sortState.key) {
      var col = COLUMNS.filter(function (c) { return c.key === sortState.key; })[0];
      rows.sort(function (a, b) {
        var va = col.value(a), vb = col.value(b);
        if (va == null || vb == null) return va == null ? (vb == null ? 0 : 1) : -1; // missing values last
        var r = col.num ? va - vb : String(va).localeCompare(String(vb), lang);
        return r * sortState.dir;
      });
    }
    var head = COLUMNS.map(function (c) {
      var sort = sortState.key === c.key ? (sortState.dir === 1 ? "ascending" : "descending") : "none";
      var arrow = sort === "ascending" ? "▲" : sort === "descending" ? "▼" : "↕";
      return '<th scope="col" aria-sort="' + sort + '"><button type="button" data-key="' + c.key + '">' +
        esc(t(c.label)) + '<span class="arrow" aria-hidden="true">' + arrow + "</span></button></th>";
    }).join("");
    var body = rows.map(function (x) {
      return '<tr style="--sp:' + x.color + '">' +
        '<th scope="row"><span class="dot" aria-hidden="true"></span><a href="' + App.taxonUrl(x) + '"><em class="sci">' + esc(x.sci) + "</em></a></th>" +
        "<td>" + App.nameHTML(x, lang === "ja" ? "ja" : "ko") + '<span class="en" lang="en">' + App.nameHTML(x, "en") + "</span></td>" +
        '<td class="num">' + App.range(x.size && x.size.male) + "</td>" +
        '<td class="num">' + App.range(x.size && x.size.female) + "</td>" +
        "<td>" + esc(L(x.pattern)) + "</td>" +
        "<td>" + esc(App.rangeNames(x).join(", ")) + "</td>" +
        "<td>" + esc(L(x.habitat)) + "</td>" +
        "<td>" + esc(L(x.conservation && x.conservation.status)) + "</td></tr>";
    }).join("");
    table.innerHTML = "<caption>" + esc(t("compare.caption", { genus: g.sci })) + "</caption><thead><tr>" + head + "</tr></thead><tbody>" + body + "</tbody>";
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("#compare-table thead button");
    if (!btn) return;
    var key = btn.getAttribute("data-key");
    sortState.dir = sortState.key === key ? -sortState.dir : 1;
    sortState.key = key;
    renderCompare();
    var again = document.querySelector('#compare-table thead button[data-key="' + key + '"]');
    if (again) again.focus();
  });

  // ---------- boot ----------
  App.setNav([
    ["#overview", "nav.overview"], ["#species", "nav.species"], ["#compare", "nav.compare"],
    ["#map", "nav.map"], ["#size", "nav.size"], ["#lifecycle", "nav.lifecycle"], ["#references", "nav.refs"]
  ]);
  document.addEventListener("langchange", render);
  render();
  window.BPMap.mountInteractive(g.map, taxa, { stage: "map-stage", info: "map-info", chips: "map-chips", legend: "map-legend", all: "map-all", none: "map-none" });
  var bySize = taxa.filter(App.maxMale).sort(function (a, b) { return App.maxMale(b) - App.maxMale(a); });
  window.BPSize.mount(
    { stage: "size-stage", species: "size-species", objects: "size-objects", legend: "size-legend", weights: "weights" },
    { taxa: taxa, chosen: (g.sizeDefaults || bySize.slice(0, 3).map(function (x) { return x.id; })), weights: g.weights }
  );
  // Re-scroll to a #hash once the dynamic content exists.
  if (window.location.hash) {
    var target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();
