#!/usr/bin/env node
/**
 * majestic — Majestic Next.js project CLI
 *
 * Usage:
 *   node scripts/majestic.js <command> [args]
 *   npm run majestic -- <command> [args]
 *
 * Commands:
 *   ship [message]       type-check → commit → push → vercel deploy
 *   deploy               vercel deploy --force --prod (skip git)
 *   status               git status + last Vercel deployments
 *   env setup            copy .env.example → .env.local, prompt for values
 *   env check            verify all required env vars are set
 *   wc test              test WooCommerce API connection
 *   wc products          list first 10 products from WC API
 *   images pull          download all images from thedeskco.net
 *   images list          list all images found on thedeskco.net (no download)
 *   products migrate     pull products from thedeskco.net WC, push to staging WC
 */

import { execSync, exec } from "child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, createWriteStream } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";
import https from "https";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Colors ──────────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};
const ok = (msg) => console.log(`${c.green}✓${c.reset} ${msg}`);
const err = (msg) => console.log(`${c.red}✗${c.reset} ${msg}`);
const info = (msg) => console.log(`${c.cyan}→${c.reset} ${msg}`);
const warn = (msg) => console.log(`${c.yellow}⚠${c.reset} ${msg}`);
const head = (msg) => console.log(`\n${c.bold}${c.blue}${msg}${c.reset}`);
const dim = (msg) => console.log(`${c.gray}${msg}${c.reset}`);

// ── Shell helpers ────────────────────────────────────────────────────────────
function run(cmd, { silent = false, cwd = ROOT } = {}) {
  try {
    const out = execSync(cmd, { cwd, encoding: "utf8", stdio: silent ? "pipe" : "inherit" });
    return { ok: true, out: out || "" };
  } catch (e) {
    return { ok: false, out: e.message, stderr: e.stderr?.toString() || "" };
  }
}

function runSilent(cmd, cwd = ROOT) {
  return run(cmd, { silent: true, cwd });
}

// ── Prompt helper ────────────────────────────────────────────────────────────
function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ── HTTP fetch helper (no deps) ──────────────────────────────────────────────
function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.request(url, { ...options, headers: { "User-Agent": "majestic-cli/1.0", ...options.headers } }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return fetchUrl(res.headers.location, options).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    });
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function fetchJson(url, options = {}) {
  return fetchUrl(url, options).then((r) => ({ ...r, json: JSON.parse(r.body) }));
}

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return {};
  const env = {};
  readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (key && !key.startsWith("#")) env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    });
  return env;
}

// ════════════════════════════════════════════════════════════════════════════
// COMMANDS
// ════════════════════════════════════════════════════════════════════════════

// ── ship ─────────────────────────────────────────────────────────────────────
async function cmdShip(args) {
  const message = args.join(" ") || await prompt("Commit message: ");
  if (!message) { err("No commit message. Aborting."); process.exit(1); }

  head("majestic ship");

  info("Type-checking...");
  const tc = run("npx tsc --noEmit");
  if (!tc.ok) { err("TypeScript errors. Fix them before shipping."); process.exit(1); }
  ok("Types clean");

  info("Staging all changes...");
  run("git add -A");

  const statusResult = runSilent("git status --porcelain");
  if (!statusResult.out.trim()) {
    warn("Nothing to commit. Deploying current HEAD.");
  } else {
    info("Committing...");
    const commitResult = run(`git commit -m "${message.replace(/"/g, '\\"')}

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"`);
    if (!commitResult.ok) { err("Commit failed."); process.exit(1); }
    ok("Committed");

    info("Pushing to GitHub...");
    const pushResult = run("git push");
    if (!pushResult.ok) { err("Push failed."); process.exit(1); }
    ok("Pushed to GitHub");
  }

  info("Deploying to Vercel...");
  const deployResult = run("vercel deploy --force --prod");
  if (!deployResult.ok) { err("Vercel deploy failed."); process.exit(1); }
  ok("Deployed to production");
}

// ── deploy ───────────────────────────────────────────────────────────────────
async function cmdDeploy() {
  head("majestic deploy");
  info("Deploying to Vercel (prod)...");
  run("vercel deploy --force --prod");
}

// ── status ───────────────────────────────────────────────────────────────────
async function cmdStatus() {
  head("majestic status");

  info("Git status:");
  run("git status --short");

  const log = runSilent("git log --oneline -5");
  if (log.ok && log.out.trim()) {
    info("Last 5 commits:");
    log.out.trim().split("\n").forEach((l) => dim(`  ${l}`));
  }

  info("Vercel deployments:");
  run("vercel ls 2>&1 | head -8");
}

// ── env setup ────────────────────────────────────────────────────────────────
async function cmdEnvSetup() {
  head("majestic env setup");
  const examplePath = join(ROOT, ".env.example");
  const localPath = join(ROOT, ".env.local");

  if (!existsSync(examplePath)) { err(".env.example not found"); process.exit(1); }

  if (existsSync(localPath)) {
    const overwrite = await prompt(".env.local already exists. Overwrite? (y/N): ");
    if (overwrite.toLowerCase() !== "y") { info("Skipped."); return; }
  }

  const example = readFileSync(examplePath, "utf8");
  const lines = example.split("\n");
  const output = [];

  for (const line of lines) {
    if (!line.trim() || line.startsWith("#")) { output.push(line); continue; }
    const [key] = line.split("=");
    const defaultVal = line.split("=").slice(1).join("=");
    const val = await prompt(`${key} [${defaultVal || "empty"}]: `);
    output.push(`${key}=${val || defaultVal}`);
  }

  writeFileSync(localPath, output.join("\n"));
  ok(".env.local created");
}

// ── env check ────────────────────────────────────────────────────────────────
async function cmdEnvCheck() {
  head("majestic env check");
  const env = loadEnv();
  const required = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_WC_URL", "WC_CONSUMER_KEY", "WC_CONSUMER_SECRET"];
  let allOk = true;
  for (const key of required) {
    if (env[key] && env[key] !== "" && !env[key].includes("xxxx")) {
      ok(`${key} = ${key.includes("SECRET") || key.includes("KEY") ? "***" : env[key]}`);
    } else {
      err(`${key} — missing or placeholder`);
      allOk = false;
    }
  }
  if (!allOk) { warn('Run "npm run majestic -- env setup" to configure'); }
  return allOk;
}

// ── wc test ──────────────────────────────────────────────────────────────────
async function cmdWcTest() {
  head("majestic wc test");
  const env = loadEnv();
  const wcUrl = env.NEXT_PUBLIC_WC_URL || env.WC_URL || "https://lightyellow-mallard-240169.hostingersite.com";
  const key = env.WC_CONSUMER_KEY || "";
  const secret = env.WC_CONSUMER_SECRET || "";

  if (!key || key.includes("xxxx")) {
    err("WC_CONSUMER_KEY not configured. Run: npm run majestic -- env setup");
    process.exit(1);
  }

  info(`Testing connection to: ${wcUrl}`);

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  try {
    const res = await fetchJson(`${wcUrl}/wp-json/wc/v3/system_status`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (res.status === 200) {
      ok("WooCommerce API connected");
      const env2 = res.json?.environment;
      if (env2) {
        dim(`  WC version: ${env2.version}`);
        dim(`  WordPress: ${env2.wp_version}`);
        dim(`  PHP: ${env2.php_version}`);
      }
    } else {
      err(`API returned ${res.status}: ${res.body.slice(0, 200)}`);
    }
  } catch (e) {
    err(`Connection failed: ${e.message}`);
  }
}

// ── wc products ───────────────────────────────────────────────────────────────
async function cmdWcProducts() {
  head("majestic wc products");
  const env = loadEnv();
  const wcUrl = env.NEXT_PUBLIC_WC_URL || env.WC_URL || "https://lightyellow-mallard-240169.hostingersite.com";
  const key = env.WC_CONSUMER_KEY || "";
  const secret = env.WC_CONSUMER_SECRET || "";

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  try {
    info("Fetching products...");
    const res = await fetchJson(`${wcUrl}/wp-json/wc/v3/products?per_page=10&status=publish`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (res.status !== 200) { err(`API ${res.status}: ${res.body.slice(0, 200)}`); return; }

    const products = res.json;
    ok(`${products.length} products found`);
    products.forEach((p) => {
      dim(`  [${p.id}] ${p.name} — SAR ${p.price || "?"} (${p.stock_status})`);
    });
  } catch (e) {
    err(`Failed: ${e.message}`);
  }
}

// ── images list ───────────────────────────────────────────────────────────────
async function cmdImagesList() {
  head("majestic images list");
  info("Scanning thedeskco.net for images...");

  const pages = [
    "https://thedeskco.net",
    "https://thedeskco.net/shop",
    "https://thedeskco.net/about",
    "https://thedeskco.net/contact",
  ];

  const found = new Set();

  for (const pageUrl of pages) {
    try {
      info(`Scanning: ${pageUrl}`);
      const res = await fetchUrl(pageUrl);
      const matches = res.body.match(/https?:\/\/thedeskco\.net\/wp-content\/uploads\/[^\s"')>]+\.(jpg|jpeg|png|webp|svg)/gi) || [];
      matches.forEach((url) => found.add(url));
    } catch (e) {
      warn(`Could not fetch ${pageUrl}: ${e.message}`);
    }
  }

  if (found.size === 0) {
    warn("No images found. The site may require JavaScript to render.");
    info("Tip: Use WordPress media export instead — see DEPLOY.md");
  } else {
    ok(`Found ${found.size} images:`);
    [...found].forEach((url) => dim(`  ${url}`));
  }

  return [...found];
}

// ── images pull ───────────────────────────────────────────────────────────────
async function cmdImagesPull() {
  head("majestic images pull");
  const imageUrls = await cmdImagesList();

  if (imageUrls.length === 0) return;

  const dest = join(ROOT, "public", "images", "wp-media");
  mkdirSync(dest, { recursive: true });
  ok(`Saving to public/images/wp-media/`);

  let downloaded = 0;
  for (const url of imageUrls) {
    const filename = basename(url.split("?")[0]);
    const destPath = join(dest, filename);

    if (existsSync(destPath)) {
      dim(`  skip (exists): ${filename}`);
      continue;
    }

    try {
      const res = await fetchUrl(url);
      if (res.status === 200) {
        writeFileSync(destPath, Buffer.from(res.body, "binary"));
        ok(`  ${filename}`);
        downloaded++;
      } else {
        warn(`  ${res.status}: ${filename}`);
      }
    } catch (e) {
      err(`  Failed: ${filename} — ${e.message}`);
    }
  }

  ok(`Done. ${downloaded} new images saved to public/images/wp-media/`);
  if (downloaded > 0) {
    info("Next: git add public/images/wp-media && npm run majestic -- ship \"Add WP media images\"");
  }
}

// ── products migrate ──────────────────────────────────────────────────────────
async function cmdProductsMigrate() {
  head("majestic products migrate");

  const env = loadEnv();
  const sourceUrl = "https://thedeskco.net";
  const destUrl = env.NEXT_PUBLIC_WC_URL || env.WC_URL;
  const destKey = env.WC_CONSUMER_KEY || "";
  const destSecret = env.WC_CONSUMER_SECRET || "";

  if (!destUrl || !destKey || destKey.includes("xxxx")) {
    err("Staging WC credentials not configured. Run: npm run majestic -- env setup");
    process.exit(1);
  }

  warn("This will read products from thedeskco.net (public WC API) and create them on staging.");
  warn("It will NOT overwrite existing products — duplicates are skipped by SKU.");
  const confirm = await prompt("Continue? (y/N): ");
  if (confirm.toLowerCase() !== "y") { info("Aborted."); return; }

  info("Fetching products from thedeskco.net...");
  let sourceProduts = [];
  try {
    // Try public WC API (no auth needed for published products)
    const res = await fetchJson(`${sourceUrl}/wp-json/wc/v3/products?per_page=100&status=publish`);
    if (res.status === 200) {
      sourceProduts = res.json;
      ok(`Found ${sourceProduts.length} products on source`);
    } else {
      warn(`Source API returned ${res.status}. The site may require authentication.`);
      info("Manual migration: Export from thedeskco.net WP Admin → Tools → Export → Products");
      return;
    }
  } catch (e) {
    err(`Could not reach source API: ${e.message}`);
    info("Manual migration: Export from thedeskco.net WP Admin → Tools → Export → Products");
    return;
  }

  // Fetch existing products on staging to avoid duplicates
  const destAuth = Buffer.from(`${destKey}:${destSecret}`).toString("base64");
  info("Fetching existing products on staging...");
  let existing = [];
  try {
    const res = await fetchJson(`${destUrl}/wp-json/wc/v3/products?per_page=100`, {
      headers: { Authorization: `Basic ${destAuth}` },
    });
    existing = res.status === 200 ? res.json.map((p) => p.sku).filter(Boolean) : [];
    dim(`  ${existing.length} products already on staging`);
  } catch (e) {
    warn("Could not fetch existing products. Will attempt to create all.");
  }

  let created = 0;
  let skipped = 0;

  for (const product of sourceProduts) {
    if (product.sku && existing.includes(product.sku)) {
      dim(`  skip (exists): ${product.name}`);
      skipped++;
      continue;
    }

    // Build minimal product payload
    const payload = {
      name: product.name,
      status: "publish",
      sku: product.sku,
      regular_price: product.regular_price || product.price,
      sale_price: product.sale_price || "",
      description: product.description,
      short_description: product.short_description,
      categories: product.categories.map((c) => ({ name: c.name })),
      images: product.images.map((img) => ({ src: img.src, alt: img.alt })),
      attributes: product.attributes,
    };

    try {
      const res = await fetchJson(`${destUrl}/wp-json/wc/v3/products`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${destAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        ok(`  Created: ${product.name}`);
        created++;
      } else {
        warn(`  Failed (${res.status}): ${product.name}`);
        dim(`  ${res.body.slice(0, 100)}`);
      }
    } catch (e) {
      err(`  Error: ${product.name} — ${e.message}`);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 300));
  }

  head("Migration complete");
  ok(`Created: ${created}`);
  dim(`Skipped (already existed): ${skipped}`);
  if (created > 0) {
    info("Products are on staging. Run 'npm run majestic -- wc products' to verify.");
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ROUTER
// ════════════════════════════════════════════════════════════════════════════

const [,, cmd, sub, ...rest] = process.argv;

const HELP = `
${c.bold}majestic${c.reset} — Majestic Next.js project CLI

${c.bold}Usage:${c.reset}
  npm run majestic -- <command> [args]

${c.bold}Commands:${c.reset}
  ${c.cyan}ship${c.reset} [message]      type-check → commit → push → deploy
  ${c.cyan}deploy${c.reset}              vercel deploy --prod (no git step)
  ${c.cyan}status${c.reset}              git status + recent deployments
  ${c.cyan}env setup${c.reset}           interactive .env.local setup
  ${c.cyan}env check${c.reset}           verify all env vars are configured
  ${c.cyan}wc test${c.reset}             test WooCommerce API connection
  ${c.cyan}wc products${c.reset}         list products from staging WC
  ${c.cyan}images list${c.reset}         list images on thedeskco.net
  ${c.cyan}images pull${c.reset}         download images from thedeskco.net
  ${c.cyan}products migrate${c.reset}    migrate products from thedeskco.net → staging

${c.bold}Examples:${c.reset}
  npm run majestic -- ship "Update hero copy"
  npm run majestic -- wc test
  npm run majestic -- images pull
  npm run majestic -- products migrate
`;

async function main() {
  if (!cmd || cmd === "help" || cmd === "--help") {
    console.log(HELP);
    return;
  }

  const fullCmd = sub ? `${cmd} ${sub}` : cmd;

  switch (fullCmd) {
    case "ship":           await cmdShip([sub, ...rest].filter(Boolean)); break;
    case "deploy":         await cmdDeploy(); break;
    case "status":         await cmdStatus(); break;
    case "env setup":      await cmdEnvSetup(); break;
    case "env check":      await cmdEnvCheck(); break;
    case "wc test":        await cmdWcTest(); break;
    case "wc products":    await cmdWcProducts(); break;
    case "images list":    await cmdImagesList(); break;
    case "images pull":    await cmdImagesPull(); break;
    case "products migrate": await cmdProductsMigrate(); break;
    default:
      err(`Unknown command: ${fullCmd}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((e) => {
  err(`Unexpected error: ${e.message}`);
  process.exit(1);
});
