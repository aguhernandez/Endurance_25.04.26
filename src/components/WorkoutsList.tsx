import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Workout, WorkoutStep, StepType } from '../types/workout';
import { Plus, CreditCard as Edit, Trash2, Download, Clock, ChevronDown, ChevronUp, Repeat2 } from 'lucide-react';
import WorkoutBuilder from './WorkoutBuilder';
import WorkoutPreview, { WorkoutPhysiologyProps } from './WorkoutPreview';
import { downloadFIT } from '../lib/fitExport';
import { getSportIcon, getSportLabel } from '../lib/calculations';
import { getDifficultyClasses, getDifficultyLabel, DifficultyColor, reconstructCAAndAL, calculateSessionImpulse } from '../lib/sessionDifficulty';

interface WorkoutsListProps {
  coachId: string;
  isCoach: boolean;
}

const STEP_META: Record<StepType, { color: string; bg: string; border: string; dot: string }> = {
  warmup:   { color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-400' },
  steady:   { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  interval: { color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-500' },
  recovery: { color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  cooldown: { color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', dot: 'bg-violet-500' },
};

const BASIS_LABELS: Record<string, string> = {
  power: 'Power',
  hr:    'Heart Rate',
  pace:  'Pace',
  rpe:   'RPE',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${m} min`;
}

function formatStepTarget(step: WorkoutStep): string {
  if (step.target_type === 'power') {
    if (step.target_percent_ftp) return `${step.target_percent_ftp}% FTP`;
    if (step.target_min_value && step.target_max_value) return `${step.target_min_value}–${step.target_max_value} W`;
    if (step.target_min_value) return `${step.target_min_value}+ W`;
  }
  if (step.target_type === 'hr') {
    if (step.target_zone) return `Zone ${step.target_zone}`;
    if (step.target_min_value && step.target_max_value) return `${step.target_min_value}–${step.target_max_value} bpm`;
  }
  if (step.target_type === 'pace') {
    if (step.target_zone) return `Zone ${step.target_zone}`;
    if (step.target_min_value && step.target_max_value) {
      const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
      return `${fmt(step.target_max_value)}–${fmt(step.target_min_value)}/km`;
    }
  }
  return '—';
}

function WorkoutStepRow({ step, index }: { step: WorkoutStep; index: number }) {
  const type = step.step_type as StepType;
  const meta = STEP_META[type] || STEP_META.steady;
  const durationStr = step.duration_type === 'time'
    ? formatDuration(step.duration_value)
    : `${(step.duration_value / 1000).toFixed(1)} km`;

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${meta.bg} ${meta.border} transition-all`}>
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="w-5 h-5 rounded-full bg-white/70 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
          {index + 1}
        </span>
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
        <span className={`text-sm font-semibold capitalize font-body ${meta.color}`}>
          {step.step_type}
        </span>
        {step.repeat_times && step.repeat_times > 1 && (
          <span className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md ${meta.bg} ${meta.color} border ${meta.border}`}>
            <Repeat2 size={10} />
            ×{step.repeat_times}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm font-body">
        <span className="flex items-center gap-1 text-gray-600">
          <Clock size={13} className="text-gray-400" />
          {durationStr}
        </span>
        <span className={`font-semibold ${meta.color} min-w-[80px] text-right`}>
          {formatStepTarget(step)}
        </span>
      </div>
    </div>
  );
}

function WorkoutCard({
  workout,
  isCoach,
  steps,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onExport,
  physiology,
}: {
  workout: Workout;
  isCoach: boolean;
  steps: WorkoutStep[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
  physiology?: WorkoutPhysiologyProps;
}) {
  const totalSeconds = steps.reduce((sum, s) => {
    return sum + (s.duration_type === 'time' ? s.duration_value : 300);
  }, 0);
  const totalMin = Math.round(totalSeconds / 60);

  const stepTypeCounts: Partial<Record<StepType, number>> = {};
  steps.forEach(s => {
    stepTypeCounts[s.step_type as StepType] = (stepTypeCounts[s.step_type as StepType] || 0) + 1;
  });

  const sport = (workout as any).sport || 'cycling';
  const basisLabel = BASIS_LABELS[workout.intensity_basis || ''] || workout.intensity_basis?.toUpperCase() || '—';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-primary-yellow dark:hover:border-primary-yellow transition-all duration-200 hover:shadow-md group">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-base">{getSportIcon(sport)}</span>
              <h3 className="text-base font-semibold text-primary-purple dark:text-white font-heading truncate group-hover:text-primary-purple/80 transition">
                {workout.name}
              </h3>
            </div>

            {workout.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-3 line-clamp-2">
                {workout.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary-yellow/15 text-primary-purple dark:text-yellow-300 font-body">
                {basisLabel}
              </span>
              {workout.difficulty_color && (() => {
                const diffCls = getDifficultyClasses(workout.difficulty_color as DifficultyColor);
                return (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${diffCls.badge}`}>
                    <span className={`w-2 h-2 rounded-full ${diffCls.dot}`} />
                    {getDifficultyLabel(workout.difficulty_color as DifficultyColor)}
                  </span>
                );
              })()}
              {totalMin > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-body">
                  <Clock size={11} />
                  {totalMin} min
                </span>
              )}
              {steps.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-body">
                  {steps.length} steps
                </span>
              )}
              {steps.length === 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-body">
                  No steps loaded
                </span>
              )}

              {Object.entries(stepTypeCounts).map(([type, count]) => {
                const meta = STEP_META[type as StepType];
                if (!meta) return null;
                return (
                  <span
                    key={type}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-body ${meta.bg} ${meta.color} ${meta.border}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {count}× {type}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {isCoach && (
              <>
                <button
                  onClick={onExport}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition"
                  title="Export to FIT"
                >
                  <Download size={17} />
                </button>
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                  title="Edit workout"
                >
                  <Edit size={17} />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  title="Delete workout"
                >
                  <Trash2 size={17} />
                </button>
              </>
            )}
            <button
              onClick={onToggleExpand}
              className="p-2 text-gray-400 hover:text-primary-purple dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition ml-1"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700">
          {steps.length > 0 ? (
            <>
              <div className="px-5 pt-4 pb-2">
                <WorkoutPreview steps={steps} sport={sport} physiology={physiology} />
              </div>
              <div className="px-5 pb-5 pt-2">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 font-body">
                  Steps
                </p>
                <div className="space-y-1.5">
                  {steps.map((step, i) => (
                    <WorkoutStepRow key={step.id} step={step} index={i} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500 font-body">
              This workout has no steps.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WorkoutsList({ coachId, isCoach }: WorkoutsListProps) {
  const { profile } = useAuth();
  const zoneSystem: '5' | '7' = (profile?.preferred_zone_system ?? '5') as '5' | '7';
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | undefined>();
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [workoutSteps, setWorkoutSteps] = useState<{ [key: string]: WorkoutStep[] }>({});
  const [physiology, setPhysiology] = useState<WorkoutPhysiologyProps | undefined>(undefined);

  useEffect(() => {
    loadWorkouts();
    loadPhysiology();
  }, [coachId]);

  const loadPhysiology = async () => {
    if (!coachId) return;

    const [ftpResult, physResult, sessionsResult] = await Promise.all([
      supabase
        .from('athlete_ftp')
        .select('current_ftp_watts')
        .eq('athlete_id', coachId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('athlete_physiology')
        .select('run_pace_z4_min, run_pace_z4_max, swim_css_per_100m, swim_pace_z4_min, swim_pace_z4_max, zone_system')
        .eq('athlete_id', coachId)
        .maybeSingle(),
      supabase
        .from('training_sessions')
        .select('session_date, sport, duration_minutes, avg_power_watts, avg_pace_per_km, perceived_effort, status')
        .eq('athlete_id', coachId)
        .eq('status', 'completed')
        .gte('session_date', (() => {
          const d = new Date();
          d.setDate(d.getDate() - 90);
          return d.toISOString().split('T')[0];
        })())
        .order('session_date'),
    ]);

    const ftp = ftpResult.data?.current_ftp_watts ?? null;
    const phys = physResult.data;

    let runThreshold: number | null = null;
    if (phys?.run_pace_z4_min && phys?.run_pace_z4_max) {
      runThreshold = (phys.run_pace_z4_min + phys.run_pace_z4_max) / 2;
    } else if (phys?.run_pace_z4_min) {
      runThreshold = phys.run_pace_z4_min;
    }

    let swimThreshold: number | null = null;
    if (phys?.swim_css_per_100m) {
      swimThreshold = phys.swim_css_per_100m * 10;
    } else if (phys?.swim_pace_z4_min && phys?.swim_pace_z4_max) {
      swimThreshold = (phys.swim_pace_z4_min + phys.swim_pace_z4_max) / 2;
    }

    let currentCA: number | null = null;
    let currentRB: number | null = null;

    if (sessionsResult.data && sessionsResult.data.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const dailyMap = new Map<string, number>();

      for (const s of sessionsResult.data) {
        if (s.status !== 'completed') continue;
        const imp = calculateSessionImpulse({
          durationMinutes: s.duration_minutes,
          sport: s.sport,
          avgPowerWatts: s.avg_power_watts,
          ftp,
          avgPacePerKm: s.avg_pace_per_km,
          thresholdPacePerKm: runThreshold,
          perceivedEffort: s.perceived_effort,
        });
        const existing = dailyMap.get(s.session_date) ?? 0;
        dailyMap.set(s.session_date, existing + imp);
      }

      const dailyImpulses = Array.from(dailyMap.entries()).map(([date, impulse]) => ({ date, impulse }));
      const { ca, rb } = reconstructCAAndAL(dailyImpulses, today);
      currentCA = ca > 0 ? ca : null;
      currentRB = rb;
    }

    setPhysiology({
      ftp,
      thresholdPacePerKm: runThreshold,
      zoneSystem: (phys?.zone_system as '5' | '7') ?? zoneSystem,
      currentCA,
      currentRB,
    });
  };

  const loadWorkouts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading workouts:', error);
    } else {
      setWorkouts(data || []);
      const ids = (data || []).map((w: Workout) => w.id);
      if (ids.length > 0) {
        const cache: { [key: string]: WorkoutStep[] } = {};
        for (let start = 0; start < ids.length; start += 20) {
          const { data: stepsData, error: stepsError } = await supabase
            .from('workout_steps')
            .select('*')
            .in('workout_id', ids.slice(start, start + 100))
            .order('order');
          if (stepsError) {
            console.error('Error loading workout steps:', stepsError);
            continue;
          }
          for (const step of stepsData || []) {
            if (!cache[step.workout_id]) cache[step.workout_id] = [];
            cache[step.workout_id].push(step);
          }
        }
        setWorkoutSteps(cache);
      }
    }
    setLoading(false);
  };

  const loadWorkoutSteps = async (workoutId: string) => {
    if (workoutSteps[workoutId]) return;

    const { data, error } = await supabase
      .from('workout_steps')
      .select('*')
      .eq('workout_id', workoutId)
      .order('order');

    if (error) {
      console.error('Error loading steps:', error);
      return;
    }
    if (data) {
      setWorkoutSteps(prev => ({ ...prev, [workoutId]: data }));
    }
  };

  const toggleExpand = async (workoutId: string) => {
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null);
    } else {
      setExpandedWorkout(workoutId);
      await loadWorkoutSteps(workoutId);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId);

    if (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout');
    } else {
      loadWorkouts();
    }
  };

  const exportWorkout = async (workout: Workout) => {
    await loadWorkoutSteps(workout.id);
    const steps = workoutSteps[workout.id] || [];

    if (steps.length === 0) {
      alert('This workout has no steps to export');
      return;
    }

    try {
      downloadFIT({ ...workout, steps });
    } catch (err) {
      console.error('Error exporting FIT:', err);
      alert('Failed to export FIT file');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
            <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded-lg w-1/3 mb-3" />
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-lg w-2/3 mb-4" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-full w-20" />
              <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-full w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-purple dark:text-white font-heading">Structured Workouts</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-body text-sm">
            {workouts.length > 0
              ? `${workouts.length} workout${workouts.length !== 1 ? 's' : ''} · ${Object.values(workouts.reduce((acc, w) => ({ ...acc, [(w as any).sport || 'cycling']: true }), {} as Record<string, boolean>)).length} sport${Object.values(workouts.reduce((acc, w) => ({ ...acc, [(w as any).sport || 'cycling']: true }), {} as Record<string, boolean>)).length !== 1 ? 's' : ''}`
              : 'Create and manage structured training workouts'}
          </p>
        </div>
        {isCoach && (
          <button
            onClick={() => {
              setEditingWorkout(undefined);
              setShowBuilder(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Create Workout
          </button>
        )}
      </div>

      {workouts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-yellow/10 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-primary-yellow" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 13l4-4 4 4 5-6 5 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 font-heading">No workouts yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 font-body text-sm max-w-sm mx-auto">
            {isCoach
              ? 'Build your first structured workout with precision targets for each step'
              : 'No workouts have been created for you yet'}
          </p>
          {isCoach && (
            <button
              onClick={() => {
                setEditingWorkout(undefined);
                setShowBuilder(true);
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Create Your First Workout
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => {
            const steps = workoutSteps[workout.id] || [];
            const isExpanded = expandedWorkout === workout.id;

            return (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                isCoach={isCoach}
                steps={steps}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleExpand(workout.id)}
                onEdit={() => {
                  setEditingWorkout(workout);
                  setShowBuilder(true);
                }}
                onDelete={() => deleteWorkout(workout.id)}
                onExport={() => exportWorkout(workout)}
                physiology={physiology}
              />
            );
          })}
        </div>
      )}

      {showBuilder && (
        <WorkoutBuilder
          workout={editingWorkout}
          onClose={() => {
            setShowBuilder(false);
            setEditingWorkout(undefined);
          }}
          onSaved={loadWorkouts}
          coachId={coachId}
          zoneSystem={zoneSystem}
        />
      )}
    </div>
  );
}
