# Como criar o banco no Supabase

Passo a passo pra deixar o banco pronto. Leva ~10 min. Não precisa saber SQL — é só colar.

## 1. Criar a conta e o projeto

1. Acesse **https://supabase.com** → **Start your project** → entre com o GitHub ou email.
2. Clique em **New project**.
3. Preencha:
   - **Name**: `a3-painel` (ou o que quiser)
   - **Database Password**: gere uma senha forte e **guarde** (você quase não vai usar, mas anote).
   - **Region**: **South America (São Paulo)** — mais perto = mais rápido.
4. **Create new project** e espere ~2 min o banco subir.

## 2. Criar as tabelas

1. No menu lateral, abra **SQL Editor** → **New query**.
2. Abra o arquivo **`supabase/schema.sql`** deste projeto, copie **todo** o conteúdo e cole.
3. Clique em **Run**. Deve aparecer "Success". Pronto — as tabelas `clients` e `projects` estão criadas com segurança (RLS) ligada.

## 3. Criar os 3 usuários da equipe

1. Menu lateral → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Crie os três, com email e senha (marque "Auto Confirm User"):
   - `davi@a3sistemas.com.br`
   - `junior@a3sistemas.com.br`
   - `wendel@a3sistemas.com.br`
3. (Depois dá pra ligar **2FA** por app autenticador aqui mesmo.)

## 4. Pegar as chaves e me mandar

1. Menu lateral → **Project Settings** (engrenagem) → **API**.
2. Copie e me mande **apenas estas duas**:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **anon public** key (chave longa, marcada como `anon` / `public`)

> ⚠️ **NÃO me mande** a chave **`service_role`** — essa é secreta. Ela vai direto
> nas variáveis de ambiente da Vercel, sem passar por aqui.

## 5. Depois disso

Com a URL + anon key, eu conecto o app: troco o `localStorage` pelo Supabase (dados
na nuvem, os 3 veem o mesmo painel de qualquer lugar) e o login passa a usar as contas
que você criou no passo 3 — abrindo caminho pro **2FA**.
