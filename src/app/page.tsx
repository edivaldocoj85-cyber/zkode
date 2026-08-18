"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  Boxes,
  Check,
  CheckCircle2,
  Clock3,
  Cloud,
  FileSignature,
  Globe,
  LayoutDashboard,
  Lock,
  Mail,
  Menu,
  MessageCircle,
  Play,
  Plus,
  Minus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ZkodeMark } from "@/components/brand/Logo";

/** Troque pelo número real (formato internacional, só dígitos). */
const WHATSAPP = "5561999999999";
/** Troque pelo e-mail real de contato. */
const EMAIL = "contato@zkode.com.br";
function wa(msg: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}
const WA_DEFAULT = wa("Olá, Zkode! Quero um orçamento.");

const easeOut = [0.16, 1, 0.3, 1] as const;

/** Gradiente "chrome" (prata polida) — fundo de botão primário, dark-on-light. */
const CHROME_BG =
  "bg-[linear-gradient(110deg,#aeb4bc_0%,#eef1f4_25%,#ffffff_45%,#eef1f4_65%,#9aa2ad_100%)]";
const CHROME_TEXT = "text-[#0f1113]";

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
  ["Tendências", "#tendencias"],
  ["Serviços", "#servicos"],
  ["Soluções", "#solucoes"],
  ["Planos", "#planos"],
  ["Processo", "#processo"],
  ["FAQ", "#faq"],
] as const;

/** Tendências que ajudamos a aplicar — não é alegação de entrega específica pra um cliente. */
const TRENDS = [
  "Agentes de IA",
  "Automação com IA generativa",
  "Chatbots inteligentes 24/7",
  "Dashboards em tempo real",
  "Vídeo integrado ao sistema",
  "Integrações via API",
  "IA aplicada aos seus dados",
  "Monitoramento e alertas automáticos",
] as const;

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="relative z-10 min-h-dvh bg-[#0A0B0D] font-sans text-[#F3F5F7] antialiased">
      <Watermark />

      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0A0B0D]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <a
            href="#conteudo"
            className="sr-only rounded-lg bg-[#eef1f4] px-4 py-2 text-sm font-semibold text-[#0f1113] focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
          >
            Pular para o conteúdo
          </a>
          <a href="#" className="inline-flex items-center gap-2 text-white">
            <ZkodeMark className="size-8" stroke="#C7CCD2" fill="#EEF1F4" />
            <span className="text-lg font-semibold tracking-tight">Zkode</span>
          </a>
          <nav className="ml-4 hidden items-center gap-6 lg:flex">
            {NAV.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-[#9AA2AD] transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={WA_DEFAULT}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "shine metal-sheen hidden h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] transition-transform hover:-translate-y-px sm:inline-flex",
                CHROME_BG,
                CHROME_TEXT,
              )}
            >
              Orçamento grátis
            </a>
            <button
              onClick={() => setNavOpen((v) => !v)}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 text-white transition-colors hover:bg-white/[0.06] lg:hidden"
              aria-label={navOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={navOpen}
            >
              {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {navOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: easeOut }}
              className="overflow-hidden border-t border-white/8 bg-[#0A0B0D] lg:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-3 sm:px-6">
                {NAV.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setNavOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#A9AFB8] transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    {label}
                  </a>
                ))}
                <a
                  href={WA_DEFAULT}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setNavOpen(false)}
                  className={cn(
                    "mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] sm:hidden",
                    CHROME_BG,
                    CHROME_TEXT,
                  )}
                >
                  Orçamento grátis
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="conteudo">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(720px 380px at 80% 4%, rgba(154,162,173,0.16), transparent 70%), radial-gradient(560px 320px at 8% 26%, rgba(90,98,110,0.20), transparent 70%)",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#9AA2AD]/25 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#D3D8DD]">
                  <span className="size-1.5 rounded-full bg-[#D3D8DD]" />
                  WEB · AUTOMAÇÕES · SISTEMAS
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.06] tracking-tight text-balance sm:text-[3.6rem]">
                  Sistemas sob medida com{" "}
                  <span
                    className={cn(
                      "metal-sheen bg-clip-text text-transparent",
                      "bg-[linear-gradient(110deg,#7d838c_0%,#eef1f4_25%,#ffffff_45%,#eef1f4_65%,#7d838c_100%)]",
                    )}
                  >
                    gestão completa
                  </span>{" "}
                  do seu projeto
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#A9AFB8]">
                  Desenvolvemos sites, automações com IA e sistemas — e você acompanha
                  tudo em um painel próprio: prazos, custos e propostas de front-end,
                  com sigilo total.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href="#solucoes"
                    className={cn(
                      "shine metal-sheen group inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-[0_14px_32px_-10px_rgba(0,0,0,0.75)] transition-transform hover:-translate-y-px",
                      CHROME_BG,
                      CHROME_TEXT,
                    )}
                  >
                    Ver exemplos na prática
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                  <a
                    href={WA_DEFAULT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-medium text-white transition-colors hover:bg-white/[0.07]"
                  >
                    Falar no WhatsApp
                  </a>
                </div>
              </Reveal>
              <Reveal delay={0.32}>
                <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/8 pt-8">
                  {[
                    ["+120", "projetos entregues"],
                    ["98%", "no prazo"],
                    ["24/7", "monitoramento"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <dd className="font-mono text-2xl font-semibold tracking-tight tnum text-[#EEF1F4] sm:text-3xl">
                        {v}
                      </dd>
                      <dt className="mt-1 text-xs text-[#6E7580] sm:text-sm">{l}</dt>
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

        {/* ===== TENDÊNCIAS (IA, automação, vídeo) ===== */}
        <section id="tendencias" className="relative scroll-mt-16 overflow-hidden border-y border-white/8 bg-white/[0.015]">
          <div className="marquee-mask border-b border-white/8 py-4">
            <div className="marquee-track">
              {[...TRENDS, ...TRENDS].map((t, i) => (
                <span
                  key={i}
                  className="mx-1.5 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-[#A9AFB8]"
                >
                  <Sparkles className="size-3.5 shrink-0 text-[#A7ADB6]" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
              <Reveal>
                <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                  Tecnologia de ponta, sem a complexidade pra você
                </h2>
                <p className="mt-4 max-w-md text-[#9AA2AD]">
                  Agentes de IA, automação e sistemas com vídeo integrado — as mesmas
                  tendências que empresas do seu setor já estão adotando, aplicadas no
                  seu negócio sem você precisar entender de tecnologia.
                </p>
                <a
                  href="#solucoes"
                  className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[#D3D8DD] hover:text-white"
                >
                  Ver cada solução em detalhe
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </Reveal>

              <Reveal delay={0.14}>
                <LiveDemoPanel />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== SERVIÇOS ===== */}
        <Section id="servicos" title="Da presença digital ao sistema que roda a operação inteira.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, t: "Sites e landing pages", d: "Institucional, catálogo e páginas de conversão com SEO técnico e performance." },
              { icon: Sparkles, t: "Automações e IA", d: "Chatbots, integrações com CRM/ERP e fluxos que eliminam trabalho manual." },
              { icon: Boxes, t: "Sistemas sob medida", d: "ERP, CRM, portais e apps com login, painéis, relatórios e APIs." },
              { icon: Cloud, t: "Nuvem e sustentação", d: "Hospedagem, backup diário, monitoramento e SLA de correção." },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 0.07}>
                <div className="group h-full rounded-2xl border border-white/8 bg-white/[0.025] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
                  <span className="grid size-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#3d4149_0%,#6b7178_50%,#3d4149_100%)] text-white shadow-[0_10px_22px_-10px_rgba(0,0,0,0.8)]">
                    <s.icon className="size-5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-semibold tracking-tight text-white">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#9AA2AD]">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ===== SOLUÇÕES (exemplos) ===== */}
        <Section
          id="solucoes"
          title="Como cada solução se parece na prática."
          description="Mockups ilustrativos do tipo de entrega — o projeto final é desenhado do zero para o seu negócio."
        >
          <div className="flex flex-col gap-20">
            <SolutionRow
              badge={{ icon: Globe, label: "Site" }}
              title="Sites que já nascem prontos pra converter"
              description="Landing de alta conversão ou site institucional, com SEO técnico, Analytics configurado e formulário direto pro WhatsApp — no ar em 10–15 dias úteis."
              mockup={<BrowserMockup />}
            />
            <SolutionRow
              reverse
              badge={{ icon: Bot, label: "Automação & IA" }}
              title="Atendimento que responde, agenda e cobra sozinho"
              description="Assistente de IA no WhatsApp e no site: entende a pergunta, oferece horários, confirma o agendamento e avisa sua equipe — sem alguém digitando."
              mockup={<ChatMockup />}
            />
            <SolutionRow
              badge={{ icon: LayoutDashboard, label: "Sistema" }}
              title="Sistemas que dão visão real da operação"
              description="ERP, CRM ou portal sob medida: pedidos, financeiro, equipe e até vídeo institucional ou de onboarding, tudo em um painel só, com relatórios automáticos."
              mockup={<KanbanMockup />}
            />
          </div>

          <Reveal className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="text-[#9AA2AD]">Quer algo parecido pro seu negócio?</p>
            <a
              href="#planos"
              className="group inline-flex h-12 items-center gap-2 rounded-xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07]"
            >
              Ver planos e preços
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </Reveal>
        </Section>

        {/* ===== PLANOS ===== */}
        <section id="planos" className="scroll-mt-16 border-y border-white/8 bg-white/[0.015]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                Planos alinhados ao mercado
              </h2>
              <p className="mt-4 max-w-xl text-[#9AA2AD]">
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

            <Reveal delay={0.24} className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 border-t border-white/8 pt-10">
              {[
                [ShieldCheck, "Sigilo total e LGPD"],
                [FileSignature, "Contrato formalizado"],
                [LayoutDashboard, "Acompanhamento em tempo real no portal"],
                [Clock3, "SLA de suporte definido"],
              ].map(([Icon, label]) => {
                const IconComp = Icon as typeof ShieldCheck;
                return (
                  <div key={label as string} className="flex items-center gap-2.5 text-sm text-[#A9AFB8]">
                    <IconComp className="size-4 shrink-0 text-[#A7ADB6]" aria-hidden="true" />
                    {label as string}
                  </div>
                );
              })}
            </Reveal>
          </div>
        </section>

        {/* ===== PROCESSO ===== */}
        <Section id="processo" title="Do primeiro contato ao sistema no ar, com você acompanhando cada etapa.">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Briefing e orçamento", "Você descreve a demanda. Em até 48h enviamos escopo e valores, sem compromisso."],
              ["02", "Propostas de front-end", "Recebe várias opções de interface no portal protegido e escolhe a preferida."],
              ["03", "Desenvolvimento", "Sprints com entregas semanais, prazos e custos visíveis no seu painel."],
              ["04", "Publicação e suporte", "Deploy, treinamento da equipe e sustentação com SLA definido."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.07}>
                <div>
                  <span className="font-mono text-2xl font-bold tnum text-[#A7ADB6]">{n}</span>
                  <h3 className="mt-3 font-semibold tracking-tight text-white">{t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#9AA2AD]">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ===== FAQ ===== */}
        <Section id="faq" title="Perguntas frequentes">
          <div className="mx-auto max-w-3xl divide-y divide-white/8 rounded-2xl border border-white/8 bg-white/[0.02]">
            {[
              ["O orçamento tem custo?", "Não. Você recebe escopo, prazo e propostas de front-end sem compromisso."],
              ["Posso baixar os protótipos?", "Não. Eles abrem apenas dentro da plataforma, com marca-d’água e download bloqueado."],
              ["Como funciona o pagamento?", "Entrada + parcelas por etapa entregue. Automações são mensalidade sem fidelidade."],
              ["O código é meu?", "Sim, após a aprovação final e quitação você recebe o repositório completo."],
            ].map(([q, a]) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </Section>

        {/* ===== ORÇAMENTO (CTA) ===== */}
        <section id="contato" className="scroll-mt-16 border-t border-white/8 bg-white/[0.015]">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                Solicite seu orçamento
              </h2>
              <p className="mt-4 text-[#9AA2AD]">
                Sem compromisso. Conte o que você precisa e a gente cuida do resto.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <OrcamentoForm />
            </Reveal>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-[#6E7580] sm:flex-row sm:px-6">
          <a href="#" className="inline-flex items-center gap-2 text-white">
            <ZkodeMark className="size-6" stroke="#C7CCD2" fill="#EEF1F4" />
            <span className="font-semibold">Zkode</span>
          </a>
          <span className="text-xs">© {new Date().getFullYear()} Zkode — sites, automações e sistemas sob medida</span>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Marca d'água de fundo ---------- */

/** Malha discreta da marca Zkode atrás de todo o conteúdo — puramente decorativa. */
function Watermark() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -inset-[15%] opacity-[0.055]"
        style={{
          transform: "rotate(-9deg)",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M60 10 L105 35 V85 L60 110 L15 85 V35 Z' fill='none' stroke='%23C7CCD2' stroke-width='3'/%3E%3Cpath d='M60 42 L81 55 L60 68 L39 55 Z' fill='%23C7CCD2'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "120px 120px",
        }}
      />
    </div>
  );
}

/* ---------- Blocos ---------- */

function PortalMockup() {
  return (
    <div className="relative mx-auto max-w-md lg:mr-0">
      <div className="animate-floaty">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16181C] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]">
          {/* topo */}
          <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
            <span className="size-2.5 rounded-full bg-[#fb7185]/70" />
            <span className="size-2.5 rounded-full bg-[#fbbf24]/70" />
            <span className="size-2.5 rounded-full bg-[#34d399]/70" />
            <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-[#6E7580]">
              <ZkodeMark className="size-4" stroke="#9AA2AD" fill="#C7CCD2" /> zkode.com.br
            </span>
          </div>
          <div className="space-y-4 p-5">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-xs text-[#6E7580]">Projetos ativos</p>
                <p className="mt-0.5 font-mono text-xl font-semibold tnum text-white">7</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-xs text-[#6E7580]">Faturado / mês</p>
                <p className="mt-0.5 font-mono text-xl font-semibold tnum text-[#D3D8DD]">R$ 34k</p>
              </div>
            </div>
            {/* projetos */}
            {[
              ["ERP Comercial", 68, "from-[#6b7178] to-[#d3d8dd]"],
              ["Site — Barbearia", 92, "from-[#52565d] to-[#a7adb6]"],
            ].map(([nome, pct, grad]) => (
              <div key={nome as string} className="rounded-xl border border-white/8 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">{nome as string}</span>
                  <span className="font-mono text-xs tnum text-[#6E7580]">{pct as number}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className={cn("h-full rounded-full bg-gradient-to-r", grad as string)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* badges flutuantes */}
      <div className="absolute -left-4 -bottom-4 hidden rounded-xl border border-white/10 bg-[#16181C] px-4 py-3 shadow-xl sm:block">
        <p className="font-mono text-lg font-semibold tnum text-[#34d399]">98%</p>
        <p className="text-[11px] text-[#6E7580]">entregas no prazo</p>
      </div>
      <div className="absolute -right-3 -top-3 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#16181C] px-3 py-2 shadow-xl sm:flex">
        <Sparkles className="size-4 text-[#D3D8DD]" aria-hidden="true" />
        <span className="text-xs font-medium text-white">Nova proposta</span>
      </div>
    </div>
  );
}

/* ---------- Soluções (exemplos) ---------- */

function SolutionRow({
  badge,
  title,
  description,
  mockup,
  reverse = false,
}: {
  badge: { icon: LucideIcon; label: string };
  title: string;
  description: string;
  mockup: React.ReactNode;
  reverse?: boolean;
}) {
  const Icon = badge.icon;
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn("mx-auto w-full max-w-md lg:mx-0", reverse && "lg:order-2")}>
        {mockup}
      </Reveal>
      <Reveal delay={0.1} className={reverse ? "lg:order-1" : undefined}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D3D8DD]">
          <Icon className="size-3.5" aria-hidden="true" />
          {badge.label}
        </span>
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-balance text-white sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#9AA2AD]">{description}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/30">
          <Check className="size-3.5 shrink-0" aria-hidden="true" />
          Exemplo ilustrativo — o projeto real é desenhado pro seu negócio
        </p>
      </Reveal>
    </div>
  );
}

function BrowserMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16181C] shadow-[0_30px_65px_-35px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#fb7185]/70" />
        <span className="size-2.5 rounded-full bg-[#fbbf24]/70" />
        <span className="size-2.5 rounded-full bg-[#34d399]/70" />
        <span className="ml-3 truncate text-xs text-[#6E7580]">exemplo-estudio.com.br</span>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-20 rounded-full bg-white/20" />
          <div className="flex gap-3">
            <div className="h-2 w-8 rounded-full bg-white/10" />
            <div className="h-2 w-8 rounded-full bg-white/10" />
            <div className="h-2 w-8 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="space-y-2.5 pt-3">
          <div className="h-4 w-4/5 rounded-full bg-white/25" />
          <div className="h-4 w-3/5 rounded-full bg-gradient-to-r from-[#a7adb6] to-[#52565d]" />
        </div>
        <div className="h-2.5 w-full max-w-xs rounded-full bg-white/10" />
        <div className="h-2.5 w-2/3 max-w-[10rem] rounded-full bg-white/10" />
        <div
          className={cn(
            "mt-4 inline-flex h-9 items-center rounded-lg px-5 text-xs font-semibold",
            CHROME_BG,
            CHROME_TEXT,
          )}
        >
          Agendar horário
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-white/[0.06]" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatMockup() {
  const bubbles: { from: "cliente" | "bot"; text: string }[] = [
    { from: "cliente", text: "Oi! Vocês têm horário amanhã à tarde?" },
    { from: "bot", text: "Tenho sim! 14h ou 16h30 — qual prefere?" },
    { from: "cliente", text: "16h30 pra mim" },
    { from: "bot", text: "Agendado ✅ Aviso 1h antes. Precisa de mais algo?" },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16181C] shadow-[0_30px_65px_-35px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2.5 border-b border-white/8 bg-white/[0.03] px-4 py-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#3d4149_0%,#6b7178_100%)] text-white">
          <Bot className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-white">Assistente Zkode</p>
          <p className="text-[10px] text-[#34d399]">online · responde na hora</p>
        </div>
      </div>
      <div className="space-y-2.5 p-4">
        {bubbles.map((b, i) => (
          <div key={i} className={cn("flex", b.from === "cliente" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed",
                b.from === "cliente"
                  ? "rounded-br-sm bg-white/10 text-white"
                  : "rounded-bl-sm bg-[linear-gradient(135deg,#3d4149_0%,#6b7178_100%)] text-white",
              )}
            >
              {b.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanMockup() {
  const columns: [string, { nome: string; tag: string }[]][] = [
    [
      "Novo",
      [
        { nome: "Pedido #128", tag: "R$ 340" },
        { nome: "Pedido #129", tag: "R$ 89" },
      ],
    ],
    ["Em produção", [{ nome: "Pedido #124", tag: "R$ 210" }]],
    ["Pronto", [{ nome: "Pedido #121", tag: "R$ 560" }]],
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16181C] shadow-[0_30px_65px_-35px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#fb7185]/70" />
        <span className="size-2.5 rounded-full bg-[#fbbf24]/70" />
        <span className="size-2.5 rounded-full bg-[#34d399]/70" />
        <span className="ml-3 text-xs text-[#6E7580]">painel · pedidos</span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        {columns.map(([label, items]) => (
          <div key={label} className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-[#6E7580]">
                {label}
              </p>
              <span className="shrink-0 rounded-full bg-white/[0.06] px-1.5 text-[9px] tabular-nums text-[#6E7580]">
                {items.length}
              </span>
            </div>
            <div className="space-y-2">
              {items.map((it) => (
                <div key={it.nome} className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
                  <p className="truncate text-[11px] font-medium text-white">{it.nome}</p>
                  <p className="mt-1 font-mono text-[10px] tnum text-[#D3D8DD]">{it.tag}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Painel "Simulação" (tendências) ---------- */

const DEMO_SCENES = [
  { key: "ia", label: "Agente de IA" },
  { key: "automacao", label: "Automação" },
  { key: "video", label: "Vídeo no sistema" },
] as const;

function LiveDemoPanel() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((v) => (v + 1) % DEMO_SCENES.length), 3600);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <NetworkIllustration />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#16181C] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]">
        <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#fb7185]/70" />
          <span className="size-2.5 rounded-full bg-[#fbbf24]/70" />
          <span className="size-2.5 rounded-full bg-[#34d399]/70" />
          <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-[#6E7580]">
            <ZkodeMark className="size-4" stroke="#9AA2AD" fill="#C7CCD2" /> zkode.com.br
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-[#6E7580]">
            <span className="size-1.5 rounded-full bg-[#34d399] animate-pulse" aria-hidden />
            Simulação
          </span>
        </div>

        <div className="relative h-[240px] overflow-hidden p-5 sm:h-[260px]">
          <AnimatePresence mode="wait">
            {DEMO_SCENES[active].key === "ia" && <SceneIA key="ia" reduced={!!reduced} />}
            {DEMO_SCENES[active].key === "automacao" && (
              <SceneAutomacao key="automacao" reduced={!!reduced} />
            )}
            {DEMO_SCENES[active].key === "video" && <SceneVideo key="video" reduced={!!reduced} />}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t border-white/8 py-3">
          {DEMO_SCENES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActive(i)}
              aria-label={`Ver cena: ${s.label}`}
              aria-current={i === active}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-[#D3D8DD]" : "w-1.5 bg-white/15 hover:bg-white/25",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SceneIA({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? undefined : { opacity: 0, x: -28 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="flex h-full flex-col justify-center gap-2.5"
    >
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-white/10 px-3.5 py-2 text-xs text-white">
          Preciso agendar uma manutenção urgente
        </div>
      </div>
      <div className="flex justify-start">
        <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-[linear-gradient(135deg,#3d4149_0%,#6b7178_100%)] px-3.5 py-2 text-xs text-white">
          Consigo encaixar amanhã às 9h ou 15h. Qual prefere?
        </div>
      </div>
      <div className="flex items-center gap-1.5 pl-1">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-white/40 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
        <span className="text-[10px] text-[#6E7580]">agente de IA respondendo</span>
      </div>
    </motion.div>
  );
}

function SceneAutomacao({ reduced }: { reduced: boolean }) {
  const steps = [
    { icon: MessageCircle, label: "Novo lead" },
    { icon: Bot, label: "IA qualifica" },
    { icon: LayoutDashboard, label: "CRM atualiza" },
  ];
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? undefined : { opacity: 0, x: -28 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="flex h-full flex-col items-center justify-center gap-6"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center gap-2">
              <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[#A7ADB6]">
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="max-w-[74px] text-center text-[10px] leading-tight text-[#6E7580]">
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 &&
              (reduced ? (
                <div className="h-px w-6 bg-[#A7ADB6]/50 sm:w-8" />
              ) : (
                <div className="relative h-px w-6 overflow-hidden bg-white/10 sm:w-8">
                  <motion.span
                    className="absolute inset-y-0 left-0 w-3 rounded-full bg-[#D3D8DD]"
                    animate={{ left: ["-20%", "100%"] }}
                    transition={{
                      duration: 1.3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.35,
                    }}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] text-[#6E7580]">
        Disparo automático, sem intervenção manual
      </p>
    </motion.div>
  );
}

function SceneVideo({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? undefined : { opacity: 0, x: -28 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="flex h-full flex-col justify-center gap-3"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,#1a1c20_0%,#26292e_100%)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm"
            animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
          >
            <Play className="ml-0.5 size-5" fill="currentColor" aria-hidden="true" />
          </motion.span>
        </div>
        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-medium text-white/80 backdrop-blur-sm">
          <span className="size-1 rounded-full bg-[#fb7185] animate-pulse" aria-hidden />
          REC
        </span>
        <div className="absolute inset-x-3 bottom-3 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#D3D8DD]"
            animate={reduced ? { width: "45%" } : { width: ["6%", "100%"] }}
            transition={reduced ? undefined : { duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
      <p className="text-center text-[11px] text-[#6E7580]">
        Vídeo institucional ou de onboarding tocando direto no seu sistema
      </p>
    </motion.div>
  );
}

/** Constelação decorativa — puramente ilustrativa, atrás do painel de simulação. */
function NetworkIllustration() {
  const nodes: [number, number, number][] = [
    [40, 60, 3],
    [120, 30, 2.5],
    [200, 80, 3.5],
    [70, 160, 2.5],
    [180, 190, 3],
    [260, 140, 2.5],
    [230, 40, 2],
  ];
  const lines: [number, number, number, number][] = [
    [40, 60, 120, 30],
    [120, 30, 200, 80],
    [200, 80, 230, 40],
    [40, 60, 70, 160],
    [70, 160, 180, 190],
    [180, 190, 260, 140],
    [200, 80, 260, 140],
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 220"
      className="pointer-events-none absolute -inset-8 -z-10 opacity-60 blur-[0.5px] sm:-inset-12"
    >
      <defs>
        <linearGradient id="zk-netline" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9AA2AD" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3d4149" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {lines.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#zk-netline)" strokeWidth="1" />
      ))}
      {nodes.map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          className="animate-pulse fill-[#A7ADB6]"
          style={{ animationDelay: `${i * 0.35}s`, animationDuration: "3s" }}
        />
      ))}
    </svg>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-16 px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-xl text-[#9AA2AD]">{description}</p>
        )}
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
        "relative flex h-full flex-col rounded-2xl border p-7",
        highlight
          ? "border-[#9AA2AD]/40 bg-white/[0.04] shadow-[0_30px_65px_-30px_rgba(0,0,0,0.8)]"
          : "border-white/8 bg-white/[0.025]",
      )}
    >
      {badge && (
        <span
          className={cn(
            "absolute -top-3 left-6 rounded-full px-3 py-1 text-[11px] font-semibold",
            CHROME_BG,
            CHROME_TEXT,
          )}
        >
          {badge}
        </span>
      )}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9AA2AD]">{title}</h3>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="font-mono text-4xl font-semibold tracking-tight tnum text-white">{price}</span>
        <span className="text-sm text-[#6E7580]">{unit}</span>
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-sm text-[#A9AFB8]">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#A7ADB6]" aria-hidden="true" />
            {it}
          </li>
        ))}
      </ul>
      <a
        href={wa(msg)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-transform hover:-translate-y-px",
          highlight ? cn("shine metal-sheen", CHROME_BG, CHROME_TEXT) : "border border-white/14 text-white hover:bg-white/[0.06]",
        )}
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        {cta}
      </a>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium text-white">{q}</span>
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[#D3D8DD]">
          {open ? <Minus className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
        </span>
      </button>
      {open && (
        <motion.p
          id={panelId}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden px-5 pb-4 text-sm leading-relaxed text-[#9AA2AD]"
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
    "h-12 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3.5 text-sm text-white focus:border-[#9AA2AD]/60 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7CCD2]";

  return (
    <div className="mt-9 rounded-2xl border border-white/8 bg-white/[0.025] p-6 text-left shadow-2xl">
      <p className="mb-5 text-xs text-[#6E7580]">
        Dica: se já souber, adiante o tipo de negócio e o prazo desejado — agiliza a resposta.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[#9AA2AD]">O que você precisa?</span>
          <select value={servico} onChange={(e) => setServico(e.target.value)} className={selectCls}>
            <option className="bg-[#16181C]">Site ou landing page</option>
            <option className="bg-[#16181C]">Automações e IA</option>
            <option className="bg-[#16181C]">Sistema sob medida</option>
            <option className="bg-[#16181C]">Ainda não sei</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[#9AA2AD]">Investimento previsto</span>
          <select value={investimento} onChange={(e) => setInvestimento(e.target.value)} className={selectCls}>
            <option className="bg-[#16181C]">Até R$ 5.000</option>
            <option className="bg-[#16181C]">R$ 5.000 a R$ 15.000</option>
            <option className="bg-[#16181C]">R$ 15.000 a R$ 50.000</option>
            <option className="bg-[#16181C]">Acima de R$ 50.000</option>
          </select>
        </label>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "shine metal-sheen mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-[0_14px_32px_-12px_rgba(0,0,0,0.8)] transition-transform hover:-translate-y-px",
          CHROME_BG,
          CHROME_TEXT,
        )}
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        Enviar e receber propostas sem compromisso
      </a>
      <div className="mt-4 flex flex-col items-center gap-2 text-center text-xs text-[#6E7580] sm:flex-row sm:justify-between sm:text-left">
        <p className="inline-flex items-center gap-1.5">
          <Lock className="size-3 shrink-0" aria-hidden="true" />
          Seus dados são tratados com sigilo total (LGPD).
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center gap-1.5 font-medium text-[#D3D8DD] transition-colors hover:text-white"
        >
          <Mail className="size-3.5 shrink-0" aria-hidden="true" />
          Prefere e-mail? {EMAIL}
        </a>
      </div>
    </div>
  );
}
