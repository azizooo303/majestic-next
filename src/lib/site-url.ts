/**
 * Returns the canonical site URL with optional path appended.
 * Uses NEXT_PUBLIC_SITE_URL env var, falls back to Vercel deploy URL.
 */
export function siteUrl(path = ""): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://majestic-next.vercel.app"
  )
    .trim()
    .replace(/\/$/, "");
  return `${base}${path}`;
}
