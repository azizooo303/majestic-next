#!/usr/bin/env node

/**
 * MAJESTIC DESIGN & PERFORMANCE AUDIT SCRIPT
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://majestic-next-9dve1ftr6-azizooo303s-projects.vercel.app';
const OUTPUT_DIR = './audit-results';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const log = (msg) => console.log(`\n${msg}`);
const logSuccess = (msg) => console.log(`✅ ${msg}`);
const logError = (msg) => console.error(`❌ ${msg}`);

/**
 * PART 1: TAKE SCREENSHOTS
 */
async function takeScreenshots() {
  log('📸 PART 1: Taking Screenshots...');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const results = { desktop: [], mobile: [], rtl: [] };
  
  const pages = [
    { name: 'Homepage', url: `${SITE_URL}/en`, locale: 'en' },
    { name: 'Shop', url: `${SITE_URL}/en/shop`, locale: 'en' },
    { name: 'Cart', url: `${SITE_URL}/en/cart`, locale: 'en' },
    { name: 'Checkout', url: `${SITE_URL}/en/checkout`, locale: 'en' },
    { name: 'About', url: `${SITE_URL}/en/about`, locale: 'en' },
    { name: 'Homepage AR', url: `${SITE_URL}/ar`, locale: 'ar' },
  ];
  
  for (const page of pages) {
    try {
      // Desktop screenshot
      const desktopPage = await browser.newPage();
      await desktopPage.setViewport({ width: 1440, height: 900 });
      await desktopPage.goto(page.url, { waitUntil: 'networkidle2', timeout: 30000 });
      const desktopPath = path.join(OUTPUT_DIR, `${page.name}-desktop.png`);
      await desktopPage.screenshot({ path: desktopPath, fullPage: true });
      results.desktop.push({ page: page.name, path: desktopPath });
      logSuccess(`Screenshot: ${page.name} (desktop)`);
      await desktopPage.close();
      
      // Mobile screenshot
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

/**
 * PART 2: LIGHTHOUSE PERFORMANCE AUDIT
 */
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
      // Mobile audit
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
      
      // Desktop audit
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

/**
 * PART 3: RESPONSIVE DESIGN CHECK
 */
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
      
      const metrics = await page.evaluate(() => {
        return {
          windowWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          overflowing: document.documentElement.scrollWidth > window.innerWidth,
        };
      });
      
      results.push({
        breakpoint: bp.name,
        ...metrics,
      });
      
      const status = !metrics.overflowing ? '✅' : '❌';
      logSuccess(`${bp.name}: No horizontal overflow ${status}`);
    } catch (err) {
      logError(`Responsive check failed for ${bp.name}: ${err.message}`);
    }
  }
  
  await browser.close();
  return results;
}

/**
 * PART 4: RTL/ARABIC VERIFICATION
 */
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
        lang: html.getAttribute('lang'),
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

/**
 * GENERATE REPORT
 */
function generateReport(screenshots, lighthouse, responsive, rtl) {
  log('📄 Generating Report...');
  
  let report = '';
  
  report += '# MAJESTIC-NEXT: DESIGN & PERFORMANCE AUDIT REPORT\n';
  report += 'Generated: ' + new Date().toISOString() + '\n';
  report += 'Site: https://majestic-next-9dve1ftr6-azizooo303s-projects.vercel.app\n\n';
  
  report += '---\n\n';
  report += '## EXECUTIVE SUMMARY\n\n';
  
  report += '### Screenshots Captured\n';
  report += '- Desktop: ' + screenshots.desktop.length + ' pages\n';
  report += '- Mobile: ' + screenshots.mobile.length + ' pages\n\n';
  
  report += '### Lighthouse Scores (Mobile)\n';
  lighthouse.filter(l => l.device === 'mobile').forEach(l => {
    report += '- **' + l.page + '**: Performance ' + l.performance.toFixed(0) + '/100, Accessibility ' + l.accessibility.toFixed(0) + '/100, SEO ' + l.seo.toFixed(0) + '/100\n';
  });
  report += '\n';
  
  report += '### Responsive Design\n';
  responsive.forEach(r => {
    const status = !r.overflowing ? '✅ No overflow' : '❌ Horizontal scroll detected';
    report += '- ' + r.breakpoint + ': ' + status + '\n';
  });
  report += '\n';
  
  report += '### RTL/Arabic Support\n';
  report += '- Direction Attribute: ' + (rtl.dirAttribute || 'Not set') + '\n';
  report += '- RTL Enabled: ' + (rtl.isRTL ? '✅ Yes' : '❌ No') + '\n';
  report += '- Status: ' + rtl.status + '\n\n';
  
  report += '---\n\n';
  report += '## DETAILED FINDINGS\n\n';
  
  report += '### Performance Scores\n';
  lighthouse.forEach(l => {
    report += '**' + l.page + '** (' + l.device + '):\n';
    report += '- Performance: ' + l.performance.toFixed(0) + '/100\n';
    report += '- Accessibility: ' + l.accessibility.toFixed(0) + '/100\n';
    report += '- Best Practices: ' + l.bestPractices.toFixed(0) + '/100\n';
    report += '- SEO: ' + l.seo.toFixed(0) + '/100\n\n';
  });
  
  report += '### Responsive Design Details\n';
  responsive.forEach(r => {
    report += '**' + r.breakpoint + '**: ' + r.windowWidth + 'px viewport, ' + (r.overflowing ? '❌ OVERFLOW' : '✅ OK') + '\n';
  });
  report += '\n';
  
  report += '### RTL/Arabic Details\n';
  report += '- HTML dir attribute: ' + rtl.dirAttribute + '\n';
  report += '- RTL enabled: ' + rtl.isRTL + '\n';
  report += '- Computed direction: ' + rtl.computedDirection + '\n\n';
  
  report += '---\n\n';
  report += '## SCREENSHOTS GENERATED\n\n';
  
  report += '### Desktop (1440px)\n';
  screenshots.desktop.forEach(s => {
    report += '- ' + s.page + ': ' + s.path + '\n';
  });
  report += '\n';
  
  report += '### Mobile (375px)\n';
  screenshots.mobile.forEach(s => {
    report += '- ' + s.page + ': ' + s.path + '\n';
  });
  report += '\n';
  
  report += '---\n\n';
  report += '## NEXT STEPS\n\n';
  report += '1. Review screenshots in audit-results folder\n';
  report += '2. Check Lighthouse scores - target: Performance 90+, Accessibility 95+\n';
  report += '3. Verify responsive design - no horizontal scroll on mobile\n';
  report += '4. Test RTL - verify Arabic pages load correctly\n';
  report += '5. Identify design gaps - compare visual quality\n\n';
  
  report += '---\n\n';
  report += 'Generated by Majestic Audit Script\n';
  
  const reportPath = path.join(OUTPUT_DIR, 'AUDIT_REPORT.md');
  fs.writeFileSync(reportPath, report);
  
  console.log('\n📄 Full report saved to: ' + reportPath);
  return reportPath;
}

/**
 * MAIN EXECUTION
 */
async function main() {
  log('='.repeat(60));
  log('🎯 MAJESTIC-NEXT DESIGN & PERFORMANCE AUDIT');
  log('='.repeat(60));
  
  try {
    log('Starting comprehensive audit...');
    log('This will take 10-15 minutes');
    
    // Check dependencies
    try {
      require('puppeteer');
      require('lighthouse');
    } catch (err) {
      logError('Missing dependencies. Install with:');
      console.log('npm install puppeteer lighthouse');
      process.exit(1);
    }
    
    const screenshots = await takeScreenshots();
    const lighthouseResults = await runLighthouse();
    const responsive = await checkResponsiveness();
    const rtl = await checkRTL();
    
    const reportPath = await generateReport(screenshots, lighthouseResults, responsive, rtl);
    
    log('='.repeat(60));
    logSuccess('AUDIT COMPLETE!');
    log('='.repeat(60));
    log('');
    log('📂 Results saved to: ' + OUTPUT_DIR);
    log('📄 Report: ' + reportPath);
    log('📸 Screenshots: ' + OUTPUT_DIR);
    log('');
    logSuccess('Next: Review the audit report and screenshots');
    
  } catch (err) {
    logError('Audit failed: ' + err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
