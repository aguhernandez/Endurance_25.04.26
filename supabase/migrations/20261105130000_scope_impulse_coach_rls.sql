drop policy if exists "Athletes can view own impulse calculations" on public.impulse_calculations;
drop policy if exists "Athletes can insert own impulse calculations" on public.impulse_calculations;
drop policy if exists "Athletes can update own impulse calculations" on public.impulse_calculations;

create policy "Athletes can view own impulse calculations"
  on public.impulse_calculations for select
  to authenticated
  using (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
    or exists (
      select 1 from public.workouts w
      where w.athlete_id = impulse_calculations.athlete_id
        and w.coach_id = (select auth.uid())
    )
    or exists (
      select 1 from public.training_sessions ts
      where ts.athlete_id = impulse_calculations.athlete_id
        and ts.planned_by_coach_id = (select auth.uid())
    )
  );

create policy "Athletes can insert own impulse calculations"
  on public.impulse_calculations for insert
  to authenticated
  with check (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
    or exists (
      select 1 from public.workouts w
      where w.athlete_id = impulse_calculations.athlete_id
        and w.coach_id = (select auth.uid())
    )
    or exists (
      select 1 from public.training_sessions ts
      where ts.athlete_id = impulse_calculations.athlete_id
        and ts.planned_by_coach_id = (select auth.uid())
    )
  );

create policy "Athletes can update own impulse calculations"
  on public.impulse_calculations for update
  to authenticated
  using (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
    or exists (
      select 1 from public.workouts w
      where w.athlete_id = impulse_calculations.athlete_id
        and w.coach_id = (select auth.uid())
    )
    or exists (
      select 1 from public.training_sessions ts
      where ts.athlete_id = impulse_calculations.athlete_id
        and ts.planned_by_coach_id = (select auth.uid())
    )
  )
  with check (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
    or exists (
      select 1 from public.workouts w
      where w.athlete_id = impulse_calculations.athlete_id
        and w.coach_id = (select auth.uid())
    )
    or exists (
      select 1 from public.training_sessions ts
      where ts.athlete_id = impulse_calculations.athlete_id
        and ts.planned_by_coach_id = (select auth.uid())
    )
  );
