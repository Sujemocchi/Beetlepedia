// Builds simplified equirectangular region maps from world-atlas countries-50m (Natural Earth, public domain),
// plus first-level administrative regions from Natural Earth ne_10m_admin_1_states_provinces (see admin.js).
// Usage: node gen.js <countries-50m.json> <outDir> [ne_10m_admin_1_states_provinces.geojson]
const fs = require("fs");
const path = require("path");
const { buildAdmin } = require("./admin");
const topo = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const outDir = process.argv[3];
const admin1 = process.argv[4] ? JSON.parse(fs.readFileSync(process.argv[4], "utf8")).features : null;
// Country names (en / ko / ja) from ne_50m_admin_0_countries (admin0.geojson next to the admin-1 file), for hover labels.
const admin0 = process.argv[4] ? JSON.parse(fs.readFileSync(path.join(path.dirname(process.argv[4]), "admin0.geojson"), "utf8")).features : [];
const COUNTRY = {};
admin0.forEach((c) => { const p = c.properties; COUNTRY[p.ADM0_A3] = COUNTRY[p.ADM0_A3] || [p.NAME_EN, p.NAME_KO, p.NAME_JA]; });
COUNTRY.SSD = COUNTRY.SDS;
// Populated places (ne_10m_populated_places, places-full.geojson next to the admin-1 file): shown at the closest zoom.
const PLACES = process.argv[4] ? JSON.parse(fs.readFileSync(path.join(path.dirname(process.argv[4]), "places-full.geojson"), "utf8")).features : [];

const NUM = {
  // Africa
  "012":"DZA","024":"AGO","204":"BEN","072":"BWA","854":"BFA","108":"BDI","120":"CMR","140":"CAF","148":"TCD","174":"COM",
  "178":"COG","180":"COD","384":"CIV","262":"DJI","818":"EGY","226":"GNQ","232":"ERI","748":"SWZ","231":"ETH","266":"GAB",
  "270":"GMB","288":"GHA","324":"GIN","624":"GNB","404":"KEN","426":"LSO","430":"LBR","434":"LBY","450":"MDG","454":"MWI",
  "466":"MLI","478":"MRT","504":"MAR","508":"MOZ","516":"NAM","562":"NER","566":"NGA","646":"RWA","678":"STP","686":"SEN",
  "694":"SLE","706":"SOM","710":"ZAF","728":"SSD","729":"SDN","834":"TZA","768":"TGO","788":"TUN","800":"UGA","732":"ESH",
  "894":"ZMB","716":"ZWE",
  // Asia / Oceania
  "356":"IND","050":"BGD","064":"BTN","524":"NPL","144":"LKA","104":"MMR","764":"THA","418":"LAO","116":"KHM","704":"VNM",
  "458":"MYS","702":"SGP","096":"BRN","360":"IDN","608":"PHL","626":"TLS","598":"PNG","090":"SLB","036":"AUS","158":"TWN",
  "156":"CHN","344":"HKG","446":"MAC","392":"JPN","410":"KOR","408":"PRK","585":"PLW","548":"VUT","540":"NCL","316":"GUM",
  "580":"MNP","583":"FSM",
  // Americas
  "484":"MEX","320":"GTM","084":"BLZ","222":"SLV","340":"HND","558":"NIC","188":"CRI","591":"PAN","170":"COL","862":"VEN",
  "218":"ECU","604":"PER","068":"BOL","076":"BRA","328":"GUY","740":"SUR","600":"PRY","032":"ARG","152":"CHL","858":"URY",
  "192":"CUB","388":"JAM","332":"HTI","214":"DOM","630":"PRI","044":"BHS","780":"TTO","212":"DMA","662":"LCA","670":"VCT",
  "308":"GRD","052":"BRB","028":"ATG","659":"KNA","533":"ABW","531":"CUW","840":"USA","850":"VIR","092":"VGB","660":"AIA",
  "500":"MSR","136":"CYM","796":"TCA","652":"BLM","663":"MAF","534":"SXM",
  // Europe (overseas territories in the frames)
  "250":"FRA","528":"NLD","826":"GBR","060":"BMU","620":"PRT","724":"ESP"
};

const AFRICA = new Set(["DZA","AGO","BEN","BWA","BFA","BDI","CMR","CAF","TCD","COM","COG","COD","CIV","DJI","EGY","GNQ","ERI","SWZ","ETH","GAB","GMB","GHA","GIN","GNB","KEN","LSO","LBR","LBY","MDG","MWI","MLI","MRT","MAR","MOZ","NAM","NER","NGA","RWA","STP","SEN","SLE","SOM","ZAF","SSD","SDN","TZA","TGO","TUN","UGA","ESH","ZMB","ZWE","SOL"]);

const REGIONS = [
  // adminTol: simplification tolerance (map units) for the administrative outlines; cities: how many places to keep
  { id: "africa", lon: [-19, 53], lat: [-36, 38], k: 9.6, adminTol: 1.3, cities: 360, keep: (iso) => AFRICA.has(iso) },
  { id: "southeast-asia", lon: [88, 162], lat: [-14, 27], k: 9, adminTol: 1.1, cities: 360, keep: () => true },
  { id: "neotropics", lon: [-118, -33], lat: [-28, 33], k: 8, adminTol: 1.1, cities: 320, keep: (iso) => iso !== "N010" }
];

// ---- TopoJSON decoding ----
const { scale, translate } = topo.transform;
const arcs = topo.arcs.map((arc) => {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * scale[0] + translate[0], y * scale[1] + translate[1]]; });
});
function arcPts(i) { return i >= 0 ? arcs[i] : arcs[~i].slice().reverse(); }
function ring(idx) {
  const pts = [];
  idx.forEach((i, n) => { const a = arcPts(i); pts.push(...(n ? a.slice(1) : a)); });
  return pts;
}
function polygons(g) {
  if (g.type === "Polygon") return [g.arcs.map(ring)];
  if (g.type === "MultiPolygon") return g.arcs.map((p) => p.map(ring));
  return [];
}

// French overseas departments are part of France in Natural Earth admin-0; split them out by location.
function overseas(iso, lon, lat) {
  if (iso !== "FRA") return iso;
  if (lon > -55 && lon < -51 && lat > 2 && lat < 6) return "GUF";
  if (lon > -62 && lon < -60.9 && lat > 15.8 && lat < 16.6) return "GLP";
  if (lon > -61.3 && lon < -60.7 && lat > 14.3 && lat < 15) return "MTQ";
  if (lon > 54 && lon < 56 && lat > -22 && lat < -20) return "REU";
  if (lon > 44 && lon < 46 && lat > -13.2 && lat < -12.5) return "MYT";
  return iso;
}

// Ramer–Douglas–Peucker
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0, idx = -1;
    const [x1, y1] = pts[a], [x2, y2] = pts[b];
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
      if (d > max) { max = d; idx = i; }
    }
    if (max > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

function simplifyRing(pts, tol) {
  if (pts.length < 8) return pts;
  const m = Math.floor(pts.length / 2);
  const a = simplify(pts.slice(0, m + 1), tol), b = simplify(pts.slice(m), tol);
  return a.concat(b.slice(1));
}
function area(r) { let s = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) s += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]); return s / 2; }

// All 1:50m land polygons (lon/lat) — used to tell which island an administrative region lies on.
const LAND = [];
topo.objects.countries.geometries.forEach((g) => {
  const iso = g.id && NUM[g.id] ? NUM[g.id] : "N" + (g.id || g.properties.name);
  polygons(g).forEach((poly) => LAND.push({ iso, ring: poly[0] }));
});

REGIONS.forEach((R) => {
  const W = Math.round((R.lon[1] - R.lon[0]) * R.k), H = Math.round((R.lat[1] - R.lat[0]) * R.k);
  const proj = ([lon, lat]) => [(lon - R.lon[0]) * R.k, (R.lat[1] - lat) * R.k];
  const out = [];
  topo.objects.countries.geometries.forEach((g) => {
    const baseIso = g.id && NUM[g.id] ? NUM[g.id] : g.properties.name === "Somaliland" ? "SOL" : "N" + (g.id || g.properties.name);
    if (!R.keep(baseIso)) return;
    polygons(g).forEach((poly) => {
      const outer = poly[0];
      // centroid (lon/lat average of outer ring is enough for area lookups)
      let lonS = 0, latS = 0; outer.forEach((p) => { lonS += p[0]; latS += p[1]; });
      const clon = lonS / outer.length, clat = latS / outer.length;
      // Skip parts entirely outside the frame (with margin)
      let minLon = 1e9, maxLon = -1e9, minLat = 1e9, maxLat = -1e9;
      outer.forEach(([lo, la]) => { minLon = Math.min(minLon, lo); maxLon = Math.max(maxLon, lo); minLat = Math.min(minLat, la); maxLat = Math.max(maxLat, la); });
      if (maxLon - minLon > 180) return;
      if (maxLon < R.lon[0] - 1 || minLon > R.lon[1] + 1 || maxLat < R.lat[0] - 1 || minLat > R.lat[1] + 1) return;
      const iso = overseas(baseIso, clon, clat);
      const rings = poly.map((r) => simplifyRing(r.map(proj), 0.4)).filter((r) => r.length >= 3 && Math.abs(area(r)) > 0.15);
      if (!rings.length) {
        // Very small island: keep a tiny triangle-free point marker so the place can still be highlighted.
        const [x, y] = proj([clon, clat]);
        if (x < 0 || x > W || y < 0 || y > H) return;
        out.push({ iso, name: g.properties.name, d: "", cx: +x.toFixed(1), cy: +y.toFixed(1), lon: +clon.toFixed(2), lat: +clat.toFixed(2), tiny: 1 });
        return;
      }
      const d = rings.map((r) => "M" + r.map(([x, y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + "Z").join("");
      const xs = rings[0].map((p) => p[0]), ys = rings[0].map((p) => p[1]);
      const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
      const [cx, cy] = proj([clon, clat]);
      const rec = { iso, name: g.properties.name, d, cx: +cx.toFixed(1), cy: +cy.toFixed(1), lon: +clon.toFixed(2), lat: +clat.toFixed(2) };
      if (Math.max(bw, bh) < 5) rec.tiny = 1;
      out.push(rec);
    });
  });
  const data = { viewBox: "0 0 " + W + " " + H, projection: { lon0: R.lon[0], lat0: R.lat[1], k: R.k }, paths: out };
  if (admin1) {
    const keepIso = (iso) => R.keep(iso === "SOL" ? "SOL" : iso);
    const a = buildAdmin(admin1, R, proj, W, H, LAND, keepIso, overseas, simplifyRing, area);
    data.admin = a.admin;
    data.islands = a.islands;
    // [en, ko, ja] for every country on the map; pages prefer the curated names in BP.countries.
    data.countries = {};
    out.map((p) => [p.iso, p.name]).concat(a.admin.map((r) => [r[0], null])).forEach(([iso, name]) => {
      if (!data.countries[iso]) data.countries[iso] = COUNTRY[iso] || (name ? [name, name, name] : undefined);
    });
    Object.keys(data.countries).forEach((k) => { if (!data.countries[k]) delete data.countries[k]; });
    // Cities, largest first (the page labels them in this order and skips overlaps): [en, ko, ja, x, y, capital]
    data.cities = PLACES.filter((c) => {
      const p = c.properties, lon = p.LONGITUDE, lat = p.LATITUDE;
      return lon >= R.lon[0] && lon <= R.lon[1] && lat >= R.lat[0] && lat <= R.lat[1] && R.keep(p.ADM0_A3 === "SDS" ? "SSD" : p.ADM0_A3);
    }).sort((a, b) => (b.properties.ADM0CAP - a.properties.ADM0CAP) * 1e9 + b.properties.POP_MAX - a.properties.POP_MAX)
      .slice(0, R.cities)
      .sort((a, b) => b.properties.POP_MAX - a.properties.POP_MAX)
      .map((c) => {
        const p = c.properties, en = p.NAME_EN || p.NAME, [x, y] = proj([p.LONGITUDE, p.LATITUDE]);
        return [en, p.NAME_KO && p.NAME_KO !== en ? p.NAME_KO : 0, p.NAME_JA && p.NAME_JA !== en ? p.NAME_JA : 0, +x.toFixed(1), +y.toFixed(1), p.ADM0CAP ? 1 : 0];
      });
    fs.writeFileSync(path.join(__dirname, ".cache", "missing-names-" + R.id + ".txt"), a.missing.join("\n") + "\n");
    console.log(R.id, a.admin.length, "admin regions,", Object.keys(a.islands).length, "islands,", a.missing.length, "names missing (see .cache)");
    if (a.unresolved.length) console.log("  island points not on land:", a.unresolved.join(", "));
  }
  const js = "/* Generated by mapgen — Natural Earth 1:50m (public domain) via world-atlas 2.0.2 (ISC). Equirectangular, simplified. */\n" +
    "window.BP_MAPS = window.BP_MAPS || {};\nwindow.BP_MAPS[" + JSON.stringify(R.id) + "] = " + JSON.stringify(data) + ";\n";
  fs.writeFileSync(path.join(outDir, R.id + ".js"), js);
  console.log(R.id, W + "x" + H, out.length, "paths", (js.length / 1024).toFixed(0) + " KB");
});
