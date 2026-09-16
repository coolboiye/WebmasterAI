"use client";

import { createBrowserClient } from "@supabase/ssr";

// Returns null (instead of throwing) when the env vars aren't set yet, so the
// rest of the app can fall back to local-only (no-account) mode instead of
// crashing. This matters for this project specifically because it's meant to
// run before a mentor has created a Supabase project.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createBrowserClient(url, key);
}
