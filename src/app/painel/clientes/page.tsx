"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { ClientList } from "@/components/clients/ClientList";
import { cn } from "@/lib/cn";
import type { ClientStatus } from "@/lib/types";

type Filter = "todos" | ClientStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "ativo", label: "Ativos" },
  { key: "pendente", label: "Pendentes" },
  { key: "inadimplente", label: "Inadimplentes" },
  { key: "lead", label: "Leads" },
];

export default function ClientesPage() {
  const { clients } = useStore();
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: clients.length };
    for (const cl of clients) c[cl.status] = (c[cl.status] ?? 0) + 1;
    return c;
  }, [clients]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (filter !== "todos" && c.status !== filter) return false;
      if (!q) return true;
      return (
        c.nome.toLowerCase().includes(q) ||
        c.segmento.toLowerCase().includes(q) ||
        c.regiao.toLowerCase().includes(q)
      );
    });
  }, [clients, filter, query]);

  return (
    <div className="space-y-5">
      {/* Busca */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, segmento ou região…"
          className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-fg placeholder:text-subtle focus:border-accent/50 focus:outline-none"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                active ? "text-accent-fg" : "text-muted hover:text-fg",
              )}
            >
              {active && (
                <motion.span
                  layoutId="filter-active"
                  className="absolute inset-0 rounded-lg bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs tabular-nums",
                    active ? "bg-black/15 text-accent-fg" : "bg-fg/[0.06] text-subtle",
                  )}
                >
                  {counts[f.key] ?? 0}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <ClientList clients={filtered} />
    </div>
  );
}
