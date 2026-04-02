/**
 * syncProducts — mirrors WooCommerce products + categories into Supabase.
 *
 * SERVER-SIDE ONLY. Uses supabaseAdmin (service role key).
 * Triggered via GET /api/sync-products (protected by bearer token check).
 */

import { getProducts, getCategories } from "./woocommerce";
import { supabaseAdmin } from "./supabase";

export interface SyncResult {
  products: number;
  categories: number;
  synced_at: string;
}

export async function syncProducts(): Promise<SyncResult> {
  const synced_at = new Date().toISOString();

  // ── Fetch all products (paginate — WC caps at 100/page) ──
  let allProducts: Awaited<ReturnType<typeof getProducts>> = [];
  let page = 1;
  while (true) {
    const batch = await getProducts({ per_page: 100, page });
    if (!batch.length) break;
    allProducts = allProducts.concat(batch);
    if (batch.length < 100) break;
    page++;
    // Rate limit: 500ms between bulk calls
    await new Promise((r) => setTimeout(r, 500));
  }

  // ── Upsert products ──
  const productRows = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    name_ar: null as string | null, // AR products are separate WC entries; populated by lang sync
    slug: p.slug,
    price: p.price ? parseFloat(p.price) : null,
    regular_price: p.regular_price ? parseFloat(p.regular_price) : null,
    sale_price: p.sale_price ? parseFloat(p.sale_price) : null,
    status: p.status,
    categories: p.categories,
    images: p.images,
    short_description: p.short_description,
    description: p.description,
    stock_status: p.stock_status,
    synced_at,
  }));

  if (productRows.length) {
    const { error: prodErr } = await supabaseAdmin
      .from("products")
      .upsert(productRows, { onConflict: "id" });
    if (prodErr) {
      console.error("[syncProducts] products upsert error:", prodErr);
      throw new Error(prodErr.message);
    }
  }

  // ── Fetch and upsert categories ──
  const wcCategories = await getCategories();
  const categoryRows = wcCategories.map((c) => ({
    id: c.id,
    name: c.name,
    name_ar: null as string | null,
    slug: c.slug,
    count: c.count,
    synced_at,
  }));

  if (categoryRows.length) {
    const { error: catErr } = await supabaseAdmin
      .from("categories")
      .upsert(categoryRows, { onConflict: "id" });
    if (catErr) {
      console.error("[syncProducts] categories upsert error:", catErr);
      throw new Error(catErr.message);
    }
  }

  return {
    products: productRows.length,
    categories: categoryRows.length,
    synced_at,
  };
}

// ── Supabase-first read helpers ────────────────────────────────────────────

/**
 * Returns products from Supabase cache. Empty array means cache is cold —
 * caller should fall back to direct WC API.
 */
export async function getProductsFromSupabase(): Promise<
  { id: number; name: string; slug: string; price: number | null; images: unknown; categories: unknown; stock_status: string | null; status: string | null }[]
> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id, name, slug, price, images, categories, stock_status, status")
    .order("id");
  if (error || !data?.length) return [];
  return data;
}

/**
 * Returns categories from Supabase cache.
 */
export async function getCategoriesFromSupabase(): Promise<
  { id: number; name: string; slug: string; count: number }[]
> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("id, name, slug, count")
    .order("name");
  if (error || !data?.length) return [];
  return data;
}
