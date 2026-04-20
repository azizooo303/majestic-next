/**
 * Playwright verification script for the 3 Cratos configurator bugs.
 * Run with: node scripts/test-cratos-bugs.mjs
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3099";
const URL  = `${BASE}/en/shop/cratos`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page    = await context.newPage();

  const consoleLogs = [];
  const pageErrors  = [];
  const networkFail = [];

  page.on("console", (msg) => consoleLogs.push({ type: msg.type(), text: msg.text() }));
  page.on("pageerror", (err) => pageErrors.push(err.message));
  page.on("requestfailed", (req) => networkFail.push(req.url()));

  console.log("\n=== Loading page ===");
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });

  // ── Bug 3: Hydration / AssemblyViewer ──────────────────────────────────────
  console.log("\n--- Bug 3: Hydration / AssemblyViewer ---");

  // Check for JS errors
  if (pageErrors.length > 0) {
    console.error("FAIL: Page errors detected:");
    pageErrors.forEach((e) => console.error("  ", e));
  } else {
    console.log("PASS: No page errors");
  }

  // Check configurator console logs fired (proves client hydration)
  const cfgLogs = consoleLogs.filter((l) => l.text.includes("[cfg]"));
  if (cfgLogs.length > 0) {
    console.log("PASS: FamilyConfigurator client-side logs fired:");
    cfgLogs.forEach((l) => console.log("  ", l.text));
  } else {
    console.warn("WARN: No [cfg] logs found — client hydration may be broken");
    console.log("All console logs:");
    consoleLogs.slice(0, 20).forEach((l) => console.log("  ", l.type, l.text));
  }

  // Wait for manifest fetch — up to 5s
  await page.waitForTimeout(5000);
  const manifestLog = consoleLogs.find((l) => l.text.includes("manifest data"));
  if (manifestLog) {
    console.log("PASS: Manifest fetched:", manifestLog.text);
  } else {
    console.warn("WARN: No manifest fetch log found");
  }

  const useAssemblyLog = consoleLogs.filter((l) => l.text.includes("useAssemblyViewer"));
  useAssemblyLog.forEach((l) => console.log("  useAssemblyViewer log:", l.text));

  // Check which viewer rendered
  const hasCanvas = await page.$("canvas") !== null;
  const hasModelViewer = await page.$("model-viewer") !== null;
  console.log(`Viewer: canvas=${hasCanvas}, model-viewer=${hasModelViewer}`);
  if (hasCanvas) {
    console.log("PASS: AssemblyViewer (Three.js canvas) is rendered");
  } else if (hasModelViewer) {
    console.warn("WARN: ProductViewer3D (model-viewer) is rendered — AssemblyViewer did not activate");
  }

  // ── Bug 2: Viewer background colour ───────────────────────────────────────
  console.log("\n--- Bug 2: Viewer background ---");

  // The outer viewer wrapper div should have the warm off-white background
  const viewerWrapper = await page.$('.h-\\[480px\\]');
  if (viewerWrapper) {
    const bg = await viewerWrapper.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    console.log("Outer viewer div computed backgroundColor:", bg);
    // #F7F4EE = rgb(247, 244, 238)
    if (bg === "rgb(247, 244, 238)") {
      console.log("PASS: Outer viewer has correct warm off-white #F7F4EE");
    } else {
      console.warn("WARN: Outer viewer has unexpected bg:", bg);
    }
  } else {
    console.warn("WARN: Could not find viewer wrapper element");
  }

  // Check the canvas/viewer child background
  if (hasCanvas) {
    const canvas = await page.$("canvas");
    const canvasBg = await canvas?.evaluate((el) => {
      // The canvas parent (mountRef div) carries the backgroundColor
      const parent = el.parentElement;
      return parent ? window.getComputedStyle(parent).backgroundColor : "n/a";
    });
    console.log("AssemblyViewer mount div backgroundColor:", canvasBg);
    if (canvasBg === "rgb(247, 244, 238)") {
      console.log("PASS: AssemblyViewer mount has correct #F7F4EE");
    } else {
      console.warn("WARN: AssemblyViewer mount bg:", canvasBg, "(expected rgb(247, 244, 238))");
    }
  }

  // ── Bug 1: Sticky viewer ───────────────────────────────────────────────────
  console.log("\n--- Bug 1: Sticky viewer ---");

  // Get initial top position of the sticky wrapper
  const stickyEl = await page.$('[class*="lg:sticky"]');
  if (!stickyEl) {
    console.warn("WARN: Could not find sticky element");
  } else {
    const rectBefore = await stickyEl.boundingBox();
    console.log("Sticky element top before scroll:", rectBefore?.y?.toFixed(0));

    // Check computed position style
    const position = await stickyEl.evaluate((el) => window.getComputedStyle(el).position);
    console.log("Computed position:", position);

    // Scroll down 800px
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(300);

    const rectAfter = await stickyEl.boundingBox();
    console.log("Sticky element top after scroll 800px:", rectAfter?.y?.toFixed(0));

    const topAfterScroll = rectAfter?.y ?? 999;
    // With sticky top:24px, after scrolling 800px it should be ~24px from top
    if (topAfterScroll <= 30) {
      console.log("PASS: Sticky is working — element is pinned near top:", topAfterScroll);
    } else if (topAfterScroll < (rectBefore?.y ?? 0)) {
      console.log("PARTIAL: Element moved up but may not be fully sticky. Top:", topAfterScroll);
    } else {
      console.warn("WARN: Sticky may not be working. Top after scroll:", topAfterScroll);
    }

    // Check no transform/overflow ancestors are breaking sticky
    const stickyBreakers = await stickyEl.evaluate((el) => {
      const issues = [];
      let node = el.parentElement;
      while (node && node !== document.body) {
        const cs = window.getComputedStyle(node);
        const ov = cs.overflow + " " + cs.overflowX + " " + cs.overflowY;
        const tr = cs.transform;
        if (ov.includes("hidden") || ov.includes("auto") || ov.includes("scroll")) {
          issues.push(`overflow on <${node.tagName}>.${node.className.slice(0,40)}: ${ov}`);
        }
        if (tr && tr !== "none" && tr !== "matrix(1, 0, 0, 1, 0, 0)") {
          issues.push(`transform on <${node.tagName}>.${node.className.slice(0,40)}: ${tr}`);
        }
        node = node.parentElement;
      }
      return issues;
    });

    if (stickyBreakers.length > 0) {
      console.warn("WARN: Ancestors that may break sticky:");
      stickyBreakers.forEach((b) => console.warn("  ", b));
    } else {
      console.log("PASS: No overflow:hidden or transforms found in ancestor chain");
    }
  }

  // ── Network failures ───────────────────────────────────────────────────────
  if (networkFail.length > 0) {
    console.log("\n--- Network failures ---");
    networkFail.forEach((u) => console.warn("  FAILED:", u));
  }

  await browser.close();
  console.log("\n=== Done ===");
}

main().catch((e) => { console.error(e); process.exit(1); });
