import type { Client } from "./types";
import { formatCurrency, formatDate } from "./format";

const HOJE = () =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(),
  );

/** Dados do prestador (você). Ajuste em um só lugar. */
export const PRESTADOR = {
  nome: "Studio de Sites",
  documento: "(seu CNPJ/CPF)",
  cidade: "Brasília/DF",
};

function planoDescricao(c: Client): string {
  if (!c.plano) return "a combinar";
  const base =
    c.plano === "anual"
      ? `${formatCurrency(c.valorPlano ?? 1100)} por ano`
      : `${formatCurrency(c.valorPlano ?? 550)} por semestre`;
  const manut =
    c.manutencao > 0 ? ` + ${formatCurrency(c.manutencao)} por mês de manutenção` : "";
  return base + manut;
}

export interface ContractDoc {
  titulo: string;
  html: string;
}

/**
 * Modelo BASE de contrato de prestação de serviços de criação e manutenção de
 * site. Revise com um advogado antes de usar em produção. Preparado para ser
 * impresso em PDF e assinado digitalmente via gov.br (assinador oficial).
 */
export function buildContract(c: Client): ContractDoc {
  const titulo = `Contrato · ${c.nome}`;
  const contratante = c.nome;
  const doc = c.documento || "____________________";
  const inicio = c.inicio ? formatDate(c.inicio) : "____/____/______";

  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" />
<title>${titulo}</title>
<style>
  @page { size: A4; margin: 22mm 20mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color:#111; line-height:1.6; font-size:12pt; }
  h1 { font-size:15pt; text-align:center; margin:0 0 4px; }
  h2 { font-size:12pt; margin:20px 0 6px; }
  .sub { text-align:center; color:#555; font-size:10pt; margin-bottom:24px; }
  p { margin:8px 0; text-align:justify; }
  .parties { background:#f5f5f5; border:1px solid #ddd; border-radius:8px; padding:12px 16px; font-size:11pt; }
  .sign { margin-top:60px; display:flex; justify-content:space-between; gap:40px; }
  .sign div { flex:1; text-align:center; border-top:1px solid #333; padding-top:6px; font-size:10pt; }
  .note { margin-top:28px; padding:10px 14px; background:#eef6ff; border:1px solid #cfe4ff; border-radius:8px; font-size:9.5pt; color:#22405f; }
  ol { padding-left:18px; }
  @media print { .note { display:none; } }
</style></head>
<body>
  <h1>Contrato de Prestação de Serviços</h1>
  <div class="sub">Criação e manutenção de website</div>

  <div class="parties">
    <p><strong>CONTRATADA:</strong> ${PRESTADOR.nome}, inscrita sob ${PRESTADOR.documento}, sediada em ${PRESTADOR.cidade}.</p>
    <p><strong>CONTRATANTE:</strong> ${contratante}, inscrito(a) sob o documento ${doc}${c.regiao ? `, situado(a) em ${c.regiao}` : ""}.</p>
  </div>

  <h2>1. Objeto</h2>
  <p>A CONTRATADA prestará à CONTRATANTE os serviços de <strong>criação, publicação e manutenção de um website</strong>, incluindo desenvolvimento das páginas, configuração de domínio e hospedagem, ajustes de conteúdo e suporte técnico, conforme as condições deste contrato.</p>

  <h2>2. Valores e forma de pagamento</h2>
  <p>Pela prestação dos serviços, a CONTRATANTE pagará à CONTRATADA o valor de <strong>${planoDescricao(c)}</strong>. A manutenção mensal abrange pequenas alterações de conteúdo, monitoramento e a renovação de domínio e hospedagem enquanto vigente o contrato.</p>

  <h2>3. Domínio e hospedagem</h2>
  <p>O domínio e a hospedagem serão registrados e mantidos pela CONTRATADA durante a vigência. Em caso de encerramento, a CONTRATADA compromete-se a transferir o domínio à CONTRATANTE, mediante quitação de eventuais pendências.</p>

  <h2>4. Prazo</h2>
  <p>Este contrato tem início em <strong>${inicio}</strong> e vigência conforme o plano contratado, renovando-se automaticamente por igual período caso não haja manifestação em contrário com 30 dias de antecedência.</p>

  <h2>5. Obrigações da CONTRATANTE</h2>
  <p>Fornecer textos, imagens e informações necessárias; efetuar os pagamentos nas datas acordadas; e responder às solicitações de aprovação em tempo hábil.</p>

  <h2>6. Rescisão</h2>
  <p>Qualquer das partes poderá rescindir mediante aviso prévio de 30 dias. Valores referentes a serviços já prestados não serão reembolsados.</p>

  <h2>7. Foro</h2>
  <p>Fica eleito o foro da comarca de ${PRESTADOR.cidade} para dirimir eventuais controvérsias.</p>

  <p style="margin-top:24px">${PRESTADOR.cidade}, ${HOJE()}.</p>

  <div class="sign">
    <div>${PRESTADOR.nome}<br/>CONTRATADA</div>
    <div>${contratante}<br/>CONTRATANTE</div>
  </div>

  <div class="note">
    <strong>Como assinar:</strong> use "Imprimir → Salvar como PDF", envie o arquivo ao cliente e assinem digitalmente pelo <strong>gov.br</strong> (assinador oficial em assinador.iti.br). Depois, anexe o link do PDF assinado no cadastro do cliente. Este é um modelo base — revise com um advogado.
  </div>
</body></html>`;

  return { titulo, html };
}
