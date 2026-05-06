/*
  # Create Function to Apply Program to Athlete

  Creates a database function that takes a program template and applies it
  to an athlete by creating scheduled workouts for each session in the program.

  ## Function: apply_program_to_athlete
  
  Parameters:
  - p_athlete_id: UUID of the athlete
  - p_program_id: UUID of the program template
  - p_start_date: Date when the program should start
  
  Returns: JSON with success status and created workout count
  
  Logic:
  1. Fetch the program template
  2. For each week in weekly_structure
  3. For each session in the week
  4. Find the workout by name from the workout library
  5. Create a scheduled workout for the athlete
  6. Calculate the scheduled_date based on week_number and day
*/

CREATE OR REPLACE FUNCTION apply_program_to_athlete(
  p_athlete_id UUID,
  p_program_id UUID,
  p_start_date DATE
) RETURNS JSON AS $$
DECLARE
  v_program RECORD;
  v_week JSONB;
  v_session JSONB;
  v_workout RECORD;
  v_scheduled_date DATE;
  v_week_number INT;
  v_day INT;
  v_created_count INT := 0;
BEGIN
  -- Fetch the program template
  SELECT * INTO v_program
  FROM program_templates
  WHERE id = p_program_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Program not found',
      'created_count', 0
    );
  END IF;
  
  -- Loop through each week in the program
  FOR v_week IN SELECT * FROM jsonb_array_elements(v_program.weekly_structure)
  LOOP
    v_week_number := (v_week->>'week_number')::INT;
    
    -- Loop through each session in the week
    FOR v_session IN SELECT * FROM jsonb_array_elements(v_week->'sessions')
    LOOP
      v_day := (v_session->>'day')::INT;
      
      -- Calculate the scheduled date
      -- week_number starts at 1, so we subtract 1
      -- day 1 = Monday (start_date + 0 days if start_date is Monday)
      v_scheduled_date := p_start_date + ((v_week_number - 1) * 7 + (v_day - 1))::INT;
      
      -- Find the workout by name
      SELECT id, name, sport, estimated_duration_minutes, estimated_impulse, difficulty
      INTO v_workout
      FROM workouts
      WHERE name = v_session->>'workout_name'
        AND is_public = true
      LIMIT 1;
      
      -- If workout found, create a scheduled workout
      IF FOUND THEN
        INSERT INTO workouts (
          sport,
          name,
          description,
          coach_id,
          athlete_id,
          scheduled_date,
          is_public,
          is_template,
          estimated_duration_minutes,
          estimated_impulse,
          difficulty
        ) VALUES (
          v_workout.sport,
          v_workout.name,
          COALESCE(v_session->>'description', 'Week ' || v_week_number || ' - ' || (v_week->>'focus')),
          NULL, -- No coach assigned
          p_athlete_id,
          v_scheduled_date,
          false, -- Not public
          false, -- Not a template
          (v_session->>'duration_minutes')::INT,
          v_workout.estimated_impulse,
          (v_session->>'intensity')::TEXT
        );
        
        -- Copy workout steps from the template workout
        INSERT INTO workout_steps (
          workout_id,
          "order",
          step_type,
          duration_type,
          duration_value,
          target_type,
          target_percent_ftp,
          target_heart_rate_zone,
          target_pace_min_per_km,
          instructions
        )
        SELECT
          currval(pg_get_serial_sequence('workouts', 'id')),
          "order",
          step_type,
          duration_type,
          duration_value,
          target_type,
          target_percent_ftp,
          target_heart_rate_zone,
          target_pace_min_per_km,
          instructions
        FROM workout_steps
        WHERE workout_id = v_workout.id
        ORDER BY "order";
        
        v_created_count := v_created_count + 1;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN json_build_object(
    'success', true,
    'created_count', v_created_count,
    'program_name', v_program.name,
    'duration_weeks', v_program.duration_weeks,
    'start_date', p_start_date,
    'end_date', p_start_date + (v_program.duration_weeks * 7)::INT
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION apply_program_to_athlete(UUID, UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION apply_program_to_athlete(UUID, UUID, DATE) TO anon;
