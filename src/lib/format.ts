export const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export const BRLcents = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export function formatCurrency(value: number, cents = false) {
  return (cents ? BRLcents : BRL).format(value || 0);
}

export function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export function relativeDays(iso?: string): string {
  const n = daysUntil(iso);
  if (n === null) return "—";
  if (n === 0) return "hoje";
  if (n === 1) return "amanhã";
  if (n === -1) return "ontem";
  if (n < 0) return `há ${Math.abs(n)} dias`;
  return `em ${n} dias`;
}

/** Retorna dígitos de um telefone para montar link wa.me */
export function waLink(whatsapp?: string) {
  if (!whatsapp) return undefined;
  const digits = whatsapp.replace(/\D/g, "");
  if (!digits) return undefined;
  const full = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${full}`;
}

export function igLink(instagram?: string) {
  if (!instagram) return undefined;
  const handle = instagram.replace(/^@/, "").trim();
  if (!handle) return undefined;
  return `https://instagram.com/${handle}`;
}

export function initials(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
