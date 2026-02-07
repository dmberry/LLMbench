/**
 * Supabase Browser Client for LLMbench
 *
 * Adapted from CCS-WB. Use for browser-side operations.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
        return await fn();
      },
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
