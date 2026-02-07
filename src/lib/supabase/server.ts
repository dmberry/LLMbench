/**
 * Supabase Server Client for LLMbench
 *
 * Adapted from CCS-WB. Use for server-side operations (API routes, server components).
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component - can be ignored
        }
      },
    },
  });
}

export function createSupabaseRouteClient(
  request: Request,
  response: { headers: Headers }
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const cookieMap = new Map<string, string>();
  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    if (name) {
      cookieMap.set(name, rest.join("="));
    }
  });

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return Array.from(cookieMap.entries()).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieValue = serializeCookie(name, value, options);
          response.headers.append("Set-Cookie", cookieValue);
        });
      },
    },
  });
}

function serializeCookie(
  name: string,
  value: string,
  options?: CookieOptions
): string {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  if (options) {
    if (options.maxAge !== undefined) cookie += `; Max-Age=${options.maxAge}`;
    if (options.domain) cookie += `; Domain=${options.domain}`;
    if (options.path) cookie += `; Path=${options.path}`;
    if (options.expires) cookie += `; Expires=${options.expires.toUTCString()}`;
    if (options.httpOnly) cookie += "; HttpOnly";
    if (options.secure) cookie += "; Secure";
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  }
  return cookie;
}
