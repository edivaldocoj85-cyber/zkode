"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UIProvider } from "@/lib/ui-context";
import { SidebarProvider, useSidebar } from "@/lib/sidebar";
import { cn } from "@/lib/cn";
import { ClientFormModal } from "@/components/clients/ClientForm";
import { ClientDrawer } from "@/components/clients/ClientDrawer";
import { ContractModal } from "@/components/clients/ContractModal";
import { ProjectFormModal } from "@/components/projects/ProjectForm";
import { ProjectDrawer } from "@/components/projects/ProjectDrawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <UIProvider>
        <AppShellBody>{children}</AppShellBody>

        <ClientFormModal />
        <ClientDrawer />
        <ContractModal />
        <ProjectFormModal />
        <ProjectDrawer />
      </UIProvider>
    </SidebarProvider>
  );
}

function AppShellBody({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <div className="relative z-10 flex min-h-dvh">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div
        className={cn(
          "flex min-h-dvh min-w-0 flex-1 flex-col transition-[padding-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          collapsed ? "lg:pl-[84px]" : "lg:pl-[268px]",
        )}
      >
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
