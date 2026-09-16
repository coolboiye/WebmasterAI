-- AI Learning Portal — Supabase schema
--
-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL Editor
-- → New query → paste this whole file → Run). It's safe to re-run: every
-- statement is guarded with IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.
--
-- What this sets up:
--   1. `profiles`             — one row per signed-in student (name + avatar
--                                from their Google account).
--   2. `activity_completions` — one row per (student, activity) they've
--                                finished. This is the source of truth for XP.
--   3. A trigger that auto-creates a `profiles` row the moment someone signs
--      in with Google for the first time.
--   4. Row Level Security policies.
--
-- IMPORTANT — read before you rely on this for anything sensitive:
-- This app has no "private" data model. `profiles` and `activity_completions`
-- are readable by ANYONE who has your Supabase anon key (which is public —
-- it ships in your site's JavaScript) so the /leaderboard page can show every
-- student's name and progress to every other student. That's the point of a
-- classroom leaderboard, but it means: don't let students use anything other
-- than a display name they're fine being public, and don't store anything
-- else in this database that isn't meant to be seen by the whole class.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Student',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_completions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_id text not null,
  xp integer not null default 0,
  completed_at timestamptz not null default now(),
  unique (user_id, activity_id)
);

-- ---------- auto-create a profile on first sign-in ----------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- row level security ----------

alter table public.profiles enable row level security;
alter table public.activity_completions enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Completions are publicly readable" on public.activity_completions;
create policy "Completions are publicly readable"
  on public.activity_completions for select
  using (true);

drop policy if exists "Users can log their own completions" on public.activity_completions;
create policy "Users can log their own completions"
  on public.activity_completions for insert
  with check (auth.uid() = user_id);
