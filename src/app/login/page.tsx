"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LoaderCircle, Eye, EyeOff, Mail } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/brand/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = "/painel";
        return;
      }
      setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "h-11 w-full rounded-xl border bg-surface-2/60 pl-10 pr-3.5 text-sm text-fg placeholder:text-subtle transition-colors focus:outline-none";

  return (
    <main className="relative z-10 grid min-h-dvh place-items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="hairline-top rounded-2xl border border-border bg-surface p-8 card-shadow">
          <div className="flex justify-center">
            <Logo size="lg" showName={false} />
          </div>
          <h1 className="mt-5 text-center text-lg font-semibold tracking-tight text-fg">
            Acesso restrito
          </h1>
          <p className="mt-1 text-center text-sm text-muted">
            Área exclusiva da equipe A3 Sistemas.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            {/* Email */}
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
                placeholder="seu@email.com"
                autoFocus
                autoComplete="username"
                className={cn(
                  inputBase,
                  error ? "border-[var(--danger)]/60" : "border-border focus:border-accent/50",
                )}
              />
            </div>

            {/* Senha */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle">
                <LockGlyph />
              </span>
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Senha"
                autoComplete="current-password"
                className={cn(
                  inputBase,
                  "pr-11",
                  error ? "border-[var(--danger)]/60" : "border-border focus:border-accent/50",
                )}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-subtle hover:text-fg"
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs text-[var(--danger)]"
                role="alert"
              >
                Email ou senha incorretos.
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={!email || !password || loading}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-accent-fg transition-[filter] hover:brightness-110 disabled:pointer-events-none disabled:opacity-50 accent-glow"
            >
              {loading && <LoaderCircle className="size-4 animate-spin" />}
              Entrar
            </motion.button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-subtle">
          Uso autorizado apenas. Tentativas de acesso são registradas.
        </p>
      </motion.div>
    </main>
  );
}

function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
