/**
 * WooCommerce REST API Client
 *
 * All WC API calls go through this client. NEVER expose credentials to the browser.
 * This module runs server-side only (API routes, Server Components, Server Actions).
 */

const WC_URL = process.env.WC_URL || "https://lightyellow-mallard-240169.hostingersite.com";
const WC_KEY = process.env.WC_CONSUMER_KEY || "";
const WC_SECRET = process.env.WC_CONSUMER_SECRET || "";


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
      if (attempt === retries) {
        console.error(`[WC] ${method} ${endpoint} failed:`, err);
        throw err;
      }
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
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
  on_sale: boolean;
  purchasable: boolean;
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; alt: string }[];
  attributes: { id: number; name: string; options: string[] }[];
  related_ids: number[];
  upsell_ids: number[];
  stock_status: string;
  weight: string;
  dimensions: { length: string; width: string; height: string };
  /** Polylang sibling IDs — e.g. { en: 990950, ar: 990931 } */
  translations: Record<string, number>;
}

export const PRODUCT_PLACEHOLDER = "https://thedeskco.net/wp-content/uploads/2026/03/hero_office_desktop_en-1.png";

export function parsePrice(price: string): number {
  const n = parseFloat(price);
  return isNaN(n) ? 0 : n;
}

export function calcDiscount(regular: string, sale: string): number | undefined {
  const r = parsePrice(regular);
  const s = parsePrice(sale);
  if (!r || !s || s >= r) return undefined;
  return Math.round(((r - s) / r) * 100);
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
  lang?: string;
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

export interface ProductPage {
  products: WCProduct[];
  total: number;
  totalPages: number;
}

// ── Supabase cache imports (lazy to avoid circular deps) ──────────────────

async function trySupabaseProducts() {
  try {
    const { getProductsFromSupabase } = await import("./sync-products");
    return await getProductsFromSupabase();
  } catch {
    return [];
  }
}

async function trySupabaseCategories() {
  try {
    const { getCategoriesFromSupabase } = await import("./sync-products");
    return await getCategoriesFromSupabase();
  } catch {
    return [];
  }
}

export async function getProductPage(params: {
  page?: number;
  per_page?: number;
  category?: number;
  search?: string;
  orderby?: string;
  order?: "asc" | "desc";
  lang?: string;
} = {}): Promise<ProductPage> {
  const url = new URL(`/wp-json/wc/v3/products`, WC_URL);
  const merged = { per_page: 24, status: "publish", ...params };
  Object.entries(merged).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.set(k, String(v));
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`${WC_KEY}:${WC_SECRET}`)}`,
  };

  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        headers,
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error(`WC API ${res.status}`);
      const products = (await res.json()) as WCProduct[];
      const total = parseInt(res.headers.get("X-WP-Total") ?? "0", 10);
      const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);
      return { products, total, totalPages };
    } catch (err) {
      if (attempt === 2) {
        console.error("[WC] getProductPage failed:", err);
        return { products: [], total: 0, totalPages: 1 };
      }
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  return { products: [], total: 0, totalPages: 1 };
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
  // Try Supabase cache first; fall back to direct WC call if empty
  const cached = await trySupabaseCategories();
  if (cached.length) {
    return cached.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parent: 0,
      description: "",
      image: null,
      count: c.count,
    }));
  }
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
