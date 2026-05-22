/**
 * Cliente Supabase para React Native.
 * import { getSupabaseClient } from '@/lib/supabaseClient.native';
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv, isSupabaseEnvConfigured } from "./env.native";

export class SupabaseConfigError extends Error {
  constructor(message = "Faltan SUPABASE_URL o SUPABASE_ANON_KEY en @env.") {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

let client: SupabaseClient | null = null;

export function createSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseEnv();
  if (!url?.trim() || !anonKey?.trim()) {
    throw new SupabaseConfigError();
  }
  return createClient(url.trim(), anonKey.trim(), {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

export function getSupabaseClient(): SupabaseClient {
  if (!client) client = createSupabaseClient();
  return client;
}

export { isSupabaseEnvConfigured };
