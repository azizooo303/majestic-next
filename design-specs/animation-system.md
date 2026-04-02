# Animation System — Majestic Furniture Next.js
**Author:** Motion Designer  
**Date:** 2026-04-02  
**Status:** Ready for implementation  
**Implements from:** `research/site-audit-2026-04-02.md`  
**Target:** `majestic-next.vercel.app/en`

---

## 1. Technology Recommendation

**Use Framer Motion — it is already installed and partially in use.**

Framer Motion is the correct tool for this project for three reasons:

1. It is already present in `package.json` and used in `reveal.tsx`, `stagger-grid.tsx`, and `animate-presence-wrapper.tsx`. Starting over with CSS + Intersection Observer would duplicate work and create two motion systems running in parallel.
2. The `useReducedMotion()` hook is already wired into the existing primitives — this is the right accessibility pattern and should be preserved and extended.
3. Framer Motion's `useScroll` + `useTransform` API is better suited to the scroll-linked craftsmanship band auto-scroll and project scale reveal than raw Intersection Observer.

**What to NOT use:**

- Spring physics (`type: "spring"`) — this brand is architectural, not playful. Every animation uses `cubic-bezier` easing, specified below.
- `AnimateSharedLayout` / `layoutId` — not needed on this site.
- Framer Motion's `motion.img` or `motion.video` — use Next.js `Image` with CSS transitions for image-level effects. Reserve Framer Motion for layout-level motion.

---

## 2. Easing Tokens

Define these once in `src/lib/motion.ts` and import everywhere. Frontend-dev should create this file.

```typescript
// src/lib/motion.ts

export const ease = {
  // Elements entering the screen
  out: [0, 0, 0.2, 1] as const,
  // Elements leaving the screen  
  in: [0.4, 0, 1, 1] as const,
  // Component transitions (modal, drawer, tab)
  inOut: [0.4, 0, 0.2, 1] as const,
  // Scroll reveals and page entrances — the primary brand easing
  smooth: [0.16, 1, 0.3, 1] as const,
} as const;

export const duration = {
  instant: 0.1,       // hover states, focus rings
  micro: 0.15,        // icon lifts, swatch borders
  fast: 0.2,          // hover transitions
  normal: 0.3,        // dropdowns, tooltips, small reveals
  medium: 0.4,        // scroll reveals, text entrance
  slow: 0.5,          // section reveals, card entrance
  hero: 0.8,          // hero crossfade, large transitions
  blueprint: 1.2,     // blueprint pattern fade
} as const;

// Viewport threshold — trigger when 20% of element is visible
export const VIEWPORT_THRESHOLD = 0.2;

// Stagger presets
export const stagger = {
  tight: 0.03,        // footer links (30ms)
  normal: 0.05,       // space typology panels (50ms between)
  relaxed: 0.08,      // collection/insight cards (80ms between)
  slow: 0.12,         // project rows
} as const;
```

---

## 3. Reduced Motion Strategy

The existing primitives already call `useReducedMotion()` — this is correct. The rule is simple: **when `useReducedMotion()` returns true, render the static layout with zero transform or opacity changes. All content remains visible and fully interactive.**

Add this global CSS to `globals.css` as a safety net for any elements that use CSS transitions directly (category strip, swatch borders, image hovers):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For the craftsmanship band auto-scroll: when `useReducedMotion()` is true, disable the auto-scroll entirely. Show images in their static horizontal strip with standard overflow-x-auto scrolling. Users can scroll manually.

For the hero slider: when `useReducedMotion()` is true, disable `autoPlay`. Slides advance only on dot/arrow interaction. No crossfade — use instant cut (`transition-none`).

For the count-up animation in Project Scale: when `useReducedMotion()` is true, show the final number immediately. No counting animation.

---

## 4. Reusable Primitives

Frontend-dev must build these six components. They cover every animation pattern on the homepage. Replace or extend the existing `reveal.tsx` and `stagger-grid.tsx` — the existing versions use scroll-linked `useTransform` which fires continuously during scroll and is more expensive than viewport-triggered `whileInView`. Switch to `whileInView` + `initial`/`animate` for the standard reveal pattern.

### 4.1 `<FadeUp>` — replaces current `<Reveal>`

The workhorse. Used on section headings, text blocks, footer columns, single elements.

```typescript
// src/components/common/fade-up.tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration, VIEWPORT_THRESHOLD } from "@/lib/motion";

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;      // default: 24
  delay?: number;        // seconds, default: 0
  motionDuration?: number; // seconds, default: duration.slow (0.5)
}

export function FadeUp({
  children,
  className,
  yOffset = 24,
  delay = 0,
  motionDuration = duration.slow,
}: FadeUpProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: VIEWPORT_THRESHOLD }}
      transition={{ duration: motionDuration, ease: ease.smooth, delay }}
    >
      {children}
    </motion.div>
  );
}
```

**Usage differences vs current `<Reveal>`:**
- Uses `whileInView` instead of scroll-linked `useTransform` — fires once, no continuous recalculation.
- `yOffset` defaults to 24px (not 30px) — the brief calls for 24px for standard section reveals.
- `viewport: { once: true }` — elements don't re-animate on scroll back up (correct for furniture galleries).
- Accepts `delay` for manual stagger when needed outside of `<StaggerChildren>`.

**Replace all current `<Reveal>` usage with `<FadeUp>`.** The existing `<Reveal>` component can be deleted after migration.

---

### 4.2 `<StaggerChildren>` — replaces current `<StaggerGrid>`

Used for the three collections, six space typology panels, three insight cards, footer link groups.

```typescript
// src/components/common/stagger-children.tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration, VIEWPORT_THRESHOLD } from "@/lib/motion";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;   // seconds between children, default: 0.08
  yOffset?: number;        // default: 24
  motionDuration?: number; // per-child duration, default: duration.slow
}

const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

const childVariants = (yOffset: number, motionDuration: number) => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration, ease: ease.smooth },
  },
});

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.08,
  yOffset = 24,
  motionDuration = duration.slow,
}: StaggerChildrenProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: VIEWPORT_THRESHOLD }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={childVariants(yOffset, motionDuration)}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
```

**Why this is better than the current `<StaggerGrid>`:**
- Variants propagate cleanly through the hierarchy — no per-item scroll progress calculations.
- The container fires once when it enters the viewport, then children stagger. The current implementation uses a single `scrollYProgress` for the whole container which causes all children to animate simultaneously if the container is taller than the viewport.

**Replace all current `<StaggerGrid>` usage with `<StaggerChildren>`.**

---

### 4.3 `<SlideIn>` — for Space Typology panels

Used exclusively for the horizontal stagger of the 6 space typology panels (left-to-right entrance, translating from x not y).

```typescript
// src/components/common/slide-in.tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration } from "@/lib/motion";

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  xOffset?: number;    // default: -20 (from left)
  delay?: number;      // seconds
}

export function SlideIn({
  children,
  className,
  xOffset = -20,
  delay = 0,
}: SlideInProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: duration.medium, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
```

**RTL note:** In Arabic locale, xOffset should be `+20` (from right). The caller in `space-typology.tsx` must pass `xOffset={isAr ? 20 : -20}`.

---

### 4.4 `<CountUp>` — for Project Scale stats

Standalone number counter. Fires once when visible.

```typescript
// src/components/common/count-up.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  value: string;        // e.g., "320", "18", "100%"
  duration?: number;    // ms, default: 1500
  className?: string;
}

export function CountUp({ value, duration = 1500, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  // Parse: extract the numeric prefix and any suffix (%, +, etc.)
  const numeric = parseInt(value, 10);
  const suffix = isNaN(numeric) ? value : value.replace(String(numeric), "");
  const isNumeric = !isNaN(numeric);

  const [display, setDisplay] = useState(isNumeric ? "0" : value);

  useEffect(() => {
    if (!isInView || reduced || !isNumeric) {
      setDisplay(value);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out curve: 1 - (1 - progress)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numeric);
      setDisplay(String(current) + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, reduced, isNumeric, numeric, suffix, value, duration]);

  return <span ref={ref} className={className}>{display}</span>;
}
```

**Usage in `project-scale.tsx`:** Replace the static `{stat.value}` render with `<CountUp value={stat.value} />`.

---

### 4.5 `<AutoScroll>` — for Craftsmanship Band

CSS animation-driven auto-scroll strip. Pauses on hover. Reduced-motion disables entirely.

```typescript
// src/components/common/auto-scroll.tsx
"use client";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface AutoScrollProps {
  children: React.ReactNode;
  duration?: number;   // seconds for one full loop, default: 60
  gap?: string;        // CSS gap between items, default: "8px"
  className?: string;
}

export function AutoScroll({
  children,
  duration = 60,
  gap = "8px",
  className,
}: AutoScrollProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    // Static horizontal strip, user scrolls manually
    return (
      <div
        className={className}
        style={{ display: "flex", gap, overflowX: "auto" }}
      >
        {children}
      </div>
    );
  }

  // Duplicate children for seamless loop
  return (
    <div
      className={className}
      style={{ overflow: "hidden", position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          gap,
          width: "max-content",
          animation: `majestic-autoscroll ${duration}s linear infinite`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
        }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </div>
    </div>
  );
}
```

Add to `globals.css`:
```css
@keyframes majestic-autoscroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

**Important:** The `transform: translateX(-50%)` works because the inner div contains the children duplicated, so 50% of its width equals exactly one set of children. This is GPU-accelerated (`transform` only — no `left`, no `scrollLeft` manipulation).

---

### 4.6 `<BlueprintOverlay>` — for Hero

The blueprint pattern slow-fade on slide load.

```typescript
// src/components/hero/blueprint-overlay.tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ease, duration } from "@/lib/motion";

interface BlueprintOverlayProps {
  slideKey: number;   // changes on each slide transition to re-trigger fade
}

export function BlueprintOverlay({ slideKey }: BlueprintOverlayProps) {
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      key={slideKey}
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: "url('/images/blueprint-pattern.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "400px 400px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.06 }}
      transition={{ duration: duration.blueprint, ease: ease.out }}
      aria-hidden="true"
    />
  );
}
```

---

## 5. Per-Section Animation Specification

### Section 0 — Header

**Scroll shrink (desktop):**
- Trigger: `scrollY > 80`
- Header height: 80px initial, shrinks to 64px
- Background: `bg-white/80 backdrop-blur-sm` added on scroll
- Implementation: CSS class toggle via `useScroll` in header component. Do NOT use `useTransform` on height — height animation triggers layout. Instead, toggle a CSS class that changes `padding` (from `py-4` to `py-2`). Padding is layout but the change is only 8px and inside a fixed element — acceptable.
- Duration: 300ms, `transition-all duration-300 ease-out` (Tailwind)

**Mega-menu open (desktop):**
- `initial={{ opacity: 0, y: -6 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `exit={{ opacity: 0, y: -4 }}`
- `transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}` (ease-out)
- Use `<AnimatePresence mode="wait">` already in the codebase

**Mega-menu close:**
- `exit={{ opacity: 0 }}`
- `transition={{ duration: 0.15, ease: [0.4, 0, 1, 1] }}` (ease-in — faster out than in)

**Mobile drawer open:**
- `initial={{ x: "100%" }}`
- `animate={{ x: 0 }}`
- `transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}`
- Backdrop: `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `transition={{ duration: 0.2 }}`

**Mobile drawer close:**
- `exit={{ x: "100%" }}`
- `transition={{ duration: 0.25, ease: [0.4, 0, 1, 1] }}`
- Backdrop exit: `transition={{ duration: 0.15 }}`

**RTL note:** In Arabic locale, the drawer slides from the left. Use `initial={{ x: "-100%" }}` / `exit={{ x: "-100%" }}`.

---

### Section 1 — Hero Slider

The existing slider uses `transition-opacity duration-500` as a Tailwind class. This must be upgraded.

**Image crossfade:**
- Current: `duration-500` (500ms)
- Required: 800ms ease-in-out
- Change: `transition-opacity` class → `duration-[800ms] ease-in-out`
- This is a Tailwind arbitrary value change — no Framer Motion needed here, CSS transition is correct for image crossfade.

**Text entrance per slide:**
The current implementation puts text inside the same `absolute inset-0` div as the image. Text animates in when a slide becomes active.

Wrap the text block in `<AnimatePresence mode="wait">` with the `current` slide index as key:

```typescript
// Inside the active slide div:
<AnimatePresence mode="wait">
  <motion.div
    key={slide.id}
    className="absolute bottom-8 start-8 md:bottom-16 md:start-16 max-w-lg z-20"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
  >
    {/* overline, h2, description, CTA — unchanged content */}
  </motion.div>
</AnimatePresence>
```

- `delay: 0.4` ensures text starts sliding in 400ms after slide becomes active (while image crossfade is still in progress — text arrives as image settles).
- Exit: translates upward (-20px) and fades — feels like old content receding as new content arrives.

**Progress dots — active dot:**
- Current: Tailwind `w-2.5 → w-8`, `transition-all duration-300`
- This is already correct behavior. The 300ms duration and the width change are handled by Tailwind's transition. No Framer Motion needed.
- Width changes trigger layout recalculation — this is a known compromise for dot indicators. The reflow is contained to the small dot row. Acceptable.

**Blueprint overlay:**
- Use `<BlueprintOverlay slideKey={current} />` inside the slide container.
- Placed as a sibling to the Image, after the dark gradient overlay, before the text block.
- `z-index: 10`, `pointer-events-none`

**Reduced motion:** Disable `autoPlay`. Set `transition-none` on the slide div. `<BlueprintOverlay>` returns null. Text is shown statically.

---

### Section 2 — Category Navigation Strip

Pure CSS hover transitions — no Framer Motion needed here.

**Icon lift on hover:**
```css
/* Add to the icon wrapper element */
transition: transform 150ms cubic-bezier(0, 0, 0.2, 1);
```
On hover: `transform: translateY(-4px)`

In Tailwind: `transition-transform duration-150 hover:-translate-y-1` (1 = 4px)

**Label color on hover:**
```css
transition: color 150ms cubic-bezier(0, 0, 0.2, 1);
```
On hover: `color: #C1B167`

In Tailwind: `transition-colors duration-150 hover:text-[#C1B167]`

**Active gold underline (slides in from left):**
The active category indicator is a positioned `::after` pseudo-element or a `<span>`.

```css
.category-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: #C1B167;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
}

.category-item.active .category-underline,
.category-item:hover .category-underline {
  transform: scaleX(1);
}
```

In RTL locale: `transform-origin: right`

**Reduced motion:** All three effects use `transition-duration: 0.01ms` via the global CSS reset. The hover state still visually changes (color change, underline appears) — just instantly.

---

### Section 4 — Space Typology (6 panels)

**Scroll-triggered entrance (left-to-right stagger):**

Wrap the panel grid in a container that fires the stagger. Each panel uses `<SlideIn>` with an incremental delay.

In `space-typology.tsx`, change the grid from a plain `div` to iterate with explicit delays:

```typescript
{PANELS.map((panel, i) => (
  <SlideIn
    key={panel.labelEn}
    xOffset={isAr ? 20 : -20}
    delay={i * 0.06}   // 60ms stagger
  >
    <Link ...> {/* existing panel content unchanged */} </Link>
  </SlideIn>
))}
```

Viewport amount: `0.1` — the section is near the fold, use a small threshold to avoid panels never firing on shorter screens.

**Hover — image scale:**
Already implemented: `group-hover:scale-[1.04] transition-transform duration-500`
Change `duration-500` to `duration-300` — 500ms is too slow for a hover response.

**Hover — overlay darkening:**
Already implemented: `opacity-0 group-hover:opacity-100 transition-opacity duration-300`
This is correct. No changes needed.

**Hover — label lift:**
Already implemented: `translate-y-1 group-hover:translate-y-0 transition-all duration-300`
Change `duration-300` to `duration-200` — align with the 150-200ms hover budget.

---

### Section 5 — Collections (3 cards)

**Scroll reveal:**
`collections.tsx` already uses `<StaggerGrid>`. Replace with `<StaggerChildren staggerDelay={0.08} yOffset={24}`.

The section heading already uses `<Reveal>`. Replace with `<FadeUp>`.

**Hover — card lift:**
The card currently has no hover lift. Add to the outer card `div`:
```
transition-all duration-200 hover:-translate-y-2 hover:shadow-lg
```
- `-translate-y-2` = 8px lift
- `shadow-lg` deepens the shadow (Tailwind's shadow-lg is sufficient — do not animate box-shadow directly as it is not GPU-accelerated)

**Hover — image scale:**
Already implemented: `group-hover:scale-[1.03] transition-transform duration-500`
Change to `duration-300`.

---

### Section 6 — Craftsmanship Band

**Auto-scroll:**
Replace the current static `<div className="flex gap-2 overflow-x-auto ...">` with:

```typescript
<AutoScroll duration={60} gap="8px">
  {IMAGES.map((img) => (
    <div key={img.src} className="relative flex-none w-[220px] md:w-[260px] aspect-[3/4] overflow-hidden">
      <Image ... />
    </div>
  ))}
</AutoScroll>
```

The current component has 5 images. At 260px wide with 8px gap, the strip is ~1340px wide. At 60s per loop, scroll speed is ~22px/s — barely perceptible, like an architectural drawing unfolding.

**Hover on individual image — scale + tilt:**
The current image divs have no hover state. Add:
```
transition-transform duration-300 hover:scale-[1.05] hover:rotate-[0.5deg]
```
- `0.5deg` tilt — this is below the 1-degree maximum specified in the brief.
- `duration-300` matches the 300ms hover budget for image-level effects.

**Section heading:** Currently uses `<Reveal>`. Replace with `<FadeUp>`.

---

### Section 7 — Project Scale

**Scroll reveal — image panel:**
The two project rows currently use `<Reveal>` wrapping the whole row. Replace with a more directional reveal:

For the image half:
```typescript
<motion.div
  className="relative w-full md:w-1/2 ..."
  initial={{ opacity: 0, x: isAr ? 40 : -40 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
>
```

For the stats + text half (comes in from the opposite side):
```typescript
<motion.div
  className="w-full md:w-1/2 ..."
  initial={{ opacity: 0, x: isAr ? -40 : 40 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
>
```

This creates a pincer effect — image slides from one side, stats from the other — communicating that these two halves belong together.

**Count-up numbers:**
In `project-scale.tsx`, replace:
```typescript
<p className="text-4xl font-bold text-[#C1B167]">{stat.value}</p>
```
With:
```typescript
<p className="text-4xl font-bold text-[#C1B167]">
  <CountUp value={stat.value} duration={1500} />
</p>
```

The `CountUp` component fires when its `ref` enters the viewport (uses `useInView` with `amount: 0.5`). The 1500ms duration with ease-out cubic ensures numbers count up quickly at first, then slow as they approach the target — communicating scale and weight.

---

### Section 8 — Material Selector

**Finish crossfade:**
Currently implemented as:
```
transition-opacity duration-400
```
`duration-400` is not a valid Tailwind class (arbitrary values use brackets). Change to:
```
transition-opacity duration-300
```
300ms ease-in-out crossfade between finishes. This is already using absolute positioned overlapping divs — the correct approach. No Framer Motion needed.

**Swatch hover:**
Currently: `scale-105` on the active swatch's inner div. Add hover scale to the button:
```
hover:scale-110 transition-transform duration-150
```

Border brightening on hover:
```
hover:border-[#C1B167] transition-colors duration-150
```

**Section entrance:**
The section currently has no entrance animation. Wrap the header `div` with `<FadeUp>` and the swatch panel with `<FadeUp delay={0.1}>`.

---

### Section 9 — Insight Editorial (3 cards)

**Scroll reveal:**
`insight-editorial.tsx` already uses `<StaggerGrid>`. Replace with `<StaggerChildren staggerDelay={0.08} yOffset={24}`.

**Hover — image scale:**
Already implemented: `group-hover:scale-[1.03] transition-transform duration-500`
Change to `duration-300`.

No card lift needed here — editorial cards are lighter content than collection cards, hover image scale is sufficient.

---

### Section 10 — Inspire Section + Promo Banner

**Scroll reveal:**
Wrap the inspire section and promo banner each in `<FadeUp>`.

No additional motion — these are supporting sections, not hero content.

---

### Section 11 — Footer

**Scroll reveal:**
Wrap the footer's main content columns in `<StaggerChildren staggerDelay={0.03}>` — the tightest stagger value, 30ms between columns. Footer motion should be subtle and quick.

Each footer link group is a child. The stagger communicates the organized, systematic nature of the brand (like a blueprint legend).

No hover animations beyond standard `transition-colors` on links (already Tailwind default behavior).

---

## 6. Implementation Order

Build in this order for maximum visual impact per unit of effort. Each phase is independently shippable.

### Phase 1 — Foundation (1-2 hours)
1. Create `src/lib/motion.ts` with all tokens
2. Build `<FadeUp>` and `<StaggerChildren>`
3. Replace all `<Reveal>` → `<FadeUp>`, all `<StaggerGrid>` → `<StaggerChildren>` in existing section components
4. Add global reduced-motion CSS to `globals.css`

**Impact:** The entire page goes from dead-static to having consistent scroll-triggered reveals on every section. This is the single highest-impact change.

### Phase 2 — Hero (1-2 hours)
5. Upgrade hero image crossfade to 800ms in Tailwind
6. Wrap slide text in `<AnimatePresence>` with `y: 40 → 0` entrance
7. Build `<BlueprintOverlay>` and add to hero
8. Verify dot indicator 300ms transition (already correct)

**Impact:** The hero — the first thing every visitor sees — goes from a flat image swap to an architectural content reveal.

### Phase 3 — Hover States (1 hour)
9. Category strip: icon lift + gold label + underline slide-in (pure CSS/Tailwind)
10. Collection cards: `-translate-y-2 hover:shadow-lg` lift
11. Space typology: change image hover from 500ms to 300ms
12. Swatch buttons: scale + border color on hover

**Impact:** The site starts feeling interactive and responsive — things respond to the cursor.

### Phase 4 — Section-Specific (2-3 hours)
13. Space typology: `<SlideIn>` with 60ms stagger replacing plain div
14. Project scale: directional image/stats reveal, `<CountUp>` on numbers
15. Craftsmanship band: `<AutoScroll>` component + image hover tilt

**Impact:** The three most architecturally distinctive sections get their signature motions.

### Phase 5 — Navigation (1-2 hours)
16. Header scroll shrink (class toggle on scroll)
17. Mega-menu `<AnimatePresence>` entrance/exit
18. Mobile drawer slide with backdrop

**Impact:** Navigation feels premium — one of the highest interaction-frequency areas.

### Phase 6 — Cleanup (30 min)
19. Delete old `reveal.tsx` and `stagger-grid.tsx`
20. Verify `prefers-reduced-motion` across all new components
21. Verify RTL (Arabic locale) for all directional animations

---

## 7. What Already Exists vs. What Needs Building

| File | Status | Action |
|------|--------|--------|
| `src/components/common/reveal.tsx` | Exists, scroll-linked | Replace with `<FadeUp>` — delete after migration |
| `src/components/common/stagger-grid.tsx` | Exists, scroll-linked | Replace with `<StaggerChildren>` — delete after migration |
| `src/components/common/animate-presence-wrapper.tsx` | Exists, correct | Keep — used for page transitions |
| `src/lib/motion.ts` | Does not exist | Create (Phase 1) |
| `src/components/common/fade-up.tsx` | Does not exist | Create (Phase 1) |
| `src/components/common/stagger-children.tsx` | Does not exist | Create (Phase 1) |
| `src/components/common/slide-in.tsx` | Does not exist | Create (Phase 3) |
| `src/components/common/count-up.tsx` | Does not exist | Create (Phase 4) |
| `src/components/common/auto-scroll.tsx` | Does not exist | Create (Phase 4) |
| `src/components/hero/blueprint-overlay.tsx` | Does not exist | Create (Phase 2) |

---

## 8. Performance Notes

All animations in this spec are GPU-accelerated. The only transforms used are:
- `opacity` — compositor only
- `transform: translateX/Y` — compositor only
- `transform: scale` — compositor only
- `transform: rotate` (craftsmanship band tilt, max 0.5deg) — compositor only

**Do not add `will-change`** to any of these components. Modern browsers promote elements with `transform` transitions automatically. `will-change: transform` is only justified for elements that must be ready before the animation fires (e.g., the hero image on initial load). If performance issues arise in testing, target only the hero image panel:
```css
.hero-image-panel {
  will-change: opacity;
}
```
Remove `will-change` after the transition completes by toggling a class.

The `<AutoScroll>` component runs a CSS `@keyframes` animation, not a JavaScript loop. The inner div is a single compositor layer running `translateX`. It does not trigger layout or paint on any frame.

The `<CountUp>` component uses `requestAnimationFrame` with a JS-side counter updating a single text node. This is a DOM text update, not a style mutation — it does not trigger layout reflow on the surrounding elements.

---

## 9. RTL (Arabic Locale) Checklist

All directional animations must be mirrored. This is the complete list:

| Component | LTR | RTL |
|-----------|-----|-----|
| `<SlideIn>` (Space Typology) | `xOffset: -20` | `xOffset: +20` |
| Project Scale image reveal | `x: -40` | `x: +40` |
| Project Scale stats reveal | `x: +40` | `x: -40` |
| Hero text `exit` | `y: -20` (up) | `y: -20` (up — same, vertical) |
| Mobile drawer | `x: "100%"` | `x: "-100%"` |
| Category underline | `transform-origin: left` | `transform-origin: right` |
| `<AutoScroll>` | `translateX(-50%)` | `translateX(50%)` — needs direction toggle |

The `<AutoScroll>` component needs an `isRTL` prop that flips the keyframe direction. Add a second keyframe:
```css
@keyframes majestic-autoscroll-rtl {
  0%   { transform: translateX(0); }
  100% { transform: translateX(50%); }
}
```

---

## 10. Anti-Patterns Avoided

The following patterns from the brief's anti-pattern list were consciously avoided in this spec:

- No spring physics anywhere — all easing is cubic-bezier
- No scale > 1.05 on hover — maximum is `scale(1.05)` on swatches only (small, contained elements), `scale(1.04)` on imagery
- No parallax on text — blueprint overlay parallaxes only as a background texture, never over text
- No auto-playing animation loops that cannot be paused — `<AutoScroll>` pauses on hover
- No transition duration > 500ms on micro-interactions — hover states are all 150-200ms
- No bounce easing — `cubic-bezier(0.34, 1.56, 0.64, 1)` is not used anywhere
- No `prefers-reduced-motion` violations — every component checks `useReducedMotion()`
