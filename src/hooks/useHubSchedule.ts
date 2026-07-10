import { useState, useCallback } from 'react';
import { hubGetTrainingSchedule, HubTrainingSchedule } from '../lib/hubApi';
import { supabase } from '../lib/supabase';

export interface UseHubScheduleResult {
  schedule: HubTrainingSchedule | null;
  loading: boolean;
  error: string | null;
  syncedCount: number;
  fetchSchedule: (hubAthleteId: string, localAthleteId: string, dateFrom: string, dateTo: string) => Promise<HubTrainingSchedule | null>;
}

async function syncCompletedWorkoutsFromHub(
  schedule: HubTrainingSchedule,
  localAthleteId: string
): Promise<number> {
  const completedFromHub = schedule.scheduled_workouts.filter(
    sw => sw.workout_source === 'endurance' && sw.status === 'completed'
  );
  if (completedFromHub.length === 0) return 0;

  const dates = completedFromHub.map(sw => sw.scheduled_date);
  const { data: localWorkouts } = await supabase
    .from('workouts')
    .select('id, name, status, scheduled_date')
    .or(`coach_id.eq.${localAthleteId},athlete_id.eq.${localAthleteId}`)
    .in('scheduled_date', dates)
    .eq('status', 'planned');

  if (!localWorkouts || localWorkouts.length === 0) return 0;

  // Match Hub workouts to local ones by date + name similarity
  const updates: Array<{ id: string; date: string; actualDuration: number | null; actualImpulse: number | null; rpe: number | null; notes: string | null }> = [];

  for (const sw of completedFromHub) {
    const hubName = (sw as any).name ?? sw.workout?.name ?? '';
    const match = localWorkouts.find(lw => {
      if (lw.scheduled_date !== sw.scheduled_date) return false;
      if (!hubName || !lw.name) return lw.scheduled_date === sw.scheduled_date;
      return lw.name.toLowerCase().includes(hubName.toLowerCase().slice(0, 15)) ||
             hubName.toLowerCase().includes(lw.name.toLowerCase().slice(0, 15));
    }) ?? localWorkouts.find(lw => lw.scheduled_date === sw.scheduled_date);

    if (match) {
      updates.push({
        id: match.id,
        date: sw.scheduled_date,
        actualDuration: (sw as any).actual_duration_minutes ?? null,
        actualImpulse: (sw as any).actual_impulse ?? null,
        rpe: sw.rpe ?? null,
        notes: sw.athlete_notes ?? sw.coach_notes ?? null,
      });
    }
  }

  let synced = 0;
  for (const u of updates) {
    const updatePayload: Record<string, unknown> = {
      status: 'completed',
      completed_at: u.date + 'T00:00:00Z',
    };
    if (u.actualDuration != null) updatePayload.actual_duration_minutes = u.actualDuration;
    if (u.actualImpulse != null) updatePayload.actual_impulse = u.actualImpulse;
    if (u.rpe != null) updatePayload.rpe = u.rpe;
    if (u.notes != null) updatePayload.notes = u.notes;

    const { error } = await supabase
      .from('workouts')
      .update(updatePayload)
      .eq('id', u.id);

    if (!error) synced++;
  }

  return synced;
}

export function useHubSchedule(): UseHubScheduleResult {
  const [schedule, setSchedule] = useState<HubTrainingSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncedCount, setSyncedCount] = useState(0);

  const fetchSchedule = useCallback(async (
    hubAthleteId: string,
    localAthleteId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<HubTrainingSchedule | null> => {
    setLoading(true);
    setError(null);
    setSyncedCount(0);

    try {
      const data = await hubGetTrainingSchedule(hubAthleteId, dateFrom, dateTo);
      setSchedule(data);

      const synced = await syncCompletedWorkoutsFromHub(data, localAthleteId);
      setSyncedCount(synced);

      return data;
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch Hub training schedule';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { schedule, loading, error, syncedCount, fetchSchedule };
}
