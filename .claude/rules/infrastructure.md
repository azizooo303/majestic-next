# Infrastructure Rules — PERMANENT

## Backend (WordPress / WooCommerce / Media)
**Permanent URL:** `https://lightyellow-mallard-240169.hostingersite.com`

This is the ONLY backend URL. It is permanent and does not change.

### NEVER use:
- `thedeskco.net` — old domain, discontinued, remove on sight
- Any other Hostinger temp URL

### Always use for:
- WC_URL in all env files
- WordPress REST API calls (`/wp-json/wp/v2/`)
- WooCommerce API (`/wp-json/wc/v3/`)
- Media/image URLs (`/wp-content/uploads/`)
- Product placeholder images
- remotePatterns in next.config.ts

## Frontend (Vercel + GitHub)
**Live site:** `https://majestic-next-git-main-azizooo303s-projects.vercel.app/en`
**Repo:** `github.com/azizooo303/majestic-next`
**Local:** `C:/Users/Admin/Desktop/Majestic-Next`

Push to `main` → Vercel auto-deploys. No manual deploy needed.

## Credentials
- WC consumer key/secret → `.env.local`
- WP Application Password → in wordpress-website `.env`
- WP_USER: `ftswj2`
