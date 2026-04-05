#!/usr/bin/env node

import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://majestic-next-9dve1ftr6-azizooo303s-projects.vercel.app';
const OUTPUT_DIR = './audit-results';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const log = (msg) => console.log(`\n${msg}`);
const logSuccess = (msg) => console.log(`✅ ${msg}`);
const logError = (msg) => console.error(`❌ ${msg}`);

async function takeScreenshots() {
  log('📸 PART 1: Taking Screenshots...');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const results = { desktop: [], mobile: [] };
  
  const pages = [
    { name: 'Homepage', url: `${SITE_URL}/en` },
    { name: 'Shop', url: `${SITE_URL}/en/shop` },
    { name: 'Cart', url: `${SITE_URL}/en/cart` },
    { name: 'Checkout', url: `${SITE_URL}/en/checkout` },
    { name: 'About', url: `${SITE_URL}/en/about` },
    { name: 'Homepage AR', url: `${SITE_URL}/ar` },
  ];
  
  for (const page of pages) {
    try {
      const desktopPage = await browser.newPage();
      await desktopPage.setViewport({ width: 1440, height: 900 });
      await desktopPage.goto(page.url, { waitUntil: 'networkidle2', timeout: 30000 });
      const desktopPath = path.join(OUTPUT_DIR, `${page.name}-desktop.png`);
      await desktopPage.screenshot({ path: desktopPath, fullPage: true });
      results.desktop.push({ page: page.name, path: desktopPath });
      logSuccess(`Screenshot: ${page.name} (desktop)`);
      await desktopPage.close();
      
      const mobilePage = await browser.newPage();
      await mobilePage.setViewport({ width: 375, height: 667 });
      await mobilePage.goto(page.url, { waitUntil: 'networkidle2', timeout: 30000 });
      const mobilePath = path.join(OUTPUT_DIR, `${page.name}-mobile.png`);
      await mobilePage.screenshot({ path: mobilePath, fullPage: true });
      results.mobile.push({ page: page.name, path: mobilePath });
      logSuccess(`Screenshot: ${page.name} (mobile)`);
      await mobilePage.close();
    } catch (err) {
      logError(`Screenshot failed for ${page.name}: ${err.message}`);
    }
  }
  
  await browser.close();
  return results;
}

async function runLighthouse() {
  log('⚡ PART 2: Running Lighthouse Audit...');
  
  const pages = [
    { name: 'Homepage', url: `${SITE_URL}/en` },
    { name: 'Shop', url: `${SITE_URL}/en/shop` },
    { name: 'Checkout', url: `${SITE_URL}/en/checkout` },
  ];
  
  const results = [];
  
  for (const page of pages) {
    try {
      const mobileOptions = {
        logLevel: 'error',
        output: 'json',
        emulatedFormFactor: 'mobile',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      };
      
      const mobileResult = await lighthouse(page.url, mobileOptions);
      const mobileScores = {
        page: page.name,
        device: 'mobile',
        performance: mobileResult.lhr.categories.performance.score * 100,
        accessibility: mobileResult.lhr.categories.accessibility.score * 100,
        bestPractices: mobileResult.lhr.categories['best-practices'].score * 100,
        seo: mobileResult.lhr.categories.seo.score * 100,
      };
      results.push(mobileScores);
      logSuccess(`Lighthouse Mobile: ${page.name} (${mobileScores.performance.toFixed(0)}/100)`);
      
      const desktopOptions = {
        logLevel: 'error',
        output: 'json',
        emulatedFormFactor: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      };
      
      const desktopResult = await lighthouse(page.url, desktopOptions);
      const desktopScores = {
        page: page.name,
        device: 'desktop',
        performance: desktopResult.lhr.categories.performance.score * 100,
        accessibility: desktopResult.lhr.categories.accessibility.score * 100,
        bestPractices: desktopResult.lhr.categories['best-practices'].score * 100,
        seo: desktopResult.lhr.categories.seo.score * 100,
      };
      results.push(desktopScores);
      logSuccess(`Lighthouse Desktop: ${page.name} (${desktopScores.performance.toFixed(0)}/100)`);
    } catch (err) {
      logError(`Lighthouse failed for ${page.name}: ${err.message}`);
    }
  }
  
  return results;
}

async function checkResponsiveness() {
  log('📱 PART 3: Responsive Design Check...');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const breakpoints = [
    { name: 'Mobile (375px)', width: 375 },
    { name: 'Tablet (768px)', width: 768 },
    { name: 'Desktop (1440px)', width: 1440 },
  ];
  
  const results = [];
  
  for (const bp of breakpoints) {
    try {
      await page.setViewport({ width: bp.width, height: 900 });
      await page.goto(`${SITE_URL}/en`, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const metrics = await page.evaluate(() => ({
        windowWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        overflowing: document.documentElement.scrollWidth > window.innerWidth,
      }));
      
      results.push({ breakpoint: bp.name, ...metrics });
      const status = !metrics.overflowing ? '✅' : '❌';
      logSuccess(`${bp.name}: No horizontal overflow ${status}`);
    } catch (err) {
      logError(`Responsive check failed for ${bp.name}: ${err.message}`);
    }
  }
  
  await browser.close();
  return results;
}

async function checkRTL() {
  log('🔤 PART 4: RTL/Arabic Verification...');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  let results = {};
  try {
    await page.goto(`${SITE_URL}/ar`, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const rtlInfo = await page.evaluate(() => {
      const html = document.documentElement;
      return {
        dir: html.getAttribute('dir'),
        rtl: html.dir === 'rtl',
        textDirection: window.getComputedStyle(document.body).direction,
      };
    });
    
    results = {
      dirAttribute: rtlInfo.dir,
      isRTL: rtlInfo.rtl,
      computedDirection: rtlInfo.textDirection,
      status: rtlInfo.rtl ? 'GOOD' : 'CHECK NEEDED',
    };
    
    logSuccess(`RTL Check: ${results.status}`);
  } catch (err) {
    logError(`RTL check failed: ${err.message}`);
  }
  
  await browser.close();
  return results;
}

function generateReport(screenshots, lighthouse, responsive, rtl) {
  log('📄 Generating Report...');
  
  let report = '# MAJESTIC-NEXT: AUDIT REPORT\n';
  report += 'Generated: ' + new Date().toISOString() + '\n';
  report += 'Site: https://majestic-next-9dve1ftr6-azizooo303s-projects.vercel.app\n\n';
  
  report += '## SUMMARY\n\n';
  report += 'Screenshots: ' + screenshots.desktop.length + ' pages (desktop + mobile)\n\n';
  
  report += '### Performance Scores\n';
  lighthouse.forEach(l => {
    report += l.page + ' (' + l.device + '): Performance ' + l.performance.toFixed(0) + '/100\n';
  });
  report += '\n';
  
  report += '### Responsive Design\n';
  responsive.forEach(r => {
    report += r.breakpoint + ': ' + (r.overflowing ? 'OVERFLOW ❌' : 'OK ✅') + '\n';
  });
  report += '\n';
  
  report += '### RTL Support\n';
  report += 'RTL Enabled: ' + (rtl.isRTL ? 'YES ✅' : 'NO ❌') + '\n';
  report += 'Direction: ' + rtl.computedDirection + '\n\n';
  
  report += '## SCREENSHOTS\n\n';
  report += 'Desktop (1440px):\n';
  screenshots.desktop.forEach(s => {
    report += '- ' + s.page + ': ' + s.path + '\n';
  });
  report += '\nMobile (375px):\n';
  screenshots.mobile.forEach(s => {
    report += '- ' + s.page + ': ' + s.path + '\n';
  });
  
  const reportPath = path.join(OUTPUT_DIR, 'AUDIT_REPORT.md');
  fs.writeFileSync(reportPath, report);
  
  console.log('\n📄 Report saved: ' + reportPath);
  return reportPath;
}

async function main() {
  log('='.repeat(50));
  log('🎯 MAJESTIC AUDIT');
  log('='.repeat(50));
  
  try {
    const screenshots = await takeScreenshots();
    const lighthouseResults = await runLighthouse();
    const responsive = await checkResponsiveness();
    const rtl = await checkRTL();
    
    generateReport(screenshots, lighthouseResults, responsive, rtl);
    
    log('='.repeat(50));
    logSuccess('AUDIT COMPLETE!');
    log('='.repeat(50));
  } catch (err) {
    logError('Audit failed: ' + err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
