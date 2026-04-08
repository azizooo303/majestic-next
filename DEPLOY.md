# Deployment

## Vercel Setup
1. Connect GitHub repo (`azizooo303/majestic-next`) to Vercel
2. Framework: Next.js (auto-detected)
3. Add environment variables from `.env.example`

## Environment Variables (Vercel Dashboard)
- `WC_URL` — `https://lightyellow-mallard-240169.hostingersite.com`
- `WC_CONSUMER_KEY` — WooCommerce REST API key
- `WC_CONSUMER_SECRET` — WooCommerce REST API secret
- `NEXT_PUBLIC_SITE_URL` — `https://majestic-next.vercel.app`

## How It Works
- Push to `main` branch → Vercel auto-deploys to production
- Push to any other branch → Vercel creates a preview deployment
- No manual deploy needed. No custom domain configured yet.

## Post-Deploy Checklist
- [ ] EN/AR routing works (`/en/` and `/ar/`)
- [ ] Homepage loads
- [ ] No console errors
- [ ] Images loading from Hostinger backend
- [ ] SSL active
