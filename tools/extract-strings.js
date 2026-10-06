#!/usr/bin/env node
/*
 * Lists every bilingual {ko, en} text in the data files, grouped by file.
 * Usage: node tools/extract-strings.js [--missing-ja] [--json]
 *   --missing-ja  only texts without a Japanese entry in data/ja/*.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const STATIC = path.join(__dirname, "..", "src", "main", "resources", "static");

function strings(file) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  const src = fs.readFileSync(path.join(STATIC, file), "utf8");
  let root;
  if (/^BP\.registerGenus\(/m.test(src)) { ctx.BP = { registerGenus: (g) => { root = g; } }; vm.runInContext(src, ctx); }
  else { vm.runInContext(src, ctx); root = ctx.window.BP; }
  const out = new Map();
  (function walk(o) {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(walk);
    if (typeof o.ko === "string" && typeof o.en === "string" && o.en) out.set(o.en, o.ko);
    Object.values(o).forEach(walk);
  })(root);
  return out;
}
function jaDict() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  const dir = path.join(STATIC, "data", "ja");
  if (fs.existsSync(dir)) fs.readdirSync(dir).filter((f) => f.endsWith(".js")).forEach((f) => vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx));
  return ctx.window.BP_JA || {};
}
const files = ["data/core.js"].concat(fs.readdirSync(path.join(STATIC, "data", "genera")).filter((f) => f.endsWith(".js")).sort().map((f) => "data/genera/" + f));
const missingOnly = process.argv.includes("--missing-ja");
const ja = jaDict();
const result = {};
files.forEach((f) => {
  const m = strings(f);
  result[f] = [...m.entries()].filter(([en]) => !missingOnly || !ja[en]).map(([en, ko]) => ({ en, ko }));
});
if (process.argv.includes("--json")) console.log(JSON.stringify(result, null, 1));
else Object.entries(result).forEach(([f, l]) => console.log(f + ": " + l.length + " texts, " + l.reduce((s, x) => s + x.en.length, 0) + " chars (en)"));
if (missingOnly && Object.values(result).some((l) => l.length)) process.exitCode = 1;
