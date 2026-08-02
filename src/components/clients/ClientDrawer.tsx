"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  FileSignature,
  Globe,
  Link2,
  Mail,
  Pencil,
  Plus,
  Server,
  Trash2,
  X,
} from "lucide-react";
import { useUI } from "@/lib/ui-context";
import { useStore } from "@/lib/store";
import {
  formatCurrency,
  formatDate,
  igLink,
  initials,
  relativeDays,
  daysUntil,
  waLink,
} from "@/lib/format";
import {
  ContractBadge,
  PaymentBadge,
  PlanBadge,
  StatusBadge,
} from "./StatusBadges";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function ClientDrawer() {
  const { drawerId, closeDrawer, openEditClient, openContract } = useUI();
  const { getClient, togglePayment, addPayment, removePayment, removeClient } =
    useStore();
  const [adding, setAdding] = useState(false);
  const [desc, setDesc] = useState("Manutenção mensal");
  const [valor, setValor] = useState("50");
  const [venc, setVenc] = useState("");

  const client = drawerId ? getClient(drawerId) : undefined;
  const open = Boolean(client);

  function confirmAdd() {
    if (!client) return;
    addPayment(client.id, {
      descricao: desc.trim() || "Cobrança",
      valor: Number(valor) || 0,
      vencimento: venc || new Date().toISOString().slice(0, 10),
      status: (daysUntil(venc) ?? 0) < 0 ? "atrasado" : "pendente",
    });
    setAdding(false);
    setDesc("Manutenção mensal");
    setValor("50");
    setVenc("");
  }

  return (
    <AnimatePresence>
      {open && client && (
        <div className="fixed inset-0 z-[55]">
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-dvh w-full max-w-[460px] flex-col border-l border-border-strong bg-surface shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* Header */}
            <div className="relative border-b border-border p-6 hairline-top">
              <button
                onClick={closeDrawer}
                className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg text-muted hover:bg-fg/[0.06] hover:text-fg"
                aria-label="Fechar"
              >
                <X className="size-4" />
              </button>
              <div className="flex items-start gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-border bg-surface-2 font-mono text-lg font-semibold text-accent">
                  {initials(client.nome)}
                </div>
                <div className="min-w-0 pr-8">
                  <h2 className="truncate text-xl font-semibold tracking-tight text-fg">
                    {client.nome}
                  </h2>
                  <p className="truncate text-sm text-muted">
                    {client.segmento} · {client.regiao}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge status={client.status} />
                    <PlanBadge plano={client.plano} />
                  </div>
                </div>
              </div>

              {/* Ações de contato */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <ContactAction
                  href={waLink(client.whatsapp)}
                  label="WhatsApp"
                  icon={<WhatsAppIcon />}
                  accent
                />
                <ContactAction
                  href={igLink(client.instagram)}
                  label="Instagram"
                  icon={<InstagramIcon />}
                />
                <ContactAction
                  href={client.email ? `mailto:${client.email}` : undefined}
                  label="E-mail"
                  icon={<Mail className="size-4" />}
                />
              </div>
            </div>

            {/* Corpo */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* Financeiro resumo */}
              {(() => {
                const custoInfra =
                  (client.infra.dominioCusto || 0) + (client.infra.hospedagemCusto || 0);
                const receitaAno =
                  (client.valorPlano || 0) + (client.manutencao || 0) * 12;
                return (
                  <div className="grid grid-cols-2 gap-3">
                    <MiniStat
                      label="Plano"
                      value={client.valorPlano ? formatCurrency(client.valorPlano) : "—"}
                    />
                    <MiniStat
                      label="Manutenção/mês"
                      value={client.manutencao ? formatCurrency(client.manutencao) : "—"}
                    />
                    <MiniStat
                      label="Custo infra/ano"
                      value={custoInfra ? formatCurrency(custoInfra) : "—"}
                    />
                    <MiniStat
                      label="Margem/ano"
                      value={receitaAno ? formatCurrency(receitaAno - custoInfra) : "—"}
                      accent
                    />
                  </div>
                );
              })()}

              <Section
                title="Contrato"
                action={
                  <button
                    onClick={() => openContract(client.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:brightness-110"
                  >
                    <FileSignature className="size-3.5" />
                    Gerar / ver
                  </button>
                }
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-surface-2/50 px-4 py-3">
                    <ContractBadge contrato={client.contrato} />
                    <span className="text-sm text-muted">
                      Início: {formatDate(client.inicio)}
                    </span>
                  </div>
                  {client.contrato === "pendente_anexo" && (
                    <p className="rounded-lg border border-[var(--warning)]/25 bg-[var(--warning)]/[0.07] px-3 py-2 text-xs text-[var(--warning)]">
                      Assinado no gov.br — falta anexar o PDF. Abra "Gerar / ver".
                    </p>
                  )}
                  {client.contratoAnexoUrl && (
                    <a
                      href={client.contratoAnexoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-1 text-xs font-medium text-accent hover:brightness-110"
                    >
                      <Link2 className="size-3.5" />
                      Ver contrato assinado
                      {client.contratoAssinadoEm
                        ? ` · ${formatDate(client.contratoAssinadoEm)}`
                        : ""}
                    </a>
                  )}
                </div>
              </Section>

              <Section title="Infraestrutura">
                <div className="space-y-2">
                  <InfraRow
                    icon={<Globe className="size-4" />}
                    label="Domínio"
                    value={client.infra.dominio}
                    sub={client.infra.registrador}
                    dueIso={client.infra.dominioVence}
                    cost={client.infra.dominioCusto}
                  />
                  <InfraRow
                    icon={<Server className="size-4" />}
                    label="Hospedagem"
                    value={client.infra.hospedagem}
                    dueIso={client.infra.hospedagemVence}
                    cost={client.infra.hospedagemCusto}
                  />
                </div>
              </Section>

              <Section
                title="Pagamentos"
                action={
                  <button
                    onClick={() => setAdding((v) => !v)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:brightness-110"
                  >
                    <Plus className="size-3.5" />
                    Adicionar
                  </button>
                }
              >
                <AnimatePresence initial={false}>
                  {adding && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface-2/50 p-3">
                        <input
                          value={desc}
                          onChange={(e) => setDesc(e.target.value)}
                          placeholder="Descrição"
                          className="col-span-2 h-9 rounded-lg border border-border bg-surface px-2.5 text-sm text-fg placeholder:text-subtle focus:outline-none focus:border-accent/50"
                        />
                        <input
                          value={valor}
                          onChange={(e) => setValor(e.target.value)}
                          type="number"
                          placeholder="Valor"
                          className="h-9 rounded-lg border border-border bg-surface px-2.5 text-sm text-fg focus:outline-none focus:border-accent/50"
                        />
                        <input
                          value={venc}
                          onChange={(e) => setVenc(e.target.value)}
                          type="date"
                          className="h-9 rounded-lg border border-border bg-surface px-2.5 text-sm text-fg focus:outline-none focus:border-accent/50"
                        />
                        <div className="col-span-2 flex justify-end">
                          <Button size="sm" onClick={confirmAdd}>
                            Salvar cobrança
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {client.pagamentos.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-subtle">
                    Nenhuma cobrança registrada.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {client.pagamentos.map((p) => (
                      <li
                        key={p.id}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-surface-2/50 px-3 py-2.5"
                      >
                        <button
                          onClick={() => togglePayment(client.id, p.id)}
                          className={cn(
                            "grid size-6 shrink-0 place-items-center rounded-md border transition-colors",
                            p.status === "pago"
                              ? "border-[var(--success)] bg-[var(--success)]/20 text-[var(--success)]"
                              : "border-border-strong text-transparent hover:border-accent",
                          )}
                          aria-label={p.status === "pago" ? "Marcar como não pago" : "Marcar como pago"}
                        >
                          <Check className="size-3.5" strokeWidth={3} />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-fg">{p.descricao}</p>
                          <p className="text-xs text-subtle">
                            Vence {formatDate(p.vencimento)}
                          </p>
                        </div>
                        <span className="font-mono text-sm tnum text-fg">
                          {formatCurrency(p.valor, true)}
                        </span>
                        <PaymentBadge status={p.status} />
                        <button
                          onClick={() => removePayment(client.id, p.id)}
                          className="text-subtle opacity-0 transition-opacity hover:text-[var(--danger)] group-hover:opacity-100"
                          aria-label="Remover cobrança"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              {client.observacoes && (
                <Section title="Observações">
                  <p className="rounded-xl border border-border bg-surface-2/50 p-4 text-sm leading-relaxed text-muted">
                    {client.observacoes}
                  </p>
                </Section>
              )}
            </div>

            {/* Footer ações */}
            <div className="flex items-center gap-2 border-t border-border p-4">
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  removeClient(client.id);
                  closeDrawer();
                }}
              >
                <Trash2 className="size-4" />
                Excluir
              </Button>
              <Button
                variant="outline"
                size="md"
                className="ml-auto"
                onClick={() => openEditClient(client.id)}
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

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/50 px-4 py-3">
      <p className="text-xs text-subtle">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-mono text-lg font-semibold tnum",
          accent ? "text-accent" : "text-fg",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function InfraRow({
  icon,
  label,
  value,
  sub,
  dueIso,
  cost,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  sub?: string;
  dueIso?: string;
  cost?: number;
}) {
  const d = daysUntil(dueIso);
  const soon = d !== null && d <= 30;
  const late = d !== null && d < 0;
  const subParts = [label, sub, cost ? `${formatCurrency(cost)}/ano` : null].filter(Boolean);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/50 px-4 py-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-fg/[0.06] text-muted">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-fg">{value || "—"}</p>
        <p className="truncate text-xs text-subtle">{subParts.join(" · ")}</p>
      </div>
      {dueIso && (
        <span
          className={cn(
            "shrink-0 text-xs font-medium",
            late
              ? "text-[var(--danger)]"
              : soon
                ? "text-[var(--warning)]"
                : "text-muted",
          )}
        >
          {relativeDays(dueIso)}
        </span>
      )}
    </div>
  );
}

function ContactAction({
  href,
  label,
  icon,
  accent,
}: {
  href?: string;
  label: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  const disabled = !href;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-colors",
        disabled
          ? "pointer-events-none border-border text-subtle opacity-50"
          : accent
            ? "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20"
            : "border-border text-muted hover:bg-fg/[0.05] hover:text-fg",
      )}
    >
      {icon}
      {label}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.25.7-1.44 1.33-1.98 1.38-.53.06-1.03.24-3.46-.72-2.9-1.15-4.76-4.1-4.9-4.29-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.25.58.83 2.01.9 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.92 1.06.94 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.37-.23.62-.14.25.09 1.61.76 1.89.9.28.14.46.21.53.33.07.12.07.68-.18 1.38Z" />
    </svg>
  );
}
