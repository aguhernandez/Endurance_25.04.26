alter table public.impulse_calculations
  add column if not exists calculation_context text not null default 'actual'
  check (calculation_context in ('planned', 'actual'));

alter table public.impulse_calculations
  drop constraint if exists impulse_calculations_athlete_id_activity_dedupe_key_algorit_key,
  drop constraint if exists impulse_calculations_source_kind_source_id_algorithm_versio_key;

alter table public.impulse_calculations
  add constraint impulse_calculations_activity_context_unique
    unique (athlete_id, activity_dedupe_key, algorithm_version, calculation_context),
  add constraint impulse_calculations_source_context_unique
    unique (source_kind, source_id, algorithm_version, calculation_context);

create table if not exists public.impulse_library_calculations (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  algorithm_version text not null,
  impulse numeric,
  method text not null,
  status text not null check (status in ('calculated', 'estimated', 'insufficient')),
  reason text,
  input_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workout_id, algorithm_version)
);

comment on table public.impulse_library_calculations is
  'Derived cache for unassigned Workout Library templates; never an athlete load.';

alter table public.impulse_library_calculations enable row level security;

create policy "Anyone can view public library impulse calculations"
  on public.impulse_library_calculations for select
  to anon, authenticated
  using (exists (
    select 1 from public.workouts w
    where w.id = impulse_library_calculations.workout_id
      and w.is_library = true
  ));

revoke all on public.impulse_library_calculations from anon, authenticated;
grant select on public.impulse_library_calculations to anon, authenticated;
