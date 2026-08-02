"use client";

import { usePathname } from "next/navigation";
import { Menu, Plus } from "lucide-react";
import { pageTitle } from "./nav";
import { Button } from "@/components/ui/Button";
import { useUI } from "@/lib/ui-context";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { openNewClient, openNewProject } = useUI();

  const isProjects = pathname.startsWith("/painel/projetos");
  const label = isProjects ? "Novo projeto" : "Novo cliente";
  const action = isProjects ? openNewProject : openNewClient;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/95 px-4 sm:px-6">
      <button
        onClick={onMenu}
        className="grid size-9 place-items-center rounded-lg text-muted hover:bg-fg/[0.06] hover:text-fg lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight text-fg">
          {pageTitle(pathname)}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button size="md" onClick={action} className="hidden sm:inline-flex">
          <Plus className="size-4" />
          {label}
        </Button>
        <Button size="icon" onClick={action} className="sm:hidden" aria-label={label}>
          <Plus className="size-5" />
        </Button>
      </div>
    </header>
  );
}
