# Majestic / TheDeskCo — DESIGN.md

> Machine-readable design system for AI agents. Every decision in this file is authoritative.
> Source of truth: HQ/Company/Brand Identity.md + HQ/Company/Design Direction.md
> Last updated: 2026-04-10

---

## 1. Visual Atmosphere

Majestic is a B2B-first office furniture company in Saudi Arabia. The visual language is **professional, dense, and institutional** — not luxury, not minimal-sparse, not playful.

**Reference aesthetic:** workspace.ae — product-first, information-rich, white/black/charcoal only.

**Design philosophy inspired by:**
- Josef Müller-Brockmann — Swiss grid systems, mathematical precision
- Dieter Rams — "less but better", form follows function
- Jan Tschichold — typographic excellence and hierarchy

**Mood:** Serious business. A senior architect browsing office furniture for a 500-seat HQ should feel immediately at home — confident, efficient, no noise.

**What this site is NOT:** luxury editorial, lifestyle-forward, gradient-heavy, rounded-soft, playful.

---

## 2. Color Palette

### Tokens

| Token | Hex | Usage | Weight |
|---|---|---|---|
| `--color-charcoal` | `#2C2C2C` | Primary text, headers, filled buttons, primary surfaces | 40% |
| `--color-dark-gray` | `#3A3A3A` | Secondary text, subtle UI elements | 20% |
| `--color-background` | `#FFFFFF` | All page backgrounds, card backgrounds | 30% |
| `--color-border` | `#D4D4D4` | All borders, dividers, table lines | 10% |
| `--color-disabled` | `#E7E7E7` | Disabled inputs, muted backgrounds | — |
| `--color-hover-bg` | `#F5F5F5` | Hover state backgrounds | — |
| `--color-foreground` | `#000000` | Rarely used — prefer charcoal for most text |  — |

### Rules
- **No gradients** — ever, on any element
- **No pure black `#000000` for text** — always charcoal `#2C2C2C`
- **No dark backgrounds** — every page background is white
- **No accent colors** — the brand is strictly monochrome
- **No gold (`#C1B167`)** — permanently discontinued
- **No sage green (`#F0F5F0`)** — permanently discontinued
- **No saturated or bright colors** anywhere in the UI

---

## 3. Typography

### Font Stack

| Role | Font | Weights | Notes |
|---|---|---|---|
| **Display / Brand** | Alyamama (variable) | 300–900 | Self-hosted, all headings and brand moments |
| **Body (English)** | Raleway | 400, 500, 600 | Secondary body, UI labels |
| **Body (fallback)** | Montserrat | 400, 500 | Tertiary fallback |
| **System fallback** | sans-serif | — | Never visible if fonts load correctly |

### Scale

| Tag | Size | Line Height | Weight |
|---|---|---|---|
| h1 | 36px (4xl) | 1.9 | 700 |
| h2 | 30px (3xl) | 1.8 | 600 |
| h3 | 24px (2xl) | 1.8 | 600 |
| h4 | 20px (xl) | 1.7 | 600 |
| h5/h6 | 18px (lg) | 1.7 | 500 |
| body | 16px | 1.6 | 400 |
| small/label | 14px (sm) | 1.6 | 400 |
| caption | 12px (xs) | 1.5 | 400 |

### Bilingual Rules (CRITICAL)
- The site is **always bilingual: Arabic + English**
- **Arabic is primary** — not a translation of English
- Arabic text is displayed in RTL (`dir="rtl"`, `lang="ar"`)
- Arabic font size is **5–10% larger** than the English equivalent
- Arabic uses zero letter-spacing (`letter-spacing: 0`)
- Arabic text uses `font-family: Alyamama` always
- Arabic copy comes **first** in dual-language layouts
- **Tone:** refined, understated, warm, institutional — no hype, no exclamation marks, no slang, no ALL CAPS

---

## 4. Component Styling

### Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| **Primary (filled)** | `#2C2C2C` | `#FFFFFF` | none | `#3A3A3A` bg |
| **Secondary (ghost)** | `#FFFFFF` | `#2C2C2C` | 1px `#2C2C2C` | `#F5F5F5` bg |
| **Disabled** | `#E7E7E7` | `#3A3A3A` | none | no change |

Rules:
- **No colored buttons** — only charcoal-filled or ghost
- **No rounded corners** on primary/secondary buttons — `border-radius: 0`
- Padding: `12px 24px` (desktop), `10px 20px` (mobile)
- Active micro-feedback: `scale(0.97)` on press (`.btn-press` class)

### Product Card

- White background
- Charcoal text
- 1px `#D4D4D4` border on hover (not default)
- Product image fills the card top — minimum 60% of card height
- No shadow by default — shadow only on hover (`box-shadow: 0 4px 16px rgba(0,0,0,0.08)`)
- Price displayed in charcoal, prominent weight (600)
- No rounded corners
- AR product name above EN product name

### Navigation / Header

- White background always
- Mega menu with dense product grid (workspace.ae pattern)
- Active nav item: underline animation (`nav-underline` class, scaleX from 0 to 1)
- No colored nav elements

### Cards (general)

- White bg, `#D4D4D4` borders
- Zero border-radius
- Hover: subtle shadow lift

### Forms / Inputs

- 1px `#D4D4D4` border
- `border-radius: 0`
- Focus: border changes to `#2C2C2C`
- No colored focus rings

### Dividers

- 1px `#D4D4D4`
- Horizontal only — no decorative dividers

---

## 5. Layout Principles

### Grid System

- **Base unit:** 4px
- **Max content width:** 1440px
- **Page gutter (desktop):** 80px each side
- **Page gutter (tablet):** 40px
- **Page gutter (mobile):** 16px
- **Column system:** 12-column grid
- Alignment is mathematical — all elements snap to grid

### Spacing Scale

| Token | Value | Use |
|---|---|---|
| `space-1` | 8px | Tight — inline gaps |
| `space-2` | 16px | Component internal padding |
| `space-3` | 24px | Card padding |
| `space-4` | 32px | Section sub-spacing |
| `space-5` | 40px | Between components |
| `space-6` | 48px | Section padding |
| `space-8` | 64px | Major section breaks |
| `space-12` | 96px | Hero and page-level spacing |

### Whitespace Rules

- Minimum **30–40% whitespace** in all layouts
- Whitespace is structural — used deliberately, not as empty filler
- Dense layout ≠ zero breathing room. Sections have clear rhythm.
- Product is always the visual hero — never occluded by text, overlays, or graphics

### Section Structure

- Sections use `py-12` (96px) vertical padding on desktop
- Hero sections: full-width, 1920×700 image, text overlay in charcoal or white (contrast-dependent)
- No full-screen takeovers except hero slider

---

## 6. Depth / Elevation System

Majestic uses **minimal depth** — the brand is flat with purposeful shadow only on interaction.

| Level | Shadow | Usage |
|---|---|---|
| 0 (flat) | none | Default for all elements |
| 1 (hover) | `0 4px 16px rgba(0,0,0,0.08)` | Cards, product tiles on hover |
| 2 (dropdown) | `0 8px 24px rgba(0,0,0,0.12)` | Mega menu, dropdowns |
| 3 (modal) | `0 16px 48px rgba(0,0,0,0.16)` | Modals, overlays |

Rules:
- **No decorative shadows** — shadow only communicates elevation/interactivity
- **No `box-shadow` on static cards** — only on hover/focus/active
- **No inner shadows**
- **No text shadows**
- Animations use `will-change-transform` / `will-change-opacity` for GPU promotion

---

## 7. Design Guardrails

These are hard stops. If a design violates these, it is wrong.

### Absolute Never

- [ ] No gradients (linear, radial, conic) anywhere
- [ ] No gold (`#C1B167`) — permanently discontinued
- [ ] No sage green (`#F0F5F0`) — permanently discontinued
- [ ] No rounded corners on buttons, inputs, cards (`border-radius: 0` for these)
- [ ] No dark backgrounds — every background is white
- [ ] No pure black `#000000` for body text — use `#2C2C2C`
- [ ] No colored CTAs — buttons are charcoal-filled or ghost only
- [ ] No hype copy — no exclamation marks, no ALL CAPS, no slang
- [ ] No effects on logo — no shadows, no glows, no distortions
- [ ] No blueprint overlay patterns — permanently discontinued
- [ ] No animation for animation's sake — all motion has purpose

### Required Always

- [ ] Bilingual layout — Arabic + English on every customer-facing page
- [ ] Arabic is displayed first (before English) in dual-language contexts
- [ ] RTL layout for Arabic locale (`dir="rtl"`, `lang="ar"`)
- [ ] Arabic text uses Alyamama font
- [ ] All backgrounds white
- [ ] All primary buttons charcoal (#2C2C2C) filled
- [ ] Page max-width 1440px, centered
- [ ] Product images are the visual hero

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Layout |
|---|---|---|
| mobile | 375px | Single column, 16px gutters |
| tablet | 768px | 2-column grid, 40px gutters |
| desktop | 1024px | Full grid, 80px gutters |
| wide | 1440px | Max content width, centered |

### Mobile Rules

- Navigation collapses to hamburger menu
- Mega menu becomes full-screen drawer
- Hero images: 375×500 minimum
- Product cards: 2-up grid on mobile (not 1-up)
- Typography scale reduces by ~20%: h1 drops to ~28px
- Touch targets: minimum 44×44px
- No horizontal scroll on any page

### RTL Responsive

- Arabic (`dir="rtl"`) layout mirrors LTR:
  - Text alignment: right
  - Flex direction: row-reverse where applicable
  - Padding/margin mirrors (left ↔ right)
  - Auto-scroll direction inverts (`.majestic-autoscroll-rtl`)
- Arabic layout must be tested at all 4 breakpoints

---

## 9. Agent Prompts

### For AI Coding Agents (frontend-dev, ui-designer)

When building or modifying any UI component for Majestic:

1. **Check color first** — only use tokens in Section 2. Reject any color outside this set.
2. **Check border-radius** — buttons, inputs, cards must be `border-radius: 0` or `2px` max.
3. **Check bilingual** — every user-facing text string needs both AR and EN via `next-intl`.
4. **Check RTL** — use `dir`, `rtl:` Tailwind variants, and test mirroring.
5. **Check whitespace** — 30% minimum. Dense ≠ cramped.
6. **Never add gradients, gold, sage, or rounded corners.**
7. **Motion** — use GSAP for complex animations. Keep durations 0.3–0.6s. Respect `prefers-reduced-motion`.

### For Audit Agents (ux-reviewer, brand-guardian)

When auditing any page or component:

1. Score each section against Section 7 Guardrails (pass/fail per rule)
2. Flag any color outside the Section 2 palette
3. Flag any rounded corners > 2px on buttons/inputs/cards
4. Flag missing bilingual content on customer-facing pages
5. Flag any gradient usage
6. Flag any dark background usage
7. Report density score: is the layout appropriately B2B-dense or is it too sparse/luxury?
8. Check RTL parity: does the AR layout mirror the EN layout correctly?

### For Visual Generation Agents (prompt-engineer, visual-designer)

- Background: always white
- Subject: office furniture, architectural context
- Lighting: soft directional, professional studio or inhabited office
- No bold colors in background
- Composition: 30–40% whitespace, product centered or rule-of-thirds
- Human presence: optional, subtle — never the focus
- No graphic overlays, no text in image

---

*This file is the authoritative design contract for all AI agents working on the Majestic-Next project.*
*Update this file when brand rules change — do not keep stale copies in memory.*
