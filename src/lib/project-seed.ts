import type { FlowStage, Project, ProjectType } from "./types";

interface StageDef {
  key: string;
  label: string;
  hint: string;
  itens: string[];
}

/**
 * FLUXO SITE — enxuto. Com Claude Code, design e código andam juntos:
 * não há etapa de "design" separada; o site é construído já com a identidade.
 */
const SITE_FLOW: StageDef[] = [
  {
    key: "proposta",
    label: "Proposta & fechamento",
    hint: "O que vamos entregar, por quanto e com que custos.",
    itens: [
      "Entender o objetivo do site e o público",
      "Definir valor, custos (domínio + hospedagem) e prazo",
      "Enviar proposta e fechar o contrato",
    ],
  },
  {
    key: "conteudo",
    label: "Conteúdo & identidade",
    hint: "Material do cliente + a referência que o Claude vai usar.",
    itens: [
      "Coletar textos, fotos e logo do cliente",
      "Definir cores, referências e estilo",
      "Escrever o brief/prompt para o Claude Code",
    ],
  },
  {
    key: "construcao",
    label: "Construção com Claude Code",
    hint: "Design e código juntos, iterando pelos prompts.",
    itens: [
      "Gerar o site com Claude Code (design + código)",
      "Revisar o resultado e refinar os prompts",
      "Ajustar responsivo, SEO e WhatsApp/agendamento",
    ],
  },
  {
    key: "revisao",
    label: "Revisão do cliente",
    hint: "O cliente aprova antes de ir ao ar.",
    itens: [
      "Publicar prévia e enviar ao cliente",
      "Aplicar os ajustes solicitados",
    ],
  },
  {
    key: "publicacao",
    label: "Publicação & entrega",
    hint: "No ar, com domínio e hospedagem configurados.",
    itens: [
      "Configurar domínio e hospedagem",
      "Colocar no ar e testar tudo",
      "Entregar acessos e cadastrar no painel",
    ],
  },
];

/**
 * FLUXO SISTEMA — mais rigoroso. Como o código sai rápido com Claude Code,
 * o peso vai para a ESPECIFICAÇÃO (requisitos), a REVISÃO da IA e os TESTES.
 */
const SISTEMA_FLOW: StageDef[] = [
  {
    key: "proposta",
    label: "Proposta, valores & custos",
    hint: "Escopo inicial, quanto custa pra você e quanto cobrar.",
    itens: [
      "Entender o problema e o objetivo do sistema",
      "Levantar custos (infra, APIs, ferramentas)",
      "Definir valor e enviar proposta",
      "Fechar o contrato",
    ],
  },
  {
    key: "requisitos",
    label: "Análise de requisitos",
    hint: "O 'cérebro' do projeto — é o que você entrega ao Claude Code.",
    itens: [
      "Definir usuários e principais fluxos",
      "Listar funcionalidades do MVP (essencial × depois)",
      "Escrever as regras de negócio",
      "Montar o documento de especificação (spec)",
    ],
  },
  {
    key: "design_system",
    label: "Design system & modelagem",
    hint: "Tokens e modelo de dados guiam a geração de código.",
    itens: [
      "Definir tokens visuais (cores, tipografia, componentes)",
      "Modelar os dados (entidades e relações)",
      "Definir stack e arquitetura",
    ],
  },
  {
    key: "desenvolvimento",
    label: "Desenvolvimento com Claude Code",
    hint: "Gerar a partir da spec e revisar — não confiar cego na IA.",
    itens: [
      "Criar repositório e setup do projeto",
      "Dividir as features entre os devs",
      "Gerar o código com Claude Code a partir da spec",
      "Revisão humana dos PRs no GitHub",
    ],
  },
  {
    key: "testes",
    label: "Testes & QA",
    hint: "Onde o humano mais agrega valor no fluxo IA-first.",
    itens: [
      "Testar todos os fluxos principais",
      "Revisar segurança, permissões e casos-limite",
      "Corrigir bugs e validar performance",
    ],
  },
  {
    key: "deploy",
    label: "Deploy & entrega",
    hint: "Produção, treinamento e monitoramento.",
    itens: [
      "Deploy em produção",
      "Entregar acessos e treinar o cliente",
      "Documentação e monitoramento",
    ],
  },
];

export function flowDef(tipo: ProjectType): StageDef[] {
  return tipo === "site" ? SITE_FLOW : SISTEMA_FLOW;
}

export function buildFlow(
  tipo: ProjectType,
  done: Record<string, number> = {},
): FlowStage[] {
  return flowDef(tipo).map((s) => ({
    key: s.key,
    label: s.label,
    hint: s.hint,
    itens: s.itens.map((label, i) => ({
      id: `${s.key}-${i}`,
      label,
      done: i < (done[s.key] ?? 0),
    })),
  }));
}

export const SEED_PROJECTS: Project[] = [
  {
    id: "proj-agenda-glauber",
    nome: "App de Agendamento",
    tipo: "sistema",
    cliente: "Glauber Barbiere",
    descricao:
      "App próprio de agendamento e plano de assinatura para substituir o avec.beauty (terceiro).",
    stageKey: "desenvolvimento",
    devs: ["Davi", "Léo"],
    repoUrl: "https://github.com/studio-sites/agenda-glauber",
    inicio: "2026-07-01",
    entregaPrevista: "2026-09-15",
    valor: 6800,
    custos: [
      { id: "c1", label: "Supabase (ano)", valor: 600 },
      { id: "c2", label: "Domínio + hospedagem", valor: 220 },
    ],
    fluxo: buildFlow("sistema", {
      proposta: 4,
      requisitos: 4,
      design_system: 3,
      desenvolvimento: 2,
    }),
  },
  {
    id: "proj-site-savaya",
    nome: "Site institucional",
    tipo: "site",
    cliente: "Savaya Barbearia",
    descricao: "Landing com agendamento e WhatsApp, otimizada pra Google local.",
    stageKey: "conteudo",
    devs: ["Davi"],
    inicio: "2026-07-28",
    valor: 1100,
    custos: [{ id: "c1", label: "Domínio (ano)", valor: 40 }],
    fluxo: buildFlow("site", { proposta: 3, conteudo: 1 }),
  },
];
