/*
 * Home page: hero, a step-by-step explorer down the classification (group → genus → species → subspecies)
 * with a server-side search on top, and a size comparison across genera.
 * Search results only appear while a query or filter is set; otherwise the explorer is shown.
 */
(function () {
  "use strict";

  var App = window.App, BP = window.BP;
  var t = App.t, L = App.L, esc = App.esc;
  var filter = "all";

  function sci(s) { return '<em class="sci">' + esc(s) + "</em>"; }

  // ---------- hero ----------
  function renderHero() {
    var imgs = BP.genera.map(function (g) { return g.images && (g.images.card || g.images.hero); }).filter(Boolean);
    document.getElementById("hero-img").innerHTML = imgs.map(function (img) {
      return '<div class="tile' + App.frameClass(img) + '">' + App.imgHTML(img, { width: 1000, eager: true }) + "</div>";
    }).join("");
    document.getElementById("hero-credit").innerHTML = imgs.map(App.creditHTML).join("<br>");
    document.getElementById("hero-stats").innerHTML =
      "<li><b>" + BP.groups.length + "</b><span>" + esc(t("home.stat.groups")) + "</span></li>" +
      "<li><b>" + BP.genera.length + "</b><span>" + esc(t("home.stat.genera")) + "</span></li>" +
      "<li><b>" + BP.taxa.length + "</b><span>" + esc(t("home.stat.taxa")) + "</span></li>";
  }

  // ---------- explorer ----------
  // path: [] → groups, [group] → genera, [group, genus] → species, [group, genus, species] → subspecies.
  // Kept in the URL hash (#explore=group/genus/species) so the back button steps back up.
  var path = [];
  var LEVELS = ["group", "genus", "species", "subspecies"];

  // Taxa of a genus grouped by species name, in seed order.
  function speciesOf(genusId) {
    var order = [], blocks = {};
    App.taxaOf(genusId).forEach(function (x) {
      var sp = App.speciesName(x);
      if (!blocks[sp]) { blocks[sp] = []; order.push(sp); }
      blocks[sp].push(x);
    });
    return order.map(function (sp) { return { sci: sp, taxa: blocks[sp] }; });
  }
  // A species with a single taxon (the species itself, or its only subspecies here) links straight to it;
  // otherwise it opens its subspecies.
  function isLeaf(block) { return block.taxa.length === 1; }

  function valid(p) {
    var grp = p[0] && App.group(p[0]);
    if (!grp) return [];
    var g = p[1] && App.genus(p[1]);
    if (!g || g.group !== grp.id) return [grp.id];
    var block = p[2] && speciesOf(g.id).filter(function (b) { return b.sci === p[2]; })[0];
    if (!block || isLeaf(block)) return [grp.id, g.id];
    return [grp.id, g.id, block.sci];
  }
  function pathFromHash() {
    var m = /^#explore=(.*)$/.exec(location.hash);
    return m ? valid(decodeURIComponent(m[1]).split("/")) : null;
  }

  function thumbHTML(img, group) {
    return img
      ? '<div class="thumb' + App.frameClass(img) + '">' + App.imgHTML(img, { width: 640 }) + "</div>"
      : '<div class="thumb empty">' + App.silhouetteSVG(group) + "</div>";
  }
  // One card. Cards that go a level deeper are buttons; leaves link to the taxon page.
  function cardHTML(o) {
    var inner = (o.thumb || "") + '<div class="body">' +
      '<span class="rank-tag">' + esc(o.rank) + "</span>" +
      '<span class="sci">' + o.sci + "</span>" + (o.auth ? '<span class="auth">' + esc(o.auth) + "</span>" : "") +
      (o.name ? '<span class="kname">' + o.name + "</span>" : "") +
      (o.lead ? '<p class="lead-text">' + o.lead + "</p>" : "") +
      '<span class="meta">' + o.meta.map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("") + "</span>" +
      '<span class="go">' + esc(o.drill ? t("ex.see") : t("ex.open")) + ' <span aria-hidden="true">' + (o.drill ? "↓" : "→") + "</span></span>" +
      "</div>";
    var style = ' style="--sp:' + o.color + '"', li = '<li style="--i:' + o.i + '">';
    return o.drill
      ? li + '<button type="button" class="ex-card' + (o.cls || "") + '" data-key="' + esc(o.key) + '"' + style + ">" + inner + "</button></li>"
      : li + '<a class="ex-card leaf' + (o.cls || "") + '" href="' + o.href + '"' + style + ">" + inner + "</a></li>";
  }

  function levelItems() {
    var lvl = path.length;
    if (lvl === 0) {
      return BP.groups.map(function (grp, i) {
        var genera = App.generaOf(grp.id);
        return cardHTML({
          drill: true, key: grp.id, i: i, color: grp.color, cls: " group",
          thumb: '<div class="emblem" aria-hidden="true">' + App.silhouetteSVG(grp.id) + "</div>",
          rank: grp.sci, sci: esc(L(grp.name)), lead: App.sciText(L(grp.lead)),
          meta: [t("count.genera", { n: genera.length }), t("count.taxa", { n: App.taxaOfGroup(grp.id).length })]
        });
      }).join("");
    }
    if (lvl === 1) {
      return App.generaOf(path[0]).map(function (g, i) {
        var img = g.images && (g.images.card || g.images.hero);
        return cardHTML({
          drill: true, key: g.id, i: i, color: g.color, cls: " genus",
          thumb: thumbHTML(img, g.group), rank: t("rank.genus"), sci: sci(g.sci), auth: g.authority, name: esc(L(g.name)),
          meta: [t("ex.nSpecies", { n: speciesOf(g.id).length }), t("count.taxa", { n: App.taxaOf(g.id).length })]
        });
      }).join("");
    }
    if (lvl === 2) {
      var g = App.genus(path[1]);
      return speciesOf(g.id).map(function (b, i) {
        var x = b.taxa[0];
        var img = b.taxa.map(function (s) { return s.images && s.images[0]; }).filter(Boolean)[0];
        var info = g.speciesInfo && g.speciesInfo[b.sci];
        var leaf = isLeaf(b);
        var max = b.taxa.reduce(function (m, s) { return Math.max(m, App.maxMale(s) || 0); }, 0);
        return cardHTML({
          drill: !leaf, key: b.sci, href: leaf ? App.taxonUrl(x) : null, i: i, color: x.color,
          thumb: thumbHTML(img, x.group), rank: t("rank." + (leaf ? x.rank : "species")), sci: sci(leaf ? x.sci : b.sci), auth: leaf ? x.authority : "",
          name: leaf ? App.nameHTML(x, App.lang()) : info && info.name ? esc(L(info.name)) : "",
          meta: (leaf ? [] : [t("ex.nSubspecies", { n: b.taxa.length })]).concat(max ? ["♂ ≤ " + max + " mm"] : [])
        });
      }).join("");
    }
    var block = speciesOf(path[1]).filter(function (b) { return b.sci === path[2]; })[0];
    return block.taxa.map(function (x, i) {
      return cardHTML({
        drill: false, href: App.taxonUrl(x), i: i, color: x.color,
        thumb: thumbHTML(x.images && x.images[0], x.group), rank: t("rank." + x.rank), sci: sci(x.sci), auth: x.authority,
        name: App.nameHTML(x, App.lang()), meta: ["♂ " + App.range(x.size && x.size.male)]
      });
    }).join("");
  }

  function levelTitle() {
    var lvl = path.length;
    if (lvl === 0) return esc(t("ex.pickGroup"));
    if (lvl === 1) return esc(t("ex.pickGenus", { name: L(App.group(path[0]).name) }));
    if (lvl === 2) return t("ex.pickSpecies", { name: sci(App.genus(path[1]).sci) });
    return t("ex.pickSubspecies", { name: sci(path[2]) });
  }
  function levelLink() {
    if (path.length === 1) return '<a class="ex-page" href="' + App.groupUrl(path[0]) + '">' + esc(t("ex.openGroup")) + " →</a>";
    if (path.length === 2) return '<a class="ex-page" href="' + App.genusUrl(path[1]) + '">' + esc(t("ex.openGenus")) + " →</a>";
    return "";
  }

  function renderSteps() {
    document.getElementById("ex-steps").innerHTML = LEVELS.map(function (k, i) {
      return '<li class="' + (i < path.length ? "done" : i === path.length ? "now" : "") + '">' + esc(t("ex.step." + k)) + "</li>";
    }).join("");
    var crumbs = [[0, esc(t("ex.all"))]];
    if (path[0]) crumbs.push([1, esc(L(App.group(path[0]).name))]);
    if (path[1]) crumbs.push([2, sci(App.genus(path[1]).sci)]);
    if (path[2]) crumbs.push([3, sci(path[2])]);
    document.getElementById("ex-crumbs").innerHTML = "<ol>" + crumbs.map(function (c, i) {
      return i === crumbs.length - 1
        ? '<li aria-current="step">' + c[1] + "</li>"
        : '<li><button type="button" data-depth="' + c[0] + '">' + c[1] + "</button></li>";
    }).join("") + "</ol>";
  }

  // dir: 1 = stepped in, -1 = stepped out, 0 = no animation (first draw, language change).
  function renderExplorer(dir, focus) {
    renderSteps();
    var panel = document.getElementById("ex-panel");
    panel.innerHTML =
      '<div class="ex-head"><h3 tabindex="-1" id="ex-title">' + levelTitle() + "</h3>" + levelLink() + "</div>" +
      '<ul class="ex-grid level-' + path.length + '">' + levelItems() + "</ul>";
    panel.classList.remove("in-fwd", "in-back");
    if (dir) { void panel.offsetWidth; panel.classList.add(dir > 0 ? "in-fwd" : "in-back"); }
    if (focus) document.getElementById("ex-title").focus({ preventScroll: true });
  }

  function go(next, dir) {
    path = next;
    var hash = path.length ? "#explore=" + encodeURIComponent(path.join("/")) : "#explore";
    if (location.hash !== hash) history.pushState({ explore: path }, "", hash);
    renderExplorer(dir, true);
    var ex = document.getElementById("explorer");
    if (ex.getBoundingClientRect().top < 0) App.scrollToEl(ex);
  }

  document.getElementById("ex-panel").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-key]");
    if (b) go(path.concat([b.getAttribute("data-key")]), 1);
  });
  document.getElementById("ex-crumbs").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-depth]");
    if (b) go(path.slice(0, +b.getAttribute("data-depth")), -1);
  });
  window.addEventListener("popstate", function () {
    var p = pathFromHash();
    if (p === null && location.hash && location.hash !== "#explore") return; // an ordinary in-page anchor
    p = p || [];
    var dir = p.length < path.length ? -1 : p.length > path.length ? 1 : 0;
    path = p;
    renderExplorer(dir, false);
  });

  // ---------- search: on the server (/api/taxa), shown only while active ----------
  function renderFilter() {
    document.getElementById("index-filter").innerHTML = [{ id: "all", name: { ko: t("home.allGroups"), en: t("home.allGroups"), ja: t("home.allGroups") }, color: "#b3bcae" }]
      .concat(BP.groups).map(function (grp) {
        return '<button type="button" class="chip small" style="--sp:' + grp.color + '" data-group="' + grp.id + '" aria-pressed="' +
          (filter === grp.id) + '"><span class="dot" aria-hidden="true"></span>' + esc(L(grp.name)) + "</button>";
      }).join("");
  }

  // Countries that appear in any range, directly or through an island / region in them.
  function renderCountries() {
    var sel = document.getElementById("f-country");
    var current = sel.value, codes = {};
    BP.taxa.forEach(function (x) {
      (x.distribution || []).forEach(function (c) {
        if (BP.areas[c]) BP.areas[c].countries.forEach(function (k) { codes[k] = 1; });
        else codes[c] = 1;
      });
    });
    var list = Object.keys(codes).filter(function (c) { return BP.countries[c]; })
      .sort(function (p, q) { return L(BP.countries[p]).localeCompare(L(BP.countries[q]), App.lang()); });
    sel.innerHTML = '<option value="">' + esc(t("filter.any")) + "</option>" + list.map(function (c) {
      return '<option value="' + c + '"' + (c === current ? " selected" : "") + ">" + esc(L(BP.countries[c])) + "</option>";
    }).join("");
  }

  function params() {
    var p = [];
    function add(k, v) { if (v !== "" && v != null) p.push(k + "=" + encodeURIComponent(v)); }
    add("q", document.getElementById("index-q").value.trim());
    if (filter !== "all") add("group", filter);
    add("rank", document.getElementById("f-rank").value);
    add("minLength", document.getElementById("f-min").value);
    add("maxLength", document.getElementById("f-max").value);
    add("country", document.getElementById("f-country").value);
    if (document.getElementById("f-photo").checked) add("hasImage", "true");
    return p;
  }

  var lastItems = [], seq = 0, timer = null;
  function showResults(on) {
    document.getElementById("index-results").hidden = !on;
    document.getElementById("explorer").hidden = on;
  }
  function drawResults() {
    document.getElementById("index-list").innerHTML = lastItems.map(function (x) {
      var g = App.genus(x.genus);
      var max = x.male && x.male[1];
      return '<li style="--sp:' + x.color + '"><a href="' + App.taxonUrl(x) + '"><span class="dot" aria-hidden="true"></span>' +
        '<span class="nm">' + sci(x.sci) + " <small>" + esc(x.authority || "") + "</small></span>" +
        '<span class="kn">' + esc(App.taxonName(x)) + "</span>" +
        '<span class="gn">' + esc(L(App.group(x.group).name)) + " · " + sci(g ? g.sci : x.genus) + "</span>" +
        '<span class="sz">' + (max ? "♂ ≤ " + max + " mm" : "") + "</span></a></li>";
    }).join("");
    document.getElementById("index-count").textContent = t("filter.count", { n: lastItems.length });
    document.getElementById("index-empty").hidden = lastItems.length > 0;
  }
  function search() {
    var p = params();
    var nFilters = p.filter(function (s) { return s.indexOf("q=") !== 0; }).length;
    var badge = document.getElementById("filter-count");
    badge.hidden = !nFilters;
    badge.textContent = nFilters;
    var mine = ++seq;
    if (!p.length) { lastItems = []; drawResults(); showResults(false); return; }
    fetch(App.base + "api/taxa?" + p.join("&"), { headers: { Accept: "application/json" } })
      .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(function (data) { if (mine !== seq) return; lastItems = data.items; drawResults(); showResults(true); })
      .catch(function () {
        if (mine !== seq) return;
        document.getElementById("index-count").textContent = t("filter.error");
        showResults(true);
      });
  }
  function searchSoon() { clearTimeout(timer); timer = setTimeout(search, 200); }

  document.getElementById("index-q").addEventListener("input", searchSoon);
  document.getElementById("index-filters").addEventListener("input", searchSoon);
  document.getElementById("index-filters").addEventListener("change", searchSoon);
  document.getElementById("f-reset").addEventListener("click", function () { setTimeout(search, 0); });
  document.getElementById("index-clear").addEventListener("click", function () {
    document.getElementById("index-q").value = "";
    document.getElementById("index-filters").reset();
    filter = "all";
    renderFilter();
    search();
    document.getElementById("index-q").focus();
  });
  document.getElementById("index-filter").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-group]");
    if (!b) return;
    filter = b.getAttribute("data-group");
    renderFilter();
    search();
    var again = document.querySelector('#index-filter button[data-group="' + filter + '"]');
    if (again) again.focus();
  });

  function render() {
    renderHero();
    renderExplorer(0, false);
    renderFilter();
    renderCountries();
    drawResults();
    App.observeReveals();
  }

  App.setNav([["#explore", "nav.explore"], ["#size", "nav.size"]]);
  path = pathFromHash() || [];
  document.addEventListener("langchange", render);
  render();
  if (path.length) App.scrollToEl(document.getElementById("explore"));

  // Largest taxon of each genus by default.
  var chosen = BP.genera.map(function (g) {
    return App.taxaOf(g.id).filter(App.maxMale).sort(function (a, b) { return App.maxMale(b) - App.maxMale(a); })[0];
  }).filter(Boolean).map(function (x) { return x.id; });
  window.BPSize.mount({ stage: "size-stage", species: "size-species", objects: "size-objects", legend: "size-legend" }, { taxa: BP.taxa, chosen: chosen });
})();
