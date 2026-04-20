/**
 * Regression guard for 3 Cratos configurator bugs fixed in commit 3872e5d:
 *
 *  Bug 1: AssemblyViewer not activating — canvas should render, not model-viewer fallback
 *  Bug 2: Viewer background not flipping — #F7F4EE default, #E8E8E8 for all-white combo
 *  Bug 3: Sticky viewer not engaging — wrapper top should be <=30px after 800px scroll
 *
 * Run:
 *   npx playwright test tests/e2e/shop-configurator.spec.ts --project=desktop
 *
 * One test block, three assertion groups. Desktop viewport only — sticky
 * position:sticky only engages when the right column is tall enough (1440x900).
 */

import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

test.use({ viewport: { width: 1440, height: 900 } });

test("Cratos configurator: AssemblyViewer canvas active, smart bg flips, sticky engages", async ({
  page,
}) => {
  // ─────────────────────────────────────────────────────────────────
  // Navigate to the Cratos configurator
  // ─────────────────────────────────────────────────────────────────
  await page.goto(`${BASE}/en/shop/cratos`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  // ─────────────────────────────────────────────────────────────────
  // Assertion 1 — AssemblyViewer canvas is present (not model-viewer fallback)
  //
  // The AssemblyViewer mounts a THREE.js WebGLRenderer and appends its
  // <canvas> into the div[aria-label="3D view of ..."] container.
  // If the manifest fetch succeeds and useAssemblyViewer flips true, a <canvas>
  // will appear. model-viewer (the fallback) also uses a canvas internally but
  // is wrapped in a <model-viewer> custom element — we assert canvas is present
  // AND model-viewer is NOT present.
  // ─────────────────────────────────────────────────────────────────
  const canvas = page.locator('[aria-label*="3D view"] canvas');
  await expect(canvas, "AssemblyViewer canvas should mount within 15s").toBeVisible({
    timeout: 15000,
  });

  const modelViewer = page.locator("model-viewer");
  await expect(
    modelViewer,
    "Legacy model-viewer element should NOT be present when AssemblyViewer is active"
  ).toHaveCount(0);

  // ─────────────────────────────────────────────────────────────────
  // Assertion 2 — Smart background: default off-white, flips to grey
  // for all-white combo (Premium White top + White Powder Coat legs)
  //
  // The sticky wrapper is the direct parent div with class containing "sticky".
  // Its inline backgroundColor style reflects the viewerBg computed value.
  //
  // Default state: finish="Premium White" (first swatch), leg="Polished Chrome"
  // — background should be rgb(247, 244, 238) == #F7F4EE
  //
  // After selecting White Powder Coat legs: background flips to rgb(232, 232, 232)
  // ─────────────────────────────────────────────────────────────────
  const viewerBox = page.locator('[class*="sticky"]').first();

  // Wait for the viewer wrapper to appear (it renders immediately with the component)
  await expect(viewerBox, "Sticky viewer wrapper should be visible").toBeVisible({
    timeout: 10000,
  });

  // Check default background — warm off-white (#F7F4EE)
  const defaultBg = await viewerBox.evaluate((el) => {
    // The backgroundColor is set via inline style on the inner content div
    // (the h-[480px] lg:h-[720px] flex div), which is the first child of the
    // sticky wrapper div. Walk into it.
    const inner = el.querySelector("[style*='backgroundColor'], [style*='background-color']") as HTMLElement | null;
    const target = inner ?? (el as HTMLElement);
    return window.getComputedStyle(target).backgroundColor;
  });
  expect(defaultBg, "Default viewer bg should be warm off-white rgb(247, 244, 238)").toBe(
    "rgb(247, 244, 238)"
  );

  // Select "White Powder Coat" leg option (Legs radio group)
  const whiteLegBtn = page.getByRole("radio", { name: /White Powder Coat/i });
  await expect(whiteLegBtn, '"White Powder Coat" leg button should be visible').toBeVisible({
    timeout: 5000,
  });
  await whiteLegBtn.click();

  // Select "Premium White" top swatch (first swatch in the Desk Top Finish picker)
  // The default IS Premium White, but we explicitly click it to ensure the state
  // is set, in case the test runner hits a different default.
  const topSwatches = page.locator('[aria-labelledby*="Desk Top Finish"] [role="radio"], [id*="Desk_Top_Finish"] ~ * [role="radio"]');

  // Fallback: use the color-swatch grid under the "Top" heading
  const topPickerGroup = page.locator('[role="radiogroup"][aria-labelledby*="Desk-Top-Finish-label"]');
  const firstTopSwatch = topPickerGroup.locator('[role="radio"]').first();
  if (await firstTopSwatch.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstTopSwatch.click();
  } else {
    // The aria-labelledby id is "picker-Desk Top Finish-label" (with spaces)
    // Playwright attribute selector is exact, so use contains
    const swatchGroup = page.locator('[role="radiogroup"]').filter({
      has: page.locator('[aria-label*="Premium White"]'),
    });
    const premiumWhiteSwatch = swatchGroup.locator('[aria-label*="Premium White"]').first();
    await expect(premiumWhiteSwatch, '"Premium White" top swatch should be visible').toBeVisible({
      timeout: 5000,
    });
    await premiumWhiteSwatch.click();
  }

  // Give React one frame to re-render with the new viewerBg
  await page.waitForTimeout(300);

  const whiteComboBg = await viewerBox.evaluate((el) => {
    const inner = el.querySelector("[style*='backgroundColor'], [style*='background-color']") as HTMLElement | null;
    const target = inner ?? (el as HTMLElement);
    return window.getComputedStyle(target).backgroundColor;
  });
  expect(
    whiteComboBg,
    "All-white combo bg should flip to grey rgb(232, 232, 232)"
  ).toBe("rgb(232, 232, 232)");

  // ─────────────────────────────────────────────────────────────────
  // Assertion 3 — Sticky viewer engages after scrolling down 800px
  //
  // The sticky wrapper has class "lg:sticky lg:top-6" (top: 24px = 1.5rem).
  // After scrolling down, the wrapper's getBoundingClientRect().top should
  // settle at/near 24px (lg:top-6) — assert <= 30px.
  // After scrolling back to 0, the top should return to its natural painted
  // position above the viewport fold (effectively >= 80px accounting for header).
  // ─────────────────────────────────────────────────────────────────
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: "instant" }));
  await page.waitForTimeout(200); // let browser repaint

  const topAfterScroll = await viewerBox.evaluate((el) =>
    el.getBoundingClientRect().top
  );
  expect(
    topAfterScroll,
    `Sticky viewer top after 800px scroll should be <=30px (got ${topAfterScroll})`
  ).toBeLessThanOrEqual(30);

  // Scroll back to top — wrapper should return to natural position (above 30px)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(200);

  const topAtRest = await viewerBox.evaluate((el) =>
    el.getBoundingClientRect().top
  );
  expect(
    topAtRest,
    `Viewer top at scroll=0 should be above 30px (got ${topAtRest}), sticky should have released`
  ).toBeGreaterThan(30);
});
