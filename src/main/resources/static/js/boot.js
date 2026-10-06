/*
 * Loads the data from the server (/api/bootstrap) into window.BP, then runs the
 * page's scripts in order. Each page includes:
 *
 *   <script src="js/boot.js" data-scripts="js/main.js js/map.js js/genus.js"></script>
 *
 * window.BP has the shape the scripts were written for: baseTaxonomy, groups,
 * genera, taxa (with genus and group ids), countries, areas, sources, maps.
 * Texts carry Japanese inline ({ ko, en, ja }).
 */
(function () {
  "use strict";

  var me = document.currentScript;
  var base = document.body.getAttribute("data-base") || "";
  var scripts = (me.getAttribute("data-scripts") || "").split(/\s+/).filter(Boolean);

  function lang() {
    try {
      var saved = window.localStorage.getItem("beetlepedia-lang");
      if (saved === "ko" || saved === "en" || saved === "ja") return saved;
    } catch (e) { /* storage unavailable */ }
    return "ko";
  }

  function fail(err) {
    var strings = window.I18N && window.I18N["load.error"];
    var msg = strings ? strings[lang()] || strings.ko : "Could not load the data.";
    var main = document.getElementById("main");
    if (main) {
      main.innerHTML = '<section class="section"><div class="container"><div class="pending-box" role="alert"><p></p><p class="note"></p></div></div></section>';
      main.querySelector("p").textContent = msg;
      main.querySelector(".note").textContent = String(err && err.message || err);
    }
    document.documentElement.classList.remove("no-js");
    if (window.console) console.error("Beetlepedia: could not load /api/bootstrap", err);
  }

  // Scripts added with async = false run in the order they are added.
  function run() {
    scripts.forEach(function (src) {
      var s = document.createElement("script");
      s.src = base + src;
      s.async = false;
      document.body.appendChild(s);
    });
  }

  // Only what the page needs: one genus in full for genus and taxon pages, summaries elsewhere.
  var page = document.body.getAttribute("data-page");
  var m = /[?&]id=([^&#]*)/.exec(window.location.search);
  var id = m ? m[1] : "";
  var SUMMARY = "api/bootstrap?scope=summary";
  var url = page === "genus" && id ? "api/bootstrap?genus=" + id
    : page === "taxon" && id ? "api/bootstrap?taxon=" + id
    : SUMMARY;

  function load(path) {
    return fetch(base + path, { headers: { Accept: "application/json" } }).then(function (res) {
      // Unknown id: load the summary so the page can say "not found" itself.
      if (res.status === 404 && path !== SUMMARY) return load(SUMMARY);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  load(url)
    .then(function (data) {
      window.BP = data;
      run();
    })
    .catch(fail);
})();
