"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SidebarValue {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarValue | null>(null);
const KEY = "painel-gestor:sidebar-collapsed";

/** Estado do modo colapsado (ícone-only) da sidebar em telas ≥lg, persistido localmente. */
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(KEY) === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((v) => !v) }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar precisa estar dentro de <SidebarProvider>");
  return ctx;
}
