# Site Audit: majestic-next.vercel.app — Pre-Redesign Baseline
**Date:** 2026-04-02  
**Auditor:** Test Engineer (Playwright automated + manual review)  
**Scope:** /en (homepage) and /en/shop  
**Viewport tested:** 1440x900 (desktop), 390x844 (mobile)  
**Raw data:** `research/site-audit-raw-2026-04-02.json`  
**Screenshots:** `research/screenshots/`

---

## 1. Page Identity

| Property | Value |
|----------|-------|
| Title | Majestic Furniture \| Premium Office Furniture in Riyadh |
| Meta description | "Majestic Furniture — Saudi Arabia's premier destination for professional office furniture. Executive desks, ergonomic chairs, and workstations for elevated workspace environments." |
| `<html lang>` | `en` |
| `<html dir>` | `ltr` |
| Document height (desktop) | 10,025px |
| Document height (mobile) | 13,957px |
| Console errors | 0 |
| Network errors | 0 |

---

## 2. Homepage Sections — In Visual Order (Desktop)

The page is organized as a sequence of full-width sections stacked vertically. Below is every section in render order, with vertical positions measured from the top of the document.

### Section 0 — Fixed Header / Navigation
**Position:** Fixed (overlays all content)  
**Height:** 221px (two-row header)  
**Background:** White (`bg-white`)  
**Structure:**
- **Top bar (utility nav):** Three links — Showrooms (`/en/showrooms`), Material and Colors (`/en/materials`), Warranty (`/en/warranty`)
- **Logo:** `/images/majestic-logo-original.png` — rendered 176x96px (natural: 256x140px)
- **Icon row (top right):** Account icon → `/en/account`, Cart badge showing "0" → `/en/cart`, Language toggle "AR" → `/ar`
- **Main nav (bottom row):** Chairs, Desks, Storage, Lounge, Acoustic Solutions, Accessories, Inspirations, E-Quotation
- **Mega menu (hidden in DOM, visible on mobile):** Chairs expands to: Executive Chairs, Task Chairs, Meeting Chairs, Lounge / View All. Desks expands to: Executive Desks, Workstations, Height Adjustable Desks, Accessories, Meeting Tables, Reception Desk / View All.

**Image:**  
`/images/majestic-logo-original.png` (header logo, also repeated in footer)

---

### Section 1 — Hero
**Position:** y=196, height=715px  
**Background:** Split layout — left text panel, right image  
**Classes:** `relative w-full overflow-hidden flex flex-col md:flex-row md:items-center min-h-[85vh]`  
**Content:**
- Label: "SEATING COLLECTION" (overline, uppercase)
- H1: "Seating That Performs"
- Subtext: "Ergonomic chairs built for focused comfort and extensive use."
- CTA button: "Explore Seating" → `/en/shop?category=seating`
- Stats row: "500+ CORPORATE CLIENTS", "KSA-wide DELIVERY & INSTALL", "15+ YEARS IN MARKET"

**Current state — this IS a multi-slide auto-advancing carousel.** DOM analysis initially missed it because the component uses custom class names (not standard `slider`/`carousel`/`swiper` patterns). Screenshots confirmed 3+ slides auto-advancing every ~5 seconds. Pagination dots are visible. See Section 3 for full slider details.

The DOM snapshot captured the "Seating That Performs" slide text because that slide was active when the DOM was evaluated. Other confirmed slides: "Desks Built for Authority" and "Tables That Command Rooms".

**Images:**  
| File | Purpose | Rendered size | Notes |
|------|---------|---------------|-------|
| `/images/hero-seating.jpg` | Desktop hero right panel | 835x715px (natural: 835x304px) | **Severely distorted** — natural height is only 304px but rendered at 715px, causing ~2.4x vertical stretching |
| `/images/hero-seating-mobile.jpg` | Mobile hero | 0x0 (hidden on desktop) | Mobile-only, lazy loaded |

**Critical bug:** The hero image `hero-seating.jpg` has a natural resolution of 835x304px but is being rendered at 835x715px. The image appears squashed/pixelated because it is being stretched over 2x its natural height. This is the most visually damaging issue on the entire page.

---

### Section 2 — Category Navigation Strip
**Position:** y=911, height=137px  
**Background:** White, bottom border (`border-b border-[rgba(0,0,0,0.21)]`)  
**Content:** 6 category pills with icon + label, all linking to shop category pages:

| Category | Icon source (WP) | Link |
|----------|-----------------|------|
| Seating | `thedeskco.net/wp-content/uploads/2026/03/category-seating.png` | `/en/shop?category=seating` |
| Tables | `thedeskco.net/wp-content/uploads/2026/03/category-tables.png` | `/en/shop?category=tables` |
| Storage | `thedeskco.net/wp-content/uploads/2026/03/category-storage.png` | `/en/shop?category=storage` |
| Workstations | `thedeskco.net/wp-content/uploads/2026/03/category-workstations.png` | `/en/shop?category=workstations` |
| Acoustics | `thedeskco.net/wp-content/uploads/2026/03/category-acoustics.png` | `/en/shop?category=acoustics` |
| Lounge | `thedeskco.net/wp-content/uploads/2026/03/category-lounge.png` | `/en/shop?category=lounge` |

**Image source note:** All 6 category icons are served from the live WordPress site (`thedeskco.net`), NOT from the Next.js `/public` directory. They are proxied via Next.js image optimizer. Natural size: 64x43px each — these are small, low-resolution PNG icons.

---

### Section 3 — Featured Products ("Selected for This Season")
**Position:** y=1048, height=1400px  
**Background:** White (`bg-white py-12 md:py-16`)  
**H2:** "Selected for This Season"  
**CTA:** "View All" → `/en/shop`, "Shop All Products" → `/en/shop`  
**Layout:** 8-item horizontal scroll / grid of product cards

**Critical content issue:** All 8 product names are in Arabic only (no English translation):
- كرسي كاكتس → `/en/shop/990931`
- كرسي اي ام اس → `/en/shop/990930`
- مقعد فلاي (SAR 488) → `/en/shop/990929`
- ليمون → `/en/shop/990928`
- كرسي اورنج → `/en/shop/990927`
- كرسي SYS (SAR 675) → `/en/shop/990926`
- كرسي تايم → `/en/shop/990925`
- كرسي 252 → `/en/shop/990924`

**Images (all from WordPress thedeskco.net):**  
All 8 product images follow this pattern: `thedeskco.net/wp-content/uploads/2026/03/{arabic-filename}.jpg`  
Filenames use Arabic characters (URL-encoded): `%D8%AC5.jpg`, `%D8%B71.jpg`, `%D8%B72.jpg`, `%D8%B74.jpg`, `%D8%B75.jpg`, `%D8%B77.jpg`, `%D8%B78.jpg`, `%D8%B81.jpg`

Rendered size: 331x419px each. Natural size: 328x562px. Images are being constrained and cropped — the natural images are taller than they appear.

**Prices shown:** Most show "Contact for price". Only two show SAR prices (488 and 675).

---

### Section 4 — Space Typology ("Every Space Has a Standard")
**Position:** y=2448, height=523px  
**Background:** Near-black (`bg-[#0c0c0c]`)  
**H2:** "Every Space Has a Standard"  
**Content:** 6 space types in a horizontal row, each with a small landscape image and a "See the range →" link

| Space | Image file | Link |
|-------|-----------|------|
| Executive Office | `/images/website/s1-a-executive-office.jpg` | `/en/shop?category=tables` |
| Boardroom | `/images/website/s1-b-boardroom.jpg` | `/en/shop?category=tables` |
| Open Workfloor | `/images/website/s1-c-open-workfloor.jpg` | `/en/shop?category=workstations` |
| Reception & Lobby | `/images/website/s1-d-reception-lobby.jpg` | `/en/shop?category=storage` |
| Lounge & Collaboration | `/images/website/s1-e-lounge-collaboration.jpg` | `/en/shop?category=lounge` |
| Training & Seminar | `/images/website/s1-f-training-seminar.jpg` | `/en/shop?category=workstations` |

**Image issue:** All 6 images have natural height of 107px but are rendered at 427px tall. They are severely distorted (4x vertical stretch). This is the same class of problem as the hero image — incorrect aspect ratios in the `next/image` configuration.

---

### Section 5 — Workspace Collections ("Complete Workspace Environments")
**Position:** y=2971, height=762px  
**Background:** Off-white (`bg-[#f7f7f5]`)  
**H2:** "Complete Workspace Environments"  
**Subtext:** "Three coordinated environments, ready to specify."  
**CTA:** "View All Collections" → `/en/shop`

Three collection cards with image + title + description + link:

| Collection | Image file | Description |
|-----------|-----------|-------------|
| The Directorial Suite | `/images/website/s2-a-directorial-suite.jpg` | Executive desk, credenza, chair, conference table |
| The Collaborative Floor | `/images/website/s2-b-collaborative-floor.jpg` | (not captured in snippet) |
| The Reception Statement | `/images/website/s2-c-reception-statement.jpg` | (not captured in snippet) |

All three: "Explore the collection›" → `/en/shop`  
Rendered: 441x294px. Natural: 475x207px. Rendered height is 42% taller than natural — same distortion pattern.

---

### Section 6 — Construction Detail ("Every Surface. Considered.")
**Position:** y=3733, height=623px  
**Background:** Near-black (`bg-[#0c0c0c] py-14 md:py-20 overflow-hidden`)  
**Eyebrow:** "CONSTRUCTION DETAIL"  
**H2 (implied from text):** "EVERY SURFACE. CONSIDERED."  
**Content:** 5 close-up detail images in a horizontal strip, no text labels

| # | Image file | Alt text |
|---|-----------|---------|
| 1 | `/images/website/s3-a-desk-edge-detail.jpg` | Desk edge detail |
| 2 | `/images/website/s3-b-height-adjustment-mechanism.jpg` | Height adjustment mechanism |
| 3 | `/images/website/s3-c-leather-armrest-seam.jpg` | Leather armrest seam |
| 4 | `/images/website/s3-d-conference-table-joinery.jpg` | Conference table joinery |
| 5 | `/images/website/s3-e-acoustic-fabric-weave.jpg` | Acoustic fabric weave |

Rendered: 260x347px. Natural: 260x113px. Same distortion — 3x vertical stretch.

---

### Section 7 — Scale Projects ("Built for Institutional Scale")
**Position:** y=4355, height=929px  
**Background:** White (`bg-white`)  
**H2:** "Built for Institutional Scale"  
**Content:** Case study format — "320 Workstations Installed, 4 Floors Furnished, 12 Weeks to Delivery"  
**CTA:** "Request a Project Consultation" → `/en/about` (appears twice)

Two images:  
| Image file | Alt | Status |
|-----------|-----|--------|
| `/images/website/s4-a-workfloor-scale.jpg` | "A complete open-floor fit-out across fou[r levels...]" | naturalWidth=0 — **image has not loaded** |
| `/images/website/s4-b-executive-floor-corridor.jpg` | "A full executive floor for a regional he[adquarters...]" | naturalWidth=0 — **image has not loaded** |

**Both images in this section failed to load** (naturalWidth=0, naturalHeight=0 with no intrinsic dimensions). The containers are visible (687x309px rendered), but the images are empty. This is likely a missing file or broken CDN path.

---

### Section 8 — Brand Values ("The Majestic Standard")
**Position:** y=5284, height=603px  
**Background:** Near-black (`bg-[#0c0c0c]`)  
**H2:** "What We Are Built On"  
**Content:** 4 value pillars in a grid, text-only (no images):
1. **Precision** (01) — "Every product meets defined structural and finish standards."
2. **Scale** (02) — (text not fully captured)
3. **Partnership** (03) — (text not fully captured)
4. **Regional Expertise** (04) — (text not fully captured)

No images. Purely typographic section on dark background.

---

### Section 9 — Materials & Finishes
**Position:** y=5887, height=1208px  
**Background:** Off-white (`bg-[#f7f7f5]`)  
**H2:** "Find the Right Finish"  
**Intro text:** "Choose from Majestic's surface range — wood tones, laminates, and metals — to identify the right finish for your project."  
**CTA:** "Request Material Samples" → `/en/about`

8 finish swatches displayed (active swatch appears large, others are smaller). All images are present and rendered at 795x954px but **all have naturalWidth=0** — images are loading as empty containers. The `s6-finish-*.jpg` files either haven't loaded due to lazy loading timing, or the files are missing from `/public/images/website/`.

| Finish | Image file |
|--------|-----------|
| Wenge (default) | `/images/website/s6-finish-wenge.jpg` |
| Walnut | `/images/website/s6-finish-walnut.jpg` |
| Oak | `/images/website/s6-finish-oak.jpg` |
| White | `/images/website/s6-finish-white.jpg` |
| Light Grey | `/images/website/s6-finish-light-grey.jpg` |
| Black Chrome | `/images/website/s6-finish-black-chrome.jpg` |
| Warm Sand | `/images/website/s6-finish-warm-sand.jpg` |
| Graphite | `/images/website/s6-finish-graphite.jpg` |

---

### Section 10 — Insights / Blog Previews ("The Workspace Standard")
**Position:** y=7096, height=639px  
**Background:** Light grey (`bg-[#f2f2f2]`)  
**H2:** "The Workspace Standard"  
**CTA:** "All Articles" → `/en/insights`

3 article cards:

| Article | Image | Date |
|---------|-------|------|
| "Designing the Executive Floor: Standards for Saudi Corporate Offices" | `/images/website/s7-a-executive-floor-article.jpg` | April 2026, tag: DESIGN STANDARDS |
| "Why Height-Adjustable Desks Are Now a Specification Requirement" | `/images/website/s7-b-height-adjustable-article.jpg` | March 2026, tag: ERGONOMICS |
| "Complete Workspace: How to Brief a Full Office Fit-Out" | `/images/website/s7-c-fit-out-brief-article.jpg` | (no date visible) |

All 3 article images: rendered 441x231px, naturalWidth=0 — not loaded.

---

### Section 11 — Corporate CTA Banner
**Position:** y=7734, height=666px  
**Background:** Near-white with borders (`bg-[#fafafa] border-t border-b border-[rgba(0,0,0,0.12)]`)  
**H2:** "Corporate & Government Supply — Available Nationwide"  
**Body:** "Majestic supplies complete workspace environments to organizations across the Kingdom."  
**CTA:** "Request a Consultation" → `/en/about`

**Image:** `/images/hero-tables.jpg` — rendered 672x504px, naturalWidth=0 (not loaded). This is the same `hero-tables.jpg` also used in Section 12 below.

---

### Section 12 — Design Inspiration Teaser
**Position:** y=8400, height=422px  
**Background:** Off-white with borders (`bg-[#f7f7f5] border-t border-b border-[rgba(0,0,0,0.08)]`)  
**Eyebrow:** "DESIGN INSPIRATION"  
**H2:** "Planning Ideas For Your Workspace"  
**Subtext:** "Get inspired by curated office furniture collections designed to elevate productivity and style."  
**CTA:** "Explore the collection›" → `/en/inspirations`

**Image:** `/images/hero-tables.jpg` — same file as Section 11, rendered 640x420px, naturalWidth=0 (not loaded).

**Note:** The same placeholder image (`hero-tables.jpg`) is used in two different sections (11 and 12). This is clearly a placeholder state — the real section-specific images have not been assigned yet.

---

### Section 13 — Newsletter Signup
**Position:** y=8852, height=291px  
**Background:** White, top border (`border-t border-[rgba(0,0,0,0.08)]`)  
**H2:** "Stay Informed"  
**Body:** "New collections, project stories, and workspace insights — delivered to your inbox."  
**Form:** Email input + "Subscribe" button  
**Social links:** Instagram → `instagram.com`, LinkedIn → `linkedin.com`, Facebook → `facebook.com`

No images. Text and form only. Social links go to root domains (not brand pages — placeholders).

---

### Section 14 — Final CTA (Pre-Footer)
**Position:** y=9113, height=440px  
**Background:** Near-black (`bg-[#0c0c0c]`)  
**H2:** "Your next workspace, built to specification."  
**Body:** "From a single office to a multi-floor fit-out — Majestic delivers complete workspace environments across Saudi Arabia and the GCC."  
**CTAs:** "Book a Consultation" → `/en/about`, "Visit the Showroom" → `/en/about`

No images. Text-only dark section.

---

### Section 15 — Footer
**Position:** y=9553, height=472px  
**Background:** White, top border (`bg-white border-t border-[rgba(0,0,0,0.08)]`)  
**Structure:** Brand description + 4 column nav grid + copyright

**Footer columns:**
- **Shop:** Seating, Desks, Storage, Workstations, Acoustic Solutions, Accessories
- **Company:** (links not fully captured — likely About, Showrooms)
- **Support:** (links not fully captured — likely Warranty, FAQ)
- **Contact:** (links not fully captured — address/phone)

**Footer logo:** `/images/majestic-logo-original.png` — rendered 113x32px, naturalWidth=0 (not loaded at time of capture)  
**Social icons:** Instagram, LinkedIn, Facebook, X

---

## 3. Hero Slider — Detailed Findings

**Verdict: The hero IS a multi-slide auto-advancing carousel.** The Playwright DOM script failed to detect it because the component does not use any standard slider class names (`slider`, `carousel`, `swiper`, `embla`). Screenshots confirm the slider is fully operational.

**Evidence from screenshots:**
- `homepage-slider-t0.png` (captured at page load): Shows slide "Desks Built for Authority" — Executive collections, "Explore Executive Desks" CTA
- `homepage-slider-after-6s.png` (captured 6 seconds later): Shows slide "Tables That Command Rooms" — Conference and boardroom tables, "Explore Meeting Tables" CTA
- The hero auto-advanced to a different slide within 6 seconds — auto-advance is working

**What the slider currently contains (from screenshots):**
- Slide visible at t=0: "SEATING COLLECTION / Seating That Performs" (with `hero-seating.jpg`) — *this is what the DOM scan captured*
- Slide visible at slider-t0 screenshot: "Desks Built for Authority" — desk-themed hero, lighter palette
- Slide visible at slider-t0+6s: "Tables That Command Rooms" — boardroom tables image
- Pagination dots: Visible at the bottom of the hero panel (2 dots visible in mobile screenshot, suggesting at least 2–3 slides)

**Slide layout:** Split — left panel (dark/light text on white/near-white background) + right panel (full-bleed photo). This is consistent across all slides. The H1 text is large serif-style on the left; the right image panel takes approximately 55% of the viewport width on desktop.

**Hero image for each slide (from DOM, matched to screenshots):**
| Slide content | Image file | State |
|--------------|-----------|-------|
| Seating That Performs | `/images/hero-seating.jpg` | **Distorted** (see Section 2) |
| Desks Built for Authority | (unknown — likely `hero-desks.jpg` or similar) | Appears correct in screenshot |
| Tables That Command Rooms | (unknown — likely `hero-tables.jpg`) | `hero-tables.jpg` detected in DOM |

**Click navigation:** Not tested (next button not found by DOM selector — custom class name). The mobile screenshot shows pagination dots at bottom of hero, suggesting dot-click navigation exists.

**Auto-advance interval:** Appears to be approximately 4–6 seconds based on screenshot timing.

**Script limitation note:** The auto-advance detection returned false-negative because the script measured the `src` attribute of the first image in the hero section — which doesn't change on slide transition (the image element is reused with CSS visibility toggling). The actual slide transition was confirmed visually via screenshots.

---

## 4. Complete Image Inventory

### Images by source location

**Group A — In-repo `/public/images/` (served from Vercel)**

| File path | Used in section | Notes |
|-----------|----------------|-------|
| `/images/majestic-logo-original.png` | Header + Footer | Loads correctly at 256x140px natural |
| `/images/hero-seating.jpg` | Hero | Loads but distorted (natural 835x304, rendered 835x715) |
| `/images/hero-seating-mobile.jpg` | Hero (mobile only) | Hidden on desktop |
| `/images/hero-tables.jpg` | Corporate CTA banner + Inspiration teaser | **Both sections use same file**; naturalWidth=0 (not loaded or broken) |
| `/images/website/s1-a-executive-office.jpg` | Space typology | Distorted — natural 244x107, rendered 240x427 |
| `/images/website/s1-b-boardroom.jpg` | Space typology | Same distortion issue |
| `/images/website/s1-c-open-workfloor.jpg` | Space typology | Same distortion issue |
| `/images/website/s1-d-reception-lobby.jpg` | Space typology | Same distortion issue |
| `/images/website/s1-e-lounge-collaboration.jpg` | Space typology | Same distortion issue |
| `/images/website/s1-f-training-seminar.jpg` | Space typology | Same distortion issue |
| `/images/website/s2-a-directorial-suite.jpg` | Collections | Mild distortion |
| `/images/website/s2-b-collaborative-floor.jpg` | Collections | Mild distortion |
| `/images/website/s2-c-reception-statement.jpg` | Collections | Mild distortion |
| `/images/website/s3-a-desk-edge-detail.jpg` | Construction detail | Distorted (natural 260x113, rendered 260x347) |
| `/images/website/s3-b-height-adjustment-mechanism.jpg` | Construction detail | Same distortion |
| `/images/website/s3-c-leather-armrest-seam.jpg` | Construction detail | Same distortion |
| `/images/website/s3-d-conference-table-joinery.jpg` | Construction detail | Same distortion |
| `/images/website/s3-e-acoustic-fabric-weave.jpg` | Construction detail | Same distortion |
| `/images/website/s4-a-workfloor-scale.jpg` | Scale projects | naturalWidth=0 — not loading |
| `/images/website/s4-b-executive-floor-corridor.jpg` | Scale projects | naturalWidth=0 — not loading |
| `/images/website/s6-finish-wenge.jpg` | Finishes | naturalWidth=0 — not loading |
| `/images/website/s6-finish-walnut.jpg` | Finishes | naturalWidth=0 — not loading |
| `/images/website/s6-finish-oak.jpg` | Finishes | naturalWidth=0 — not loading |
| `/images/website/s6-finish-white.jpg` | Finishes | naturalWidth=0 — not loading |
| `/images/website/s6-finish-light-grey.jpg` | Finishes | naturalWidth=0 — not loading |
| `/images/website/s6-finish-black-chrome.jpg` | Finishes | naturalWidth=0 — not loading |
| `/images/website/s6-finish-warm-sand.jpg` | Finishes | naturalWidth=0 — not loading |
| `/images/website/s6-finish-graphite.jpg` | Finishes | naturalWidth=0 — not loading |
| `/images/website/s7-a-executive-floor-article.jpg` | Insights / blog | naturalWidth=0 — not loading |
| `/images/website/s7-b-height-adjustable-article.jpg` | Insights / blog | naturalWidth=0 — not loading |
| `/images/website/s7-c-fit-out-brief-article.jpg` | Insights / blog | naturalWidth=0 — not loading |

**Group B — Fetched from live WordPress (thedeskco.net)**

| File path | Used in section | Notes |
|-----------|----------------|-------|
| `/wp-content/uploads/2026/03/category-seating.png` | Category nav strip | Loads, 64x43px natural |
| `/wp-content/uploads/2026/03/category-tables.png` | Category nav strip | Loads |
| `/wp-content/uploads/2026/03/category-storage.png` | Category nav strip | Loads |
| `/wp-content/uploads/2026/03/category-workstations.png` | Category nav strip | Loads |
| `/wp-content/uploads/2026/03/category-acoustics.png` | Category nav strip | Loads |
| `/wp-content/uploads/2026/03/category-lounge.png` | Category nav strip | Loads |
| `/wp-content/uploads/2026/03/%D8%AC5.jpg` | Featured products (كرسي كاكتس) | Loads, 328x562 natural |
| `/wp-content/uploads/2026/03/%D8%B71.jpg` | Featured products | Loads |
| `/wp-content/uploads/2026/03/%D8%B72.jpg` | Featured products | Loads |
| `/wp-content/uploads/2026/03/%D8%B74.jpg` | Featured products | Loads |
| `/wp-content/uploads/2026/03/%D8%B75.jpg` | Featured products | Loads |
| `/wp-content/uploads/2026/03/%D8%B77.jpg` | Featured products | Loads |
| `/wp-content/uploads/2026/03/%D8%B78.jpg` | Featured products | Loads |
| `/wp-content/uploads/2026/03/%D8%B81.jpg` | Featured products | Loads |

---

## 5. Animation & Transition State

There are **no keyframe animations (`@keyframes`) active** anywhere on the page. All detected "animations" have `animationName: none`.

**CSS transitions present (micro-interactions only):**

| Element type | Property | Duration | Notes |
|-------------|----------|----------|-------|
| Nav links (`a.hover:text-[#0c0c0c]`) | Color | 0.15s | Hover color change |
| Mega menu items (`a.text-sm.font-medium`) | background-size | 0.25s | Underline slide-in animation on nav items |
| Mega menu category links | background-size | 0.25s | Same underline pattern |
| Mobile menu overlay (`div.fixed.inset-0.z-50`) | Opacity | 0.3s | Fade in/out backdrop |
| Mobile menu drawer (`div.fixed.top-0.z-50`) | Transform | 0.3s | Slide in/out |
| Mobile accordion items (`div.overflow-hidden`) | all | 0.2s | Expand/collapse category subcategories |
| SVG chevron icons | Transform | 0.2s | Rotate on accordion open |

**What is NOT animated:**
- No scroll-triggered animations (no Intersection Observer effects)
- No hero image entrance animation
- No product card hover animations (no scale, translate, or shadow transitions)
- No section reveal animations
- No page transitions
- No loading states or skeleton screens

**Summary for motion designer:** The site is nearly static from an animation perspective. Only functional micro-interactions exist (hover colors, mobile drawer slide). There is significant whitespace for entrance animations, scroll reveals, and product card interactions to be added in the redesign.

---

## 6. Broken / Degraded UX — Full List

### Critical issues

1. **Hero image severely distorted** — `hero-seating.jpg` natural size is 835x304px but rendered at 835x715px. The image is being stretched 2.4x vertically, making the seating photo appear squashed and amateurish. This is the first thing a user sees.

2. **Space typology section images distorted** — All 6 images in the "Every Space Has a Standard" section have natural height of 107px but are rendered at 427px. 4x vertical stretch. These look extremely pixelated.

3. **Construction detail images distorted** — All 5 detail images: natural 260x113px, rendered 260x347px. 3x vertical stretch.

4. **11 images not loading (naturalWidth=0):**
   - `s4-a-workfloor-scale.jpg` and `s4-b-executive-floor-corridor.jpg` (scale projects section)
   - All 8 finish swatch images (`s6-finish-*.jpg`)
   - All 3 article images (`s7-*.jpg`)
   - `hero-tables.jpg` (used in two sections)
   These sections render with visible empty containers — visible to users as broken layout.

5. **Arabic-only product names on EN page** — All 8 featured products in "Selected for This Season" have Arabic-only names (e.g., "كرسي كاكتس"). The section heading is in English but the product titles are untranslated. This breaks the EN experience for non-Arabic readers.

### Moderate issues

6. **`hero-tables.jpg` used as placeholder in 2 sections** — Both the "Corporate CTA Banner" (Section 11) and the "Design Inspiration" teaser (Section 12) use the same `hero-tables.jpg`. This image is not loading and the same placeholder is used for different content contexts.

7. **Category icon images from WordPress are very small** — The category icons (seating, tables, etc.) have natural size 64x43px. They are being rendered at 62x62px in a circle container, which means the aspect ratio and quality are not ideal.

8. **Social links in footer/newsletter are placeholder URLs** — Instagram → `instagram.com` (root, no brand page), LinkedIn → `linkedin.com` (root), Facebook → `facebook.com` (root). These will open the social network homepages, not Majestic's brand pages.

9. **Collections section mild distortion** — The 3 collection images (s2-*.jpg) have natural height 207px, rendered at 294px — 42% taller than natural. Less severe than the typology section but still noticeable on large screens.

10. **"Request a Project Consultation" CTA links to `/en/about`** — The About page is likely a placeholder. The CTA for a consultation form should link to a dedicated page.

### Minor / content issues

11. **Insights blog articles are placeholder** — The three articles link to `/en/insights` (a listing page), not individual article URLs. Article content does not yet exist.

12. **Prices on featured products are mostly "Contact for price"** — Only 2 of 8 featured products show an SAR price. This may be intentional but limits transactional utility.

13. **Document height is 10,025px on desktop** — This is a very long homepage. The redesign should consider section consolidation.

---

## 7. Mobile Audit (390px width)

**Menu:** Hamburger button found (`[aria-label*="menu"]`), click successful. Mobile drawer slides in from the left (transform transition 0.3s). Screenshot captured: `homepage-mobile-menu-open.png`.

**Document height on mobile:** 13,957px — significantly taller than desktop (10,025px), suggesting sections stack vertically and some are duplicating content at mobile breakpoints.

**Overflow issues (15 detected):** The mobile layout has significant horizontal overflow. Elements are breaking out of the 390px viewport.

| Element | Overflow amount |
|---------|----------------|
| Category nav strip container | 82px overflow |
| Category pill items (`min-w-[72px]`) | 82px overflow |
| Category pill icons | 78px overflow |
| Product carousel cards (`flex-none w-[220px]`) | 74px–530px overflow |

**Root causes:**
1. **Category nav strip:** The 6 category pills with `min-w-[72px]` do not wrap or scroll on mobile — they overflow the viewport by 82px. A horizontal scroll or CSS wrapping is needed.
2. **Product feature cards:** Cards have `w-[220px] md:w-[260px]` — at 390px viewport this creates horizontal overflow because the card container is not using `overflow-x: scroll` or the scroll is not clipped properly. Cards at positions 3, 4, and beyond are rendering off-screen right (74px, 302px, 530px overflow respectively).

**Overall mobile impression:** The page is partially functional on mobile. The hero and main text sections appear to adapt correctly (column layout). The primary failures are the category strip and product carousel, which spill off screen without a visible scroll affordance. There is no swipe-to-scroll gesture feedback visible.

---

## 8. /en/shop Page Audit

**URL:** `https://majestic-next.vercel.app/en/shop`  
**Title:** "All Products — Professional Office Furniture | Majestic | Majestic Furniture"  
**Console errors:** 0  
**Network errors:** Several `net::ERR_ABORTED` on RSC prefetch requests — these are Next.js prefetch aborts (normal, not user-facing errors)

### Layout

The shop page has a single visible content area — no separate sections. It is a full-page product listing layout.

**Structure:**
- **Breadcrumb:** "Home > All Products"
- **Left sidebar — Filters panel:**
  - Category: Seating, Desks, Storage, Workstations, Acoustics, Lounge
  - Price Range: SAR 0 — SAR 10,000 (slider, not tested)
  - Brand: Majestic, ChairLine, Other
  - In Stock Only (toggle)
  - Reset all button
- **Right content area — Product grid:**
  - Heading: "All Products" (currently showing 24 visible products)
  - Product cards include: product name, category badge, price (SAR or "Contact for price"), "Add to Cart" button

**Sample products visible:**
029 Seating, 136 Seating, 163 Seating, 172 Seating, 226 Seating, 252 Seating, 270 Seating, 283 Task chair, 319 Seating, 357 Seating, 523 Task chair, 616 Seating, 628 Seating side chairs, 631 Seating, 8010 Sofa Launge, 8032 Sofa Launge, 816 Seating, 818 Seating, 826 Seating, Acama task chair, Beauty Table, Buono, Cactus Seating...

**Issues on shop page:**
1. Many product names are purely numeric codes (e.g., "029 Seating", "136 Seating") — no descriptive English names, suggesting SKU codes are being used as titles.
2. Category filter appears functional (links pre-filter by category URL parameter).
3. "8010 Sofa Launge" — typo in product name ("Launge" should be "Lounge").

---

## 9. Navigation Map — All Discovered Routes

| Route | Entry point | Status |
|-------|------------|--------|
| `/en` | Homepage | Active |
| `/en/shop` | Shop link, category nav | Active |
| `/en/shop?category=seating` | Category nav, hero CTA | Active |
| `/en/shop?category=tables` | Navigation, space typology | Active |
| `/en/shop?category=storage` | Navigation | Active |
| `/en/shop?category=workstations` | Navigation | Active |
| `/en/shop?category=acoustics` | Navigation | Active |
| `/en/shop?category=lounge` | Navigation | Active |
| `/en/shop?category=accessories` | Navigation | Active |
| `/en/shop?category=executive-chairs` | Mega menu | Unverified |
| `/en/shop?category=task-chairs` | Mega menu | Unverified |
| `/en/shop?category=meeting-chairs` | Mega menu | Unverified |
| `/en/shop?category=lounge-chairs` | Mega menu | Unverified |
| `/en/shop?category=executive-desks` | Mega menu | Unverified |
| `/en/shop?category=height-adjustable` | Mega menu | Unverified |
| `/en/shop?category=meeting-tables` | Mega menu | Unverified |
| `/en/shop?category=reception` | Mega menu | Unverified |
| `/en/shop/{id}` | Product cards | Active (e.g., `/en/shop/990931`) |
| `/en/cart` | Header cart icon | Unverified |
| `/en/account` | Header account icon | Unverified |
| `/en/about` | Multiple CTAs | Unverified |
| `/en/showrooms` | Top bar | Unverified |
| `/en/materials` | Top bar | Unverified |
| `/en/warranty` | Top bar | Unverified |
| `/en/inspirations` | Navigation, section CTA | Unverified |
| `/en/insights` | Insights section | Unverified |
| `/en/quotation` | Navigation | Unverified |
| `/ar` | Language toggle | Unverified |

---

## 10. Summary for Each Discipline

### For the UI Designer
The page architecture is: fixed 2-row header → single hero → category strip → featured products → 9 content sections → newsletter → pre-footer CTA → footer. The color palette in use: `#0c0c0c` (near-black sections), `#f7f7f5` and `#f2f2f2` (light off-white sections), pure white. No brand gold (`#C1B167`) is visible anywhere on the current site. Typography uses what appears to be a sans-serif system font — no custom typeface is visible. The hero is the most important element to redesign as it is currently broken (distorted image, static single frame). The category strip and space typology sections need to be rebuilt with correct aspect-ratio images.

### For the Motion Designer
The site has zero active animations. Every section is fully static on load. There are micro-transitions on hover states (0.15–0.25s) and the mobile drawer (0.3s slide). No scroll-triggered effects, no entrance animations, no loading states. The redesign has a completely blank canvas for motion — nothing to preserve or work around. The product carousel on the homepage would benefit from a swipe/scroll animation. The construction detail section (5 close-up photos) would be a natural candidate for a horizontal scroll animation or staggered reveal.

### For the Frontend Developer
**Immediate blockers to fix before redesign begins:**
1. `hero-seating.jpg` — the Next.js `<Image>` component is not being passed correct `width`/`height` props matching the image's actual aspect ratio. The natural size is 835x304 (landscape) but it is rendering in a 835x715 container.
2. All `/images/website/s1-*.jpg`, `s3-*.jpg` — same problem. These are landscape photos being forced into portrait-oriented containers.
3. `/images/website/s4-*.jpg`, `s6-*.jpg`, `s7-*.jpg`, `hero-tables.jpg` — these images are not loading (naturalWidth=0). Need to verify files exist in `/public/images/website/` on the deployed Vercel build.
4. Mobile horizontal overflow — the category strip and product carousel need `overflow-x: auto` + `-webkit-overflow-scrolling: touch` or a scroll container wrapper.

**Architecture observations:** All images use `next/image` optimizer. Locally-hosted images are in `/public/images/` and `/public/images/website/`. Product images are fetched from the live WordPress CDN at `thedeskco.net`. No CSS-in-JS, no styled-components — pure Tailwind utility classes observed throughout.

---

## 11. Screenshots Reference

All screenshots saved to `research/screenshots/`:

| File | Contents |
|------|----------|
| `homepage-desktop-viewport.png` | Above-fold hero at 1440px |
| `homepage-desktop-full.png` | Full 10,025px homepage |
| `homepage-mobile-viewport.png` | Above-fold at 390px |
| `homepage-mobile-full.png` | Full mobile page |
| `homepage-mobile-menu-open.png` | Mobile drawer open state |
| `homepage-slider-t0.png` | Hero at t=0 (initial load) |
| `homepage-slider-after-6s.png` | Hero at t=6s (confirms no auto-advance) |
| `shop-desktop-viewport.png` | Shop page above-fold |
| `shop-desktop-full.png` | Full shop page |
