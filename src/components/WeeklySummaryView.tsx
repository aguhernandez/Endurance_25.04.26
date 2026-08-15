import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useATPPlan } from '../hooks/useATPPlan';
import { runATPSimulation } from '../lib/banisterEngine';
import { ChevronLeft, ChevronRight, TrendingUp, Activity, Zap, Calendar } from 'lucide-react';
import { computeWeeklySummaries, WeeklySummaryData, getRBStatus, CompletedSession, PlannedWorkout, PhysiologyData } from '../lib/weeklySummary';
import WeeklyChart from './WeeklyChart';
import WeeklyFeedbackPanel from './WeeklyFeedbackPanel';
import QuickScheduleButton from './QuickScheduleButton';
import WeeklyPlanningGuidance from './WeeklyPlanningGuidance';

interface WeeklySummaryViewProps {
  athleteId: string;
  onNavigate?: (view: string) => void;
}

export default function WeeklySummaryView({ athleteId, onNavigate }: WeeklySummaryViewProps) {
  const { profile } = useAuth();
  const { plan: atpPlan, events: atpEvents, engineOverrides, loading: atpLoading } = useATPPlan(athleteId);

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [ftp, setFtp] = useState<number | null>(null);
  const [physiology, setPhysiology] = useState<PhysiologyData | null>(null);
  const [athleteName, setAthleteName] = useState<string>('Athlete');
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([]);

  const atpWeeks = useMemo(() => {
    if (!atpPlan) return [];
    const engineEvents = atpEvents.map(e => ({
      id: e.id,
      eventName: e.event_name,
      eventDate: e.event_date,
      priority: e.priority,
    }));
    const { weeks } = runATPSimulation(
      {
        caStart: atpPlan.ca_start,
        alStart: atpPlan.al_start,
        tauChronic: atpPlan.tau_chronic,
        tauAcute: atpPlan.tau_acute,
        rbMin: atpPlan.rb_min,
        rbPeakTarget: atpPlan.rb_peak_target,
        caTargetMainEvent: atpPlan.ca_target_main_event,
        planStartDate: atpPlan.plan_start_date,
      },
      engineEvents,
      engineOverrides
    );
    return weeks;
  }, [atpPlan, atpEvents, engineOverrides]);

  useEffect(() => {
    if (!athleteId || atpLoading) return;
    loadData();
  }, [athleteId, atpLoading]);

  useEffect(() => {
    if (atpWeeks.length === 0 || completedSessions.length === 0 && plannedWorkouts.length === 0 && !ftp) return;
    const today = new Date().toISOString().split('T')[0];
    if (atpWeeks.length > 0) {
      const summaries = computeWeeklySummaries(
        atpWeeks,
        completedSessions,
        plannedWorkouts,
        ftp,
        physiology,
        today
      );
      setWeeklySummaries(summaries);
      const currentWeekIdx = summaries.findIndex(w => w.isCurrentWeek);
      if (currentWeekIdx >= 0) {
        setCurrentWeekIndex(currentWeekIdx);
      }
    }
  }, [atpWeeks, completedSessions, plannedWorkouts, ftp, physiology]);

  const loadData = async () => {
    setLoading(true);
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const [ftpResult, physResult, sessionsResult, workoutsResult, profileResult] = await Promise.all([
        supabase
          .from('athlete_ftp')
          .select('ftp_watts')
          .eq('athlete_id', athleteId)
          .order('recorded_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('athlete_physiology')
          .select('run_pace_z4_min, run_pace_z4_max, swim_css_per_100m, swim_pace_z4_min, swim_pace_z4_max')
          .eq('athlete_id', athleteId)
          .maybeSingle(),
        supabase
          .from('training_sessions')
          .select('session_date, sport, duration_minutes, avg_power_watts, avg_pace_per_km, perceived_effort')
          .eq('athlete_id', athleteId)
          .eq('status', 'completed')
          .gte('session_date', cutoffStr)
          .order('session_date'),
        supabase
          .from('workouts')
          .select('scheduled_date, sport, estimated_duration_minutes, estimated_impulse, name, status')
          .eq('athlete_id', athleteId)
          .not('scheduled_date', 'is', null)
          .gte('scheduled_date', cutoffStr)
          .order('scheduled_date'),
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', athleteId)
          .maybeSingle(),
      ]);

      const ftpValue = ftpResult.data?.ftp_watts ?? null;
      const physValue = physResult.data as PhysiologyData | null;
      const sessions = (sessionsResult.data || []) as CompletedSession[];
      const workouts = (workoutsResult.data || []) as PlannedWorkout[];
      const athleteFullName = profileResult.data?.full_name || 'Athlete';

      setFtp(ftpValue);
      setPhysiology(physValue);
      setAthleteName(athleteFullName);
      setCompletedSessions(sessions);
      setPlannedWorkouts(workouts);

      if (atpWeeks.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const summaries = computeWeeklySummaries(
          atpWeeks,
          sessions,
          workouts,
          ftpValue,
          physValue,
          today
        );
        setWeeklySummaries(summaries);
        const currentWeekIdx = summaries.findIndex(w => w.isCurrentWeek);
        if (currentWeekIdx >= 0) {
          setCurrentWeekIndex(currentWeekIdx);
        }
      }
    } catch (err) {
      console.error('Error loading weekly summary data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || atpLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading weekly summary...</div>
      </div>
    );
  }

  if (!atpPlan) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-8 text-center">
        <p className="text-amber-800 dark:text-amber-200 font-semibold mb-2">No Annual Training Plan</p>
        <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">Create an ATP to see weekly summaries</p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('atp')}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold transition"
          >
            Crear Plan ATP
          </button>
        )}
      </div>
    );
  }

  if (weeklySummaries.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No weeks available in your training plan</p>
      </div>
    );
  }

  const week = weeklySummaries[currentWeekIndex];
  const canGoPrev = currentWeekIndex > 0;
  const canGoNext = currentWeekIndex < weeklySummaries.length - 1;

  const rbStatus = getRBStatus(week.actualEndRB || week.projectedEndRB);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const weekStart = new Date(week.weekStartDate + 'T00:00:00');

  const weekPlannedWorkouts = week.days
    .filter(day => day.hasPlannedWorkout)
    .map(day => ({
      date: new Date(day.date + 'T00:00:00'),
      name: 'Workout',
      estimated_impulse: day.plannedImpulse,
      status: day.isCompleted ? 'completed' : 'planned'
    }));

  const sessionsPerWeek = Math.max(1, week.days.filter(d => d.plannedImpulse > 0).length);
  const recommendedDays = sessionsPerWeek === 3 ? [1, 3, 5] :
                          sessionsPerWeek === 4 ? [1, 3, 5, 6] :
                          sessionsPerWeek === 5 ? [1, 2, 4, 5, 6] :
                          sessionsPerWeek >= 6 ? [1, 2, 3, 4, 5, 6] :
                          [1, 3, 5];

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-purple dark:text-white font-heading">Weekly Summary</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Week {week.weekNumber + 1} · {formatDate(week.weekStartDate)} - {formatDate(week.weekEndDate)}
            {week.isCurrentWeek && <span className="ml-2 text-primary-yellow font-semibold">• Current Week</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeekIndex(i => Math.max(0, i - 1))}
            disabled={!canGoPrev}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium min-w-[80px] text-center">
            {currentWeekIndex + 1} / {weeklySummaries.length}
          </span>
          <button
            onClick={() => setCurrentWeekIndex(i => Math.min(weeklySummaries.length - 1, i + 1))}
            disabled={!canGoNext}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekly Planning Guidance */}
      <WeeklyPlanningGuidance
        weekStartDate={weekStart}
        athleteId={athleteId}
        athleteName={athleteName}
        targetWeeklyImpulse={week.plannedTotalImpulse}
        targetCA={week.plannedEndCA}
        targetAF={week.plannedEndAF}
        targetRB={week.plannedEndRB}
        plannedWorkouts={weekPlannedWorkouts}
        recommendedSessionDays={recommendedDays}
        sessionsPerWeek={sessionsPerWeek}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weekly Impulse */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-blue-500" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Weekly Impulse</p>
          </div>
          <p className="text-3xl font-bold text-primary-purple dark:text-white mb-1">
            {week.actualTotalImpulse.toFixed(1)}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Planned:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{week.plannedTotalImpulse.toFixed(1)}</span>
            <span className={`ml-auto font-bold ${
              week.actualTotalImpulse >= week.plannedTotalImpulse ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {week.plannedTotalImpulse > 0 ? ((week.actualTotalImpulse / week.plannedTotalImpulse) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>

        {/* Chronic Activity (CA) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-emerald-500" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Chronic Activity (CA)</p>
          </div>
          <p className="text-3xl font-bold text-primary-purple dark:text-white mb-1">
            {(week.actualEndCA || week.projectedEndCA).toFixed(1)}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Avg:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {(week.actualAvgCA || week.plannedAvgCA).toFixed(1)}
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-auto">Fitness</span>
          </div>
        </div>

        {/* Acute Fatigue (AF) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} className="text-amber-500" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Acute Fatigue (AF)</p>
          </div>
          <p className="text-3xl font-bold text-primary-purple dark:text-white mb-1">
            {(week.actualEndAF || week.projectedEndAF).toFixed(1)}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Avg:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {(week.actualAvgAF || week.plannedAvgAF).toFixed(1)}
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-auto">Fatigue</span>
          </div>
        </div>

        {/* Recovery Balance (RB) */}
        <div className={`rounded-xl border p-5 ${rbStatus.bg} ${rbStatus.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className={rbStatus.color} />
            <p className={`text-sm font-semibold uppercase tracking-wide ${rbStatus.color}`}>Recovery Balance (RB)</p>
          </div>
          <p className={`text-3xl font-bold mb-1 ${rbStatus.color}`}>
            {(week.actualEndRB || week.projectedEndRB).toFixed(1)}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-semibold ${rbStatus.color}`}>{rbStatus.label}</span>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <WeeklyChart
        days={week.days}
        plannedEndCA={week.plannedEndCA}
        plannedEndAF={week.plannedEndAF}
        plannedEndRB={week.plannedEndRB}
      />

      {/* Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-primary-purple dark:text-white font-heading">Planned vs Actual</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Planned (ATP)
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Projected
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  Weekly Impulse
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-700 dark:text-gray-300">
                  {week.plannedTotalImpulse.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-primary-purple dark:text-white">
                  {week.actualTotalImpulse.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-700 dark:text-gray-300">
                  {week.projectedTotalImpulse.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <span className={`font-bold ${
                    week.projectedTotalImpulse >= week.plannedTotalImpulse * 0.9
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}>
                    {week.plannedTotalImpulse > 0 ? ((week.projectedTotalImpulse / week.plannedTotalImpulse) * 100).toFixed(0) : 0}%
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  CA (End of Week)
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-700 dark:text-gray-300">
                  {week.plannedEndCA.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-primary-purple dark:text-white">
                  {week.actualEndCA.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-700 dark:text-gray-300">
                  {week.projectedEndCA.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <span className={`font-bold ${
                    Math.abs(week.projectedEndCA - week.plannedEndCA) <= week.plannedEndCA * 0.1
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}>
                    {week.projectedEndCA > week.plannedEndCA ? '+' : ''}
                    {(week.projectedEndCA - week.plannedEndCA).toFixed(1)}
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  AF (End of Week)
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-700 dark:text-gray-300">
                  {week.plannedEndAF.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-primary-purple dark:text-white">
                  {week.actualEndAF.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-700 dark:text-gray-300">
                  {week.projectedEndAF.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <span className={`font-bold ${
                    Math.abs(week.projectedEndAF - week.plannedEndAF) <= week.plannedEndAF * 0.1
                      ? 'text-emerald-600'
                      : 'text-amber-600'
                  }`}>
                    {week.projectedEndAF > week.plannedEndAF ? '+' : ''}
                    {(week.projectedEndAF - week.plannedEndAF).toFixed(1)}
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  RB (End of Week)
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-700 dark:text-gray-300">
                  {week.plannedEndRB.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-primary-purple dark:text-white">
                  {week.actualEndRB.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-700 dark:text-gray-300">
                  {week.projectedEndRB.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <span className={`font-bold ${getRBStatus(week.projectedEndRB).color}`}>
                    {getRBStatus(week.projectedEndRB).label}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-primary-purple dark:text-white font-heading">Daily Breakdown</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {week.completedDays} / {week.totalDays} days completed
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Planned Impulse
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actual Impulse
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  CA
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  AF
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  RB
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {week.days.map((day) => {
                const dayDate = new Date(day.date + 'T00:00:00');
                const dayLabel = dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                return (
                  <tr key={day.date} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition ${
                    day.isEventDay ? 'bg-primary-yellow/10 dark:bg-primary-yellow/5' : ''
                  }`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {dayLabel}
                      {day.isEventDay && (
                        <span className="ml-2 text-xs font-bold text-primary-yellow">
                          {day.eventPriority}-Event
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                      {day.plannedImpulse.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-primary-purple dark:text-white">
                      {day.actualImpulse > 0 ? day.actualImpulse.toFixed(1) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                      {day.actualCA !== null ? day.actualCA.toFixed(1) : day.plannedCA.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                      {day.actualAF !== null ? day.actualAF.toFixed(1) : day.plannedAF.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                      {day.actualRB !== null ? day.actualRB.toFixed(1) : day.plannedRB.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {day.isCompleted ? (
                          <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            Completed
                          </span>
                        ) : day.hasPlannedWorkout ? (
                          <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            Planned
                          </span>
                        ) : (
                          <>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              Rest
                            </span>
                            <QuickScheduleButton
                              athleteId={athleteId}
                              dateStr={day.date}
                              onScheduled={loadData}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Feedback Panel */}
      <WeeklyFeedbackPanel
        athleteId={athleteId}
        weekNumber={week.weekNumber}
        weekStartDate={week.weekStartDate}
        weekEndDate={week.weekEndDate}
        loadVariance={week.plannedTotalImpulse > 0 ? ((week.actualTotalImpulse - week.plannedTotalImpulse) / week.plannedTotalImpulse) * 100 : 0}
        caVariance={week.actualEndCA - week.plannedEndCA}
        afVariance={week.actualEndAF - week.plannedEndAF}
        rbVariance={week.actualEndRB - week.plannedEndRB}
      />
    </div>
  );
}
