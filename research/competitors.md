# Competitor Research — Premium Furniture E-commerce

Crawled 2026-04-01. Informs Majestic/TheDeskCo Next.js rebuild design system.

---

## Sites Analyzed

| Brand | URL | Positioning | Key Strength |
|-------|-----|-------------|-------------|
| Herman Miller | hermanmiller.com | Premium office/home furniture | Editorial + commerce hybrid |
| Knoll | knoll.com | Premium workplace furniture | Dual-path (consumer + B2B) |
| Hay | hay.com | Scandinavian accessible design | Radical minimalism |
| Vitra | vitra.com | Swiss design authority | AR visualization (blocked, partial data) |

All four are part of the **MillerKnoll collective** — they share design DNA.

---

## Pattern Analysis

### 1. Navigation

| Pattern | Herman Miller | Knoll | Hay | Recommendation for Majestic |
|---------|-------------|-------|-----|----------------------------|
| Structure | 6-item horizontal mega-menu, 3+ levels deep | Dual-path: Shop for Home / Plan for Workplace | 5-item: Products, News, Inspiration, Professionals, Find Store | 5-6 items max. Mega-menu for Products. |
| Search | Swifttype autocomplete, top-right | Not prominent | Top-right with product image autocomplete | Prominent search with product image previews |
| Cart visibility | Subtle | Minimal | Nearly invisible | Subtle icon, no counter until items added |
| Mobile | Hamburger → drawer (implied) | Hamburger → drawer | Hamburger → drawer | Hamburger → full-screen drawer with categories |
| Language | Region selector with flag | International redirect link | Country selector | EN/AR toggle, prominent, no flags (Arabic is RTL flip) |

**Key insight:** All three hide transactional elements (cart, pricing) from the homepage. Browsing > buying on the homepage.

### 2. Homepage Structure

| Section Order | Herman Miller | Knoll | Hay |
|--------------|-------------|-------|-----|
| 1 | Hero carousel (3 slides) | Dual-path hero (Home vs Workplace) | Full-width hero carousel |
| 2 | Product categories grid (2x2) | Featured products grid (10 tiles) | Masonry grid (30+ tiles) |
| 3 | Brand philosophy text | Helpful resources section | — |
| 4 | Featured editorial story | International redirect | — |
| 5 | Footer | Footer | Newsletter CTA + Footer |

**Key insight:** Homepage is a curated gateway, not a catalog. 3-10 items featured, not 50.

### 3. Hero Treatment

| Pattern | Details | Adopt? |
|---------|---------|--------|
| Carousel | 3-5 slides, auto-rotating | Yes — 4 slides (matches current site) |
| Headlines | 3-5 words max ("Everybody sits", "Manolito Stool by Marc Morro") | Yes — short, evocative |
| CTAs | Subtle: "Sit your best", "Take a Seat", "Shop now" | Yes — subtle, aspirational |
| Text position | Bottom-left overlay or below image | Bottom-left for desktop, below for mobile |
| Animation | Slide/fade transitions, no flashy effects | Fade transition, 500ms |
| Aspect ratio | ~16:9 desktop (1920x700 matches our current) | Keep 1920x700 desktop, 750x500 mobile |

### 4. Typography

| Brand | Primary Font | Approach |
|-------|-------------|----------|
| Herman Miller | Custom sans-serif (proprietary) | Refined hierarchy, generous letter-spacing |
| Knoll | HelveticaNeue W01-65 Medium (single weight!) | Extreme restraint — one weight dominates |
| Hay | System fonts (Arial) | Font is invisible, content speaks |

**Majestic approach:** Alyamama variable font gives us the flexibility of Herman Miller's refinement with the simplicity of Knoll's single-family approach. Use weight variation (300-700) to create hierarchy without adding fonts.

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 64px | 700 | Hero headlines only |
| H1 | 48px | 600 | Page titles |
| H2 | 32px | 600 | Section headings |
| H3 | 24px | 500 | Subsections |
| Body | 16px | 400 | Default text |
| Small | 14px | 400 | Captions, meta |

### 5. Color Palette Patterns

| Brand | Primary | Background | Accent | Text |
|-------|---------|-----------|--------|------|
| Herman Miller | White #FFF | White | Minimal | Dark gray |
| Knoll | #333 dark gray | #f9f7f5 cream | None | #333 |
| Hay | White | White | None (grayscale UI) | Black |

**Common pattern:** Near-monochrome interfaces. Color comes from product photography, not the UI. Accent color is rare and purposeful.

**Majestic advantage:** Our gold (#C1B167) at 10% usage actually exceeds what these competitors use for accent. This gives us a distinct identity while following the restraint principle. The sage background (#F0F5F0) adds warmth that pure white lacks.

### 6. CTA Language

| Brand | CTA Examples | Tone |
|-------|-------------|------|
| Herman Miller | "Sit your best", "Take a Seat", "Read the interview" | Aspirational, friendly, editorial |
| Knoll | "Shop for Home", "Plan for Workplace", "Explore products" | Professional, direct, functional |
| Hay | "Want to stay in the loop?" (newsletter only) | Conversational, understated |

**Common pattern:** ZERO urgency language across all three. No "hurry", "limited", "deal", "sale" on homepages. CTAs are invitations, not demands.

**Majestic CTAs should follow:** "Explore the collection", "Discover more", "View details" — already in our brand rules.

### 7. Micro-Interactions

| Pattern | Implementation | Priority |
|---------|---------------|----------|
| Hover on product cards | Subtle shadow/elevation lift | HIGH |
| Sticky header | Reduces height on scroll (Knoll: after 100px) | HIGH |
| Image lazy loading | Fade-in on load (Hay: imagesLoaded + fade) | HIGH |
| Page transitions | Not prominent on any site | LOW |
| Parallax | Hay uses skrollr for subtle parallax | MEDIUM |
| Loading states | Skeleton screens (implied) | MEDIUM |

**Key insight:** Animations are functional (lazy load, sticky header), not decorative. The "premium" feel comes from speed and smoothness, not flashy effects.

### 8. Image Treatment

| Pattern | Details |
|---------|---------|
| Photography style | Clean, professional, well-lit. Mix of studio (product) and lifestyle (in-context) |
| Aspect ratios | 4:3 for thumbnails, 16:9 for heroes, ~1:1.2 for product tiles |
| Backgrounds | White/neutral studio, or styled room settings |
| Text on images | Minimal — headline overlay on hero only, never on product images |
| No humans | Hay shows zero people; Herman Miller occasionally |

**Majestic approach:** Product photography from WooCommerce stays. Hero images get text overlay (headline + CTA). Product grid images: clean, no overlay.

### 9. Footer Structure

All three share:
- **4-5 columns:** About, Products/Resources, Contact, Legal
- **Newsletter signup:** Present but not aggressive
- **Social links:** Icons only (Instagram, Facebook, LinkedIn common to all)
- **Legal links:** Privacy, Terms, Accessibility, Cookie notice
- **Parent branding:** "Part of the MillerKnoll collective"

**Majestic footer:** 4 columns (About, Shop, Support, Legal) + newsletter + social icons + language switch + copyright.

### 10. Premium Perception Drivers

Ranked by impact:

1. **Generous whitespace** — 30-40% empty space signals confidence (all three sites)
2. **Photography quality** — The product imagery does the selling, not the UI
3. **Typography restraint** — One font family, limited weights, clear hierarchy
4. **No visual noise** — No discount badges, no urgency banners, no popup modals
5. **Editorial integration** — Stories, interviews, designer profiles elevate beyond commerce
6. **Muted color palette** — Monochrome UI, color in photography only
7. **Information architecture** — Deep, organized, but never overwhelming
8. **Speed and smoothness** — Fast load, smooth transitions, no jank
9. **Design authorship** — Crediting designers creates cultural cachet
10. **Restraint in CTAs** — Invitations, not demands

---

## Patterns to Adopt

1. **Hero carousel** with 3-4 slides, short headlines (3-5 words), subtle CTAs
2. **Homepage as curated gateway** — 4-6 featured sections, not a full catalog
3. **Sticky header** that shrinks on scroll (after ~100px)
4. **Product grid** with clean cards, hover elevation, no price on homepage
5. **Generous whitespace** — maintain 30-40% rule across all pages
6. **Subtle micro-interactions** — shadow lift on hover, fade-in on load
7. **Newsletter as question** — "Stay inspired?" not "SIGN UP NOW"
8. **Footer with 4 columns** — About, Shop, Support, Legal
9. **Search with product image previews** in autocomplete
10. **Editorial content** — brand story, designer spotlight, project gallery

## Patterns to Avoid

1. **Discount badges / urgency banners** — never on Majestic
2. **Aggressive popups** — newsletter is subtle or fixed-position
3. **Social proof widgets** (reviews, ratings on homepage) — product quality is self-evident
4. **Cluttered product grids** — max 8-12 products per homepage section
5. **Flashy animations** — no spinning, bouncing, or attention-grabbing motion
6. **Multiple font families** — one font (Alyamama) is enough
7. **Bright accent colors** — gold at 10% max, rest is charcoal + sage + white
8. **Text-heavy pages** — images speak, text supports
9. **Visible cart count on homepage** — subtle until items are added
10. **Generic stock photography** — every image must feel intentional

## Patterns Unique to Majestic

These differentiate us from the MillerKnoll collective:

1. **Bilingual AR/EN** — RTL support is a core feature, not an afterthought
2. **Sage background (#F0F5F0)** — warmer than the white-dominant competitors
3. **Gold accent (#C1B167)** — more brand personality than the grayscale competitors
4. **Blueprint pattern overlays** — architectural heritage element at 5-15% opacity
5. **Saudi market context** — SAR currency, mada/STC Pay, Tabby/Tamara BNPL
6. **Alyamama font** — Arabic-first typography with variable weight
