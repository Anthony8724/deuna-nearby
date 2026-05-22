/**
 * Variables de entorno para React Native.
 * Requiere react-native-dotenv (babel) o extra en app.config / expo-constants.
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

export type SupabaseEnv = {
  url: string | undefined;
  anonKey: string | undefined;
};

export function getSupabaseEnv(): SupabaseEnv {
  let url = SUPABASE_URL;
  let anonKey = SUPABASE_ANON_KEY;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Constants = require("expo-constants").default as {
      expoConfig?: { extra?: Record<string, string> };
    };
    const extra = Constants.expoConfig?.extra;
    url = url ?? extra?.SUPABASE_URL ?? extra?.supabaseUrl;
    anonKey = anonKey ?? extra?.SUPABASE_ANON_KEY ?? extra?.supabaseAnonKey;
  } catch {
    /* expo-constants no instalado — solo @env */
  }

  return { url, anonKey };
}

export function isSupabaseEnvConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url?.trim() && anonKey?.trim());
}
