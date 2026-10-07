/*
 * Home page: hero, the three groups, the full classification tree,
 * a size comparison across genera and a server-side search over every taxon.
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

  // ---------- groups ----------
  function renderGroups() {
    document.getElementById("group-grid").innerHTML = BP.groups.map(function (grp) {
      var genera = App.generaOf(grp.id);
      return '<article class="group-card reveal" style="--sp:' + grp.color + '">' +
        '<div class="emblem">' + App.silhouetteSVG(grp.id) + "</div>" +
        '<span class="eyebrow">' + esc(grp.sci) + "</span>" +
        '<h3><a href="' + App.groupUrl(grp.id) + '">' + esc(L(grp.name)) + "</a></h3>" +
        "<p>" + App.sciText(L(grp.lead)) + "</p>" +
        '<ul class="genus-links">' + genera.map(function (g) {
          return '<li><a href="' + App.genusUrl(g.id) + '">' + sci(g.sci) + " <small>" + esc(L(g.name)) + " · " +
            esc(t("count.taxa", { n: App.taxaOf(g.id).length })) + "</small></a></li>";
        }).join("") + "</ul></article>";
    }).join("");
  }

  // ---------- classification tree ----------
  function renderTree() {
    var root = { label: "Coleoptera · Scarabaeoidea", kids: [], map: {} };
    function node(parent, key, label) {
      if (!parent.map[key]) { var n = { label: label, kids: [], map: {} }; parent.map[key] = n; parent.kids.push(n); }
      return parent.map[key];
    }
    BP.groups.forEach(function (grp) {
      var parent = root;
      grp.taxonomy.forEach(function (r) {
        parent = node(parent, r.name, '<span class="rank">' + esc(L(r.rank)) + "</span> " + esc(r.name) + " <small>" + esc(L(r.common)) + "</small>");
      });
      parent.href = App.groupUrl(grp.id);
      App.generaOf(grp.id).forEach(function (g) {
        var gn = node(parent, g.id, '<span class="rank">' + esc(t("rank.genus")) + '</span> <a href="' + App.genusUrl(g.id) + '">' + sci(g.sci) + "</a> <small>" + esc(L(g.name)) + "</small>");
        App.taxaOf(g.id).forEach(function (x) {
          var link = '<a href="' + App.taxonUrl(x) + '" style="--sp:' + x.color + '"><span class="dot" aria-hidden="true"></span>' + sci(x.sci) + "</a>" +
            (App.taxonName(x) ? " <small>" + esc(App.taxonName(x)) + "</small>" : "");
          if (x.rank === "subspecies") {
            var spn = App.speciesName(x);
            var info = g.speciesInfo && g.speciesInfo[spn];
            node(gn, spn, '<span class="rank">' + esc(t("rank.species")) + "</span> " + sci(spn) + (info && info.name ? " <small>" + esc(L(info.name)) + "</small>" : ""))
              .kids.push({ label: '<span class="rank">' + esc(t("rank.subspecies")) + "</span> " + link, kids: [] });
          } else {
            gn.kids.push({ label: '<span class="rank">' + esc(t("rank.species")) + "</span> " + link, kids: [] });
          }
        });
      });
    });
    function html(n, depth) {
      var kids = n.kids.length ? '<ul>' + n.kids.map(function (k) { return html(k, depth + 1); }).join("") + "</ul>" : "";
      if (n.kids.length > 6 && depth > 2) {
        return '<li><details><summary>' + n.label + ' <span class="count">' + n.kids.length + "</span></summary>" + kids + "</details></li>";
      }
      return "<li>" + n.label + kids + "</li>";
    }
    document.getElementById("tree-root").innerHTML = '<ul class="tree">' + html(root, 0) + "</ul>";
  }

  // ---------- index: searched on the server (/api/taxa) ----------
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

  function query() {
    var p = [];
    function add(k, v) { if (v !== "" && v != null) p.push(k + "=" + encodeURIComponent(v)); }
    add("q", document.getElementById("index-q").value.trim());
    if (filter !== "all") add("group", filter);
    add("rank", document.getElementById("f-rank").value);
    add("minLength", document.getElementById("f-min").value);
    add("maxLength", document.getElementById("f-max").value);
    add("country", document.getElementById("f-country").value);
    if (document.getElementById("f-photo").checked) add("hasImage", "true");
    return p.join("&");
  }

  var lastItems = [], seq = 0, timer = null;
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
    var mine = ++seq;
    fetch(App.base + "api/taxa?" + query(), { headers: { Accept: "application/json" } })
      .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(function (data) { if (mine !== seq) return; lastItems = data.items; drawResults(); })
      .catch(function () { if (mine === seq) document.getElementById("index-count").textContent = t("filter.error"); });
  }
  function searchSoon() { clearTimeout(timer); timer = setTimeout(search, 200); }

  document.getElementById("index-q").addEventListener("input", searchSoon);
  document.getElementById("index-filters").addEventListener("input", searchSoon);
  document.getElementById("index-filters").addEventListener("change", searchSoon);
  document.getElementById("f-reset").addEventListener("click", function () { setTimeout(search, 0); });
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
    renderGroups();
    renderTree();
    renderFilter();
    renderCountries();
    drawResults();
    App.observeReveals();
  }

  App.setNav([["#groups", "nav.groups"], ["#tree", "nav.tree"], ["#size", "nav.size"], ["#index", "nav.index"]]);
  document.addEventListener("langchange", render);
  render();
  search();

  // Largest taxon of each genus by default.
  var chosen = BP.genera.map(function (g) {
    return App.taxaOf(g.id).filter(App.maxMale).sort(function (a, b) { return App.maxMale(b) - App.maxMale(a); })[0];
  }).filter(Boolean).map(function (x) { return x.id; });
  window.BPSize.mount({ stage: "size-stage", species: "size-species", objects: "size-objects", legend: "size-legend" }, { taxa: BP.taxa, chosen: chosen });
})();
