# Visual Spec: Hero Banner
**Version**: 1.0
**Date**: 2026-04-01
**Status**: Ready for Build
**File**: `departments/wordpress-next/src/components/hero/hero-banner.tsx`

---

## Design System Note

This spec follows `departments/wordpress-next/design-system/MASTER.md` (workspace.ae B2B).
The round-table findings referenced legacy tokens (`#F0F5F0`, `#C1B167`, `#2C2C2C`). Those tokens
are no longer canonical. Findings have been resolved against current MASTER values. Specifically:

| Finding reference | Resolution |
|---|---|
| Replace `#f2f2f2` bg | Replaced with `#ffffff` (white) per MASTER |
| Replace `#0c0c0c` text | `#0c0c0c` IS the correct primary token — no change needed |
| Replace `#484848` collection label with gold | Gold CTA accent is removed in MASTER. Collection label stays `#484848` uppercase |
| CTA must be a real button | Yes — spec below uses outlined border button, white on dark overlay |
| `mobileImage` prop unused | Fixed — mobile layout consumes `mobileImage` in stacked layout |
| Trust signal missing | Added — stat strip below hero text |
| CTA animation delay t=0.95s too late | Fixed — new timeline compresses to t=0.65 |

---

## 1. Grid

| Breakpoint | Columns | Gutter | Margin/Padding |
|---|---|---|---|
| 375px (mobile) | 4 | 16px | `px-4` (16px) |
| 768px (tablet) | 8 | 24px | `px-6` (24px) |
| 992px (desktop) | 12 | 24px | `px-8` (32px) |
| 1440px (wide) | 12 | 32px | `px-10` (40px), `max-w-screen-2xl mx-auto` |

---

## 2. Layout Spec

### 2.1 Desktop (992px+)

**Structure:** Full-bleed section. Left text column 45% width / right image column 55% width.
Image is absolute-positioned to fill right 55%. Text sits in normal flow left 45%.

```
┌──────────────────────────────────────────────────────────────────┐
│  [text column 45%]          │  [image 55%]                       │
│                             │                                     │
│  COLLECTION LABEL           │  ┌──────────────────────────────┐  │
│  Headline                   │  │                              │  │
│  Tagline                    │  │   product photography        │  │
│  [CTA button]               │  │   object-cover, object-right │  │
│  [trust strip]              │  │                              │  │
│                             │  └──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

- **Section min-height**: `min-h-[85vh]` with `min-height: 715px` floor
  - Rationale: 85vh ensures fullscreen impact at all desktop resolutions; 715px floor per MASTER
  - Do NOT use 100vh — nav is 80px sticky, 85vh keeps CTA visible without scroll
- **Section background**: `#ffffff` (white, `--color-white`)
- **Section overflow**: `hidden`
- **Vertical alignment**: `flex items-center`

### 2.2 Tablet (768px–991px)

Same 45/55 split maintained. Text padding reduces. Font size steps down.
No stacking at tablet — the split still works at 768px.

### 2.3 Mobile (max 767px)

**Structure:** Stacked column. Image block on top, text block below. No overlay.

```
┌──────────────────┐
│                  │
│  mobileImage     │  height: 52vw, min-height: 200px, max-height: 320px
│  object-cover    │  (uses mobileImage prop if provided, falls back to image)
│                  │
├──────────────────┤
│  COLLECTION      │
│  Headline        │  text block, white bg, px-4 py-8
│  Tagline         │
│  [CTA button]    │
│  [trust strip]   │
└──────────────────┘
```

- **Mobile image block**: `w-full` height `52vw`, minimum `200px`, maximum `320px`
- **Image source**: `slide.mobileImage ?? slide.image`
- **Image fit**: `object-cover object-top` — prioritise top of shot (products show upper body)
- **No overlay on mobile** — eliminate the flat `bg-[#f2f2f2]/70` overlay entirely
- **Text block background**: `#ffffff`
- **Text block padding**: `px-4 pt-6 pb-10`

---

## 3. Color Tokens

All values from MASTER. No raw hex unless it IS the token value.

| Element | Token | Hex |
|---|---|---|
| Section background | `--color-white` | `#ffffff` |
| Headline text | `--color-primary` | `#0c0c0c` |
| Tagline text | `--color-dark` | `#484848` |
| Collection label text | `--color-dark` | `#484848` |
| Gradient scrim (desktop) | `rgba(255,255,255,0.92)` → transparent | white |
| CTA button bg (default) | `--color-primary` | `#0c0c0c` |
| CTA button text (default) | `--color-white` | `#ffffff` |
| CTA button bg (hover) | `--color-medium` | `#333333` |
| Trust strip label | `--color-dark` | `#484848` |
| Trust strip value | `--color-primary` | `#0c0c0c` |
| Trust strip divider | `rgba(0,0,0,0.21)` | `--color-border` |
| Image gradient (desktop, LTR) | `from-white to-transparent` | — |

**Color correction from current code:**
- `background: "#f2f2f2"` → `background: "#ffffff"` (section background)
- Gradient scrim `from-[#f2f2f2]` → `from-white`
- Mobile overlay `bg-[#f2f2f2]/70` → removed entirely (mobile is stacked, no overlay needed)

---

## 4. Typography Spec

Font: Raleway (LTR) / Alyamama (Arabic RTL)

### 4.1 Collection Label

| Property | Desktop | Tablet | Mobile |
|---|---|---|---|
| Element | `<p>` | same | same |
| Font | Raleway | Raleway | Raleway |
| Size | 11px | 11px | 11px |
| Weight | 600 (semibold) | 600 | 600 |
| Line height | 1.0 | 1.0 | 1.0 |
| Letter spacing | `0.12em` (wide, uppercase) | same | same |
| Transform | `uppercase` | same | same |
| Color | `#484848` | same | same |
| Margin bottom | 12px | 12px | 10px |

**Arabic RTL:** Alyamama 600. `letter-spacing: 0`. Uppercase has no meaning in Arabic — omit `text-transform: uppercase`, render as written. Font size: `12px` (10% larger).

### 4.2 Headline (H1)

| Property | Desktop (1440px) | Desktop (992px) | Tablet | Mobile |
|---|---|---|---|---|
| Font | Raleway | Raleway | Raleway | Raleway |
| Size | 60px | 48px | 40px | 34px |
| Weight | 800 (extrabold) | 800 | 700 | 700 |
| Line height | `0.95em` | `0.95em` | `0.95em` | `1.0em` |
| Letter spacing | `-0.04em` | `-0.04em` | `-0.03em` | `-0.02em` |
| Color | `#0c0c0c` | `#0c0c0c` | `#0c0c0c` | `#0c0c0c` |
| Max width | `520px` | `460px` | `420px` | `none` |
| White space | `pre-line` | `pre-line` | `pre-line` | `pre-line` |

**Arabic RTL:** Alyamama 700. Size: `66px / 53px / 44px / 37px` (110% of LTR values). `letter-spacing: 0`. Line height `1.1em` (Arabic ascenders/descenders need more room). Text aligns `end` (right in RTL).

### 4.3 Tagline

| Property | Desktop | Tablet | Mobile |
|---|---|---|---|
| Font | Raleway | Raleway | Raleway |
| Size | 17px | 16px | 15px |
| Weight | 400 (regular) | 400 | 400 |
| Line height | `1.55` | `1.55` | `1.5` |
| Letter spacing | `0` | `0` | `0` |
| Color | `#484848` | `#484848` | `#484848` |
| Max width | `380px` | `340px` | `none` |
| Margin top | `16px` | `14px` | `12px` |

**Arabic RTL:** Alyamama 400. Size `19px/18px/17px`. `letter-spacing: 0`. Text aligns `end`.

### 4.4 Trust Strip Values and Labels

- Value: Raleway 700, 22px desktop / 18px mobile, `#0c0c0c`
- Label: Raleway 400, 12px desktop / 11px mobile, `#484848`, uppercase, `letter-spacing: 0.06em`
- Arabic: Alyamama, sizes 10% larger, `letter-spacing: 0`

---

## 5. CTA Button Spec

This replaces the current plain `<Link>` text CTA.

### 5.1 Dimensions and Structure

```
[  Shop the Collection  ]
```

- **Element**: `<Link>` rendered as button via `role="button"` or wrap in `<button>` — use `<Link>` with button class for navigation
- **Display**: `inline-flex items-center gap-2`
- **Padding**: `px-6 py-3` (24px horizontal, 12px vertical)
- **Min height**: `48px` (exceeds 44px touch target requirement)
- **Min width**: `180px`
- **Border radius**: `rounded-none` (0px — sharp, per MASTER)

### 5.2 States

| State | Background | Text | Border | Other |
|---|---|---|---|---|
| Default | `#0c0c0c` | `#ffffff` | none | — |
| Hover | `#333333` | `#ffffff` | none | `transition-colors duration-200` |
| Active / Pressed | `#1a1a1a` | `#ffffff` | none | `scale-[0.98]` |
| Focus visible | `#0c0c0c` | `#ffffff` | 2px ring `#0c0c0c`, 2px offset | outline visible |
| Loading | `#0c0c0c` at 60% opacity | hidden | none | spinner 16px white, centered |
| Disabled | `#484848` | `#ffffff` at 60% | none | `cursor-not-allowed` |

### 5.3 Tailwind Classes

```
className="
  inline-flex items-center gap-2
  bg-[#0c0c0c] text-white
  px-6 py-3 min-h-[48px]
  rounded-none
  font-raleway font-semibold text-sm tracking-tight
  transition-colors duration-200
  hover:bg-[#333333]
  active:scale-[0.98]
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c0c0c]
"
```

### 5.4 Arrow Icon

- SVG arrow `→` (LTR) / `←` (RTL) — 16×16px
- Transitions: `ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-200`
- Use `group` on the Link element

### 5.5 Margin

- `margin-top: 32px` (desktop) / `margin-top: 24px` (mobile)

### 5.6 Arabic RTL

- Arrow flips to `←`
- Button text uses Alyamama, same weight and size
- Padding unchanged (logical properties: `ps-6 pe-6`)

---

## 6. Trust Signal Spec

**What:** Three stat pillars below CTA. Conveys B2B credibility without decorative excess.

**Example content (copywriter to confirm):**
- `500+` / `Products In Stock`
- `10yr` / `Warranty Standard`
- `Free` / `Delivery on Orders`

### 6.1 Layout

- **Position**: Below CTA button, `margin-top: 40px` desktop / `32px` mobile
- **Display**: `flex gap-8` (desktop) / `flex gap-6` (mobile) — horizontal row, left-aligned (RTL: right-aligned)
- **Dividers**: `1px solid rgba(0,0,0,0.21)` vertical lines between pillars — use `divide-x divide-[rgba(0,0,0,0.21)]` with `px-8` on middle item

### 6.2 Pillar Structure

```
500+
Products In Stock
```

- Value: Raleway 700, 22px, `#0c0c0c`
- Label: Raleway 400, 12px, `#484848`, `uppercase`, `letter-spacing: 0.06em`
- Label margin-top: 4px
- Pillar padding: `pe-8` on first and second pillars for divider spacing

### 6.3 RTL

- Row direction reverses (logical `flex-row` handles this with `dir="rtl"`)
- Divider positions remain between items
- Arabic: Alyamama, sizes 10% larger, `letter-spacing: 0`

### 6.4 Mobile

- Trust strip appears below CTA in stacked mobile layout
- Same 3 pillars, `flex gap-4`, font sizes step down: value `18px`, label `11px`

---

## 7. Desktop Image Treatment

### 7.1 Image Container

- **Position**: `absolute inset-y-0 end-0 w-[55%]` (LTR and RTL via logical `end`)
- **Overflow**: `hidden`
- **Z-index**: `z-0`

### 7.2 Image

- **Component**: `next/image` with `fill` prop
- **Object fit**: `object-cover`
- **Object position**: `object-[70%_center]` — shifts focal point right to avoid text collision
- **Priority**: `true` (LCP element)
- **Sizes**: `(max-width: 768px) 100vw, 55vw`
- **Alt**: `slide.alt` (required, descriptive)

### 7.3 Gradient Scrim (Desktop Only)

Blends image into white text area. Prevents hard edge.

- **Element**: `absolute inset-y-0 start-0 w-[40%]`
- **Gradient (LTR)**: `bg-gradient-to-r from-white to-transparent`
- **Gradient (RTL)**: `bg-gradient-to-l from-white to-transparent`
- **Hidden on mobile**: `hidden md:block`
- **Animation**: opacity `0 → 1`, duration `0.6s`, start time `t=0` (see section 8)

### 7.4 Ken Burns Wrapper

- Wraps `<Image>` in a `<div ref={imageRef}>`
- `will-change: transform`
- Animated by GSAP: scale `1.04 → 1.0`, duration `1.2s`, ease `power2.out`, start `t=0`

---

## 8. Animation Spec (GSAP Timeline)

### 8.1 Compressed Timeline

Replace the existing timeline. All durations in seconds.

| Element | Property | From | To | Duration | Ease | Start (timeline position) |
|---|---|---|---|---|---|---|
| `imageRef` (Ken Burns) | `scale` | `1.04` | `1.0` | `1.2` | `power2.out` | `0` |
| `gradientRef` (scrim) | `opacity` | `0` | `1` | `0.6` | `power2.out` | `0` |
| `collectionRef` | `y`, `opacity` | `y:8, opacity:0` | `y:0, opacity:1` | `0.35` | `power2.out` | `0.1` |
| `headlineRef` (clip wipe) | `clipPath` | `inset(0 100% 0 0)` LTR / `inset(0 0 0 100%)` RTL | `inset(0 0% 0 0)` | `0.45` | `power3.out` | `0.25` |
| `taglineRef` | `y`, `opacity` | `y:6, opacity:0` | `y:0, opacity:1` | `0.35` | `power2.out` | `0.45` |
| `ctaRef` | `opacity` | `0` | `1` | `0.3` | `power2.out` | `0.65` |
| `trustRef` | `opacity`, `y` | `opacity:0, y:4` | `opacity:1, y:0` | `0.3` | `power2.out` | `0.75` |

**Total timeline end:** ~1.05s. CTA is visible at `0.65s` — eliminates the blocking UX issue.

### 8.2 Headline Clip Direction

```js
const clipFrom = isRTL ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
const clipTo   = isRTL ? "inset(0 0 0 0%)"   : "inset(0 0% 0 0)";
// ease: "power3.out" (was power2.out — sharper deceleration feels more premium)
// duration: 0.45s (was 0.55s)
```

### 8.3 `prefers-reduced-motion`

If `prefers-reduced-motion: reduce` is detected:
- Set all elements immediately: `gsap.set([...], { opacity: 1, clearProps: "all" })`
- Set image: `gsap.set(imageRef.current, { scale: 1 })`
- No timeline runs

### 8.4 Framer Motion Parallax (Scroll)

- **Library**: `framer-motion` `useScroll` + `useTransform`
- **Target**: `sectionRef`, `offset: ["start start", "end start"]`
- **Transform**: `scrollYProgress [0,1] → imageY [0, 40]` (reduce from current 60 → **40px**)
- **Applied to**: `<motion.div>` wrapping image container, `style={{ y: isMobile ? 0 : imageY }}`
- **Mobile guard**: `isMobile` state from `window.matchMedia("(hover: none) and (pointer: coarse)")` — set `y = 0` on mobile

### 8.5 GSAP Dynamic Import

Continue using dynamic import pattern — GSAP must not be in critical bundle:
```js
import("gsap").then(({ gsap }) => { ... })
```

---

## 9. Mobile Layout Spec (Complete)

### 9.1 Structure

```tsx
// Mobile image (md:hidden)
<div className="relative w-full md:hidden" style={{ height: 'clamp(200px, 52vw, 320px)' }}>
  <Image
    src={slide.mobileImage ?? slide.image}
    alt={slide.alt}
    fill
    className="object-cover object-top"
    priority
    sizes="100vw"
  />
</div>

// Text block — below image (md:hidden for mobile-specific padding)
<div className="relative z-10 w-full px-4 pt-6 pb-10 bg-white md:hidden">
  {/* collection, headline, tagline, CTA, trust strip */}
</div>
```

### 9.2 Mobile Image

- **Height**: `clamp(200px, 52vw, 320px)` — proportional to viewport, never squished
- **Source**: `slide.mobileImage ?? slide.image` — the `mobileImage` prop is CONSUMED here, fixing the existing bug
- **Fit**: `object-cover object-top`
- **No overlay**: No `bg-[#f2f2f2]/70` or any color overlay. The stacked layout makes the overlay unnecessary and image-destructive.

### 9.3 Mobile Text Block

- Background: `#ffffff`
- Padding: `px-4 pt-6 pb-10` (16px sides, 24px top, 40px bottom)
- Collection label: 11px, same spec as desktop
- Headline: 34px, Raleway 700, `leading-[1.0]`, `tracking-[-0.02em]`
- Tagline: 15px, `#484848`, `leading-[1.5]`, `mt-3`
- CTA button: full width on mobile — `w-full justify-center`, `mt-6`
- Trust strip: `mt-8`, `flex gap-4`, value `18px`, label `11px`

### 9.4 Desktop Image (md:block) — Show/Hide Logic

The desktop split image `absolute inset-y-0 end-0 w-[55%]` must be `hidden md:block` so it does not render underneath the mobile stacked layout.

---

## 10. Responsive Summary

| Element | 375px | 768px | 992px | 1440px |
|---|---|---|---|---|
| Layout | Stacked (image top) | Split 45/55 | Split 45/55 | Split 45/55 |
| Section height | auto (image + text) | `min-h-[85vh]` | `min-h-[85vh]` | `min-h-[85vh]` |
| H1 size | 34px | 40px | 48px | 60px |
| H1 weight | 700 | 700 | 800 | 800 |
| Text padding | `px-4` | `px-6` | `px-8` | `px-10` |
| CTA width | `w-full` | `inline-flex` | `inline-flex` | `inline-flex` |
| Trust strip | below CTA, `gap-4` | below CTA, `gap-6` | below CTA, `gap-8` | below CTA, `gap-8` |
| Image overlay | none | gradient scrim | gradient scrim | gradient scrim |
| Parallax | disabled | disabled | enabled | enabled |

Touch targets: All interactive elements `min-h-[48px]` — exceeds 44px minimum.

---

## 11. RTL / Arabic Adaptations

### Elements that change direction

| Element | LTR | RTL |
|---|---|---|
| Text column position | `w-[45%]` left | `w-[45%]` right (use `dir="rtl"` + logical props) |
| Image column position | `absolute end-0 w-[55%]` | logical `end-0` resolves to left in RTL — correct |
| Gradient scrim direction | `bg-gradient-to-r from-white` | `bg-gradient-to-l from-white` |
| Headline clip wipe | `inset(0 100% 0 0)` | `inset(0 0 0 100%)` |
| CTA arrow icon | `→` | `←` |
| Arrow hover translate | `group-hover:translate-x-1` | `rtl:group-hover:-translate-x-1` |
| Trust strip flex | `flex-row` (left to right) | `flex-row` (right to left — inherits from `dir`) |
| Text alignment | `text-start` | `text-start` (resolves to right in RTL) |

### Icons that must flip
- CTA arrow (`→` / `←`) — flip

### Icons that must NOT flip
- Logo (not in this component)
- Non-directional icons (none in hero)

### Arabic font binding

Headline `<h1>`:
```tsx
className={`... ${isAr ? 'font-alyamama tracking-normal' : 'font-raleway tracking-[-0.04em]'}`}
```

All Arabic text elements must:
- Use `font-alyamama` (CSS variable `--font-alyamama`)
- Override `letter-spacing: 0 !important` via Tailwind `tracking-normal` + inline style if needed
- Scale up 10% (`text-[37px]` mobile vs `34px`, etc. — see typography section)

### Visual Balance Note

Arabic headlines run visually denser and taller than Raleway. The `max-w-[520px]` constraint on the desktop headline may need to reduce to `max-w-[460px]` for Arabic to avoid the text column crowding the image at shorter line widths. Spec value: `max-w-[460px]` for Arabic H1 on desktop.

---

## 12. Accessibility

| Element | Contrast Ratio | Standard | Passes |
|---|---|---|---|
| `#0c0c0c` on `#ffffff` | 19.6:1 | AA / AAA | AAA |
| `#484848` on `#ffffff` | 9.7:1 | AA / AAA | AAA |
| `#ffffff` on `#0c0c0c` (CTA button) | 19.6:1 | AA / AAA | AAA |
| `#484848` (tagline) on `#ffffff` | 9.7:1 | AA | AAA |

- **Focus indicator**: CTA button — `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c0c0c]`
- **Touch targets**: CTA `min-h-[48px]`, exceeds 44px minimum
- **Screen reader**: Section has `<h1>` as first heading — correct landmark hierarchy. `<Image>` has `alt={slide.alt}`. Trust strip values should have `aria-label` on container: e.g. `aria-label="Why choose Majestic Furniture"`.
- **Parallax**: Wrapped in `prefers-reduced-motion` guard — no motion if reduced motion preferred
- **`<Link>` as CTA**: Must have descriptive text (not "click here"). CTA text like "Shop the Collection" is sufficient.
- **Skip link**: Not in this component — handled at layout level.

---

## 13. Ref List for GSAP

Current code has 5 refs. Add 2 new ones:

| Ref | Element | New? |
|---|---|---|
| `sectionRef` | `<section>` | existing |
| `imageRef` | Ken Burns `<div>` inside motion.div | existing |
| `collectionRef` | `<p>` collection label | existing |
| `headlineRef` | `<h1>` | existing |
| `taglineRef` | `<p>` tagline | existing |
| `ctaRef` | `<Link>` CTA | existing |
| `gradientRef` | gradient scrim `<div>` | **NEW** |
| `trustRef` | trust strip `<div>` | **NEW** |

---

## 14. Props Interface (No Change Required)

Existing `HeroSlide` interface is correct. The `mobileImage` prop already exists — this spec fixes consumption, not declaration.

```ts
export interface HeroSlide {
  image: string;
  mobileImage?: string;   // NOW CONSUMED — see section 9.2
  alt: string;
  headline: string;
  tagline?: string;
  collection?: string;
  cta: string;
  href: string;
  locale?: string;
}
```

---

## 15. Changes from Current Implementation (Diff Summary)

| # | Location | Current | Specified |
|---|---|---|---|
| 1 | Section `style` | `background: "#f2f2f2"` | `background: "#ffffff"` |
| 2 | Section `style` | `minHeight: "600px"` | `minHeight: "715px"`, class `min-h-[85vh]` |
| 3 | Mobile overlay | `<div className="absolute inset-0 bg-[#f2f2f2]/70 md:hidden" />` | Remove entirely |
| 4 | Mobile layout | No mobile-specific layout — image hidden, overlay only | Stacked: image block + text block, `md:hidden` |
| 5 | `mobileImage` | Declared in interface, never consumed | Consumed as `src={slide.mobileImage ?? slide.image}` in mobile image block |
| 6 | Gradient scrim | `from-[#f2f2f2]` | `from-white` |
| 7 | CTA element | `<Link>` with text + `›` arrow, plain link style | `<Link>` with primary button classes (black bg, white text, `rounded-none`) |
| 8 | GSAP: image Ken Burns | `scale 1.04→1.0, duration: 0.8` | `duration: 1.2` |
| 9 | GSAP: headline ease | `power2.out` | `power3.out` |
| 10 | GSAP: headline duration | `0.55s` | `0.45s` |
| 11 | GSAP: collection start | `t=0.2` | `t=0.1` |
| 12 | GSAP: headline start | `t=0.35` | `t=0.25` |
| 13 | GSAP: tagline start | `t=0.6` | `t=0.45` |
| 14 | GSAP: CTA start | `t=0.95` | `t=0.65` |
| 15 | Parallax offset | `[0, 60]` | `[0, 40]` |
| 16 | Trust strip | Does not exist | Add — 3 pillars below CTA |
| 17 | Gradient scrim | Not animated | Add `gradientRef`, animate opacity 0→1, 0.6s, t=0 |
| 18 | Trust strip animation | N/A | `trustRef`, opacity/y, 0.3s, t=0.75 |
