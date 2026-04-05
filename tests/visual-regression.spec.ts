/**
 * Visual Regression Tests — Majestic Next.js Rebuild
 *
 * Run modes:
 *   npx playwright test visual-regression --update-snapshots   ← first run, sets baseline
 *   npx playwright test visual-regression                       ← subsequent runs, diffs against baseline
 *   BASE_URL=https://majestic-next.vercel.app npx playwright test visual-regression
 *
 * Outputs:
 *   tests/snapshots/        ← baseline PNGs (commit these)
 *   test-results/           ← diff images on failure (do NOT commit)
 */

import { test, expect, Page } from '@playwright/test';

const PAGES = [
  { name: 'home',     path: '/en' },
  { name: 'home-ar',  path: '/ar' },
  { name: 'products', path: '/en/products' },
  { name: 'about',    path: '/en/about' },
];

async function waitForPage(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle', timeout: 40000 });
  // Wait for fonts + images to settle
  await page.waitForTimeout(1500);
  // Disable animations for stable snapshots
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-duration: 0ms !important;
      transition-duration: 0ms !important;
    }`,
  });
}

// ─── Full-page snapshots per breakpoint ────────────────────────────────────
for (const pg of PAGES) {
  test(`[visual] ${pg.name} — full page`, async ({ page }, testInfo) => {
    await waitForPage(page, pg.path);
    await expect(page).toHaveScreenshot(`${pg.name}-full.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  });
}

// ─── Above-the-fold hero snapshot (what user sees first) ───────────────────
for (const pg of PAGES) {
  test(`[visual] ${pg.name} — above fold`, async ({ page }) => {
    await waitForPage(page, pg.path);
    await expect(page).toHaveScreenshot(`${pg.name}-fold.png`, {
      fullPage: false,
      animations: 'disabled',
    });
  });
}

// ─── Critical component snapshots ─────────────────────────────────────────
test('[visual] navbar — desktop EN', async ({ page }) => {
  await waitForPage(page, '/en');
  const nav = page.locator('nav').first();
  await expect(nav).toHaveScreenshot('navbar-desktop-en.png');
});

test('[visual] navbar — desktop AR (RTL)', async ({ page }) => {
  await waitForPage(page, '/ar');
  const nav = page.locator('nav').first();
  await expect(nav).toHaveScreenshot('navbar-desktop-ar.png');
});

test('[visual] footer — EN', async ({ page }) => {
  await waitForPage(page, '/en');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const footer = page.locator('footer').first();
  await expect(footer).toHaveScreenshot('footer-en.png');
});

// ─── Scroll-through scan (for review sessions, not CI) ─────────────────────
test.describe('scroll scan', () => {
  test.skip(!!process.env.CI, 'skip scroll scan in CI — use full-page instead');

  test('[scan] homepage scroll — desktop', async ({ page }) => {
    await waitForPage(page, '/en');
    const scrollPoints = [0, 600, 1200, 1800, 2400, 3200, 4000];
    for (const y of scrollPoints) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(600);
      await expect(page).toHaveScreenshot(`home-scroll-${y}.png`, { animations: 'disabled' });
    }
  });
});
