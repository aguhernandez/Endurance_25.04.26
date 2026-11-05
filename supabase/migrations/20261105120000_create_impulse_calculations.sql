-- Canonical, regenerable derived storage for Impulse Engine v1.
-- Raw athlete/activity/workout data remains in its existing tables.

create table if not exists public.impulse_calculations (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.profiles(id) on delete cascade,
  source_kind text not null check (source_kind in ('activity_record', 'training_session', 'workout')),
  source_id text not null,
  activity_dedupe_key text not null,
  activity_date date not null,
  sport text not null check (sport in ('cycling', 'running', 'swimming', 'triathlon')),
  duration_seconds integer not null check (duration_seconds >= 0),
  impulse numeric,
  method text not null,
  status text not null check (status in ('calculated', 'estimated', 'manual', 'insufficient')),
  algorithm_version text not null,
  reason text,
  input_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (athlete_id, activity_dedupe_key, algorithm_version),
  unique (source_kind, source_id, algorithm_version)
);

comment on table public.impulse_calculations is
  'Versioned, regenerable Impulse calculations. Raw activity/workout data is stored elsewhere.';
comment on column public.impulse_calculations.activity_dedupe_key is
  'Stable activity identity used to prevent duplicate calculations across sync sources.';

create index if not exists impulse_calculations_athlete_date_idx
  on public.impulse_calculations (athlete_id, activity_date desc);

create unique index if not exists daily_load_athlete_date_uidx
  on public.daily_load (athlete_id, date);

create unique index if not exists performance_state_athlete_date_uidx
  on public.performance_state (athlete_id, date);

alter table public.impulse_calculations enable row level security;

create policy "Athletes can view own impulse calculations"
  on public.impulse_calculations for select
  to authenticated
  using (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('coach', 'admin')
    )
  );

create policy "Athletes can insert own impulse calculations"
  on public.impulse_calculations for insert
  to authenticated
  with check (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('coach', 'admin')
    )
  );

create policy "Athletes can update own impulse calculations"
  on public.impulse_calculations for update
  to authenticated
  using (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('coach', 'admin')
    )
  )
  with check (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('coach', 'admin')
    )
  );

revoke all on public.impulse_calculations from anon;
grant select, insert, update on public.impulse_calculations to authenticated;
