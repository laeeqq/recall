create table contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  relationship text,
  personal_details jsonb default '{}'::jsonb,
  last_contacted_at timestamptz,
  created_at timestamptz default now()
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  occurred_at timestamptz default now(),
  summary text not null,
  notes text,
  topics text[] default '{}',
  ask_next_time text,
  created_at timestamptz default now(),
  fts tsvector generated always as (
    to_tsvector('english',
      coalesce(summary,'') || ' ' || coalesce(notes,'') || ' ' || coalesce(ask_next_time,''))
  ) stored
);

create index conversations_fts_idx on conversations using gin(fts);
create index conversations_topics_idx on conversations using gin(topics);

create table action_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  description text not null,
  owner text not null check (owner in ('me','them')),
  due_date date,
  done boolean default false,
  created_at timestamptz default now()
);

alter table contacts enable row level security;
alter table conversations enable row level security;
alter table action_items enable row level security;

create policy "own contacts" on contacts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own conversations" on conversations for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own action items" on action_items for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
