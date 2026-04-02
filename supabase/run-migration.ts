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

const SUPABASE_URL = "https://mdaogykmjeulxteokeon.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYW9neWttamV1bHh0ZW9rZW9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE0ODY2NiwiZXhwIjoyMDkwNzI0NjY2fQ.Wbc6h8PZ9jUpq5HV0ECMadcYSkEWRrb0k130ljY4tFo";

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
