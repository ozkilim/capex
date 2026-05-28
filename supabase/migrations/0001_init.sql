-- CAPEX backend schema: API tokens + per-machine savings rollups.
-- Run via the Supabase SQL editor or `supabase db push`.

create extension if not exists pgcrypto;

-- Personal access tokens issued to a user for the Claude Code plugin.
-- Only the SHA-256 hash of the token is stored; the plaintext is shown once.
create table if not exists public.api_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  token_hash  text not null unique,
  name        text not null default 'CLI token',
  created_at  timestamptz not null default now(),
  last_used_at timestamptz,
  revoked     boolean not null default false
);
create index if not exists api_tokens_user_id_idx on public.api_tokens (user_id);

-- Cumulative savings per (user, machine). The CLI sends absolute lifetime
-- totals; the dashboard sums across a user's machines.
create table if not exists public.savings (
  user_id          uuid not null references auth.users (id) on delete cascade,
  machine_id       text not null,
  machine_label    text,
  tokens_saved     bigint not null default 0,
  usd_saved        numeric(12,4) not null default 0,
  roundtrips_saved bigint not null default 0,
  ms_saved         bigint not null default 0,
  tool_calls       bigint not null default 0,
  by_tool          jsonb not null default '{}'::jsonb,
  updated_at       timestamptz not null default now(),
  primary key (user_id, machine_id)
);
create index if not exists savings_user_id_idx on public.savings (user_id);

-- Row Level Security: a user may read (only) their own rows. All writes go
-- through the service-role key in API routes, which bypasses RLS.
alter table public.api_tokens enable row level security;
alter table public.savings enable row level security;

drop policy if exists "own tokens readable" on public.api_tokens;
create policy "own tokens readable" on public.api_tokens
  for select using (auth.uid() = user_id);

drop policy if exists "own tokens deletable" on public.api_tokens;
create policy "own tokens deletable" on public.api_tokens
  for delete using (auth.uid() = user_id);

drop policy if exists "own savings readable" on public.savings;
create policy "own savings readable" on public.savings
  for select using (auth.uid() = user_id);
