import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  hubPushEndurancePlan,
  hubPushTrainingLog,
  collectAndPushAthleteTags,
  HubEndurancePlanPayload,
  HubEndurancePlanDay,
  HubTrainingLogPayload,
} from '../lib/hubApi';
import { Workout, WorkoutStep } from '../types/workout';
import {
  calculateWorkoutImpulseFromSteps,
  calculateSessionImpulse,
  reconstructCAAndAL,
  classifySSR,
  DailyImpulseEntry,
  DifficultyColor,
} from '../lib/sessionDifficulty';

export interface PushPlanResult {
  success: boolean;
  pushedWeeks: number;
  pushedLogs: number;
  pushedTags: number;
  errors: string[];
}

function getMondayFromDateStr(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function sportToHubSport(sport: string): HubEndurancePlanDay['sport'] {
  if (sport === 'cycling') return 'cycling';
  if (sport === 'running') return 'running';
  if (sport === 'swimming') return 'swimming';
  return 'other';
}

function sessionTypeFromWorkout(workout: Workout): HubEndurancePlanDay['session_type'] {
  const name = (workout.name || '').toLowerCase();
  const sub = (workout.sub_discipline || '').toLowerCase();

  if (name.includes('rest') || sub.includes('rest')) return 'rest';
  if (name.includes('recovery') || sub.includes('recovery')) return 'recovery';
  if (name.includes('interval') || sub.includes('interval')) return 'interval';
  if (name.includes('tempo') || sub.includes('tempo')) return 'tempo';
  if (name.includes('long') || sub.includes('long')) return 'long';
  if (name.includes('race') || sub.includes('race')) return 'race';
  return 'easy';
}

function extractTargetZones(steps: WorkoutStep[]): number[] {
  const zones = new Set<number>();
  for (const step of steps) {
    if (step.target_zone != null) zones.add(step.target_zone);
  }
  return Array.from(zones).sort((a, b) => a - b);
}

function formatStepDuration(step: WorkoutStep): string {
  if (step.duration_type === 'time') {
    const mins = Math.floor(step.duration_value / 60);
    const secs = step.duration_value % 60;
    return mins > 0 ? `${mins}min${secs > 0 ? `${secs}s` : ''}` : `${secs}s`;
  }
  return `${step.duration_value}m`;
}

function formatStepTarget(step: WorkoutStep): string {
  if (step.target_zone != null) {
    return `Z${step.target_zone}`;
  }
  if (step.target_percent_ftp != null) {
    return `${step.target_percent_ftp}% FTP`;
  }
  if (step.target_type && step.target_min_value != null && step.target_max_value != null) {
    return `${step.target_min_value}-${step.target_max_value} ${step.target_type.toUpperCase()}`;
  }
  return step.step_type;
}

function difficultyColorLabel(color: string | null | undefined): string {
  if (color === 'green') return 'DIFFICULTY: Easy (green)';
  if (color === 'yellow') return 'DIFFICULTY: Moderate (yellow)';
  if (color === 'red') return 'DIFFICULTY: Hard (red)';
  return '';
}

function buildStepsDescription(workout: Workout, steps: WorkoutStep[], computedImpulse: number | null): string {
  const parts: string[] = [];

  const diffLabel = difficultyColorLabel(workout.difficulty_color);
  if (diffLabel) parts.push(diffLabel);

  if (workout.description) parts.push(workout.description);

  if (steps.length > 0) {
    const stepLines: string[] = [];

    const grouped = new Map<string, WorkoutStep[]>();
    for (const step of steps) {
      const key = step.repeat_group_id || step.id;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(step);
    }

    const seen = new Set<string>();
    for (const step of steps) {
      const groupKey = step.repeat_group_id || step.id;
      if (seen.has(groupKey)) continue;
      seen.add(groupKey);

      const groupSteps = grouped.get(groupKey)!;

      if (step.repeat_group_id && step.repeat_times && step.repeat_times > 1) {
        const innerLines = groupSteps.map(s => `  ${s.step_type}: ${formatStepDuration(s)} @ ${formatStepTarget(s)}`);
        stepLines.push(`${step.repeat_times}x:`);
        stepLines.push(...innerLines);
      } else {
        stepLines.push(`${step.step_type}: ${formatStepDuration(step)} @ ${formatStepTarget(step)}`);
      }
    }

    if (stepLines.length > 0) {
      parts.push(`Steps:\n${stepLines.join('\n')}`);
    }
  }

  const impulse = computedImpulse ?? workout.estimated_impulse;
  if (impulse) {
    parts.push(`Planned impulse: ${Math.round(impulse * 100) / 100}`);
  }
  if (workout.intensity_basis) {
    parts.push(`Intensity basis: ${workout.intensity_basis.toUpperCase()}`);
  }

  return parts.join('\n\n') || workout.name || null!;
}

interface AthletePhysiologyCache {
  ftp: number | null;
  runThresholdPacePerKm: number | null;
  swimThresholdPacePerKm: number | null;
  zoneSystem: '5' | '7';
}

async function loadAthletePhysiology(athleteId: string): Promise<AthletePhysiologyCache> {
  try {
    const { data } = await supabase
      .from('athlete_physiology')
      .select('run_pace_z4_min, run_pace_z4_max, swim_css_per_100m, swim_pace_z4_min, swim_pace_z4_max, zone_system')
      .eq('athlete_id', athleteId)
      .maybeSingle();

    if (!data) return { ftp: null, runThresholdPacePerKm: null, swimThresholdPacePerKm: null, zoneSystem: '5' };

    let runThreshold: number | null = null;
    if (data.run_pace_z4_min && data.run_pace_z4_max) {
      runThreshold = (data.run_pace_z4_min + data.run_pace_z4_max) / 2;
    } else if (data.run_pace_z4_min) {
      runThreshold = data.run_pace_z4_min;
    }

    let swimThreshold: number | null = null;
    if (data.swim_css_per_100m) {
      swimThreshold = data.swim_css_per_100m * 10;
    } else if (data.swim_pace_z4_min && data.swim_pace_z4_max) {
      swimThreshold = (data.swim_pace_z4_min + data.swim_pace_z4_max) / 2;
    }

    return {
      ftp: null,
      runThresholdPacePerKm: runThreshold,
      swimThresholdPacePerKm: swimThreshold,
      zoneSystem: (data.zone_system as '5' | '7') ?? '5',
    };
  } catch {
    return { ftp: null, runThresholdPacePerKm: null, swimThresholdPacePerKm: null, zoneSystem: '5' };
  }
}

async function loadAthleteFTP(athleteId: string): Promise<number | null> {
  try {
    const { data } = await supabase
      .from('athlete_ftp')
      .select('ftp_watts')
      .eq('athlete_id', athleteId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.ftp_watts ?? null;
  } catch {
    return null;
  }
}

function computeWorkoutImpulse(
  workout: Workout,
  steps: WorkoutStep[],
  physiology: AthletePhysiologyCache,
  ftp: number | null
): number {
  const thresholdPace =
    workout.sport === 'running'
      ? physiology.runThresholdPacePerKm
      : workout.sport === 'swimming'
      ? physiology.swimThresholdPacePerKm
      : null;

  return calculateWorkoutImpulseFromSteps({
    steps,
    sport: workout.sport,
    ftp,
    thresholdPacePerKm: thresholdPace,
    zoneSystem: physiology.zoneSystem,
    fallbackDurationMinutes: workout.estimated_duration_minutes ?? 60,
  });
}

async function loadAthleteCompletedImpulses(
  athleteId: string,
  physiology: AthletePhysiologyCache,
  ftp: number | null
): Promise<DailyImpulseEntry[]> {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const cy = cutoff.getFullYear();
    const cm = String(cutoff.getMonth() + 1).padStart(2, '0');
    const cd = String(cutoff.getDate()).padStart(2, '0');
    const cutoffStr = `${cy}-${cm}-${cd}`;

    const { data: sessions } = await supabase
      .from('training_sessions')
      .select('session_date, sport, duration_minutes, avg_power_watts, avg_pace_per_km, perceived_effort, status')
      .eq('athlete_id', athleteId)
      .eq('status', 'completed')
      .gte('session_date', cutoffStr)
      .order('session_date');

    if (!sessions || sessions.length === 0) return [];

    const map = new Map<string, number>();
    for (const s of sessions) {
      const thresholdPace =
        s.sport === 'running'
          ? physiology.runThresholdPacePerKm
          : s.sport === 'swimming'
          ? physiology.swimThresholdPacePerKm
          : null;

      const impulse = calculateSessionImpulse({
        durationMinutes: s.duration_minutes,
        sport: s.sport,
        avgPowerWatts: s.avg_power_watts,
        ftp,
        avgPacePerKm: s.avg_pace_per_km,
        thresholdPacePerKm: thresholdPace,
        perceivedEffort: s.perceived_effort,
      });

      const existing = map.get(s.session_date) ?? 0;
      map.set(s.session_date, existing + impulse);
    }

    return Array.from(map.entries()).map(([date, impulse]) => ({ date, impulse }));
  } catch {
    return [];
  }
}

function computeDifficultyForWorkout(
  workout: Workout,
  steps: WorkoutStep[],
  physiology: AthletePhysiologyCache,
  ftp: number | null,
  dailyImpulses: DailyImpulseEntry[]
): DifficultyColor | null {
  if (!workout.scheduled_date) return null;

  const impulse = computeWorkoutImpulse(workout, steps, physiology, ftp);

  const impulsesBeforeWorkout = dailyImpulses.filter(d => d.date < workout.scheduled_date!);
  if (impulsesBeforeWorkout.length === 0) return null;

  const { ca, al } = reconstructCAAndAL(impulsesBeforeWorkout, workout.scheduled_date);
  if (ca <= 0) return null;

  const rb = ca - al;
  const ssr = impulse / ca;
  return classifySSR(ssr, rb);
}

export interface UseHubPlanResult {
  pushing: boolean;
  lastResult: PushPlanResult | null;
  pushWeeklyPlan: (
    hubAthleteId: string,
    localAthleteId: string,
    ftpWatts: number | null
  ) => Promise<PushPlanResult>;
  pushCompletedLog: (
    hubAthleteId: string,
    payload: HubTrainingLogPayload
  ) => Promise<{ success: boolean; error?: string }>;
}

export function useHubPlan(): UseHubPlanResult {
  const [pushing, setPushing] = useState(false);
  const [lastResult, setLastResult] = useState<PushPlanResult | null>(null);

  const pushWeeklyPlan = useCallback(async (
    hubAthleteId: string,
    localAthleteId: string,
    ftpWatts: number | null
  ): Promise<PushPlanResult> => {
    setPushing(true);

    const result: PushPlanResult = { success: false, pushedWeeks: 0, pushedLogs: 0, pushedTags: 0, errors: [] };

    try {
      const toLocalDateStr = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
      };

      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 7);
      const dateTo = new Date();
      dateTo.setDate(dateTo.getDate() + 56);

      const [physiologyData, ftpFromDb] = await Promise.all([
        loadAthletePhysiology(localAthleteId),
        loadAthleteFTP(localAthleteId),
      ]);

      const ftp = ftpWatts ?? ftpFromDb;
      const physiology: AthletePhysiologyCache = { ...physiologyData, ftp };

      const completedImpulses = await loadAthleteCompletedImpulses(localAthleteId, physiology, ftp);

      const { data: workouts, error: wError } = await supabase
        .from('workouts')
        .select('*')
        .or(`coach_id.eq.${localAthleteId},athlete_id.eq.${localAthleteId}`)
        .gte('scheduled_date', toLocalDateStr(dateFrom))
        .lte('scheduled_date', toLocalDateStr(dateTo))
        .order('scheduled_date');

      if (wError) throw new Error(wError.message);
      if (!workouts || workouts.length === 0) {
        result.success = true;
        setLastResult(result);
        return result;
      }

      const workoutIds = workouts.map(w => w.id);
      const { data: allSteps } = await supabase
        .from('workout_steps')
        .select('*')
        .in('workout_id', workoutIds)
        .order('order');

      const stepsByWorkout = new Map<string, WorkoutStep[]>();
      for (const step of (allSteps || [])) {
        if (!stepsByWorkout.has(step.workout_id)) stepsByWorkout.set(step.workout_id, []);
        stepsByWorkout.get(step.workout_id)!.push(step);
      }

      const weekMap = new Map<string, Workout[]>();
      for (const w of workouts) {
        if (!w.scheduled_date) continue;
        const monday = getMondayFromDateStr(w.scheduled_date);
        if (!weekMap.has(monday)) weekMap.set(monday, []);
        weekMap.get(monday)!.push(w);
      }

      for (const [weekStart, weekWorkouts] of weekMap.entries()) {
        const days: HubEndurancePlanDay[] = weekWorkouts.map(w => {
          const steps = stepsByWorkout.get(w.id) || [];
          const completed = w.status === 'completed';
          const targetZones = extractTargetZones(steps);

          const computedPlannedImpulse = computeWorkoutImpulse(w, steps, physiology, ftp);
          const plannedImpulse = computedPlannedImpulse;
          const actualImpulse = completed ? (w.actual_impulse ?? null) : null;

          const freshDifficultyColor = computeDifficultyForWorkout(
            w, steps, physiology, ftp, completedImpulses
          );
          const effectiveDifficultyColor = freshDifficultyColor ?? w.difficulty_color ?? null;

          const description = buildStepsDescription(
            { ...w, difficulty_color: effectiveDifficultyColor },
            steps,
            computedPlannedImpulse
          );

          const diffNotes = difficultyColorLabel(effectiveDifficultyColor);
          const notesStr = [diffNotes, w.notes].filter(Boolean).join(' | ') || null;

          const dbUpdates: Record<string, unknown> = {};
          if (computedPlannedImpulse && computedPlannedImpulse !== w.estimated_impulse) {
            dbUpdates.estimated_impulse = computedPlannedImpulse;
          }
          if (freshDifficultyColor && freshDifficultyColor !== w.difficulty_color) {
            dbUpdates.difficulty_color = freshDifficultyColor;
          }
          if (Object.keys(dbUpdates).length > 0) {
            supabase
              .from('workouts')
              .update(dbUpdates)
              .eq('id', w.id)
              .then(() => {});
          }

          return {
            date: w.scheduled_date!,
            name: w.name || null,
            session_type: sessionTypeFromWorkout(w),
            sport: sportToHubSport(w.sport),
            planned_duration_minutes: w.estimated_duration_minutes || 60,
            planned_distance_km: null,
            planned_tss: null,
            planned_impulse: plannedImpulse,
            target_zones: targetZones,
            description,
            completed,
            actual_duration_minutes: completed ? (w.actual_duration_minutes ?? null) : null,
            actual_distance_km: null,
            actual_tss: null,
            actual_impulse: actualImpulse,
            actual_avg_hr: null,
            actual_avg_power_watts: null,
            rpe: completed ? (w.rpe ?? null) : null,
            notes: notesStr,
          };
        });

        const totalHours = days.reduce((s, d) => s + d.planned_duration_minutes / 60, 0);
        const totalImpulse = days.reduce((s, d) => s + (d.planned_impulse || 0), 0);
        const sessionsCount = days.filter(d => d.session_type !== 'rest').length;

        const payload: HubEndurancePlanPayload = {
          week_start_date: weekStart,
          plan_name: `Endurance Week ${weekStart}`,
          summary: {
            total_hours: Math.round(totalHours * 10) / 10,
            total_tss: 0,
            total_impulse: Math.round(totalImpulse * 100) / 100,
            total_distance_km: 0,
            sessions_count: sessionsCount,
          },
          plan_data: { days },
          notes: null,
        };

        try {
          await hubPushEndurancePlan(hubAthleteId, payload);
          result.pushedWeeks++;
        } catch (err: any) {
          result.errors.push(`Week ${weekStart}: ${err.message}`);
        }
      }

      const completedWorkouts = workouts.filter(w => w.status === 'completed');
      for (const w of completedWorkouts) {
        const steps = stepsByWorkout.get(w.id) || [];
        const actualImpulse = w.actual_impulse ?? computeWorkoutImpulse(w, steps, physiology, ftp);
        const durationHours = (w.actual_duration_minutes || w.estimated_duration_minutes || 60) / 60;
        const relativeIntensity = durationHours > 0 ? actualImpulse / durationHours : null;

        const logPayload: HubTrainingLogPayload = {
          training_date: (() => {
            if (w.scheduled_date) return w.scheduled_date;
            if (w.completed_at) return w.completed_at.split('T')[0];
            const now = new Date();
            const y = now.getFullYear();
            const mo = String(now.getMonth() + 1).padStart(2, '0');
            const d = String(now.getDate()).padStart(2, '0');
            return `${y}-${mo}-${d}`;
          })(),
          workout_type: sportToHubSport(w.sport) as HubTrainingLogPayload['workout_type'],
          duration_minutes: w.actual_duration_minutes || w.estimated_duration_minutes || 0,
          distance_km: null,
          avg_heart_rate: null,
          max_heart_rate: null,
          avg_power_watts: null,
          max_power_watts: null,
          session_impulse: Math.round(actualImpulse * 100) / 100,
          relative_intensity: relativeIntensity ? Math.round(relativeIntensity * 1000) / 1000 : null,
          rpe: w.rpe ?? null,
          elevation_gain_m: w.elevation_m ?? null,
          avg_cadence: null,
          avg_speed_kmh: null,
          calories: null,
          external_source: 'endurance_planner',
          external_activity_id: w.id,
          notes: w.notes ?? null,
        };

        try {
          await hubPushTrainingLog(hubAthleteId, logPayload);
          result.pushedLogs++;
        } catch (err: any) {
          result.errors.push(`Log ${w.id}: ${err.message}`);
        }
      }

      const tagsResult = await collectAndPushAthleteTags(localAthleteId, hubAthleteId, 'endurance_planner');
      if (tagsResult) {
        result.pushedTags = tagsResult.saved?.length ?? 0;
      }

      result.success = result.errors.length === 0;
    } catch (err: any) {
      result.errors.push(err.message || 'Unknown error');
    } finally {
      setPushing(false);
      setLastResult(result);
    }

    return result;
  }, []);

  const pushCompletedLog = useCallback(async (
    hubAthleteId: string,
    payload: HubTrainingLogPayload
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await hubPushTrainingLog(hubAthleteId, payload);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  return { pushing, lastResult, pushWeeklyPlan, pushCompletedLog };
}
