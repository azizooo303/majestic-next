# Web / Frontend Rules
# Source: adapted from affaan-m/everything-claude-code (MIT)

## File Organization

Organize by feature, not by file type:

```
src/
├── components/
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── HeroVisual.tsx
│   │   └── hero.css
│   └── ui/
│       ├── Button.tsx
│       └── AnimatedText.tsx
├── hooks/
├── lib/
└── styles/
    ├── tokens.css
    └── global.css
```

## CSS Custom Properties

Define design tokens as variables — never hardcode palette/spacing/typography:

```css
:root {
  --color-surface: oklch(98% 0 0);
  --color-text: oklch(18% 0 0);
  --color-accent: oklch(68% 0.21 250);
  --text-base: clamp(1rem, 0.92rem + 0.4vw, 1.125rem);
  --space-section: clamp(4rem, 3rem + 5vw, 10rem);
  --duration-normal: 300ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Animation — Compositor Only

Only animate: `transform`, `opacity`, `clip-path`, `filter` (sparingly)

Never animate: `width`, `height`, `top`, `left`, `margin`, `padding`

## Semantic HTML

Use `<header>`, `<main>`, `<section aria-labelledby>`, `<footer>` — not generic div stacks.

## Design Quality — Anti-Template Policy

Do NOT ship generic template-looking UI. Every surface should look intentional and product-specific.

### Banned patterns:
- Default card grids with uniform spacing
- Stock hero: centered headline + gradient blob + generic CTA
- Flat layouts with no depth or motion
- Uniform radius/spacing/shadows across everything
- Safe gray-on-white with one decorative accent

### Required qualities (at least 4 per surface):
1. Clear hierarchy through scale contrast
2. Intentional rhythm in spacing
3. Depth/layering through overlap, shadows, or motion
4. Typography with real pairing strategy
5. Color used semantically
6. Designed hover/focus/active states
7. Grid-breaking composition where appropriate
8. Motion that clarifies flow

## Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| FCP | < 1.5s |

## Bundle Budget

| Page | JS (gzipped) | CSS |
|------|-------------|-----|
| Landing | < 150kb | < 30kb |
| App page | < 300kb | < 50kb |

## Image Rules

- Always set explicit `width` and `height`
- Hero: `loading="eager" fetchpriority="high"`
- Below fold: `loading="lazy"`
- Prefer AVIF/WebP with fallbacks
- Never ship source images far beyond rendered size

## Font Rules

- Max 2 font families
- `font-display: swap`
- Preload only critical weight/style
