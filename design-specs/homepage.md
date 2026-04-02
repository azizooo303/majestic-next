# Visual Spec: Homepage — Full Redesign
**Version**: 1.0
**Date**: 2026-04-02
**Status**: Ready for Build

---

## Design System Reference

All values derived from `departments/wordpress-next/design-system/MASTER.md` (workspace.ae B2B).

| Token | Value | Note |
|-------|-------|------|
| `--tdc-primary` | `#0c0c0c` | Text, buttons, borders |
| `--tdc-white` | `#ffffff` | All backgrounds |
| `--tdc-dark` | `#484848` | Body text, secondary labels |
| `--tdc-medium` | `#333333` | Nav, strong borders |
| `--tdc-light` | `#fafafa` | Card hover bg, image container |
| `--tdc-border` | `rgba(0,0,0,0.21)` | Dividers, card edges |
| `--tdc-border-dark` | `rgba(0,0,0,0.38)` | Strong input borders |
| `--tdc-sale` | `#e53e3e` | Sale badges |

**Fonts:** Raleway (LTR headings + UI) / Alyamama (all Arabic RTL text)
**Border radius:** `rounded-none` (0px) for all major elements, `rounded-sm` (2–4px) for inputs/badges only
**Spacing:** 8px base unit — all measurements in multiples of 8
**Container:** `w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 xl:px-10`

---

## Grid

| Breakpoint | Columns | Gutter | Container Padding |
|------------|---------|--------|-------------------|
| 390px (mobile) | 4 | 16px | `px-4` (16px) |
| 768px (tablet) | 8 | 16px | `px-6` (24px) |
| 1440px (desktop) | 12 | 16px | `px-8–px-10` (32–40px) |

Gap between product cards and category tiles: `15px` throughout (workspace.ae standard).

---

## Section 1: Header

**Reference spec:** This section supersedes any placeholder header. The existing hero-banner.md spec handles the hero below; this header spec is the sticky navigation layer above it.

### Component Tree

```
<Header>
  ├── <PromoBanner> (optional — see spec below)
  ├── <HeaderMain>
  │   ├── <Logo>
  │   ├── <NavPrimary>
  │   │   └── <NavItem> × N (with <MegaMenuPanel> on "Desks")
  │   └── <HeaderUtils>
  │       ├── <SearchBar>
  │       ├── <LanguageToggle>
  │       ├── <AccountLink>
  │       └── <CartButton>
  └── <MobileHeader>
      ├── <Logo>
      ├── <MobileUtils> (cart icon + hamburger)
      └── <NavDrawer> (off-canvas)
```

---

### Element: PromoBanner

**Decision:** Keep the promo banner. Remove it entirely is the temptation, but B2B buyers respond to concrete offers (free delivery threshold, installation included). Redesign it — do not delete it.

- **Dimensions:** W full × H `40px` (desktop) / `36px` (mobile)
- **Background:** `#0c0c0c`
- **Typography:** Raleway 500, `12px`, `letter-spacing: 0.08em`, `text-transform: uppercase`, color `#ffffff`
- **Arabic:** Alyamama 500, `13px` (10% larger), `letter-spacing: 0`
- **Content (EN):** `Free delivery on orders above SAR 2,000 — call 800-XXX-XXXX`
- **Content (AR):** copywriter to confirm; same layout, text-align right
- **Layout:** `flex items-center justify-center`
- **RTL:** Text alignment `end`; no icon flips (no directional icons)
- **States:** No hover state. Static bar.
- **Dismiss:** No dismiss button — this is persistent, not a cookie banner.
- **Responsive:** Same at mobile, just shorter text — copy truncates to `Free delivery above SAR 2,000`

---

### Element: Header Main Bar

- **Position:** `fixed top-0 w-full z-50` — sticky, always visible
  - When PromoBanner is present: `top: 40px` desktop / `top: 36px` mobile
- **Height:** `80px` desktop / `64px` mobile
- **Background:** `#ffffff`
- **Border bottom:** `1px solid rgba(0,0,0,0.21)`
- **Transition:** `box-shadow` on scroll: default none → `shadow-sm` when `scrollY > 40px`
- **Layout:** `flex items-center justify-between gap-8 h-full`

---

### Element: Logo

- **Position:** Leftmost item in header flex row (LTR) / rightmost (RTL — logical `ms-auto` flip)
- **Max width:** `160px` desktop / `120px` mobile
- **Height:** auto (maintain aspect ratio)
- **File:** SVG or `next/image` with explicit `width={160} height={40}`
- **Alt:** "Majestic Furniture — Office Furniture Saudi Arabia"
- **RTL:** Logo does NOT flip. Positioned at `end` in RTL (right side becomes reading anchor for AR users — this is intentional. The logo anchors the brand at the start of the eye path.)

---

### Element: NavPrimary

- **Display:** `hidden lg:flex items-center gap-0` (hidden on mobile, shown on desktop)
- **Position:** Adjacent to logo (left-center region of header)
- **Item padding:** `px-4 py-[28px]` — creates 80px total height click zone
- **Typography:** Raleway 600, `13px`, `letter-spacing: 0.04em`, `text-transform: uppercase`, color `#0c0c0c`
- **Arabic:** Alyamama 600, `14px`, `letter-spacing: 0`

**Nav items (exact list — LTR EN):**

| Order | Label EN | Label AR | Has Mega Menu? |
|-------|----------|----------|----------------|
| 1 | Chairs | الكراسي | No |
| 2 | Desks | المكاتب | Yes |
| 3 | Storage | التخزين | No |
| 4 | Lounge | صالات الانتظار | No |
| 5 | Acoustic | الصوتيات | No |
| 6 | Accessories | الإكسسوارات | No |
| 7 | E-Quotation | طلب عرض سعر | No (distinct CTA treatment) |

**"Home" nav item:** Removed. Logo serves as the home link. This frees one nav slot.

**"E-Quotation" item treatment:**
- Does not follow the standard nav item style
- Styled as an outlined pill: `border border-[rgba(0,0,0,0.38)] px-4 py-2 rounded-sm text-[#0c0c0c]`
- Hover: `bg-[#0c0c0c] text-white border-[#0c0c0c]`
- Positioned last in row with `ms-4` margin separator
- This item is a conversion tool, not a browse item — visual distinction earns its place

**Hover states (standard items):**
- Default: `#0c0c0c` text, no underline
- Hover: `border-bottom: 2px solid #0c0c0c` (appears beneath the nav item, aligned to bottom of the 80px header)
- Active page: same as hover state — persistent underline
- Focus visible: `outline: 2px solid #0c0c0c`, `outline-offset: 2px`

**RTL:** Flex row direction reversed via `dir="rtl"` inheritance. E-Quotation item remains last in reading order but appears leftmost in RTL.

---

### Element: MegaMenuPanel (Desks)

- **Trigger:** Hover on "Desks" nav item (desktop only)
- **Reveal animation:** `height: 0 → auto`, `opacity: 0 → 1`, `200ms ease-out`
- **Position:** `absolute top-full left-0 w-full` (full width, below header)
- **Background:** `#ffffff`
- **Border bottom:** `1px solid rgba(0,0,0,0.21)`
- **Shadow:** `shadow-md`
- **Padding:** `pt-8 pb-10 px-10`
- **Layout:** `grid grid-cols-[1fr_1fr_1fr_1fr_320px] gap-8`
  - Columns 1–4: subcategory links
  - Column 5: promotional image card

**Subcategory column:**
- Label: Raleway 700, `11px`, `letter-spacing: 0.1em`, `uppercase`, `#484848`, `mb-3`
- Links: Raleway 400, `14px`, `#0c0c0c`, `leading-[2.0]`
- Link hover: `#484848` + underline offset 2px

**Subcategory list:**
- Executive Desks
- Workstations
- Height Adjustable Desks
- Meeting Tables
- Reception Desks

**Promo card (column 5):**
- `aspect-[4/3]` image, `object-cover`, `rounded-none`
- Below image: product name in Raleway 600 `14px`, price in Raleway 700 `14px`
- "Shop Now" link in `text-[#0c0c0c] text-sm underline-offset-2 hover:underline`

**RTL:** Grid column order reverses. Promo card moves to leftmost column. Logical `ps/pe` used throughout.

---

### Element: HeaderUtils (right group)

Layout: `flex items-center gap-4`

**SearchBar:**
- Desktop: visible, inline, `width: 200px` — expands to `280px` on focus via CSS `transition: width 200ms`
- Input: `h-9 px-3 text-sm border border-[rgba(0,0,0,0.21)] rounded-sm bg-[#fafafa]`
- Magnifier icon: `16×16px`, `#484848`, positioned `pe-3` inside input
- Focus: `border-[#0c0c0c] bg-white width: 280px`
- Mobile: icon only (magnifier), triggers full-width overlay search bar

**LanguageToggle:**
- Display: `EN | عربي` — pipe separator, Raleway 500 `12px` (LTR side) / Alyamama 500 `13px` (AR side)
- Active locale: `font-weight: 700`, `color: #0c0c0c`
- Inactive locale: `color: #484848`, hover `#0c0c0c`
- Separator `|`: `color: rgba(0,0,0,0.21)`, `px-2`
- No dropdown. Direct locale switch link.
- Touch target: `min-height: 44px` via padding

**AccountLink:**
- Label: "Sign In" (EN) / "تسجيل الدخول" (AR)
- Typography: Raleway 500 `13px` / Alyamama 500 `14px`
- Color: `#0c0c0c`
- Hover: `#484848`
- Hidden on mobile (moved to nav drawer)

**CartButton:**
- Icon: shopping bag SVG, `20×20px`, `#0c0c0c`
- Count badge:
  - Position: `absolute top-[-4px] end-[-6px]`
  - Size: `16px × 16px` minimum, `border-radius: 50%` (this is the one element that warrants a circle — it is a count indicator, not a button)
  - Background: `#0c0c0c`
  - Text: `#ffffff`, Raleway 700, `10px`, centered
  - Shows `0` when cart is empty (always visible)
  - At count ≥ 10: badge grows to `20px × 16px` to fit two digits
- Button wrapper: `relative inline-flex p-2`, `min-height: 44px min-width: 44px`
- Hover: badge stays, icon color shifts to `#484848`

---

### Element: MobileHeader

- **Height:** `64px`
- **Background:** `#ffffff`
- **Border bottom:** `1px solid rgba(0,0,0,0.21)`
- **Layout:** `flex items-center justify-between px-4 h-full`
- **Left side (LTR):** Hamburger icon
- **Center:** Logo
- **Right side (LTR):** Cart icon with badge

**Hamburger icon:**
- `24×18px` three-line icon, `#0c0c0c`
- Touch target wrapper: `min-44×44px`
- State: 3-line → X (animated with CSS rotate, `200ms`)
- RTL: hamburger on right side, cart on left

**NavDrawer:**
- Position: `fixed inset-y-0 start-0 z-[60]` — slides from left (LTR) / right (RTL)
- Width: `min(320px, 85vw)`
- Background: `#ffffff`
- Border inline-end: `1px solid rgba(0,0,0,0.21)`
- Animation: `translateX(-100%) → translateX(0)`, `250ms ease-out` (RTL: inverse)
- Backdrop: `fixed inset-0 bg-black/40 z-[55]`, tap to close

**Drawer contents:**
- Close button (X): top `end` corner, `p-4`, `24×24px` icon
- Nav items: full-width list, `border-b border-[rgba(0,0,0,0.21)]`
  - Padding: `px-6 py-4`
  - Raleway 600, `15px`, `#0c0c0c`
  - Accordion expand for Desks (chevron right/left by locale)
- Bottom section: Sign In link + Language Toggle

---

### Responsive Summary — Header

| Element | 1440px | 768px | 390px |
|---------|--------|-------|-------|
| PromoBanner height | 40px | 40px | 36px |
| Header height | 80px | 80px | 64px |
| Logo max-width | 160px | 140px | 120px |
| Nav items | visible | hidden (≤1024px) | hidden |
| SearchBar | inline 200px | icon only | icon only |
| AccountLink | visible | hidden | hidden |
| CartButton | visible | visible | visible |
| Hamburger | hidden | visible (≤1024px) | visible |

---

### Accessibility — Header

| Element | Contrast | Passes |
|---------|----------|--------|
| Nav text `#0c0c0c` on `#ffffff` | 19.6:1 | AAA |
| Promo text `#ffffff` on `#0c0c0c` | 19.6:1 | AAA |
| `#484848` utility text on `#ffffff` | 9.7:1 | AAA |
| Cart badge `#ffffff` on `#0c0c0c` | 19.6:1 | AAA |

- `<header role="banner">`
- `<nav aria-label="Main navigation">`
- Cart button: `aria-label="Shopping cart, N items"`
- Language toggle: `aria-label="Switch language"`, `lang` attribute on each option
- Skip-to-content: `<a href="#main-content" className="sr-only focus:not-sr-only ...">` — handled at layout level
- Drawer: `aria-modal="true"`, focus trap when open, `Escape` key closes

---

## Section 2: Hero / Banner

**Reference:** `departments/wordpress-next/design-specs/hero-banner.md` v1.0 is the primary spec for layout, typography, animation, and RTL behavior. This section adds the **slide indicators** spec that was not addressed in v1.0, and clarifies the carousel mechanism.

### Delta from hero-banner.md v1.0

#### 2A. Slide Indicators — Horizontal Lines

**Decision:** Replace dot indicators with horizontal line indicators. This is the correct premium B2B pattern. Lines connote sequence and progress; dots connote pagination. For 5 slides, lines are visually cleaner and communicate "there is more content" more clearly.

**Component:** `<SlideIndicators>`

- **Position:** `absolute bottom-8 start-10` (LTR: bottom-left; RTL: bottom-right via logical `start`)
  - Mobile: `bottom-4 start-4`
- **Layout:** `flex gap-3 items-end`
- **Z-index:** `z-20`

**Inactive indicator:**
- Dimensions: `W 32px × H 2px`
- Background: `rgba(255,255,255,0.4)` on dark image areas
  - On white/light backgrounds (desktop left panel): `rgba(0,0,0,0.2)`
- `border-radius: 0` (sharp)
- `cursor: pointer`
- Touch target wrapper: `p-3` invisible padding to reach 44px touch zone

**Active indicator:**
- Dimensions: `W 56px × H 2px` — wider than inactive to signal current position
- Background: `#ffffff` on dark areas / `#0c0c0c` on light areas
- Transition: `width 300ms ease-out` as slide activates

**Progress fill (optional enhancement):**
- Active indicator has an inner `<span>` that fills from `width: 0%` to `width: 100%` over the auto-play interval (6s)
- Background: same as active indicator
- Animation: `linear` fill — progress indicator for auto-advance timing
- Resets on manual navigation

**Hover state (inactive lines):**
- Background opacity lifts: `rgba(255,255,255,0.7)` / `rgba(0,0,0,0.4)`
- `transition: opacity 150ms`

**RTL:** `dir="rtl"` inherits, flex row reverses, indicators read right-to-left matching slide order in Arabic context.

#### 2B. Carousel Controls

- **Prev/Next arrows:** Visually hidden (no visible arrow buttons). Navigation via indicators only + keyboard + swipe.
- **Keyboard:** `ArrowLeft` / `ArrowRight` — advances slides; respects RTL (`ArrowRight` = next in LTR, `ArrowLeft` = next in RTL)
- **Touch:** Swipe left/right (framer-motion `drag="x"` on slide container)
- **Auto-advance:** 6s interval, pauses on hover/focus, resumes on blur
- `aria-roledescription="carousel"` on section, `aria-label="Featured collections"`, each slide `role="group" aria-roledescription="slide" aria-label="N of 5"`

#### 2C. Vignette Gradient

The hero-banner.md v1.0 specifies a left-side gradient scrim (`from-white to-transparent`) for the split layout. The brief asks for a vignette to protect text legibility. Confirmed:

- **LTR desktop:** `bg-gradient-to-r from-white via-white/60 to-transparent` — covers left 40% of section
- **RTL desktop:** `bg-gradient-to-l from-white via-white/60 to-transparent` — covers right 40%
- **Mobile:** No gradient (stacked layout, no overlay needed — per hero-banner.md section 9.2)

All other hero properties (typography, CTA, trust strip, animation, responsive behavior) remain as specified in `hero-banner.md` v1.0.

---

## Section 3: Category Navigator

### Component Tree

```
<CategoryNavigator>
  ├── <SectionHeader>
  │   ├── <SectionTitle> "Shop by Category"
  │   └── <ViewAllLink> "View All Categories →"
  └── <CategoryGrid>
      └── <CategoryTile> × 6
          ├── <TileImageContainer>
          │   └── <Image> (single product on neutral bg)
          └── <TileLabel>
              └── <CategoryName>
```

---

### Element: SectionHeader

- **Layout:** `flex items-baseline justify-between`
- **Padding top:** `80px` desktop / `48px` tablet / `40px` mobile
- **Padding bottom:** `32px` desktop / `24px` tablet / `24px` mobile
- **Margin bottom (to grid):** `0` — padding handles spacing

**SectionTitle "Shop by Category":**
- Font: Raleway 700, `34px` desktop / `28px` tablet / `24px` mobile
- Letter spacing: `-0.03em` desktop / `-0.02em` smaller
- Line height: `1.0`
- Color: `#0c0c0c`
- Arabic: Alyamama 700, `37px / 31px / 26px`, `letter-spacing: 0`

**ViewAllLink:**
- Font: Raleway 500, `13px`
- Color: `#484848`
- Letter spacing: `0.04em`, uppercase
- Arrow: `→` (16px inline, LTR) / `←` (RTL)
- Hover: `color: #0c0c0c`, underline
- Hidden on mobile (full-width "View All" button at section bottom on mobile)

---

### Element: CategoryGrid

- **Display:** CSS Grid
- **Desktop (1440px):** `grid-cols-6 gap-[15px]`
- **Tablet (768px):** `grid-cols-3 gap-[15px]`
- **Mobile (390px):** Horizontal scroll — `flex flex-nowrap gap-[15px] overflow-x-auto` with `-mx-4 px-4` to bleed to screen edges
  - Scrollbar: hidden (`scrollbar-none` / `-webkit-scrollbar: none`)
  - First tile: no extra margin. Scroll hint: last tile partially visible (tile width `calc(100% - 40px)` so 6th tile bleeds off-screen)

**Padding bottom:** `80px` desktop / `48px` tablet / `40px` mobile

---

### Element: CategoryTile

**Dimensions:**
- Desktop: `W auto (1/6 of container) × H auto` — aspect ratio enforced by image container
- Tablet: `W auto (1/3) × H auto`
- Mobile: `W 160px × H auto` (fixed width for horizontal scroll)

**Structure:**
```
┌─────────────────────┐
│                     │
│   [Image Container] │  aspect-ratio: 3/4 (portrait, 0.75)
│   bg: #fafafa       │
│   object-contain    │  (single product shot — must not crop product)
│                     │
├─────────────────────┤
│  Category Name      │  below image, full-width, bg: white
└─────────────────────┘
```

**TileImageContainer:**
- `aspect-[3/4]` — portrait, taller than wide
- Background: `#fafafa`
- Overflow: `hidden`
- Image: `next/image fill`, `object-contain`, `object-center`, padding `8px` inside container
  - `object-contain` (not `object-cover`) — single product photography must not be cropped. The neutral background fills empty space.
- Border: `1px solid rgba(0,0,0,0.21)` on container, not on full tile
- Lazy load: yes (not priority — below fold)

**TileLabel:**
- Background: `#ffffff`
- Padding: `pt-3 pb-0` (12px top, 0 bottom)
- **CategoryName:** Raleway 600, `13px`, `letter-spacing: 0.04em`, `text-transform: uppercase`, `#0c0c0c`
- Arabic: Alyamama 600, `14px`, `letter-spacing: 0`, no uppercase transform
- Text align: `start` (left LTR / right RTL)

**Category list (exact labels):**

| EN Label | AR Label |
|----------|----------|
| Executive Chairs | الكراسي التنفيذية |
| Executive Desks | المكاتب التنفيذية |
| Meeting Tables | طاولات الاجتماعات |
| Storage Solutions | وحدات التخزين |
| Lounge Seating | أثاث الاستقبال |
| Acoustic Pods | الوحدات الصوتية |

**Hover state:**
- Image container: `scale-[1.02]` on `<Image>` inner element (not the container — border stays fixed)
- Border: `1px solid rgba(0,0,0,0.38)` — border darkens
- CategoryName: `#484848` shift
- Timing: `transition: all 150ms ease-out`
- Cursor: `pointer`

**Focus state:**
- `outline: 2px solid #0c0c0c`, `outline-offset: 2px` on the `<a>` wrapper
- Tab-navigable

**States:**
- Default: as above
- Hover: image scales, border darkens (150ms)
- Focus: outline ring
- Loading: `#fafafa` shimmer block fills `aspect-[3/4]` container — use CSS `animate-pulse`
- Empty (no image): `#fafafa` block, centered category initial in `#484848`, Raleway 700, `32px`

---

### Responsive Summary — Category Navigator

| Element | 1440px | 768px | 390px |
|---------|--------|-------|-------|
| Grid columns | 6 | 3 | Horizontal scroll, 160px tiles |
| Tile aspect | 3/4 | 3/4 | 3/4 |
| Section padding top | 80px | 48px | 40px |
| ViewAllLink | visible (inline) | visible (inline) | Hidden (replaced by bottom CTA) |

**Mobile "View All" button (390px only):**
- Full-width outlined button: `w-full border border-[rgba(0,0,0,0.38)] py-3 text-sm font-semibold uppercase letter-spacing-[0.06em]`
- `margin-top: 24px`
- Hover: `bg-[#0c0c0c] text-white border-[#0c0c0c]`

---

### RTL Notes — Category Navigator

- Grid renders right-to-left in RTL (CSS Grid + `dir="rtl"` handles this automatically)
- Horizontal scroll on mobile starts from right edge in RTL
- ViewAllLink arrow flips to `←`
- `text-align: start` on tile labels resolves correctly in both directions

---

## Section 4: Product Grid — "New Arrivals"

**Section title decision:** "New Arrivals" — chosen over "Featured Collection." "Collection" implies curation and may exclude buyers looking for specific SKUs. "New Arrivals" creates browse urgency appropriate for B2B procurement and is broadly understood in both EN and AR markets.

### Component Tree

```
<NewArrivals>
  ├── <SectionHeader>
  │   ├── <SectionTitle> "New Arrivals"
  │   └── <ViewAllLink> "View All →"
  └── <ProductGrid>
      └── <ProductCard> × 8 (desktop: 4 per row, 2 rows)
          ├── <CardImageContainer>
          │   ├── <DiscountBadge> (conditional)
          │   ├── <Image>
          │   └── <QuickViewOverlay>
          └── <CardInfo>
              ├── <CategoryLabel>
              ├── <ProductName>
              ├── <BrandName>
              ├── <PriceRow>
              │   ├── <CurrentPrice>
              │   └── <OriginalPrice> (conditional)
              └── <AddToCartButton>
```

---

### Element: SectionHeader (New Arrivals)

- **Layout:** `flex items-baseline justify-between`
- **Padding top:** `80px` desktop / `48px` tablet / `40px` mobile
- **Padding bottom:** `32px` desktop / `24px` mobile

**SectionTitle "New Arrivals":**
- Raleway 700, `34px` desktop / `28px` tablet / `24px` mobile
- Letter spacing: `-0.03em`
- Line height: `1.0`
- Color: `#0c0c0c`
- Arabic: Alyamama 700, `37px / 31px / 26px` — "وصل حديثاً" or "منتجات جديدة" (copywriter to confirm)

**ViewAllLink:**
- Same spec as Category Navigator ViewAllLink above

---

### Element: ProductGrid

- **Desktop (1440px):** `grid grid-cols-4 gap-[15px]` — 8 cards, 2 rows
- **Tablet (768px):** `grid grid-cols-2 gap-[15px]`
- **Mobile (390px):** `grid grid-cols-1 gap-[15px]` — single column, cards full-width

**Show count:** 8 products (desktop: fills 4×2 grid neatly). No odd orphan cards.

**Padding bottom:** `80px` desktop / `48px` tablet / `40px` mobile

---

### Element: ProductCard

Following MASTER card spec. Full anatomy below.

**Card Dimensions:**
- Width: auto (fills grid column)
- Min-height: none — content drives height
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.21)`
- Border radius: `rounded-none`
- Overflow: `hidden`
- Hover shadow: `shadow-md` (on whole card)
- Hover transition: `200ms ease-out`

**CardImageContainer:**
- Aspect ratio: `aspect-[281/356]` — portrait (per MASTER ~0.79:1)
- Background: `#fafafa`
- Overflow: `hidden`
- Image: `next/image fill object-cover`, lazy loaded (priority false)
- `group-hover:scale-[1.03]` on image inner element, `transition: transform 300ms ease-out`

**DiscountBadge (conditional):**
- Appears only when `product.discount` exists
- Position: `absolute top-2 start-2 z-10`
- Dimensions: auto height, min-width `40px`, `px-2 py-1`
- Background: `#e53e3e`
- Text: `#ffffff`, Raleway 700, `11px`
- Border radius: `rounded-sm` (2px — one of the few rounded elements)
- Content: `-25%` format

**QuickViewOverlay:**
- Position: `absolute inset-0`
- Default: `bg-black/0 opacity-0`
- Hover: `bg-black/10 opacity-100`
- Transition: `200ms ease-out`
- Contains: centered "Quick View" button
  - Appears at `bottom-3`, centered horizontally
  - `bg-white text-[#0c0c0c] px-4 py-2 text-xs font-semibold rounded-none border border-[rgba(0,0,0,0.21)]`
  - Hover: `bg-[#0c0c0c] text-white border-[#0c0c0c]`

**CardInfo:**
- Padding: `p-3` (12px all sides)
- Background: `#ffffff`

**CategoryLabel:**
- Raleway 400, `11px`, `letter-spacing: 0.08em`, `text-transform: uppercase`, `#484848`
- Arabic: Alyamama 400, `12px`, `letter-spacing: 0`
- Margin bottom: `4px`

**ProductName:**
- Raleway 700, `14px`, `line-height: 1.3`, `#0c0c0c`
- Max 2 lines — overflow ellipsis
- Arabic: Alyamama 700, `15px`
- Margin bottom: `2px`

**BrandName:**
- Raleway 400, `12px`, `#484848`
- Arabic: Alyamama 400, `13px`
- Margin bottom: `8px`

**PriceRow:**
- Layout: `flex items-center gap-2 flex-wrap`
- CurrentPrice: Raleway 700, `15px`, `#0c0c0c`
  - Content: `SAR 1,234` format (Eastern Arabic numerals in AR locale: `١٬٢٣٤ ر.س`)
- OriginalPrice (conditional): Raleway 400, `13px`, `#484848`, `line-through`
- Margin bottom: `8px`

**AddToCartButton:**
- Full width: `w-full`
- Height: `36px` (`py-[8px]`)
- Background: `#0c0c0c`
- Text: `#ffffff`, Raleway 600, `12px`, `letter-spacing: 0.04em`, `text-transform: uppercase`
- Border radius: `rounded-none`
- Hover: `bg-[#333333]`
- Active: `scale-[0.98]`
- Focus visible: `outline: 2px solid #0c0c0c, offset: 2px`
- Loading: spinner 14px white, centered; button text hidden
- Disabled: `bg-[#484848] opacity-60 cursor-not-allowed`
- Arabic button text: "أضف للسلة" — Alyamama 600, `13px`

---

### States — ProductCard

| State | Behavior |
|-------|----------|
| Default | Border `rgba(0,0,0,0.21)`, no shadow |
| Hover | Shadow `shadow-md`, image scale `1.03`, QuickView overlay visible |
| Focus (keyboard) | `outline: 2px solid #0c0c0c` on card wrapper `<a>` |
| Loading | Shimmer skeleton: `#fafafa` block fills aspect-ratio container, info area has 3 skeleton lines of `#fafafa animate-pulse` |
| Error | Image replaced by `#fafafa` block with `#484848` image-broken icon centered, card info renders normally |
| Empty (no products) | Section does not render; shows nothing (handled at data layer) |

---

### "View All" Section CTA

- Position: below ProductGrid, centered
- Margin top: `40px` desktop / `32px` mobile
- Button: outlined, `border border-[rgba(0,0,0,0.38)] px-10 py-3 text-sm font-semibold uppercase letter-spacing-[0.08em] text-[#0c0c0c]`
- Hover: `bg-[#0c0c0c] text-white border-[#0c0c0c]`
- Min width: `200px`
- Content: "View All Products" (EN) / "عرض جميع المنتجات" (AR)
- Padding bottom after button: `80px` desktop / `48px` mobile

---

### Responsive Summary — New Arrivals

| Element | 1440px | 768px | 390px |
|---------|--------|-------|-------|
| Grid columns | 4 | 2 | 1 |
| Cards shown | 8 | 6 (3×2) | 4 (4×1) |
| Card image aspect | 281/356 | 281/356 | 281/356 (wider card, same ratio) |
| Section padding | 80px top | 48px top | 40px top |
| "View All" button | centered, min-w 200px | centered | full-width |

**Note on card count by breakpoint:** Show 8 on desktop (4×2). On tablet (2-col), show 6 (3 rows). On mobile (1-col), show 4. The rest are server-paginated on the full listing page. Never show a half-filled row.

---

### RTL Notes — New Arrivals

- Grid renders RTL naturally via `dir="rtl"`
- DiscountBadge: `start-2` resolves to right side in RTL — correct (badge stays near reading start)
- Price: SAR symbol position follows Arabic convention — `١٬٢٣٤ ر.س` (amount then symbol)
- Card info text: `text-start` resolves correctly in both directions
- QuickView overlay button: centered — no directional change needed

---

## Section 5: Why Choose Majestic — Trust Signals

**B2C copy removed.** Section rewritten as B2B trust signals. The four pillars replace all previous content.

### Component Tree

```
<TrustSignals>
  ├── <SectionHeader>
  │   └── <SectionTitle> "Why Majestic"
  └── <TrustGrid>
      └── <TrustCard> × 4
          ├── <IconContainer>
          │   └── <SVGIcon>
          ├── <TrustTitle>
          └── <TrustDescription>
```

---

### Element: TrustSignals Section

- **Background:** `#fafafa` — the one section that uses a light grey wash to create visual separation from surrounding white sections
- **Padding:** `80px 0` desktop / `64px 0` tablet / `48px 0` mobile

**SectionTitle "Why Majestic":**
- Raleway 700, `34px` desktop / `24px` mobile
- Letter spacing: `-0.03em`
- `#0c0c0c`
- Centered: `text-center` (this is one of two centered headings on the page — symmetrical layout warrants it)
- Arabic: Alyamama 700, `37px / 26px` — "لماذا ماجستيك"
- Margin bottom: `48px` desktop / `32px` mobile

---

### Element: TrustGrid

- **Layout:** `grid grid-cols-4 gap-[15px]` desktop
- **Tablet:** `grid grid-cols-2 gap-[15px]`
- **Mobile:** `grid grid-cols-1 gap-[15px]` — but cards go horizontal: each card is `flex flex-row items-start gap-4` on mobile rather than stacked
- **Max width:** `max-w-screen-2xl mx-auto` with container padding

---

### Element: TrustCard

**Desktop layout (stacked):**
```
[  Icon  ]
Title
Description
```

**Mobile layout (horizontal):**
```
[Icon] Title
       Description
```

**Card dimensions:**
- Width: auto (fills grid column)
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.21)`
- Border radius: `rounded-none`
- Padding: `32px 24px` desktop / `20px 16px` mobile

**IconContainer:**
- Desktop: `w-10 h-10 mb-5` (40×40px, margin bottom 20px)
- Mobile: `w-8 h-8 flex-shrink-0` (32×32px, flex row icon)
- Background: none (icon on white)
- Icon style: **line icons** — 1.5px stroke, `#0c0c0c`, filled version only on active/hover
- SVG size: `24×24px` centered within the container using `flex items-center justify-center`

**Four trust pillars — exact content:**

| # | Icon (describe for icon designer) | Title EN | Description EN | Title AR | Description AR |
|---|---|---|---|---|---|
| 1 | Wrench + chair outline (installation/assembly) | On-Site Installation | Professional assembly included with every order | التركيب في الموقع | تركيب احترافي مع كل طلب |
| 2 | Tag with multiple lines (volume/pricing) | Volume Pricing | Discounted rates for orders of 10 units or more | أسعار الجملة | أسعار مخفضة للطلبات من 10 وحدات فأكثر |
| 3 | Person with headset (account manager) | Dedicated Account Manager | A single point of contact for your business | مدير حساب مخصص | نقطة تواصل واحدة لعملك |
| 4 | Shield with checkmark | 3–5 Year Warranty | Industry-leading warranty on all products | ضمان 3-5 سنوات | ضمان رائد في المجال على جميع المنتجات |

**TrustTitle:**
- Raleway 700, `16px` desktop / `15px` mobile
- `#0c0c0c`
- Margin bottom: `8px` desktop / `4px` mobile
- Arabic: Alyamama 700, `18px / 16px`

**TrustDescription:**
- Raleway 400, `14px` desktop / `13px` mobile
- `#484848`
- Line height: `1.6`
- Max width: none (fills card)
- Arabic: Alyamama 400, `15px / 14px`

**Hover state:**
- Border darkens: `rgba(0,0,0,0.38)`
- Icon: no change (this is information, not navigation)
- No scale, no shadow change
- Timing: `150ms`

**States:**
- Default: as above
- Hover: border darkens
- Loading: `#fafafa animate-pulse` blocks replace icon, title, description
- Error/Empty: section does not render (static content — should never error)

---

### Responsive Summary — Trust Signals

| Element | 1440px | 768px | 390px |
|---------|--------|-------|-------|
| Grid | 4 cols | 2 cols | 1 col, horizontal card layout |
| Card padding | 32px 24px | 24px | 20px 16px |
| Icon size | 40×40px | 40×40px | 32×32px |
| Section padding | 80px | 64px | 48px |

---

### RTL Notes — Trust Signals

- Grid renders RTL naturally
- Mobile horizontal card: icon on right side of text in RTL (logical `flex-row` + `dir="rtl"` handles this)
- Icon set: no directional meaning — icons do NOT flip
- Text: `text-start` throughout

---

## Section 6: Footer

### Component Tree

```
<Footer>
  ├── <FooterMain>
  │   ├── <FooterCol1> Brand + About
  │   ├── <FooterCol2> Quick Links
  │   ├── <FooterCol3> Shop
  │   ├── <FooterCol4> Resources
  │   └── <FooterShowrooms> (full-width row below columns)
  └── <FooterBottom>
      ├── <NewsletterBlock>
      ├── <SocialIcons>
      └── <LegalLine>
```

---

### Element: Footer

- **Background:** `#ffffff`
- **Border top:** `1px solid rgba(0,0,0,0.21)`
- **No agency credit:** "Designed by Core Concepts" is completely removed. No replacement. The footer ends with the legal line.

---

### Element: FooterMain

- **Layout:** `grid grid-cols-4 gap-[60px]` desktop / `grid grid-cols-2 gap-8` tablet / `grid grid-cols-1 gap-8` mobile
- **Padding:** `80px 0 48px 0` desktop / `64px 0 40px 0` tablet / `48px 0 32px 0` mobile

**Column 1 — Brand/About:**
- Logo: `max-width: 140px`, `mb-5`
- Description: Raleway 400, `14px`, `#484848`, `line-height: 1.7`, max 3 lines
- Content EN: "Premium office furniture for the modern Saudi workplace. Trusted by businesses across the Kingdom."
- Arabic: Alyamama 400, `15px`

**Column 2 — Quick Links:**
- Header: Raleway 700, `11px`, `uppercase`, `letter-spacing: 0.1em`, `#0c0c0c`, `mb-4`
- Content: "Quick Links" (EN) / "روابط سريعة" (AR)
- Links: Raleway 400, `14px`, `#484848`, `line-height: 2.2`
- Hover: `#0c0c0c`
- Items: Delivery Information, Materials & Fabrics, Warranty Policy, About Majestic, Contact Us
- Arabic items: copywriter to confirm

**Column 3 — Shop:**
- Header: same style as Quick Links header
- Content: "Shop" (EN) / "تسوق" (AR)
- Links: same style
- Items (match nav): Chairs, Desks, Storage, Lounge, Acoustic, Accessories, New Arrivals, Sale

**Column 4 — Resources:**
- Header: same style
- Content: "Resources" (EN) / "موارد" (AR)
- Links: same style
- Items: Hardware Specifications, Ergonomics Guide, Care & Maintenance, 3D Product Library, Certifications

---

### Element: FooterShowrooms

**Decision:** Showroom information is a primary trust and conversion signal for B2B buyers who need to visit before ordering large contracts. It earns a dedicated row, not a footer link buried in a column.

- **Position:** Full-width row, below 4-column grid
- **Border top:** `1px solid rgba(0,0,0,0.21)`
- **Padding top:** `48px` desktop / `32px` mobile
- **Padding bottom:** `48px` desktop / `32px` mobile
- **Section label:** "Visit Our Showrooms" — Raleway 700, `11px`, `uppercase`, `letter-spacing: 0.1em`, `#484848`, `mb-6`
- **Arabic:** "زيارة معارضنا" — Alyamama 700, `12px`

**ShowroomGrid:**
- `grid grid-cols-3 gap-6` desktop / `grid grid-cols-1 gap-4` mobile

**ShowroomCard:**
- Background: `#fafafa`
- Border: `1px solid rgba(0,0,0,0.21)`
- Padding: `24px`
- No border radius

**ShowroomCard content:**
- **City:** Raleway 700, `15px`, `#0c0c0c`, `mb-1`
- **Address:** Raleway 400, `13px`, `#484848`, `line-height: 1.6`, `mb-2`
- **Hours:** Raleway 400, `12px`, `#484848`, `mb-3`
- **Map link:** "Get Directions →" — Raleway 500, `12px`, `#0c0c0c`, underline on hover
  - RTL: "احصل على الاتجاهات ←"
  - Opens Google Maps in new tab (`target="_blank" rel="noopener"`)

**Showroom data (3 cities — update with real data before build):**
- Riyadh: [address], Sat–Thu 9am–6pm
- Jeddah: [address], Sat–Thu 9am–6pm
- Khobar: [address], Sat–Thu 9am–6pm

---

### Element: FooterBottom

- **Border top:** `1px solid rgba(0,0,0,0.21)`
- **Padding:** `32px 0` desktop / `24px 0` mobile
- **Layout:** `flex items-center justify-between flex-wrap gap-4`
- **RTL:** `flex-row-reverse` via `dir="rtl"` inheritance

**NewsletterBlock:**
- Layout: `flex items-center gap-3`
- Label: Raleway 600, `13px`, `#0c0c0c`, `letter-spacing: 0.02em`
- Content: "Stay updated on new arrivals and promotions" — **not** "WIN a discount." Professional copy only.
- Arabic: "تابع أحدث المنتجات والعروض" — Alyamama 600, `14px`
- Input: `h-10 w-[240px] px-4 text-sm border border-[rgba(0,0,0,0.38)] rounded-none bg-white placeholder-[#484848]/60`
  - Placeholder: "Your email address" / "بريدك الإلكتروني"
  - Focus: `border-[#0c0c0c] outline-none ring-1 ring-[#0c0c0c]/10`
  - Mobile: `w-full`
- Subscribe button: `h-10 px-5 bg-[#0c0c0c] text-white text-sm font-semibold rounded-none hover:bg-[#333333]`
  - Content: "Subscribe" / "اشترك"
  - Loading: spinner 14px white
  - Success state: button text changes to "Subscribed" with `#484848` bg for 3s, then resets

**SocialIcons:**
- Layout: `flex items-center gap-4`
- Platforms: Instagram, LinkedIn, X (Twitter) — **Pinterest removed**
- Icon style: SVG line icons, `20×20px`, `#484848`
- Hover: `#0c0c0c`, `scale(1.1)`, `150ms`
- Touch target: `p-2` wrapper, `min-44×44px`
- `aria-label` on each: "Follow Majestic Furniture on Instagram" etc.
- Icons do NOT flip in RTL

**LegalLine:**
- Full-width row below the newsletter/social row
- Border top: `1px solid rgba(0,0,0,0.21)`, padding top `16px`
- Content: "© 2024 Majestic Furniture. All rights reserved." (EN) | "© 2024 ماجستيك للأثاث. جميع الحقوق محفوظة." (AR)
- Raleway 400 / Alyamama 400, `12px`, `#484848`
- Text align: `start` (left LTR / right RTL)
- **No agency credit anywhere in this component.**

---

### Responsive Summary — Footer

| Element | 1440px | 768px | 390px |
|---------|--------|-------|-------|
| Column grid | 4 cols | 2 cols | 1 col |
| Column gap | 60px | 32px | 0 (stacked) |
| Showroom grid | 3 cols | 1 col | 1 col |
| Newsletter input width | 240px | 200px | 100% |
| Social icons | right-aligned | right-aligned | left-aligned |

---

### Accessibility — Footer

| Element | Contrast | Passes |
|---------|----------|--------|
| `#484848` on `#ffffff` | 9.7:1 | AAA |
| `#0c0c0c` on `#ffffff` | 19.6:1 | AAA |
| `#ffffff` on `#0c0c0c` (button) | 19.6:1 | AAA |
| `#484848` on `#fafafa` (showroom card) | ~8.5:1 | AAA |

- `<footer role="contentinfo">`
- Nav sections: `<nav aria-label="Footer quick links">` etc.
- Social links: `aria-label` with platform name
- Newsletter form: `<form>` with `<label for="newsletter-email">` (visually hidden label acceptable)
- Map links: `rel="noopener"` on external links

---

## RTL Notes — Global

| Element | LTR | RTL | Method |
|---------|-----|-----|--------|
| Hero text position | Left 45% | Right 45% | `dir="rtl"` + logical props |
| Hero gradient | `to-r from-white` | `to-l from-white` | Conditional class |
| Hero CTA arrow | `→` | `←` | Conditional SVG |
| Hero indicators | Bottom-left | Bottom-right | `start-10` → resolves correctly |
| Category grid order | Left to right | Right to left | CSS Grid + `dir="rtl"` |
| Category horizontal scroll | Starts left | Starts right | `dir="rtl"` |
| Product card info | Left-aligned | Right-aligned | `text-start` |
| Price format | SAR 1,234 | ١٬٢٣٤ ر.س | i18n formatting |
| Trust card (mobile) | Icon left | Icon right | logical flex |
| Footer columns | LTR order | RTL order | Grid + `dir` |
| Footer newsletter | Left-anchored | Right-anchored | Flex + `dir` |
| Social icons | Right cluster | Left cluster | Flex + `dir` |
| Mega menu promo card | Rightmost column | Leftmost column | Grid + `dir` |

**Icons that flip:**
- All directional arrows (→ / ←)
- Chevrons in accordion nav
- "Get Directions" arrow in showroom card

**Icons that do NOT flip:**
- Logo
- Social icons (Instagram, LinkedIn, X)
- Shopping cart icon
- Search magnifier
- Trust signal icons (shield, wrench, tag, person — no directional meaning)

---

## Accessibility — Full Page Summary

| Element | Contrast | Standard | Passes |
|---------|----------|----------|--------|
| Primary text `#0c0c0c` on `#ffffff` | 19.6:1 | AA/AAA | AAA |
| Body text `#484848` on `#ffffff` | 9.7:1 | AA/AAA | AAA |
| Body text `#484848` on `#fafafa` | ~8.5:1 | AA/AAA | AAA |
| CTA `#ffffff` on `#0c0c0c` | 19.6:1 | AA/AAA | AAA |
| Sale badge `#ffffff` on `#e53e3e` | 4.6:1 | AA | AA |
| Promo banner `#ffffff` on `#0c0c0c` | 19.6:1 | AA/AAA | AAA |
| Inactive indicator `rgba(255,255,255,0.4)` on photo | variable | — | Must check per image — ensure 3:1 minimum for non-text UI |

- All interactive elements: `min 44×44px` touch target
- Focus rings: `2px solid #0c0c0c` with `2px offset` on all interactive elements
- Heading hierarchy: `<h1>` in hero (one per page), `<h2>` for section titles, `<h3>` for product names and card titles
- Skip link: `<a href="#main-content">` at top of `<body>`, `sr-only` until focus, then visible
- Landmark regions: `<header>`, `<main id="main-content">`, `<footer>`, each major section gets `<section>` with `aria-label`
- Images: all `<Image>` elements have descriptive `alt` text. Decorative images: `alt=""`
- `prefers-reduced-motion`: disable all CSS/JS animations — elements appear at final state immediately
- Color is never the sole means of conveying information (badges use text labels, not color only)

---

## Page-Level Responsive Notes

**1440px → 768px transitions:**
- Header: full nav hides, hamburger appears (at 1024px breakpoint)
- Hero: 45/55 split maintained
- Category grid: 6 cols → 3 cols
- Product grid: 4 cols → 2 cols
- Trust signals: 4 cols → 2 cols
- Footer: 4 cols → 2 cols

**768px → 390px transitions:**
- Hero: stacked layout (image top, text bottom)
- Category: horizontal scroll row
- Product grid: 2 cols → 1 col
- Trust signals: stacked, horizontal card layout
- Footer: single column stack
- All section padding reduces by ~40%

**No horizontal scrollbar at any breakpoint.** Validate at 390px specifically — the horizontal scroll in category tiles is intentional and contained; it must not cause page-level overflow.

---

## Component Dependencies

| Component | Depends On |
|-----------|------------|
| `<Header>` | `<MegaMenuPanel>`, `<NavDrawer>`, `<CartButton>` |
| `<HeroBanner>` | hero-banner.md v1.0 + Section 2 delta in this doc |
| `<CategoryNavigator>` | Category data (static or API) |
| `<NewArrivals>` | Product data (mock until API connected — see `project_ecom_delay.md`) |
| `<TrustSignals>` | Static content (no data dependency) |
| `<Footer>` | Showroom data (static), newsletter form (API endpoint) |

**Note on e-commerce data:** Per `departments/wordpress-next/` memory, no e-commerce backend is connected yet. `<NewArrivals>` `<AddToCartButton>` renders but triggers a "Request a Quote" modal instead of a cart action. Product data uses mock JSON. This is the correct temporary state — do not block UI build on API.

---

## Build Order Recommendation

Suggested sequence for frontend-dev to minimize blocking:

1. `<Header>` (no data dependency, unblocks all pages)
2. `<TrustSignals>` (static, fast win)
3. `<CategoryNavigator>` (static mock data)
4. `<HeroBanner>` (update per hero-banner.md v1.0 + Section 2 delta)
5. `<NewArrivals>` (mock product data)
6. `<Footer>` (static content + newsletter form stub)
