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
- Os formulários são visuais: para receber os dados, conecte a um serviço de forms
  (Formspree, Netlify Forms) ou a um backend próprio.
- O painel usa dados de exemplo em memória; para persistir, conecte a um banco/API.
