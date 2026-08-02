"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField, TextAreaField } from "@/components/ui/Field";
import { useUI } from "@/lib/ui-context";
import { useStore } from "@/lib/store";
import { buildFlow } from "@/lib/project-seed";
import { PROJECT_TYPE_LABEL, type Project, type ProjectType } from "@/lib/types";

type FormState = {
  nome: string;
  tipo: ProjectType;
  cliente: string;
  descricao: string;
  devs: string;
  repoUrl: string;
  valor: string;
  inicio: string;
  entregaPrevista: string;
};

const EMPTY: FormState = {
  nome: "",
  tipo: "site",
  cliente: "",
  descricao: "",
  devs: "",
  repoUrl: "",
  valor: "",
  inicio: "",
  entregaPrevista: "",
};

function fromProject(p: Project): FormState {
  return {
    nome: p.nome,
    tipo: p.tipo,
    cliente: p.cliente ?? "",
    descricao: p.descricao ?? "",
    devs: p.devs.join(", "),
    repoUrl: p.repoUrl ?? "",
    valor: p.valor?.toString() ?? "",
    inicio: p.inicio ?? "",
    entregaPrevista: p.entregaPrevista ?? "",
  };
}

export function ProjectFormModal() {
  const { projectFormOpen, editingProjectId, closeProjectForm } = useUI();
  const { getProject, addProject, updateProject } = useStore();
  const [form, setForm] = useState<FormState>(EMPTY);

  const editing = editingProjectId ? getProject(editingProjectId) : undefined;

  useEffect(() => {
    if (!projectFormOpen) return;
    setForm(editing ? fromProject(editing) : EMPTY);
  }, [projectFormOpen, editingProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    if (!form.nome.trim()) return;
    const devs = form.devs
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const base = {
      nome: form.nome.trim(),
      tipo: form.tipo,
      cliente: form.cliente.trim() || undefined,
      descricao: form.descricao.trim() || undefined,
      devs,
      repoUrl: form.repoUrl.trim() || undefined,
      valor: form.valor ? Number(form.valor) : undefined,
      inicio: form.inicio || undefined,
      entregaPrevista: form.entregaPrevista || undefined,
    };

    if (editingProjectId && editing) {
      const patch: Partial<Project> = { ...base };
      // Se mudou o tipo, troca o fluxo (reinicia o passo a passo)
      if (editing.tipo !== form.tipo) {
        const fluxo = buildFlow(form.tipo);
        patch.fluxo = fluxo;
        patch.stageKey = fluxo[0]?.key ?? "";
      }
      updateProject(editingProjectId, patch);
    } else {
      addProject(base);
    }
    closeProjectForm();
  }

  return (
    <Modal
      open={projectFormOpen}
      onClose={closeProjectForm}
      title={editing ? "Editar projeto" : "Novo projeto"}
      description="Site (fluxo enxuto) ou Sistema (fluxo completo). O passo a passo é montado automaticamente."
      footer={
        <>
          <Button variant="ghost" onClick={closeProjectForm}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={!form.nome.trim()}>
            {editing ? "Salvar alterações" : "Criar projeto"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Tipo */}
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted">Tipo de projeto</p>
          <div className="grid grid-cols-2 gap-3">
            {(["site", "sistema"] as ProjectType[]).map((t) => {
              const active = form.tipo === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("tipo", t)}
                  className={
                    "rounded-xl border px-4 py-3 text-left transition-colors " +
                    (active
                      ? "border-accent/50 bg-accent/10"
                      : "border-border hover:bg-fg/[0.04]")
                  }
                >
                  <p className={"text-sm font-semibold " + (active ? "text-accent" : "text-fg")}>
                    {PROJECT_TYPE_LABEL[t]}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {t === "site" ? "Fluxo enxuto (5 etapas)" : "Fluxo completo (6 etapas)"}
                  </p>
                </button>
              );
            })}
          </div>
          {editing && editing.tipo !== form.tipo && (
            <p className="mt-2 text-xs text-[var(--warning)]">
              Mudar o tipo reinicia o passo a passo deste projeto.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Nome do projeto"
            id="p-nome"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            placeholder={form.tipo === "site" ? "Site institucional" : "App de Agendamento"}
            autoFocus
          />
          <TextField
            label="Cliente"
            hint="opcional"
            id="p-cliente"
            value={form.cliente}
            onChange={(e) => set("cliente", e.target.value)}
            placeholder="Nome do cliente"
          />
          <TextField
            label="Valor cobrado (R$)"
            id="p-valor"
            type="number"
            inputMode="numeric"
            value={form.valor}
            onChange={(e) => set("valor", e.target.value)}
            placeholder={form.tipo === "site" ? "1100" : "6800"}
          />
          <TextField
            label="Devs"
            hint="separados por vírgula"
            id="p-devs"
            value={form.devs}
            onChange={(e) => set("devs", e.target.value)}
            placeholder="Davi, Léo, Ana"
          />
          <TextField
            label="Repositório GitHub"
            id="p-repo"
            type="url"
            value={form.repoUrl}
            onChange={(e) => set("repoUrl", e.target.value)}
            placeholder="https://github.com/…"
            className="sm:col-span-2"
          />
          <TextField
            label="Início"
            id="p-inicio"
            type="date"
            value={form.inicio}
            onChange={(e) => set("inicio", e.target.value)}
          />
          <TextField
            label="Entrega prevista"
            id="p-entrega"
            type="date"
            value={form.entregaPrevista}
            onChange={(e) => set("entregaPrevista", e.target.value)}
          />
          <TextAreaField
            label="Descrição"
            id="p-desc"
            value={form.descricao}
            onChange={(e) => set("descricao", e.target.value)}
            placeholder="O que o projeto resolve, escopo do MVP…"
            className="sm:col-span-2"
          />
        </div>
      </div>
    </Modal>
  );
}
