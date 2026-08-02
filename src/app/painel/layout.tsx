import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "A3 Sistemas · Painel",
  description: "Gestão de clientes, contratos, cobranças e projetos.",
  robots: { index: false, follow: false },
};

export default function PainelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
