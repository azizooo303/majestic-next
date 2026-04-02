/**
 * Supabase clients
 *
 * supabaseClient — uses NEXT_PUBLIC_ keys, safe in client components
 * supabaseAdmin  — uses service role key, SERVER-SIDE ONLY (API routes, server actions)
 *                  NEVER import supabaseAdmin in a "use client" file
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-safe — anon/publishable key
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server-only — service role key bypasses RLS
// Do not import this in any "use client" component
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});
