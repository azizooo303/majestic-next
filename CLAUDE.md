@AGENTS.md

# Majestic Next.js — Headless Rebuild

> **MANDATORY FIRST STEP — EVERY SESSION, EVERY AGENT**
> Before doing ANY work, read the HQ knowledge base:
> 1. `HQ/Home.md` — the full org dashboard
> 2. The relevant `HQ/Projects/` page for this project
> 3. Only then proceed to project files
>
> HQ vault path: `C:/Users/Admin/Desktop/Majestic-HQ/HQ/`


## What This Is
The Next.js headless frontend for **Majestic Furniture** (TheDeskCo) — Saudi Arabia's premier workspace furniture brand. This repo is the full website rebuild, replacing the old WordPress/Elementor frontend with a modern, bilingual (EN/AR) Next.js app deployed on Vercel.

## Owner
**Aziz** — founder, reviews all plans before production deploys. No silent deploys.

## Infrastructure (PERMANENT — never change these)

| Resource | URL / Path |
|---|---|
| **Backend (WooCommerce/WP)** | `https://lightyellow-mallard-240169.hostingersite.com` |
| **Frontend (live Vercel)** | `https://majestic-next-git-main-azizooo303s-projects.vercel.app/en` |
| **GitHub repo** | `github.com/azizooo303/majestic-next` |
| **Local path** | `C:/Users/Admin/Desktop/Majestic-Next` |
| **HQ (parent org)** | `C:/Users/Admin/Desktop/Majestic-HQ` |

> **NEVER use `thedeskco.net`** — discontinued domain, removed from all code and config.

### Deployment
- Push to `main` → Vercel auto-deploys. No manual deploy needed.
- Always present a Vercel preview URL to Aziz before shipping to production.

### Environment Variables
- WC API keys, Supabase, Moyasar/Tabby/Tamara (payment sandbox), Cloudinary, Sentry, Vercel Edge Config
- All secrets in `.env.local` (gitignored). Template in `.env.example`.
- WP user: `ftswj2`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, RSC, Turbopack dev) |
| Language | **TypeScript 5** (strict mode) |
| React | **React 19** |
| Styling | **Tailwind CSS 4** + CSS custom properties |
| UI Library | **shadcn/ui** (base-nova style, Lucide icons) |
| Animation | **GSAP 3** + **Framer Motion 12** |
| i18n | **next-intl 4** — locales: `en` (default), `ar` (RTL) |
| Backend API | **WooCommerce REST API** (Hostinger) |
| Database | **Supabase** (messages, contact forms) |
| Images | **Cloudinary** + `next/image` (AVIF/WebP) |
| Monitoring | **Sentry** (error tracking, source maps) |
| Testing | **Playwright** (E2E, visual regression, screenshots) |
| Storybook | **Storybook 8** (with a11y + RTL addons) |
| CI/CD | **GitHub Actions** (type-check, lint, Lighthouse budget) |
| Deployment | **Vercel** (auto-deploy on push to main) |
| Bundle Analysis | `@next/bundle-analyzer` (run with `ANALYZE=true`) |

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/          ← All public pages (EN/AR routing)
│   │   ├── page.tsx       ← Homepage
│   │   ├── shop/          ← Product listing + [id] detail
│   │   ├── cart/           checkout/         quotation/
│   │   ├── about/          contact/          inspirations/
│   │   ├── blog/           careers/          brands/
│   │   ├── riyadh/         jeddah/           dammam/          khobar/
│   │   ├── delivery/       warranty/         materials/        product-care/
│   │   ├── privacy/        terms/            faq/              track-order/
│   │   ├── projects/       showrooms/        account/
│   │   └── layout.tsx     ← Locale layout (fonts, header, footer, RTL)
│   ├── admin/             ← Admin panel (password-protected via middleware)
│   ├── api/               ← API routes (cart, admin, sync-products)
│   ├── layout.tsx         ← Root layout
│   ├── globals.css        ← Tailwind + design tokens
│   ├── robots.ts          ← SEO robots
│   └── sitemap.ts         ← SEO sitemap
├── components/
│   ├── ui/                ← shadcn/ui primitives
│   ├── layout/            ← Header, Footer
│   ├── hero/              ← Hero banner components
│   ├── sections/          ← Homepage sections
│   ├── product/           ← Product cards, grids
│   ├── shop/              ← Shop page components
│   ├── contact/           ← Contact form
│   ├── search/            ← Search UI
│   ├── support/           ← FAQ, support components
│   └── common/            ← Shared utilities (AnimatePresenceWrapper, etc.)
├── config/
│   ├── site.ts            ← BRAND, CONTACT, SHOWROOMS, HERO_SLIDES, NAV, SEO
│   └── content-schema.ts
├── context/
│   └── cart-context.tsx   ← Cart state provider
├── data/
│   └── projects.ts        ← Project portfolio data
├── i18n/
│   ├── routing.ts         ← Locale config (en, ar)
│   ├── navigation.ts
│   └── request.ts
├── lib/
│   ├── woocommerce.ts     ← WC REST API client
│   ├── store-api.ts       ← Store API helpers
│   ├── cart.ts            ← Cart logic
│   ├── supabase.ts        ← Supabase client (browser)
│   ├── supabase-client.ts ← Supabase client utilities
│   ├── supabase-admin.ts  ← Supabase service role
│   ├── edge-config.ts     ← Vercel Edge Config (announcements, feature flags)
│   ├── admin-auth.ts      ← Admin HMAC auth
│   ├── motion.ts          ← Animation utilities
│   ├── site-url.ts        ← URL helpers
│   ├── utils.ts           ← General utilities (cn, etc.)
│   ├── sync-products.ts   ← Product sync logic
│   └── types/
│       ├── product.ts     ← Product type definitions
│       └── cart.ts        ← Cart type definitions
└── middleware.ts           ← i18n routing + admin auth + security headers
```

### Other Key Directories

```
design-system/
├── MASTER.md              ← Design system source of truth
└── pages/                 ← Per-page design specs (homepage, shop, cart, checkout, product-detail)

design-specs/              ← Component-level specs (hero-banner, hero-redesign, animation-system, homepage)
content/site-copy.md       ← Site copy reference
messages/                  ← i18n translation files (en.json, ar.json)
scripts/majestic.js        ← CLI: ship, deploy, status, env, wc, images, products
tests/                     ← Playwright test specs
audit-results/             ← Screenshot captures + audit reports
visual-scan-results/       ← Visual regression baselines
research/                  ← Competitor analysis, site audits
supabase/migrations/       ← Database migrations
.storybook/                ← Storybook config
.github/workflows/ci.yml   ← CI pipeline

.claude/rules/
├── infrastructure.md      ← Permanent backend URL, Vercel frontend, credentials
├── typescript.md          ← Types, immutability, error handling, naming conventions
└── web.md                 ← File organization, CSS tokens, animation rules, CWV targets
```

---

## Pages Built (28)
28 pages complete with EN + AR routing, responsive layouts, GSAP animations:
- **Core:** Homepage, Shop, Shop/[id] (product detail), Cart, Checkout, Quotation, Account
- **Brand:** About, Contact, Inspirations, Blog, Careers, Brands, Projects, Projects/[slug], Showrooms
- **City:** Riyadh, Jeddah, Dammam, Khobar
- **Support:** Delivery, Warranty, Materials, Product Care, FAQ, Track Order, Privacy, Terms
- **Admin:** `/admin` (password-protected panel + login)

---

## MCP Tools Available

| MCP | What it does |
|---|---|
| **GitHub** | PRs, issues, code review on `azizooo303/majestic-next` |
| **Playwright** | Browser automation for E2E testing, screenshots, visual regression |
| **Hostinger** | Backend server management (WooCommerce/WP at lightyellow-mallard) |

Available skills: `/firecrawl-scrape` (competitor research), `/gsap-*` (animation reference), `/frontend-design` (design intelligence), `/seo-*` (SEO analysis suite)

---

## Design System

**Source of truth:** `design-system/MASTER.md` — read this before building any component.
Per-page specs in `design-system/pages/` override MASTER when they exist.
Component-level specs in `design-specs/`.

---

## i18n / RTL

- **Locales:** `en` (default, LTR), `ar` (RTL)
- **Routing:** `/en/...` and `/ar/...` via next-intl middleware
- **Translations:** `messages/en.json` and `messages/ar.json`
- **RTL:** `dir="rtl"` on `<html>` for Arabic. Use logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`)
- **Arabic font:** Alyamama at 110% font-size, zero letter-spacing
- **Arabic numerals:** Eastern Arabic numerals for prices in AR locale
- **Every page must render correctly in both LTR and RTL** — always verify both

---

## Ecommerce Status

- **Products:** Mock/static data until WooCommerce catalog is fully migrated
- **Cart:** Client-side CartProvider context (functional UI, not connected to WC cart API yet)
- **Checkout:** UI built, payment gateways (Moyasar, Tabby, Tamara) in sandbox mode
- **Quotation:** E-Quotation form available (key B2B feature)
- All ecommerce features are front-end ready but **backend integration is pending**

---

## Agents (11 — orchestrated from Majestic-HQ)

| Agent | Role | Type |
|---|---|---|
| ui-designer | Visual specs — design system, layouts, components | Builder |
| frontend-dev | Builds pages and React components per spec | Builder |
| api-dev | WooCommerce data, cart, checkout, payments | Builder |
| css-architect | CSS changes, responsive, RTL, accessibility | Builder |
| ux-reviewer | UX quality — interactions, flows, animations | Reviewer (READ ONLY) |
| motion-designer | Animation quality, scroll interactions | Reviewer (READ ONLY) |
| security-auditor | OWASP, payment security, auth flows | Reviewer (READ ONLY) |
| seo-specialist | Meta tags, structured data, sitemap | Builder |
| test-engineer | Playwright E2E, screenshots, visual regression | Tester |
| perf-engineer | Bundle size, Lighthouse, Core Web Vitals | Tester |
| devops | Vercel deploys, CI/CD, DNS, env vars | Ops |

---

## Build Pipeline

Every page must pass all stages before shipping:

```
0. ui-designer creates visual spec
   ↓
1. frontend-dev builds the page/component
   ↓
2. api-dev wires WooCommerce data (if applicable)
   ↓
3. test-engineer captures screenshots
   ↓
4. Review round (reviewers read screenshots FIRST, then code):
   ├── ux-reviewer
   ├── motion-designer
   ├── seo-specialist
   └── security-auditor (if auth/payment involved)
   ↓
5. Fix issues from review
   ↓
6. test-engineer runs E2E + visual regression
   ↓
7. perf-engineer checks bundle size + Core Web Vitals
   ↓
8. devops deploys to Vercel preview
   ↓
9. Aziz approves preview URL → ship to production
```

---

## Scripts

```bash
npm run dev              # Start dev server (Turbopack)
npm run build            # Production build
npm run lint             # ESLint
npm run type-check       # TypeScript strict check (tsc --noEmit)
npm run ship             # type-check → commit → push → Vercel deploy
npm run deploy           # Force Vercel production deploy
npm run status           # Git status + recent Vercel deployments
npm run screenshot       # Capture visual scan screenshots (Playwright)
npm run screenshot:regression  # Run visual regression tests
npm run storybook        # Start Storybook dev server (port 6006)
npm run tokens:sync      # Sync design tokens to CSS
npm run tokens:check     # Validate token consistency
ANALYZE=true npm run build  # Bundle analysis
```

---

## Middleware

`src/middleware.ts` handles three concerns:
1. **i18n routing** — next-intl redirects bare paths to `/en/...` or `/ar/...`
2. **Admin auth** — `/admin` routes protected by HMAC cookie (`majestic_admin`)
3. **Security headers** — X-Content-Type-Options, X-Frame-Options, HSTS, etc.

---

## Performance Targets

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| FCP | < 1.5s |
| JS bundle (landing) | < 150kb gzipped |
| JS bundle (app page) | < 300kb gzipped |

---

## Key Rules

> **1. Always present a plan and wait for Aziz's approval before production deploys.**
> **2. NEVER use `thedeskco.net`** — it's discontinued. Use the Hostinger URL for backend.
> **3. Design system MASTER.md is the source of truth** — check `design-system/pages/` for per-page overrides.
> **4. Every page must work in both EN (LTR) and AR (RTL).**
> **5. Screenshots are required before review agents run — no exceptions.**
> **6. All ecommerce data is mock/static** until the payment platform is connected.
> **7. Reviewers (ux-reviewer, security-auditor, motion-designer) are READ ONLY** — they report issues, they don't fix them.

---

## Anti-Patterns (NEVER)

- `<img>` tags — always use `next/image`
- Client components for static content — use RSC by default
- `any` type — use `unknown` and narrow
- External font CDN — use `next/font/google`
- `console.log` in production code
- Mutating objects/arrays — always create new copies
- `thedeskco.net` anywhere in code or config
- Deploying without Aziz reviewing a preview URL
- Running review agents without capturing screenshots first
- Skipping RTL verification

---

## Logging

All agents append to `dept-log.jsonl` after every run:
```json
{"ts": "ISO", "agent": "name", "action": "type", "target": "what", "status": "success|failure|rollback", "duration_s": 0, "error": null, "lesson": null}
```

---

## Approval Hierarchy

| Action | Approval Needed? |
|---|---|
| Reading, searching, auditing | No |
| Building components, writing code | No |
| Running dev server, tests, screenshots | No |
| Deploying to Vercel preview | No |
| Shipping to production | **Yes — Aziz must approve preview URL** |
| Changing infrastructure / env vars | **Yes** |
| Deleting files, destructive git ops | **Yes — explicit confirm** |
