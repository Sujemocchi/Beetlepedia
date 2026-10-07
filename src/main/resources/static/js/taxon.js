/*
 * Taxon detail page (taxon.html?id=<taxon>) for a species or subspecies.
 * Genus-level defaults (diet, season, dimorphism, care) fill in what a taxon does not override.
 */
(function () {
  "use strict";

  var App = window.App, BP = window.BP;
  var t = App.t, L = App.L, esc = App.esc;
  var x = App.taxon(App.param("id"));
  var main = document.getElementById("main");
  if (!x) {
    main.innerHTML = '<section class="section"><div class="container"><h1>' + esc(t("detail.notFound")) +
      '</h1><p><a href="' + App.homeUrl() + '">← Beetlepedia</a></p></div></section>';
    return;
  }
  var g = App.genus(x.genus), grp = App.group(x.group);
  var siblings = App.taxaOf(g.id);
  var idx = siblings.indexOf(x);
  var defaults = g.defaults || {};
  var SCALE_MAX = Math.max(120, Math.ceil((App.maxMale(x) || 0) / 20) * 20); // mm, for the length bars

  document.body.style.setProperty("--sp", x.color);
  document.body.style.setProperty("--accent", grp.color);
  App.habitatBackdrop(g.id);

  function sizeBar(label, r) {
    if (!r) return '<div class="size-bar"><span>' + label + '</span><span class="rng-label dim">' + esc(t("species.noData")) + "</span></div>";
    var lo = r[0] == null ? 0 : r[0];
    return '<div class="size-bar"><span>' + label + '</span><span class="rng"><i' + (r[0] == null ? ' class="open"' : "") + ' style="left:' + (lo / SCALE_MAX * 100) +
      "%;width:" + ((r[1] - lo) / SCALE_MAX * 100) + '%"></i></span><span class="rng-label">' + App.range(r) + "</span></div>";
  }
  function section(key, inner, alt, anchor) {
    return '<section class="section' + (alt ? " alt" : "") + '"' + (anchor ? ' id="' + anchor + '"' : "") + '><div class="container">' +
      '<div class="section-head reveal"><h2>' + esc(t(key)) + "</h2></div>" + inner + "</div></section>";
  }
  function sci(s) { return '<em class="sci">' + esc(s) + "</em>"; }

  function render() {
    var lang = App.lang();
    var other = lang === "en" ? "ko" : "en";
    document.title = x.sci + " — " + (L(x.name) || L(g.name)) + " · Beetlepedia";
    var prev = siblings[(idx - 1 + siblings.length) % siblings.length];
    var next = siblings[(idx + 1) % siblings.length];
    var spName = App.speciesName(x);
    var isSub = x.rank === "subspecies";
    var sameSpecies = siblings.filter(function (s) { return s !== x && App.speciesName(s) === spName; });
    var images = x.images || [];

    // Hero
    var crumbs = [
      [App.homeUrl(), "Beetlepedia"],
      [App.groupUrl(grp.id), esc(L(grp.name))],
      [App.genusUrl(g.id), sci(g.sci)]
    ];
    if (isSub) crumbs.push([App.genusUrl(g.id, "species"), sci(App.abbr(spName))]);
    crumbs.push([null, sci(isSub ? App.abbr(x.sci) : x.sci)]);

    var heroFigure = images.length
      ? App.figureHTML(images[0], { eager: true, width: 1000 })
      : '<div class="pending-box tall">' + App.silhouetteSVG(x.group) + "<p>" + esc(t("detail.noImage")) + "</p></div>";
    var hero =
      '<section class="detail-hero"><div class="container">' +
      '<div class="reveal">' + App.breadcrumbHTML(crumbs) +
      '<span class="rank-tag">' + esc(t("rank." + (x.rank || "species"))) + "</span>" +
      "<h1>" + sci(x.sci) + "</h1>" +
      '<p class="auth">' + esc(x.authority || "") + "</p>" +
      '<p class="kname">' + App.nameHTML(x, lang) + "</p>" +
      (App.taxonName(x, other) ? '<p class="auth" lang="' + other + '">' + App.nameHTML(x, other) + "</p>" : "") +
      (x.nameNote ? '<p class="name-note">' + App.sciText(L(x.nameNote)) + "</p>" : "") +
      "</div>" +
      '<div class="reveal">' + heroFigure + "</div>" +
      "</div></section>";

    // 1. Taxonomy, form & size
    var subsHTML;
    if (x.subspecies && x.subspecies.length) {
      subsHTML = '<ul class="subspecies">' + x.subspecies.map(function (s) {
        return "<li>" + sci(s.sci) + " " + esc(s.authority) + (s.note ? "<small>" + esc(L(s.note)) + "</small>" : "") + "</li>";
      }).join("") + "</ul>";
    } else if (sameSpecies.length) {
      subsHTML = '<p class="note">' + esc(t("detail.siblings")) + '</p><ul class="subspecies links">' + sameSpecies.map(function (s) {
        return '<li style="--sp:' + s.color + '"><a href="' + App.taxonUrl(s) + '">' + sci(s.sci) + "</a> " + esc(s.authority || "") + "</li>";
      }).join("") + "</ul>";
    } else {
      subsHTML = '<p class="note">' + esc(t("detail.noSubspecies")) + "</p>";
    }
    var ladder = App.ladder(g).slice(-2).map(function (r) { return esc(L(r.rank)) + " " + sci(r.name); });
    if (isSub) ladder.push(esc(t("rank.species")) + " " + sci(spName));
    var morph =
      '<div class="grid-2">' +
      '<div class="prose reveal"><p class="big">' + App.sciText(L(x.morphology)) + "</p></div>" +
      '<dl class="facts-dl reveal">' +
      "<div><dt>" + esc(t("detail.authority")) + "</dt><dd>" + sci(x.sci) + " " + esc(x.authority || "") + "</dd></div>" +
      "<div><dt>" + esc(t("detail.classification")) + "</dt><dd>" + esc(L(grp.name)) + " · " + ladder.join(" · ") + "</dd></div>" +
      "<div><dt>" + esc(t("detail.bodyLength")) + '</dt><dd><div class="size-bars">' +
      sizeBar("♂ " + esc(t("species.male")), x.size && x.size.male) + sizeBar("♀ " + esc(t("species.female")), x.size && x.size.female) +
      "</div>" + (x.size && x.size.note ? '<p class="note">' + App.sciText(L(x.size.note)) + "</p>" : "") + "</dd></div>" +
      "<div><dt>" + esc(t("detail.dimorphism")) + "</dt><dd>" + App.sciText(L(x.dimorphism || defaults.dimorphism)) + "</dd></div>" +
      "<div><dt>" + esc(t("detail.pattern")) + "</dt><dd>" + App.sciText(L(x.pattern)) + "</dd></div>" +
      "<div><dt>" + esc(t(isSub ? "detail.parentSpecies" : "detail.subspecies")) + "</dt><dd>" +
      (isSub ? sci(spName) + (g.speciesInfo && g.speciesInfo[spName] ? " " + esc(g.speciesInfo[spName].authority || "") : "") + subsHTML : subsHTML) +
      "</dd></div>" +
      "</dl></div>";
    if (images.length > 1) {
      morph += '<h3 style="margin-top:56px" class="reveal">' + esc(t("detail.gallery")) + '</h3><div class="gallery">' +
        images.slice(1).map(function (img) { return '<div class="reveal">' + App.figureHTML(img, { width: 800 }) + "</div>"; }).join("") +
        "</div>";
    }

    // 1b. History & notable issues
    var issues = x.issues || [];
    var history =
      '<div class="grid-2">' +
      '<div class="reveal"><h3>' + esc(t("detail.timeline")) + '</h3><ol class="history">' +
      (x.history || []).map(function (h) {
        return '<li><span class="year">' + (h.year != null ? esc(h.year) : "—") + "</span><p>" + App.sciText(L(h)) + "</p></li>";
      }).join("") + "</ol></div>" +
      '<div class="reveal"><h3>' + esc(t("detail.issues")) + '</h3><div class="stack">' +
      (issues.length ? issues.map(function (is) {
        return '<article class="issue">' + (is.title ? "<h4>" + App.sciText(L(is.title)) + "</h4>" : "") + "<p>" + App.sciText(L(is.text)) + "</p>" +
          (is.sources ? '<p class="note">' + is.sources.map(function (sid) {
            var src = BP.sources[sid];
            return src && src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + App.sciText(src.title) + "</a>" : "";
          }).filter(Boolean).join(" · ") + "</p>" : "") + "</article>";
      }).join("") : '<p class="note">' + esc(t("detail.noIssues")) + "</p>") + "</div></div></div>";

    // 2. 3D model (on hold — placeholder only)
    var model = '<div class="pending-box reveal">' + App.silhouetteSVG(x.group) + "<p>" + esc(t("detail.modelPending")) + "</p></div>";

    // 3. Life history & ecology
    var eco =
      '<div class="grid-2">' +
      '<div class="prose reveal"><p class="big">' + App.sciText(L(x.ecology)) + "</p></div>" +
      '<dl class="facts-dl reveal">' +
      "<div><dt>" + esc(t("detail.food")) + "</dt><dd>" + App.sciText(L(x.food || defaults.food)) + "</dd></div>" +
      "<div><dt>" + esc(t("detail.season")) + "</dt><dd>" + App.sciText(L(x.season || defaults.season)) + "</dd></div>" +
      "</dl></div>";

    // 4. Range & habitat
    var rangeHtml =
      '<div class="map-layout">' +
      '<dl class="facts-dl reveal" style="align-self:start">' +
      "<div><dt>" + esc(t("detail.habitat")) + "</dt><dd>" + App.sciText(L(x.habitat)) + "</dd></div>" +
      "<div><dt>" + esc(t("detail.countries")) + '</dt><dd><ul class="country-list">' +
      App.rangeNames(x).map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></dd></div>" +
      (x.distributionNote ? '<div><dt></dt><dd class="note">' + App.sciText(L(x.distributionNote)) + "</dd></div>" : "") +
      "</dl>" +
      '<div class="reveal"><div class="map-stage mini-map" id="mini-map"></div><p class="map-info" id="mini-info" aria-live="polite"></p>' +
      '<p class="note">' + esc(t("map.note")) + "</p></div>" +
      "</div>";

    // 5. Captive rearing
    var care =
      '<div class="card-box reveal"><ul class="check-list">' +
      (x.captivityNote ? "<li>" + App.sciText(L(x.captivityNote)) + "</li>" : "") +
      (g.care || []).map(function (c) { return "<li>" + App.sciText(L(c)) + "</li>"; }).join("") +
      "</ul></div>";

    // 6. Conservation
    var c = x.conservation || {};
    var cons =
      '<dl class="facts-dl reveal">' +
      "<div><dt>" + esc(t("detail.status")) + "</dt><dd><strong>" + esc(L(c.status)) + "</strong></dd></div>" +
      "<div><dt>" + esc(t("detail.threats")) + "</dt><dd>" + App.sciText(L(c.text)) + "</dd></div>" +
      "</dl>";

    // 7. Facts + sources
    var facts =
      (x.facts && x.facts.length ? '<ul class="facts">' + x.facts.map(function (f) { return '<li class="reveal">' + App.sciText(L(f)) + "</li>"; }).join("") + "</ul>" : "") +
      '<h3 style="margin-top:56px">' + esc(t("detail.sources")) + '</h3><ol class="refs">' +
      (x.sources || []).map(App.sourceItemHTML).join("") + "</ol>" +
      (images.length ? '<p class="note">' + esc(t("refs.images")) + ": " + images.map(App.creditHTML).join(" / ") + "</p>" : "") +
      (App.habitat(g.id) ? '<p class="note">' + App.habitatCreditHTML(g.id) + "</p>" : "");

    // 8. Prev / next within the genus
    function pageLink(s, cls, key) {
      return '<a class="' + cls + '" href="' + App.taxonUrl(s) + '" style="--sp:' + s.color + '"><span class="dir">' +
        (cls === "prev" ? "← " : "") + esc(t(key)) + (cls === "next" ? " →" : "") + '</span><em class="sci">' + esc(s.sci) + "</em></a>";
    }
    var pager = siblings.length > 1
      ? '<nav class="pager" aria-label="' + esc(t("detail.prev") + " / " + t("detail.next")) + '">' +
        pageLink(prev, "prev", "detail.prev") + pageLink(next, "next", "detail.next") + "</nav>"
      : "";

    main.innerHTML = hero +
      section("detail.morph", morph, false, "morphology") +
      section("detail.history", history, true, "history") +
      section("detail.model", model, false, "model") +
      section("detail.ecology", eco, true, "ecology") +
      section("detail.range", rangeHtml, false, "range") +
      section("detail.care", care, true, "care") +
      section("detail.cons", cons, false, "conservation") +
      section("detail.facts", facts, true, "facts") +
      (pager ? '<section class="section"><div class="container">' + pager + "</div></section>" : "");

    var info = document.getElementById("mini-info");
    window.BPMap.render(document.getElementById("mini-map"), {
      region: g.map, taxa: [x], selected: [x.id], fit: true,
      onInfo: function (html) { info.innerHTML = html || esc(t("map.hoverHint")); }
    });
    info.textContent = t("map.hoverHint");
    App.observeReveals(main);
    setNav();
  }

  function setNav() {
    App.setNav([
      [App.genusUrl(g.id), "nav.genera"],
      ["#morphology", "nav.overview"], ["#range", "nav.map"], ["#facts", "nav.refs"]
    ]);
    // The first link shows the genus name rather than a generic label.
    var first = document.querySelector(".site-nav a");
    if (first) { first.removeAttribute("data-i18n"); first.innerHTML = "<em class=\"sci\">" + esc(g.sci) + "</em>"; }
  }

  document.addEventListener("langchange", render);
  render();
})();
