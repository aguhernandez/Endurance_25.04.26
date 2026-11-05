-- A local ATP row is a planning projection, not a second owner of the event.
-- Existing historic rows remain valid and intentionally keep this NULL.
ALTER TABLE public.atp_events
  ADD COLUMN IF NOT EXISTS shared_event_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS atp_events_plan_shared_event_unique
  ON public.atp_events (plan_id, shared_event_id)
  WHERE shared_event_id IS NOT NULL;

COMMENT ON COLUMN public.atp_events.shared_event_id IS
  'Hub shared_athlete_events UUID. No cross-project FK: Hub remains canonical.';
