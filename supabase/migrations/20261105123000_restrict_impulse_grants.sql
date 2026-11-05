-- RLS remains the row-level boundary; table grants must also exclude destructive
-- operations for the authenticated client role.
revoke all on public.impulse_calculations from anon, authenticated;
grant select, insert, update on public.impulse_calculations to authenticated;
