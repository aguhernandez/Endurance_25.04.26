/*
  # Allow null coach_id for Public Library Workouts

  ## Summary
  Removes the NOT NULL constraint on workouts.coach_id to allow
  public library templates that are not owned by any specific coach.

  ## Changes
  - workouts.coach_id: NOT NULL -> nullable
    Public/library workouts have is_public=true and coach_id=NULL.
    Privately created workouts still have a coach_id.
*/

ALTER TABLE workouts ALTER COLUMN coach_id DROP NOT NULL;
