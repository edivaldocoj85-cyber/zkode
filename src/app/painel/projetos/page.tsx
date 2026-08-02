"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui-context";
import { PROJECT_TYPE_LABEL, type Project, type ProjectType } from "@/lib/types";
import { formatCurrency, initials } from "@/lib/format";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Badge } from "@/components/ui/Badge";
import { GithubIcon } from "@/components/projects/ProjectDrawer";
import { cn } from "@/lib/cn";

type Filter = "todos" | ProjectType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "site", label: "Sites" },
  { key: "sistema", label: "Sistemas" },
];

function stats(p: Project) {
  const all = p.fluxo.flatMap((b) => b.itens);
  const done = all.filter((i) => i.done).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  const custos = p.custos.reduce((s, c) => s + c.valor, 0);
  const lucro = (p.valor ?? 0) - custos;
  const currentIdx = p.fluxo.findIndex((s) => s.key === p.stageKey);
  return { pct, custos, lucro, currentIdx };
}

export default function ProjetosPage() {
  const { projects } = useStore();
  const { openProjectDrawer, openNewProject } = useUI();
  const [filter, setFilter] = useState<Filter>("todos");

  const filtered = useMemo(
    () => (filter === "todos" ? projects : projects.filter((p) => p.tipo === filter)),
    [projects, filter],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
                    layoutId="proj-filter"
                    className="absolute inset-0 rounded-lg bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={openNewProject}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-fg"
        >
          <Plus className="size-4" /> Novo projeto
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted">Nenhum projeto aqui ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((p, i) => {
            const { pct, lucro, currentIdx } = stats(p);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
              >
                <SpotlightCard className="p-5">
                  <button onClick={() => openProjectDrawer(p.id)} className="w-full text-left">
                    {/* Topo */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge tone={p.tipo === "sistema" ? "accent" : "info"}>
                            {PROJECT_TYPE_LABEL[p.tipo]}
                          </Badge>
                          <span className="font-mono text-xs tnum text-muted">{pct}%</span>
                        </div>
                        <h3 className="mt-1.5 truncate text-lg font-semibold tracking-tight text-fg">
                          {p.nome}
                        </h3>
                        {p.cliente && (
                          <p className="truncate text-sm text-subtle">{p.cliente}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-mono text-sm tnum text-fg">
                            {formatCurrency(p.valor ?? 0)}
                          </p>
                          <p className="text-xs text-subtle">
                            lucro{" "}
                            <span className="text-accent">{formatCurrency(lucro)}</span>
                          </p>
                        </div>
                        <div className="flex -space-x-1.5">
                          {p.devs.slice(0, 3).map((d) => (
                            <span
                              key={d}
                              title={d}
                              className="grid size-7 place-items-center rounded-full border border-surface bg-accent/15 font-mono text-[10px] font-semibold text-accent"
                            >
                              {initials(d)}
                            </span>
                          ))}
                        </div>
                        {p.repoUrl && (
                          <a
                            href={p.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-subtle transition-colors hover:text-fg"
                            title="Abrir repositório"
                          >
                            <GithubIcon className="size-5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="mt-5 overflow-x-auto pb-1">
                      <div className="flex min-w-max items-center">
                        {p.fluxo.map((stage, idx) => {
                          const passed = idx < currentIdx;
                          const current = idx === currentIdx;
                          const doneCount = stage.itens.filter((it) => it.done).length;
                          return (
                            <div key={stage.key} className="flex items-center">
                              <div className="flex flex-col items-center gap-1.5 px-1">
                                <span
                                  className={cn(
                                    "grid size-7 place-items-center rounded-full border text-xs font-semibold transition-colors",
                                    passed
                                      ? "border-[var(--success)] bg-[var(--success)]/20 text-[var(--success)]"
                                      : current
                                        ? "border-accent bg-accent text-accent-fg"
                                        : "border-border-strong text-subtle",
                                  )}
                                >
                                  {passed ? (
                                    <Check className="size-3.5" strokeWidth={3} />
                                  ) : (
                                    idx + 1
                                  )}
                                </span>
                                <span
                                  className={cn(
                                    "max-w-[92px] text-center text-[11px] leading-tight",
                                    current
                                      ? "font-medium text-accent"
                                      : passed
                                        ? "text-muted"
                                        : "text-subtle",
                                  )}
                                >
                                  {stage.label}
                                </span>
                                <span className="text-[10px] tabular-nums text-subtle">
                                  {doneCount}/{stage.itens.length}
                                </span>
                              </div>
                              {idx < p.fluxo.length - 1 && (
                                <span
                                  className={cn(
                                    "h-px w-8 shrink-0 sm:w-12",
                                    idx < currentIdx ? "bg-[var(--success)]/40" : "bg-border-strong",
                                  )}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </button>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
