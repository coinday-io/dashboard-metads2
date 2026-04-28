import { createServerClient } from '@supabase/ssr';
import { createClient as createSbClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
// Service role is only "configured" alongside the anon key so admin auth checks
// (which require getServerSupabase()) can still gate writes when the role key is set.
export const isServiceRoleConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && SUPABASE_ANON_KEY);

export async function getServerSupabase() {
  if (!isSupabaseConfigured) return null;
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Components cannot set cookies; ignored.
        }
      },
    },
  });
}

let serviceClient: SupabaseClient | null = null;
export function getServiceSupabase(): SupabaseClient | null {
  if (!isServiceRoleConfigured) return null;
  if (!serviceClient) {
    serviceClient = createSbClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return serviceClient;
}
