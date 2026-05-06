import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Sport } from '../types/workout';
import {
  DailyImpulseEntry,
  SSRResult,
  CUResult,
  SessionImpulseInput,
  calculateSessionImpulse,
  computeSSR,
  computeCapacityUtilization,
  reconstructCAAndAL,
} from '../lib/sessionDifficulty';

interface SessionForDifficulty {
  session_date: string;
  sport: Sport;
  duration_minutes: number;
  avg_power_watts?: number | null;
  avg_pace_per_km?: number | null;
  perceived_effort?: number | null;
  status: string;
}

interface PhysiologyForDifficulty {
  run_pace_z4_min?: number | null;
  run_pace_z4_max?: number | null;
  swim_css_per_100m?: number | null;
  swim_pace_z4_min?: number | null;
  swim_pace_z4_max?: number | null;
}

function getThresholdPace(sport: Sport, physiology: PhysiologyForDifficulty | null): number | null {
  if (!physiology) return null;
  if (sport === 'running') {
    if (physiology.run_pace_z4_min && physiology.run_pace_z4_max) {
      return (physiology.run_pace_z4_min + physiology.run_pace_z4_max) / 2;
    }
    return physiology.run_pace_z4_min ?? null;
  }
  if (sport === 'swimming') {
    if (physiology.swim_css_per_100m) {
      return physiology.swim_css_per_100m * 10;
    }
    if (physiology.swim_pace_z4_min && physiology.swim_pace_z4_max) {
      return (physiology.swim_pace_z4_min + physiology.swim_pace_z4_max) / 2;
    }
  }
  return null;
}

function buildDailyImpulses(
  sessions: SessionForDifficulty[],
  ftp: number | null,
  physiology: PhysiologyForDifficulty | null
): DailyImpulseEntry[] {
  const map = new Map<string, number>();

  for (const s of sessions) {
    if (s.status !== 'completed') continue;

    const input: SessionImpulseInput = {
      durationMinutes: s.duration_minutes,
      sport: s.sport,
      avgPowerWatts: s.avg_power_watts,
      ftp,
      avgPacePerKm: s.avg_pace_per_km,
      thresholdPacePerKm: getThresholdPace(s.sport, physiology),
      perceivedEffort: s.perceived_effort,
    };

    const impulse = calculateSessionImpulse(input);
    const existing = map.get(s.session_date) ?? 0;
    map.set(s.session_date, existing + impulse);
  }

  return Array.from(map.entries()).map(([date, impulse]) => ({ date, impulse }));
}

export interface SessionMetrics {
  ssr: SSRResult;
  cu: CUResult;
}

export interface UseDifficultyResult {
  computeDifficulty: (
    session: SessionForDifficulty & { ftp?: number | null }
  ) => SSRResult | null;
  computeMetrics: (
    session: SessionForDifficulty & { ftp?: number | null }
  ) => SessionMetrics | null;
  isReady: boolean;
}

export function useSessionDifficulty(
  athleteId: string | null | undefined,
  ftp: number | null,
  referenceDate?: string
): UseDifficultyResult {
  const [dailyImpulses, setDailyImpulses] = useState<DailyImpulseEntry[]>([]);
  const [physiology, setPhysiology] = useState<PhysiologyForDifficulty | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!athleteId) return;

    const load = async () => {
      const today = new Date();
      const cutoff = new Date(today);
      cutoff.setDate(cutoff.getDate() - 90);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const [sessionsResult, physResult] = await Promise.all([
        supabase
          .from('training_sessions')
          .select('session_date, sport, duration_minutes, avg_power_watts, avg_pace_per_km, perceived_effort, status')
          .eq('athlete_id', athleteId)
          .eq('status', 'completed')
          .gte('session_date', cutoffStr)
          .order('session_date'),
        supabase
          .from('athlete_physiology')
          .select('run_pace_z4_min, run_pace_z4_max, swim_css_per_100m, swim_pace_z4_min, swim_pace_z4_max')
          .eq('athlete_id', athleteId)
          .maybeSingle(),
      ]);

      const sessions = (sessionsResult.data ?? []) as SessionForDifficulty[];
      const phys = physResult.data as PhysiologyForDifficulty | null;

      setPhysiology(phys);
      setDailyImpulses(buildDailyImpulses(sessions, ftp, phys));
      setIsReady(true);
    };

    load();
  }, [athleteId, ftp]);

  const computeDifficulty = useCallback(
    (session: SessionForDifficulty & { ftp?: number | null }): SSRResult | null => {
      if (!isReady) return null;

      const sessionFtp = session.ftp ?? ftp;
      const input: SessionImpulseInput = {
        durationMinutes: session.duration_minutes,
        sport: session.sport,
        avgPowerWatts: session.avg_power_watts,
        ftp: sessionFtp,
        avgPacePerKm: session.avg_pace_per_km,
        thresholdPacePerKm: getThresholdPace(session.sport, physiology),
        perceivedEffort: session.perceived_effort,
      };

      const sessionImpulse = calculateSessionImpulse(input);

      const targetDate = referenceDate ?? session.session_date;
      const impulsesBeforeSession = dailyImpulses.filter(
        (d) => d.date < targetDate
      );

      const { ca, al } = reconstructCAAndAL(impulsesBeforeSession, targetDate);
      const rb = ca - al;

      if (ca <= 0) return null;

      return computeSSR(sessionImpulse, ca, rb);
    },
    [isReady, dailyImpulses, ftp, physiology, referenceDate]
  );

  const computeMetrics = useCallback(
    (session: SessionForDifficulty & { ftp?: number | null }): SessionMetrics | null => {
      if (!isReady) return null;

      const sessionFtp = session.ftp ?? ftp;
      const input: SessionImpulseInput = {
        durationMinutes: session.duration_minutes,
        sport: session.sport,
        avgPowerWatts: session.avg_power_watts,
        ftp: sessionFtp,
        avgPacePerKm: session.avg_pace_per_km,
        thresholdPacePerKm: getThresholdPace(session.sport, physiology),
        perceivedEffort: session.perceived_effort,
      };

      const sessionImpulse = calculateSessionImpulse(input);

      const targetDate = referenceDate ?? session.session_date;
      const impulsesBeforeSession = dailyImpulses.filter(
        (d) => d.date < targetDate
      );

      const { ca, al } = reconstructCAAndAL(impulsesBeforeSession, targetDate);
      const rb = ca - al;

      if (ca <= 0) return null;

      const ssr = computeSSR(sessionImpulse, ca, rb);
      const cu = computeCapacityUtilization(sessionImpulse, ca, session.sport);

      return { ssr, cu };
    },
    [isReady, dailyImpulses, ftp, physiology, referenceDate]
  );

  return { computeDifficulty, computeMetrics, isReady };
}
