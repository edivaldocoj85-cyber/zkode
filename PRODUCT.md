# Product

## Register

product

## Users

Duas audiências distintas usam este repositório:

- **Equipe interna Zkode** (davi, junior, wendel — sócios/operadores de uma agência de
  desenvolvimento sob medida): usam o `/painel` diariamente, no navegador do desktop
  no dia a dia de trabalho, para gerenciar clientes, projetos, contratos, cobranças e
  infraestrutura. Contexto de uso: sessões longas e repetidas, decisões operacionais
  rápidas (status de um cliente, valor de uma cobrança, prazo de um projeto).
- **Visitantes públicos** (leads em potencial): chegam pela landing (`/`) vindos de
  indicação/redes, avaliando se contratam a Zkode para sites, automações/IA ou sistemas.

## Product Purpose

Plataforma da Zkode com dois pilares:

1. **Painel de gestão interno** (`/painel`, protegido por login) — CRM leve para uma
   agência: cadastro de clientes, pipeline de projetos, contratos, cobranças e infra,
   com dados hoje em tabelas JSONB no Supabase (ou local no navegador sem Supabase
   configurado).
2. **Landing pública de marketing** (`/`) — apresenta os serviços da Zkode e direciona
   para contato via WhatsApp.

Sucesso = a equipe interna consegue achar/atualizar qualquer informação de cliente ou
projeto em poucos cliques, em qualquer tamanho de tela (o pedido atual é justamente
sobre isso: redimensionamento de painéis/abas, botões e acabamento visual); e a landing
transmite competência técnica o suficiente pra converter visita em contato.

## Brand Personality

**Técnica e confiável.** Precisa, direta, sem enfeite gratuito — a confiança de quem
entende de sistemas. O visual já em produção (dark-first, roxo `--accent`, glass sutil,
números tabulares, aurora/ambient discretos) é a expressão correta dessa personalidade;
extensões devem reforçá-la, não substituí-la por algo mais "SaaS genérico" ou "lúdico".

## Anti-references

- Clichês de "AI fez isso": gradient text, eyebrow uppercase acima de toda seção,
  hero-metric template (número grande + label + gradiente), grid de cards idênticos,
  side-stripe borders decorativas.
- Fundo cream/sand/bege como default "elegante" — este produto é dark-first por
  identidade própria, não por modinha.
- Qualquer coisa que pareça template de SaaS corporativo intercambiável — o painel é
  uma ferramenta interna de uma agência técnica pequena, não um produto B2B genérico.

## Design Principles

1. **A ferramenta de trabalho não pode atrapalhar o trabalho.** Prioridade em legibilidade,
   contraste e alvos de toque/clique confortáveis sobre qualquer floreio visual.
2. **Consistência antes de novidade.** Reusar os tokens e componentes já existentes
   (`Button`, `Modal`, `Field`, `StatCard`, tokens em `globals.css`) em vez de introduzir
   um segundo sistema visual.
3. **Responsivo de verdade, não só "não quebra".** Sidebar, drawers, modais, tabelas e
   grids de cards devem se redimensionar com intenção em mobile/tablet/desktop — não
   apenas empilhar.
4. **Motion com propósito.** Já há uma linguagem de motion (spring sutil, drift lento);
   qualquer animação nova segue a mesma cadência e respeita `prefers-reduced-motion`.
5. **Números não dançam.** Preços, métricas e datas usam `tnum`/`tabular-nums` — mantido
   em qualquer componente novo.

## Accessibility & Inclusion

Padrão WCAG AA: contraste de texto ≥4.5:1 (≥3:1 para texto grande), foco visível e
consistente (`:focus-visible` já implementado), alvos de toque com área confortável em
telas menores, e respeito total a `prefers-reduced-motion` (já parcialmente implementado
em `globals.css`, deve se estender a qualquer motion novo).
