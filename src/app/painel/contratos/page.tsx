"use client";

import { motion } from "framer-motion";
import { FileSignature } from "lucide-react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui-context";
import { PlanBadge } from "@/components/clients/StatusBadges";
import { formatCurrency, initials } from "@/lib/format";
import { CONTRACT_LABEL, type ContractStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const COLUMNS: { key: ContractStatus; accent: string }[] = [
  { key: "nenhum", accent: "bg-fg/20" },
  { key: "rascunho", accent: "bg-[var(--muted)]" },
  { key: "enviado", accent: "bg-[var(--info)]" },
  { key: "pendente_anexo", accent: "bg-[var(--warning)]" },
  { key: "assinado", accent: "bg-[var(--success)]" },
];

export default function ContratosPage() {
  const { clients } = useStore();
  const { openDrawer, openContract } = useUI();

  return (
    <div className="-mx-1 overflow-x-auto pb-2">
      <div className="grid min-w-[1040px] grid-cols-5 gap-4 px-1">
        {COLUMNS.map((col) => {
          const items = clients.filter((c) => c.contrato === col.key);
          const total = items.reduce((s, c) => s + (c.valorPlano ?? 0), 0);
          return (
            <div key={col.key} className="flex flex-col">
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className={cn("size-2 rounded-full", col.accent)} />
                <h3 className="text-sm font-semibold text-fg">
                  {CONTRACT_LABEL[col.key]}
                </h3>
                <span className="rounded-full bg-fg/[0.06] px-1.5 text-xs tabular-nums text-subtle">
                  {items.length}
                </span>
                {total > 0 && (
                  <span className="ml-auto font-mono text-xs tnum text-muted">
                    {formatCurrency(total)}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-border bg-surface-2/40 p-2">
                {items.length === 0 ? (
                  <p className="py-8 text-center text-xs text-subtle">Vazio</p>
                ) : (
                  items.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                      whileHover={{ y: -2 }}
                      className="rounded-xl border border-border bg-surface p-3 transition-colors hover:border-border-strong"
                    >
                      <button
                        onClick={() => openDrawer(c.id)}
                        className="flex w-full items-center gap-2.5 text-left"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-xs font-semibold text-accent">
                          {initials(c.nome)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-fg">{c.nome}</p>
                          <p className="truncate text-xs text-subtle">{c.segmento}</p>
                        </div>
                      </button>
                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <PlanBadge plano={c.plano} />
                        <button
                          onClick={() => openContract(c.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-fg/[0.05] hover:text-fg"
                          title="Gerar / ver contrato"
                        >
                          <FileSignature className="size-3.5" />
                          Contrato
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
