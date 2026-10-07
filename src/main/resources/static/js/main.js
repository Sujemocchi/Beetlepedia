/*
 * Shared behaviour for every page: language switching, header/footer,
 * navigation, scroll-reveal, image helpers and lookups in the classification
 * tree (group → genus → species → subspecies).
 * Depends on data/i18n.js and window.BP, which js/boot.js loads from /api/bootstrap before running this file.
 * Page scripts (home.js, group.js, genus.js, taxon.js) use the helpers exposed as window.App.
 */
(function () {
  "use strict";

  var BP = window.BP;
  var STRINGS = window.I18N;
  var LANG_KEY = "beetlepedia-lang";
  var LANGS = ["ko", "en", "ja"];
  var lang = "ko";

  var base = document.body.getAttribute("data-base") || "";
  var page = document.body.getAttribute("data-page") || "home";

  // ---------- language ----------
  try {
    var saved = window.localStorage.getItem(LANG_KEY) || window.localStorage.getItem("goliathus-lang");
    if (LANGS.indexOf(saved) !== -1) lang = saved;
  } catch (e) { /* storage unavailable: keep default */ }

  function t(key, vars) {
    var entry = STRINGS[key];
    var s = !entry ? key : entry[lang] != null ? entry[lang] : entry.en != null ? entry.en : entry.ko;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  function L(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    if (obj[lang] != null) return obj[lang];
    // A text without Japanese falls back to English, otherwise to Korean.
    if (lang === "ja") return obj.en || obj.ko;
    return obj.ko;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- lookups in the tree ----------
  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0] || null; }
  function group(id) { return byId(BP.groups, id); }
  function genus(id) { return byId(BP.genera, id); }
  function taxon(id) { return byId(BP.taxa, id); }
  function generaOf(groupId) { return BP.genera.filter(function (g) { return g.group === groupId; }); }
  function taxaOf(genusId) { return BP.taxa.filter(function (x) { return x.genus === genusId; }); }
  function taxaOfGroup(groupId) { return BP.taxa.filter(function (x) { return x.group === groupId; }); }
  // Binomial of a taxon ("Dynastes hercules lichyi" → "Dynastes hercules").
  function speciesName(x) { return x.species || x.sci.split(" ").slice(0, 2).join(" "); }
  // "Dynastes hercules lichyi" → "D. h. lichyi", "Goliathus regius" → "G. regius"
  function abbr(sci) {
    var p = sci.split(" ");
    if (p.length < 2) return sci;
    return p.map(function (w, i) { return i < p.length - 1 ? w.charAt(0) + "." : w; }).join(" ");
  }
  // Full classification ladder for a genus: shared ranks + group ranks + genus ranks.
  function ladder(g) {
    return BP.baseTaxonomy.concat(group(g.group).taxonomy, g.taxonomy || []);
  }

  // Range codes are ISO-3 country codes or keys of BP.areas (islands / regions).
  function areaName(code) {
    if (BP.areas[code]) return L(BP.areas[code].name);
    return BP.countries[code] ? L(BP.countries[code]) : code;
  }
  function rangeNames(x) { return (x.distribution || []).map(areaName); }

  // ---------- URLs ----------
  function param(name) {
    var m = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function homeUrl(hash) { return base + "index.html" + (hash ? "#" + hash : ""); }
  function groupUrl(id) { return base + "group.html?id=" + encodeURIComponent(id); }
  function genusUrl(id, hash) { return base + "genus.html?id=" + encodeURIComponent(id) + (hash ? "#" + hash : ""); }
  function taxonUrl(x) { return base + "taxon.html?id=" + encodeURIComponent(x.id); }

  // ---------- scientific names ----------
  // Every Latin name known to the data is wrapped in <em class="sci"> when it appears in free text.
  var sciRe = null;
  function buildSciRe() {
    var terms = {};
    function add(s) { if (s) terms[esc(s)] = 1; }
    BP.genera.forEach(function (g) {
      add(g.sci);
      (g.latin || []).forEach(add);
    });
    BP.taxa.forEach(function (x) {
      add(x.sci); add(abbr(x.sci));
      add(speciesName(x)); add(abbr(speciesName(x)));
      (x.subspecies || []).forEach(function (s) { add(s.sci); });
    });
    var list = Object.keys(terms).sort(function (a, b) { return b.length - a.length; })
      .map(function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    sciRe = new RegExp("(^|[^A-Za-z])(" + list.join("|") + ")(?![a-z])", "g");
  }
  function sciText(s) {
    if (!sciRe) buildSciRe();
    return esc(s).replace(sciRe, '$1<em class="sci">$2</em>');
  }

  function setLang(next) {
    lang = next;
    try { window.localStorage.setItem(LANG_KEY, next); } catch (e) { /* ignore */ }
    applyLang();
  }

  function applyLang() {
    document.documentElement.lang = lang;
    var titleKey = document.body.getAttribute("data-title-key");
    if (titleKey) document.title = t(titleKey);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-sci]").forEach(function (el) {
      el.innerHTML = sciText(t(el.getAttribute("data-i18n-sci")));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  // ---------- images (Wikimedia Commons) ----------
  function commonsSrc(file, width) {
    return "https://commons.wikimedia.org/wiki/Special:FilePath/" +
      encodeURIComponent(file.replace(/ /g, "_")) + "?width=" + (width || 1280);
  }
  function commonsPage(file) {
    return "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file.replace(/ /g, "_"));
  }
  function creditHTML(img) {
    return '<span class="credit">© ' + esc(img.author) + ' · <a href="' + esc(img.licenseUrl) +
      '" target="_blank" rel="noopener">' + esc(img.license) + '</a> · <a href="' + commonsPage(img.file) +
      '" target="_blank" rel="noopener">Wikimedia Commons</a>' +
      (img.cutout ? " · " + esc(t("img.cutout")) : "") + "</span>";
  }
  // A background-removed copy (tools/cutout) sits straight on the page; otherwise specimen photos shot on a
  // white background are shown whole on a light plate. Containers take the class from frameClass().
  function frameClass(img) {
    return !img ? "" : img.cutout ? " cutout" : img.white ? " plate" : "";
  }
  function imgHTML(img, opts) {
    opts = opts || {};
    var original = commonsSrc(img.file, opts.width);
    return '<img class="commons' + (img.cutout ? " cut" : img.white ? " on-white" : "") + '" src="' +
      (img.cutout ? base + "assets/images/" + esc(img.cutout) : original) + '"' +
      (img.cutout ? ' data-fallback="' + esc(original) + '"' + (img.white ? " data-white" : "") : "") +
      ' alt="' + esc(L(img.alt)) + '"' + (opts.eager ? "" : ' loading="lazy"') +
      (opts.priority ? ' fetchpriority="high"' : "") + ' decoding="async">';
  }
  function figureHTML(img, opts) {
    opts = opts || {};
    return '<figure class="figure' + frameClass(img) + '">' + imgHTML(img, opts) +
      (opts.noCaption ? "" : "<figcaption>" + creditHTML(img) + "</figcaption>") +
      "</figure>";
  }
  // A missing cut-out falls back to the original photo; any other image that fails becomes a labelled placeholder.
  document.addEventListener("error", function (ev) {
    var img = ev.target;
    if (!img || img.tagName !== "IMG" || !img.classList.contains("commons")) return;
    var fallback = img.getAttribute("data-fallback");
    if (fallback) {
      img.removeAttribute("data-fallback");
      img.classList.remove("cut");
      var frame = img.parentElement;
      if (frame) {
        frame.classList.remove("cutout");
        if (img.hasAttribute("data-white")) { frame.classList.add("plate"); img.classList.add("on-white"); }
      }
      img.src = fallback;
      return;
    }
    var box = document.createElement("div");
    box.className = "img-placeholder";
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", img.alt);
    box.textContent = t("img.missing") + " — " + img.alt;
    img.replaceWith(box);
  }, true);

  // ---------- silhouettes ----------
  // Each drawing fits a 100 × 160 box and spans y = 5 … 158, so it can be scaled to a body length.
  var LEGS = function (y1, y2, y3) {
    return '<path d="M28 ' + y1 + ' L14 ' + (y1 - 8) + ' L8 ' + (y1 - 22) + ' M27 ' + y2 + ' L10 ' + (y2 + 4) + ' L4 ' + (y2 + 18) +
      ' M27 ' + y3 + ' L12 ' + (y3 + 14) + ' L10 ' + (y3 + 36) + ' M72 ' + y1 + ' L86 ' + (y1 - 8) + ' L92 ' + (y1 - 22) +
      ' M73 ' + y2 + ' L90 ' + (y2 + 4) + ' L96 ' + (y2 + 18) + ' M73 ' + y3 + ' L88 ' + (y3 + 14) + ' L90 ' + (y3 + 36) +
      '" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
  };
  var SILHOUETTES = {
    // Goliath-type flower chafer with a Y-shaped head horn
    cetoniinae:
      '<g fill="currentColor">' +
      '<path d="M50 30 L50 17 M50 18 L41 5 M50 18 L59 5" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="50" cy="33" rx="11" ry="8"/>' +
      '<path d="M29 43 Q50 37 71 43 L75 69 Q50 76 25 69 Z"/>' +
      '<path d="M25 72 Q50 79 75 72 Q82 110 72 144 Q50 162 28 144 Q18 110 25 72 Z"/>' +
      LEGS(48, 62, 86) + "</g>",
    // Stag beetle with long, inward-curving mandibles
    lucanidae:
      '<g fill="currentColor">' +
      '<path d="M43 47 C31 39 27 22 39 5 M57 47 C69 39 73 22 61 5 M33 30 L38 29 M67 30 L62 29" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M33 45 Q50 39 67 45 L69 58 Q50 63 31 58 Z"/>' +
      '<path d="M29 61 Q50 56 71 61 L74 80 Q50 85 26 80 Z"/>' +
      '<path d="M27 83 Q50 88 73 83 Q78 118 69 147 Q50 162 31 147 Q22 118 27 83 Z"/>' +
      LEGS(66, 80, 98) + "</g>",
    // Hercules-type rhinoceros beetle: long thoracic horn over the head
    dynastinae:
      '<g fill="currentColor">' +
      '<path d="M46.5 60 Q45.5 30 48 9 Q50 3 52 9 Q54.5 30 53.5 60 Z"/>' +
      '<ellipse cx="50" cy="60" rx="9" ry="6"/>' +
      '<path d="M26 62 Q50 50 74 62 L77 86 Q50 92 23 86 Z"/>' +
      '<path d="M24 88 Q50 94 76 88 Q83 124 72 150 Q50 162 28 150 Q17 124 24 88 Z"/>' +
      LEGS(70, 86, 104) + "</g>"
  };
  function silhouette(groupId) { return SILHOUETTES[groupId] || SILHOUETTES.cetoniinae; }
  function silhouetteSVG(groupId, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 100 160" aria-hidden="true" focusable="false">' + silhouette(groupId) + "</svg>";
  }

  // ---------- header / footer ----------
  var nav, menuBtn;
  function renderChrome() {
    var header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML =
      '<div class="container">' +
      '<a class="brand" href="' + homeUrl() + '">' +
      '<svg viewBox="0 0 100 160" aria-hidden="true">' + SILHOUETTES.lucanidae + "</svg>" +
      '<span data-i18n="site.brand"></span></a>' +
      '<nav class="site-nav" id="site-nav" data-i18n-aria="nav.menu"><ul></ul></nav>' +
      '<div class="lang-toggle" role="group" data-i18n-aria="lang.label">' +
      '<button type="button" data-lang="ko" lang="ko">KO</button><span class="sep" aria-hidden="true"></span>' +
      '<button type="button" data-lang="en" lang="en">EN</button><span class="sep" aria-hidden="true"></span>' +
      '<button type="button" data-lang="ja" lang="ja">JA</button></div>' +
      '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" data-i18n-aria="nav.menu">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      "</div>";

    var skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main";
    skip.setAttribute("data-i18n", "nav.skip");

    document.body.insertBefore(header, document.body.firstChild);
    document.body.insertBefore(skip, document.body.firstChild);

    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = '<div class="container"><p data-i18n="footer.text"></p>' +
      '<p><a href="' + homeUrl() + '">Beetlepedia</a> · ' +
      BP.groups.map(function (g) { return '<a href="' + groupUrl(g.id) + '">' + esc(g.sci) + "</a>"; }).join(" · ") + "</p></div>";
    document.body.appendChild(footer);

    header.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });

    nav = header.querySelector(".site-nav");
    menuBtn = header.querySelector(".menu-btn");
    function closeMenu() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
    menuBtn.addEventListener("click", function () {
      var open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { closeMenu(); menuBtn.focus(); }
    });
  }

  /**
   * Fills the header navigation. items: [[href, i18nKey], …].
   * Links to "#id" on the same page also get scroll-spy highlighting.
   */
  var spy = null;
  function setNav(items) {
    nav.querySelector("ul").innerHTML = items.map(function (a) {
      return '<li><a href="' + esc(a[0]) + '" data-i18n="' + a[1] + '">' + esc(t(a[1])) + "</a></li>";
    }).join("");
    if (spy) spy.disconnect();
    if (!("IntersectionObserver" in window)) return;
    var links = {};
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (!a || !en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
        a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // Breadcrumb trail: [[href|null, html], …]
  function breadcrumbHTML(items) {
    return '<nav class="breadcrumb" aria-label="' + esc(t("nav.breadcrumb")) + '"><ol>' +
      items.map(function (it, i) {
        var last = i === items.length - 1;
        return "<li>" + (it[0] && !last ? '<a href="' + esc(it[0]) + '">' + it[1] + "</a>" : '<span aria-current="page">' + it[1] + "</span>") + "</li>";
      }).join("") + "</ol></nav>";
  }

  // ---------- scroll reveal ----------
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var observer = null;
  if (!reduceMotion && "IntersectionObserver" in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); observer.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  }
  function observeReveals(root) {
    (root || document).querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      if (observer) observer.observe(el); else el.classList.add("in");
    });
  }

  // ---------- shared HTML pieces ----------
  // Size ranges are [min, max] in mm; min may be null when only a maximum is published.
  function range(r) {
    if (!r) return t("species.noData");
    return (r[0] == null ? "≤ " + r[1] : r[0] + "–" + r[1]) + " mm";
  }
  function maxMale(x) { return x.size && x.size.male ? x.size.male[1] : null; }
  // Common name of a taxon in one language ("" if none).
  function taxonName(x, which) {
    which = which || lang;
    var nm = x.name || {};
    if (which !== "ja") return nm[which] || "";
    return nm.ja || "";
  }
  function nameHTML(x, which) {
    var n = taxonName(x, which);
    if (!n) return '<span class="dim">—</span>';
    var informal = x.nameInformal && x.nameInformal[which];
    return esc(n) + (informal ? ' <span class="tag">' + esc(t("species.informal")) + "</span>" : "");
  }
  function sourceItemHTML(id) {
    var s = BP.sources[id];
    if (!s) return "";
    return "<li>" + sciText(s.title) + (s.url ? ' — <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.url.replace(/^https?:\/\//, "")) + "</a>" : "") + "</li>";
  }
  function taxonomyHTML(rows, sciFrom) {
    return rows.map(function (r, i) {
      return '<li style="--i:' + i + '"><span class="rank">' + esc(L(r.rank)) + '</span><span class="taxon">' +
        (i >= sciFrom ? '<em class="sci">' + esc(r.name) + "</em>" : esc(r.name)) +
        (r.common ? "<small>" + esc(L(r.common)) + "</small>" : "") + "</span></li>";
    }).join("");
  }
  // Card for one taxon (genus page, group page, home index).
  function taxonCardHTML(x) {
    var img = x.images && x.images[0];
    var thumb = img
      ? '<div class="thumb' + frameClass(img) + '">' + imgHTML(img, { width: 640 }) + "</div>"
      : '<div class="thumb empty">' + silhouetteSVG(x.group) + "</div>";
    return '<a class="species-card reveal" href="' + taxonUrl(x) + '" style="--sp:' + x.color + '">' +
      '<span class="swatch" aria-hidden="true"></span>' + thumb +
      '<div class="body"><span class="rank-tag">' + esc(t("rank." + (x.rank || "species"))) + "</span>" +
      '<span class="sci">' + esc(x.sci) + '</span><span class="auth">' + esc(x.authority || "") + "</span>" +
      '<span class="kname">' + nameHTML(x, lang) + "</span>" +
      '<span class="meta"><span>♂ ' + range(x.size && x.size.male) + "</span><span>♀ " + range(x.size && x.size.female) + "</span></span>" +
      "</div></a>";
  }

  // Card for one genus (home page, group page).
  function genusCardHTML(g) {
    var img = g.images && (g.images.card || g.images.hero);
    var n = taxaOf(g.id).length;
    var longest = taxaOf(g.id).reduce(function (m, x) { return Math.max(m, maxMale(x) || 0); }, 0);
    return '<a class="genus-card reveal" href="' + genusUrl(g.id) + '" style="--sp:' + g.color + '">' +
      '<div class="thumb' + frameClass(img) + '">' +
      (img ? imgHTML(img, { width: 800 }) : silhouetteSVG(g.group)) + "</div>" +
      '<div class="body"><span class="rank-tag">' + esc(t("rank.genus")) + "</span>" +
      '<span class="sci">' + esc(g.sci) + '</span><span class="auth">' + esc(g.authority) + "</span>" +
      '<span class="kname">' + esc(L(g.name)) + "</span>" +
      '<span class="meta"><span>' + esc(t("count.taxa", { n: n })) + "</span>" +
      (longest ? "<span>♂ ≤ " + longest + " mm</span>" : "") +
      "<span>" + esc(L(BP.maps[g.map] && BP.maps[g.map].name)) + "</span></span>" +
      "</div></a>";
  }

  // ---------- public API for the page scripts ----------
  window.App = {
    t: t, L: L, esc: esc, sciText: sciText,
    lang: function () { return lang; },
    page: page, base: base, param: param,
    group: group, genus: genus, taxon: taxon, generaOf: generaOf, taxaOf: taxaOf, taxaOfGroup: taxaOfGroup,
    speciesName: speciesName, abbr: abbr, ladder: ladder, areaName: areaName, rangeNames: rangeNames,
    homeUrl: homeUrl, groupUrl: groupUrl, genusUrl: genusUrl, taxonUrl: taxonUrl,
    commonsSrc: commonsSrc, commonsPage: commonsPage, creditHTML: creditHTML, imgHTML: imgHTML, figureHTML: figureHTML, frameClass: frameClass,
    silhouette: silhouette, silhouetteSVG: silhouetteSVG,
    setNav: setNav, breadcrumbHTML: breadcrumbHTML, observeReveals: observeReveals,
    range: range, maxMale: maxMale, taxonName: taxonName, nameHTML: nameHTML, sourceItemHTML: sourceItemHTML,
    taxonomyHTML: taxonomyHTML, taxonCardHTML: taxonCardHTML, genusCardHTML: genusCardHTML
  };

  // ---------- boot ----------
  document.documentElement.classList.remove("no-js");
  renderChrome();
  applyLang();
  observeReveals();
})();
