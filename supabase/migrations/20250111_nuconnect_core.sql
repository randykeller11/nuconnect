-- See-only if already created (safe)
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  profile_photo_url text,
  interests text[] default '{}',
  career_goals text,
  mentorship_pref text check (mentorship_pref in ('seeking','offering','both','none')) default 'none',
  contact_prefs jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location text,
  date_time timestamptz not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.match_rooms (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id),
  visibility text check (visibility in ('public','private')) default 'public',
  created_by uuid references auth.users(id),
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.room_members (
  room_id uuid references public.match_rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (room_id, user_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.match_rooms(id) on delete cascade,
  user_a uuid references auth.users(id) on delete cascade,
  user_b uuid references auth.users(id) on delete cascade,
  match_score numeric,
  shared_topics text[] default '{}',
  ai_explanation text,
  created_at timestamptz default now()
);

create table if not exists public.contact_shares (
  match_id uuid references public.matches(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  payload jsonb not null,
  shared_at timestamptz default now(),
  primary key (match_id, user_id)
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  match_id uuid references public.matches(id) on delete cascade,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.boost_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text check (type in ('priority_visibility','extra_matches','save_contact_card')),
  amount_cents int default 0,
  status text default 'not_applicable',
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
create policy "profiles_owner_rw" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles_read_by_room_members" on public.profiles
  for select using (
    exists (
      select 1 from public.room_members rm1, public.room_members rm2
      where rm1.user_id = auth.uid() 
      and rm2.user_id = profiles.user_id 
      and rm1.room_id = rm2.room_id
    )
  );

alter table public.events enable row level security;
create policy "events_read_all" on public.events
  for select using (true);
create policy "events_owner_rw" on public.events
  for all using (auth.uid() = created_by) with check (auth.uid() = created_by);

alter table public.match_rooms enable row level security;
create policy "match_rooms_read_public" on public.match_rooms
  for select using (visibility = 'public');
create policy "match_rooms_owner_rw" on public.match_rooms
  for all using (auth.uid() = created_by) with check (auth.uid() = created_by);

alter table public.room_members enable row level security;
create policy "room_members_owner_rw" on public.room_members
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "room_members_read_by_room_members" on public.room_members
  for select using (
    exists (select 1 from public.room_members rm
            where rm.room_id = room_members.room_id and rm.user_id = auth.uid())
  );

alter table public.matches enable row level security;
create policy "matches_room_member_read" on public.matches
  for select using (
    exists (select 1 from public.room_members rm
            where rm.room_id = matches.room_id and rm.user_id = auth.uid())
  );

alter table public.contact_shares enable row level security;
create policy "contact_shares_owner_rw" on public.contact_shares
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "contact_shares_read_by_match_participants" on public.contact_shares
  for select using (
    exists (select 1 from public.matches m
            where m.id = contact_shares.match_id 
            and (m.user_a = auth.uid() or m.user_b = auth.uid()))
  );

alter table public.connections enable row level security;
create policy "connections_owner_rw" on public.connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.boost_transactions enable row level security;
create policy "boost_transactions_owner_rw" on public.boost_transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
