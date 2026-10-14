import { useState, useCallback } from 'react';
import {
  hubGetTrainingSchedule,
  hubGetExternalActivities,
  hubPullWindow,
  PULL_MIN_INTERVAL_MS,
  RECENT_RECHECK_DAYS,
  HubTrainingSchedule,
  HubExternalActivity,
  HubScheduledWorkout,
  hubActivityToWorkoutData,
} from '../lib/hubApi';
import { supabase } from '../lib/supabase';

export interface UseHubScheduleResult {
  schedule: HubTrainingSchedule | null;
  loading: boolean;
  error: string | null;
  syncedCount: number;
  activitiesCount: number;
  /** Returns 'cached' when the pull was skipped by the 10-minute throttle. */
  fetchSchedule: (hubAthleteId: string, localAthleteId: string, dateFrom?: string, dateTo?: string) => Promise<HubTrainingSchedule | 'cached' | null>;
}

const dayOffset = (days: number, ref = new Date()): string => {
  const d = new Date(ref);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

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

/**
 * Which Hub workouts may be written to the local DB on this pull:
 * - anything not yet loaded (upsert insert path), and
 * - workouts from the last 7 days or the future, which may have been edited
 *   in Hub since they were loaded.
 * Workouts older than RECENT_RECHECK_DAYS that are already loaded are immutable
 * and are skipped entirely — they are not re-consulted and not updated.
 */
async function getMutableGate(
  localAthleteId: string,
  candidates: Array<{ hubId: string | null; date: string }>
): Promise<{ loadedIds: Set<string>; mutableIds: Set<string> }> {
  const hubIds = candidates.map(c => c.hubId).filter((v): v is string => !!v);
  const loadedIds = new Set<string>();

  if (hubIds.length > 0) {
    for (let i = 0; i < hubIds.length; i += 200) {
      const { data } = await supabase
        .from('workouts')
        .select('hub_workout_id')
        .eq('athlete_id', localAthleteId)
        .in('hub_workout_id', hubIds.slice(i, i + 200));
      for (const row of data || []) {
        if ((row as any).hub_workout_id) loadedIds.add((row as any).hub_workout_id as string);
      }
    }
  }

  const today = dayOffset(0);
  const recheckFrom = dayOffset(-RECENT_RECHECK_DAYS);
  const mutableIds = new Set<string>();
  for (const c of candidates) {
    if (!c.hubId) continue;
    // Future workouts always mutable (plans change); recent ones may be edited.
    if (c.date > today || c.date >= recheckFrom) mutableIds.add(c.hubId);
  }

  return { loadedIds, mutableIds };
}

async function syncCompletedWorkoutsFromHub(
  schedule: HubTrainingSchedule,
  localAthleteId: string
): Promise<{ synced: number; updated: number; skipped: number }> {
  const allWorkouts = schedule.scheduled_workouts || [];
  const completedFromHub = allWorkouts.filter(sw => sw.status === 'completed');

  if (allWorkouts.length === 0) return { synced: 0, updated: 0, skipped: 0 };

  const candidates = allWorkouts.map(sw => ({
    hubId: sw.workout?.id ?? sw.id ?? null,
    date: sw.scheduled_date,
  }));
  const { loadedIds, mutableIds } = await getMutableGate(localAthleteId, candidates);

  const allScheduledDates = [...new Set(allWorkouts.map(sw => sw.scheduled_date))];

  // Local planned rows that a Hub completion may attach to
  const { data: localWorkouts, error: queryError } = await supabase
    .from('workouts')
    .select('id, name, sport, status, scheduled_date, estimated_duration_minutes, estimated_impulse, hub_matched_key, hub_workout_id, athlete_id')
    .or(`coach_id.eq.${localAthleteId},athlete_id.eq.${localAthleteId}`)
    .in('scheduled_date', allScheduledDates);

  if (queryError) {
    console.error('[HubSync] Failed to query local workouts:', queryError);
    return { synced: 0, updated: 0, skipped: 0 };
  }

  const localWorkoutList = localWorkouts || [];

  const alreadyMatchedKeys = new Set<string>();
  for (const lw of localWorkoutList) {
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
    matchKey: string;
    hubWorkoutId: string | null;
    hubData: HubScheduledWorkout;
    localData: typeof localWorkoutList[0];
  }> = [];

  // Upserts for Hub completions with no local row — the unique index on
  // (athlete_id, hub_workout_id) makes this safe to replay.
  const upserts: Array<Record<string, unknown>> = [];

  let skippedCount = 0;

  for (const sw of completedFromHub) {
    const hubName = sw.name ?? sw.workout?.name ?? '';
    const hubSport = mapSportType(sw.sport ?? sw.workout?.workout_type ?? 'other');
    const hubDuration = sw.actual_duration_minutes ?? sw.workout?.duration_minutes ?? null;
    const hubImpulse = sw.actual_impulse ?? null;
    const hubWorkoutId = sw.workout?.id ?? sw.id ?? null;

    const matchKey = makeMatchKey(sw.scheduled_date, localAthleteId, hubSport);

    const gate = hubWorkoutId ? (loadedIds.has(hubWorkoutId) ? 'loaded' : 'new') : 'legacy';

    // Immutable already-loaded workouts: never re-consulted, never written.
    if (gate === 'loaded' && !mutableIds.has(hubWorkoutId!)) {
      skippedCount++;
      continue;
    }

    if (gate === 'loaded' && alreadyMatchedKeys.has(matchKey)) {
      // Loaded, recent, already attached to a local row — recheck below via update.
    }

    const bestMatch = localWorkoutList.find(lw =>
      lw.scheduled_date === sw.scheduled_date &&
      mapSportType(lw.sport || 'other') === hubSport
    );

    if (bestMatch) {
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
        matchKey,
        hubWorkoutId,
        hubData: sw,
        localData: bestMatch,
      });
    } else if (gate !== 'loaded' || mutableIds.has(hubWorkoutId!)) {
      upserts.push({
        athlete_id: localAthleteId,
        coach_id: localAthleteId,
        sport: hubSport as any,
        name: hubName || `${hubSport} — Hub`,
        scheduled_date: sw.scheduled_date,
        status: 'completed',
        completed_at: sw.scheduled_date + 'T00:00:00Z',
        compliance_status: 'completed',
        hub_matched_key: matchKey,
        hub_workout_id: hubWorkoutId,
        hub_data: sw,
        is_library: false,
        estimated_duration_minutes: sw.planned_duration_minutes ?? sw.workout?.duration_minutes ?? hubDuration ?? null,
        actual_duration_minutes: hubDuration,
        actual_impulse: hubImpulse,
        rpe: sw.rpe ?? null,
        notes: sw.athlete_notes ?? sw.coach_notes ?? null,
      });
      alreadyMatchedKeys.add(matchKey);
    }
  }

  const plannedDates = new Set(
    allWorkouts
      .filter(sw => sw.status === 'pending' || sw.status === 'planned')
      .map(sw => sw.scheduled_date)
  );
  const missedWorkouts = localWorkoutList.filter(lw =>
    plannedDates.has(lw.scheduled_date) && lw.status === 'planned'
  );

  let syncedCount = 0;

  // Upsert new Hub-completed workouts (conflict-safe on (athlete_id, hub_workout_id))
  if (upserts.length > 0) {
    try {
      const { error: upsertError } = await supabase
        .from('workouts')
        .upsert(upserts, { onConflict: 'athlete_id,hub_workout_id', ignoreDuplicates: false });
      if (upsertError) {
        console.error('[HubSync] Failed to upsert Hub-completed workouts:', upsertError);
      } else {
        syncedCount += upserts.length;
      }
    } catch (err) {
      console.error('[HubSync] Error upserting Hub workouts:', err);
    }
  }

  for (const u of updates) {
    const gate = u.hubWorkoutId ? (loadedIds.has(u.hubWorkoutId) ? 'loaded' : 'new') : 'legacy';
    if (gate === 'loaded' && !mutableIds.has(u.hubWorkoutId!)) {
      skippedCount++;
      continue;
    }
    try {
      const updatePayload: Record<string, unknown> = {
        status: 'completed',
        completed_at: u.date + 'T00:00:00Z',
        compliance_status: u.compliance,
        hub_matched_key: u.matchKey,
        hub_workout_id: u.hubWorkoutId,
        hub_data: u.hubData,
        local_data: u.localData,
        athlete_id: localAthleteId,
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
    const candidates = activities.map(a => ({ hubId: a.id, date: a.local_date }));
    const { loadedIds, mutableIds } = await getMutableGate(localAthleteId, candidates);

    const today = dayOffset(0);
    const recheckFrom = dayOffset(-RECENT_RECHECK_DAYS);

    // Only process activities that are new, or recent/future enough to re-check
    const processable = activities.filter(a => {
      if (!loadedIds.has(a.id)) return true;
      return a.local_date > today || a.local_date >= recheckFrom;
    });
    if (processable.length === 0) return 0;

    const activityDates = [...new Set(processable.map(a => a.local_date))];

    // Legacy dedup paths (training_sessions + hub_matched_key) retained for
    // rows created before hub_workout_id existed.
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

    const { data: existingWkts } = await supabase
      .from('workouts')
      .select('id, hub_matched_key')
      .eq('athlete_id', localAthleteId)
      .not('hub_matched_key', 'is', null)
      .in('scheduled_date', activityDates);

    const existingWktKeys = new Set(
      (existingWkts || []).map((w: any) => w.hub_matched_key as string)
    );

    const toInsertSessions: Array<{
      athlete_id: string;
      sport: string;
      session_date: string;
      session_name: string | null;
      status: string;
      duration_minutes: number;
      distance_km: number | null;
      notes: string | null;
    }> = [];

    const toUpsertWorkouts: Array<Record<string, unknown>> = [];

    for (const a of processable) {
      // Loaded + immutable: skip without any write
      if (loadedIds.has(a.id) && a.local_date < recheckFrom && a.local_date <= today) continue;

      const sport = mapSportType(a.sport_type || '');
      const durationMin = a.duration_seconds ? Math.round(a.duration_seconds / 60) : 0;
      const distanceKm = a.distance_meters ? a.distance_meters / 1000 : null;
      const sessionName = a.name || `${a.source} ${sport}`;
      const key = existingKey(a.local_date, sessionName);
      const wktMatchKey = `ext|${a.local_date}|${localAthleteId}|${sport}|${a.id}`;

      if (!existingSet.has(key)) {
        existingSet.add(key);
        toInsertSessions.push({
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

      const workoutData = hubActivityToWorkoutData(a);
      toUpsertWorkouts.push({
        athlete_id: localAthleteId,
        coach_id: localAthleteId,
        sport: sport as any,
        name: sessionName,
        scheduled_date: a.local_date,
        status: 'completed',
        completed_at: a.start_time || a.local_date + 'T00:00:00Z',
        compliance_status: 'completed',
        hub_matched_key: existingWktKeys.has(wktMatchKey) ? wktMatchKey : wktMatchKey,
        hub_workout_id: a.id,
        hub_data: workoutData as any,
        is_library: false,
        estimated_duration_minutes: durationMin || null,
        actual_duration_minutes: durationMin || null,
        notes: a.source ? `Actividad importada desde ${a.source}` : null,
      });
    }

    let insertedCount = 0;

    if (toInsertSessions.length > 0) {
      const { error: insertError } = await supabase
        .from('training_sessions')
        .insert(toInsertSessions);
      if (insertError) {
        console.error('[HubSync] Failed to insert external activities:', insertError);
      }
    }

    if (toUpsertWorkouts.length > 0) {
      const { error: wktError } = await supabase
        .from('workouts')
        .upsert(toUpsertWorkouts, { onConflict: 'athlete_id,hub_workout_id', ignoreDuplicates: false });
      if (wktError) {
        console.error('[HubSync] Failed to upsert external activity workouts:', wktError);
      } else {
        insertedCount += toUpsertWorkouts.length;
      }
    }

    return toInsertSessions.length + insertedCount;
  } catch (err) {
    console.error('[HubSync] syncExternalActivities error:', err);
    return 0;
  }
}

async function markSynced(localAthleteId: string) {
  await supabase
    .from('profiles')
    .update({ hub_last_synced_at: new Date().toISOString() })
    .eq('id', localAthleteId);
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
    dateFrom?: string,
    dateTo?: string
  ): Promise<HubTrainingSchedule | 'cached' | null> => {
    setLoading(true);
    setError(null);
    setSyncedCount(0);
    setActivitiesCount(0);

    try {
      // Throttle: at most one full pull per athlete every 10 minutes. A failed
      // pull also advances the marker so a network error does not trigger
      // retry loops on every re-render.
      const { data: profileRow } = await supabase
        .from('profiles')
        .select('hub_last_synced_at')
        .eq('id', localAthleteId)
        .maybeSingle();
      const lastSync = profileRow?.hub_last_synced_at
        ? new Date(profileRow.hub_last_synced_at as string).getTime()
        : 0;
      const elapsed = Date.now() - lastSync;
      if (lastSync > 0 && elapsed < PULL_MIN_INTERVAL_MS) {
        console.log('[HubPull] Skipped: last pull was', Math.round(elapsed / 1000), 's ago (< 10 min)');
        return 'cached';
      }

      // The ONLY window any pull may request: past 90 days + 12 weeks ahead
      const window = hubPullWindow();
      const from = dateFrom && dateFrom > window.dateFrom ? dateFrom : window.dateFrom;
      const to = dateTo && dateTo < window.dateTo ? dateTo : window.dateTo;

      const [scheduleData, activitiesData] = await Promise.all([
        hubGetTrainingSchedule(hubAthleteId, from, to),
        hubGetExternalActivities(hubAthleteId, from, to),
      ]);

      setSchedule(scheduleData);

      const [syncResult, activitiesSynced] = await Promise.all([
        syncCompletedWorkoutsFromHub(scheduleData, localAthleteId),
        syncExternalActivities(activitiesData, localAthleteId),
      ]);

      setSyncedCount(syncResult.synced);
      setActivitiesCount(activitiesSynced);

      await markSynced(localAthleteId);

      return scheduleData;
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch Hub training schedule';
      console.error('[HubPull] Error:', msg);
      setError(msg);
      // Advance the marker even on failure so the UI does not retry in a loop.
      try { await markSynced(localAthleteId); } catch {}
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { schedule, loading, error, syncedCount, activitiesCount, fetchSchedule };
}
