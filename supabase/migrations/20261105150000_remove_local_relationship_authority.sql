-- Endurance must not infer coach authorization from workouts or training data.
-- Until Hub-backed authorization claims/sync are available to RLS, only the
-- athlete and admin paths are enabled for the canonical calculation table.
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
  )
  with check (
    athlete_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );
