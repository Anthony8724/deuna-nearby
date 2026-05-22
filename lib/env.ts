/**
 * Variables de entorno — Next.js / Node (lee `.env` vía process.env).
 * En React Native usar `lib/env.native.ts` con @env / expo-constants.
 */

export type SupabaseEnv = {
  url: string | undefined;
  anonKey: string | undefined;
};

export function getSupabaseEnv(): SupabaseEnv {
  return {
    url: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey:
      process.env.SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function isSupabaseEnvConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url?.trim() && anonKey?.trim());
}
