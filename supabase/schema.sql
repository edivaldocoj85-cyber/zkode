-- =============================================================
-- A3 Sistemas — schema do Painel
-- Cole isto no Supabase → SQL Editor → New query → Run.
-- Workspace compartilhado da equipe: quem está logado lê e escreve tudo.
-- =============================================================

-- Cada registro guarda o objeto completo em JSONB (mesma forma dos tipos do app).
create table if not exists public.clients (
  id         text primary key,
  data       jsonb       not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id         text primary key,
  data       jsonb       not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security ligada (nada é acessível sem política).
alter table public.clients  enable row level security;
alter table public.projects enable row level security;

-- Equipe autenticada tem acesso total. (Cada login vira um usuário no Supabase Auth.)
drop policy if exists "equipe acessa clients" on public.clients;
create policy "equipe acessa clients"
  on public.clients for all
  to authenticated
  using (true) with check (true);

drop policy if exists "equipe acessa projects" on public.projects;
create policy "equipe acessa projects"
  on public.projects for all
  to authenticated
  using (true) with check (true);

-- Atualiza updated_at automaticamente a cada escrita.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists clients_touch on public.clients;
create trigger clients_touch before update on public.clients
  for each row execute function public.touch_updated_at();

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();
