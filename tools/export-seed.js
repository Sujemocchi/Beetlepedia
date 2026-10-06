#!/usr/bin/env node
/*
 * Converts the JS data files (data/core.js, data/genera/*.js, data/ja/*.js) into the
 * JSON seed the server loads into the database (src/main/resources/seed).
 * Japanese from the overlay tables is merged into every { ko, en } text as `ja`,
 * and a taxon's `nameJa` becomes `name.ja`.
 *
 * Usage: node tools/export-seed.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const STATIC = path.join(ROOT, "src", "main", "resources", "static");
const OUT = path.join(ROOT, "src", "main", "resources", "seed");

const ctx = { window: {} };
vm.createContext(ctx);
const load = (rel) => vm.runInContext(fs.readFileSync(path.join(STATIC, rel), "utf8"), ctx, { filename: rel });
load("data/core.js");
ctx.BP = ctx.window.BP;
// Same order as the pages load them (index.html), which is the display order of the genera.
const genusFiles = [...fs.readFileSync(path.join(STATIC, "index.html"), "utf8").matchAll(/data\/genera\/([\w-]+\.js)/g)].map((m) => m[1]);
const genusSources = {};
genusFiles.forEach((f) => {
  // registerGenus merges sources/areas into BP; keep each genus' own copy as well
  const before = new Set(Object.keys(ctx.window.BP.sources));
  load("data/genera/" + f);
  const g = ctx.window.BP.genera[ctx.window.BP.genera.length - 1];
  genusSources[g.id] = Object.keys(ctx.window.BP.sources).filter((k) => !before.has(k) || (g.sources || {})[k]);
});
const jaDir = path.join(STATIC, "data", "ja");
if (fs.existsSync(jaDir)) fs.readdirSync(jaDir).filter((f) => f.endsWith(".js")).forEach((f) => load("data/ja/" + f));
const BP = ctx.window.BP;
const JA = ctx.window.BP_JA || {};

// Deep copy that adds `ja` to every { ko, en } text.
function withJa(o) {
  if (Array.isArray(o)) return o.map(withJa);
  if (!o || typeof o !== "object") return o;
  const out = {};
  for (const [k, v] of Object.entries(o)) out[k] = withJa(v);
  if (typeof o.ko === "string" && typeof o.en === "string" && o.ja == null && o.en && JA[o.en]) out.ja = JA[o.en];
  return out;
}

function taxonSeed(t) {
  const x = withJa(t);
  delete x.genus; // added by registerGenus
  delete x.group;
  if (x.name) {
    if (t.nameJa) x.name.ja = t.nameJa;
    else if (!x.name.ja && t.name && t.name.en && JA[t.name.en]) x.name.ja = JA[t.name.en];
  }
  delete x.nameJa;
  return x;
}

fs.mkdirSync(path.join(OUT, "genera"), { recursive: true });

const core = {
  baseTaxonomy: withJa(BP.baseTaxonomy),
  groups: withJa(BP.groups),
  countries: withJa(BP.countries),
  maps: withJa(BP.maps),
  // Sources not owned by any genus file (group sources, Natural Earth)
  sources: Object.fromEntries(Object.entries(BP.sources).filter(([k]) => !Object.values(genusSources).some((l) => l.includes(k))))
};
fs.writeFileSync(path.join(OUT, "core.json"), JSON.stringify(core, null, 2) + "\n");
console.log("core.json:", core.groups.length, "groups,", Object.keys(core.countries).length, "countries,", Object.keys(core.sources).length, "sources");

BP.genera.forEach((g, i) => {
  const seed = withJa(Object.assign({}, g, { taxa: undefined }));
  seed.sortOrder = i;
  seed.taxa = g.taxa.map(taxonSeed);
  seed.sources = Object.fromEntries(genusSources[g.id].map((k) => [k, BP.sources[k]]));
  seed.areas = withJa(g.areas || {});
  fs.writeFileSync(path.join(OUT, "genera", g.id + ".json"), JSON.stringify(seed, null, 2) + "\n");
  console.log("genera/" + g.id + ".json:", seed.taxa.length, "taxa,", Object.keys(seed.sources).length, "sources,", Object.keys(seed.areas).length, "areas");
});
