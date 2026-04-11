/**
 * One-time migration runner — run this once to create tables.
 * Usage: npx tsx supabase/run-migration.ts
 *
 * Alternatively paste the SQL from migrations/20260402_initial_schema.sql
 * directly into the Supabase dashboard SQL editor.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// The Supabase JS client cannot run raw DDL via the REST API.
// This script outputs the SQL so you can paste it into:
//   https://supabase.com/dashboard/project/mdaogykmjeulxteokeon/sql/new

const sql = readFileSync(
  join(__dirname, "migrations/20260402_initial_schema.sql"),
  "utf-8"
);

console.log("=".repeat(60));
console.log("MANUAL STEP REQUIRED:");
console.log("Paste the SQL below into the Supabase SQL editor:");
console.log("https://supabase.com/dashboard/project/mdaogykmjeulxteokeon/sql/new");
console.log("=".repeat(60));
console.log(sql);
