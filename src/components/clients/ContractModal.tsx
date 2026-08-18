"use client";

import { useMemo, useRef, useState } from "react";
import { Download, Printer, FileSignature, Link2, Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useUI } from "@/lib/ui-context";
import { useStore } from "@/lib/store";
import { buildContract } from "@/lib/contract";
import { ContractBadge } from "./StatusBadges";

export function ContractModal() {
  const { contractClientId, closeContract } = useUI();
  const { getClient, updateClient } = useStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [anexo, setAnexo] = useState("");

  const client = contractClientId ? getClient(contractClientId) : undefined;
  const doc = useMemo(() => (client ? buildContract(client) : null), [client]);

  if (!client || !doc) {
    return <Modal open={false} onClose={closeContract} title="" children={null} />;
  }

  function printContract() {
    iframeRef.current?.contentWindow?.print();
  }

  function download() {
    const blob = new Blob([doc!.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrato-${client!.nome.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const id = client.id;

  return (
    <Modal
      open={Boolean(contractClientId)}
      onClose={closeContract}
      size="lg"
      title={`Contrato · ${client.nome}`}
      description="Modelo preenchido. Imprima em PDF, assine no gov.br e anexe o link."
      footer={
        <>
          <Button variant="ghost" onClick={closeContract}>
            Fechar
          </Button>
          <Button variant="outline" onClick={download}>
            <Download className="size-4" />
            Baixar
          </Button>
          <Button onClick={printContract}>
            <Printer className="size-4" />
            Imprimir / PDF
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Fluxo de assinatura */}
        <div className="rounded-xl border border-border bg-surface-2/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Status do contrato
            </span>
            <ContractBadge contrato={client.contrato} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateClient(id, { contrato: "enviado" })}
            >
              <Send className="size-3.5" />
              Marcar enviado
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateClient(id, { contrato: "pendente_anexo" })}
              className="border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20"
            >
              <FileSignature className="size-3.5" />
              Assinado no gov.br (pendente de anexo)
            </Button>
          </div>

          {/* Anexo */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <input
                value={anexo}
                onChange={(e) => setAnexo(e.target.value)}
                placeholder="Link do PDF assinado (gov.br / Drive)"
                className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-subtle focus:border-accent/50 focus:outline-none"
              />
            </div>
            <Button
              size="sm"
              disabled={!anexo.trim()}
              onClick={() => {
                updateClient(id, {
                  contrato: "assinado",
                  contratoAnexoUrl: anexo.trim(),
                  contratoAssinadoEm: new Date().toISOString().slice(0, 10),
                });
                setAnexo("");
              }}
            >
              Anexar assinado
            </Button>
          </div>

          {client.contratoAnexoUrl && (
            <a
              href={client.contratoAnexoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:brightness-110"
            >
              <Link2 className="size-3.5" />
              Ver contrato assinado
            </a>
          )}
        </div>

        {/* Pré-visualização */}
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <iframe
            ref={iframeRef}
            title="Pré-visualização do contrato"
            srcDoc={doc.html}
            className="h-[50vh] min-h-[360px] w-full sm:h-[55vh]"
          />
        </div>
      </div>
    </Modal>
  );
}
