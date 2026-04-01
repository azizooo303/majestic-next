# Deployment

## Vercel Setup
1. Connect GitHub repo to Vercel
2. Set Root Directory: `departments/wordpress-next`
3. Framework: Next.js (auto-detected)
4. Add environment variables from `.env.example`

## Environment Variables (Vercel Dashboard)
- `NEXT_PUBLIC_WC_URL` — WooCommerce store URL
- `WC_CONSUMER_KEY` — WooCommerce REST API key
- `WC_CONSUMER_SECRET` — WooCommerce REST API secret
- `NEXT_PUBLIC_SITE_URL` — https://thedeskco.net

## DNS (Cloudflare / your DNS provider)
- Add CNAME: `thedeskco.net` → `cname.vercel-dns.com`
- Add CNAME: `www.thedeskco.net` → `cname.vercel-dns.com`

## Post-Deploy Checklist
- [ ] Custom domain added in Vercel dashboard
- [ ] SSL auto-provisioned
- [ ] EN/AR routing works (`/en/` and `/ar/`)
- [ ] Homepage loads
- [ ] No console errors
