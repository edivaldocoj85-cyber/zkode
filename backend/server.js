const express = require('express');
const db = require('./lib/db');
const { requireApiKey } = require('./lib/auth');
const { checkRateLimit } = require('./lib/rateLimit');

const app = express();
app.use(express.json({ limit: '20kb' }));

// CORS: only the real site and Netlify deploy previews may call the public
// endpoint from a browser. Protected endpoints (painel) also go through
// this, but they're gated by the API key regardless of origin.
const ALLOWED_ORIGINS = new Set(['https://zkode.com.br', 'https://www.zkode.com.br']);
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    return new URL(origin).hostname.endsWith('.netlify.app');
  } catch (err) {
    return false;
  }
}

app.use((req, res, next) => {
  const origin = req.get('Origin');
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

const VALID_STATUSES = ['Novo', 'Em contato', 'Proposta enviada', 'Fechado', 'Perdido'];
const MAX_FIELD_LENGTH = 500;

function clientIp(req) {
  // cf-connecting-ip is set by Cloudflare Tunnel once that's in front of this.
  const raw = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  return String(raw).split(',')[0].trim();
}

function sanitize(value) {
  return typeof value === 'string' ? value.slice(0, MAX_FIELD_LENGTH).trim() : '';
}

// Público — recebe leads do formulário de orçamento e do chat do site.
app.post('/api/leads', (req, res) => {
  const rl = checkRateLimit(clientIp(req), 30, 10 * 60 * 1000);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSeconds));
    res.status(429).json({ error: 'rate_limited', retryAfterSeconds: rl.retryAfterSeconds });
    return;
  }

  const body = req.body || {};
  const nome = sanitize(body.nome);
  const email = sanitize(body.email);
  const whatsapp = sanitize(body.whatsapp || body.contato);
  if (!nome || (!email && !whatsapp)) {
    res.status(400).json({ error: 'invalid_lead', message: 'nome e (email ou whatsapp) sao obrigatorios' });
    return;
  }

  const lead = {
    nome,
    empresa: sanitize(body.empresa),
    email,
    whatsapp,
    servico: sanitize(body.servico),
    investimento: sanitize(body.investimento),
    mensagem: sanitize(body.mensagem || body.interesse),
    origem: sanitize(body.origem) || 'orcamento',
  };

  const info = db
    .prepare(
      `INSERT INTO leads (nome, empresa, email, whatsapp, servico, investimento, mensagem, origem)
       VALUES (@nome, @empresa, @email, @whatsapp, @servico, @investimento, @mensagem, @origem)`
    )
    .run(lead);

  res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

// Protegido (X-API-Key) — lista leads pro painel.
app.get('/api/leads', requireApiKey, (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : null;
  const rows =
    status && VALID_STATUSES.includes(status)
      ? db.prepare('SELECT * FROM leads WHERE status = ? ORDER BY id DESC').all(status)
      : db.prepare('SELECT * FROM leads ORDER BY id DESC').all();
  res.json({ leads: rows });
});

// Protegido (X-API-Key) — atualiza o status de um lead.
app.patch('/api/leads/:id', requireApiKey, (req, res) => {
  const id = Number(req.params.id);
  const status = req.body && req.body.status;
  if (!Number.isInteger(id) || !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: 'invalid_request' });
    return;
  }
  const info = db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  res.json({ ok: true });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Under iisnode, process.env.PORT is set to a named pipe path by IIS itself;
// app.listen() accepts that transparently. The numeric fallback is only for
// running "npm start" directly on this machine outside of IIS, for testing.
const port = process.env.PORT || 3978;
app.listen(port, () => {
  console.log('zkode-backend listening on ' + port);
});

module.exports = app;
