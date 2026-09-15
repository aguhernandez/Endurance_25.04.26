import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { runATPSimulation } from '../lib/banisterEngine';
import { computeWeeklySummaries, WeeklySummaryData, CompletedSession, PlannedWorkout, PhysiologyData } from '../lib/weeklySummary';
import { ATPPlan, ATPEvent } from '../types/workout';

interface WeeklyAtpSummaryResult {
  allWeeks: WeeklySummaryData[];
  currentWeek: WeeklySummaryData | null;
  atpPlan: ATPPlan | null;
  sessionsPerWeek: number;
  loading: boolean;
  refresh: () => void;
}

export function useWeeklyAtpSummary(athleteId: string | null | undefined): WeeklyAtpSummaryResult {
  const [allWeeks, setAllWeeks] = useState<WeeklySummaryData[]>([]);
  const [currentWeek, setCurrentWeek] = useState<WeeklySummaryData | null>(null);
  const [atpPlan, setAtpPlan] = useState<ATPPlan | null>(null);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const refresh = () => setRefreshToken(t => t + 1);

  useEffect(() => {
    if (!athleteId) {
      setAllWeeks([]);
      setCurrentWeek(null);
      setAtpPlan(null);
      return;
    }
    loadData(athleteId);
  }, [athleteId, refreshToken]);

  async function loadData(id: string) {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const [planRes, ftpRes, physRes, sessionsRes, workoutsRes] = await Promise.all([
        supabase
          .from('atp_plans')
          .select('*')
          .eq('athlete_id', id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('athlete_ftp')
          .select('current_ftp_watts')
          .eq('athlete_id', id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('athlete_physiology')
          .select('run_pace_z4_min, run_pace_z4_max, swim_css_per_100m, swim_pace_z4_min, swim_pace_z4_max')
          .eq('athlete_id', id)
          .maybeSingle(),
        supabase
          .from('training_sessions')
          .select('session_date, sport, duration_minutes, avg_power_watts, avg_pace_per_km, perceived_effort')
          .eq('athlete_id', id)
          .eq('status', 'completed')
          .gte('session_date', cutoffStr)
          .order('session_date'),
        supabase
          .from('workouts')
          .select('scheduled_date, sport, estimated_duration_minutes, estimated_impulse, name, status')
          .eq('athlete_id', id)
          .not('scheduled_date', 'is', null)
          .gte('scheduled_date', cutoffStr)
          .order('scheduled_date'),
      ]);

      const plan: ATPPlan | null = planRes.data;
      setAtpPlan(plan);

      if (!plan) {
        setAllWeeks([]);
        setCurrentWeek(null);
        setLoading(false);
        return;
      }

      const [eventsRes, overridesRes] = await Promise.all([
        supabase.from('atp_events').select('*').eq('plan_id', plan.id).order('event_date'),
        supabase.from('atp_week_overrides').select('*').eq('plan_id', plan.id).order('week_number'),
      ]);

      const events = (eventsRes.data || []) as ATPEvent[];
      const overrides = (overridesRes.data || []).map((o: any) => ({
        weekNumber: o.week_number,
        overrideImpulse: o.override_impulse,
      }));

      const engineEvents = events.map(e => ({
        id: e.id,
        eventName: e.event_name,
        eventDate: e.event_date,
        priority: e.priority,
      }));

      const { weeks } = runATPSimulation(
        {
          caStart: plan.ca_start,
          alStart: plan.al_start,
          tauChronic: plan.tau_chronic,
          tauAcute: plan.tau_acute,
          rbMin: plan.rb_min,
          rbPeakTarget: plan.rb_peak_target,
          caTargetMainEvent: plan.ca_target_main_event,
          planStartDate: plan.plan_start_date,
        },
        engineEvents,
        overrides
      );

      if (weeks.length === 0) {
        setAllWeeks([]);
        setCurrentWeek(null);
        setLoading(false);
        return;
      }

      const ftp = ftpRes.data?.current_ftp_watts ?? null;
      const physiology = physRes.data as PhysiologyData | null;
      const completedSessions = (sessionsRes.data || []) as CompletedSession[];
      const plannedWorkouts = (workoutsRes.data || []) as PlannedWorkout[];

      const summaries = computeWeeklySummaries(
        weeks,
        completedSessions,
        plannedWorkouts,
        ftp,
        physiology,
        today
      );

      setAllWeeks(summaries);

      const currentIdx = summaries.findIndex(w => w.isCurrentWeek);
      if (currentIdx >= 0) {
        setCurrentWeek(summaries[currentIdx]);
      } else {
        setCurrentWeek(summaries[summaries.length - 1] || null);
      }

      const currentSummary = summaries[currentIdx >= 0 ? currentIdx : summaries.length - 1];
      if (currentSummary) {
        const trainingDays = currentSummary.days.filter(d => d.plannedImpulse > 0).length;
        setSessionsPerWeek(Math.max(1, trainingDays));
      }
    } catch (err) {
      console.error('Error loading weekly ATP summary:', err);
    } finally {
      setLoading(false);
    }
  }

  return { allWeeks, currentWeek, atpPlan, sessionsPerWeek, loading, refresh };
}
