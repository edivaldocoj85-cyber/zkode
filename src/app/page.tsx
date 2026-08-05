"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Ban,
  BarChart3,
  Boxes,
  CheckCircle2,
  Cloud,
  Globe,
  Lock,
  MessageCircle,
  Plus,
  Minus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ZkodeMark } from "@/components/brand/Logo";

/** Troque pelo número real (formato internacional, só dígitos). */
const WHATSAPP = "5561999999999";
function wa(msg: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}
const WA_DEFAULT = wa("Olá, Zkode! Quero um orçamento.");

const easeOut = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const NAV = [
  ["Serviços", "#servicos"],
  ["Planos", "#planos"],
  ["Processo", "#processo"],
  ["Portal", "#portal"],
  ["FAQ", "#faq"],
] as const;

export default function LandingPage() {
  return (
    <div className="relative z-10 min-h-dvh bg-[#faf9f5] font-sans text-[#171331] antialiased">
      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-40 border-b border-[#171331]/8 bg-[#faf9f5]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <a href="#" className="inline-flex items-center gap-2 text-[#171331]">
            <ZkodeMark className="size-8" />
            <span className="text-lg font-semibold tracking-tight">Zkode</span>
          </a>
          <nav className="ml-4 hidden items-center gap-6 lg:flex">
            {NAV.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-[#6b6390] transition-colors hover:text-[#171331]"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/login"
              className="hidden h-10 items-center rounded-xl px-4 text-sm font-medium text-[#171331] transition-colors hover:bg-[#171331]/5 sm:inline-flex"
            >
              Área do cliente
            </a>
            <a
              href={WA_DEFAULT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.5)] transition-[filter] hover:brightness-110"
            >
              Orçamento grátis
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(680px 340px at 78% 8%, rgba(139,92,246,0.18), transparent 70%), radial-gradient(520px 300px at 12% 20%, rgba(236,72,153,0.12), transparent 70%)",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#7c3aed]/20 bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#7c3aed]">
                  <span className="size-1.5 rounded-full bg-[#ec4899]" />
                  WEB · AUTOMAÇÕES · SISTEMAS
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.06] tracking-tight sm:text-[3.6rem]">
                  Sistemas sob medida com{" "}
                  <span className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
                    gestão completa
                  </span>{" "}
                  do seu projeto
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#5b5480]">
                  Desenvolvemos sites, automações com IA e sistemas — e você acompanha
                  tudo num painel próprio: prazos, custos, financeiro e propostas de
                  front-end, em sigilo total.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href="#planos"
                    className="group inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] px-6 text-sm font-semibold text-white shadow-[0_12px_32px_-10px_rgba(124,58,237,0.55)] transition-[filter] hover:brightness-110"
                  >
                    Ver planos e preços
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="/login"
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#171331]/12 bg-white px-6 text-sm font-medium text-[#171331] transition-colors hover:bg-[#171331]/[0.03]"
                  >
                    Ver o painel de gestão
                  </a>
                </div>
              </Reveal>
              <Reveal delay={0.32}>
                <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-[#171331]/8 pt-8">
                  {[
                    ["+120", "projetos entregues"],
                    ["98%", "no prazo"],
                    ["24/7", "monitoramento"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <dd className="text-2xl font-semibold tracking-tight sm:text-3xl">{v}</dd>
                      <dt className="mt-1 text-xs text-[#6b6390] sm:text-sm">{l}</dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <PortalMockup />
            </Reveal>
          </div>
        </section>

        {/* ===== SERVIÇOS ===== */}
        <Section id="servicos" eyebrow="O que fazemos" title="Da presença digital ao sistema que roda a operação inteira.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, t: "Sites e landing pages", d: "Institucional, catálogo e páginas de conversão com SEO técnico e performance." },
              { icon: Sparkles, t: "Automações e IA", d: "Chatbots, integrações com CRM/ERP e fluxos que eliminam trabalho manual." },
              { icon: Boxes, t: "Sistemas sob medida", d: "ERP, CRM, portais e apps com login, painéis, relatórios e APIs." },
              { icon: Cloud, t: "Nuvem e sustentação", d: "Hospedagem, backup diário, monitoramento e SLA de correção." },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.07}>
                <div className="group h-full rounded-2xl border border-[#171331]/8 bg-white p-6 shadow-[0_1px_3px_rgba(23,19,49,0.04),0_16px_40px_-24px_rgba(23,19,49,0.14)] transition-transform hover:-translate-y-1">
                  <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#ec4899] text-white">
                    <s.icon className="size-5" strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 font-semibold tracking-tight">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b5480]">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ===== PLANOS ===== */}
        <section id="planos" className="border-y border-[#171331]/8 bg-white/60">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#7c3aed]">Planos</p>
              <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Planos alinhados ao mercado
              </h2>
              <p className="mt-4 max-w-xl text-[#5b5480]">
                Todos incluem propostas de front-end no portal antes de você fechar.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              <Reveal>
                <PlanCard
                  title="Sites & Landing Pages"
                  price="R$ 1.990"
                  unit="a partir de"
                  items={[
                    "Site institucional ou landing de alta conversão",
                    "SEO técnico + Analytics configurados",
                    "Domínio e hospedagem no 1º ano inclusos",
                    "2 propostas de front-end para escolher",
                    "Entrega em 10–15 dias úteis",
                  ]}
                  cta="Quero um site"
                  msg="Olá, Zkode! Quero um site (plano Sites & Landing Pages)."
                />
              </Reveal>
              <Reveal delay={0.08}>
                <PlanCard
                  highlight
                  badge="Mais procurado"
                  title="Automações & IA"
                  price="R$ 497"
                  unit="/mês + setup"
                  items={[
                    "Chatbot com IA no WhatsApp e no site",
                    "Integrações: CRM, ERP, planilhas e e-mail",
                    "Fluxos automáticos (cobrança, agendamento, leads)",
                    "Relatórios automáticos e monitoramento 24/7",
                    "Setup a partir de R$ 1.500 · sem fidelidade",
                  ]}
                  cta="Automatizar meu negócio"
                  msg="Olá, Zkode! Quero automatizar meu negócio (plano Automações & IA)."
                />
              </Reveal>
              <Reveal delay={0.16}>
                <PlanCard
                  title="Sistemas sob medida"
                  price="R$ 12.900"
                  unit="a partir de"
                  items={[
                    "Sistema web completo: login, painéis, relatórios",
                    "ERP/CRM sob medida, e-commerce, apps e APIs",
                    "Infraestrutura em nuvem com backup diário",
                    "4+ propostas de front-end até aprovar",
                    "Suporte 90 dias + SLA e equipe dedicada",
                  ]}
                  cta="Falar com especialista"
                  msg="Olá, Zkode! Quero falar sobre um sistema sob medida."
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== PROCESSO ===== */}
        <Section id="processo" eyebrow="Como funciona" title="Do primeiro contato ao sistema no ar, com você acompanhando cada etapa.">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Briefing e orçamento", "Você descreve a demanda. Em até 48h enviamos escopo e valores, sem compromisso."],
              ["02", "Propostas de front-end", "Recebe várias opções de interface no portal protegido e escolhe a preferida."],
              ["03", "Desenvolvimento", "Sprints com entregas semanais, prazos e custos visíveis no seu painel."],
              ["04", "Publicação e suporte", "Deploy, treinamento da equipe e sustentação com SLA definido."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.07}>
                <div>
                  <span className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text font-mono text-2xl font-bold text-transparent">
                    {n}
                  </span>
                  <h3 className="mt-3 font-semibold tracking-tight">{t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#5b5480]">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ===== PORTAL ===== */}
        <section id="portal" className="border-y border-[#171331]/8 bg-[#0B0F19] text-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#c4b5fd]">Portal do cliente</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Painel do cliente e portal protegido
              </h2>
              <p className="mt-4 max-w-lg text-[#b4a8e3]">
                Gerencie projetos, custos, financeiro e propostas em um só lugar — com
                acesso restrito e conteúdo confidencial.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { Icon: BarChart3, text: "Gestão de projetos e custos — etapas, prazos, horas, orçamento vs. realizado." },
                  { Icon: Lock, text: "Visualização apenas na plataforma — protótipos abrem só com seu login." },
                  { Icon: Ban, text: "Cópia e download bloqueados — marca-d'água com seu usuário." },
                  { Icon: ShieldCheck, text: "Sigilo garantido — NDA incluso; nada sai da plataforma." },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-[#c4b5fd]">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm leading-relaxed text-[#ded7f2]">{text}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#171331] transition-transform hover:-translate-y-0.5"
              >
                Abrir o painel de gestão
                <ArrowUpRight className="size-4" />
              </a>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-2xl border border-white/10 bg-[#131022] p-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8e82bc]">zkode.com.br/painel</p>
                    <p className="mt-0.5 font-semibold">Projeto: ERP Comercial</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f472b6]/15 px-2.5 py-1 text-xs font-medium text-[#f472b6]">
                    <Lock className="size-3" /> Confidencial
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-[#b4a8e3]">
                    <span>Progresso</span>
                    <span className="font-mono">68%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899]" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-[#8e82bc]">Orçado</p>
                    <p className="mt-0.5 font-mono text-lg font-semibold">R$ 42.000</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-[#8e82bc]">Realizado</p>
                    <p className="mt-0.5 font-mono text-lg font-semibold text-[#7fe3c0]">R$ 28.400</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {["Front-end A — Dashboard imersivo", "Front-end B — Clean corporativo"].map((f) => (
                    <div key={f} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm">
                      <span className="text-[#ded7f2]">{f}</span>
                      <span className="text-xs text-[#c4b5fd]">Ver →</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-[11px] text-[#6f6394]">
                  Conteúdo protegido — visualização só dentro da plataforma Zkode.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <Section id="faq" eyebrow="Dúvidas" title="Perguntas frequentes">
          <div className="mx-auto max-w-3xl divide-y divide-[#171331]/8 rounded-2xl border border-[#171331]/8 bg-white">
            {[
              ["O orçamento tem custo?", "Não. Você recebe escopo, prazo e propostas de front-end sem compromisso."],
              ["Posso baixar os protótipos?", "Não. Eles abrem apenas dentro da plataforma, com marca-d'água e download bloqueado."],
              ["Como funciona o pagamento?", "Entrada + parcelas por etapa entregue. Automações são mensalidade sem fidelidade."],
              ["O código é meu?", "Sim, após a aprovação final e quitação você recebe o repositório completo."],
            ].map(([q, a]) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </Section>

        {/* ===== ORÇAMENTO (CTA) ===== */}
        <section className="border-t border-[#171331]/8 bg-white/60">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Solicite seu orçamento</h2>
              <p className="mt-4 text-[#5b5480]">
                Sem compromisso. Em até 48h você recebe acesso ao portal com as primeiras propostas.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <OrcamentoForm />
            </Reveal>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#171331]/8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-[#6b6390] sm:flex-row sm:px-6">
          <a href="#" className="inline-flex items-center gap-2 text-[#171331]">
            <ZkodeMark className="size-6" />
            <span className="font-semibold">Zkode</span>
          </a>
          <span className="text-xs">© {new Date().getFullYear()} Zkode — sites, automações e sistemas sob medida</span>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Blocos ---------- */

function PortalMockup() {
  return (
    <div className="relative mx-auto max-w-md lg:mr-0">
      <div className="animate-floaty">
        <div className="overflow-hidden rounded-2xl border border-[#171331]/10 bg-white shadow-[0_30px_80px_-40px_rgba(124,58,237,0.5)]">
          {/* topo */}
          <div className="flex items-center gap-2 border-b border-[#171331]/8 bg-[#faf9f5] px-4 py-3">
            <span className="size-2.5 rounded-full bg-[#f472b6]/70" />
            <span className="size-2.5 rounded-full bg-[#fbbf24]/70" />
            <span className="size-2.5 rounded-full bg-[#34d399]/70" />
            <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-[#6b6390]">
              <ZkodeMark className="size-4" /> painel.zkode.com.br
            </span>
          </div>
          <div className="space-y-4 p-5">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#171331]/8 bg-[#faf9f5] p-3">
                <p className="text-xs text-[#6b6390]">Projetos ativos</p>
                <p className="mt-0.5 font-mono text-xl font-semibold">7</p>
              </div>
              <div className="rounded-xl border border-[#171331]/8 bg-[#faf9f5] p-3">
                <p className="text-xs text-[#6b6390]">Faturado / mês</p>
                <p className="mt-0.5 font-mono text-xl font-semibold text-[#7c3aed]">R$ 34k</p>
              </div>
            </div>
            {/* projetos */}
            {[
              ["ERP Comercial", 68, "from-[#8b5cf6] to-[#ec4899]"],
              ["Site — Barbearia", 92, "from-[#7c3aed] to-[#06b6d4]"],
            ].map(([nome, pct, grad]) => (
              <div key={nome as string} className="rounded-xl border border-[#171331]/8 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{nome as string}</span>
                  <span className="font-mono text-xs text-[#6b6390]">{pct as number}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#171331]/8">
                  <div className={cn("h-full rounded-full bg-gradient-to-r", grad as string)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* badges flutuantes */}
      <div className="absolute -left-4 -bottom-4 hidden rounded-xl border border-[#171331]/8 bg-white px-4 py-3 shadow-lg sm:block">
        <p className="font-mono text-lg font-semibold text-[#34d399]">98%</p>
        <p className="text-[11px] text-[#6b6390]">entregas no prazo</p>
      </div>
      <div className="absolute -right-3 -top-3 hidden items-center gap-2 rounded-xl border border-[#171331]/8 bg-white px-3 py-2 shadow-lg sm:flex">
        <Sparkles className="size-4 text-[#ec4899]" />
        <span className="text-xs font-medium">Nova proposta</span>
      </div>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#7c3aed]">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  );
}

function PlanCard({
  title,
  price,
  unit,
  items,
  cta,
  msg,
  badge,
  highlight = false,
}: {
  title: string;
  price: string;
  unit: string;
  items: string[];
  cta: string;
  msg: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-white p-7",
        highlight
          ? "border-[#7c3aed]/40 shadow-[0_20px_50px_-24px_rgba(124,58,237,0.5)]"
          : "border-[#171331]/8 shadow-[0_1px_3px_rgba(23,19,49,0.04),0_16px_40px_-28px_rgba(23,19,49,0.16)]",
      )}
    >
      {badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] px-3 py-1 text-[11px] font-semibold text-white">
          {badge}
        </span>
      )}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6b6390]">{title}</h3>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tracking-tight">{price}</span>
        <span className="text-sm text-[#6b6390]">{unit}</span>
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-sm text-[#3f3a5c]">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#7c3aed]" />
            {it}
          </li>
        ))}
      </ul>
      <a
        href={wa(msg)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[filter,background-color]",
          highlight
            ? "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white hover:brightness-110"
            : "border border-[#171331]/12 text-[#171331] hover:bg-[#171331]/[0.03]",
        )}
      >
        <MessageCircle className="size-4" />
        {cta}
      </a>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#7c3aed]/10 text-[#7c3aed]">
          {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </span>
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden px-5 pb-4 text-sm leading-relaxed text-[#5b5480]"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
}

function OrcamentoForm() {
  const [servico, setServico] = useState("Site ou landing page");
  const [investimento, setInvestimento] = useState("Até R$ 5.000");

  const link = wa(
    `Olá, Zkode! Quero um orçamento.\nServiço: ${servico}\nInvestimento previsto: ${investimento}`,
  );

  const selectCls =
    "h-12 w-full rounded-xl border border-[#171331]/12 bg-white px-3.5 text-sm text-[#171331] focus:border-[#7c3aed]/50 focus:outline-none";

  return (
    <div className="mt-9 rounded-2xl border border-[#171331]/8 bg-white p-6 text-left shadow-[0_20px_50px_-30px_rgba(23,19,49,0.3)]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[#6b6390]">O que você precisa?</span>
          <select value={servico} onChange={(e) => setServico(e.target.value)} className={selectCls}>
            <option>Site ou landing page</option>
            <option>Automações e IA</option>
            <option>Sistema sob medida</option>
            <option>Ainda não sei</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[#6b6390]">Investimento previsto</span>
          <select value={investimento} onChange={(e) => setInvestimento(e.target.value)} className={selectCls}>
            <option>Até R$ 5.000</option>
            <option>R$ 5.000 a R$ 15.000</option>
            <option>R$ 15.000 a R$ 50.000</option>
            <option>Acima de R$ 50.000</option>
          </select>
        </label>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-sm font-semibold text-white shadow-[0_12px_32px_-10px_rgba(124,58,237,0.55)] transition-[filter] hover:brightness-110"
      >
        <MessageCircle className="size-4" />
        Enviar e receber propostas sem compromisso
      </a>
      <p className="mt-3 text-center text-xs text-[#6b6390]">
        <Lock className="mr-1 inline size-3" />
        Seus dados são tratados com sigilo total (LGPD).
      </p>
    </div>
  );
}
