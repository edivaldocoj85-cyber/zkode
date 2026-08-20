const Anthropic = require('@anthropic-ai/sdk');
const { checkRateLimit } = require('./lib/rateLimit');

const MODEL = 'claude-opus-5';
const MAX_TURNS = 16; // cap on messages accepted per request (client also trims)
const MAX_MESSAGE_LENGTH = 2000;
// Each request can trigger one or two paid API calls, so this stays tight:
// generous enough for a real conversation, tight enough to cap runaway cost.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// Backend próprio de leads (Windows/IIS + SQLite). O Netlify Forms
// (chat-lead) continua ativo como rede de segurança: se este endereço
// estiver fora do ar, o lead ainda chega por e-mail via Netlify Forms.
// TODO: hoje aponta pra um túnel Cloudflare de teste (muda a cada
// reinício do servidor) — trocar pelo hostname permanente assim que o
// túnel nomeado estiver configurado com o domínio de vocês.
const LEADS_BACKEND_URL = 'https://funky-looks-dictionary-experiencing.trycloudflare.com';

const SYSTEM_PROMPT = `Você é o assistente virtual da Zkode (zkode.com.br), uma empresa brasileira de desenvolvimento de sites, automações com IA e sistemas sob medida, com gestão de projetos, custos e propostas em um painel próprio.

## Seu objetivo
Conversar com visitantes do site, entender o que precisam, responder dúvidas sobre os serviços e, quando fizer sentido, qualificar o interesse e registrar o contato do visitante como um lead — sem ser insistente.

## Sobre a Zkode (use estas informações reais; não invente preços ou prazos diferentes)
- **Sites e landing pages** — a partir de R$ 1.990. Inclui site institucional ou landing de alta conversão, SEO técnico, domínio e hospedagem no 1º ano, 2 propostas de front-end para escolher, entrega em 10–15 dias úteis.
- **Automações e IA** — a partir de R$ 497/mês + setup (setup a partir de R$ 1.500, sem fidelidade). Inclui chatbot com IA no WhatsApp e no site, integrações com CRM/ERP/planilhas/e-mail, fluxos automáticos (cobrança, agendamento, leads), monitoramento 24/7.
- **Sistemas sob medida** — a partir de R$ 12.900. Sistema web completo com login, painéis e relatórios; ERP/CRM sob medida, e-commerce, apps e APIs; suporte de 90 dias + SLA.
- **Como funciona**: 1) briefing e orçamento em até 48h, sem compromisso; 2) o cliente recebe propostas de front-end no portal protegido; 3) desenvolvimento em sprints com entregas semanais; 4) publicação e suporte.
- Todo cliente acompanha o projeto em um painel próprio (zkode.com.br/painel): custos, prazos, financeiro e propostas — protótipos só abrem dentro da plataforma, com marca-d'água e download bloqueado.
- Contato oficial: edivaldocojme@gmail.com. Sede em São Paulo/SP.

## Como se comportar
- Responda sempre em português do Brasil, em tom acolhedor, direto e profissional — nada de emojis em excesso nem linguagem robótica.
- Respostas curtas (2–4 frases). Isto é um chat, não um e-mail.
- Se a pergunta não tiver relação com a Zkode ou seus serviços, redirecione com gentileza para o que você pode ajudar.
- Nunca invente prazos, preços ou funcionalidades que não estão listados acima. Se não souber algo específico, diga que o time confirma isso no orçamento.
- Quando o visitante demonstrar interesse real (quer orçamento, quer ser contatado, pergunta "quanto custa pro meu caso" etc.), pergunte o nome e um contato (WhatsApp ou e-mail) — um de cada vez, sem parecer um formulário.
- Assim que tiver nome E contato, e o visitante confirmar que quer ser contatado, use a ferramenta \`salvar_lead\` para registrar isso. Use a ferramenta no máximo uma vez por conversa. Nunca invente nome ou contato — só use dados que o próprio visitante forneceu no chat.
- Depois de salvar o lead, confirme que o time vai entrar em contato em até 48h e pode sugerir o WhatsApp como alternativa mais rápida.`;

const TOOLS = [
  {
    name: 'salvar_lead',
    description:
      "Registra o contato de um visitante do site como um lead de orçamento. Use apenas depois que o visitante tiver fornecido nome e um contato (WhatsApp ou e-mail) e confirmado que quer ser contatado. Nunca invente valores — use exatamente o que o visitante escreveu no chat. No máximo uma chamada por conversa.",
    input_schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', description: 'Nome informado pelo visitante.' },
        contato: { type: 'string', description: 'WhatsApp ou e-mail informado pelo visitante.' },
        interesse: {
          type: 'string',
          description:
            'Resumo curto (poucas palavras) do que o visitante precisa, ex: "site institucional", "automação de atendimento no WhatsApp", "sistema de gestão sob medida".',
        },
      },
      required: ['nome', 'contato'],
    },
  },
];

function isValidMessage(m) {
  return (
    m &&
    (m.role === 'user' || m.role === 'assistant') &&
    typeof m.content === 'string' &&
    m.content.length > 0 &&
    m.content.length <= MAX_MESSAGE_LENGTH
  );
}

async function saveLead(input, siteOrigin) {
  const nome = String(input.nome || '').slice(0, 200);
  const contato = String(input.contato || '').slice(0, 200);
  const interesse = String(input.interesse || '').slice(0, 300);
  const isEmail = contato.indexOf('@') !== -1;

  const netlifyBody = new URLSearchParams({
    'form-name': 'chat-lead',
    nome,
    contato,
    interesse,
  }).toString();

  const netlifyOk = fetch(siteOrigin + '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: netlifyBody,
  }).then((res) => res.ok).catch(() => false);

  const backendOk = fetch(LEADS_BACKEND_URL + '/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome,
      email: isEmail ? contato : '',
      whatsapp: isEmail ? '' : contato,
      mensagem: interesse,
      origem: 'chat',
    }),
  }).then((res) => res.ok).catch(() => false);

  const [a, b] = await Promise.all([netlifyOk, backendOk]);
  return a || b;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method_not_allowed' }) };
  }

  const apiKey = process.env.ZKODE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'server_not_configured' }) };
  }

  const rateLimit = await checkRateLimit(event, 'chat', RATE_LIMIT, RATE_WINDOW_MS);
  if (!rateLimit.allowed) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateLimit.retryAfterSeconds) },
      body: JSON.stringify({ error: 'rate_limited', retryAfterSeconds: rateLimit.retryAfterSeconds }),
    };
  }

  let messages;
  try {
    const body = JSON.parse(event.body || '{}');
    messages = Array.isArray(body.messages) ? body.messages : null;
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid_body' }) };
  }

  if (!messages || messages.length === 0 || messages.length > MAX_TURNS || !messages.every(isValidMessage)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid_messages' }) };
  }
  // First message must be from the visitor.
  if (messages[0].role !== 'user') {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid_messages' }) };
  }

  const client = new Anthropic({ apiKey });
  const host = event.headers['x-forwarded-host'] || event.headers.host;
  const siteOrigin = 'https://' + host;

  try {
    let conversation = messages.map((m) => ({ role: m.role, content: m.content }));

    let response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      output_config: { effort: 'low' },
      messages: conversation,
    });

    // At most one tool round-trip: execute salvar_lead if requested, then ask
    // Claude for the final reply to show the visitor.
    if (response.stop_reason === 'tool_use') {
      const toolUse = response.content.find((b) => b.type === 'tool_use');
      let toolResultText = 'Não foi possível salvar o contato agora. Peça para o visitante tentar novamente ou usar o formulário de orçamento.';

      if (toolUse && toolUse.name === 'salvar_lead') {
        try {
          const ok = await saveLead(toolUse.input || {}, siteOrigin);
          toolResultText = ok ? 'Lead salvo com sucesso.' : 'Falha ao salvar o lead.';
        } catch (err) {
          toolResultText = 'Erro ao salvar o lead.';
        }
      }

      conversation = conversation.concat([
        { role: 'assistant', content: response.content },
        {
          role: 'user',
          content: toolUse
            ? [{ type: 'tool_result', tool_use_id: toolUse.id, content: toolResultText }]
            : toolResultText,
        },
      ]);

      response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        output_config: { effort: 'low' },
        messages: conversation,
      });
    }

    const textBlock = response.content.find((b) => b.type === 'text');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: textBlock ? textBlock.text : 'Desculpe, não consegui responder agora.' }),
    };
  } catch (err) {
    console.error('chat function error:', err);
    return { statusCode: 502, body: JSON.stringify({ error: 'upstream_error' }) };
  }
};
