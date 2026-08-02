"use client";

import { motion } from "framer-motion";
import { Globe, Server } from "lucide-react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui-context";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Badge } from "@/components/ui/Badge";
import { daysUntil, formatCurrency, formatDate, initials, relativeDays } from "@/lib/format";
import { cn } from "@/lib/cn";

function urgency(iso?: string) {
  const d = daysUntil(iso);
  if (d === null) return { tone: "neutral" as const, label: "—", d: Infinity };
  if (d < 0) return { tone: "danger" as const, label: "vencido", d };
  if (d <= 30) return { tone: "warning" as const, label: `${d}d`, d };
  return { tone: "success" as const, label: relativeDays(iso), d };
}

export default function InfraPage() {
  const { clients, metrics, updateClient } = useStore();
  const { openDrawer } = useUI();

  const withInfra = clients
    .filter((c) => c.infra.dominio || c.infra.hospedagem)
    .map((c) => {
      const dom = urgency(c.infra.dominioVence);
      const hosp = urgency(c.infra.hospedagemVence);
      return { c, dom, hosp, minD: Math.min(dom.d, hosp.d) };
    })
    .sort((a, b) => a.minD - b.minD);

  return (
    <div className="space-y-4">
      {/* Resumo de custo/lucro */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Custo de infra / ano"
          value={formatCurrency(metrics.custoInfraAno)}
          hint="domínios + hospedagem que você paga"
          tone="danger"
        />
        <SummaryCard
          label="Receita contratada / ano"
          value={formatCurrency(metrics.receitaContratadaAno)}
          hint="planos + manutenção"
          tone="muted"
        />
        <SummaryCard
          label="Lucro estimado / ano"
          value={formatCurrency(metrics.lucroAno)}
          hint="receita − custo de infra"
          tone="accent"
        />
      </div>

      {withInfra.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted">Nenhuma infraestrutura cadastrada ainda.</p>
          <p className="mt-1 text-xs text-subtle">
            Adicione domínio e hospedagem ao editar um cliente.
          </p>
        </div>
      ) : (
        withInfra.map(({ c, dom, hosp }, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
          >
            <SpotlightCard className="p-4 sm:p-5">
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                {/* Cliente */}
                <button
                  onClick={() => openDrawer(c.id)}
                  className="flex min-w-0 items-center gap-3 text-left sm:w-52 sm:shrink-0"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 font-mono text-sm font-semibold text-accent">
                    {initials(c.nome)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-fg">{c.nome}</p>
                    <p className="truncate text-xs text-subtle">{c.segmento}</p>
                  </div>
                </button>

                {/* Domínio */}
                <InfraCell
                  icon={<Globe className="size-4" />}
                  primary={c.infra.dominio}
                  secondary={c.infra.registrador}
                  dueLabel={formatDate(c.infra.dominioVence)}
                  cost={c.infra.dominioCusto}
                  onCost={(v) =>
                    updateClient(c.id, { infra: { ...c.infra, dominioCusto: v } })
                  }
                  badge={dom}
                />

                {/* Hospedagem */}
                <InfraCell
                  icon={<Server className="size-4" />}
                  primary={c.infra.hospedagem}
                  secondary="Hospedagem"
                  dueLabel={formatDate(c.infra.hospedagemVence)}
                  cost={c.infra.hospedagemCusto}
                  onCost={(v) =>
                    updateClient(c.id, { infra: { ...c.infra, hospedagemCusto: v } })
                  }
                  badge={hosp}
                />
              </div>
            </SpotlightCard>
          </motion.div>
        ))
      )}
    </div>
  );
}

function InfraCell({
  icon,
  primary,
  secondary,
  dueLabel,
  cost,
  onCost,
  badge,
}: {
  icon: React.ReactNode;
  primary?: string;
  secondary?: string;
  dueLabel: string;
  cost?: number;
  onCost?: (value: number) => void;
  badge: { tone: "neutral" | "danger" | "warning" | "success"; label: string };
}) {
  if (!primary) {
    return (
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-dashed border-border px-3 py-2.5 text-subtle">
        <span className="grid size-8 place-items-center rounded-lg bg-fg/[0.04]">{icon}</span>
        <span className="text-sm">—</span>
      </div>
    );
  }
  const sub = [secondary, `vence ${dueLabel}`].filter(Boolean).join(" · ");
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-3 rounded-xl border px-3 py-2.5",
        badge.tone === "danger"
          ? "border-[var(--danger)]/25 bg-[var(--danger)]/[0.05]"
          : badge.tone === "warning"
            ? "border-[var(--warning)]/25 bg-[var(--warning)]/[0.05]"
            : "border-border bg-surface-2/50",
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-fg/[0.06] text-muted">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-fg">{primary}</p>
        <p className="truncate text-xs text-subtle">{sub}</p>
      </div>
      {/* Custo editável */}
      <label className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1">
        <span className="text-[11px] text-subtle">R$</span>
        <input
          type="number"
          inputMode="numeric"
          defaultValue={cost ?? ""}
          onBlur={(e) => onCost?.(Number(e.target.value) || 0)}
          placeholder="0"
          className="w-12 bg-transparent text-right font-mono text-xs tnum text-fg focus:outline-none"
          title="Custo anual"
        />
        <span className="text-[10px] text-subtle">/ano</span>
      </label>
      <Badge tone={badge.tone}>{badge.label}</Badge>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "danger" | "accent" | "muted";
}) {
  const color =
    tone === "danger" ? "text-[var(--danger)]" : tone === "accent" ? "text-accent" : "text-fg";
  return (
    <SpotlightCard interactive={false} className="p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className={cn("mt-2 font-mono text-2xl font-semibold tnum", color)}>{value}</p>
      <p className="mt-1 text-xs text-subtle">{hint}</p>
    </SpotlightCard>
  );
}
