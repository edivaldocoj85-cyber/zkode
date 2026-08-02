"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Client } from "@/lib/types";
import { useUI } from "@/lib/ui-context";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import { PlanBadge, StatusBadge } from "./StatusBadges";

function nextDue(client: Client) {
  const open = client.pagamentos
    .filter((p) => p.status !== "pago")
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  return open[0];
}

export function ClientList({ clients }: { clients: Client[] }) {
  const { openDrawer } = useUI();

  if (clients.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted">Nenhum cliente encontrado.</p>
        <p className="mt-1 text-xs text-subtle">
          Ajuste os filtros ou cadastre um novo cliente.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface card-shadow">
      {/* Cabeçalho (desktop) */}
      <div className="hidden grid-cols-[1.6fr_1fr_0.9fr_1fr] gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-subtle lg:grid">
        <span>Cliente</span>
        <span>Região</span>
        <span>Plano</span>
        <span className="text-right">Próx. vencimento</span>
      </div>

      <ul>
        {clients.map((client, i) => {
          const due = nextDue(client);
          return (
            <motion.li
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.035, 0.4) }}
            >
              <button
                onClick={() => openDrawer(client.id)}
                className="group grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-4 border-b border-border px-5 py-3.5 text-left transition-colors last:border-0 hover:bg-fg/[0.03] lg:grid-cols-[1.6fr_1fr_0.9fr_1fr]"
              >
                {/* Cliente */}
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 font-mono text-sm font-semibold text-accent">
                    {initials(client.nome)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-fg">{client.nome}</p>
                    <p className="truncate text-xs text-subtle">{client.segmento}</p>
                    <div className="mt-1 lg:hidden">
                      <StatusBadge status={client.status} />
                    </div>
                  </div>
                </div>

                {/* Região */}
                <span className="hidden truncate text-sm text-muted lg:block">
                  {client.regiao}
                </span>

                {/* Plano + status */}
                <div className="hidden items-center gap-2 lg:flex">
                  <PlanBadge plano={client.plano} />
                </div>

                {/* Próx vencimento */}
                <div className="flex items-center justify-end gap-3">
                  <div className="text-right">
                    {due ? (
                      <>
                        <p className="font-mono text-sm tnum text-fg">
                          {formatCurrency(due.valor, true)}
                        </p>
                        <p className="text-xs text-subtle">{formatDate(due.vencimento)}</p>
                      </>
                    ) : (
                      <span className="hidden text-xs text-subtle lg:inline">
                        {client.status === "lead" ? "prospect" : "em dia"}
                      </span>
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <StatusBadge status={client.status} />
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
