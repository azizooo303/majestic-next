#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const DEFAULT_BASES = [
  "https://majestic-next.vercel.app",
  "https://majestic-next-git-main-azizooo303s-projects.vercel.app",
];

function parseArgs(argv) {
  const options = {
    bases: [],
    configs: null,
    family: null,
    locale: "en",
    screenshots: null,
    waitMs: 900,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--base") {
      options.bases.push(...argv[++index].split(",").map((value) => value.trim()).filter(Boolean));
    } else if (arg === "--configs") {
      options.configs = argv[++index].split(",").map((value) => value.trim()).filter(Boolean);
    } else if (arg === "--locale") {
      options.locale = argv[++index];
    } else if (arg === "--screenshots") {
      options.screenshots = argv[++index];
    } else if (arg === "--wait-ms") {
      options.waitMs = Number(argv[++index]);
    } else if (!arg.startsWith("--") && !options.family) {
      options.family = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  options.family ||= process.env.FAMILY;
  options.bases = options.bases.length ? options.bases : DEFAULT_BASES;
  options.screenshots ||= process.env.SCREENSHOT_DIR || null;
  return options;
}

function usage() {
  console.log(`Usage:
  node scripts/verify-3d-family.mjs <family> [--base <url>[,<url>]] [--configs "A,B"] [--screenshots <dir>]

Examples:
  node scripts/verify-3d-family.mjs cratos --base http://localhost:3000 --screenshots tmp
  node scripts/verify-3d-family.mjs nepton
`);
}

function cleanBase(base) {
  return base.replace(/\/+$/, "");
}

function fileSafe(value) {
  return value.replace(/^https?:\/\//, "").replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
}

function getManifestConfigs(manifest) {
  return Object.keys(manifest.configs ?? manifest.configurations ?? {});
}

async function clickConfig(page, config, waitMs) {
  const result = {
    config,
    clicked: false,
    canvas: 0,
    comingSoon: false,
    assetFailures: [],
    error: "",
  };

  try {
    const beforeFailures = await page.evaluate(() => window.__majestic3dFailures?.length ?? 0);
    await page.getByText(config, { exact: true }).first().click({ timeout: 10000 });
    result.clicked = true;
    await page.waitForTimeout(waitMs);
    await page.locator("canvas").first().waitFor({ state: "attached", timeout: 10000 }).catch(() => {});
    const body = await page.locator("body").innerText();
    result.canvas = await page.locator("canvas").count();
    result.comingSoon = /3D PREVIEW:[\s\S]*COMING SOON/i.test(body);
    result.assetFailures = await page.evaluate((start) => {
      const failures = window.__majestic3dFailures ?? [];
      return failures.slice(start);
    }, beforeFailures);
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  }

  return result;
}

async function verifyBase(browser, options, base) {
  const root = cleanBase(base);
  const manifestUrl = `${root}/3d-parts/${options.family}/manifest.json?verify=${Date.now()}`;
  const manifest = await fetchJson(manifestUrl);
  const configs = options.configs ?? getManifestConfigs(manifest);
  if (!configs.length) {
    throw new Error(`No configs found in ${manifestUrl}`);
  }

  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  await page.addInitScript(() => {
    window.__majestic3dFailures = [];
  });

  page.on("requestfailed", (request) => {
    const url = request.url();
    if (url.includes("/3d-parts/")) {
      page.evaluate((failure) => {
        window.__majestic3dFailures = window.__majestic3dFailures ?? [];
        window.__majestic3dFailures.push(failure);
      }, `request failed: ${request.failure()?.errorText ?? "unknown"} ${url}`).catch(() => {});
    }
  });

  page.on("response", (response) => {
    const url = response.url();
    if (url.includes("/3d-parts/") && response.status() >= 400) {
      page.evaluate((failure) => {
        window.__majestic3dFailures = window.__majestic3dFailures ?? [];
        window.__majestic3dFailures.push(failure);
      }, `http ${response.status()} ${url}`).catch(() => {});
    }
  });

  const pageUrl = `${root}/${options.locale}/shop/${options.family}`;
  await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 60000 });

  const title = await page.title();
  const results = [];
  for (const config of configs) {
    results.push(await clickConfig(page, config, options.waitMs));
  }

  if (options.screenshots) {
    mkdirSync(options.screenshots, { recursive: true });
    await page.screenshot({
      path: join(options.screenshots, `verify-3d-${options.family}-${fileSafe(root)}.png`),
      fullPage: false,
    });
  }

  await page.close();
  return {
    base: root,
    pageUrl,
    manifestUrl,
    title,
    titleOk: !/Product not found/i.test(title),
    configs: results,
  };
}

function hasFailure(row) {
  return (
    !row.titleOk ||
    row.configs.some((config) =>
      !config.clicked ||
      config.canvas < 1 ||
      config.comingSoon ||
      config.assetFailures.length > 0 ||
      config.error
    )
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.family) {
    usage();
    process.exit(2);
  }

  const browser = await chromium.launch({ headless: true });
  const rows = [];
  try {
    for (const base of options.bases) {
      rows.push(await verifyBase(browser, options, base));
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify(rows, null, 2));
  if (rows.some(hasFailure)) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
