// Motion tokens — import everywhere instead of hardcoding easing/duration values.

export const ease = {
  // Elements entering the screen
  out: [0, 0, 0.2, 1] as const,
  // Elements leaving the screen
  in: [0.4, 0, 1, 1] as const,
  // Component transitions (modal, drawer, tab)
  inOut: [0.4, 0, 0.2, 1] as const,
  // Scroll reveals and page entrances — primary brand easing
  smooth: [0.16, 1, 0.3, 1] as const,
} as const;

export const duration = {
  instant: 0.1,    // hover states, focus rings
  micro: 0.15,     // icon lifts, swatch borders
  fast: 0.2,       // hover transitions
  normal: 0.3,     // dropdowns, tooltips, small reveals
  medium: 0.4,     // scroll reveals, text entrance
  slow: 0.5,       // section reveals, card entrance
  hero: 0.8,       // hero crossfade, large transitions
  blueprint: 1.2,  // blueprint pattern fade
  draw: 1.6,       // SVG stroke-dashoffset draw-in animations
} as const;

// Viewport threshold — trigger when 20% of element is visible
export const VIEWPORT_THRESHOLD = 0.2;

// Stagger presets (seconds between children)
export const stagger = {
  tight: 0.03,    // footer links
  normal: 0.05,   // space typology panels
  relaxed: 0.08,  // collection/insight cards
  slow: 0.12,     // project rows
} as const;
