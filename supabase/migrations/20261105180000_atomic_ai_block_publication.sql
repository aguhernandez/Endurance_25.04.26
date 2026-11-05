-- Publish only the persisted approved revision in one transaction.
CREATE OR REPLACE FUNCTION public.prevent_published_ai_block_mutation()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF OLD.status IN ('accepted', 'applied') AND (
    (NEW.status IS DISTINCT FROM OLD.status AND NOT (OLD.status = 'accepted' AND NEW.status = 'applied')) OR
    NEW.weeks IS DISTINCT FROM OLD.weeks OR NEW.block_name IS DISTINCT FROM OLD.block_name OR
    NEW.block_start_date IS DISTINCT FROM OLD.block_start_date OR NEW.block_end_date IS DISTINCT FROM OLD.block_end_date OR
    NEW.athlete_id IS DISTINCT FROM OLD.athlete_id OR NEW.coach_id IS DISTINCT FROM OLD.coach_id
  ) THEN RAISE EXCEPTION 'Approved or published AI blocks are immutable; create a new revision'; END IF;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.publish_ai_block(p_block_id uuid, p_published_by uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE
  b public.ai_generated_blocks%ROWTYPE;
  wk jsonb; sess jsonb; wi integer := 0; si integer; wid uuid;
  duration integer; warmup integer; cooldown integer; target_type text; target_pct integer; target_zone integer;
  dedupe text; n integer := 0;
BEGIN
  SELECT * INTO b FROM public.ai_generated_blocks WHERE id = p_block_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'AI block not found'; END IF;
  IF b.status = 'applied' THEN RETURN jsonb_build_object('success', true, 'insertedCount', 0); END IF;
  IF b.status <> 'accepted' THEN RAISE EXCEPTION 'Only approved blocks can be published'; END IF;
  IF jsonb_typeof(b.weeks::jsonb) <> 'array' THEN RAISE EXCEPTION 'Invalid approved weeks'; END IF;
  FOR wk IN SELECT value FROM jsonb_array_elements(b.weeks::jsonb) LOOP
    si := 0;
    FOR sess IN SELECT value FROM jsonb_array_elements(wk->'sessions') LOOP
      dedupe := 'ai-block:' || b.id::text || ':' || wi || ':' || si;
      -- Previously incomplete publications must not be silently accepted.
      IF EXISTS (SELECT 1 FROM public.workouts WHERE athlete_id = b.athlete_id AND hub_workout_id = dedupe) THEN
        RAISE EXCEPTION 'Existing partial publication requires reconciliation';
      END IF;
      duration := COALESCE(NULLIF((sess->>'estimated_duration_minutes')::integer, 0), 60);
      warmup := round(duration * 0.15); cooldown := round(duration * 0.1);
      target_type := CASE WHEN sess->>'intensity_basis' IN ('power','hr','pace','rpe') THEN sess->>'intensity_basis' END;
      target_pct := (sess->>'target_percent_ftp')::integer; target_zone := (sess->>'target_zone')::integer;
      INSERT INTO public.workouts (athlete_id, coach_id, sport, name, description, intensity_basis, scheduled_date, status, estimated_duration_minutes, estimated_impulse, actual_avg_intensity_percent_ftp, is_library, hub_workout_id)
      VALUES (b.athlete_id, b.coach_id, CASE WHEN sess->>'sport' IN ('cycling','running','swimming') THEN sess->>'sport' ELSE 'cycling' END,
        sess->>'session_name', NULLIF(sess->>'description',''), target_type,
        (wk->>'week_start_date')::date + greatest(0, COALESCE((sess->>'day_of_week')::integer,1)-1), 'planned',
        NULLIF((sess->>'estimated_duration_minutes')::integer,0), NULLIF((sess->>'estimated_impulse')::numeric,0), target_pct, false, dedupe)
      RETURNING id INTO wid;
      INSERT INTO public.workout_steps (workout_id, "order", step_type, duration_type, duration_value, target_type, target_percent_ftp, target_zone) VALUES
        (wid, 1, 'warmup', 'time', warmup * 60, target_type, target_pct, target_zone),
        (wid, 2, 'steady', 'time', greatest(1, duration - warmup - cooldown) * 60, target_type, target_pct, target_zone),
        (wid, 3, 'cooldown', 'time', cooldown * 60, target_type, NULL, CASE WHEN target_zone IS NOT NULL THEN greatest(1,target_zone-1) END);
      n := n + 1; si := si + 1;
    END LOOP;
    wi := wi + 1;
  END LOOP;
  UPDATE public.ai_generated_blocks SET status = 'applied', published_at = now(), published_by = p_published_by, updated_at = now() WHERE id = b.id;
  RETURN jsonb_build_object('success', true, 'insertedCount', n);
END; $$;
REVOKE ALL ON FUNCTION public.publish_ai_block(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.publish_ai_block(uuid, uuid) TO service_role;
