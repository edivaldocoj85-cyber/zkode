"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Client, Payment, Project, ProjectCost } from "./types";
import { SEED_CLIENTS } from "./seed";
import { SEED_PROJECTS, buildFlow } from "./project-seed";
import { daysUntil } from "./format";

const STORAGE_KEY = "painel-gestor:v1";
const PROJECTS_KEY = "painel-gestor:projects:v2";

type Mode = "loading" | "local" | "supabase";

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function indexRecords<T extends { id: string }>(arr: T[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const x of arr) out[x.id] = JSON.stringify(x);
  return out;
}

async function syncTable(
  table: "clients" | "projects",
  upserts: unknown[],
  deletes: string[],
) {
  try {
    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, upserts, deletes }),
    });
  } catch {
    /* offline / falha de rede — próxima mudança tenta de novo */
  }
}

interface Metrics {
  mrr: number;
  receitaContratadaAno: number;
  aReceber: number;
  atrasado: number;
  ativos: number;
  leads: number;
  inadimplentes: number;
  totalClientes: number;
  infraVencendo: number;
  ticketMedio: number;
  custoInfraAno: number;
  lucroAno: number;
}

interface StoreValue {
  clients: Client[];
  projects: Project[];
  hydrated: boolean;
  mode: Mode;
  addClient: (c: Omit<Client, "id" | "pagamentos" | "infra"> & Partial<Pick<Client, "infra" | "pagamentos">>) => string;
  updateClient: (id: string, patch: Partial<Client>) => void;
  removeClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
  togglePayment: (clientId: string, paymentId: string) => void;
  addPayment: (clientId: string, payment: Omit<Payment, "id">) => void;
  removePayment: (clientId: string, paymentId: string) => void;
  addProject: (p: Omit<Project, "id" | "fluxo" | "custos" | "stageKey"> & Partial<Pick<Project, "fluxo" | "custos" | "stageKey">>) => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  toggleChecklist: (projectId: string, stageKey: string, itemId: string) => void;
  setProjectStage: (projectId: string, stageKey: string) => void;
  addCost: (projectId: string, cost: Omit<ProjectCost, "id">) => void;
  removeCost: (projectId: string, costId: string) => void;
  resetData: () => void;
  metrics: Metrics;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(SEED_CLIENTS);
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [mode, setMode] = useState<Mode>("loading");

  const lastClients = useRef<Record<string, string>>({});
  const lastProjects = useRef<Record<string, string>>({});

  // --- Carregamento: tenta Supabase; senão, localStorage ---
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/data");
        if (res.ok) {
          const json = await res.json();
          if (json.configured && !json.error) {
            if (!active) return;
            const cs: Client[] = json.clients ?? [];
            const ps: Project[] = json.projects ?? [];
            setClients(cs);
            setProjects(ps);
            lastClients.current = indexRecords(cs);
            lastProjects.current = indexRecords(ps);
            setMode("supabase");
            return;
          }
        }
      } catch {
        /* cai no modo local */
      }
      // fallback local
      try {
        const rawC = localStorage.getItem(STORAGE_KEY);
        if (rawC) setClients(JSON.parse(rawC));
        const rawP = localStorage.getItem(PROJECTS_KEY);
        if (rawP) setProjects(JSON.parse(rawP));
      } catch {
        /* storage indisponível */
      }
      if (active) setMode("local");
    })();
    return () => {
      active = false;
    };
  }, []);

  // --- Persistência local ---
  useEffect(() => {
    if (mode !== "local") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch {}
  }, [clients, mode]);

  useEffect(() => {
    if (mode !== "local") return;
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch {}
  }, [projects, mode]);

  // --- Sincronização Supabase (só o que mudou) ---
  useEffect(() => {
    if (mode !== "supabase") return;
    const cur = indexRecords(clients);
    const upserts = clients.filter((c) => lastClients.current[c.id] !== cur[c.id]);
    const deletes = Object.keys(lastClients.current).filter((id) => !(id in cur));
    lastClients.current = cur;
    if (upserts.length || deletes.length) void syncTable("clients", upserts, deletes);
  }, [clients, mode]);

  useEffect(() => {
    if (mode !== "supabase") return;
    const cur = indexRecords(projects);
    const upserts = projects.filter((p) => lastProjects.current[p.id] !== cur[p.id]);
    const deletes = Object.keys(lastProjects.current).filter((id) => !(id in cur));
    lastProjects.current = cur;
    if (upserts.length || deletes.length) void syncTable("projects", upserts, deletes);
  }, [projects, mode]);

  const addClient: StoreValue["addClient"] = useCallback((c) => {
    const id = uid("cli");
    setClients((prev) => [{ infra: {}, pagamentos: [], ...c, id }, ...prev]);
    return id;
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const removeClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getClient = useCallback((id: string) => clients.find((c) => c.id === id), [clients]);

  const togglePayment = useCallback((clientId: string, paymentId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          pagamentos: c.pagamentos.map((p) => {
            if (p.id !== paymentId) return p;
            const pago = p.status === "pago";
            const overdue = (daysUntil(p.vencimento) ?? 0) < 0;
            return pago
              ? { ...p, status: overdue ? "atrasado" : "pendente", pagoEm: undefined }
              : { ...p, status: "pago", pagoEm: new Date().toISOString().slice(0, 10) };
          }),
        };
      }),
    );
  }, []);

  const addPayment = useCallback((clientId: string, payment: Omit<Payment, "id">) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, pagamentos: [...c.pagamentos, { ...payment, id: uid("p") }] }
          : c,
      ),
    );
  }, []);

  const removePayment = useCallback((clientId: string, paymentId: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, pagamentos: c.pagamentos.filter((p) => p.id !== paymentId) }
          : c,
      ),
    );
  }, []);

  const addProject: StoreValue["addProject"] = useCallback((p) => {
    const id = uid("proj");
    const fluxo = p.fluxo ?? buildFlow(p.tipo);
    const stageKey = p.stageKey ?? fluxo[0]?.key ?? "";
    setProjects((prev) => [{ custos: [], ...p, id, fluxo, stageKey }, ...prev]);
    return id;
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProject = useCallback((id: string) => projects.find((p) => p.id === id), [projects]);

  const toggleChecklist = useCallback(
    (projectId: string, stageKey: string, itemId: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            fluxo: p.fluxo.map((b) =>
              b.key !== stageKey
                ? b
                : {
                    ...b,
                    itens: b.itens.map((it) =>
                      it.id === itemId ? { ...it, done: !it.done } : it,
                    ),
                  },
            ),
          };
        }),
      );
    },
    [],
  );

  const setProjectStage = useCallback((projectId: string, stageKey: string) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, stageKey } : p)));
  }, []);

  const addCost = useCallback((projectId: string, cost: Omit<ProjectCost, "id">) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, custos: [...p.custos, { ...cost, id: uid("cost") }] } : p,
      ),
    );
  }, []);

  const removeCost = useCallback((projectId: string, costId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, custos: p.custos.filter((c) => c.id !== costId) } : p,
      ),
    );
  }, []);

  const resetData = useCallback(() => {
    setClients(SEED_CLIENTS);
    setProjects(SEED_PROJECTS);
  }, []);

  const metrics = useMemo<Metrics>(() => {
    const ativos = clients.filter(
      (c) => c.status === "ativo" || c.status === "pendente" || c.status === "inadimplente",
    );
    const mrr = ativos.reduce((sum, c) => sum + (c.manutencao || 0), 0);
    const receitaContratadaAno =
      ativos.reduce((sum, c) => sum + (c.valorPlano || 0), 0) + mrr * 12;

    let aReceber = 0;
    let atrasado = 0;
    for (const c of clients) {
      for (const p of c.pagamentos) {
        if (p.status === "pendente") aReceber += p.valor;
        if (p.status === "atrasado") atrasado += p.valor;
      }
    }

    const near = (d: number | null) => d !== null && d <= 30;
    const infraVencendo = clients.filter(
      (c) => near(daysUntil(c.infra.dominioVence)) || near(daysUntil(c.infra.hospedagemVence)),
    ).length;

    const custoInfraAno = clients.reduce(
      (s, c) => s + (c.infra.dominioCusto || 0) + (c.infra.hospedagemCusto || 0),
      0,
    );

    const totalClientes = ativos.length;

    return {
      mrr,
      receitaContratadaAno,
      aReceber,
      atrasado,
      ativos: clients.filter((c) => c.status === "ativo").length,
      leads: clients.filter((c) => c.status === "lead").length,
      inadimplentes: clients.filter((c) => c.status === "inadimplente").length,
      totalClientes,
      infraVencendo,
      ticketMedio: totalClientes ? Math.round(receitaContratadaAno / totalClientes) : 0,
      custoInfraAno,
      lucroAno: receitaContratadaAno - custoInfraAno,
    };
  }, [clients]);

  const value: StoreValue = {
    clients,
    projects,
    hydrated: mode !== "loading",
    mode,
    addClient,
    updateClient,
    removeClient,
    getClient,
    togglePayment,
    addPayment,
    removePayment,
    addProject,
    updateProject,
    removeProject,
    getProject,
    toggleChecklist,
    setProjectStage,
    addCost,
    removeCost,
    resetData,
    metrics,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de <StoreProvider>");
  return ctx;
}
