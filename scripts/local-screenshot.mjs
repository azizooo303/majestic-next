import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = 'c:/Users/Admin/Desktop/Majestic-Next/visual-scan-results';
const BASE = process.env.BASE_URL || 'http://localhost:3000';
mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();

// Desktop
const p = await b.newPage();
await p.setViewportSize({ width: 1440, height: 900 });
console.log('Loading desktop...');
await p.goto(BASE + '/en', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(5000);
await p.screenshot({ path: OUT + '/local-01-hero.png' });
console.log('hero');

for (const y of [500, 1000, 1600, 2400, 3200]) {
  await p.evaluate(s => window.scrollTo(0, s), y);
  await p.waitForTimeout(900);
  await p.screenshot({ path: OUT + `/local-scroll${y}.png` });
  console.log('scroll', y);
}

// Mobile EN
const m = await b.newPage();
await m.setViewportSize({ width: 390, height: 844 });
console.log('Loading mobile...');
await m.goto(BASE + '/en', { waitUntil: 'domcontentloaded', timeout: 60000 });
await m.waitForTimeout(4000);
await m.screenshot({ path: OUT + '/local-mobile.png' });
console.log('mobile done');

await b.close();
console.log('ALL DONE — screenshots in visual-scan-results/local-*.png');
