import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-server";

async function authed(): Promise<boolean> {
  const store = await cookies();
  return isValidSession(store.get(SESSION_COOKIE)?.value);
}

/** Carrega todos os clientes e projetos. */
export async function GET() {
  if (!(await authed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    // Sem Supabase → o app usa localStorage (modo local).
    return NextResponse.json({ configured: false });
  }
  const sb = supabaseAdmin();
  const [c, p] = await Promise.all([
    sb.from("clients").select("data"),
    sb.from("projects").select("data"),
  ]);
  if (c.error || p.error) {
    return NextResponse.json(
      { configured: true, error: (c.error ?? p.error)?.message },
      { status: 500 },
    );
  }
  return NextResponse.json({
    configured: true,
    clients: (c.data ?? []).map((r) => r.data),
    projects: (p.data ?? []).map((r) => r.data),
  });
}

/** Sincroniza mudanças: { table, upserts: [...records], deletes: [...ids] } */
export async function POST(req: Request) {
  if (!(await authed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  }

  let body: {
    table?: string;
    upserts?: Array<{ id: string }>;
    deletes?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const table = body.table === "projects" ? "projects" : "clients";
  const sb = supabaseAdmin();

  if (Array.isArray(body.upserts) && body.upserts.length) {
    const rows = body.upserts.map((rec) => ({ id: rec.id, data: rec }));
    const { error } = await sb.from(table).upsert(rows);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (Array.isArray(body.deletes) && body.deletes.length) {
    const { error } = await sb.from(table).delete().in("id", body.deletes);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
