# Painel Gestor + Landing

Estúdio digital em Brasília — landing pública + painel interno de gestão (clientes,
projetos, cobranças, contratos e infraestrutura).

- **`/`** — landing page pública (marketing, sem nome definido ainda).
- **`/login`** — acesso restrito da equipe (sem link na landing; `noindex`).
- **`/painel`** — o sistema de gestão (protegido por login via cookie de sessão).

Stack: Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion.

---

## Rodar localmente

```bash
pnpm install
cp .env.example .env.local   # preencha os valores
pnpm dev
```

Abra http://localhost:3000. O painel fica em `/painel` (redireciona pra `/login` sem sessão).

## Variáveis de ambiente

| Variável         | Para quê                                                       |
| ---------------- | -------------------------------------------------------------- |
| `PANEL_PASSWORD` | Senha compartilhada da equipe para entrar no `/login`.         |
| `AUTH_SECRET`    | String longa aleatória que assina o cookie. Gere uma só sua.   |

Gere um `AUTH_SECRET` forte:

```bash
openssl rand -hex 32
```

## Publicar na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em vercel.com → **Add New → Project** → importe o repositório.
3. Em **Environment Variables**, adicione `PANEL_PASSWORD` e `AUTH_SECRET`
   (os mesmos nomes; use uma senha forte de verdade).
4. **Deploy**. A landing fica pública; `/painel` só abre após login.

> ⚠️ **Nunca** comite `.env.local` (já está no `.gitignore`). Configure os
> segredos direto no painel da Vercel.

## Personalizar antes de publicar

- **WhatsApp**: em `src/app/page.tsx`, troque a constante `WHATSAPP` pelo número real.
- **Senha da equipe**: defina `PANEL_PASSWORD` na Vercel.
- **Nome/branding**: a landing usa só o ícone; quando definir o nome, é só inserir.

## Próximos passos previstos

- Migrar o armazenamento (hoje `localStorage`) para **Supabase** (dados na nuvem,
  multiusuário). O login por senha da equipe pode então virar contas individuais + **2FA**.
