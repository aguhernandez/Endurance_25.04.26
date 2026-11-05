import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  computeMicrocycleAdaptation,
  classifyFatigueState,
  MicrocycleAdaptationResult,
  RecentSession,
  PlannedSessionInput,
  FatigueClassification,
} from '../lib/microcycleAdaptationEngine';
import { calculateImpulse, reconstructLoadState } from '../lib/impulseEngine';
import { StoredWorkoutAnalysis } from './useWorkoutAnalysis';
import { Sport } from '../types/workout';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function weekStartDate(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().split('T')[0];
}

function currentWeekNumber(planStartDate: string): number {
  const start = new Date(planStartDate + 'T00:00:00');
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

function hasHighIntensitySteps(steps: Array<{
  step_type?: string;
  target_zone?: number;
  target_percent_ftp?: number;
  target_min_value?: number;
}> | null | undefined): boolean {
  if (!steps || steps.length === 0) return false;
  return steps.some(s =>
    s.step_type === 'interval' ||
    (s.target_zone !== undefined && s.target_zone !== null && s.target_zone >= 4) ||
    (s.target_percent_ftp !== undefined && s.target_percent_ftp !== null && s.target_percent_ftp >= 85) ||
    (s.target_min_value !== undefined && s.target_min_value !== null && s.target_min_value >= 85)
  );
}

function getIntervalComplexity(steps: Array<{
  step_type?: string;
  repeat_times?: number;
}> | null | undefined): 'low' | 'medium' | 'high' {
  if (!steps || steps.length === 0) return 'low';
  const intervalSteps = steps.filter(s => s.step_type === 'interval');
  if (intervalSteps.length === 0) return 'low';
  const maxRepeats = Math.max(...intervalSteps.map(s => s.repeat_times ?? 1));
  if (maxRepeats >= 6 || intervalSteps.length >= 4) return 'high';
  if (maxRepeats >= 3 || intervalSteps.length >= 2) return 'medium';
  return 'low';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface MicrocycleAdaptationState {
  result: MicrocycleAdaptationResult | null;
  fatigueClassification: FatigueClassification | null;
  loading: boolean;
  error: string | null;
}

export function useMicrocycleAdaptation(
  athleteId: string | null,
  planStartDate: string | null
) {
  const [state, setState] = useState<MicrocycleAdaptationState>({
    result: null,
    fatigueClassification: null,
    loading: false,
    error: null,
  });

  const compute = useCallback(async () => {
    if (!athleteId) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const today = new Date().toISOString().split('T')[0];
      const lookbackDays = 120;
      const lookbackDate = new Date();
      lookbackDate.setDate(lookbackDate.getDate() - lookbackDays);
      const lookbackStr = lookbackDate.toISOString().split('T')[0];

      const [analysesRes, plannedRes] = await Promise.all([
        supabase
          .from('workout_analysis')
          .select('*')
          .eq('athlete_id', athleteId)
          .order('created_at', { ascending: false })
          .limit(10),

        supabase
          .from('workouts')
          .select('id, name, sport, estimated_duration_minutes, estimated_impulse, actual_avg_intensity_percent_ftp, scheduled_date, status, steps:workout_steps(*)')
          .eq('athlete_id', athleteId)
          .eq('status', 'planned')
          .gte('scheduled_date', today)
          .order('scheduled_date', { ascending: true })
          .limit(14),
      ]);

      const storedAnalyses: StoredWorkoutAnalysis[] = (analysesRes.data ?? []) as StoredWorkoutAnalysis[];

      // Build daily impulses for Banister reconstruction
      const { data: sessions } = await supabase
        .from('training_sessions')
        .select('session_date, sport, duration_minutes, avg_power_watts, avg_pace_per_km, perceived_effort')
        .eq('athlete_id', athleteId)
        .eq('status', 'completed')
        .gte('session_date', lookbackStr)
        .order('session_date', { ascending: true });

      const [ftpRes, physiologyRes] = await Promise.all([
        supabase.from('athlete_ftp').select('current_ftp_watts').eq('athlete_id', athleteId).limit(1).maybeSingle(),
        supabase.from('athlete_physiology').select('run_pace_z4_min, run_pace_z4_max, swim_css_per_100m, swim_pace_z4_min, swim_pace_z4_max').eq('athlete_id', athleteId).maybeSingle(),
      ]);
      if (ftpRes.error || physiologyRes.error) throw ftpRes.error || physiologyRes.error;
      const phys = physiologyRes.data;
      const dailyImpulses = (sessions ?? [])
        .filter(s => s.session_date && s.duration_minutes > 0)
        .map(s => ({
          date: s.session_date as string,
          impulse: calculateImpulse({
            sport: s.sport as Sport,
            durationMinutes: s.duration_minutes,
            avgPowerWatts: s.avg_power_watts,
            ftp: ftpRes.data?.current_ftp_watts,
            avgPacePerKm: s.avg_pace_per_km,
            thresholdPacePerKm: s.sport === 'running'
              ? (phys?.run_pace_z4_min && phys?.run_pace_z4_max ? (phys.run_pace_z4_min + phys.run_pace_z4_max) / 2 : phys?.run_pace_z4_min)
              : s.sport === 'swimming' ? (phys?.swim_css_per_100m ? phys.swim_css_per_100m * 10 : phys?.swim_pace_z4_min && phys?.swim_pace_z4_max ? (phys.swim_pace_z4_min + phys.swim_pace_z4_max) / 2 : null) : null,
          }).impulse,
        }))
        .filter((s): s is { date: string; impulse: number } => s.impulse != null);

      if (dailyImpulses.length !== (sessions ?? []).filter(s => s.session_date && s.duration_minutes > 0).length) throw new Error("Insufficient data to reconstruct training load");
      const state = reconstructLoadState(dailyImpulses, today);
      const fitness = state.ca;
      const fatigue = state.al;

      const fatigueClassification = classifyFatigueState(fitness, fatigue);

      // Map stored analyses to RecentSession format
      const recentSessions: RecentSession[] = storedAnalyses
        .slice(0, 5)
        .map(a => ({
          sessionId: a.workout_id ?? a.id,
          date: a.created_at.split('T')[0],
          sport: 'cycling' as Sport,
          finalScore: a.final_score,
          classification: a.classification,
          impulseActual: a.impulse_actual,
          impulsePlanned: a.impulse_planned,
          actualDurationMinutes: 0,
          plannedDurationMinutes: null,
          deviations: (a.deviations ?? []).map(d => ({
            field: d.field,
            pct: d.pct,
            direction: d.direction,
          })),
        }));

      // Map planned workouts to PlannedSessionInput
      const plannedSessions: PlannedSessionInput[] = (plannedRes.data ?? [])
        .filter(w => w.estimated_duration_minutes && w.estimated_duration_minutes > 0)
        .map(w => {
          const stepsArr = Array.isArray(w.steps) ? w.steps : [];
          return {
            sessionId: w.id as string,
            date: w.scheduled_date as string,
            sport: (w.sport as Sport) ?? 'cycling',
            name: w.name as string,
            plannedDurationMinutes: (w.estimated_duration_minutes as number),
            plannedImpulse: (w.estimated_impulse as number) ?? 0,
            hasHighIntensity: hasHighIntensitySteps(stepsArr),
            plannedAvgIntensityPctFtp: w.actual_avg_intensity_percent_ftp as number | null,
            hasIntervals: stepsArr.some((s: any) => s.step_type === 'interval'),
            intervalComplexity: getIntervalComplexity(stepsArr),
          };
        });

      const weekStr = weekStartDate();
      const weekNum = planStartDate ? currentWeekNumber(planStartDate) : 0;

      const result = computeMicrocycleAdaptation({
        athleteId,
        weekNumber: weekNum,
        weekStartDate: weekStr,
        fitness,
        fatigue,
        recentSessions,
        plannedSessions,
      });

      setState({
        result,
        fatigueClassification,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error('Microcycle adaptation computation failed:', err);
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, [athleteId, planStartDate]);

  return { ...state, compute };
}
