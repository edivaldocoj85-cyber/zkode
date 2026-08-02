"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { NAV_ITEMS } from "./nav";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { ThemeToggle } from "./ThemeToggle";

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { metrics } = useStore();
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)painel_user=([^;]+)/);
    setUser(m ? decodeURIComponent(m[1]) : "");
  }, []);

  return (
    <>
      {/* Scrim mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed z-50 flex h-dvh w-[268px] flex-col border-r border-border bg-surface",
          "transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-5">
          <Logo size="lg" showName={false} />
          <div className="leading-tight">
            <p className="font-semibold tracking-tight">A3 Sistemas</p>
            <p className="text-xs text-subtle">Painel</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto grid size-8 place-items-center rounded-lg text-muted hover:bg-fg/[0.06] lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === pathname ||
              (item.href !== "/painel" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl border border-accent/30 bg-accent/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "relative size-[18px] transition-colors",
                    active ? "text-accent" : "text-subtle group-hover:text-fg",
                  )}
                  strokeWidth={2}
                />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mini resumo */}
        <div className="mx-4 mt-5 rounded-xl border border-border bg-surface-2/60 p-4">
          <p className="text-xs text-subtle">Pipeline</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="font-mono text-2xl font-semibold tnum text-fg">
                {metrics.leads}
              </p>
              <p className="text-xs text-muted">leads em aberto</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-semibold tnum text-accent">
                {metrics.totalClientes}
              </p>
              <p className="text-xs text-muted">clientes ativos</p>
            </div>
          </div>
        </div>

        {/* Usuário logado */}
        {user && (
          <div className="mx-4 mt-4 flex items-center gap-2.5 rounded-xl border border-border bg-surface-2/50 px-3 py-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent/15 font-mono text-[11px] font-semibold uppercase text-accent">
              {user.slice(0, 2)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-fg">{user}</p>
              <p className="text-[11px] text-subtle">Sessão ativa</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center gap-2 px-4 py-4">
          <ThemeToggle />
          <button
            onClick={async () => {
              await fetch("/api/auth", { method: "DELETE" });
              window.location.href = "/login";
            }}
            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-border text-xs text-muted transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
            title="Sair"
            aria-label="Sair do painel"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
