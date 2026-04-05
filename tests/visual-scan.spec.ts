import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE = (process.env.BASE_URL || 'https://majestic-next.vercel.app') + '/en';
const OUT = path.join(__dirname, '../visual-scan-results');

test('full visual scan', async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  const desktop = await browser.newPage();
  await desktop.setViewportSize({ width: 1440, height: 900 });
  await desktop.goto(BASE, { waitUntil: 'networkidle', timeout: 40000 });
  await desktop.waitForTimeout(2500);
  await desktop.screenshot({ path: path.join(OUT, '01-hero.png') });

  const scrollPoints = [500, 1000, 1600, 2200, 3000, 3800, 4600, 5400, 6200, 7000];
  for (let i = 0; i < scrollPoints.length; i++) {
    await desktop.evaluate((y: number) => window.scrollTo({ top: y, behavior: 'instant' }), scrollPoints[i]);
    await desktop.waitForTimeout(900);
    await desktop.screenshot({ path: path.join(OUT, `${String(i+2).padStart(2,'0')}-scroll${scrollPoints[i]}.png`) });
  }

  await desktop.evaluate(() => window.scrollTo(0, 0));
  await desktop.waitForTimeout(500);
  await desktop.screenshot({ path: path.join(OUT, 'full-page.png'), fullPage: true });

  const mobile = await browser.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(BASE, { waitUntil: 'networkidle', timeout: 40000 });
  await mobile.waitForTimeout(2500);
  await mobile.screenshot({ path: path.join(OUT, 'mobile-01-hero.png') });
  for (const [idx, y] of [[2, 1200],[3, 2800],[4, 4400]] as [number,number][]) {
    await mobile.evaluate((sc: number) => window.scrollTo(0, sc), y);
    await mobile.waitForTimeout(800);
    await mobile.screenshot({ path: path.join(OUT, `mobile-0${idx}-scroll${y}.png`) });
  }

  await browser.close();
  console.log('Screenshots saved to', OUT);
});
