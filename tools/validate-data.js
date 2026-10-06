#!/usr/bin/env node
/*
 * Checks the Beetlepedia data files for broken references.
 * Usage: node tools/validate-data.js
 *
 * - every genus belongs to a known group and names a known region map
 * - taxon ids are unique; colours, names and sizes are well-formed
 * - every distribution code is a country or an area, and matches at least one polygon of the genus map
 * - every source id used by a taxon, issue or weight exists
 * - every image has a file, author, licence and alt text in both languages
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const STATIC = path.join(__dirname, "..", "src", "main", "resources", "static");
const ctx = { window: {}, console };
ctx.BP = undefined;
vm.createContext(ctx);
function load(rel) { vm.runInContext(fs.readFileSync(path.join(STATIC, rel), "utf8"), ctx, { filename: rel }); }

load("data/i18n.js");
load("data/core.js");
ctx.BP = ctx.window.BP;
fs.readdirSync(path.join(STATIC, "data", "genera")).filter((f) => f.endsWith(".js")).sort()
  .forEach((f) => load("data/genera/" + f));
const MAP_DIR = path.join(STATIC, "assets", "maps");
if (fs.existsSync(MAP_DIR)) fs.readdirSync(MAP_DIR).filter((f) => f.endsWith(".js")).forEach((f) => load("assets/maps/" + f));

const BP = ctx.window.BP, MAPS = ctx.window.BP_MAPS || {};
const errors = [];
const haveMaps = Object.keys(MAPS).length > 0;
if (!haveMaps) console.warn("! no region maps found — skipping map checks");
const err = (where, msg) => errors.push(where + ": " + msg);
const bi = (o) => o && typeof o.ko === "string" && o.ko && typeof o.en === "string" && o.en;

function inBox(p, b) { return p.lon >= b[0] && p.lon <= b[2] && p.lat >= b[1] && p.lat <= b[3]; }
function matches(p, code) {
  const area = BP.areas[code];
  if (!area) return p.iso === code;
  if (!area.countries.includes(p.iso)) return false;
  if (area.box && !inBox(p, area.box)) return false;
  return !(area.exclude || []).some((b) => inBox(p, b));
}
function checkSources(where, ids) {
  (ids || []).forEach((id) => { if (!BP.sources[id]) err(where, "unknown source '" + id + "'"); });
}
function checkImage(where, img) {
  ["file", "author", "license", "licenseUrl"].forEach((k) => { if (!img[k]) err(where, "image missing " + k); });
  if (!bi(img.alt)) err(where, "image " + img.file + " needs ko/en alt text");
}

Object.entries(BP.areas).forEach(([k, a]) => {
  if (!bi(a.name)) err("area " + k, "needs ko/en name");
  (a.countries || []).forEach((c) => { if (!BP.countries[c]) err("area " + k, "unknown country " + c); });
});

const ids = new Set();
BP.genera.forEach((g) => {
  const gw = "genus " + g.id;
  if (!BP.groups.some((x) => x.id === g.group)) err(gw, "unknown group " + g.group);
  if (haveMaps && !MAPS[g.map]) err(gw, "unknown map " + g.map);
  if (!bi(g.name)) err(gw, "needs ko/en name");
  if (!g.taxa || !g.taxa.length) err(gw, "has no taxa");
  Object.values(g.images || {}).forEach((img) => checkImage(gw, img));
  (g.weights && g.weights.items || []).forEach((w) => checkSources(gw + " weights", w.sources));
  (g.sizeDefaults || []).forEach((id) => { if (!g.taxa.some((x) => x.id === id)) err(gw, "sizeDefaults has unknown id " + id); });
  Object.entries(g.speciesInfo || {}).forEach(([k, s]) => checkSources(gw + " speciesInfo " + k, s.sources));

  g.taxa.forEach((x) => {
    const w = x.id || "(no id)";
    if (ids.has(x.id)) err(w, "duplicate id");
    ids.add(x.id);
    if (!x.id.startsWith(g.id + "-")) err(w, "id should start with '" + g.id + "-'");
    if (!x.sci || !x.sci.startsWith(g.sci + " ")) err(w, "sci should start with genus name");
    if (!["species", "subspecies"].includes(x.rank)) err(w, "rank must be species or subspecies");
    if (x.rank === "subspecies" && x.sci.split(" ").length !== 3) err(w, "subspecies needs a trinomial");
    if (!/^#[0-9A-Fa-f]{6}$/.test(x.color || "")) err(w, "colour must be #RRGGBB");
    if (!x.name || (!x.name.ko && !x.name.en)) err(w, "needs a name");
    ["male", "female"].forEach((s) => {
      const r = x.size && x.size[s];
      if (r != null && !(Array.isArray(r) && r.length === 2 && r[1] > 0 && (r[0] == null || (r[0] > 0 && r[0] <= r[1])))) err(w, "bad " + s + " size " + JSON.stringify(r));
    });
    if (x.size) checkSources(w + " size", x.size.sources);
    checkSources(w, x.sources);
    (x.issues || []).forEach((is) => checkSources(w + " issue", is.sources));
    (x.images || []).forEach((img) => checkImage(w, img));
    const map = MAPS[g.map];
    (x.distribution || []).forEach((c) => {
      if (!BP.countries[c] && !BP.areas[c]) err(w, "unknown range code " + c);
      else if (BP.areas[c] && BP.areas[c].point) { const [lo, la] = BP.areas[c].point; if (!(lo >= -180 && lo <= 180 && la >= -90 && la <= 90)) err(w, "bad point for " + c); }
      else if (map && !map.paths.some((p) => matches(p, c))) err(w, "range code " + c + " matches nothing on map " + g.map);
    });
    if (!(x.distribution || []).length) err(w, "has no distribution");
  });
});

console.log(BP.groups.length + " groups, " + BP.genera.length + " genera, " + BP.taxa.length + " taxa, " +
  Object.keys(BP.sources).length + " sources, " + Object.keys(BP.areas).length + " areas");
if (errors.length) {
  errors.forEach((e) => console.error("✗ " + e));
  console.error(errors.length + " problem(s)");
  process.exit(1);
}
console.log("✓ data OK");
