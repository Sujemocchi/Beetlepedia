// Browser checks against a running server (default http://localhost:8080).
//   node e2e/run.mjs            — CI uses Playwright's Chromium
//   E2E_CHANNEL=chrome node …   — use the locally installed Chrome instead
//
// 1. Every page (home, groups, genera, taxa, unknown ids) at 1280 px and 375 px in KO / EN / JA:
//    no page errors or console errors, no horizontal overflow.
// 2. The home page search UI, and the map (zoom levels, drag, click popup).
// 3. The admin screen: login, a rejected save, a successful save (needs E2E_ADMIN_PASSWORD).
import { chromium } from "playwright";

const BASE = (process.env.E2E_BASE || "http://localhost:8080").replace(/\/$/, "");
const failures = [];
const fail = (msg) => { failures.push(msg); console.log("FAIL " + msg); };

const browser = await chromium.launch(process.env.E2E_CHANNEL ? { channel: process.env.E2E_CHANNEL } : {});

// ---------- 1. pages ----------
const summary = await (await fetch(BASE + "/api/bootstrap?scope=summary")).json();
const pages = [
  "index.html",
  ...summary.groups.map((g) => "group.html?id=" + g.id),
  ...summary.genera.map((g) => "genus.html?id=" + g.id),
  ...summary.taxa.map((t) => "taxon.html?id=" + t.id),
  "taxon.html?id=nope",
  "genus.html?id=nope",
];
let checked = 0;
for (const lang of ["ko", "en", "ja"]) {
  for (const width of [1280, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.addInitScript((l) => { try { localStorage.setItem("beetlepedia-lang", l); } catch (e) { /* ignore */ } }, lang);
    const page = await context.newPage();
    let errors = [];
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::/.test(m.text())) errors.push("console: " + m.text()); });
    // Photos come from Wikimedia Commons; the checks do not need them.
    await page.route(/commons\.wikimedia\.org|fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
    for (const p of pages) {
      errors = [];
      await page.goto(BASE + "/" + p, { waitUntil: "load" });
      // Rendered: boot.js has loaded the data and the page scripts have filled #main.
      await page.waitForFunction(() => window.App && document.querySelector("#main").children.length > 0, null, { timeout: 15000 });
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const htmlLang = await page.evaluate(() => document.documentElement.lang);
      if (overflow > 0) errors.push("horizontal overflow " + overflow + "px");
      if (htmlLang !== lang) errors.push("html lang is " + htmlLang);
      errors.forEach((e) => fail(`${p} [${width}px ${lang}] ${e}`));
      checked++;
    }
    await context.close();
  }
}
console.log(`pages: ${checked} checked`);

// ---------- 2. search UI ----------
{
  const page = await browser.newPage();
  await page.goto(BASE + "/index.html");
  const rows = async () => { await page.waitForTimeout(700); return page.locator("#index-list li").count(); };
  const expect = async (label, want) => { const got = await rows(); if (got !== want) fail(`search ${label}: ${got} rows, expected ${want}`); };
  const visible = async (sel) => page.locator(sel).isVisible();
  // Nothing is listed until a query or filter is set; the explorer shows instead.
  await expect("initial", 0);
  if (await visible("#index-results") || !(await visible("#explorer"))) fail("search initial: results shown or explorer hidden");
  await page.fill("#index-q", "hercules");
  await expect("q=hercules", summary.taxa.filter((t) => t.sci.includes("hercules")).length);
  if (!(await visible("#index-results")) || await visible("#explorer")) fail("search q=hercules: results hidden or explorer shown");
  await page.click("#index-clear");
  await expect("cleared", 0);
  if (!(await visible("#explorer"))) fail("search cleared: explorer not back");
  await page.click("#filter-panel > summary");
  await page.fill("#f-min", "150");
  await expect("min 150", summary.taxa.filter((t) => t.size.male && t.size.male[1] >= 150).length);
  await page.click("#f-reset");
  await page.check("#f-photo");
  await expect("with photo", summary.taxa.filter((t) => t.images.length > 0).length);
  await page.click("#f-reset");
  await page.selectOption("#f-rank", "subspecies");
  await expect("subspecies", summary.taxa.filter((t) => t.rank === "subspecies").length);
  await page.close();
  console.log("search UI: checked");
}

// ---------- 2a. hierarchy explorer: group → genus → species → subspecies, and back ----------
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + "/index.html");
  await page.waitForSelector("#ex-panel .ex-card");
  const cards = () => page.locator("#ex-panel .ex-card").count();
  const want = async (label, n) => { const got = await cards(); if (got !== n) fail(`explorer ${label}: ${got} cards, expected ${n}`); };
  await want("groups", summary.groups.length);
  await page.click('#ex-panel button[data-key="dynastinae"]');
  await want("dynastinae genera", summary.genera.filter((g) => g.group === "dynastinae").length);
  await page.click('#ex-panel button[data-key="dynastes"]');
  const dyn = summary.taxa.filter((t) => t.genus === "dynastes");
  const species = new Set(dyn.map((t) => t.sci.split(" ").slice(0, 2).join(" ")));
  await want("dynastes species", species.size);
  await page.click('#ex-panel button[data-key="Dynastes hercules"]');
  await want("hercules subspecies", dyn.filter((t) => t.sci.startsWith("Dynastes hercules ")).length);
  if (!page.url().includes("#explore=dynastinae%2Fdynastes%2FDynastes%20hercules")) fail("explorer: hash not updated: " + page.url());
  await page.goBack();
  await page.waitForTimeout(300);
  await want("back to dynastes species", species.size);
  await page.click('#ex-crumbs button[data-depth="0"]');
  await want("crumb to groups", summary.groups.length);
  // A deep link opens the explorer at that level.
  await page.goto(BASE + "/index.html#explore=lucanidae/cyclommatus");
  await page.reload();
  await page.waitForSelector("#ex-panel .ex-card");
  await want("deep link cyclommatus", new Set(summary.taxa.filter((t) => t.genus === "cyclommatus").map((t) => t.sci.split(" ").slice(0, 2).join(" "))).size);
  // Leaves link to taxon pages.
  const href = await page.locator("#ex-panel a.ex-card").first().getAttribute("href");
  if (!href || !href.startsWith("taxon.html?id=")) fail("explorer: leaf link " + href);
  await page.close();
  console.log("explorer: checked");
}

// ---------- 2a'. scroll scenes: sticky sections, nav jumps in both directions, reduced motion ----------
{
  for (const width of [1280, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(BASE + "/genus.html?id=cyclommatus");
    await page.waitForSelector("#species-groups .species-card");
    if (!(await page.evaluate(() => document.documentElement.classList.contains("scenes")))) fail(`scenes ${width}: not enabled`);
    for (const id of ["map", "references", "species", "overview"]) {
      if (width < 500) await page.click(".menu-btn");
      await page.click(`.site-nav a[href="#${id}"]`);
      await page.waitForFunction((id) => { const t = document.getElementById(id).getBoundingClientRect().top; return t > 40 && t < 120; }, id, { timeout: 5000 })
        .catch(async () => fail(`scenes ${width}: jump to #${id} landed at ${await page.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), id)}`));
    }
    await page.close();
  }
  // Pacing: no section starts to be covered before it has been on screen whole (or, if taller than the screen,
  // before its bottom has reached the bottom of the screen), and then only after a hold of scrolling.
  for (const [url, width, height] of [["genus.html?id=cyclommatus", 1280, 900], ["taxon.html?id=dynastes-hercules-lichyi", 1280, 900], ["taxon.html?id=goliathus-goliatus", 375, 800]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(BASE + "/" + url);
    await page.waitForSelector("main > section:nth-of-type(3)");
    await page.waitForTimeout(800);
    await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    const problems = await page.evaluate(async () => {
      const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const vh = innerHeight, header = 64, secs = [...document.querySelectorAll("main > section")].slice(0, -1);
      const seen = secs.map(() => ({ whole: null, cover: null }));
      for (let y = 0; y < document.documentElement.scrollHeight; y += 20) {
        scrollTo(0, y); await frame();
        secs.forEach((s, i) => {
          const r = s.getBoundingClientRect(), c = +(s.style.getPropertyValue("--cover") || 0);
          const whole = s.offsetHeight <= vh - header ? r.top >= header - 1 && r.bottom <= vh + 1 : r.bottom <= vh + 1;
          if (whole && seen[i].whole == null && !c) seen[i].whole = y;
          if (c > 0 && seen[i].cover == null) seen[i].cover = y;
        });
      }
      return seen.map((v, i) => ({ id: secs[i].id || secs[i].className, ...v }))
        .filter((v) => v.cover != null && (v.whole == null || v.cover - v.whole < vh * 0.3));
    });
    problems.forEach((v) => fail(`scenes pacing ${url} ${width}px: section ${v.id} shown whole at ${v.whole}, covered from ${v.cover}`));
    await page.close();
  }
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(BASE + "/genus.html?id=cyclommatus");
  await page.waitForSelector("#species-groups .species-card");
  if (await page.evaluate(() => document.documentElement.classList.contains("scenes"))) fail("scenes: on despite reduced motion");
  await context.close();
  console.log("scenes: checked");
}

// ---------- 2b. map: zoom, drag, popup ----------
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route(/commons\.wikimedia\.org|fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.goto(BASE + "/genus.html?id=" + summary.genera[0].id);
  const stage = page.locator("#map-stage");
  await stage.scrollIntoViewIfNeeded();
  const level = () => page.locator("#map-stage .lvl").innerText();
  if ((await level()) !== "1 / 3") fail("map does not start at zoom level 1");
  await page.click('#map-stage [data-z="in"]');
  await page.click('#map-stage [data-z="in"]');
  await page.waitForTimeout(400);
  if ((await level()) !== "3 / 3") fail("map + buttons do not reach level 3");
  if (!(await page.locator("#map-stage .city").count())) fail("no city labels at zoom level 3");
  await page.click('#map-stage [data-z="out"]');
  await page.click('#map-stage [data-z="out"]');
  await page.waitForTimeout(400);
  // A click on an area with taxa opens the popup; a drag does not.
  const spot = await page.evaluate(() => {
    for (const path of document.querySelectorAll("#map-stage path.adm")) {
      const r = path.getBoundingClientRect();
      for (let f = 0.3; f <= 0.7; f += 0.1) {
        const x = r.left + r.width * f, y = r.top + r.height * f;
        if (r.width > 8 && document.elementFromPoint(x, y) === path) return { x, y };
      }
    }
    return null;
  });
  if (!spot) fail("no clickable area found on the map");
  else await page.mouse.click(spot.x, spot.y);
  await page.waitForTimeout(200);
  const popup = page.locator("#map-stage .map-popup");
  if ((await popup.count()) !== 1) fail("clicking an area did not open the map popup");
  else if (!/^https:\/\/www\.google\.com\/maps\//.test(await popup.locator(".pop-gmaps").getAttribute("href"))) fail("map popup has no Google Maps link");
  await page.keyboard.press("Escape");
  if (await popup.count()) fail("Escape did not close the map popup");
  await page.click('#map-stage [data-z="in"]');
  await page.waitForTimeout(400);
  const s = await stage.boundingBox();
  await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2);
  await page.mouse.down();
  await page.mouse.move(s.x + s.width / 2 + 90, s.y + s.height / 2 + 30, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  if (await popup.count()) fail("a drag on the map opened the popup");
  await page.close();
  console.log("map: checked");
}

// ---------- 3. admin ----------
if (process.env.E2E_ADMIN_PASSWORD) {
  const page = await browser.newPage();
  await page.goto(BASE + "/admin");
  if (!page.url().endsWith("/admin/login")) fail("admin without login was not sent to the login page");
  await page.fill('input[name="username"]', process.env.E2E_ADMIN_USER || "admin");
  await page.fill('input[name="password"]', process.env.E2E_ADMIN_PASSWORD);
  await Promise.all([page.waitForURL(/\/admin$/), page.click('button[type="submit"]')]);
  if (!(await page.locator("text=모든 규칙을 통과했습니다").count())) fail("dashboard reports data problems");

  const taxon = summary.taxa[0].id;
  await page.goto(`${BASE}/admin/taxa/${taxon}`);
  await page.evaluate(() => { const c = document.querySelector('input[name="color"]'); c.removeAttribute("pattern"); c.value = "brown"; });
  await Promise.all([page.waitForLoadState(), page.click('.actions button[type="submit"]')]);
  if (!(await page.locator(".problems", { hasText: "colour must be #RRGGBB" }).count())) fail("invalid colour was not rejected");

  await page.goto(`${BASE}/admin/taxa/${taxon}`);
  await Promise.all([page.waitForURL(new RegExp(`/admin/taxa/${taxon}$`)), page.click('.actions button[type="submit"]')]);
  if (!(await page.locator(".flash.ok").count())) fail("saving an unchanged taxon failed");
  await page.close();
  console.log("admin: checked");
} else {
  console.log("admin: skipped (set E2E_ADMIN_PASSWORD)");
}

await browser.close();
if (failures.length) {
  console.log(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log("\nall browser checks passed");
