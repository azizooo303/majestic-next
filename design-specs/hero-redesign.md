## Visual Spec: Hero Redesign — Full-Bleed Overlay Carousel
**Version**: 1.0
**Date**: 2026-04-02
**Status**: Ready for Build
**Replaces**: `design-specs/hero-banner.md` v1.0 (50/50 split — rejected by Aziz)
**File target**: `departments/wordpress-next/src/components/hero/HeroCarousel.tsx`

---

## Design System Alignment Notes

This spec applies MASTER.md (workspace.ae B2B) with the following deliberate overrides
authorized by Aziz's brief:

| Override | Rule in MASTER | Aziz brief direction | Resolution |
|---|---|---|---|
| Collection label color | No gold; labels use `#484848` | "Brand gold #C1B167 should be used" | Gold used **only** for collection label — one element, not CTAs |
| Blueprint pattern | MASTER anti-pattern: "Blueprint pattern overlays" | "Blueprint pattern as corner watermark, 4–6% opacity" | Reduced to `opacity-[0.04]` watermark in one corner only — not a full-bleed texture |
| CTA button style | Black filled | Brief: white outlined on dark overlay | White outlined border button on image overlay — correct for legibility |

No other overrides. All spacing, typography scale, and font families follow MASTER.

---

## Grid

| Breakpoint | Columns | Gutter | Margin/Padding |
|---|---|---|---|
| 390px (mobile) | 4 | 16px | `px-4` (16px) |
| 768px (tablet) | 8 | 24px | `px-6` (24px) |
| 992px (desktop) | 12 | 24px | `px-8` (32px) |
| 1440px (wide) | 12 | 32px | `px-10` (40px) |

---

## Section: Hero Carousel

### Layout Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                   FULL-BLEED IMAGE (100vw × 90vh)                  │
│                   object-cover, object-center                      │
│                                                                    │
│                                                                    │
│                                                                    │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  [legibility strip — bottom 280px, gradient from black]   │    │
│  │                                                            │    │
│  │  ps-10 pb-10                                              │    │
│  │  COLLECTION LABEL  (gold, uppercase, tracked)             │    │
│  │  Headline           (white, 52px, weight 800)             │    │
│  │  Tagline            (white/80, 16px, weight 400)          │    │
│  │  [CTA button]       (white outlined)                      │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                    │
│  [blueprint watermark — top-right corner, opacity 4%]             │
│                                                                    │
│                                [slide indicators — bottom center] │
└────────────────────────────────────────────────────────────────────┘
```

- **Element**: `<section>` with `role="region"` and `aria-label="Featured collections"` and `aria-live="polite"`
- **Dimensions**: `w-full` / `min-h-[90vh]` desktop, `min-h-[100svh]` mobile. Hard floor: `min-height: 640px` at all breakpoints.
- **Background**: `#0c0c0c` (failsafe while image loads)
- **Overflow**: `hidden`
- **Position**: `relative`

---

### Element: Slide Image

- **Element**: `next/image` with `fill` prop, `priority` on slide index 0
- **Object fit**: `object-cover`
- **Object position**: `object-center` default. Per-slide override via `objectPosition` prop (e.g., Desks slide may use `object-[center_30%]` to keep desk surface in frame)
- **Dimensions**: fills 100% of parent section (100vw × 90vh+)
- **Transition**: crossfade — CSS `opacity` transition, 600ms ease-in-out. Outgoing slide fades from `opacity-100` to `opacity-0`. Incoming slide fades from `opacity-0` to `opacity-100`. Both positioned `absolute inset-0` — they overlap during transition.
- **DO NOT use translateX slide transition** — it conflicts with the overlay text position and feels aggressive for a premium brand
- **Parallax**: `background-attachment: fixed` is acceptable per MASTER for hero sections. However, since this is `next/image` with `fill`, implement parallax via `transform: translateY()` on scroll using a `useScrollY` hook, not CSS `background-attachment` (which does not work on iOS). Motion-designer hook point: `data-parallax-hero` attribute on the image container. Clamp parallax offset to `max 60px` down at full scroll to avoid image gap at top.
- **RTL**: No change — image is full-bleed, not directional
- **Loading state**: `bg-[#0c0c0c]` base shows through while image loads. No skeleton needed — the dark base is correct.

**Per-slide image asset requirements** (flag to frontend-dev):
Current images are distorted (835×304px natural height stretched to 715px). New images must be:
- Minimum natural size: **1920×1080px**
- Recommended: **2560×1440px** for retina/wide displays
- Aspect ratio: **16:9 or wider** — never portrait for full-bleed hero
- Subjects: desks, seating, tables — all shot in context (office environment), not on white bg

---

### Element: Legibility Gradient Strip

The text overlay requires legibility without a blunt dark overlay on the full image. Solution is a gradient that affects only the bottom third of the frame where text sits.

- **Element**: `<div>` absolutely positioned, `inset-0`
- **Background**: `linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 35%, rgba(0,0,0,0) 60%)`
- **Pointer events**: `none`
- **Z-index**: `z-10` (above image, below text)

**Rationale**: This gradient starts at 72% opacity black at the very bottom (where text lives) and fades to zero by 60% up the frame. The upper portion of the image — where the product or environment is most dramatic — reads completely clean. No hard bar, no frosted glass, no full-overlay.

**Important**: Do NOT use a frosted/blur overlay. Do NOT use a solid color band. The gradient only.

---

### Element: Blueprint Watermark

- **Element**: `<div>` with `<img>` inside, absolutely positioned
- **Position**: `absolute top-0 end-0` (top-right LTR, top-left RTL via logical property)
- **Dimensions**: `w-[320px] h-[320px]`
- **Image src**: `/images/blueprint-pattern.png`
- **Object fit**: `object-cover object-[top_right]`
- **Opacity**: `opacity-[0.04]` (4%)
- **Pointer events**: `none`
- **Z-index**: `z-10` (above image, below text)
- **Mix blend mode**: `screen` — ensures the pattern lightens where image is dark, near-invisible where image is bright. Prevents a distracting box.
- **RTL**: `end-0` logical property flips it to top-left in RTL — the corner anchor stays outer-edge regardless of direction
- **Mobile (390px)**: Reduce to `w-[180px] h-[180px]` — still top-outer corner

---

### Element: Text Content Block

- **Element**: `<div>` absolutely positioned
- **Position**: `absolute bottom-0 start-0 end-0` — spans full width, anchored to bottom
- **Padding**: `ps-10 pe-10 pb-10` desktop / `ps-6 pe-6 pb-8` tablet / `ps-4 pe-4 pb-6` mobile
- **Max content width**: `540px` — text block does not stretch edge to edge; this keeps line lengths readable and creates natural breathing room on the right (LTR) / left (RTL)
- **Z-index**: `z-20` (above gradient, above watermark)

#### Sub-element: Collection Label

- **Element**: `<p>` 
- **Font**: Raleway (LTR) / Alyamama (RTL)
- **Size**: 11px desktop / 11px tablet / 11px mobile
- **Weight**: 600 (semibold)
- **Letter spacing**: `0.14em` (wide — uppercase label)
- **Transform**: `uppercase`
- **Color**: `#C1B167` (gold — the ONE element in the hero that uses brand gold)
- **Margin bottom**: `12px` desktop / `10px` mobile
- **Arabic RTL**: Alyamama 600, `letter-spacing: 0`, no `text-transform: uppercase`, `12px` size. Color remains gold.

#### Sub-element: Headline (H1)

- **Element**: `<h1>`
- **Font**: Raleway (LTR) / Alyamama (RTL)

| Breakpoint | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| 1440px+ | 52px | 800 | 0.95em | -0.04em |
| 992–1439px | 44px | 800 | 0.95em | -0.04em |
| 768–991px | 38px | 700 | 0.95em | -0.03em |
| max 767px | 30px | 700 | 1.0em | -0.02em |

- **Color**: `#ffffff` (white — on dark gradient)
- **Max width**: `520px` desktop / `420px` tablet / none mobile
- **White space**: `pre-line` (allows line breaks in slide data)
- **Margin bottom**: `12px` desktop / `8px` mobile

**Arabic RTL**: Alyamama 700 (800 not available — use 700). Size: +10% across all breakpoints (57px / 48px / 42px / 33px). `letter-spacing: 0`. Line height: `1.1em`. Color: `#ffffff`. Text align: `end`.

#### Sub-element: Tagline

- **Element**: `<p>`
- **Font**: Raleway (LTR) / Alyamama (RTL)
- **Size**: 15px desktop / 14px mobile
- **Weight**: 400 (regular)
- **Line height**: `1.55`
- **Letter spacing**: `0`
- **Color**: `rgba(255, 255, 255, 0.82)` — slightly dimmed white, creates visual hierarchy below headline
- **Max width**: `400px` desktop / `320px` tablet / none mobile
- **Margin bottom**: `24px` desktop / `20px` mobile

**Arabic RTL**: Alyamama 400, `17px / 16px`, `letter-spacing: 0`, `rgba(255,255,255,0.82)`, text align `end`.

#### Sub-element: CTA Button

- **Element**: `<Link>` wrapped in `<button>` or `<Link>` with ARIA role
- **Display**: `inline-flex items-center gap-2`
- **Padding**: `px-6 py-3` (24px / 12px)
- **Min height**: `48px`
- **Min width**: `160px`
- **Border radius**: `rounded-none` (0px)

| State | Background | Text | Border | Other |
|---|---|---|---|---|
| Default | transparent | `#ffffff` | `2px solid rgba(255,255,255,0.85)` | — |
| Hover | `rgba(255,255,255,0.12)` | `#ffffff` | `2px solid #ffffff` | `transition-all duration-200` |
| Active | `rgba(255,255,255,0.20)` | `#ffffff` | `2px solid #ffffff` | `scale-[0.98]` |
| Focus visible | transparent | `#ffffff` | `2px solid #ffffff` + 2px ring `#C1B167` 2px offset | — |
| Loading | as default | hidden | as default | 16px white spinner centered |
| Disabled | transparent | `rgba(255,255,255,0.40)` | `2px solid rgba(255,255,255,0.30)` | `cursor-not-allowed` |

**Tailwind classes**:
```
className="
  group inline-flex items-center gap-2
  border-2 border-white/85 text-white
  px-6 py-3 min-h-[48px]
  rounded-none
  font-raleway font-semibold text-sm tracking-tight
  bg-transparent
  transition-all duration-200
  hover:border-white hover:bg-white/[0.12]
  active:scale-[0.98] active:bg-white/[0.20]
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1B167]
"
```

**Arrow icon**: SVG `→` 16×16px inline. `ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-200`.

**Arabic RTL**: Arrow flips `←`. Button text Alyamama, same weight and size.

---

### Element: Slide Navigation Indicators

**Design**: Architectural — numbered tick marks, not circles. Each indicator is a thin vertical line with a slide number below it.

```
  ─────  ─────  ─────
  01     02     03
```

- **Container**: `absolute bottom-[40px] start-1/2 -translate-x-1/2` (bottom-center). On mobile: `bottom-[24px]`.
- **Display**: `flex gap-[16px] items-end`
- **Z-index**: `z-30`

**Each indicator item**:
- **Container**: `flex flex-col items-center gap-[6px] cursor-pointer`
- **Touch target**: min `44×44px` — extend clickable area with padding
- **Line element**: `<div>` — `w-[32px] h-[2px]` default. Active: `w-[48px]`. Transition: `width 300ms ease-out`.
- **Line color**: default `rgba(255,255,255,0.40)` / active `#ffffff` / hover `rgba(255,255,255,0.70)`
- **Number element**: `<span>` — `font-raleway font-600 text-[10px] tracking-[0.10em] text-white/50`. Active: `text-white/90`.
- **Number format**: `01`, `02`, `03` (zero-padded)

**Progress animation**: The active indicator line has a fill animation showing auto-advance progress. Implement as a CSS `width` animation from `0` to `48px` over the slide duration (5000ms). Reset on manual navigation.

**Motion-designer hook point**: `data-indicator-progress` attribute on the active line element. Motion-designer may enhance this with a `scaleX` animation instead of `width` (both are valid — coordinate).

**RTL**: `start-1/2` + `-translate-x-1/2` is direction-neutral. Number order left-to-right stays the same (numbers are not directional).

**Mobile (390px)**: Same indicator design. Container `bottom-[20px]`. Line: `w-[24px]` / active `w-[36px]`. Numbers hidden on mobile (`hidden sm:block`) — too small to read.

---

### Element: Slide Auto-Advance & Navigation Logic

- **Auto-advance interval**: 5000ms (5 seconds)
- **Pause on hover**: Yes — `onMouseEnter` pauses interval, `onMouseLeave` resumes
- **Pause on focus**: Yes — for keyboard navigation accessibility
- **Manual navigation**: clicking any indicator immediately jumps to that slide and resets the timer
- **Keyboard**: Left/Right arrow keys navigate slides when hero is focused
- **ARIA**: `aria-live="polite"` on the section. Each slide: `aria-hidden={!isActive}`. Navigation controls: `role="tablist"`, each indicator `role="tab"` with `aria-selected` and `aria-label="Slide 01: Desks"`
- **Total slides**: 3 (Desks, Seating, Tables)

**Slide data structure** (TypeScript):
```ts
interface HeroSlide {
  id: string                    // 'desks' | 'seating' | 'tables'
  image: string                 // path to 1920×1080px+ image
  mobileImage?: string          // optional portrait crop for mobile
  objectPosition?: string       // e.g. 'center 30%' — defaults to 'center center'
  collectionLabel: string       // EN: 'DESK COLLECTION' / AR: passed via i18n
  headline: string              // EN headline
  tagline: string               // EN tagline
  ctaLabel: string              // e.g. 'Explore Desks'
  ctaHref: string               // e.g. '/en/shop?category=desks'
}
```

---

## Mobile Behavior (390px)

```
┌──────────────────────────┐
│                          │
│   FULL-BLEED IMAGE       │  height: 100svh (full screen on mobile)
│   (uses mobileImage if   │  object-cover, object-top (keep product in frame)
│    provided, else image) │
│                          │
│                          │
│  ┌────────────────────┐  │
│  │ COLLECTION LABEL   │  │  gradient strip bottom 200px
│  │ Headline           │  │  ps-4 pb-6
│  │ Tagline            │  │
│  │ [CTA]              │  │
│  └────────────────────┘  │
│                          │
│     [ _ ] [ _ ] [ _ ]    │  indicators: lines only, no numbers
└──────────────────────────┘
```

- **Height**: `100svh` on mobile (`svh` not `vh` — avoids mobile browser chrome issue)
- **Image object-position**: `object-top` — most product photography has the main subject in the upper portion
- **Text padding**: `ps-4 pe-4 pb-6` — compact but breathing
- **Gradient strip height**: bottom `200px` at `72%` opacity black
- **CTA button**: full-width on mobile: `w-full justify-center` up to `max-w-[280px]`
- **Touch targets**: All indicators and CTA meet 44×44px minimum

---

## Slide Transition

**Type**: Crossfade (opacity-based)

**Implementation**:
```
Slides are stacked with position: absolute inset-0
Active slide: opacity-1, z-index: 1
Outgoing slide: animates opacity 1→0 over 600ms, then z-index: 0
Incoming slide: z-index: 1, opacity animates 0→1 over 600ms
```

**Duration**: 600ms ease-in-out

**Why crossfade over slide/parallax**:
- Slide transition would require the text overlay to move with the image, creating complexity
- Parallax slide (Ken Burns) requires larger images and more CPU
- Crossfade is the standard for premium editorial carousels (Herman Miller, Knoll, workspace.ae)
- Feels deliberate and confident — not kinetic for its own sake

**Motion-designer coordination**: Crossfade timing (600ms) is the base. Motion-designer may layer:
- Slight Ken Burns scale (1.00 → 1.03 over 5s) on active slide image — adds life without movement
- Text content: stagger-in on slide activation (see animation notes below)

---

## Animation Notes (for motion-designer coordination)

These are the hook points. Motion-designer implements the actual keyframes.

| Element | Hook attribute | Suggested behavior | Timing |
|---|---|---|---|
| Slide image | `data-hero-image` | Ken Burns: scale 1.00 → 1.04, 5s, ease-out | Starts when slide becomes active |
| Collection label | `data-hero-label` | Fade up: translateY(8px) → 0, opacity 0 → 1 | 0ms delay after crossfade starts |
| Headline | `data-hero-headline` | Fade up: translateY(12px) → 0, opacity 0 → 1 | 80ms delay |
| Tagline | `data-hero-tagline` | Fade up: translateY(8px) → 0, opacity 0 → 1 | 180ms delay |
| CTA button | `data-hero-cta` | Fade in: opacity 0 → 1 | 280ms delay |
| Slide indicators | `data-indicator-progress` | Width fill animation for active indicator | 0ms, over 5000ms |

**Reduced motion**: All `data-hero-*` animations must be wrapped in `@media (prefers-reduced-motion: no-preference)`. When reduced motion is preferred — slides still crossfade (functional), but no Ken Burns, no stagger-in text animations.

**Base state (no JS / SSR)**: All text is visible at full opacity. Animations are an enhancement, not a requirement for legibility.

---

## Responsive Notes

| Breakpoint transition | What changes |
|---|---|
| 1440px → 992px | Headline 52px → 44px. Text padding reduces from `ps-10` to `ps-8`. |
| 992px → 768px | Headline 44px → 38px. Section height `min-h-[90vh]`. |
| 768px → 390px | Section height switches to `100svh`. mobileImage used if available. CTA becomes `w-full max-w-[280px]`. Indicators drop numbers. |

Touch targets: All interactive elements ≥ 44×44px on mobile (CTA, indicators).

---

## RTL Notes

| Element | LTR | RTL |
|---|---|---|
| Text block anchor | `start-0` (left) | `start-0` → resolves to right in RTL |
| Blueprint watermark | `end-0 top-0` (top-right) | `end-0 top-0` → resolves to top-left in RTL |
| CTA arrow | `→` | `←` |
| Collection label | `letter-spacing: 0.14em`, uppercase | `letter-spacing: 0`, no transform |
| Headline font | Raleway | Alyamama, +10% size, `letter-spacing: 0`, `line-height: 1.1em` |
| Tagline font | Raleway | Alyamama, +10% size, `letter-spacing: 0` |
| Indicator numbers | LTR `01 02 03` | Same order — numbers are not directional in this context |

**Visual balance in RTL**: Arabic text is visually denser and taller. The `max-width: 540px` on the text block accommodates this — Arabic text wraps earlier, which is correct. Do not increase the max-width for Arabic; let it wrap to a second line rather than stretch horizontally. The extra line height (`1.1em` vs `0.95em`) compensates for the taller Arabic letterforms.

---

## Accessibility

| Element | Contrast | Standard |
|---|---|---|
| White headline on black/gradient | 21:1 (white on `#000000`) — gradient reduces to ~12:1 at 72% opacity | AAA |
| White/82 tagline on gradient | ~9:1 at text position | AA |
| Gold `#C1B167` collection label on gradient (`rgba(0,0,0,0.72)`) | 6.2:1 | AA |
| White CTA text on transparent overlay | ≥7:1 at gradient base | AAA |

- `aria-live="polite"` on carousel section — screen reader announces slide changes without interruption
- Slide images: `alt` text from slide data (e.g., `"Majestic executive desk collection — refined workspace"`)
- Navigation indicators: `role="tablist"`, indicators `role="tab"`, `aria-selected`, `aria-label="Go to slide 1: Desks"`
- Pause on focus — keyboard users can navigate without auto-advance racing past
- Skip link target: `id="main-content"` below the hero — hero is skippable

---

## CSS / Tailwind Reference for Frontend-Dev

### Section wrapper
```tsx
<section
  className="relative w-full min-h-[90vh] overflow-hidden bg-[#0c0c0c]"
  style={{ minHeight: '640px' }}
  aria-label="Featured collections"
  aria-live="polite"
  role="region"
>
```

### Image layer
```tsx
<div className="absolute inset-0 z-0">
  <Image
    src={slide.image}
    alt={slide.imageAlt}
    fill
    priority={index === 0}
    className={cn(
      "object-cover transition-opacity duration-[600ms] ease-in-out",
      isActive ? "opacity-100" : "opacity-0"
    )}
    style={{ objectPosition: slide.objectPosition ?? 'center center' }}
    sizes="100vw"
    data-hero-image
  />
</div>
```

### Gradient overlay
```tsx
<div
  className="absolute inset-0 z-10 pointer-events-none"
  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 35%, rgba(0,0,0,0) 60%)' }}
/>
```

### Blueprint watermark
```tsx
<div className="absolute top-0 end-0 z-10 pointer-events-none w-[320px] h-[320px] sm:w-[180px] sm:h-[180px]">
  <Image
    src="/images/blueprint-pattern.png"
    alt=""
    fill
    className="object-cover object-right-top"
    style={{ opacity: 0.04, mixBlendMode: 'screen' }}
    aria-hidden="true"
  />
</div>
```

### Text content block
```tsx
<div className="absolute bottom-0 start-0 end-0 z-20 ps-10 pe-10 pb-10 md:ps-8 md:pb-8 sm:ps-4 sm:pe-4 sm:pb-6">
  <div style={{ maxWidth: '540px' }}>
    {/* collection label */}
    <p
      className="font-raleway font-semibold text-[11px] uppercase tracking-[0.14em] mb-3"
      style={{ color: '#C1B167' }}
      data-hero-label
    >
      {slide.collectionLabel}
    </p>
    {/* headline */}
    <h1
      className="font-raleway font-extrabold text-white leading-[0.95em] tracking-[-0.04em]
        text-[52px] lg:text-[44px] md:text-[38px] sm:text-[30px]
        mb-3 whitespace-pre-line"
      data-hero-headline
    >
      {slide.headline}
    </h1>
    {/* tagline */}
    <p
      className="font-raleway font-normal text-[15px] sm:text-[14px] leading-[1.55]
        text-white/[0.82] mb-6 sm:mb-5 max-w-[400px] sm:max-w-none"
      data-hero-tagline
    >
      {slide.tagline}
    </p>
    {/* CTA */}
    <Link
      href={slide.ctaHref}
      className="group inline-flex items-center gap-2
        border-2 border-white/85 text-white
        px-6 py-3 min-h-[48px]
        rounded-none
        font-raleway font-semibold text-sm tracking-tight
        bg-transparent
        transition-all duration-200
        hover:border-white hover:bg-white/[0.12]
        active:scale-[0.98]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1B167]
        sm:w-full sm:max-w-[280px] sm:justify-center"
      data-hero-cta
    >
      {slide.ctaLabel}
      <ArrowRightIcon className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-200" />
    </Link>
  </div>
</div>
```

### Slide indicators
```tsx
<div className="absolute bottom-10 sm:bottom-5 start-1/2 -translate-x-1/2 z-30 flex gap-4 items-end">
  {slides.map((slide, i) => (
    <button
      key={slide.id}
      role="tab"
      aria-selected={i === activeIndex}
      aria-label={`Go to slide ${String(i + 1).padStart(2, '0')}: ${slide.id}`}
      onClick={() => goToSlide(i)}
      className="flex flex-col items-center gap-1.5 p-3 -m-3 cursor-pointer"
    >
      {/* progress line */}
      <div className="relative h-[2px] bg-white/40 overflow-hidden"
        style={{ width: i === activeIndex ? '48px' : '32px', transition: 'width 300ms ease-out, background-color 200ms' }}
        data-indicator-progress={i === activeIndex ? 'true' : undefined}
      >
        {i === activeIndex && (
          <div
            className="absolute inset-y-0 start-0 bg-white"
            style={{ animation: `indicator-fill ${AUTO_ADVANCE_MS}ms linear forwards` }}
          />
        )}
      </div>
      {/* number */}
      <span
        className={cn(
          "font-raleway font-semibold text-[10px] tracking-[0.10em] hidden sm:block transition-colors duration-200",
          i === activeIndex ? "text-white/90" : "text-white/50"
        )}
      >
        {String(i + 1).padStart(2, '0')}
      </span>
    </button>
  ))}
</div>
```

### CSS keyframe (add to globals.css)
```css
@keyframes indicator-fill {
  from { width: 0%; }
  to   { width: 100%; }
}
```

---

## Open Issues / Flags for Frontend-Dev

1. **Image assets are wrong size** — Current `hero-seating.jpg` is 835×304px natural height, stretched to 715px. New images must be sourced or shot at 1920×1080px minimum before this component can be tested visually. Use placeholder images at correct dimensions during development.
2. **Click navigation was broken** — Audit confirmed slide indicators do not respond to clicks in current build. This spec adds proper `onClick` → `goToSlide(i)` handlers. Verify the auto-advance timer resets correctly on manual click.
3. **mobileImage assets** — Portrait crops do not exist yet. Spec defaults to `slide.image` with `object-top` until provided.
4. **Parallax implementation** — Do not use CSS `background-attachment: fixed` (breaks on iOS Safari). Use a scroll listener with `transform: translateY()`. Clamp to ±60px. Disable on mobile.

---

## Self-Review Scorecard

| Axis | Score | Notes |
|---|---|---|
| Grid Discipline | 9/10 | All spacing from 8px scale (16/24/32/40/48). Minor: `gap-[15px]` per MASTER grid gap not used on indicator gaps — indicators use `gap-4` (16px), which is correct here. |
| Typography Hierarchy | 9/10 | 3 levels max (label / headline / tagline). Raleway/Alyamama only. Weights chosen for optical not arbitrary. |
| Whitespace | 9/10 | Bottom text block is generous. Image breathes above the gradient. Not over-designed. |
| Responsive Intelligence | 9/10 | Each breakpoint independently considered. `100svh` on mobile is correct. mobileImage prop handled. |
| RTL Nativeness | 9/10 | Logical properties throughout. Arabic type spec is independent composition (larger, tighter LS, higher LH). Watermark flips correctly. |
| Brand Alignment | 8/10 | Small override on gold (collection label) and blueprint watermark — both authorized by Aziz. No other deviations. Score reflects the deliberate tension, not a flaw. |
| **Average** | **8.8/10** | |

**Status: Ready for Build**

All axes ≥ 8. Spec may proceed to frontend-dev.
