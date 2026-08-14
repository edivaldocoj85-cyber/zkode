# Zkode — pacote de publicação (zkode.com.br)

## Arquivos
- `index.html` — site institucional (home)
- `login.html` — entrar / criar conta (aceita e-mail de qualquer domínio)
- `painel.html` — painel de gestão (projetos, custos, financeiro, clientes, propostas, gestores)
- `404.html` — página de erro
- `robots.txt`, `sitemap.xml` — SEO (painel marcado como noindex)
- `.htaccess` — cPanel / Apache (Hostgator, Locaweb, KingHost)
- `vercel.json` — Vercel
- `_headers` — Netlify / Cloudflare Pages

## Como publicar

### Hospedagem tradicional (cPanel / FTP)
1. Acesse o Gerenciador de Arquivos ou FTP.
2. Envie **todo o conteúdo desta pasta** para `public_html`.
3. Aponte o domínio zkode.com.br para a hospedagem e ative o SSL (Let's Encrypt).
4. Acesse https://zkode.com.br — a home carrega direto do `index.html`.

### Netlify / Cloudflare Pages
1. Arraste esta pasta na área de deploy (ou conecte o repositório).
2. Build command: nenhum. Publish directory: a própria pasta.
3. Em Domains, adicione zkode.com.br e siga os registros DNS indicados.

### Vercel
1. `vercel deploy` nesta pasta (ou importe o repositório).
2. Adicione o domínio zkode.com.br em Settings → Domains.

## DNS (exemplo)
- `A` @ → IP da hospedagem
- `CNAME` www → zkode.com.br

## Observações
- Páginas são estáticas e autônomas (nada externo a carregar) — funcionam offline.
- O formulário de orçamento (`index.html`) já envia para o Netlify Forms (formulário
  `orcamento`, com honeypot anti-spam). Veja as submissões em Netlify → Forms.
- O login (`login.html` → `painel.html`) é real: valida contra `ZKODE_ADMIN_EMAIL` /
  `ZKODE_ADMIN_PASSWORD` (env vars no Netlify) e protege `/painel.html` via Edge
  Function. O botão "Criar conta" continua sendo só visual (sem backend de
  autocadastro) — acessos novos são liberados manualmente pelo administrador.
  Limitado a 10 tentativas / 15 min por IP (`netlify/functions/lib/rateLimit.js`,
  usa Netlify Blobs) para dificultar força bruta.
- O painel usa dados de exemplo em memória; para persistir, conecte a um banco/API.
- O site tem um chat com IA (balão no canto inferior direito da home) que responde
  dúvidas sobre serviços/preços e salva o contato do visitante como lead assim que
  ele fornece nome + WhatsApp/e-mail e confirma interesse — via a função
  `netlify/functions/chat.js` (usa a API da Anthropic) e o formulário Netlify Forms
  `chat-lead`. **Requer a variável de ambiente `ZKODE_ANTHROPIC_API_KEY`** (Netlify →
  Site settings → Environment variables) com uma API key de https://console.anthropic.com —
  sem ela o chat responde com erro. Leads caem em Netlify → Forms → chat-lead.
  Limitado a 20 mensagens / 10 min por IP para conter custo em caso de abuso.
