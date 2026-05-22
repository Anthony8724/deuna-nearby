import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv, isSupabaseEnvConfigured } from "./env";

export class SupabaseConfigError extends Error {
  constructor(
    message = "Faltan SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en el entorno.",
  ) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

let browserClient: SupabaseClient | null = null;

/**
 * Cliente Supabase (anon) — usable en React Native y en el navegador.
 * En servidor preferir `createSupabaseServerClient()`.
 */
export function createSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseEnv();
  if (!url?.trim() || !anonKey?.trim()) {
    throw new SupabaseConfigError();
  }

  return createClient(url.trim(), anonKey.trim(), {
    auth: {
      persistSession: typeof window !== "undefined",
      autoRefreshToken: true,
    },
  });
}

/** Singleton para apps cliente (RN / web). */
export function getSupabaseClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createSupabaseClient();
  }
  return browserClient;
}

/** Cliente para Route Handlers / server (sin singleton global compartido con el browser). */
export function createSupabaseServerClient(): SupabaseClient {
  return createSupabaseClient();
}

export { isSupabaseEnvConfigured };
