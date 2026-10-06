/*
 * Group page (group.html?id=<group>): what the group is, its classification,
 * the genera covered and every species / subspecies under them.
 */
(function () {
  "use strict";

  var App = window.App;
  var t = App.t, L = App.L, esc = App.esc;
  var grp = App.group(App.param("id"));
  var main = document.getElementById("main");
  if (!grp) {
    main.innerHTML = '<section class="section"><div class="container"><h1>' + esc(t("detail.notFound")) +
      '</h1><p><a href="' + App.homeUrl() + '">← Beetlepedia</a></p></div></section>';
    return;
  }
  var genera = App.generaOf(grp.id);
  document.body.style.setProperty("--sp", grp.color);
  document.body.style.setProperty("--accent", grp.color);

  function render() {
    document.title = L(grp.name) + " (" + grp.sci + ") · Beetlepedia";
    var rows = window.BP.baseTaxonomy.concat(grp.taxonomy);
    var taxa = App.taxaOfGroup(grp.id);

    main.innerHTML =
      '<section class="detail-hero group-hero"><div class="container">' +
      '<div class="reveal">' + App.breadcrumbHTML([[App.homeUrl(), "Beetlepedia"], [null, esc(L(grp.name))]]) +
      '<span class="eyebrow">' + esc(grp.sci) + " " + esc(grp.authority) + "</span>" +
      "<h1>" + esc(L(grp.name)) + "</h1>" +
      '<p class="name-note big">' + App.sciText(L(grp.lead)) + "</p>" +
      '<ul class="hero-stats"><li><b>' + genera.length + "</b><span>" + esc(t("home.stat.genera")) + "</span></li>" +
      "<li><b>" + taxa.length + "</b><span>" + esc(t("home.stat.taxa")) + "</span></li></ul>" +
      "</div>" +
      '<div class="reveal"><div class="group-emblem">' + App.silhouetteSVG(grp.id) + "</div></div>" +
      "</div></section>" +

      '<section class="section" id="overview"><div class="container"><div class="grid-2">' +
      '<div class="prose reveal"><p class="big">' + App.sciText(L(grp.body)) + "</p>" +
      '<ol class="refs">' + (grp.sources || []).map(App.sourceItemHTML).join("") + "</ol></div>" +
      '<div class="reveal"><h3>' + esc(t("genus.taxTitle")) + '</h3><ol class="taxonomy">' + App.taxonomyHTML(rows, rows.length) + "</ol></div>" +
      "</div></div></section>" +

      '<section class="section alt" id="genera"><div class="container">' +
      '<div class="section-head reveal"><h2>' + esc(t("group.genera")) + '</h2><p class="lead">' + esc(t("group.generaLead")) + "</p></div>" +
      '<div class="genus-grid">' + genera.map(App.genusCardHTML).join("") + "</div>" +
      '<p class="note" style="margin-top:20px">' + esc(t("home.comingSoon")) + "</p>" +
      "</div></section>" +

      '<section class="section" id="species"><div class="container">' +
      '<div class="section-head reveal"><h2>' + esc(t("group.taxa")) + "</h2></div>" +
      genera.map(function (g) {
        return '<div class="species-block"><div class="species-block-head reveal"><h3><a href="' + App.genusUrl(g.id) + '"><em class="sci">' +
          esc(g.sci) + "</em></a> <small>" + esc(L(g.name)) + "</small></h3></div>" +
          '<div class="species-grid">' + App.taxaOf(g.id).map(App.taxonCardHTML).join("") + "</div></div>";
      }).join("") +
      "</div></section>";

    App.setNav([["#overview", "nav.overview"], ["#genera", "nav.genera"], ["#species", "nav.species"]]);
    App.observeReveals(main);
  }

  document.addEventListener("langchange", render);
  render();
})();
