---
name: Zkode Platform
description: Painel de gestão + landing da Zkode — técnico, escuro por padrão, roxo como assinatura.
colors:
  bg: "#080b12"
  surface: "#10151f"
  surface-2: "#0c111a"
  elevated: "#171d2a"
  ink: "#f2f5fa"
  muted: "#a3b0c6"
  subtle: "#6a7893"
  border: "rgba(255,255,255,0.07)"
  border-strong: "rgba(255,255,255,0.13)"
  accent-violet: "#a78bfa"
  accent-violet-fg: "#160b2e"
  accent-deep: "#6d28d9"
  success: "#3ddc97"
  warning: "#fbbf24"
  danger: "#fb7185"
  info: "#6ea8fe"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.006em"
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0"
  numeric:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, monospace"
    fontFeature: "tnum"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-violet}"
    textColor: "{colors.accent-violet-fg}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
---

# Design System: Zkode Platform

## 1. Overview

**Creative North Star: "A Sala de Controle"**

Um painel de operação técnica: escuro por padrão, luz vindo de um único acento (o roxo
`--accent`), com profundidade construída por camadas de superfície, tons do próprio roxo
(`--accent-deep` → `--accent`) e um brilho ambiente lento no fundo — nunca por sombras
pesadas ou cards empilhados. A landing pública usa o mesmo vocabulário (glass, tabular
numbers, glow mono-acento) para que o visitante já veja, antes de entrar no painel, a
mesma qualidade técnica que vai encontrar depois de virar cliente.

O sistema rejeita explicitamente: gradient text ornamental, eyebrows uppercase acima de
toda seção, hero-metric template genérico, grids de card idênticos, side-stripe borders,
qualquer fundo cream/sand "elegante", e qualquer segunda cor de marca (rosa/ciano
saturados) — este produto é escuro por identidade e mono-acento por decisão, não por
tendência.

**Key Characteristics:**
- Dark-first (tema claro existe, mas é o secundário — o dark é onde o produto "mora")
- **Um único acento de marca, em todo o produto** (roxo `#a78bfa` dark / `#7c3aed`
  light) — profundidade vem de variar a *luminosidade* desse roxo (`--accent-deep` a
  `--accent` a `--accent`/lighter), nunca de introduzir uma segunda cor saturada
- Números sempre tabulares (`tnum`) — preços e métricas não "dançam" ao atualizar
- Glass e blur usados com parcimônia (topbar, modais), não como textura geral
- Motion consistente: spring sutil em interações, drift lento em elementos ambientes, sempre com fallback `prefers-reduced-motion`

**Decisão de rebrand (2026-08-18, manhã):** o rosa/magenta (`#f472b6`/`#ec4899`, "Rosa
Zkode") e o ciano (`#22d3ee`/`#0891b2`, "Ciano Zkode") foram removidos da identidade do
**painel**. Motivo: alinhar com a linguagem visual de produtos de tecnologia B2B atuais
(Linear, Vercel, Raycast) — mono-acento roxo/indigo, mais sóbrio e "premium SaaS".

**Divergência landing × painel (2026-08-18, tarde):** a landing pública (`/`) foi
redesenhada de novo, agora **sem roxo**, com material "metalizado" (grafite + prata
escovada) — decisão do usuário, escopo explicitamente limitado à landing. A partir
desta data, landing e painel usam **dois sistemas de cor distintos e intencionais**:

- **Painel** (`/painel`): continua roxo `--accent` mono-acento (regras desta seção).
- **Landing** (`/`): grafite/prata (`#0A0B0D` a `#F3F5F7`, acento `#9AA2AD`/`#C7CCD2`,
  gradiente "chrome" `linear-gradient(110deg,#aeb4bc,#eef1f4,#ffffff,#eef1f4,#9aa2ad)`
  para botões/CTAs, com sheen animado (`.metal-sheen`) e hover de brilho (`.shine`,
  ambos em `globals.css`). Tokens vivem como constantes locais em `src/app/page.tsx`
  (`CHROME_BG`/`CHROME_TEXT`), não em `globals.css`, porque não se aplicam ao painel.
  A marca (`ZkodeMark`) aceita `stroke`/`fill` para ser recolorida em prata nessa
  superfície — o padrão do componente continua roxo/rosa para o painel.
  Uma marca d'água (malha do símbolo Zkode, ~5% de opacidade) roda atrás de todo o
  conteúdo da landing (`background-image` SVG em `globals.css`-free, componente
  `Watermark` local a `page.tsx`).

Isso é uma exceção deliberada, não drift: um auditor/detector vai sinalizar as cores da
landing como "fora da paleta do DESIGN.md" porque o DESIGN.md documenta o sistema do
**painel**. Trate essas ocorrências específicas de `src/app/page.tsx` como esperadas.
Se um dia as duas superfícies forem unificadas de novo, decida explicitamente qual
sistema vence — não misture os dois.

## 2. Colors

Paleta escura e contida: quase tudo é neutro-azulado (`bg`/`surface`/`ink`), e o roxo
entra só onde precisa carregar significado (ação primária, item ativo, destaque). Não
há cor de marca secundária — profundidade e gradientes usam apenas variações de
luminosidade do próprio roxo.

### Primary
- **Violeta Painel** (`#a78bfa` dark / `#7c3aed` light): ação primária, item de navegação ativo, foco, glow ambiente. É o único acento que aparece em >5% de qualquer tela — na landing e no painel.
- **Violeta Profundo** (`--accent-deep`, `#6d28d9` dark / `#5b21b6` light): ponta escura dos gradientes de CTA e do glow ambiente secundário — cria profundidade sem sair do roxo.
- **Violeta Claro** (`#c4b5fd`): ponta clara dos gradientes, ícones de apoio e destaques de texto em títulos (`text-[#c4b5fd]`).

### Neutral
- **Fundo** (`#080b12` dark / `#f4f6fb` light): base da página.
- **Superfície** (`#10151f` dark / `#ffffff` light): cards, sidebar, modais.
- **Superfície 2** (`#0c111a` dark / `#f8fafc` light): fundo de inputs, footers de card, mini-resumos.
- **Tinta** (`#f2f5fa` dark / `#0b1120` light): texto principal.
- **Muted** (`#a3b0c6` dark / `#5a6884` light): texto secundário — só onde o contraste ainda passa de 4.5:1 em corpo de texto.
- **Subtle** (`#6a7893` dark / `#8a95ab` light): metadados de baixa prioridade (timestamps, hints).
- **Borda** / **Borda forte**: divisórias quase invisíveis em repouso, mais presentes em hover/foco.

### Status
- **Sucesso** `#3ddc97`, **Alerta** `#fbbf24`, **Perigo** `#fb7185`, **Info** `#6ea8fe` — sempre em par com fundo tintado a ~12-15% de opacidade, nunca sólido em área grande.

### Named Rules
**The One Accent Rule.** O roxo é a única cor saturada de marca em todo o produto — painel e landing. Nenhuma segunda cor de marca (rosa, ciano ou qualquer outro tom saturado fora do roxo) entra em botão, badge, gradiente, glow ou texto. Profundidade e variação vêm só de clarear/escurecer o próprio roxo.

## 3. Typography

**Display / Body Font:** Geist (com fallback `ui-sans-serif, system-ui, sans-serif`)
**Mono Font:** Geist Mono — reservado para números (`tnum`) e labels técnicos

**Character:** Uma única família geométrica-humanista em vários pesos — sem par
decorativo. A confiança vem da consistência, não de contraste tipográfico.

### Hierarchy
- **Display** (600, `clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem)`, 1.1): título de página/hero (`h2` do dashboard, hero da landing).
- **Title** (600, 1.125rem, 1.3): cabeçalho de card, modal, seção.
- **Body** (400, 0.875rem, 1.55): texto corrido, listas, descrições. Teto de 65-75ch onde há prosa.
- **Label** (500, 0.75rem): labels de formulário, badges, metadados.
- **Numeric** (Geist Mono, `tnum`): qualquer valor monetário, métrica ou data que possa mudar em tempo real.

### Named Rules
**The Tabular Rule.** Todo número que pode mudar (preço, contador, data relativa) usa `font-variant-numeric: tabular-nums`. Sem exceção — é o que impede o layout de "pular" quando os dados atualizam.

## 4. Elevation

Camadas, não sombras pesadas. A profundidade vem de empilhar tons de superfície
(`bg` → `surface` → `elevated`) mais um hairline de brilho no topo de cards premium
(`.hairline-top`), reforçados por um `card-shadow` bem sutil (quase imperceptível,
função de separação, não de drama).

### Shadow Vocabulary
- **card-shadow** (`inset 0 1px 0 rgba(255,255,255,.035), 0 1px 2px hsl(shadow/.5), 0 14px 34px -18px hsl(shadow/.65)`): elevação padrão de card/modal — difusa, nunca dura.
- **accent-glow** (`0 0 0 1px glass-border, 0 12px 40px -12px accent-glow`): reservado para o botão primário e elementos que precisam "brilhar" (ação em foco).

### Named Rules
**The Ambient-Not-Dramatic Rule.** Glow e blur existem para dar atmosfera (aurora, ambient blobs), nunca para simular profundidade física agressiva. Se uma sombra parece 3D, é forte demais.

## 5. Components

### Buttons
- **Shape:** `rounded-xl` (12px) em md/lg, `rounded-lg` (8px) em sm — cantos suaves, nunca pill exceto badges.
- **Primary:** fundo `--accent` sólido, texto `--accent-fg`, `accent-glow` no estado de repouso — é o único botão com glow permanente.
- **Ghost / Outline / Subtle:** transparente ou tintado a ~5-10% sobre `--fg`, usados para ações secundárias — a maioria dos botões do painel deveria ser ghost/outline, não primary.
- **Danger:** fundo tintado a 12% de `--danger`, nunca sólido — evita que a tela grite.
- **Hover / Focus:** `whileHover={{ y: -1 }}` + spring (stiffness 400, damping 25); foco usa o `:focus-visible` global (`outline: 2px solid var(--ring)`).
- **Sizes:** sm (32px), md (40px), lg (48px), icon (40×40) — alvo de toque mínimo de 40px reforçado em mobile.

### Named Rules
**The One Primary Rule.** No máximo um botão `primary` visível por tela/seção — o resto é `ghost`, `outline` ou `subtle`.

### Badges
- **Style:** pill (`rounded-full`), borda 1px + fundo tintado na cor do tom (12-14% opacidade), texto na cor sólida do tom.
- **Uso:** status (lead, ativo, atrasado), nunca como decoração.

### Cards (SpotlightCard)
- **Corner Style:** `rounded-2xl` (16px).
- **Background:** `--surface` sólido, nunca glass (glass é reservado pra topbar/overlays).
- **Shadow Strategy:** `card-shadow` + `hairline-top` opcional.
- **Border:** 1px `--border` em repouso, `--border-strong` no hover.
- **Interactive:** spotlight que segue o cursor (`radial-gradient` com `--accent-glow`) + leve `y: -3` no hover — só em cards clicáveis (`interactive`), nunca em cards estáticos de conteúdo.
- **Internal Padding:** 20-24px (`p-5`/`p-6`).

### Inputs / Fields
- **Style:** `rounded-xl`, fundo `--surface-2` a 60% opacidade, borda `--border`, altura 40px.
- **Focus:** borda muda para `--accent` a 50% + fundo sobe pra 100% opacidade — sem glow pesado, mudança sutil de estado.
- **Label:** 12px, `--muted`, com hint opcional em `--subtle` separado por `·`.

### Navigation (Sidebar)
- **Style:** superfície sólida, item ativo com pill de fundo (`bg-accent/10` + borda `accent/30`) animado via `layoutId` do Framer Motion (transição spring entre itens).
- **Mobile:** off-canvas com scrim (`bg-black/50 backdrop-blur-sm`), `translate-x` com `duration-300`.
- **Largura fixa hoje:** 268px — candidato a virar responsivo/colapsável (ver Do's and Don'ts).

### Modals / Drawers
- **Corner Style:** `rounded-2xl`, `card-shadow` + `hairline-top`.
- **Width:** `max-w-2xl` fixo hoje — não escala por conteúdo nem por breakpoint (ver Do's and Don'ts).
- **Scroll interno:** `max-h-[65vh]` no corpo, header e footer fixos.

## 6. Do's and Don'ts

### Do:
- **Do** manter o roxo como única cor saturada de marca em qualquer tela, painel ou landing — variar só a luminosidade (`--accent-deep` → `--accent` → `#c4b5fd`).
- **Do** usar `tnum`/`tabular-nums` em todo número que muda.
- **Do** respeitar `prefers-reduced-motion` em qualquer animação nova (o projeto já faz isso globalmente em `globals.css`).
- **Do** escalar largura de modais/drawers por breakpoint e por conteúdo (`sm:max-w-md`, `lg:max-w-2xl`, `max-w-[95vw]` em telas pequenas) em vez de um `max-w-2xl` fixo.
- **Do** manter alvos de toque ≥40px em qualquer controle clicável em mobile.
- **Do** usar `SpotlightCard`, `Button`, `Badge`, `Field` existentes antes de criar variantes novas.

### Don't:
- **Don't** usar gradient text fora do único `.text-gradient` já estabelecido (título do dashboard) — não expandir esse padrão para mais lugares.
- **Don't** adicionar eyebrow uppercase acima de seções do painel — não é a linguagem deste produto.
- **Don't** usar sombra dura/3D — a elevação é sempre difusa (`card-shadow`).
- **Don't** aplicar `interactive` (spotlight hover) em cards que não são clicáveis — é sinal de affordance, não decoração.
- **Don't** deixar a sidebar com largura fixa de 268px quebrando em telas <1024px sem colapsar/off-canvas (hoje já faz isso, mas qualquer extensão precisa manter esse comportamento).
- **Don't** usar mais de um botão `primary` visível na mesma tela.
- **Don't** reintroduzir rosa/ciano (ou qualquer segunda cor saturada) na landing ou no painel — removidos em 2026-08-18 em favor de um único acento roxo/indigo.
