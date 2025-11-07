-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_color text default '#6366f1',
  games_played int default 0,
  games_won int default 0,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create game_sessions table for multiplayer games
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  game_type text not null check (game_type in ('connect4', 'uno', 'hangman', 'tictactoe', 'snake')),
  host_id uuid not null references auth.users(id) on delete cascade,
  guest_id uuid references auth.users(id) on delete set null,
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'finished')),
  current_turn uuid references auth.users(id),
  game_state jsonb not null default '{}',
  winner_id uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.game_sessions enable row level security;

create policy "sessions_select_all"
  on public.game_sessions for select
  using (true);

create policy "sessions_insert_own"
  on public.game_sessions for insert
  with check (auth.uid() = host_id);

create policy "sessions_update_participants"
  on public.game_sessions for update
  using (auth.uid() = host_id or auth.uid() = guest_id);

create policy "sessions_delete_own"
  on public.game_sessions for delete
  using (auth.uid() = host_id);

-- Create function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_game_session_updated
  before update on public.game_sessions
  for each row
  execute function public.handle_updated_at();
