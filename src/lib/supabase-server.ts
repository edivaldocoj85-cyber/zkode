import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase SÓ do servidor, usando a SECRET key.
 * A secret key nunca vai para o navegador — fica só em env (`.env.local` / Vercel).
 * Como usa a secret, ignora RLS: por isso todo acesso passa por rotas protegidas
 * pelo login (cookie de sessão).
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  cached = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
