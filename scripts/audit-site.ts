/**
 * Site audit script for https://majestic-next.vercel.app/en
 * Run with: npx ts-node scripts/audit-site.ts
 * Or: node --loader ts-node/esm scripts/audit-site.ts
 *
 * Uses Playwright directly (not the test runner) so we can collect structured data.
 */

import { chromium, Browser, Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://majestic-next.vercel.app";
const SCREENSHOT_DIR = path.join(__dirname, "../research/screenshots");
const REPORT_DIR = path.join(__dirname, "../research");

interface SectionInfo {
  index: number;
  tag: string;
  id: string;
  classes: string;
  dataAttributes: Record<string, string>;
  innerTextSnippet: string;
  imageCount: number;
  images: ImageInfo[];
  boundingBox: { x: number; y: number; width: number; height: number } | null;
  isVisible: boolean;
}

interface ImageInfo {
  src: string;
  alt: string;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
  isVisible: boolean;
  loading: string;
}

interface LinkInfo {
  href: string;
  text: string;
  ariaLabel: string;
}

interface AnimationInfo {
  selector: string;
  animationName: string;
  transitionProperty: string;
  transitionDuration: string;
}

interface PageAudit {
  url: string;
  title: string;
  metaDescription: string;
  lang: string;
  dir: string;
  sections: SectionInfo[];
  navLinks: LinkInfo[];
  allImages: ImageInfo[];
  animations: AnimationInfo[];
  consoleErrors: string[];
  networkErrors: string[];
  viewportWidth: number;
  viewportHeight: number;
}

async function auditPage(
  page: Page,
  url: string,
  screenshotPrefix: string
): Promise<PageAudit> {
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("requestfailed", (request) => {
    networkErrors.push(`${request.failure()?.errorText} — ${request.url()}`);
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000); // Allow animations to settle

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
    // ---- Helpers ----
    function getTextSnippet(el: Element, maxLen = 120): string {
      const text = (el as HTMLElement).innerText || el.textContent || "";
      return text.trim().replace(/\s+/g, " ").slice(0, maxLen);
    }

    function getDataAttrs(el: Element): Record<string, string> {
      const result: Record<string, string> = {};
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.startsWith("data-")) {
          result[attr.name] = attr.value.slice(0, 100);
        }
      }
      return result;
    }

    function getImageInfo(img: HTMLImageElement) {
      const rect = img.getBoundingClientRect();
      return {
        src: img.src || img.currentSrc || img.getAttribute("src") || "",
        alt: img.alt || "",
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        isVisible: rect.width > 0 && rect.height > 0,
        loading: img.loading || "eager",
      };
    }

    // ---- Page meta ----
    const htmlEl = document.documentElement;
    const title = document.title;
    const metaDesc =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") || "";
    const lang = htmlEl.lang || "";
    const dir = htmlEl.dir || "ltr";

    // ---- Sections ----
    const sectionSelectors = [
      "section",
      "header",
      "footer",
      "nav",
      '[class*="hero"]',
      '[class*="slider"]',
      '[class*="carousel"]',
      '[class*="banner"]',
      '[class*="category"]',
      '[class*="collection"]',
      '[class*="grid"]',
      '[class*="feature"]',
      '[class*="newsletter"]',
      '[class*="cta"]',
    ];

    const seen = new Set<Element>();
    const sections: any[] = [];
    let idx = 0;

    for (const sel of sectionSelectors) {
      document.querySelectorAll(sel).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);

        const rect = el.getBoundingClientRect();
        const scrollY = window.scrollY;

        const imgs = Array.from(el.querySelectorAll("img")).map(
          (img) => getImageInfo(img as HTMLImageElement)
        );

        sections.push({
          index: idx++,
          tag: el.tagName.toLowerCase(),
          id: el.id || "",
          classes: el.className || "",
          dataAttributes: getDataAttrs(el),
          innerTextSnippet: getTextSnippet(el),
          imageCount: imgs.length,
          images: imgs.slice(0, 20), // Cap at 20 per section
          boundingBox: {
            x: Math.round(rect.x),
            y: Math.round(rect.top + scrollY),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          isVisible: rect.width > 0 && rect.height > 0,
        });
      });
    }

    // Sort by vertical position
    sections.sort(
      (a, b) => (a.boundingBox?.y ?? 0) - (b.boundingBox?.y ?? 0)
    );

    // ---- Nav links ----
    const navLinks: any[] = [];
    document.querySelectorAll("nav a, header a").forEach((a) => {
      const el = a as HTMLAnchorElement;
      navLinks.push({
        href: el.href || el.getAttribute("href") || "",
        text: el.innerText?.trim() || el.textContent?.trim() || "",
        ariaLabel: el.getAttribute("aria-label") || "",
      });
    });

    // ---- All images ----
    const allImages = Array.from(document.querySelectorAll("img"))
      .map((img) => getImageInfo(img as HTMLImageElement))
      .slice(0, 100);

    // ---- Animations ----
    const animations: any[] = [];
    const animCandidates = document.querySelectorAll("*");
    for (const el of Array.from(animCandidates).slice(0, 500)) {
      const style = window.getComputedStyle(el);
      const anim = style.animationName;
      const trans = style.transitionProperty;
      const dur = style.transitionDuration;

      if (
        (anim && anim !== "none") ||
        (trans && trans !== "none" && trans !== "all" && dur !== "0s")
      ) {
        const classes = (el as HTMLElement).className || "";
        animations.push({
          selector: `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${
            classes ? "." + String(classes).split(" ").slice(0, 2).join(".") : ""
          }`,
          animationName: anim || "",
          transitionProperty: trans || "",
          transitionDuration: dur || "",
        });
      }
    }

    return {
      title,
      metaDescription: metaDesc,
      lang,
      dir,
      sections,
      navLinks,
      allImages,
      animations: animations.slice(0, 50),
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

async function auditMobile(page: Page, url: string, screenshotPrefix: string) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${screenshotPrefix}-mobile-full.png`),
    fullPage: true,
  });

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${screenshotPrefix}-mobile-viewport.png`),
    fullPage: false,
  });

  // Try tapping hamburger menu
  const hamburger = page
    .locator('[aria-label*="menu" i], [class*="hamburger"], [class*="burger"], button[class*="mobile"]')
    .first();

  const hamburgerExists = await hamburger.count();
  let mobileMenuState = "no hamburger found";

  if (hamburgerExists > 0) {
    try {
      await hamburger.click();
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${screenshotPrefix}-mobile-menu-open.png`),
        fullPage: false,
      });
      mobileMenuState = "hamburger found and clicked — screenshot captured";
    } catch (e) {
      mobileMenuState = `hamburger found but click failed: ${e}`;
    }
  }

  // Check overflow
  const overflowIssues = await page.evaluate(() => {
    const issues: string[] = [];
    document.querySelectorAll("*").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth + 5) {
        const tag = el.tagName.toLowerCase();
        const cls = String((el as HTMLElement).className || "").slice(0, 50);
        issues.push(`${tag}.${cls} overflows right by ${Math.round(rect.right - window.innerWidth)}px`);
      }
    });
    return issues.slice(0, 20);
  });

  return { mobileMenuState, overflowIssues };
}

async function checkSliderBehavior(page: Page, url: string) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);

  // Look for slider/carousel
  const sliderSelectors = [
    '[class*="slider"]',
    '[class*="carousel"]',
    '[class*="swiper"]',
    '[class*="hero"]',
    ".embla",
    "[data-slider]",
  ];

  const sliderInfo = await page.evaluate((selectors: string[]) => {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const slides = el.querySelectorAll(
          '[class*="slide"], [class*="item"], li'
        );
        const dots = el.querySelectorAll(
          '[class*="dot"], [class*="indicator"], [role="tab"]'
        );
        const prevBtn = el.querySelector(
          '[class*="prev"], [aria-label*="previous" i], [aria-label*="prev" i]'
        );
        const nextBtn = el.querySelector(
          '[class*="next"], [aria-label*="next" i]'
        );

        return {
          found: true,
          selector: sel,
          slideCount: slides.length,
          dotCount: dots.length,
          hasPrevBtn: !!prevBtn,
          hasNextBtn: !!nextBtn,
          prevBtnClasses: (prevBtn as HTMLElement)?.className || "",
          nextBtnClasses: (nextBtn as HTMLElement)?.className || "",
          sliderClasses: el.className || "",
          sliderHTML: el.innerHTML.slice(0, 500),
        };
      }
    }
    return { found: false };
  }, sliderSelectors);

  // Try clicking next button
  let clickResult = "no next button found";
  if (sliderInfo.found && sliderInfo.hasNextBtn) {
    try {
      const nextBtn = page
        .locator('[class*="next"], [aria-label*="next" i]')
        .first();
      await nextBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "homepage-slider-after-click.png"),
        fullPage: false,
      });
      clickResult = "clicked next button — screenshot captured";
    } catch (e) {
      clickResult = `click failed: ${e}`;
    }
  }

  // Check if auto-advance happens
  await page.waitForTimeout(5000);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, "homepage-slider-after-5s.png"),
    fullPage: false,
  });

  // Get current active slide index after wait
  const activeSlideInfo = await page.evaluate((selectors: string[]) => {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const active = el.querySelector(
          '[class*="active"], [aria-selected="true"], [class*="current"]'
        );
        return {
          activeClasses: (active as HTMLElement)?.className || "none",
          activeSrc:
            active?.querySelector("img")?.getAttribute("src") || "none",
        };
      }
    }
    return { activeClasses: "no slider found", activeSrc: "" };
  }, sliderSelectors);

  return { sliderInfo, clickResult, activeSlideInfo };
}

// ---- Main ----
(async () => {
  console.log("Starting site audit...");

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser: Browser = await chromium.launch({ headless: true });

  try {
    // --- Desktop audit: homepage ---
    console.log("Auditing /en (desktop 1440px)...");
    const desktopPage = await browser.newPage();
    await desktopPage.setViewportSize({ width: 1440, height: 900 });
    const homepageAudit = await auditPage(
      desktopPage,
      `${BASE_URL}/en`,
      "homepage-desktop"
    );
    await desktopPage.close();

    // --- Slider behavior ---
    console.log("Checking slider behavior...");
    const sliderPage = await browser.newPage();
    await sliderPage.setViewportSize({ width: 1440, height: 900 });
    const sliderReport = await checkSliderBehavior(
      sliderPage,
      `${BASE_URL}/en`
    );
    await sliderPage.close();

    // --- Desktop audit: shop ---
    console.log("Auditing /en/shop (desktop 1440px)...");
    const shopPage = await browser.newPage();
    await shopPage.setViewportSize({ width: 1440, height: 900 });
    const shopAudit = await auditPage(
      shopPage,
      `${BASE_URL}/en/shop`,
      "shop-desktop"
    );
    await shopPage.close();

    // --- Mobile audit ---
    console.log("Auditing /en (mobile 390px)...");
    const mobilePage = await browser.newPage();
    const mobileReport = await auditMobile(
      mobilePage,
      `${BASE_URL}/en`,
      "homepage"
    );
    await mobilePage.close();

    // Save raw JSON for downstream use
    const rawData = {
      homepage: homepageAudit,
      shop: shopAudit,
      slider: sliderReport,
      mobile: mobileReport,
    };

    fs.writeFileSync(
      path.join(REPORT_DIR, "site-audit-raw-2026-04-02.json"),
      JSON.stringify(rawData, null, 2)
    );

    console.log("Raw data saved. Generating report...");
    console.log(JSON.stringify(rawData, null, 2));
  } finally {
    await browser.close();
  }
})();
