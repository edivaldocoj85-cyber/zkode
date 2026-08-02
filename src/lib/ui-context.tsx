"use client";

import { createContext, useContext, useState } from "react";

interface UIValue {
  // Clientes
  formOpen: boolean;
  editingId: string | null;
  drawerId: string | null;
  openNewClient: () => void;
  openEditClient: (id: string) => void;
  closeForm: () => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  // Contrato
  contractClientId: string | null;
  openContract: (id: string) => void;
  closeContract: () => void;
  // Projetos
  projectFormOpen: boolean;
  editingProjectId: string | null;
  projectDrawerId: string | null;
  openNewProject: () => void;
  openEditProject: (id: string) => void;
  closeProjectForm: () => void;
  openProjectDrawer: (id: string) => void;
  closeProjectDrawer: () => void;
}

const UIContext = createContext<UIValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [contractClientId, setContractClientId] = useState<string | null>(null);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectDrawerId, setProjectDrawerId] = useState<string | null>(null);

  const value: UIValue = {
    formOpen,
    editingId,
    drawerId,
    openNewClient: () => {
      setEditingId(null);
      setFormOpen(true);
    },
    openEditClient: (id) => {
      setEditingId(id);
      setFormOpen(true);
      setDrawerId(null);
    },
    closeForm: () => setFormOpen(false),
    openDrawer: (id) => setDrawerId(id),
    closeDrawer: () => setDrawerId(null),

    contractClientId,
    openContract: (id) => setContractClientId(id),
    closeContract: () => setContractClientId(null),

    projectFormOpen,
    editingProjectId,
    projectDrawerId,
    openNewProject: () => {
      setEditingProjectId(null);
      setProjectFormOpen(true);
    },
    openEditProject: (id) => {
      setEditingProjectId(id);
      setProjectFormOpen(true);
      setProjectDrawerId(null);
    },
    closeProjectForm: () => setProjectFormOpen(false),
    openProjectDrawer: (id) => setProjectDrawerId(id),
    closeProjectDrawer: () => setProjectDrawerId(null),
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI precisa estar dentro de <UIProvider>");
  return ctx;
}
