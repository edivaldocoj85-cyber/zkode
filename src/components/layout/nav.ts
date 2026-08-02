import {
  LayoutDashboard,
  Users,
  ReceiptText,
  FileSignature,
  Server,
  KanbanSquare,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/painel", label: "Visão geral", icon: LayoutDashboard },
  { href: "/painel/clientes", label: "Clientes", icon: Users },
  { href: "/painel/projetos", label: "Projetos", icon: KanbanSquare },
  { href: "/painel/cobrancas", label: "Cobranças", icon: ReceiptText },
  { href: "/painel/contratos", label: "Contratos", icon: FileSignature },
  { href: "/painel/infra", label: "Infraestrutura", icon: Server },
];

export function pageTitle(pathname: string): string {
  const item = NAV_ITEMS.find(
    (n) => n.href === pathname || (n.href !== "/painel" && pathname.startsWith(n.href)),
  );
  return item?.label ?? "Painel Gestor";
}
