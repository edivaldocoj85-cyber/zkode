"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CircleDollarSign,
  Repeat,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui-context";
import { StatCard } from "@/components/ui/StatCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Badge } from "@/components/ui/Badge";
import {
  formatCurrency,
  initials,
  relativeDays,
  daysUntil,
  waLink,
} from "@/lib/format";

export default function DashboardPage() {
  const { clients, metrics } = useStore();
  const { openDrawer } = useUI();

  const brl = (n: number) => formatCurrency(n);

  const atrasados = clients.flatMap((c) =>
    c.pagamentos
      .filter((p) => p.status === "atrasado")
      .map((p) => ({ client: c, p })),
  );

  const infraVencendo = clients
    .flatMap((c) => {
      const rows: { client: typeof c; tipo: string; iso?: string; d: number }[] = [];
      const dom = daysUntil(c.infra.dominioVence);
      const hosp = daysUntil(c.infra.hospedagemVence);
      if (dom !== null && dom <= 30)
        rows.push({ client: c, tipo: "Domínio", iso: c.infra.dominioVence, d: dom });
      if (hosp !== null && hosp <= 30)
        rows.push({ client: c, tipo: "Hospedagem", iso: c.infra.hospedagemVence, d: hosp });
      return rows;
    })
    .sort((a, b) => a.d - b.d);

  const leads = clients.filter((c) => c.status === "lead");

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm text-muted">Bem-vindo de volta</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Sua operação em <span className="text-gradient">um só lugar</span>
        </h2>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Receita recorrente (MRR)"
          value={metrics.mrr}
          format={brl}
          icon={Repeat}
          tone="success"
          hint="manutenção mensal dos ativos"
          index={0}
        />
        <StatCard
          label="Contratado no ano"
          value={metrics.receitaContratadaAno}
          format={brl}
          icon={TrendingUp}
          tone="accent"
          hint="planos + 12× manutenção"
          index={1}
        />
        <StatCard
          label="A receber"
          value={metrics.aReceber}
          format={brl}
          icon={Wallet}
          tone="info"
          hint="cobranças pendentes"
          index={2}
        />
        <StatCard
          label="Em atraso"
          value={metrics.atrasado}
          format={brl}
          icon={CircleDollarSign}
          tone="danger"
          hint="cobrar o quanto antes"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Precisa de atenção */}
        <SpotlightCard interactive={false} className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-[var(--danger)]/12 text-[var(--danger)]">
              <AlertTriangle className="size-4" />
            </span>
            <h3 className="font-semibold text-fg">Precisa de atenção</h3>
          </div>

          {atrasados.length === 0 && infraVencendo.length === 0 ? (
            <p className="py-8 text-center text-sm text-subtle">
              Tudo em dia. Nenhuma pendência crítica.
            </p>
          ) : (
            <div className="space-y-2">
              {atrasados.map(({ client, p }) => (
                <button
                  key={client.id + p.id}
                  onClick={() => openDrawer(client.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/[0.06] px-3 py-2.5 text-left transition-colors hover:bg-[var(--danger)]/[0.1]"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-surface font-mono text-xs font-semibold text-[var(--danger)]">
                    {initials(client.nome)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{client.nome}</p>
                    <p className="truncate text-xs text-muted">{p.descricao}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm tnum text-[var(--danger)]">
                      {formatCurrency(p.valor, true)}
                    </p>
                    <Badge tone="danger">{relativeDays(p.vencimento)}</Badge>
                  </div>
                </button>
              ))}

              {infraVencendo.map(({ client, tipo, iso, d }) => (
                <button
                  key={client.id + tipo}
                  onClick={() => openDrawer(client.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[var(--warning)]/20 bg-[var(--warning)]/[0.06] px-3 py-2.5 text-left transition-colors hover:bg-[var(--warning)]/[0.1]"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-surface text-[var(--warning)]">
                    <CalendarClock className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{client.nome}</p>
                    <p className="truncate text-xs text-muted">
                      {tipo} vence {relativeDays(iso)}
                    </p>
                  </div>
                  <Badge tone={d < 0 ? "danger" : "warning"}>
                    {d < 0 ? "vencido" : `${d}d`}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </SpotlightCard>

        {/* Pipeline / Leads */}
        <SpotlightCard interactive={false} className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--info)]/12 text-[var(--info)]">
                <TrendingUp className="size-4" />
              </span>
              <h3 className="font-semibold text-fg">Pipeline de leads</h3>
            </div>
            <Link
              href="/painel/clientes"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:brightness-110"
            >
              Ver todos
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {leads.length === 0 ? (
            <p className="py-8 text-center text-sm text-subtle">
              Sem leads em aberto. Hora de prospectar!
            </p>
          ) : (
            <div className="space-y-2">
              {leads.slice(0, 5).map((client) => {
                const wa = waLink(client.whatsapp);
                return (
                  <div
                    key={client.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/50 px-3 py-2.5"
                  >
                    <button
                      onClick={() => openDrawer(client.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span className="grid size-9 place-items-center rounded-lg bg-surface font-mono text-xs font-semibold text-accent">
                        {initials(client.nome)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-fg">{client.nome}</p>
                        <p className="truncate text-xs text-subtle">
                          {client.segmento} · {client.regiao}
                        </p>
                      </div>
                    </button>
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/10 px-2.5 py-1.5 text-xs font-medium text-[var(--success)] transition-colors hover:bg-[var(--success)]/20"
                      >
                        Chamar
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
}
