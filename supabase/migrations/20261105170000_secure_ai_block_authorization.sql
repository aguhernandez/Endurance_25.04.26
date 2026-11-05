/*
  Smart Planner AI Block authorization hardening.

  Endurance does not own Hub relationships. AI Block reads/writes are routed
  through endurance-satellite-bridge, which validates the Hub JWT and the
  active athlete/coach relationship before using its server-side key here.
  Direct Data API access is therefore deny-by-default.
*/

ALTER TABLE public.ai_generated_blocks
  ADD COLUMN IF NOT EXISTS revision_of uuid REFERENCES public.ai_generated_blocks(id),
  ADD COLUMN IF NOT EXISTS revision_number integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS published_by uuid;

DROP POLICY IF EXISTS "Athletes can read own ai blocks" ON public.ai_generated_blocks;
DROP POLICY IF EXISTS "Athletes and coaches can insert ai blocks" ON public.ai_generated_blocks;
DROP POLICY IF EXISTS "Athletes and coaches can update ai blocks" ON public.ai_generated_blocks;

ALTER TABLE public.ai_generated_blocks ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.ai_generated_blocks FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.prevent_published_ai_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('accepted', 'applied') AND (
    NEW.status IS DISTINCT FROM OLD.status OR
    NEW.weeks IS DISTINCT FROM OLD.weeks OR
    NEW.block_name IS DISTINCT FROM OLD.block_name OR
    NEW.block_start_date IS DISTINCT FROM OLD.block_start_date OR
    NEW.block_end_date IS DISTINCT FROM OLD.block_end_date OR
    NEW.athlete_id IS DISTINCT FROM OLD.athlete_id OR
    NEW.coach_id IS DISTINCT FROM OLD.coach_id
  ) THEN
    RAISE EXCEPTION 'Approved or published AI blocks are immutable; create a new revision';
  END IF;

  IF OLD.status = 'applied' AND NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Published AI blocks cannot change status';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_published_ai_block_mutation ON public.ai_generated_blocks;
CREATE TRIGGER prevent_published_ai_block_mutation
  BEFORE UPDATE ON public.ai_generated_blocks
  FOR EACH ROW EXECUTE FUNCTION public.prevent_published_ai_block_mutation();

CREATE INDEX IF NOT EXISTS idx_ai_generated_blocks_revision_of
  ON public.ai_generated_blocks(revision_of);
