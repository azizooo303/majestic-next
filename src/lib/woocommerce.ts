/**
 * WooCommerce REST API Client
 *
 * All WC API calls go through this client. NEVER expose credentials to the browser.
 * This module runs server-side only (API routes, Server Components, Server Actions).
 */

const WC_URL = process.env.WC_URL || "https://lightyellow-mallard-240169.hostingersite.com";
const WC_KEY = process.env.WC_CONSUMER_KEY || "";
const WC_SECRET = process.env.WC_CONSUMER_SECRET || "";

const RATE_LIMIT_MS = 500;
let lastRequest = 0;

async function rateLimit() {
  const now = Date.now();
  const wait = RATE_LIMIT_MS - (now - lastRequest);
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastRequest = Date.now();
}

interface WCRequestOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string | number>;
  body?: unknown;
  retries?: number;
}

export async function wcFetch<T>({
  endpoint,
  method = "GET",
  params = {},
  body,
  retries = 2,
}: WCRequestOptions): Promise<T> {
  await rateLimit();

  const url = new URL(`/wp-json/wc/v3/${endpoint}`, WC_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`${WC_KEY}:${WC_SECRET}`)}`,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        next: { revalidate: method === "GET" ? 60 : 0 },
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`WC API ${res.status}: ${error}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  throw new Error("Unreachable");
}

// ── Product Types ──

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; alt: string }[];
  attributes: { id: number; name: string; options: string[] }[];
  related_ids: number[];
  upsell_ids: number[];
  stock_status: string;
  weight: string;
  dimensions: { length: string; width: string; height: string };
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: { id: number; src: string; alt: string } | null;
  count: number;
}

// ── Product API ──

export async function getProducts(params: {
  page?: number;
  per_page?: number;
  category?: number;
  search?: string;
  orderby?: string;
  order?: "asc" | "desc";
} = {}): Promise<WCProduct[]> {
  return wcFetch<WCProduct[]>({
    endpoint: "products",
    params: {
      per_page: 24,
      status: "publish",
      ...params,
    },
  });
}

export async function getProduct(idOrSlug: number | string): Promise<WCProduct> {
  if (typeof idOrSlug === "number") {
    return wcFetch<WCProduct>({ endpoint: `products/${idOrSlug}` });
  }
  const products = await wcFetch<WCProduct[]>({
    endpoint: "products",
    params: { slug: idOrSlug },
  });
  if (!products.length) throw new Error(`Product not found: ${idOrSlug}`);
  return products[0];
}

export async function getCategories(): Promise<WCCategory[]> {
  return wcFetch<WCCategory[]>({
    endpoint: "products/categories",
    params: { per_page: 100, hide_empty: 1 },
  });
}

// ── Price Formatting ──

export function formatPrice(price: string | number, locale: string = "en"): string {
  const amount = typeof price === "string" ? parseInt(price, 10) : price;
  if (isNaN(amount)) return "";

  if (locale === "ar") {
    return `${amount.toLocaleString("ar-SA")} ر.س`;
  }
  return `SAR ${amount.toLocaleString("en-US")}`;
}
