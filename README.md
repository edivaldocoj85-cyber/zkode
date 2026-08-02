# A3 Sistemas — Plataforma

Landing pública + painel interno de gestão (clientes, projetos, cobranças,
contratos e infraestrutura).

- **`/`** — landing page pública (marketing).
- **`/login`** — acesso restrito da equipe (sem link na landing; `noindex`).
- **`/painel`** — o sistema de gestão (protegido por login).

Stack: Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion · Supabase.

---

## Rodar localmente

```bash
pnpm install
cp .env.example .env.local   # preencha os valores
pnpm dev
```

Abra http://localhost:3000. O painel fica em `/painel` (redireciona pra `/login` sem sessão).
Sem `SUPABASE_SECRET_KEY`, o app roda em modo local (dados no navegador).

## Variáveis de ambiente

| Variável              | Para quê                                                                 |
| --------------------- | ------------------------------------------------------------------------ |
| `AUTH_USERS`          | Contas de admin em JSON: `[{"email":"...","password":"..."}]` (davi, junior, wendel). |
| `AUTH_SECRET`         | String longa aleatória que assina o cookie de sessão (`openssl rand -hex 32`). |
| `SUPABASE_URL`        | URL do projeto Supabase.                                                 |
| `SUPABASE_SECRET_KEY` | Secret key (`sb_secret_...`). **Só no servidor** — nunca no navegador/git. |

## Banco de dados

O schema está em [`supabase/schema.sql`](supabase/schema.sql). Passo a passo em
[`SUPABASE.md`](SUPABASE.md). Os dados (clientes e projetos) ficam em duas tabelas
JSONB, acessadas só pelo servidor (rota `/api/data`, protegida pelo login).

## Publicar na Vercel

1. Em vercel.com → **Add New → Project** → importe `A3-Sistemas/a3-platform`.
2. Framework **Next.js** é detectado automaticamente (não precisa configurar root).
3. Em **Environment Variables**, adicione as 4 variáveis da tabela acima
   (use uma senha forte em `AUTH_USERS` e o `SUPABASE_SECRET_KEY` do Supabase).
4. **Deploy**. A landing fica pública; `/painel` só abre após login.

> ⚠️ `.env.local` está no `.gitignore` — os segredos vão só nas Environment
> Variables da Vercel, nunca no repositório.

## Personalizar

- **WhatsApp**: em `src/app/page.tsx`, troque a constante `WHATSAPP` pelo número real.
- **Contas/senhas**: defina `AUTH_USERS` na Vercel com senhas fortes de verdade.

## Próximo passo previsto

- Login individual nativo (Supabase Auth) com **2FA** — requer emails reais para os
  3 admins (o Supabase não aceita domínio fake).
