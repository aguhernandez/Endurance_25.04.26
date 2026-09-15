import { useState, useCallback } from 'react';
import { hubGetTrainingSchedule, hubGetExternalActivities, HubTrainingSchedule, HubExternalActivity, HubScheduledWorkout } from '../lib/hubApi';
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
  actualName: string,
  hubStatus: string
): 'completed' | 'modified' | 'missed' {
  if (hubStatus !== 'completed') return 'missed';

  const hasActualMetrics = actualDuration != null || actualImpulse != null;
  if (!hasActualMetrics) return 'completed';

  const durRatio = plannedDuration && actualDuration
    ? actualDuration / plannedDuration
    : null;
  const impulseRatio = plannedImpulse && actualImpulse
    ? actualImpulse / plannedImpulse
    : null;

  if (durRatio == null && impulseRatio == null) return 'completed';

  const nameSim = nameSimilarity(plannedName, actualName);
  const ratio = durRatio ?? impulseRatio ?? 1;

  if (ratio >= 0.8 && ratio <= 1.2 && nameSim >= 0.5) return 'completed';
  if (ratio >= 0.5 && ratio <= 1.5) return 'modified';
  return 'modified';
}

function makeMatchKey(date: string, athleteId: string, exerciseType: string): string {
  return `${date}|${athleteId}|${exerciseType.toLowerCase()}`;
}

async function syncCompletedWorkoutsFromHub(
  schedule: HubTrainingSchedule,
  localAthleteId: string
): Promise<{ synced: number; updated: number; skipped: number }> {
  const completedFromHub = schedule.scheduled_workouts.filter(
    sw => sw.status === 'completed'
  );

  const allScheduledDates = schedule.scheduled_workouts.map(sw => sw.scheduled_date);

  if (allScheduledDates.length === 0) return { synced: 0, updated: 0, skipped: 0 };

  const { data: localWorkouts, error: queryError } = await supabase
    .from('workouts')
    .select('id, name, sport, status, scheduled_date, estimated_duration_minutes, estimated_impulse, compliance_status, hub_matched_key, local_data')
    .or(`coach_id.eq.${localAthleteId},athlete_id.eq.${localAthleteId}`)
    .in('scheduled_date', allScheduledDates);

  if (queryError) {
    console.error('[HubSync] Failed to query local workouts:', queryError);
    return { synced: 0, updated: 0, skipped: 0 };
  }

  if (!localWorkouts || localWorkouts.length === 0) return { synced: 0, updated: 0, skipped: 0 };

  const alreadyMatchedKeys = new Set<string>();
  for (const lw of localWorkouts) {
    const matchedKey = (lw as any).hub_matched_key as string | null;
    if (matchedKey) alreadyMatchedKeys.add(matchedKey);
  }

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
    matchKey: string;
    hubData: HubScheduledWorkout;
    localData: typeof localWorkouts[0];
  }> = [];

  let skippedCount = 0;

  for (const sw of completedFromHub) {
    const hubName = sw.name ?? sw.workout?.name ?? '';
    const hubSport = mapSportType(sw.sport ?? sw.workout?.workout_type ?? 'other');
    const hubDuration = sw.actual_duration_minutes ?? sw.workout?.duration_minutes ?? null;
    const hubImpulse = sw.actual_impulse ?? null;

    const bestMatch = localWorkouts.find(lw =>
      lw.scheduled_date === sw.scheduled_date &&
      mapSportType(lw.sport || 'other') === hubSport
    );

    if (bestMatch) {
      const exerciseType = hubSport;
      const matchKey = makeMatchKey(sw.scheduled_date, localAthleteId, exerciseType);

      if (alreadyMatchedKeys.has(matchKey)) {
        skippedCount++;
        continue;
      }

      const compliance = computeCompliance(
        bestMatch.estimated_duration_minutes ?? null,
        bestMatch.estimated_impulse ?? null,
        hubDuration,
        hubImpulse,
        bestMatch.name || '',
        hubName,
        sw.status
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
        matchKey,
        hubData: sw,
        localData: bestMatch,
      });
    }
  }

  const plannedDates = new Set(
    schedule.scheduled_workouts
      .filter(sw => sw.status === 'pending' || sw.status === 'planned')
      .map(sw => sw.scheduled_date)
  );
  const missedWorkouts = localWorkouts.filter(lw =>
    plannedDates.has(lw.scheduled_date) && lw.status === 'planned'
  );

  let syncedCount = 0;
  for (const u of updates) {
    try {
      const updatePayload: Record<string, unknown> = {
        status: 'completed',
        completed_at: u.date + 'T00:00:00Z',
        compliance_status: u.compliance,
        hub_matched_key: u.matchKey,
        hub_data: u.hubData,
        local_data: u.localData,
      };
      if (u.actualDuration != null) updatePayload.actual_duration_minutes = u.actualDuration;
      if (u.actualImpulse != null) updatePayload.actual_impulse = u.actualImpulse;
      if (u.rpe != null) updatePayload.rpe = u.rpe;
      if (u.notes != null) updatePayload.notes = u.notes;

      const { error } = await supabase
        .from('workouts')
        .update(updatePayload)
        .eq('id', u.id);

      if (error) {
        console.error(`[HubSync] Failed to update workout ${u.id}:`, error);
      } else {
        syncedCount++;
      }
    } catch (err) {
      console.error(`[HubSync] Error updating workout ${u.id}:`, err);
    }
  }

  let missedCount = 0;
  for (const lw of missedWorkouts) {
    try {
      const { error } = await supabase
        .from('workouts')
        .update({ compliance_status: 'missed' })
        .eq('id', lw.id);

      if (!error) missedCount++;
    } catch (err) {
      console.error(`[HubSync] Error marking workout ${lw.id} as missed:`, err);
    }
  }

  return { synced: syncedCount, updated: missedCount, skipped: skippedCount };
}

async function syncExternalActivities(
  activities: HubExternalActivity[],
  localAthleteId: string
): Promise<number> {
  if (activities.length === 0) return 0;

  try {
    const activityDates = activities.map(a => a.local_date);

    const { data: existing, error: queryError } = await supabase
      .from('training_sessions')
      .select('id, session_date, session_name, sport')
      .eq('athlete_id', localAthleteId)
      .eq('status', 'completed')
      .in('session_date', activityDates);

    if (queryError) {
      console.error('[HubSync] Failed to query existing activities:', queryError);
      return 0;
    }

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

    const { error: insertError } = await supabase
      .from('training_sessions')
      .insert(toInsert);

    if (insertError) {
      console.error('[HubSync] Failed to insert external activities:', insertError);
      return 0;
    }

    return toInsert.length;
  } catch (err) {
    console.error('[HubSync] syncExternalActivities error:', err);
    return 0;
  }
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

      const [syncResult, activitiesSynced] = await Promise.all([
        syncCompletedWorkoutsFromHub(scheduleData, localAthleteId),
        syncExternalActivities(activitiesData, localAthleteId),
      ]);

      setSyncedCount(syncResult.synced);
      setActivitiesCount(activitiesSynced);

      return scheduleData;
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch Hub training schedule';
      console.error('[HubPull] Error:', msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { schedule, loading, error, syncedCount, activitiesCount, fetchSchedule };
}
