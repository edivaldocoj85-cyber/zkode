import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionToken } from "@/lib/auth";

interface Admin {
  email: string;
  password: string;
}

/**
 * Contas de admin. Em produção, defina `AUTH_USERS` na Vercel como JSON:
 *   [{"email":"...","password":"..."}, ...]
 * Sem a env, usa estas 2 contas fake de desenvolvimento (troque antes de publicar).
 */
function getAdmins(): Admin[] {
  const raw = process.env.AUTH_USERS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* JSON inválido → cai no fallback */
    }
  }
  return [
    { email: "davi@a3sistemas.com.br", password: "a3davi2026" },
    { email: "junior@a3sistemas.com.br", password: "a3junior2026" },
    { email: "wendel@a3sistemas.com.br", password: "a3wendel2026" },
  ];
}

export async function POST(req: Request) {
  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    /* corpo inválido → falha abaixo */
  }

  const match = getAdmins().find(
    (a) => a.email.trim().toLowerCase() === email && a.password === password,
  );

  if (!email || !password || !match) {
    await new Promise((r) => setTimeout(r, 700)); // desacelera brute force
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const opts = {
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  };
  res.cookies.set(SESSION_COOKIE, await sessionToken(), { ...opts, httpOnly: true });
  // cookie legível só para exibir "logado como" na UI
  res.cookies.set("painel_user", match.email, { ...opts, httpOnly: false });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set("painel_user", "", { path: "/", maxAge: 0 });
  return res;
}
