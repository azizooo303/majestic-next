# Visual Spec: Homepage — Full Redesign v2
**Version**: 2.0
**Date**: 2026-04-05
**Status**: Ready for Build
**Supersedes**: homepage.md v1.0

---

## Audit Summary — What Is Broken and Why

Before layout specs, the following issues are confirmed from code inspection and screenshot
review. Every fix is addressed in the section specs below.

| # | Issue | Root Cause | Fix |
|---|-------|-----------|-----|
| 1 | Category thumbnails too small, low visual weight | `w-16 h-16` (64px) circles, `gap-6` strip | Replace with full-card grid format — see Section 2 |
| 2 | `&AMP;` encoding bug in product category labels | `product.categories[0]?.name` passed raw from WooCommerce HTML-encoded response | Decode in `parseCategory()` helper — see Section 3 |
| 3 | Hero text cropping/overlap on left side (desktop) | `ps-4` on mobile bleeds into desktop; text block lacks a safe right margin on narrow desktop | Fix padding ladder — see Section 1 |
| 4 | Blueprint corner decorators feel disconnected from non-hero sections | `SectionArchOverlay` used in BrandStandard and ProjectScale at 4–7% opacity on white bg is invisible and purposeless | Remove SectionArchOverlay from all white-bg sections; keep only in hero |
| 5 | Stats section label cut off ("Majestic Al-Serenity") | Old stat data in ProjectScale; replaced by new stat copy in current code | Current code has correct stats — but `bg-white]` typo in CTA button class makes it transparent. Fix class. |
| 6 | Inconsistent section spacing | Mix of `py-10`, `py-12`, `py-14`, `py-16`, `py-20`, `py-24` — arbitrary choices | Normalize to system: desktop `py-20` (160px) sections, `py-12` (96px) tight bands — see Spacing System below |
| 7 | No visual transition between dark hero and white sections below | Hero ends, category strip begins with no separator — cold jump | Add a `border-b` hairline under hero; category strip gets `bg-white` with `shadow-sm` treatment |
| 8 | ProductCard "Add to Cart" button uses `bg-[#2C2C2C]` and `hover:bg-[#C1B167]` — conflicts with design system (CTAs must be `#0c0c0c`) | Legacy token in product-card.tsx | Normalize to `bg-[#0c0c0c] hover:bg-[#333]` |
| 9 | `btn-press` class on "Shop All Products" button has `bg-white text-white` (invisible text) | Copy-paste error in page.tsx line 213 | Fix: `bg-[#0c0c0c] text-white` |
| 10 | ProjectsReel section has `bg-white,0.85)]` — invalid CSS class | Typo in className string | Fix to `bg-[rgba(255,255,255,0.85)]` or simply `bg-white` |
| 11 | CraftsmanshipBand has same `bg-white,0.85)]` typo and white-on-white tagline | Same class bug; `text-white` tagline on white background is invisible | Fix class; change tagline to `text-[#0c0c0c]` |

---

## Design System Reference

All tokens from `design-system/MASTER.md`. No raw hex values in component code — use CSS variables.

| Token | Value | Usage |
|-------|-------|-------|
| `--tdc-primary` / `#0c0c0c` | Near-black | All headings, primary text, CTA buttons |
| `--tdc-white` / `#ffffff` | White | All backgrounds |
| `--tdc-dark` / `#484848` | Dark grey | Body copy, secondary labels |
| `--tdc-medium` / `#333333` | Medium grey | Borders (strong), hover states |
| `--tdc-light` / `#fafafa` | Off-white | Card image containers, input backgrounds |
| `--tdc-border` / `rgba(0,0,0,0.21)` | Transparent border | Card edges, section dividers, input borders |
| `--tdc-sale` / `#e53e3e` | Red | Sale badges only |

**Fonts:** Raleway (all LTR UI, headings, labels) / Alyamama (all Arabic RTL text)
**Border radius:** `0px` (rounded-none) on cards, sections, buttons. `4px` (rounded-sm) on inputs and badges only.
**Container:** `w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 xl:px-10`

---

## Spacing System (Normalized)

All vertical rhythm values are multiples of 8px.

| Token | Value | Usage |
|-------|-------|-------|
| Section padding — major | `py-20` = 80px top+bottom | Hero-adjacent sections: Products, Projects |
| Section padding — standard | `py-16` = 64px top+bottom | BrandStandard, ProjectScale |
| Section padding — band | `py-12` = 48px top+bottom | CraftsmanshipBand, CategoryStrip, Newsletter |
| Section heading bottom margin | `mb-10` = 40px | Space between heading block and content |
| Section overline bottom margin | `mb-3` = 12px | Space between overline label and heading |
| Card grid gap | `gap-[15px]` | Product grid, category grid (workspace.ae standard) |
| Inner card padding | `p-3` | Product card info area |

---

## Grid

| Breakpoint | Columns | Gutter | Container Padding |
|-----------|---------|--------|------------------|
| 390px (mobile) | 4 | 15px | `px-4` (16px) |
| 768px (tablet) | 8 | 15px | `px-6` (24px) |
| 1440px (desktop) | 12 | 15px | `px-8` (32px) |
| 1920px (wide) | 12 | 15px | `px-10` (40px) |

---

## Build Priority Order

Frontend-dev: fix in this order. Items 1–4 are bugs. Items 5–11 are improvements.

1. **Bug fixes** (ship immediately): Items 2, 8, 9, 10, 11 from audit table — one-line fixes each
2. **Hero text layout** (Section 1) — padding ladder fix
3. **Category strip → Category grid** (Section 2) — highest visual impact, highest priority redesign
4. **Section spacing normalization** — apply `py-20 / py-16 / py-12` system-wide
5. **Remove SectionArchOverlay** from white-bg sections
6. **ProjectsReel** background and heading color fixes
7. **CraftsmanshipBand** tagline color fix
8. **BrandStandard** — add top hairline border separator

---

## Section 1: Hero Banner

### What stays
The core HeroBanner component is well-built. Crossfade, GSAP SplitText, DrawSVG brackets,
slide indicators — keep all of it. The architectural corner brackets are appropriate here
(dark photo background, high contrast). The blueprint watermark at 4% is acceptable at
hero level only.

### What changes
- Fix text container padding ladder (current `ps-4` on mobile clips into desktop left edge)
- Hero min-height: change from `min-h-[100svh]` to `min-h-[640px] md:min-h-[715px]` — full viewport height on mobile is excessive, prevents users from seeing below-the-fold content exists
- Text block max-width: increase from `540px` to `600px` on desktop to prevent awkward line breaks on long Arabic headlines
- Slide indicators: move from `bottom-5 md:bottom-10` to `bottom-6 md:bottom-8` — slight lift for better proportion

### Element: Hero Section Container

- **Dimensions:** W full, min-height `640px` mobile / `715px` desktop
- **Background:** Black (image fills it)
- **Overflow:** hidden
- **Bottom separator:** Add `border-b border-[rgba(0,0,0,0.12)]` — this is the visual landing edge

### Element: Text Content Block

- **Position:** `absolute bottom-0 start-0 end-0 z-20`
- **Padding (FIXED):**
  - Mobile: `ps-4 pe-4 pb-14`
  - sm (640px+): `sm:ps-6 sm:pb-16`
  - md (768px+): `md:ps-10 md:pe-[120px] md:pb-18`
  - lg (1024px+): `lg:ps-16 lg:pe-[200px] lg:pb-20`
  - The `pe` (padding-end) values prevent text from touching the slide indicators column on wide screens
- **Content max-width:** `max-w-[600px]` (was 540px)

### Element: Collection Label (overline)

- **Typography LTR:** Raleway 600, `11px`, `letter-spacing: 0.14em`, uppercase
- **Typography RTL:** Alyamama 600, `12px`, `letter-spacing: 0`
- **Color:** `#C1B167` (gold — only authorized use of this token in the design system)
- **Margin bottom:** `mb-3` (12px)

### Element: Hero Headline (H1)

- **Typography LTR:** Raleway 700–800, size ladder below, `line-height: 0.95em`, `letter-spacing: -0.04em`
- **Typography RTL:** Alyamama 700, size ladder below, `line-height: 1.1em`, `letter-spacing: 0`

| Breakpoint | LTR size | RTL size |
|-----------|---------|---------|
| mobile (390px) | 30px | 33px |
| sm (640px) | 38px | 42px |
| md (768px) | 44px | 48px |
| lg (1024px+) | 52px | 57px |

- **Color:** `#ffffff`
- **Margin bottom:** `mb-3` (12px)

### Element: Hero Tagline

- **Typography LTR:** Raleway 400, `14px` mobile / `15px` desktop, `line-height: 1.55`, `letter-spacing: 0`
- **Typography RTL:** Alyamama 400, `16px` mobile / `17px` desktop
- **Color:** `rgba(255,255,255,0.82)`
- **Max-width:** `400px` (LTR only — Arabic text is naturally wider)
- **Margin bottom:** `mb-6` (24px)

### Element: CTA Button

- **Typography:** Raleway 600, `14px`, `letter-spacing: 0` (not tight — button needs legibility)
- **Dimensions:** `min-h-[48px]` (touch target), `px-6` horizontal
- **Style:** Outlined — `border-2 border-white/85` on transparent background
- **Hover:** `bg-white/12` (subtle fill)
- **Arrow icon:** 16×16px, `translate-x-1` on hover (LTR), `-translate-x-1` on hover (RTL), `rotate-180` in RTL
- **Focus:** `outline-2 outline-offset-2 outline-[#C1B167]`
- **Active:** `scale-[0.98]`
- **Mobile:** `w-full max-w-[280px]` centered; desktop `w-auto`

### Element: Slide Indicators

- **Position:** `absolute bottom-6 md:bottom-8 start-1/2 -translate-x-1/2 z-30`
- **Active indicator:** 48px wide, 2px tall, white fill animates over `5000ms`
- **Inactive indicator:** 24px wide, 2px tall, `rgba(255,255,255,0.4)`
- **Numbers:** Raleway 600, `10px`, `tracking-[0.10em]`, hidden on mobile
- **Touch target:** Each button `p-3 -m-3` for 44px minimum

### RTL Notes — Hero
- Text container uses `start-0 end-0` logical properties — RTL auto-handled by `dir="rtl"`
- Arrow icon: `rotate-180` class already in code — confirm this is applied
- Slide indicators: `start-1/2 -translate-x-1/2` is direction-agnostic — keep as is
- Blueprint watermark corner: stays at `end-0 top-0` — in RTL this becomes top-left, which is acceptable (it is decorative, not directional)

### Responsive Notes — Hero
- Mobile: full-bleed image, text at bottom, no brackets visible (already hidden via `hidden md:block`)
- Tablet (768px): mid-size text, brackets appear, padding increases
- Desktop (1440px): full layout, all decorative elements active

---

## Section 2: Category Navigation Strip

### Current state (broken)
64×64px circle thumbnails in a horizontal scroll strip. Visually lightweight, feels like an
afterthought after a full-height hero. The `min-w-[72px]` columns make this section feel
like a mobile app navigation bar on desktop.

### Redesign: Category Grid

Replace the horizontal scroll strip with a 6-column grid of taller category cards. This gives
each category visual weight proportional to a premium e-commerce site.

### Layout

- **Section background:** `#ffffff`
- **Section padding:** `pt-12 pb-0` (48px top, flush at bottom — next section provides its own top padding)
- **Bottom border:** `border-b border-[rgba(0,0,0,0.12)]`
- **Container:** Standard container (`max-w-screen-2xl`)

### Element: Category Section Heading

- **Typography LTR:** Raleway 700, `13px`, `letter-spacing: 0.08em`, `uppercase`
- **Typography RTL:** Alyamama 600, `14px`, `letter-spacing: 0`
- **Color:** `#484848`
- **Text:** "Browse by Category" (EN) / "تصفح حسب الفئة" (AR)
- **Margin bottom:** `mb-6` (24px)

### Element: Category Card Grid

- **Grid:** `grid grid-cols-3 md:grid-cols-6 gap-[15px]`
- **Mobile:** 3 columns (2 rows of 3)
- **Desktop:** 6 columns (1 row)

### Element: Category Card (individual)

- **Dimensions:** W auto (grid fills column), aspect ratio `aspect-[3/4]` — portrait card
- **Background:** `#fafafa` (image container)
- **Border:** `1px solid rgba(0,0,0,0.21)`
- **Border radius:** `0px` (rounded-none)
- **Overflow:** hidden

**Image:**
- `next/image` fill, `object-cover`
- On hover: `scale-[1.05]`, `transition-transform duration-300`
- Aspect ratio preserved by parent container
- No overlay by default

**Hover overlay:**
- `absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200`

**Category label:**
- Position: Below image (outside image container), NOT overlaid
- **Typography LTR:** Raleway 600, `12px`, `letter-spacing: 0.06em`, `uppercase`
- **Typography RTL:** Alyamama 600, `13px`, `letter-spacing: 0`
- **Color:** `#0c0c0c`
- **Padding:** `py-3` (12px top and bottom)
- **Text align:** center

**States:**
- Default: border `rgba(0,0,0,0.21)`, label `#0c0c0c`
- Hover: image scale `1.05`, overlay appears, border color `rgba(0,0,0,0.38)`, label `#0c0c0c` (no change — already dark)
- Focus: `outline-2 outline-[#0c0c0c] outline-offset-2`
- Active: `scale-[0.99]` on the card

**Empty state (image fails to load):**
- Show `#fafafa` background with centered category initial letter
- Raleway 700, `24px`, `#484848`

### RTL Notes — Categories
- Grid direction inherits from `dir="rtl"` — right-to-left column fill is automatic
- Category labels: `text-center` — direction-agnostic
- Image scale hover is direction-agnostic

### Responsive Notes — Categories
- 390px: `grid-cols-3` — 2 rows of 3 cards, each card ~110px wide. Minimum aspect ratio maintained.
- 768px: `grid-cols-3 md:grid-cols-6` — single row
- 1440px: 6 columns, each ~220px wide. Portrait cards at this width have excellent visual weight.

---

## Section 3: Featured Products

### What stays
4-column grid structure, gap-[15px], section heading with View All link, Shop All button.
ProductCard component structure is correct.

### What changes

1. **Section padding:** Change from `py-12 md:py-16` to `py-20` (consistent 80px, desktop and mobile get proportional treatment)
2. **Heading:** Fix raw `text-gray-900]` typo (missing `[`) → `text-[#0c0c0c]`
3. **Heading typography:** Change from `text-2xl md:text-3xl` to Raleway 700, 28px mobile / 42px desktop, `tracking-[-0.02em]`
4. **Heading margin:** `mb-10` (40px, was `mb-8`)
5. **Shop All button:** Fix invisible text bug (`bg-white text-white` → `bg-[#0c0c0c] text-white`)
6. **HTML entity decode:** Add `parseCategory()` to strip `&amp;` etc. before rendering

### Element: Section Heading Row

- **Layout:** `flex items-baseline justify-between` (baseline align keeps heading and link optically level)
- **Heading:**
  - LTR: Raleway 700, `28px` mobile / `42px` desktop, `line-height: 1.05em`, `letter-spacing: -0.02em`, `#0c0c0c`
  - RTL: Alyamama 700, `31px` mobile / `46px` desktop, `line-height: 1.1em`, `letter-spacing: 0`
- **"View All" link:**
  - Raleway 500, `13px`, `#484848`
  - Hover: `#0c0c0c`, `border-b border-[#0c0c0c]`
  - RTL: Alyamama 500, `14px`

### Element: Product Grid

- **Grid:** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px]`
- **Margin top:** `mt-10` (40px from heading row)

### Element: ProductCard Fix — Category Label

In `product-card.tsx`:

```tsx
// Add helper — decode HTML entities from WooCommerce API response
function parseCategory(raw: string): string {
  return raw.replace(/&amp;/gi, "&")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")
            .replace(/&quot;/gi, '"')
            .replace(/&#039;/gi, "'");
}

// Then in the JSX:
<p className="text-xs text-[#484848] uppercase tracking-wide">
  {parseCategory(category)}
</p>
```

### Element: ProductCard Fix — Button Color

```tsx
// Change from:
className="btn-press w-full bg-[#2C2C2C] text-white py-2 text-xs font-semibold rounded-sm hover:bg-[#C1B167] transition-colors cursor-pointer"
// Change to:
className="w-full bg-[#0c0c0c] text-white py-2 text-xs font-semibold rounded-sm hover:bg-[#333] transition-colors cursor-pointer"
```

### Element: ProductCard — Full Spec

- **Dimensions:** W auto (fills grid column), total height auto
- **Background:** `#ffffff`
- **Border:** `1px solid rgba(0,0,0,0.21)`
- **Border radius:** `0px` (rounded-none)
- **Shadow:** none by default; `shadow-md` on hover

**Image container:**
- Aspect ratio: `aspect-square` (1:1) — simpler than the 281:356 spec; product images are mostly portrait but square crop prevents layout jump
- Background: `#fafafa`
- Overflow: hidden
- On hover: image `scale-[1.03]`, `transition-transform duration-300`

**Discount badge:**
- `absolute top-2 start-2 z-10`
- Background: `#e53e3e`
- Typography: Raleway 700, `11px`, `#ffffff`
- Padding: `px-2 py-0.5`
- Border radius: `rounded-sm` (4px)

**Quick view overlay (on hover):**
- `absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200`
- "Quick View" button: `absolute bottom-3 start-1/2 -translate-x-1/2 bg-white text-[#0c0c0c] px-4 py-2 text-xs font-medium border border-[rgba(0,0,0,0.21)] opacity-0 group-hover:opacity-100 whitespace-nowrap`

**Info block:**
- Padding: `p-3`
- Category label: Raleway 400, `11px`, `#484848`, `uppercase`, `tracking-[0.06em]`
- Product name: Raleway 700, `13px`, `#0c0c0c`, `line-height: 1.25em`, `mt-1`
- Brand: Raleway 400, `11px`, `#484848`, `mt-0.5` (omit if empty — `brand=""` in current data)
- Price: Raleway 700, `13px`, `#0c0c0c`, `mt-2`
- Original price (on sale): Raleway 400, `12px`, `#484848`, `line-through`, `ms-2`
- "Contact for price" (when price=0): Raleway 400, `12px`, `#484848`

**Add to Cart button:**
- `w-full bg-[#0c0c0c] text-white py-2 text-xs font-semibold rounded-none hover:bg-[#333] transition-colors`
- Height: minimum `36px` — `py-2` achieves this with `text-xs`
- Disabled state (out of stock): `opacity-50 cursor-not-allowed bg-[#484848]`
- Loading state: Replace text with 16px spinner (white), same button dimensions
- RTL: `font-alyamama` when `isAr`, `text-[13px]`

**States:**
- Default: border `rgba(0,0,0,0.21)`, no shadow
- Hover: `shadow-md`, image scale, quick view overlay appears
- Focus (keyboard on card link): `outline-2 outline-[#0c0c0c] outline-offset-2`

### Element: Shop All Products Button

- Position: `text-center mt-10`
- Style: Primary button — `bg-[#0c0c0c] text-white px-10 py-3.5 font-semibold text-sm tracking-wide rounded-none hover:bg-[#333] transition-colors`
- Minimum touch target: `min-h-[48px]`
- RTL: `font-alyamama text-[15px]`

### RTL Notes — Products
- Category label: `text-start` (left in LTR, right in RTL via logical properties)
- Price: uses `isAr` conditional for `toLocaleString("ar-SA")` — already implemented correctly
- Grid direction: auto from `dir="rtl"` — cards fill right to left

### Responsive Notes — Products
- 390px: `grid-cols-2` — 2 cards per row, each ~175px. Image square crops are legible.
- 768px: `grid-cols-3`
- 1024px+: `grid-cols-4`

---

## Section 4: Space Typology

No layout changes required. Conditional on `siteContent.sections.spaceTypology`. Leave as-is until content is confirmed active.

**One fix only:** If SectionArchOverlay is used within this component with a white background, remove it. Verify in `space-typology.tsx`.

---

## Section 5: Projects Reel

### What changes

1. **Background bug fix:** Change `bg-white,0.85)]` → `bg-[#0c0c0c]` (dark background — this section reads better as a dark band and the heading uses `text-white` which confirms the original intent)
2. **Section padding:** `py-12` (48px) — this is a band, not a full section
3. **Heading color:** `text-white` is correct — only active after bug fix #1 above
4. **Reel card dimensions:** Increase from `320px × 200px` to `360px × 240px` — more visual weight, better image crop

### Layout

- **Section background:** `#0c0c0c`
- **Section padding:** `py-12`
- **Header area:** `mb-8` (was `mb-6`)

### Element: Section Header

- **Overline:**
  - LTR: Raleway 600, `11px`, `letter-spacing: 0.16em`, `uppercase`, `#C1B167`
  - RTL: Alyamama 600, `12px`, `letter-spacing: 0`, `#C1B167`
  - Margin bottom: `mb-2`
- **Heading:**
  - LTR: Raleway 700, `28px` mobile / `36px` desktop, `letter-spacing: -0.02em`, `#ffffff`
  - RTL: Alyamama 700, `31px` mobile / `40px` desktop, `#ffffff`
- **"View all projects" link:** `text-[13px] text-white/60 hover:text-white border-b border-white/20 hover:border-white/60`
  - Arrow SVG: `rotate-180` in RTL

### Element: Reel Card

- **Dimensions:** `width: 360px, height: 240px` (was 320×200)
- **Border radius:** `0px`
- **Image:** `fill, object-cover, scale-[1.06] on hover, transition 500ms`
- **Gradient overlay:** `bg-gradient-to-t from-black/70 via-black/20 to-transparent` (was gray, should be black)
- **Hover overlay:** `bg-black/30 opacity-0 group-hover:opacity-100`
- **Bottom label area:** `p-4` (was `p-3`)
  - Category: Raleway 600, `10px`, `letter-spacing: 0.12em`, `uppercase`, `#C1B167`
  - Project name: Raleway 600, `14px`, `#ffffff`, `line-clamp-1`

### RTL Notes — Projects Reel
- Auto-scroll direction: when `isAr`, scroll direction reverses via `isRTL` prop — already implemented
- Header flex row: `flex items-end justify-between` — in RTL heading is on right, "View all" is on left
- Reel card text: `p-3 text-start` — auto from `dir="rtl"`

---

## Section 6: Collections

Conditional on `siteContent.sections.collections`. No layout changes specified — content-dependent. Normalize padding to `py-20` when active.

---

## Section 7: Craftsmanship Band (Materials Strip)

### What changes

1. **Background bug fix:** Change `bg-white,0.85)]` → `bg-white` — this section lives between two white sections, the images provide the visual interest
2. **Tagline fix:** Change `text-white` → `text-[#0c0c0c]` — currently invisible
3. **Section padding:** `py-16` (64px, was `py-14 md:py-20` — inconsistent)
4. **Image card size:** Keep `w-[220px] md:w-[260px]` and `aspect-[3/4]` — these are correct
5. **Overline color:** Change from `text-[#aaaaaa]` to `text-[#484848]` — `#aaa` fails contrast on white

### Element: Section Overline

- **Typography LTR:** Raleway 600, `11px`, `letter-spacing: 0.12em`, `uppercase`, `#484848`
- **Typography RTL:** Alyamama 600, `12px`, `#484848`
- **Margin bottom:** `mb-8` (inside the padding area before scroll strip)

### Element: Image Cards (auto-scroll strip)

- **Dimensions:** `w-[220px] md:w-[260px]`, `aspect-[3/4]`
- **Border radius:** `0px`
- **Hover:** `scale-[1.03] rotate-[0.3deg]` (reduce from 1.05 / 0.5deg — subtler is more premium)
- **Transition:** `duration-400`
- **No border:** Images are full-bleed, no border needed

### Element: Tagline (below strip)

- **Text (EN):** "Every surface. Considered."
- **Text (AR):** "كل سطح. وفق مواصفة."
- **Typography LTR:** Raleway 700, `18px`, `letter-spacing: 0.12em`, `uppercase`, `#0c0c0c`
- **Typography RTL:** Alyamama 700, `20px`, `letter-spacing: 0`, `#0c0c0c`
- **Margin top:** `mt-12` (48px — was `mt-10`, increase breathing room)
- **Text align:** center

### RTL Notes — Craftsmanship Band
- Auto-scroll: `isRTL={isAr}` already passed to `<AutoScroll>` — confirm AutoScroll reverses direction
- Tagline: `text-center` — direction-agnostic

---

## Section 8: Project Scale (Stats + Project Showcase)

### What changes

1. **CTA button bug fix:** Change `bg-white] text-white` → `bg-[#0c0c0c] text-white` (line 119 of project-scale.tsx)
2. **Stats color:** `text-[#C1B167]` for stat numbers — this is the one authorized non-CTA use of gold. Keep.
3. **Section padding:** Change from `py-14 md:py-20` to `py-16` (consistent)
4. **Remove SectionArchOverlay:** `variant="dimension" opacity={0.07}` on white background contributes nothing — remove
5. **Border on project cards:** Already `border border-[rgba(0,0,0,0.12)]` — increase to `border-[rgba(0,0,0,0.21)]` for visual definition

### Layout

- **Section background:** `#ffffff`
- **Section padding:** `py-16`
- **Container:** Standard

### Element: Section Heading

- **Overline:** Raleway 600, `11px`, `letter-spacing: 0.1em`, `uppercase`, `#484848`, `mb-3`
- **Heading:**
  - LTR: Raleway 700, `28px` mobile / `36px` desktop, `letter-spacing: -0.02em`, `#0c0c0c`
  - RTL: Alyamama 700, `31px` mobile / `40px` desktop
- **Margin bottom:** `mb-10`

### Element: Project Card (image + stats)

- **Layout:** `flex flex-col md:flex-row` (alternating: normal and `flex-row-reverse` for RTL or odd/even)
- **Border:** `1px solid rgba(0,0,0,0.21)`
- **Border radius:** `0px`

**Image half:**
- `w-full md:w-1/2 aspect-[16/9] md:aspect-auto min-h-[320px]`
- Motion: `opacity-0, x: ±40 → 1, 0` on scroll — keep, it's effective
- `object-cover`

**Text half:**
- `w-full md:w-1/2 bg-white p-8 md:p-12`

**Stats block:**
- Layout: `flex gap-8 mb-8`
- Stat value: Raleway 700, `40px`, `#C1B167`, `line-height: 1em`
- Stat label: Raleway 400, `12px`, `#484848`, `mt-1`, `leading-tight`, `max-w-[80px]`
- RTL stat: Alyamama 400, `13px`

**Description:**
- Raleway 400, `14px`, `#484848`, `line-height: 1.65em`, `mb-8`
- RTL: Alyamama 400, `15px`

**CTA button (FIXED):**
- `self-start bg-[#0c0c0c] text-white px-7 py-3 text-sm font-semibold rounded-none hover:bg-[#333] transition-colors`
- Minimum: `min-h-[44px]`

### RTL Notes — Project Scale
- `isAr ? "md:flex-row-reverse" : ""` — already in code, correct
- Motion `x` value: `isAr ? 40 : -40` — already implemented correctly
- Stat numbers: Eastern Arabic via `toLocaleString("ar-SA")` if numeric — implement in CountUp component

---

## Section 9: Brand Standard (4 Pillars)

### What changes

1. **Remove SectionArchOverlay:** `variant="crosshair"` on white background — remove entirely
2. **Section padding:** Change from `py-16 md:py-24` to `py-16` (normalize)
3. **Add top border:** `border-t border-[rgba(0,0,0,0.12)]` on the section element — provides visual separation from prior section
4. **Pillar number size:** Change from `text-4xl` to `text-[48px]` explicitly — `text-4xl` is 36px in Tailwind, we want 48px for stronger visual hierarchy
5. **Pillar number color:** Change from `text-gray-800` to `text-[#0c0c0c]` — token-compliant
6. **Heading color:** Change from `text-gray-900` to `text-[#0c0c0c]`
7. **Body copy color:** Change from `text-gray-600` to `text-[#484848]`
8. **Section overline color:** Change from `text-gray-500` to `text-[#484848]`

### Layout

- **Section background:** `#ffffff`
- **Section padding:** `py-16`
- **Top border:** `border-t border-[rgba(0,0,0,0.12)]`

### Element: Section Heading Block

- **Overline:** Raleway 600, `11px`, `letter-spacing: 0.12em`, `uppercase`, `#484848`, centered
- **Heading:**
  - LTR: Raleway 700, `28px` mobile / `36px` desktop, `letter-spacing: -0.02em`, `#0c0c0c`, centered
  - RTL: Alyamama 700, `31px` mobile / `40px` desktop, centered
- **Subheading:** Raleway 400, `14px`, `#484848`, `mt-3`, centered, `max-w-[480px] mx-auto`
- **Margin bottom:** `mb-12` (48px)

### Element: Pillar Grid

- **Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[15px]`

### Element: Pillar Card

- **Background:** `#ffffff`
- **Border:** `1px solid rgba(0,0,0,0.21)` (was `border-gray-200` — token-compliant replacement)
- **Padding:** `p-8 md:p-10`
- **Border radius:** `0px`

**Pillar number:**
- Raleway 800, `48px`, `#0c0c0c`, `line-height: 1em`, `mb-5`

**Pillar heading:**
- LTR: Raleway 700, `16px`, `#0c0c0c`, `mb-3`
- RTL: Alyamama 700, `18px`, `#0c0c0c`

**Pillar body:**
- LTR: Raleway 400, `14px`, `#484848`, `line-height: 1.65em`
- RTL: Alyamama 400, `15px`, `#484848`, `line-height: 1.7em`

**States:**
- Default: no shadow
- Hover: `shadow-sm`, `border-[rgba(0,0,0,0.38)]` — subtle lift

### RTL Notes — Brand Standard
- Heading: `text-center` — direction-agnostic
- Pillar cards: text-align inherits from `dir="rtl"` — body text aligns right automatically
- Grid: fills right-to-left in RTL automatically

### Responsive Notes — Brand Standard
- 390px: `grid-cols-1` — stacked, full width. Each card gets full horizontal space.
- 768px: `grid-cols-2` — 2×2 grid
- 1024px+: `grid-cols-4` — single row

---

## Section 10: Material Selector

Conditional on `siteContent.sections.materialSelector`. Normalize padding to `py-16` when active. No other changes specified — await content confirmation.

---

## Section 11: Insight Editorial

Conditional on `siteContent.sections.insightEditorial`. Normalize padding to `py-16`. No other changes.

---

## Section 12: Promotional Banner (PromoBanner)

Keep as-is. Dark background band, white text, consultation CTA. Padding `py-16` for consistency.

**One fix:** Confirm the PromoBanner component uses `bg-[#0c0c0c]` as background. If it uses a different token, update.

---

## Section 13: Newsletter + Social

### What stays
Centered column, email input, social links. Correct and minimal.

### What changes
1. **Section padding:** Change from `py-12` to `py-16`
2. **Heading:** Fix `text-gray-900]` typo → `text-[#0c0c0c]`
3. **Heading typography:** Raleway 700, `22px` desktop, `#0c0c0c`
4. **Body copy:** Raleway 400, `14px`, `#484848`, `mt-2`, `max-w-[360px] mx-auto`
5. **Social links:** Change from text-only ("Instagram", "LinkedIn", "Facebook") to icon+text pairs — 20px SVG icons + label. Use `gap-2` between icon and label, `gap-8` between pairs.

### Element: Newsletter Input + Submit

Per design system inputs spec:
- Input: `w-full px-4 py-3 border border-[rgba(0,0,0,0.38)] rounded-sm text-sm bg-white placeholder:text-[#484848]/60 focus:border-[#0c0c0c] focus:outline-none focus:ring-1 focus:ring-[#0c0c0c]/20`
- Submit button (inline): `bg-[#0c0c0c] text-white px-5 py-3 text-sm font-semibold rounded-none hover:bg-[#333]`
- Row layout: `flex gap-0` — input and button share the row with no gap (attached look)

### RTL Notes — Newsletter
- Input: `text-end` in RTL, `placeholder:text-end`
- Submit button: flips to left side in RTL via flex-row-reverse or logical properties

---

## Section 14: Consultation CTA

Conditional on `siteContent.sections.consultationCta`. When rendered, normalize padding to `py-20` — this is a major conversion section and deserves generous breathing room.

---

## Global Fixes Summary (Apply Project-Wide)

These are not section-specific — apply throughout the codebase:

### 1. Tailwind Class Typos
Search for `text-gray-900]` (missing opening `[`) and replace with `text-[#0c0c0c]`.
Search for `bg-white]` and replace with `bg-white`.
These are scattered across page.tsx, project-scale.tsx, and product-card.tsx.

```bash
# Grep to find all occurrences
grep -rn "gray-900\]" src/
grep -rn "bg-white\]" src/
```

### 2. Remove SectionArchOverlay from White-Background Sections
The `SectionArchOverlay` component is designed for dark or photo-heavy sections. On white
backgrounds at 4–7% opacity it is invisible and adds unnecessary DOM complexity. Remove from:
- `brand-standard.tsx` (crosshair variant)
- `project-scale.tsx` (dimension variant)
- Any other white-bg section found on audit

Keep `SectionArchOverlay` only in:
- Hero (via blueprint-overlay — this is a separate component and is correct)

### 3. Normalize All "btn-press" Usages
The `btn-press` class appears to be a custom class. Audit `globals.css` to confirm its definition.
If it conflicts with background token (e.g., overrides `bg-[#0c0c0c]`), remove it from button elements
and rely solely on Tailwind utility classes per the design system.

---

## Accessibility

| Element | Contrast Ratio | Passes |
|---------|---------------|--------|
| `#0c0c0c` text on `#ffffff` | 20.5:1 | AAA |
| `#484848` body text on `#ffffff` | 9.7:1 | AAA |
| `#ffffff` on `#0c0c0c` (CTA buttons) | 20.5:1 | AAA |
| `#C1B167` label on `#0c0c0c` (hero overline) | 6.8:1 | AA |
| `#e53e3e` badge on `#ffffff` | 4.6:1 | AA |
| `#484848` text on `#fafafa` (card labels) | 8.9:1 | AAA |

- All interactive elements: minimum `44×44px` touch target (enforced via padding)
- Focus indicator: `outline-2 outline-[#0c0c0c] outline-offset-2` on all interactive elements
- Hero: `aria-live="polite"` on section — already implemented
- Slide indicators: `role="tab"`, `aria-selected` — already implemented
- Category cards: `<Link>` with descriptive text (category name is the label)
- Skip-to-content: confirm `<a href="#main-content">` exists in layout.tsx
- ProductCard: card link includes product name as accessible text; "Add to Cart" button is outside the Link — correct pattern

---

## RTL Global Notes

The following apply across all sections and must be verified in RTL (AR) locale:

**Icons that must flip (add `rtl:rotate-180` or conditional `rotate-180`):**
- Arrow chevrons in CTA buttons
- "View all" link arrows
- Slide indicator navigation (ArrowLeft/ArrowRight keyboard handlers — swap in RTL)

**Icons that must NOT flip:**
- Logo
- Social media icons
- Discount badges

**Typography reminders:**
- Arabic font: Alyamama (already in design system as `font-alyamama`)
- Arabic font-size: 10% larger than English equivalent (already in hero — apply consistently)
- Arabic letter-spacing: `0 !important` — never use tracking on Arabic text
- Arabic line-height: `1.1em` headlines / `1.7em` body (Arabic is taller than Latin)

**Visual balance check:**
- Arabic body text renders denser and taller than English — sections with fixed heights
  may feel cramped in AR. For Project Scale text half (`p-8 md:p-12`), Arabic descriptions
  are significantly longer. If Arabic body text overflows at 768px, increase text half to
  `md:w-[55%]` in RTL and image half to `md:w-[45%]`.

**Slider/reel direction:**
- ProjectsReel auto-scroll: `isRTL` prop already passes to AutoScroll — verify AutoScroll
  actually reverses `animation-direction` in RTL, not just flips the container visually.

---

## Responsive Summary

| Viewport | Key Layout Changes |
|----------|-------------------|
| 390px (mobile) | Hero: single image full-bleed, text bottom. Categories: 3-col grid (2 rows). Products: 2-col grid. All sections: stacked column. |
| 768px (tablet) | Hero: desktop image, medium text. Categories: 6-col single row. Products: 3-col grid. Project scale: 50/50 horizontal split appears. |
| 1024px (desktop) | Products: 4-col grid. Brand pillars: 4-col. Full nav visible. |
| 1440px (wide) | Centered container at max-w-screen-2xl. Section spacing feels generous. Hero text at max size. |

Touch targets: All interactive elements `min-h-[44px] min-w-[44px]` enforced via padding on mobile.

---

## File Locations — Changes Required

| File | Changes |
|------|---------|
| `src/app/[locale]/page.tsx` | Fix "Shop All Products" button class (line ~213); fix `text-gray-900]` typos |
| `src/components/shop/product-card.tsx` | Add parseCategory(); fix button bg color; fix `text-gray-900]` typo |
| `src/components/sections/brand-standard.tsx` | Remove SectionArchOverlay; fix color tokens; increase pillar number size |
| `src/components/sections/project-scale.tsx` | Fix CTA button; remove SectionArchOverlay; fix border color; fix `text-gray-900]` typo |
| `src/components/sections/projects-reel.tsx` | Fix background class; increase card dimensions |
| `src/components/sections/craftsmanship-band.tsx` | Fix background class; fix tagline color; fix overline color |
| `src/app/[locale]/page.tsx` (Category strip) | Full replacement with new CategoryGrid component |
| New: `src/components/sections/category-grid.tsx` | New component per Section 2 spec |
