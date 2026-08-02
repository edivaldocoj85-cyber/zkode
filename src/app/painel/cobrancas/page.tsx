"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui-context";
import { PaymentBadge } from "@/components/clients/StatusBadges";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { PaymentStatus } from "@/lib/types";

type Filter = "todos" | PaymentStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todas" },
  { key: "atrasado", label: "Atrasadas" },
  { key: "pendente", label: "Pendentes" },
  { key: "pago", label: "Pagas" },
];

export default function CobrancasPage() {
  const { clients, togglePayment } = useStore();
  const { openDrawer } = useUI();
  const [filter, setFilter] = useState<Filter>("todos");

  const rows = useMemo(() => {
    return clients
      .flatMap((c) => c.pagamentos.map((p) => ({ client: c, p })))
      .sort((a, b) => a.p.vencimento.localeCompare(b.p.vencimento));
  }, [clients]);

  const totals = useMemo(() => {
    const t = { pago: 0, pendente: 0, atrasado: 0 };
    for (const { p } of rows) t[p.status] += p.valor;
    return t;
  }, [rows]);

  const filtered = rows.filter((r) => filter === "todos" || r.p.status === filter);

  return (
    <div className="space-y-6">
      {/* Totais */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TotalCard label="Recebido" value={totals.pago} tone="success" />
        <TotalCard label="A receber" value={totals.pendente} tone="info" />
        <TotalCard label="Em atraso" value={totals.atrasado} tone="danger" />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.key ? "text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            {filter === f.key && (
              <motion.span
                layoutId="cob-filter"
                className="absolute inset-0 rounded-lg bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface card-shadow">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-subtle">
            Nenhuma cobrança nesse filtro.
          </p>
        ) : (
          <ul>
            {filtered.map(({ client, p }, i) => (
              <motion.li
                key={client.id + p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.35) }}
                className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 sm:px-5"
              >
                <button
                  onClick={() => togglePayment(client.id, p.id)}
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-md border transition-colors",
                    p.status === "pago"
                      ? "border-[var(--success)] bg-[var(--success)]/20 text-[var(--success)]"
                      : "border-border-strong text-transparent hover:border-accent",
                  )}
                  aria-label="Alternar pago"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </button>

                <button
                  onClick={() => openDrawer(client.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="hidden size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-xs font-semibold text-accent sm:grid">
                    {initials(client.nome)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{client.nome}</p>
                    <p className="truncate text-xs text-subtle">{p.descricao}</p>
                  </div>
                </button>

                <span className="hidden text-sm text-muted sm:block">
                  {formatDate(p.vencimento)}
                </span>
                <span className="w-24 text-right font-mono text-sm tnum text-fg">
                  {formatCurrency(p.valor, true)}
                </span>
                <div className="w-24 text-right">
                  <PaymentBadge status={p.status} />
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TotalCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "info" | "danger";
}) {
  const color = {
    success: "text-[var(--success)]",
    info: "text-[var(--info)]",
    danger: "text-[var(--danger)]",
  }[tone];
  return (
    <SpotlightCard interactive={false} className="p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className={cn("mt-2 font-mono text-2xl font-semibold tnum", color)}>
        {formatCurrency(value, true)}
      </p>
    </SpotlightCard>
  );
}
