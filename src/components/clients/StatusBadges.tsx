import { Badge } from "@/components/ui/Badge";
import {
  CONTRACT_LABEL,
  PLAN_LABEL,
  STATUS_LABEL,
  type ClientStatus,
  type ContractStatus,
  type PaymentStatus,
  type PlanType,
} from "@/lib/types";

const statusTone = {
  ativo: "success",
  pendente: "warning",
  inadimplente: "danger",
  lead: "info",
} as const;

export function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <Badge tone={statusTone[status]} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function PlanBadge({ plano }: { plano?: PlanType }) {
  if (!plano) return <span className="text-subtle text-xs">—</span>;
  return <Badge tone="accent">{PLAN_LABEL[plano]}</Badge>;
}

const contractTone = {
  nenhum: "neutral",
  rascunho: "neutral",
  enviado: "info",
  pendente_anexo: "warning",
  assinado: "success",
} as const;

export function ContractBadge({ contrato }: { contrato: ContractStatus }) {
  return <Badge tone={contractTone[contrato]}>{CONTRACT_LABEL[contrato]}</Badge>;
}

const payTone = {
  pago: "success",
  pendente: "warning",
  atrasado: "danger",
} as const;

const payLabel = {
  pago: "Pago",
  pendente: "Pendente",
  atrasado: "Atrasado",
};

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge tone={payTone[status]} dot>
      {payLabel[status]}
    </Badge>
  );
}
