const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// SQLite file lives outside the served/public surface of the app — web.config
// hides the "data" segment from direct HTTP requests, so this never becomes
// downloadable by visiting a URL. Backup = copy this one file.
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'leads.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    empresa TEXT,
    email TEXT,
    whatsapp TEXT,
    servico TEXT,
    investimento TEXT,
    mensagem TEXT,
    origem TEXT NOT NULL DEFAULT 'orcamento',
    status TEXT NOT NULL DEFAULT 'Novo',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

module.exports = db;
