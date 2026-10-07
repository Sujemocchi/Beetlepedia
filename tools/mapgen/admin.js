// First-level administrative regions (states / provinces) for the region maps, from Natural Earth
// ne_10m_admin_1_states_provinces (public domain). Each record carries its names (en / ko / ja), the island it lies on
// (for island countries) and a simplified outline; the pages show "region, island, country" on hover.
const ISLANDS = {
  // key: { names, points on land (lon, lat) — the 1:50m land polygon containing a point is that island }
  sumatra: { en: "Sumatra", ko: "수마트라섬", ja: "スマトラ島", at: [[101.5, 0]] },
  java: { en: "Java", ko: "자와섬", ja: "ジャワ島", at: [[110, -7.3]] },
  borneo: { en: "Borneo", ko: "보르네오섬", ja: "ボルネオ島", at: [[114, 0.5], [113.5, 2.5], [117, 5.5], [114.8, 4.7]] },
  sulawesi: { en: "Sulawesi", ko: "술라웨시섬", ja: "スラウェシ島", at: [[120.5, -2]] },
  newguinea: { en: "New Guinea", ko: "뉴기니섬", ja: "ニューギニア島", at: [[138, -4], [145, -6]] },
  bali: { en: "Bali", ko: "발리섬", ja: "バリ島", at: [[115.1, -8.4]] },
  lombok: { en: "Lombok", ko: "롬복섬", ja: "ロンボク島", at: [[116.3, -8.6]] },
  sumbawa: { en: "Sumbawa", ko: "숨바와섬", ja: "スンバワ島", at: [[117.5, -8.55], [118.3, -8.6], [117.0, -8.6]] },
  flores: { en: "Flores", ko: "플로레스섬", ja: "フローレス島", at: [[121, -8.6]] },
  sumba: { en: "Sumba", ko: "숨바섬", ja: "スンバ島", at: [[120, -9.7]] },
  timor: { en: "Timor", ko: "티모르섬", ja: "ティモール島", at: [[124.3, -9.6], [125.8, -8.8]] },
  halmahera: { en: "Halmahera", ko: "할마헤라섬", ja: "ハルマヘラ島", at: [[127.9, 1.3], [128.2, 0.6]] },
  seram: { en: "Seram", ko: "세람섬", ja: "セラム島", at: [[129.5, -3.1]] },
  buru: { en: "Buru", ko: "부루섬", ja: "ブル島", at: [[126.6, -3.4]] },
  bangka: { en: "Bangka", ko: "방카섬", ja: "バンカ島", at: [[106.1, -2.2]] },
  luzon: { en: "Luzon", ko: "루손섬", ja: "ルソン島", at: [[121, 16.5]] },
  mindanao: { en: "Mindanao", ko: "민다나오섬", ja: "ミンダナオ島", at: [[125, 7.5]] },
  mindoro: { en: "Mindoro", ko: "민도로섬", ja: "ミンドロ島", at: [[121, 13]] },
  palawan: { en: "Palawan", ko: "팔라완섬", ja: "パラワン島", at: [[118.6, 9.5]] },
  panay: { en: "Panay", ko: "파나이섬", ja: "パナイ島", at: [[122.5, 11.1]] },
  negros: { en: "Negros", ko: "네그로스섬", ja: "ネグロス島", at: [[123, 10]] },
  cebu: { en: "Cebu", ko: "세부섬", ja: "セブ島", at: [[123.9, 10.4]] },
  bohol: { en: "Bohol", ko: "보홀섬", ja: "ボホール島", at: [[124.2, 9.85]] },
  leyte: { en: "Leyte", ko: "레이테섬", ja: "レイテ島", at: [[124.8, 10.9]] },
  samar: { en: "Samar", ko: "사마르섬", ja: "サマール島", at: [[125, 12]] },
  newbritain: { en: "New Britain", ko: "뉴브리튼섬", ja: "ニューブリテン島", at: [[151, -5.5]] },
  newireland: { en: "New Ireland", ko: "뉴아일랜드섬", ja: "ニューアイルランド島", at: [[152.5, -4.3], [151.3, -2.95], [152.0, -3.7]] },
  bougainville: { en: "Bougainville", ko: "부건빌섬", ja: "ブーゲンビル島", at: [[155.3, -6.2]] },
  hainan: { en: "Hainan", ko: "하이난섬", ja: "海南島", at: [[109.7, 19.2]] },
  bioko: { en: "Bioko", ko: "비오코섬", ja: "ビオコ島", at: [[8.7, 3.5]] },
  unguja: { en: "Unguja (Zanzibar)", ko: "웅구자섬(잔지바르섬)", ja: "ウングジャ島（ザンジバル島）", at: [[39.3, -6.1]] },
  pemba: { en: "Pemba", ko: "펨바섬", ja: "ペンバ島", at: [[39.75, -5.2]] },
  saotome: { en: "São Tomé", ko: "상투메섬", ja: "サントメ島", at: [[6.6, 0.25]] },
  principe: { en: "Príncipe", ko: "프린시페섬", ja: "プリンシペ島", at: [[7.4, 1.6]] },
  hispaniola: { en: "Hispaniola", ko: "히스파니올라섬", ja: "イスパニョーラ島", at: [[-72.3, 19], [-70.5, 18.8]] },
  trinidad: { en: "Trinidad", ko: "트리니다드섬", ja: "トリニダード島", at: [[-61.3, 10.45]] },
  tobago: { en: "Tobago", ko: "토바고섬", ja: "トバゴ島", at: [[-60.7, 11.23]] },
  margarita: { en: "Margarita Island", ko: "마르가리타섬", ja: "マルガリータ島", at: [[-63.95, 11.0]] },
  // Provinces spread over several islands (assigned in admin-names.json, no land points)
  lessersunda: { en: "Lesser Sunda Islands", ko: "소순다 열도", ja: "小スンダ列島", at: [] },
  juventud: { en: "Isla de la Juventud", ko: "후벤투드섬", ja: "フベントゥ島", at: [[-82.8, 21.7]] }
};

// Corrections and gaps in Natural Earth's names, keyed "ISO3:name" (Natural Earth's local name).
const NAMES = require("./admin-names.json");

function inRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function centroid(ring) {
  let a = 0, x = 0, y = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    a += f; x += (ring[j][0] + ring[i][0]) * f; y += (ring[j][1] + ring[i][1]) * f;
  }
  return a ? [x / (3 * a), y / (3 * a)] : ring[0];
}

function distToRing(px, py, ring) {
  let best = 1e9;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x1, y1] = ring[j], [x2, y2] = ring[i], dx = x2 - x1, dy = y2 - y1;
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)));
  }
  return best;
}

/**
 * features: admin-1 GeoJSON features; R: region frame; proj: lon/lat → map units; land: [{ iso, ring }] (1:50m, lon/lat);
 * keepIso(iso): whether the country belongs on this map; overseas(iso, lon, lat): split-out territories;
 * simplifyRing(ring, tol) and area(ring) from the country builder. Returns { admin: [...], islands: {...}, missing: [...] }.
 */
function buildAdmin(features, R, proj, W, H, land, keepIso, overseas, simplifyRing, area) {
  const islandRings = {};
  Object.entries(ISLANDS).forEach(([key, isl]) => {
    islandRings[key] = isl.at.map(([lo, la]) => (land.find((l) => inRing(lo, la, l.ring)) || {}).ring).filter(Boolean);
  });
  const admin = [], usedIslands = {}, missing = [];
  const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
  features.forEach((f) => {
    const p = f.properties, g = f.geometry;
    if (!g || p.name == null) return; // unnamed zero-area placeholders (minor islands)
    const iso0 = p.adm0_a3 === "SDS" ? "SSD" : p.adm0_a3 === "SOL" ? "SOL" : p.adm0_a3;
    const lon = p.longitude, lat = p.latitude;
    if (lon < R.lon[0] - 1 || lon > R.lon[1] + 1 || lat < R.lat[0] - 1 || lat > R.lat[1] + 1) return;
    const iso = overseas(iso0, lon, lat);
    if (!keepIso(iso0)) return;
    const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
    let rings = [], largestLL = null, largestArea = 0;
    polys.forEach((poly) => {
      const outer = poly[0];
      let minLon = 1e9, maxLon = -1e9;
      outer.forEach(([lo]) => { minLon = Math.min(minLon, lo); maxLon = Math.max(maxLon, lo); });
      if (maxLon - minLon > 180) return;
      poly.forEach((r) => rings.push(r.map(proj)));
      const a = Math.abs(area(outer));
      if (a > largestArea) { largestArea = a; largestLL = outer; }
    });
    if (!rings.length) return;
    const largest = rings.reduce((a, b) => (Math.abs(area(b)) > Math.abs(area(a)) ? b : a));
    let kept = rings.map((r) => simplifyRing(r, R.adminTol)).filter((r) => r.length >= 3 && Math.abs(area(r)) > 0.5);
    // Small regions (islands such as Bioko) must not vanish: fall back to a finer outline of the largest part.
    if (!kept.length) kept = [simplifyRing(largest, 0.2)].filter((r) => r.length >= 3);
    if (!kept.length) kept = [largest];
    // Clip-free culling: skip regions whose outline lies entirely outside the frame.
    const xs = kept.flat().map((q) => q[0]), ys = kept.flat().map((q) => q[1]);
    if (Math.max(...xs) < 0 || Math.min(...xs) > W || Math.max(...ys) < 0 || Math.min(...ys) > H) return;

    const key = iso0 + ":" + p.name;
    const fix = NAMES[key] || {};
    const n = { en: fix.en || p.name_en || p.name, ko: fix.ko || p.name_ko || null, ja: fix.ja || p.name_ja || null };
    if (!n.ko || !n.ja) missing.push(key + " (" + n.en + ")" + (!n.ko ? " ko" : "") + (!n.ja ? " ja" : ""));
    // Which island: the centroid of the largest part (Natural Earth's label point is sometimes out at sea).
    let [qx, qy] = centroid(largestLL);
    if (!inRing(qx, qy, largestLL)) [qx, qy] = [lon, lat];
    let island = fix.island || null;
    if (!island) for (const [k, rs] of Object.entries(islandRings)) {
      if (rs.some((r) => inRing(qx, qy, r))) { island = k; break; }
    }
    // Label point just off the generalised 1:50m coast: take an island whose outline passes within ~10 km.
    if (!island) for (const [k, rs] of Object.entries(islandRings)) {
      if (rs.some((r) => distToRing(qx, qy, r) < 0.09)) { island = k; break; }
    }
    if (island && (norm(ISLANDS[island].en) === norm(n.en) || norm(ISLANDS[island].en) === norm(p.admin))) island = null;
    if (island) usedIslands[island] = { en: ISLANDS[island].en, ko: ISLANDS[island].ko, ja: ISLANDS[island].ja };

    const d = kept.map((r) => {
      let s = "M" + r[0][0].toFixed(1) + " " + r[0][1].toFixed(1) + "l", px = +r[0][0].toFixed(1), py = +r[0][1].toFixed(1);
      const parts = [];
      for (let i = 1; i < r.length; i++) {
        const x = +r[i][0].toFixed(1), y = +r[i][1].toFixed(1);
        parts.push(+(x - px).toFixed(1) + " " + +(y - py).toFixed(1));
        px = x; py = y;
      }
      return s + parts.join(" ").replace(/ -/g, "-") + "z";
    }).join("");
    // Compact record: [iso, outline, label lon, label lat, name en, name ko, name ja, island key] (0 = same as en / none)
    admin.push([iso, d, +lon.toFixed(2), +lat.toFixed(2), n.en, n.ko && n.ko !== n.en ? n.ko : 0, n.ja && n.ja !== n.en ? n.ja : 0, island || 0]);
  });
  const unresolved = Object.entries(islandRings).filter(([, rs]) => !rs.length).map(([k]) => k);
  return { admin, islands: usedIslands, missing, unresolved };
}

module.exports = { buildAdmin, ISLANDS };
