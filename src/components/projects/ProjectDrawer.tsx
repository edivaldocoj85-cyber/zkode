"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, Plus, Trash2, X, Users2, CalendarClock } from "lucide-react";
import { useUI } from "@/lib/ui-context";
import { useStore } from "@/lib/store";
import { PROJECT_TYPE_LABEL, type Project } from "@/lib/types";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

function progressOf(p: Project) {
  const all = p.fluxo.flatMap((b) => b.itens);
  const done = all.filter((i) => i.done).length;
  return { done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
}

export function ProjectDrawer() {
  const { projectDrawerId, closeProjectDrawer, openEditProject } = useUI();
  const {
    getProject,
    toggleChecklist,
    setProjectStage,
    removeProject,
    addCost,
    removeCost,
  } = useStore();

  const [costLabel, setCostLabel] = useState("");
  const [costValor, setCostValor] = useState("");

  const project = projectDrawerId ? getProject(projectDrawerId) : undefined;
  const open = Boolean(project);

  const totalCustos = project?.custos.reduce((s, c) => s + c.valor, 0) ?? 0;
  const lucro = (project?.valor ?? 0) - totalCustos;
  const currentIdx = project ? project.fluxo.findIndex((s) => s.key === project.stageKey) : -1;

  return (
    <AnimatePresence>
      {open && project && (
        <div className="fixed inset-0 z-[55]">
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectDrawer}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-dvh w-full max-w-[540px] flex-col border-l border-border-strong bg-surface shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* Header */}
            <div className="relative border-b border-border p-6 hairline-top">
              <button
                onClick={closeProjectDrawer}
                className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg text-muted hover:bg-fg/[0.06] hover:text-fg"
                aria-label="Fechar"
              >
                <X className="size-4" />
              </button>
              <div className="flex items-center gap-2">
                <Badge tone={project.tipo === "sistema" ? "accent" : "info"}>
                  {PROJECT_TYPE_LABEL[project.tipo]}
                </Badge>
                <span className="text-xs text-subtle">
                  {project.fluxo[currentIdx]?.label ?? "—"}
                </span>
              </div>
              <h2 className="mt-1.5 pr-8 text-xl font-semibold tracking-tight text-fg">
                {project.nome}
              </h2>
              {project.cliente && (
                <p className="text-sm text-muted">Cliente: {project.cliente}</p>
              )}
              {project.descricao && (
                <p className="mt-2 text-sm leading-relaxed text-muted">{project.descricao}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {project.devs.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-fg"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-accent/15 font-mono text-[10px] font-semibold text-accent">
                      {initials(d)}
                    </span>
                    {d}
                  </span>
                ))}
                {project.devs.length === 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                    <Users2 className="size-3.5" /> sem devs alocados
                  </span>
                )}
              </div>

              {(project.repoUrl || project.entregaPrevista) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-fg transition-colors hover:bg-fg/[0.06]"
                    >
                      <GithubIcon />
                      Ver repositório
                    </a>
                  )}
                  {project.entregaPrevista && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                      <CalendarClock className="size-3.5" />
                      Entrega: {formatDate(project.entregaPrevista)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Corpo */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* Financeiro */}
              <section>
                <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-subtle">
                  Financeiro do projeto
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Valor" value={formatCurrency(project.valor ?? 0)} />
                  <MiniStat label="Custos" value={formatCurrency(totalCustos)} tone="danger" />
                  <MiniStat label="Lucro" value={formatCurrency(lucro)} tone="accent" />
                </div>

                <div className="mt-3 space-y-1.5">
                  {project.custos.map((c) => (
                    <div
                      key={c.id}
                      className="group flex items-center gap-2 rounded-lg border border-border bg-surface-2/50 px-3 py-2"
                    >
                      <span className="flex-1 truncate text-sm text-muted">{c.label}</span>
                      <span className="font-mono text-sm tnum text-fg">
                        {formatCurrency(c.valor)}
                      </span>
                      <button
                        onClick={() => removeCost(project.id, c.id)}
                        className="text-subtle opacity-0 transition-opacity hover:text-[var(--danger)] group-hover:opacity-100"
                        aria-label="Remover custo"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-1">
                    <input
                      value={costLabel}
                      onChange={(e) => setCostLabel(e.target.value)}
                      placeholder="Novo custo (ex.: API, domínio)"
                      className="h-9 flex-1 rounded-lg border border-border bg-surface px-2.5 text-sm text-fg placeholder:text-subtle focus:border-accent/50 focus:outline-none"
                    />
                    <input
                      value={costValor}
                      onChange={(e) => setCostValor(e.target.value)}
                      type="number"
                      placeholder="R$"
                      className="h-9 w-20 rounded-lg border border-border bg-surface px-2.5 text-sm text-fg focus:border-accent/50 focus:outline-none"
                    />
                    <Button
                      size="sm"
                      variant="subtle"
                      disabled={!costLabel.trim() || !costValor}
                      onClick={() => {
                        addCost(project.id, {
                          label: costLabel.trim(),
                          valor: Number(costValor) || 0,
                        });
                        setCostLabel("");
                        setCostValor("");
                      }}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </section>

              {/* Progresso */}
              <ProgressBar project={project} />

              {/* Fluxo / passo a passo */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle">
                  Passo a passo · {PROJECT_TYPE_LABEL[project.tipo]}
                </h3>
                {project.fluxo.map((block, idx) => {
                  const done = block.itens.filter((i) => i.done).length;
                  const isCurrent = block.key === project.stageKey;
                  const passed = idx < currentIdx;
                  return (
                    <div
                      key={block.key}
                      className={cn(
                        "rounded-xl border p-3.5 transition-colors",
                        isCurrent
                          ? "border-accent/40 bg-accent/[0.06]"
                          : "border-border bg-surface-2/40",
                      )}
                    >
                      <button
                        onClick={() => setProjectStage(project.id, block.key)}
                        className="flex w-full items-center gap-2.5 text-left"
                      >
                        <span
                          className={cn(
                            "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                            passed
                              ? "border-[var(--success)] bg-[var(--success)]/20 text-[var(--success)]"
                              : isCurrent
                                ? "border-accent bg-accent text-accent-fg"
                                : "border-border-strong text-subtle",
                          )}
                        >
                          {passed ? <Check className="size-3.5" strokeWidth={3} /> : idx + 1}
                        </span>
                        <span className="flex-1">
                          <span
                            className={cn(
                              "block text-sm font-medium",
                              isCurrent ? "text-accent" : "text-fg",
                            )}
                          >
                            {block.label}
                          </span>
                          {block.hint && (
                            <span className="block text-xs text-subtle">{block.hint}</span>
                          )}
                        </span>
                        <Badge tone={done === block.itens.length ? "success" : "neutral"}>
                          {done}/{block.itens.length}
                        </Badge>
                      </button>

                      <ul className="mt-2.5 space-y-0.5 pl-8">
                        {block.itens.map((it) => (
                          <li key={it.id}>
                            <button
                              onClick={() => toggleChecklist(project.id, block.key, it.id)}
                              className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-fg/[0.04]"
                            >
                              <span
                                className={cn(
                                  "grid size-4 shrink-0 place-items-center rounded border transition-colors",
                                  it.done
                                    ? "border-[var(--success)] bg-[var(--success)]/20 text-[var(--success)]"
                                    : "border-border-strong text-transparent",
                                )}
                              >
                                <Check className="size-2.5" strokeWidth={3.5} />
                              </span>
                              <span
                                className={cn(
                                  "text-sm",
                                  it.done ? "text-subtle line-through" : "text-muted",
                                )}
                              >
                                {it.label}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 border-t border-border p-4">
              <Button
                variant="danger"
                onClick={() => {
                  removeProject(project.id);
                  closeProjectDrawer();
                }}
              >
                <Trash2 className="size-4" />
                Excluir
              </Button>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => openEditProject(project.id)}
              >
                <Pencil className="size-4" />
                Editar
              </Button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "danger" | "accent";
}) {
  const color =
    tone === "danger" ? "text-[var(--danger)]" : tone === "accent" ? "text-accent" : "text-fg";
  return (
    <div className="rounded-xl border border-border bg-surface-2/50 px-3 py-2.5">
      <p className="text-xs text-subtle">{label}</p>
      <p className={cn("mt-0.5 font-mono text-base font-semibold tnum", color)}>{value}</p>
    </div>
  );
}

function ProgressBar({ project }: { project: Project }) {
  const { pct, done, total } = progressOf(project);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted">Progresso geral</span>
        <span className="font-mono tnum text-fg">
          {done}/{total} · {pct}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-fg/[0.08]">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export function GithubIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.2-3.37-1.2-.46-1.17-1.11-1.48-1.11-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}
