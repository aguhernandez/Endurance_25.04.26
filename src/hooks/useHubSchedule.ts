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

function nameSimilarity(a: string, b: string): number {
  const la = a.toLowerCase().trim();
  const lb = b.toLowerCase().trim();
  if (!la || !lb) return 0;
  if (la === lb) return 1;
  const aWords = la.split(/\s+/).filter(w => w.length > 2);
  const bWords = lb.split(/\s+/).filter(w => w.length > 2);
  let matches = 0;
  for (const aw of aWords) {
    if (bWords.some(bw => bw.includes(aw) || aw.includes(bw))) matches++;
  }
  return Math.min(1, matches / Math.max(aWords.length, bWords.length, 1));
}

function computeCompliance(
  plannedDuration: number | null,
  plannedImpulse: number | null,
  actualDuration: number | null,
  actualImpulse: number | null,
  plannedName: string,
  actualName: string
): 'completed' | 'modified' | 'missed' {
  if (actualDuration == null && actualImpulse == null) return 'modified';

  const durRatio = plannedDuration && actualDuration
    ? actualDuration / plannedDuration
    : null;
  const impulseRatio = plannedImpulse && actualImpulse
    ? actualImpulse / plannedImpulse
    : null;

  if (durRatio == null && impulseRatio == null) return 'modified';

  const nameSim = nameSimilarity(plannedName, actualName);

  const ratio = durRatio ?? impulseRatio ?? 1;

  if (ratio >= 0.8 && ratio <= 1.2 && nameSim >= 0.5) return 'completed';
  if (ratio >= 0.5 && ratio <= 1.5) return 'modified';
  return 'missed';
}

async function syncCompletedWorkoutsFromHub(
  schedule: HubTrainingSchedule,
  localAthleteId: string
): Promise<{ synced: number; updated: number }> {
  const completedFromHub = schedule.scheduled_workouts.filter(
    sw => sw.status === 'completed'
  );

  const allScheduledDates = schedule.scheduled_workouts.map(sw => sw.scheduled_date);

  if (allScheduledDates.length === 0) return { synced: 0, updated: 0 };

  const { data: localWorkouts } = await supabase
    .from('workouts')
    .select('id, name, status, scheduled_date, estimated_duration_minutes, estimated_impulse')
    .or(`coach_id.eq.${localAthleteId},athlete_id.eq.${localAthleteId}`)
    .in('scheduled_date', allScheduledDates);

  if (!localWorkouts || localWorkouts.length === 0) return { synced: 0, updated: 0 };

  const updates: Array<{
    id: string;
    date: string;
    actualDuration: number | null;
    actualImpulse: number | null;
    rpe: number | null;
    notes: string | null;
    compliance: 'completed' | 'modified' | 'missed';
    plannedName: string;
    actualName: string;
  }> = [];

  for (const sw of completedFromHub) {
    const hubName = (sw as any).name ?? sw.workout?.name ?? '';
    const hubDuration = (sw as any).actual_duration_minutes ?? sw.workout?.duration_minutes ?? null;
    const hubImpulse = (sw as any).actual_impulse ?? null;

    let bestMatch = null as null | typeof localWorkouts[0];
    let bestScore = 0;

    for (const lw of localWorkouts) {
      if (lw.scheduled_date !== sw.scheduled_date) continue;
      const sim = nameSimilarity(hubName, lw.name || '');
      if (sim > bestScore) {
        bestScore = sim;
        bestMatch = lw;
      }
    }

    if (!bestMatch && localWorkouts.length > 0) {
      bestMatch = localWorkouts.find(lw => lw.scheduled_date === sw.scheduled_date) ?? null;
    }

    if (bestMatch) {
      const compliance = computeCompliance(
        bestMatch.estimated_duration_minutes ?? null,
        bestMatch.estimated_impulse ?? null,
        hubDuration,
        hubImpulse,
        bestMatch.name || '',
        hubName
      );

      updates.push({
        id: bestMatch.id,
        date: sw.scheduled_date,
        actualDuration: hubDuration,
        actualImpulse: hubImpulse,
        rpe: sw.rpe ?? null,
        notes: sw.athlete_notes ?? sw.coach_notes ?? null,
        compliance,
        plannedName: bestMatch.name || '',
        actualName: hubName,
      });
    }
  }

  const plannedDates = new Set(schedule.scheduled_workouts.filter(sw => sw.status === 'pending' || sw.status === 'planned').map(sw => sw.scheduled_date));
  const missedWorkouts = localWorkouts.filter(lw =>
    plannedDates.has(lw.scheduled_date) && lw.status === 'planned'
  );

  let syncedCount = 0;
  for (const u of updates) {
    const updatePayload: Record<string, unknown> = {
      status: 'completed',
      completed_at: u.date + 'T00:00:00Z',
      compliance_status: u.compliance,
    };
    if (u.actualDuration != null) updatePayload.actual_duration_minutes = u.actualDuration;
    if (u.actualImpulse != null) updatePayload.actual_impulse = u.actualImpulse;
    if (u.rpe != null) updatePayload.rpe = u.rpe;
    if (u.notes != null) updatePayload.notes = u.notes;

    const { error } = await supabase
      .from('workouts')
      .update(updatePayload)
      .eq('id', u.id);

    if (!error) syncedCount++;
  }

  let missedCount = 0;
  for (const lw of missedWorkouts) {
    const { error } = await supabase
      .from('workouts')
      .update({ compliance_status: 'missed' })
      .eq('id', lw.id);

    if (!error) missedCount++;
  }

  return { synced: syncedCount, updated: missedCount };
}

async function syncExternalActivities(
  activities: HubExternalActivity[],
  localAthleteId: string
): Promise<number> {
  if (activities.length === 0) return 0;

  const activityDates = activities.map(a => a.local_date);

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

      console.log('[HubPull] schedule:', scheduleData.scheduled_workouts.map(w => ({
        date: w.scheduled_date,
        status: w.status,
        name: w.workout?.name ?? (w as any).name,
        actual_duration: (w as any).actual_duration_minutes,
        actual_impulse: (w as any).actual_impulse,
      })));
      console.log('[HubPull] external activities:', activitiesData.length);

      setSchedule(scheduleData);

      const [syncResult, activitiesSynced] = await Promise.all([
        syncCompletedWorkoutsFromHub(scheduleData, localAthleteId),
        syncExternalActivities(activitiesData, localAthleteId),
      ]);

      setSyncedCount(syncResult.synced);
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
