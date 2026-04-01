# Majestic Furniture — Design System Master

> **HIERARCHY:** When building a specific page, check `pages/[page-name].md` first.
> If that file exists, its rules **override** this Master file.
> If not, follow the rules below strictly.

---

**Project:** Majestic Furniture (TheDeskCo) — Next.js Headless Rebuild
**Updated:** 2026-04-01
**Reference:** workspace.ae — copy this site's design language exactly
**Category:** Premium Office Furniture E-commerce, Bilingual (EN/AR)
**Aesthetic:** Modern professional B2B — clean white, bold typography, sharp edges, no-nonsense

---

## Design Philosophy

> "Precision. Clarity. Professional."

Inspired directly by workspace.ae:
- **White-dominant.** White backgrounds everywhere. Minimal sage/off-white tones.
- **Bold typography sells.** Large, tight headlines with negative letter-spacing.
- **Sharp edges.** Minimal border radius. Square buttons, square cards.
- **Products first.** Dense grids, more products visible, less whitespace than luxury brands.
- **B2B tone.** Quotation tools, specifications, professional language.
- **Discount-friendly.** Sale badges, strikethrough prices, percentage discounts are acceptable.

---

## Color Palette

| Role | Hex | Tailwind Token | CSS Variable | Usage |
|------|-----|---------------|--------------|-------|
| Primary Black | `#0c0c0c` | `primary` | `--tdc-primary` | Text, buttons, headers |
| White | `#ffffff` | `white` | `--tdc-white` | All backgrounds, cards |
| Dark Grey | `#484848` | `dark` | `--tdc-dark` | Body text, secondary |
| Medium Grey | `#333333` | `medium` | `--tdc-medium` | Nav, borders |
| Light Grey | `#fafafa` | `light` | `--tdc-light` | Card backgrounds, hover |
| Border | `rgba(0,0,0,0.21)` | `border` | `--tdc-border` | Lines, dividers |
| Border Dark | `rgba(0,0,0,0.38)` | `border-dark` | `--tdc-border-dark` | Strong borders |
| Accent/CTA | `#0c0c0c` | `accent` | `--tdc-accent` | CTA buttons (black) |
| Error | `#B91C1C` | `error` | `--tdc-error` | Form errors |
| Sale | `#e53e3e` | `sale` | `--tdc-sale` | Discount badges, sale price |

### Color Rules

- **Background is always white `#ffffff`** — no sage, no off-white page backgrounds
- **Cards are white** with subtle border or shadow
- **Text is `#0c0c0c`** (near-black) for headings, `#484848` for body
- **No gold accent** — CTAs are black buttons with white text
- **Sale/discount UI is acceptable** — this is a B2B commerce site, not a luxury brand
- Borders use `rgba(0,0,0,0.21)` — subtle transparent borders, not opaque grey

### Tailwind Token Mapping

```css
/* globals.css @theme block */
--color-primary: #0c0c0c;
--color-dark: #484848;
--color-medium: #333333;
--color-light: #fafafa;
--color-white: #ffffff;
--color-sage: #fafafa;        /* repurpose sage token → light grey */
--color-gold: #0c0c0c;        /* repurpose gold token → black CTAs */
--color-border: rgba(0,0,0,0.21);
--color-sale: #e53e3e;
```

---

## Typography

### Fonts

- **Primary:** Raleway (headings, nav, key UI) — load via Google Fonts or self-host
- **Secondary:** Montserrat (section headlines, labels)
- **Body:** System sans-serif fallback acceptable for body text
- **Arabic:** Alyamama variable font — used for ALL Arabic text (RTL locale)

```ts
// next/font loading
import { Raleway, Montserrat } from 'next/font/google'
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway', weight: ['400','600','700','800'] })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', weight: ['400','500','600','700'] })
```

### Type Scale

| Level | Desktop | Mobile | Weight | Letter Spacing | Usage |
|-------|---------|--------|--------|---------------|-------|
| Hero H1 | 45px | 27px | 700-800 | -0.4px to -1.9px | Hero banners |
| H2 | 42px | 28px | 700 | -0.4px | Page section titles |
| H3 | 34px | 24px | 700 | tight | Subsections |
| H4 | 27px | 20px | 600 | default | Card titles |
| H5 | 24px | 18px | 500 | default | Small headings |
| Body | 17px | 14px | 400 | default | Default text |
| Small | 14px | 13px | 400 | default | Labels, meta |
| Tiny | 12px | 12px | 400 | default | Tags, footnotes |

### Headline Rules

- **Tight line height:** `0.9em` to `1.1em` for all display/H1/H2 — creates premium feel
- **Negative letter-spacing** on all headings: `-0.02em` to `-0.04em`
- **Uppercase** acceptable for section labels and category names
- **Bold (700-800)** for all headings

### Arabic Typography

- Use Alyamama for all Arabic text
- Arabic text: `font-size: 110%` relative to English equivalent
- Zero letter-spacing: `letter-spacing: 0 !important`
- RTL via `dir="rtl"` on `<html>`
- Eastern Arabic numerals for prices in AR locale

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| Section margin (desktop) | 100px–170px | Between major page sections |
| Section margin (mobile) | 30px–60px | Reduced for mobile |
| Content padding | 30px–90px | Inside sections |
| Grid gap | 15px | Between product cards |
| Card padding | 10px–20px | Inside cards |
| Header height | ~80px desktop, ~60px mobile | Fixed sticky |

### Container

```tsx
// Full-width with managed padding — NO fixed max-width constraint
<div className="w-full px-4 md:px-6 lg:px-8 xl:px-10">
```

Note: workspace.ae uses full-width layouts, not max-w-7xl constrained. The container bleeds edge-to-edge with padding only.

---

## Shadow System

| Level | Usage |
|-------|-------|
| None | Default cards (border instead) |
| `shadow-sm` | Subtle card lift |
| `shadow-md` | Hover state |
| `shadow-lg` | Dropdowns, floating cart |

Cards primarily use **borders** (`1px solid rgba(0,0,0,0.21)`) not shadows.

---

## Border Radius

**workspace.ae is sharp/minimal:**

| Element | Radius | Tailwind |
|---------|--------|---------|
| Buttons | 0–4px | `rounded-none` or `rounded-sm` |
| Cards | 0–4px | `rounded-none` or `rounded-sm` |
| Inputs | 4px | `rounded-sm` |
| Badges | 2px | `rounded-sm` |
| Modals | 4px | `rounded-sm` |

---

## Components

### Buttons

```tsx
// Primary CTA — Black
<button className="bg-[#0c0c0c] text-white px-6 py-3 rounded-sm font-semibold
  font-raleway tracking-tight transition-all duration-200
  hover:bg-[#333] cursor-pointer">
  Add to Cart
</button>

// Secondary — Outlined
<button className="bg-transparent text-[#0c0c0c] border border-[rgba(0,0,0,0.38)]
  px-6 py-3 rounded-sm font-medium font-raleway
  hover:bg-[#fafafa] cursor-pointer">
  Quick View
</button>

// Ghost / Text CTA
<button className="text-[#0c0c0c] font-medium underline-offset-4
  hover:underline transition-all duration-200 cursor-pointer">
  Learn More
</button>
```

### CTA Language Rules

- Approved: "Add to Cart", "Quick View", "Create a Quotation", "Learn More", "View All", "Shop Now", "Explore", "View Details"
- **Discount/sale language IS acceptable** for this B2B commerce site
- No luxury-brand aversion to urgency — "Limited Stock", sale badges, percentage discounts are fine
- Professional tone: focus on specs, quality, warranties

### Product Cards

```tsx
<div className="group bg-white border border-[rgba(0,0,0,0.21)] rounded-sm overflow-hidden
  transition-all duration-200 hover:shadow-md cursor-pointer">
  {/* Image */}
  <div className="relative aspect-[281/356] overflow-hidden bg-[#fafafa]">
    {/* Discount badge */}
    {product.discount && (
      <span className="absolute top-2 start-2 z-10 bg-[#e53e3e] text-white
        text-xs font-bold px-2 py-1 rounded-sm">
        -{product.discount}%
      </span>
    )}
    <Image src={product.image} alt={product.name} fill
      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
    {/* Quick view overlay */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10
      transition-all duration-200 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
      <button className="bg-white text-[#0c0c0c] px-4 py-2 text-sm font-medium rounded-sm border">
        Quick View
      </button>
    </div>
  </div>
  {/* Info */}
  <div className="p-3">
    <p className="text-xs text-[#484848] uppercase tracking-wide">{product.category}</p>
    <h3 className="text-sm font-bold text-[#0c0c0c] mt-1 leading-tight">{product.name}</h3>
    <p className="text-xs text-[#484848] mt-0.5">{product.brand}</p>
    {/* Price */}
    <div className="flex items-center gap-2 mt-2">
      <span className="font-bold text-[#0c0c0c]">AED {product.price}</span>
      {product.originalPrice && (
        <span className="text-sm text-[#484848] line-through">AED {product.originalPrice}</span>
      )}
    </div>
    {/* Color swatches */}
    {product.colors && (
      <div className="flex gap-1 mt-2">
        {product.colors.map(c => (
          <div key={c} className="w-4 h-4 rounded-full border border-[rgba(0,0,0,0.21)]"
            style={{ background: c }} />
        ))}
      </div>
    )}
    <button className="w-full mt-3 bg-[#0c0c0c] text-white py-2 text-sm font-semibold
      rounded-sm hover:bg-[#333] transition-colors">
      Add to Cart
    </button>
  </div>
</div>
```

### Product Card Rules
- Card size: ~281px × 356px (standard) — portrait
- Discount badges: YES — red `-25%` badge top-left on image
- Sale strikethrough pricing: YES
- Color swatches: Show color variants as small circles
- "Quick View" overlay on hover
- "Add to Cart" button always visible inside card
- Brand name shown below product name

### Navigation (Sticky Header)

```tsx
// workspace.ae header: Logo left | Nav center | Search + Account + Cart right
// Height: ~80px desktop, sticky
<header className="fixed top-0 w-full z-50 bg-white border-b border-[rgba(0,0,0,0.21)]
  transition-all duration-300 h-20">
  <div className="w-full px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
    {/* Logo — left */}
    {/* Nav — center or left-adjacent */}
    {/* Right: Search bar | Sign In | Cart */}
  </div>
</header>
```

- Header: **white background**, black text, bottom border line
- Logo: left-aligned
- Nav items: Chairs, Desks (mega), Storage, Lounge, E-Quotation, Inspirations, Acoustic, Accessories
- Right utilities: Full-width search bar + Sign In text + Cart icon with count badge
- Language selector: Text dropdown "English / العربية" top-right
- **Cart badge:** Shows item count always (0 when empty)
- Mobile: hamburger → full-height drawer

### Mega Menu (Desks)

Reveals on hover, shows promotional images + subcategories:
- Executive Desks
- Workstations  
- Height Adjustable Desks
- Meeting Tables
- Reception Desks

### Footer

5-column layout + bottom bar:

| Column | Content |
|--------|---------|
| 1 — About | Brand description, logo, mission |
| 2 — Quick Links | Delivery, Materials, Warranty, Gallery |
| 3 — Shop | All categories list |
| 4 — Learn More | Hardware specs, care guides, ergonomics |
| 5 — Resources | Awards, 3D library, policies, contact |

Bottom bar: Newsletter input + Social icons (Instagram, LinkedIn, X) + Copyright
Background: White, divider lines between sections

### Inputs

```tsx
<input className="w-full px-4 py-3 rounded-sm border border-[rgba(0,0,0,0.38)]
  text-sm text-[#0c0c0c] bg-white placeholder:text-[#484848]/60
  transition-colors duration-200 focus:border-[#0c0c0c] focus:outline-none
  focus:ring-1 focus:ring-[#0c0c0c]/20" />
```

---

## Layout System

### Breakpoints

| Name | Width | Columns | Container Padding |
|------|-------|---------|------------------|
| Mobile | max 767px | 1 | `px-4` |
| Tablet | 768–991px | 2–3 | `px-6` |
| Desktop | 992px+ | 4–5 | `px-8–10` |

### Container

```tsx
// Full-width (no max-width cap like workspace.ae)
<div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
```

### Grid Patterns

| Usage | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| Product grid | 4–5 cols | 2–3 cols | 1–2 cols |
| Category nav | 6–8 cols | 3–4 cols | 2 cols |
| Feature grid | 2 cols (asymmetric) | 2 cols | 1 col |
| Footer | 5 cols | 2–3 cols | 1 col |

Grid gap: `gap-[15px]` throughout (workspace.ae standard)

---

## Image Treatment

### Aspect Ratios

| Context | Ratio | Dimensions |
|---------|-------|-----------|
| Hero banner | ~2.1:1 | Full width × 715px desktop |
| Product card | ~281:356 (0.79:1) | Portrait card |
| Category banner | 3:1 | Full width × 500px |
| Product detail | 1:1 | Square gallery |
| Thumbnail | 1:1 | 80×80px |

### Image Rules

- Always `next/image` with `fill` or explicit dimensions
- Lazy-load via SVG placeholders for product grids
- Front-facing product photography on white/neutral background
- Hero: product photography with text overlay (left-aligned)
- Parallax on hero sections: `background-attachment: fixed` (workspace.ae uses this)

---

## Hero/Banner Design

```tsx
// workspace.ae hero: full-width, product photography, left-aligned text overlay
<section className="relative w-full min-h-[715px] md:min-h-[715px] min-h-[400px]
  bg-cover bg-center bg-fixed overflow-hidden">
  {/* Background image — parallax fixed */}
  <div className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/images/hero-bg.jpg')", backgroundAttachment: 'fixed' }} />
  {/* Dark overlay — subtle */}
  <div className="absolute inset-0 bg-black/20" />
  {/* Text — left aligned, 140px from top */}
  <div className="relative z-10 px-8 lg:px-16" style={{ paddingTop: '140px' }}>
    <h1 className="text-[45px] md:text-[45px] text-[27px] font-bold text-white
      leading-[0.95] tracking-[-0.04em] max-w-lg">
      {slide.headline}
    </h1>
    <p className="text-white/90 mt-3 text-lg">{slide.tagline}</p>
    <button className="mt-6 border-2 border-white text-white px-8 py-3 rounded-sm
      font-semibold bg-transparent hover:bg-white hover:text-[#0c0c0c] transition-all">
      {slide.cta}
    </button>
  </div>
</section>
```

---

## Animation & Interaction

| Element | Effect | Duration |
|---------|--------|----------|
| Button hover | Background color shift | 200ms |
| Card hover | Scale 1.03 on image + shadow | 200–300ms |
| Quick view | Opacity overlay appears | 200ms |
| Mega menu | Slide down reveal | 200ms |
| Cart drawer | Slide from right | 250ms |
| Lazy load | Fade from opacity 0 | 300ms |

### Animation Rules

- Respect `prefers-reduced-motion: reduce`
- Parallax on hero: `background-attachment: fixed` (this IS acceptable — workspace.ae uses it)
- Hover effects are subtle: 1.03 scale max, not 1.05+
- Max animation duration: 300ms (faster than the previous luxury approach)
- Floating cart: slides from right side

---

## RTL Support

Same logical property rules as before — use `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`.

Arabic text rules:
- Alyamama font for Arabic
- 10% larger font size
- Zero letter-spacing

---

## Currency & Pricing

| Setting | Value |
|---------|-------|
| Currency | AED (UAE Dirham) for workspace reference / SAR for Majestic |
| Display | "AED 1,234" or "SAR 1,234" |
| Sale price | Bold, colored `#0c0c0c` |
| Original price | Strikethrough, `#484848` lighter |
| Discount badge | Red `-25%` badge on product image |

---

## Product Listing Page

- Left sidebar: category filters, price range, brand filters, color filters
- Top bar: Sort dropdown + product count + view toggle (grid/list)
- Grid: 4–5 cols desktop, 2–3 tablet, 1–2 mobile
- Per page: 20–40 products
- Pagination: numbered pages (not "load more")
- "Create a Quotation" CTA prominent on listing pages

---

## Anti-Patterns (NEVER Do)

### Visual
- Sage green page backgrounds — use white `#ffffff`
- Gold/warm accent color for CTAs — use black `#0c0c0c`
- Excessive whitespace (30-40% rule) — workspace.ae is denser
- Rounded corners (rounded-xl, rounded-2xl) — use rounded-sm or rounded-none
- Blueprint pattern overlays — not part of workspace.ae aesthetic

### Copy
- Luxury aversion to discounts/sale language — workspace.ae shows sale badges
- "Discover", "Explore" soft CTAs ONLY — direct "Add to Cart", "Shop Now" is fine
- No exclamation marks still (professional tone)

### Technical
- External font CDN for Raleway/Montserrat — self-host or use next/font/google
- `<img>` tags — use `next/image` always
- Client components for static content

---

## Pre-Delivery Checklist

Before shipping any page:

### Brand (workspace.ae style)
- [ ] White backgrounds throughout
- [ ] Raleway/Montserrat fonts rendering correctly
- [ ] Black CTAs (`#0c0c0c`) not gold
- [ ] Sharp borders (rounded-sm or rounded-none)
- [ ] Product cards show discount badges if applicable
- [ ] Dense grid layout (15px gaps)

### Typography
- [ ] Tight negative letter-spacing on headings
- [ ] Bold 700–800 weight for H1/H2
- [ ] Arabic text 10% larger with Alyamama

### RTL
- [ ] Renders correctly in both LTR and RTL
- [ ] Logical properties used

### Responsive
- [ ] Mobile (375px) — no horizontal scroll
- [ ] Tablet (768px) — grid adjusts
- [ ] Desktop (992px+) — full layout

### Accessibility
- [ ] Color contrast 4.5:1 minimum
- [ ] Focus rings visible
- [ ] Skip-to-content link
- [ ] Touch targets 44px minimum
