/**
 * Supabase clients — lazy-initialized via Proxy so importing this module
 * doesn't call createClient() at eval time. This lets Next.js build even
 * when NEXT_PUBLIC_SUPABASE_URL isn't set in the Preview environment.
 *
 * supabaseClient — uses NEXT_PUBLIC_ keys, safe in client components
 * supabaseAdmin  — uses service role key, SERVER-SIDE ONLY (API routes, server actions)
 *                  NEVER import supabaseAdmin in a "use client" file
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function lazyClient(
  make: () => SupabaseClient,
): SupabaseClient {
  let _c: SupabaseClient | null = null;
  const get = (): SupabaseClient => {
    if (!_c) _c = make();
    return _c;
  };
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      const c = get();
      const v = (c as unknown as Record<string | symbol, unknown>)[prop];
      return typeof v === "function" ? (v as (...a: unknown[]) => unknown).bind(c) : v;
    },
  });
}

// Client-safe — anon/publishable key
export const supabaseClient = lazyClient(() =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ),
);

// Server-only — service role key bypasses RLS
// Do not import this in any "use client" component
export const supabaseAdmin = lazyClient(() =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  ),
);
