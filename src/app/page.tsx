"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Globe,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/brand/Logo";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

/** Troque pelo número real (formato internacional, só dígitos). */
const WHATSAPP = "5561999999999";
const WA_LINK = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Olá! Quero um site para o meu negócio.",
)}`;

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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const NICHES = [
  "Barbearias",
  "Clínicas de estética",
  "Odontologia",
  "Restaurantes",
  "Salões de beleza",
  "Pet shops",
  "Academias",
  "Advocacia",
  "Imobiliárias",
  "Buffets",
];

export default function LandingPage() {
  return (
    <div className="relative z-10 dark">
      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-fg transition-[filter] hover:brightness-110 accent-glow"
          >
            <MessageCircle className="size-4" />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      <main>
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="aurora" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
            {/* Texto */}
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent">
                  <Sparkles className="size-3.5" />
                  Prévia gratuita do seu site em 48h
                </span>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl">
                  Seu negócio no{" "}
                  <span className="text-gradient">topo do Google</span>, com um site
                  que vende.
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                  A A3 Sistemas cria sites rápidos e sistemas sob medida para negócios
                  locais — domínio, hospedagem e manutenção por nossa conta. Você cuida
                  do seu negócio; o resto é com a gente.
                </p>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-accent-fg transition-[filter] hover:brightness-110 accent-glow"
                  >
                    Quero minha prévia grátis
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="#planos"
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-border-strong px-6 text-sm font-medium text-fg transition-colors hover:bg-fg/[0.05]"
                  >
                    Ver planos
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.32}>
                <div className="mt-8 flex items-center gap-3 text-sm text-muted">
                  <div className="flex text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <span>Negócios locais já saem na frente da concorrência</span>
                </div>
              </Reveal>
            </div>

            {/* Mockup */}
            <Reveal delay={0.2} className="relative">
              <HeroMockup />
            </Reveal>
          </div>

          {/* Stats */}
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-3 gap-4 border-t border-border py-8">
              {[
                { v: 48, suffix: "h", l: "para a primeira prévia" },
                { v: 100, suffix: "%", l: "gerido: do domínio ao suporte" },
                { v: 50, prefix: "R$ ", l: "por mês de manutenção" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-mono text-2xl font-semibold tnum text-fg sm:text-4xl">
                    {s.prefix}
                    <AnimatedNumber value={s.v} />
                    {s.suffix}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-subtle sm:text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MARQUEE NICHOS ===== */}
        <section className="border-y border-border bg-surface-2/40 py-5">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-subtle">
            Feito para negócios como o seu
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-3">
              {[...NICHES, ...NICHES].map((n, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted"
                >
                  <span className="size-1.5 rounded-full bg-accent" />
                  {n}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SERVIÇOS ===== */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-widest text-accent">
                O que fazemos
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Do primeiro clique ao cliente na porta.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: Globe,
                  title: "Sites profissionais",
                  desc: "Página rápida, bonita e feita pra aparecer no Google do seu bairro — com botão de WhatsApp e agendamento integrados.",
                  items: ["Domínio próprio", "Otimizado pra celular", "SEO local"],
                },
                {
                  icon: Code2,
                  title: "Sistemas sob medida",
                  desc: "Agendamento, gestão de clientes, pedidos — o sistema que o seu negócio precisa, do seu jeito, sem mensalidade de terceiros.",
                  items: ["Escopo fechado", "Entrega por etapas", "Código seu"],
                },
                {
                  icon: Wrench,
                  title: "Manutenção completa",
                  desc: "Alterações, monitoramento, renovação de domínio e hospedagem. Seu site sempre no ar — sem você pensar nisso.",
                  items: ["Suporte direto", "Ajustes inclusos", "Infra renovada"],
                },
              ].map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08}>
                  <div className="hairline-top group h-full rounded-2xl border border-border bg-surface p-6 card-shadow transition-colors hover:border-border-strong">
                    <span className="grid size-11 place-items-center rounded-xl bg-accent/12 text-accent ring-1 ring-inset ring-accent/20">
                      <s.icon className="size-5" strokeWidth={2} />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-fg">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                    <ul className="mt-5 space-y-2">
                      {s.items.map((it) => (
                        <li key={it} className="flex items-center gap-2 text-sm text-muted">
                          <CheckCircle2 className="size-4 shrink-0 text-[var(--success)]" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== VITRINE ===== */}
        <section className="border-b border-border bg-surface-2/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-widest text-accent">
                Como fica
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Sites que passam confiança de imediato.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Barbearia", tone: "from-amber-500/25 to-orange-600/10" },
                { name: "Clínica de estética", tone: "from-indigo-500/25 to-fuchsia-600/10" },
                { name: "Restaurante", tone: "from-rose-500/25 to-red-600/10" },
              ].map((c, i) => (
                <Reveal key={c.name} delay={i * 0.08}>
                  <ShowcaseCard name={c.name} tone={c.tone} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== COMO FUNCIONA ===== */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-widest text-accent">
                Como funciona
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Simples pra você, do início ao ar.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: MessageCircle, title: "Conversa rápida", desc: "Você conta o que precisa pelo WhatsApp. Sem reunião chata." },
                { icon: Zap, title: "Prévia em 48h", desc: "A gente monta uma prévia real do seu site — grátis, sem compromisso." },
                { icon: Rocket, title: "Ajustes e lançamento", desc: "Você aprova, a gente refina e coloca no ar com seu domínio." },
                { icon: ShieldCheck, title: "Cuidamos de tudo", desc: "Hospedagem, renovações e alterações — mantido mês a mês." },
              ].map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="relative">
                    <span className="font-mono text-sm text-subtle">0{i + 1}</span>
                    <div className="mt-3 flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-accent">
                      <p.icon className="size-5" strokeWidth={2} />
                    </div>
                    <h3 className="mt-4 font-semibold tracking-tight text-fg">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PLANOS ===== */}
        <section id="planos" className="border-b border-border bg-surface-2/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-widest text-accent">
                Planos
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Preço fechado. Sem surpresa.
              </h2>
              <p className="mt-4 max-w-xl text-muted">
                Todos os planos incluem criação do site, domínio, hospedagem e
                publicação. A manutenção mensal cobre alterações e mantém tudo no ar.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              <Reveal>
                <PlanCard
                  highlight
                  badge="Mais escolhido"
                  title="Site · Plano Anual"
                  price="R$ 1.100"
                  period="/ano"
                  extra="+ R$ 50/mês de manutenção"
                  items={[
                    "Site completo publicado",
                    "Domínio e hospedagem inclusos",
                    "Alterações mensais inclusas",
                    "Suporte direto no WhatsApp",
                  ]}
                />
              </Reveal>
              <Reveal delay={0.08}>
                <PlanCard
                  title="Site · Plano Semestral"
                  price="R$ 550"
                  period="/semestre"
                  extra="+ R$ 50/mês de manutenção"
                  items={[
                    "Site completo publicado",
                    "Domínio e hospedagem inclusos",
                    "Alterações mensais inclusas",
                    "Renovação flexível",
                  ]}
                />
              </Reveal>
              <Reveal delay={0.16}>
                <PlanCard
                  title="Sistemas sob medida"
                  price="Sob consulta"
                  period=""
                  extra="escopo e proposta fechados antes de começar"
                  items={[
                    "Agendamento, gestão, pedidos…",
                    "Proposta com valores e prazos",
                    "Entrega por etapas validadas",
                    "Manutenção opcional",
                  ]}
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <Reveal>
              <div className="hairline-top relative overflow-hidden rounded-3xl border border-border bg-surface p-10 text-center card-shadow sm:p-16">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(600px 220px at 50% 0%, var(--accent-glow), transparent 70%)",
                  }}
                />
                <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                  Enquanto você lê isso, alguém procurou{" "}
                  <span className="text-gradient">o que você vende</span> — e achou o
                  concorrente.
                </h2>
                <p className="relative mx-auto mt-4 max-w-md text-muted">
                  Peça sua prévia gratuita. Em 48h você vê seu negócio com o site que
                  ele merece.
                </p>
                <div className="relative mt-8">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-7 text-sm font-semibold text-accent-fg transition-[filter] hover:brightness-110 accent-glow"
                  >
                    <MessageCircle className="size-4" />
                    Começar agora
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-subtle sm:flex-row sm:px-6">
          <Logo size="sm" />
          <span>
            © {new Date().getFullYear()} A3 Sistemas — todos os direitos reservados
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Mockup de site flutuante ---------- */
function HeroMockup() {
  return (
    <div className="relative mx-auto max-w-md lg:mx-0 lg:ml-auto">
      <div className="animate-floaty">
        {/* Janela do navegador */}
        <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface card-shadow">
          <div className="flex items-center gap-2 border-b border-border bg-surface-2/70 px-4 py-3">
            <span className="size-2.5 rounded-full bg-[var(--danger)]/70" />
            <span className="size-2.5 rounded-full bg-[var(--warning)]/70" />
            <span className="size-2.5 rounded-full bg-[var(--success)]/70" />
            <span className="ml-3 h-5 flex-1 rounded-md bg-fg/[0.06]" />
          </div>
          {/* "Site" dentro */}
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 rounded-md bg-fg/[0.12]" />
              <div className="h-7 w-20 rounded-lg bg-accent/80" />
            </div>
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-indigo-500/20 to-amber-500/10 p-5">
              <div className="h-3 w-3/4 rounded bg-fg/20" />
              <div className="mt-2 h-3 w-1/2 rounded bg-fg/15" />
              <div className="mt-4 h-8 w-28 rounded-lg bg-accent" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-surface-2/60 p-3">
                  <div className="size-6 rounded-md bg-accent/25" />
                  <div className="mt-2 h-2 w-full rounded bg-fg/10" />
                  <div className="mt-1.5 h-2 w-2/3 rounded bg-fg/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Badge flutuante */}
      <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border bg-surface px-4 py-3 card-shadow sm:block">
        <p className="font-mono text-lg font-semibold tnum text-[var(--success)]">+128%</p>
        <p className="text-[11px] text-subtle">buscas no Google</p>
      </div>
      <div className="absolute -right-3 -top-3 hidden items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 card-shadow sm:flex">
        <MessageCircle className="size-4 text-[var(--success)]" />
        <span className="text-xs font-medium text-fg">Novo agendamento</span>
      </div>
    </div>
  );
}

function ShowcaseCard({ name, tone }: { name: string; tone: string }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-surface card-shadow transition-colors hover:border-border-strong">
      <div className={cn("relative aspect-[4/3] bg-gradient-to-br p-4", tone)}>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-fg/25" />
          <span className="size-2 rounded-full bg-fg/25" />
          <span className="size-2 rounded-full bg-fg/25" />
        </div>
        <div className="mt-4 h-3 w-2/3 rounded bg-fg/25" />
        <div className="mt-2 h-2.5 w-1/2 rounded bg-fg/15" />
        <div className="mt-4 h-7 w-24 rounded-lg bg-accent" />
        <div className="absolute bottom-4 right-4 grid size-9 place-items-center rounded-lg bg-surface/80 text-accent backdrop-blur">
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-medium text-fg">{name}</span>
        <span className="text-xs text-subtle">site + agendamento</span>
      </div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  period,
  extra,
  items,
  badge,
  highlight = false,
}: {
  title: string;
  price: string;
  period: string;
  extra: string;
  items: string[];
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "hairline-top relative flex h-full flex-col rounded-2xl border p-7 card-shadow",
        highlight ? "border-accent/40 bg-surface accent-glow" : "border-border bg-surface",
      )}
    >
      {badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-fg">
          {badge}
        </span>
      )}
      <h3 className="text-sm font-medium text-muted">{title}</h3>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="font-mono text-4xl font-semibold tracking-tight tnum text-fg">
          {price}
        </span>
        {period && <span className="text-sm text-subtle">{period}</span>}
      </p>
      <p className="mt-1 text-xs text-accent">{extra}</p>
      <ul className="mt-6 flex-1 space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-muted">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--success)]" />
            {it}
          </li>
        ))}
      </ul>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-7 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-[filter,background-color]",
          highlight
            ? "bg-accent text-accent-fg hover:brightness-110"
            : "border border-border-strong text-fg hover:bg-fg/[0.05]",
        )}
      >
        Pedir prévia grátis
      </a>
    </div>
  );
}
