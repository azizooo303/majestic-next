/**
 * WooCommerce Store API Client (Cart & Checkout)
 *
 * The Store API is designed for headless commerce — session-based cart,
 * no authentication needed for guest checkout.
 *
 * This runs on the server side via API routes. Cart state is managed
 * via the `Cart-Token` header (WC session token).
 */

const WC_URL = process.env.WC_URL || "https://lightyellow-mallard-240169.hostingersite.com";

interface StoreAPIOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  cartToken?: string;
}

export async function storeApiFetch<T>({
  endpoint,
  method = "GET",
  body,
  cartToken,
}: StoreAPIOptions): Promise<{ data: T; cartToken: string | null }> {
  const url = `${WC_URL}/wp-json/wc/store/v1/${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Store API ${res.status}: ${error}`);
  }

  const newCartToken = res.headers.get("Cart-Token");
  const data = (await res.json()) as T;

  return { data, cartToken: newCartToken };
}

// ── Cart Operations ──

export async function getCart(cartToken?: string) {
  return storeApiFetch<StoreCart>({
    endpoint: "cart",
    cartToken,
  });
}

export async function addToCart(
  productId: number,
  quantity: number = 1,
  cartToken?: string
) {
  return storeApiFetch<StoreCart>({
    endpoint: "cart/add-item",
    method: "POST",
    body: { id: productId, quantity },
    cartToken,
  });
}

export async function removeFromCart(itemKey: string, cartToken?: string) {
  return storeApiFetch<StoreCart>({
    endpoint: "cart/remove-item",
    method: "POST",
    body: { key: itemKey },
    cartToken,
  });
}

export async function updateCartItem(
  itemKey: string,
  quantity: number,
  cartToken?: string
) {
  return storeApiFetch<StoreCart>({
    endpoint: "cart/update-item",
    method: "POST",
    body: { key: itemKey, quantity },
    cartToken,
  });
}

export async function applyCoupon(code: string, cartToken?: string) {
  return storeApiFetch<StoreCart>({
    endpoint: "cart/apply-coupon",
    method: "POST",
    body: { code },
    cartToken,
  });
}

// ── Store API Types ──

interface StoreCart {
  items: StoreCartItem[];
  items_count: number;
  totals: {
    total_items: string;
    total_shipping: string;
    total_discount: string;
    total_price: string;
    currency_code: string;
    currency_symbol: string;
  };
  coupons: { code: string; totals: { total_discount: string } }[];
}

interface StoreCartItem {
  key: string;
  id: number;
  name: string;
  slug: string;
  images: { id: number; src: string; alt: string; thumbnail: string }[];
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
  };
  quantity: number;
  totals: {
    line_subtotal: string;
    line_total: string;
  };
}
