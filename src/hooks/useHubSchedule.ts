import { useState, useCallback } from 'react';
import { hubGetTrainingSchedule, hubGetExternalActivities, HubTrainingSchedule, HubExternalActivity } from '../lib/hubApi';
import { supabase } from '../lib/supabase';

export interface UseHubScheduleResult {
  schedule: HubTrainingSchedule | null;
  loading: boolean;
  error: string | null;
  syncedCount: number;
  activitiesCount: number;
  fetchSchedule: (hubAthleteId: string, localAthleteId: string, dateFrom: string, dateTo: string) => Promise<HubTrainingSchedule | null>;
}

function mapSportType(sportType: string): string {
  const st = sportType.toLowerCase();
  if (st.includes('ride') || st.includes('cycl') || st.includes('bike')) return 'cycling';
  if (st.includes('run') || st.includes('jog')) return 'running';
  if (st.includes('swim')) return 'swimming';
  if (st.includes('tri')) return 'triathlon';
  return 'other';
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

async function syncExternalActivities(
  activities: HubExternalActivity[],
  localAthleteId: string
): Promise<number> {
  if (activities.length === 0) return 0;

  const activityDates = activities.map(a => a.local_date);
  const activityNames = activities.map(a => a.name);

  const { data: existing } = await supabase
    .from('training_sessions')
    .select('id, session_date, session_name, sport')
    .eq('athlete_id', localAthleteId)
    .eq('status', 'completed')
    .in('session_date', activityDates);

  const existingKey = (d: string, n: string) => `${d}|${n?.toLowerCase() || ''}`;

  const existingSet = new Set(
    (existing || []).map(e => existingKey(e.session_date, e.session_name || ''))
  );

  const toInsert: Array<{
    athlete_id: string;
    sport: string;
    session_date: string;
    session_name: string | null;
    status: string;
    duration_minutes: number;
    distance_km: number | null;
    notes: string | null;
  }> = [];

  for (const a of activities) {
    const sport = mapSportType(a.sport_type || '');
    const durationMin = a.duration_seconds ? Math.round(a.duration_seconds / 60) : 0;
    const distanceKm = a.distance_meters ? a.distance_meters / 1000 : null;
    const sessionName = a.name || `${a.source} ${sport}`;
    const key = existingKey(a.local_date, sessionName);

    if (existingSet.has(key)) continue;

    existingSet.add(key);

    toInsert.push({
      athlete_id: localAthleteId,
      sport,
      session_date: a.local_date,
      session_name: sessionName,
      status: 'completed',
      duration_minutes: durationMin || 1,
      distance_km: distanceKm ? Math.round(distanceKm * 100) / 100 : null,
      notes: a.source ? `Importado desde ${a.source}` : null,
    });
  }

  if (toInsert.length === 0) return 0;

  const { error } = await supabase
    .from('training_sessions')
    .insert(toInsert);

  if (error) {
    console.error('[HubSync] Failed to insert external activities:', error);
    return 0;
  }

  return toInsert.length;
}

export function useHubSchedule(): UseHubScheduleResult {
  const [schedule, setSchedule] = useState<HubTrainingSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncedCount, setSyncedCount] = useState(0);
  const [activitiesCount, setActivitiesCount] = useState(0);

  const fetchSchedule = useCallback(async (
    hubAthleteId: string,
    localAthleteId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<HubTrainingSchedule | null> => {
    setLoading(true);
    setError(null);
    setSyncedCount(0);
    setActivitiesCount(0);

    try {
      const [scheduleData, activitiesData] = await Promise.all([
        hubGetTrainingSchedule(hubAthleteId, dateFrom, dateTo),
        hubGetExternalActivities(hubAthleteId, dateFrom, dateTo),
      ]);

      setSchedule(scheduleData);

      const [synced, activitiesSynced] = await Promise.all([
        syncCompletedWorkoutsFromHub(scheduleData, localAthleteId),
        syncExternalActivities(activitiesData, localAthleteId),
      ]);

      setSyncedCount(synced);
      setActivitiesCount(activitiesSynced);

      return scheduleData;
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch Hub training schedule';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { schedule, loading, error, syncedCount, activitiesCount, fetchSchedule };
}
