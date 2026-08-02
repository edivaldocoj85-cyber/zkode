"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField, TextAreaField } from "@/components/ui/Field";
import { useUI } from "@/lib/ui-context";
import { useStore } from "@/lib/store";
import type { Client, ClientStatus, ContractStatus, PlanType } from "@/lib/types";

type FormState = {
  nome: string;
  segmento: string;
  regiao: string;
  whatsapp: string;
  instagram: string;
  email: string;
  documento: string;
  status: ClientStatus;
  plano: "" | PlanType;
  valorPlano: string;
  manutencao: string;
  contrato: ContractStatus;
  inicio: string;
  dominio: string;
  registrador: string;
  dominioVence: string;
  dominioCusto: string;
  hospedagem: string;
  hospedagemVence: string;
  hospedagemCusto: string;
  observacoes: string;
};

const EMPTY: FormState = {
  nome: "",
  segmento: "",
  regiao: "",
  whatsapp: "",
  instagram: "",
  email: "",
  documento: "",
  status: "lead",
  plano: "",
  valorPlano: "",
  manutencao: "50",
  contrato: "nenhum",
  inicio: "",
  dominio: "",
  registrador: "",
  dominioVence: "",
  dominioCusto: "",
  hospedagem: "",
  hospedagemVence: "",
  hospedagemCusto: "",
  observacoes: "",
};

function fromClient(c: Client): FormState {
  return {
    nome: c.nome,
    segmento: c.segmento,
    regiao: c.regiao,
    whatsapp: c.whatsapp ?? "",
    instagram: c.instagram ?? "",
    email: c.email ?? "",
    documento: c.documento ?? "",
    status: c.status,
    plano: c.plano ?? "",
    valorPlano: c.valorPlano?.toString() ?? "",
    manutencao: c.manutencao?.toString() ?? "0",
    contrato: c.contrato,
    inicio: c.inicio ?? "",
    dominio: c.infra.dominio ?? "",
    registrador: c.infra.registrador ?? "",
    dominioVence: c.infra.dominioVence ?? "",
    dominioCusto: c.infra.dominioCusto?.toString() ?? "",
    hospedagem: c.infra.hospedagem ?? "",
    hospedagemVence: c.infra.hospedagemVence ?? "",
    hospedagemCusto: c.infra.hospedagemCusto?.toString() ?? "",
    observacoes: c.observacoes ?? "",
  };
}

export function ClientFormModal() {
  const { formOpen, editingId, closeForm } = useUI();
  const { getClient, addClient, updateClient } = useStore();
  const [form, setForm] = useState<FormState>(EMPTY);

  const editing = editingId ? getClient(editingId) : undefined;

  useEffect(() => {
    if (!formOpen) return;
    setForm(editing ? fromClient(editing) : EMPTY);
  }, [formOpen, editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onPlanChange(plano: FormState["plano"]) {
    setForm((f) => ({
      ...f,
      plano,
      valorPlano:
        plano === "anual" ? "1100" : plano === "semestral" ? "550" : "",
    }));
  }

  function save() {
    if (!form.nome.trim()) return;
    const payload = {
      nome: form.nome.trim(),
      segmento: form.segmento.trim() || "—",
      regiao: form.regiao.trim() || "—",
      whatsapp: form.whatsapp.trim() || undefined,
      instagram: form.instagram.trim() || undefined,
      email: form.email.trim() || undefined,
      documento: form.documento.trim() || undefined,
      status: form.status,
      plano: form.plano || undefined,
      valorPlano: form.valorPlano ? Number(form.valorPlano) : undefined,
      manutencao: form.manutencao ? Number(form.manutencao) : 0,
      contrato: form.contrato,
      inicio: form.inicio || undefined,
      infra: {
        dominio: form.dominio.trim() || undefined,
        registrador: form.registrador.trim() || undefined,
        dominioVence: form.dominioVence || undefined,
        dominioCusto: form.dominioCusto ? Number(form.dominioCusto) : undefined,
        hospedagem: form.hospedagem.trim() || undefined,
        hospedagemVence: form.hospedagemVence || undefined,
        hospedagemCusto: form.hospedagemCusto ? Number(form.hospedagemCusto) : undefined,
      },
      observacoes: form.observacoes.trim() || undefined,
    };

    if (editingId && editing) {
      updateClient(editingId, payload);
    } else {
      addClient(payload);
    }
    closeForm();
  }

  return (
    <Modal
      open={formOpen}
      onClose={closeForm}
      title={editing ? "Editar cliente" : "Novo cliente"}
      description={
        editing
          ? "Atualize os dados, plano e infraestrutura."
          : "Cadastre um lead ou cliente. Só o nome é obrigatório."
      }
      footer={
        <>
          <Button variant="ghost" onClick={closeForm}>
            Cancelar
          </Button>
          <Button onClick={save} disabled={!form.nome.trim()}>
            {editing ? "Salvar alterações" : "Adicionar cliente"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="space-y-4">
          <SectionTitle>Dados</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label="Nome do negócio"
              id="nome"
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Ex.: Barbearia do João"
              autoFocus
            />
            <TextField
              label="Segmento"
              id="segmento"
              value={form.segmento}
              onChange={(e) => set("segmento", e.target.value)}
              placeholder="Barbearia, clínica, restaurante…"
            />
            <TextField
              label="Região"
              id="regiao"
              value={form.regiao}
              onChange={(e) => set("regiao", e.target.value)}
              placeholder="Asa Sul, Taguatinga…"
            />
            <SelectField
              label="Status"
              id="status"
              value={form.status}
              onChange={(e) => set("status", e.target.value as ClientStatus)}
            >
              <option value="lead">Lead</option>
              <option value="ativo">Ativo</option>
              <option value="pendente">Pendente</option>
              <option value="inadimplente">Inadimplente</option>
            </SelectField>
            <TextField
              label="WhatsApp"
              id="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder="(61) 99999-9999"
            />
            <TextField
              label="Instagram"
              id="instagram"
              value={form.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              placeholder="@perfil"
            />
            <TextField
              label="E-mail"
              hint="opcional"
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="contato@empresa.com.br"
            />
            <TextField
              label="CPF / CNPJ"
              hint="usado no contrato"
              id="documento"
              value={form.documento}
              onChange={(e) => set("documento", e.target.value)}
              placeholder="00.000.000/0001-00"
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Plano & contrato</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Plano"
              id="plano"
              value={form.plano}
              onChange={(e) => onPlanChange(e.target.value as FormState["plano"])}
            >
              <option value="">Sem plano (lead)</option>
              <option value="anual">Anual · R$ 1.100</option>
              <option value="semestral">Semestral · R$ 550</option>
            </SelectField>
            <TextField
              label="Valor do plano (R$)"
              id="valorPlano"
              type="number"
              inputMode="numeric"
              value={form.valorPlano}
              onChange={(e) => set("valorPlano", e.target.value)}
              placeholder="1100"
            />
            <TextField
              label="Manutenção mensal (R$)"
              id="manutencao"
              type="number"
              inputMode="numeric"
              value={form.manutencao}
              onChange={(e) => set("manutencao", e.target.value)}
              placeholder="50"
            />
            <SelectField
              label="Contrato"
              id="contrato"
              value={form.contrato}
              onChange={(e) => set("contrato", e.target.value as ContractStatus)}
            >
              <option value="nenhum">Sem contrato</option>
              <option value="rascunho">Rascunho</option>
              <option value="enviado">Enviado p/ assinar</option>
              <option value="pendente_anexo">Pendente de anexo</option>
              <option value="assinado">Assinado</option>
            </SelectField>
            <TextField
              label="Início do contrato"
              id="inicio"
              type="date"
              value={form.inicio}
              onChange={(e) => set("inicio", e.target.value)}
              className="sm:col-span-2"
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Infraestrutura</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label="Domínio"
              id="dominio"
              value={form.dominio}
              onChange={(e) => set("dominio", e.target.value)}
              placeholder="empresa.com.br"
            />
            <TextField
              label="Registrador"
              id="registrador"
              value={form.registrador}
              onChange={(e) => set("registrador", e.target.value)}
              placeholder="Registro.br, Hostinger…"
            />
            <TextField
              label="Domínio vence em"
              id="dominioVence"
              type="date"
              value={form.dominioVence}
              onChange={(e) => set("dominioVence", e.target.value)}
            />
            <TextField
              label="Custo do domínio (R$/ano)"
              hint="quanto você paga"
              id="dominioCusto"
              type="number"
              inputMode="numeric"
              value={form.dominioCusto}
              onChange={(e) => set("dominioCusto", e.target.value)}
              placeholder="40"
            />
            <TextField
              label="Hospedagem"
              id="hospedagem"
              value={form.hospedagem}
              onChange={(e) => set("hospedagem", e.target.value)}
              placeholder="Vercel, Hostinger…"
            />
            <TextField
              label="Hospedagem vence em"
              id="hospedagemVence"
              type="date"
              value={form.hospedagemVence}
              onChange={(e) => set("hospedagemVence", e.target.value)}
            />
            <TextField
              label="Custo da hospedagem (R$/ano)"
              hint="quanto você paga"
              id="hospedagemCusto"
              type="number"
              inputMode="numeric"
              value={form.hospedagemCusto}
              onChange={(e) => set("hospedagemCusto", e.target.value)}
              placeholder="0"
              className="sm:col-span-2"
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle>Observações</SectionTitle>
          <TextAreaField
            label="Notas internas"
            id="observacoes"
            value={form.observacoes}
            onChange={(e) => set("observacoes", e.target.value)}
            placeholder="Ângulo de venda, histórico, combinados…"
          />
        </section>
      </div>
    </Modal>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
      <span className="h-px w-4 bg-accent/50" />
      {children}
    </h3>
  );
}
