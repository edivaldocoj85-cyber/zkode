/**
 * Sessão do painel via cookie httpOnly assinado (HMAC-SHA256).
 * Usa Web Crypto — funciona no runtime Edge (middleware da Vercel) e no Node.
 *
 * Env obrigatórias em produção (Vercel → Settings → Environment Variables):
 *   PANEL_PASSWORD — senha compartilhada da equipe
 *   AUTH_SECRET    — string longa aleatória que assina o cookie
 */

export const SESSION_COOKIE = "painel_session";

const SESSION_PAYLOAD = "painel-session-v1";

function secret(): string {
  return process.env.AUTH_SECRET ?? "dev-secret-troque-em-producao";
}

export async function sessionToken(): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(SESSION_PAYLOAD));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidSession(token?: string | null): Promise<boolean> {
  if (!token) return false;
  return token === (await sessionToken());
}
