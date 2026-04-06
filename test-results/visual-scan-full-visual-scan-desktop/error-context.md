# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-scan.spec.ts >> full visual scan
- Location: tests\visual-scan.spec.ts:13:1

# Error details

```
TimeoutError: page.goto: Timeout 40000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/en", waiting until "networkidle"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { chromium } from 'playwright';
  3  | import * as path from 'path';
  4  | import * as fs from 'fs';
  5  | import { fileURLToPath } from 'url';
  6  | 
  7  | const __filename = fileURLToPath(import.meta.url);
  8  | const __dirname = path.dirname(__filename);
  9  | 
  10 | const BASE = (process.env.BASE_URL || 'https://majestic-next.vercel.app') + '/en';
  11 | const OUT = path.join(__dirname, '../visual-scan-results');
  12 | 
  13 | test('full visual scan', async () => {
  14 |   fs.mkdirSync(OUT, { recursive: true });
  15 |   const browser = await chromium.launch();
  16 | 
  17 |   const desktop = await browser.newPage();
  18 |   await desktop.setViewportSize({ width: 1440, height: 900 });
> 19 |   await desktop.goto(BASE, { waitUntil: 'networkidle', timeout: 40000 });
     |                 ^ TimeoutError: page.goto: Timeout 40000ms exceeded.
  20 |   await desktop.waitForTimeout(2500);
  21 |   await desktop.screenshot({ path: path.join(OUT, '01-hero.png') });
  22 | 
  23 |   const scrollPoints = [500, 1000, 1600, 2200, 3000, 3800, 4600, 5400, 6200, 7000];
  24 |   for (let i = 0; i < scrollPoints.length; i++) {
  25 |     await desktop.evaluate((y: number) => window.scrollTo({ top: y, behavior: 'instant' }), scrollPoints[i]);
  26 |     await desktop.waitForTimeout(900);
  27 |     await desktop.screenshot({ path: path.join(OUT, `${String(i+2).padStart(2,'0')}-scroll${scrollPoints[i]}.png`) });
  28 |   }
  29 | 
  30 |   await desktop.evaluate(() => window.scrollTo(0, 0));
  31 |   await desktop.waitForTimeout(500);
  32 |   await desktop.screenshot({ path: path.join(OUT, 'full-page.png'), fullPage: true });
  33 | 
  34 |   const mobile = await browser.newPage();
  35 |   await mobile.setViewportSize({ width: 390, height: 844 });
  36 |   await mobile.goto(BASE, { waitUntil: 'networkidle', timeout: 40000 });
  37 |   await mobile.waitForTimeout(2500);
  38 |   await mobile.screenshot({ path: path.join(OUT, 'mobile-01-hero.png') });
  39 |   for (const [idx, y] of [[2, 1200],[3, 2800],[4, 4400]] as [number,number][]) {
  40 |     await mobile.evaluate((sc: number) => window.scrollTo(0, sc), y);
  41 |     await mobile.waitForTimeout(800);
  42 |     await mobile.screenshot({ path: path.join(OUT, `mobile-0${idx}-scroll${y}.png`) });
  43 |   }
  44 | 
  45 |   await browser.close();
  46 |   console.log('Screenshots saved to', OUT);
  47 | });
  48 | 
```