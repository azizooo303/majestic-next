/**
 * Site audit script for https://majestic-next.vercel.app/en
 * Run with: node scripts/audit-site.js
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://majestic-next.vercel.app";
const SCREENSHOT_DIR = path.join(__dirname, "../research/screenshots");
const REPORT_DIR = path.join(__dirname, "../research");

async function auditPage(page, url, screenshotPrefix) {
  const consoleErrors = [];
  const networkErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("requestfailed", (request) => {
    networkErrors.push(
      `${request.failure()?.errorText} — ${request.url()}`
    );
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);

  // Full-page screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${screenshotPrefix}-full.png`),
    fullPage: true,
  });

  // Above-fold screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${screenshotPrefix}-viewport.png`),
    fullPage: false,
  });

  const audit = await page.evaluate(() => {
    function getTextSnippet(el, maxLen = 150) {
      const text = el.innerText || el.textContent || "";
      return text.trim().replace(/\s+/g, " ").slice(0, maxLen);
    }

    function getDataAttrs(el) {
      const result = {};
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.startsWith("data-")) {
          result[attr.name] = attr.value.slice(0, 100);
        }
      }
      return result;
    }

    function getImageInfo(img) {
      const rect = img.getBoundingClientRect();
      // Also check next/image which uses srcset
      const srcAttr = img.getAttribute("src") || "";
      const srcset = img.getAttribute("srcset") || "";
      return {
        src: img.src || srcAttr,
        srcAttr,
        srcset: srcset.slice(0, 200),
        alt: img.alt || "",
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        isVisible: rect.width > 0 && rect.height > 0,
        loading: img.loading || "eager",
        isNextImage: srcAttr.includes("/_next/image") || srcAttr.includes("_next"),
      };
    }

    const htmlEl = document.documentElement;
    const title = document.title;
    const metaDesc =
      document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
    const lang = htmlEl.lang || "";
    const dir = htmlEl.dir || "ltr";

    // Identify all meaningful sections by scanning top-level layout blocks
    const topLevelSections = [];
    const seen = new Set();

    // Strategy: find all direct children of main/body that are block-level
    const mainEl = document.querySelector("main") || document.body;
    const candidates = Array.from(mainEl.children);

    candidates.forEach((el, idx) => {
      if (seen.has(el)) return;
      seen.add(el);

      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY || 0;

      const imgs = Array.from(el.querySelectorAll("img")).map((img) =>
        getImageInfo(img)
      );

      // Get all text nodes to understand content
      const headings = Array.from(el.querySelectorAll("h1,h2,h3,h4")).map(
        (h) => ({ tag: h.tagName, text: h.textContent?.trim().slice(0, 80) })
      );

      const links = Array.from(el.querySelectorAll("a"))
        .slice(0, 10)
        .map((a) => ({
          href: a.getAttribute("href") || "",
          text: a.textContent?.trim().slice(0, 50) || "",
        }));

      topLevelSections.push({
        index: idx,
        tag: el.tagName.toLowerCase(),
        id: el.id || "",
        classes: String(el.className || "").slice(0, 200),
        dataAttributes: getDataAttrs(el),
        innerTextSnippet: getTextSnippet(el, 200),
        headings,
        links,
        imageCount: imgs.length,
        images: imgs.slice(0, 15),
        boundingBox: {
          x: Math.round(rect.x),
          y: Math.round(rect.top + scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        isVisible: rect.width > 0 && rect.height > 0,
      });
    });

    // Also scan for semantic sections/headers/footers anywhere
    const semanticSections = [];
    document.querySelectorAll("section, header, footer, nav, aside").forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);

      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY || 0;
      const imgs = Array.from(el.querySelectorAll("img")).map((img) => getImageInfo(img));
      const headings = Array.from(el.querySelectorAll("h1,h2,h3,h4")).map(
        (h) => ({ tag: h.tagName, text: h.textContent?.trim().slice(0, 80) })
      );

      semanticSections.push({
        index: semanticSections.length,
        tag: el.tagName.toLowerCase(),
        id: el.id || "",
        classes: String(el.className || "").slice(0, 200),
        innerTextSnippet: getTextSnippet(el, 200),
        headings,
        imageCount: imgs.length,
        images: imgs.slice(0, 15),
        boundingBox: {
          x: Math.round(rect.x),
          y: Math.round(rect.top + scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        isVisible: rect.width > 0 && rect.height > 0,
      });
    });

    // Nav links
    const navLinks = [];
    document.querySelectorAll("nav a, header a").forEach((a) => {
      navLinks.push({
        href: a.getAttribute("href") || "",
        text: a.innerText?.trim() || a.textContent?.trim() || "",
        ariaLabel: a.getAttribute("aria-label") || "",
      });
    });

    // All images
    const allImages = Array.from(document.querySelectorAll("img"))
      .map((img) => getImageInfo(img))
      .slice(0, 80);

    // Background images from inline styles
    const bgImages = [];
    document.querySelectorAll("[style]").forEach((el) => {
      const style = el.getAttribute("style") || "";
      const match = style.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) {
        bgImages.push({
          url: match[1],
          element: el.tagName.toLowerCase(),
          classes: String(el.className || "").slice(0, 80),
        });
      }
    });

    // CSS custom props or computed bg images
    const computedBgImages = [];
    document.querySelectorAll("div, section, header").forEach((el) => {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg !== "none" && bg.includes("url(")) {
        const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && !match[1].startsWith("data:")) {
          computedBgImages.push({
            url: match[1],
            element: el.tagName.toLowerCase(),
            classes: String(el.className || "").slice(0, 80),
          });
        }
      }
    });

    // Animation scan
    const animations = [];
    const animCheck = Array.from(document.querySelectorAll("*")).slice(0, 300);
    animCheck.forEach((el) => {
      const style = window.getComputedStyle(el);
      const anim = style.animationName;
      const trans = style.transitionProperty;
      const dur = style.transitionDuration;

      if (
        (anim && anim !== "none") ||
        (trans && trans !== "none" && dur && dur !== "0s")
      ) {
        const classes = String(el.className || "").split(" ").slice(0, 3).join(".");
        animations.push({
          selector: `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${classes ? "." + classes : ""}`,
          animationName: anim || "",
          transitionProperty: trans || "",
          transitionDuration: dur || "",
        });
      }
    });

    // Scroll down to trigger lazy loading
    window.scrollTo(0, document.body.scrollHeight / 2);

    return {
      title,
      metaDescription: metaDesc,
      lang,
      dir,
      documentHeight: document.body.scrollHeight,
      topLevelSections,
      semanticSections,
      navLinks,
      allImages,
      bgImages,
      computedBgImages: computedBgImages.slice(0, 30),
      animations: animations.slice(0, 60),
    };
  });

  return {
    url,
    ...audit,
    consoleErrors,
    networkErrors,
    viewportWidth: page.viewportSize()?.width ?? 1440,
    viewportHeight: page.viewportSize()?.height ?? 900,
  };
}

async function auditMobile(page, url, screenshotPrefix) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${screenshotPrefix}-mobile-viewport.png`),
    fullPage: false,
  });

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${screenshotPrefix}-mobile-full.png`),
    fullPage: true,
  });

  // Try hamburger
  const hamburgerSelectors = [
    '[aria-label*="menu" i]',
    '[class*="hamburger"]',
    '[class*="burger"]',
    '[class*="mobile-menu"]',
    'button[class*="menu"]',
    '[data-testid*="menu"]',
  ];

  let mobileMenuState = "no hamburger found";
  for (const sel of hamburgerSelectors) {
    const btn = page.locator(sel).first();
    const count = await btn.count();
    if (count > 0) {
      try {
        await btn.click();
        await page.waitForTimeout(800);
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${screenshotPrefix}-mobile-menu-open.png`),
          fullPage: false,
        });
        mobileMenuState = `hamburger found (${sel}), clicked — screenshot captured`;
      } catch (e) {
        mobileMenuState = `hamburger found (${sel}) but click failed: ${e}`;
      }
      break;
    }
  }

  // Check overflow
  const overflowIssues = await page.evaluate(() => {
    const issues = [];
    document.querySelectorAll("*").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth + 5 && rect.width < window.innerWidth * 2) {
        const cls = String(el.className || "").slice(0, 60);
        issues.push(
          `${el.tagName.toLowerCase()}.${cls} overflows right by ${Math.round(
            rect.right - window.innerWidth
          )}px`
        );
      }
    });
    return issues.slice(0, 15);
  });

  // Scroll height check
  const scrollMetrics = await page.evaluate(() => ({
    bodyScrollHeight: document.body.scrollHeight,
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth,
  }));

  return { mobileMenuState, overflowIssues, scrollMetrics };
}

async function checkSliderBehavior(page, url) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);

  // Snapshot of slide 1
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "homepage-slider-t0.png"),
    fullPage: false,
  });

  const sliderInfo = await page.evaluate(() => {
    const selectors = [
      '[class*="slider"]',
      '[class*="carousel"]',
      '[class*="swiper"]',
      '[class*="hero"]',
      ".embla",
      "[data-slider]",
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;

      const slides = el.querySelectorAll(
        '[class*="slide"], [class*="item"]:not(li), li[class*="slide"]'
      );
      const dots = el.querySelectorAll(
        '[class*="dot"], [class*="indicator"], [role="tab"]'
      );
      const prevBtns = el.querySelectorAll(
        '[class*="prev"], [aria-label*="previous" i], button:first-of-type'
      );
      const nextBtns = el.querySelectorAll(
        '[class*="next"], [aria-label*="next" i], button:last-of-type'
      );

      const allBtns = el.querySelectorAll("button");
      const allBtnInfo = Array.from(allBtns).map((b) => ({
        classes: String(b.className || "").slice(0, 80),
        ariaLabel: b.getAttribute("aria-label") || "",
        text: b.textContent?.trim().slice(0, 30) || "",
      }));

      return {
        found: true,
        selector: sel,
        slideCount: slides.length,
        dotCount: dots.length,
        hasPrevBtn: prevBtns.length > 0,
        hasNextBtn: nextBtns.length > 0,
        sliderClasses: String(el.className || "").slice(0, 200),
        sliderTag: el.tagName.toLowerCase(),
        allButtons: allBtnInfo,
        // Check first slide image
        firstSlideImg: el.querySelector("img")?.getAttribute("src") || "",
        slideClasses: slides.length > 0 ? String(slides[0].className || "").slice(0, 100) : "",
      };
    }
    return { found: false };
  });

  // Try next button click
  let clickResult = "no next button or slider found";
  if (sliderInfo.found) {
    const nextSelectors = [
      '[class*="next"]',
      '[aria-label*="next" i]',
      '[aria-label*="Next" i]',
    ];
    for (const sel of nextSelectors) {
      const btn = page.locator(sel).first();
      const count = await btn.count();
      if (count > 0) {
        try {
          await btn.click();
          await page.waitForTimeout(1200);
          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "homepage-slider-after-next-click.png"),
            fullPage: false,
          });
          clickResult = `clicked ${sel} — screenshot captured`;
          break;
        } catch (e) {
          clickResult = `${sel} found but click failed: ${e}`;
        }
      }
    }
  }

  // Wait 6 seconds to test auto-advance
  const beforeAutoAdvance = await page.evaluate(() => {
    const el = document.querySelector('[class*="hero"], [class*="slider"], [class*="carousel"]');
    return el?.querySelector("img")?.getAttribute("src") || "";
  });

  await page.waitForTimeout(6000);

  const afterAutoAdvance = await page.evaluate(() => {
    const el = document.querySelector('[class*="hero"], [class*="slider"], [class*="carousel"]');
    return el?.querySelector("img")?.getAttribute("src") || "";
  });

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "homepage-slider-after-6s.png"),
    fullPage: false,
  });

  const autoAdvanced = beforeAutoAdvance !== afterAutoAdvance;

  return {
    sliderInfo,
    clickResult,
    autoAdvance: {
      detected: autoAdvanced,
      srcBefore: beforeAutoAdvance,
      srcAfter: afterAutoAdvance,
    },
  };
}

// ---- Main ----
(async () => {
  console.log("Starting site audit...\n");

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  try {
    // Desktop homepage
    console.log("[1/4] Auditing /en — desktop 1440px...");
    const desktopPage = await browser.newPage();
    await desktopPage.setViewportSize({ width: 1440, height: 900 });
    const homepageAudit = await auditPage(
      desktopPage,
      `${BASE_URL}/en`,
      "homepage-desktop"
    );
    await desktopPage.close();
    console.log(`     Sections found: ${homepageAudit.topLevelSections.length} top-level, ${homepageAudit.semanticSections.length} semantic`);
    console.log(`     Images found: ${homepageAudit.allImages.length}`);
    console.log(`     Console errors: ${homepageAudit.consoleErrors.length}`);

    // Slider behavior
    console.log("[2/4] Checking hero slider behavior...");
    const sliderPage = await browser.newPage();
    await sliderPage.setViewportSize({ width: 1440, height: 900 });
    const sliderReport = await checkSliderBehavior(sliderPage, `${BASE_URL}/en`);
    await sliderPage.close();
    console.log(`     Slider found: ${sliderReport.sliderInfo.found}`);
    console.log(`     Auto-advance: ${sliderReport.autoAdvance.detected}`);

    // Shop page
    console.log("[3/4] Auditing /en/shop — desktop 1440px...");
    const shopPage = await browser.newPage();
    await shopPage.setViewportSize({ width: 1440, height: 900 });
    const shopAudit = await auditPage(
      shopPage,
      `${BASE_URL}/en/shop`,
      "shop-desktop"
    );
    await shopPage.close();
    console.log(`     Sections: ${shopAudit.topLevelSections.length} top-level`);

    // Mobile
    console.log("[4/4] Auditing /en — mobile 390px...");
    const mobilePage = await browser.newPage();
    const mobileReport = await auditMobile(
      mobilePage,
      `${BASE_URL}/en`,
      "homepage"
    );
    await mobilePage.close();
    console.log(`     Menu state: ${mobileReport.mobileMenuState}`);
    console.log(`     Overflow issues: ${mobileReport.overflowIssues.length}`);

    const rawData = {
      capturedAt: new Date().toISOString(),
      homepage: homepageAudit,
      shop: shopAudit,
      slider: sliderReport,
      mobile: mobileReport,
    };

    fs.writeFileSync(
      path.join(REPORT_DIR, "site-audit-raw-2026-04-02.json"),
      JSON.stringify(rawData, null, 2)
    );

    console.log("\nRaw data saved to research/site-audit-raw-2026-04-02.json");
    console.log("Screenshots saved to research/screenshots/");
    console.log("\n--- RAW DATA (for report generation) ---");
    console.log(JSON.stringify(rawData, null, 2));
  } finally {
    await browser.close();
  }
})();
