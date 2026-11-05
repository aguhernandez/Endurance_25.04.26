import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { analyzeWorkout, AnalysisInput, WorkoutAnalysisResult } from '../lib/workoutAnalysisEngine';
import { getActivityRecords } from './useHubSync';
import { calculateImpulse, ImpulseStatus, reconstructLoadState } from '../lib/impulseEngine';

export interface StoredWorkoutAnalysis {
  id: string;
  workout_id: string | null;
  athlete_id: string;
  completion_score: number;
  intensity_score: number;
  load_score: number;
  final_score: number;
  classification: 'green' | 'yellow' | 'red';
  impulse_planned: number;
  impulse_actual: number;
  impulse_actual_status?: ImpulseStatus;
  fitness: number;
  fatigue: number;
  form: number;
  time_in_zones: Record<string, number> | null;
  deviations: Array<{
    field: string;
    label: string;
    planned: number;
    actual: number;
    pct: number;
    direction: 'over' | 'under' | 'on_target';
  }> | null;
  insights: string[] | null;
  wellness: Record<string, unknown> | null;
  analysis_version: number;
  created_at: string;
}

async function fetchCurrentBanister(
  athleteId: string,
  sessionDate: string
): Promise<{ fitness: number; fatigue: number }> {
  const records = await getActivityRecords(athleteId, 120);

  const dailyImpulses = records
    .filter(r => r.activity_date < sessionDate)
    .map(r => {
      const calculated = calculateImpulse({
        sport: r.sport as 'cycling' | 'running' | 'swimming',
        durationMinutes: (r.duration_seconds ?? 0) / 60,
        normalizedPowerWatts: r.normalized_power_watts,
        avgPowerWatts: r.avg_power_watts,
        ftp: r.ftp_at_time,
        avgPacePerKm: r.avg_pace_sec_per_km,
        thresholdPacePerKm: null,
      });
      return { date: r.activity_date as string, impulse: calculated.impulse };
    })
    .filter((r): r is { date: string; impulse: number } => r.impulse != null && r.impulse > 0);

  if (dailyImpulses.length === 0) return { fitness: 0, fatigue: 0 };

  const state = reconstructLoadState(dailyImpulses, sessionDate);
  return { fitness: state.ca, fatigue: state.al };
}

export async function triggerWorkoutAnalysis(
  input: AnalysisInput & { sessionDate: string }
): Promise<{ success: boolean; analysis?: StoredWorkoutAnalysis; error?: string }> {
  try {
    const { fitness, fatigue } = await fetchCurrentBanister(input.athleteId, input.sessionDate);

    const result = analyzeWorkout({
      ...input,
      currentFitness: fitness,
      currentFatigue: fatigue,
    });

    const { data, error } = await supabase
      .from('workout_analysis')
      .insert({
        workout_id: result.workoutId,
        athlete_id: result.athleteId,
        completion_score: result.completionScore,
        intensity_score: result.intensityScore,
        load_score: result.loadScore,
        final_score: result.finalScore,
        classification: result.classification,
        impulse_planned: result.impulsePlanned,
        impulse_actual: result.impulseActual,
        fitness: result.fitness,
        fatigue: result.fatigue,
        form: result.form,
        time_in_zones: result.timeInZones,
        deviations: result.deviations,
        insights: result.insights,
        wellness: result.wellness,
        analysis_version: 1,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, analysis: data as StoredWorkoutAnalysis };
  } catch (err: any) {
    console.error('Workout analysis failed:', err);
    return { success: false, error: err.message };
  }
}

export function useWorkoutAnalysis(workoutId: string | null) {
  const [analysis, setAnalysis] = useState<StoredWorkoutAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!workoutId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('workout_analysis')
        .select('*')
        .eq('workout_id', workoutId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setAnalysis(data as StoredWorkoutAnalysis | null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [workoutId]);

  return { analysis, loading, error, refetch: fetch };
}

export function useLatestAnalyses(athleteId: string | null, limit = 10) {
  const [analyses, setAnalyses] = useState<StoredWorkoutAnalysis[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!athleteId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workout_analysis')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setAnalyses((data ?? []) as StoredWorkoutAnalysis[]);
    } catch (err) {
      console.error('Failed to fetch analyses:', err);
    } finally {
      setLoading(false);
    }
  }, [athleteId, limit]);

  return { analyses, loading, refetch: fetch };
}

export function buildAnalysisInput(params: {
  athleteId: string;
  workoutId?: string | null;
  sport: string;
  sessionDate: string;
  plannedDurationMinutes?: number | null;
  actualDurationMinutes: number;
  plannedImpulse?: number | null;
  actualAvgIntensityPctFtp?: number | null;
  plannedAvgIntensityPctFtp?: number | null;
  avgPowerWatts?: number | null;
  ftp?: number | null;
  avgPacePerKm?: number | null;
  thresholdPacePerKm?: number | null;
  avgHeartRate?: number | null;
  hrMax?: number | null;
  perceivedEffort?: number | null;
  timeInZones?: Record<string, number> | null;
  wellness?: {
    sleep_quality?: number | null;
    stress_level?: number | null;
    muscle_soreness?: number | null;
    mood?: number | null;
    perceived_effort?: number | null;
    fatigue_level?: number | null;
    notes?: string | null;
  } | null;
}): AnalysisInput & { sessionDate: string } {
  return {
    athleteId: params.athleteId,
    workoutId: params.workoutId ?? null,
    sport: params.sport as 'cycling' | 'running' | 'swimming',
    plannedDurationMinutes: params.plannedDurationMinutes ?? null,
    actualDurationMinutes: params.actualDurationMinutes,
    plannedImpulse: params.plannedImpulse ?? null,
    actualAvgIntensityPctFtp: params.actualAvgIntensityPctFtp ?? null,
    plannedAvgIntensityPctFtp: params.plannedAvgIntensityPctFtp ?? null,
    avgPowerWatts: params.avgPowerWatts ?? null,
    ftp: params.ftp ?? null,
    avgPacePerKm: params.avgPacePerKm ?? null,
    thresholdPacePerKm: params.thresholdPacePerKm ?? null,
    avgHeartRate: params.avgHeartRate ?? null,
    hrMax: params.hrMax ?? null,
    perceivedEffort: params.perceivedEffort ?? null,
    timeInZones: params.timeInZones ?? null,
    currentFitness: 0,
    currentFatigue: 0,
    wellness: params.wellness ?? null,
    sessionDate: params.sessionDate,
  };
}

export type { WorkoutAnalysisResult };
