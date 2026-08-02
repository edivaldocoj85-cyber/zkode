export type PlanType = "anual" | "semestral";

export type ClientStatus = "ativo" | "pendente" | "inadimplente" | "lead";

export type ContractStatus =
  | "nenhum"
  | "rascunho"
  | "enviado"
  | "pendente_anexo"
  | "assinado";

export type PaymentStatus = "pago" | "pendente" | "atrasado";

export interface Payment {
  id: string;
  descricao: string;
  valor: number;
  /** ISO date (YYYY-MM-DD) */
  vencimento: string;
  status: PaymentStatus;
  /** ISO date */
  pagoEm?: string;
}

export interface Infra {
  dominio?: string;
  registrador?: string;
  /** ISO date */
  dominioVence?: string;
  /** custo anual do domínio pago por você (R$) */
  dominioCusto?: number;
  hospedagem?: string;
  /** ISO date */
  hospedagemVence?: string;
  /** custo anual da hospedagem pago por você (R$) */
  hospedagemCusto?: number;
}

export interface Client {
  id: string;
  nome: string;
  segmento: string;
  regiao: string;
  whatsapp?: string;
  instagram?: string;
  email?: string;
  /** CPF/CNPJ — usado no contrato */
  documento?: string;
  status: ClientStatus;
  plano?: PlanType;
  /** 1100 (anual) | 550 (semestral) */
  valorPlano?: number;
  /** manutenção mensal, geralmente 50; 0 = sem manutenção */
  manutencao: number;
  contrato: ContractStatus;
  /** link do contrato assinado (gov.br / Drive) anexado */
  contratoAnexoUrl?: string;
  /** ISO date da assinatura */
  contratoAssinadoEm?: string;
  /** ISO date do início do contrato */
  inicio?: string;
  infra: Infra;
  pagamentos: Payment[];
  observacoes?: string;
}

export const PLAN_LABEL: Record<PlanType, string> = {
  anual: "Anual",
  semestral: "Semestral",
};

export const STATUS_LABEL: Record<ClientStatus, string> = {
  ativo: "Ativo",
  pendente: "Pendente",
  inadimplente: "Inadimplente",
  lead: "Lead",
};

export const CONTRACT_LABEL: Record<ContractStatus, string> = {
  nenhum: "Sem contrato",
  rascunho: "Rascunho",
  enviado: "Enviado p/ assinar",
  pendente_anexo: "Pendente de anexo",
  assinado: "Assinado",
};

/* =========================================================
   PROJETOS  —  Site (fluxo enxuto) e Sistema (fluxo rigoroso)
   Fluxos pensados para desenvolvimento com Claude Code (IA-first):
   o foco humano é ESPECIFICAR bem, REVISAR o que a IA gera e TESTAR.
   ========================================================= */

export type ProjectType = "site" | "sistema";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface FlowStage {
  key: string;
  label: string;
  hint?: string;
  itens: ChecklistItem[];
}

export interface ProjectCost {
  id: string;
  label: string;
  valor: number;
}

export interface Project {
  id: string;
  nome: string;
  tipo: ProjectType;
  cliente?: string;
  descricao?: string;
  /** key da etapa atual dentro de `fluxo` */
  stageKey: string;
  devs: string[];
  repoUrl?: string;
  inicio?: string;
  entregaPrevista?: string;
  /** valor cobrado (receita do projeto) */
  valor?: number;
  /** gastos do projeto (ferramentas, APIs, infra, etc.) */
  custos: ProjectCost[];
  /** passo a passo com checklists, na ordem */
  fluxo: FlowStage[];
}

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  site: "Site",
  sistema: "Sistema",
};
