const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://majestic-next-git-main-azizooo303s-projects.vercel.app';
const OUTPUT_DIR = path.join('C:/Users/Admin/Desktop/Majestic-Next/audit-results/pre-launch');

const PAGES = [
  '/en',
  '/ar',
  '/en/shop',
  '/ar/shop',
  '/en/about',
  '/ar/about',
  '/en/contact',
  '/ar/contact',
  '/en/cart',
  '/ar/cart',
  '/en/riyadh',
  '/ar/riyadh',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function captureAll() {
  const browser = await chromium.launch({ headless: true });

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      userAgent: viewport.name === 'mobile'
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    for (const route of PAGES) {
      const url = BASE_URL + route;
      const slug = route.replace(/\//g, '_').replace(/^_/, '');
      const filename = `${slug}_${viewport.name}.png`;
      const filepath = path.join(OUTPUT_DIR, filename);

      console.log(`Capturing [${viewport.name}] ${url} ...`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000); // allow fonts/animations to settle
        await page.screenshot({ path: filepath, fullPage: false });
        console.log(`  Saved: ${filename}`);
      } catch (err) {
        console.error(`  FAILED: ${filename} — ${err.message}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('\nAll screenshots done.');
}

captureAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
