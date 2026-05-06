import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Clock, Zap, Copy, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Workout, WorkoutStep } from '../../types/workout';

interface LibraryPanelProps {
  currentSport: string;
  onLoadWorkout: (workout: Workout, steps: WorkoutStep[], mode: 'replace' | 'append') => void;
}

const SPORT_ICONS: Record<string, string> = {
  cycling: '🚴',
  running: '🏃',
  swimming: '🏊',
  other: '🏋',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
};

export default function LibraryPanel({ currentSport, onLoadWorkout }: LibraryPanelProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stepsCache, setStepsCache] = useState<Record<string, WorkoutStep[]>>({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState<string>(currentSport || 'all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('workouts')
        .select('*')
        .eq('is_library', true)
        .order('name');
      setWorkouts(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function loadSteps(workoutId: string): Promise<WorkoutStep[]> {
    if (stepsCache[workoutId]) return stepsCache[workoutId];
    const { data } = await supabase
      .from('workout_steps')
      .select('*')
      .eq('workout_id', workoutId)
      .order('order');
    const steps = (data || []) as WorkoutStep[];
    setStepsCache(prev => ({ ...prev, [workoutId]: steps }));
    return steps;
  }

  async function handleExpand(id: string) {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    await loadSteps(id);
  }

  async function handleLoad(workout: Workout, mode: 'replace' | 'append') {
    const steps = await loadSteps(workout.id);
    onLoadWorkout(workout, steps, mode);
    setConfirmId(null);
  }

  const filtered = workouts.filter(w => {
    const matchSport = sportFilter === 'all' || w.sport === sportFilter;
    const matchSearch = !search ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      (w.description || '').toLowerCase().includes(search.toLowerCase());
    return matchSport && matchSearch;
  });

  function formatDur(seconds: number) {
    const m = Math.floor(seconds / 60);
    return `${m}m`;
  }

  function getTotalDuration(steps: WorkoutStep[]) {
    return steps.reduce((s, st) => s + (st.duration_type === 'time' ? (st.duration_value || 0) : 300), 0);
  }

  const sports = ['all', 'cycling', 'running', 'swimming'];

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pb-2 space-y-2 flex-shrink-0">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search library..."
            className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-primary-yellow focus:border-primary-yellow outline-none"
          />
        </div>

        <div className="flex gap-1 flex-wrap">
          {sports.map(s => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full transition ${
                sportFilter === s
                  ? 'bg-primary-yellow text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {s === 'all' ? 'All' : (SPORT_ICONS[s] || '') + ' ' + s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1 space-y-1 min-h-0">
        {loading && (
          <div className="py-8 text-center text-xs text-gray-400">Loading library...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-gray-400">No workouts found</div>
        )}

        {filtered.map(workout => {
          const isOpen = expandedId === workout.id;
          const steps = stepsCache[workout.id] || [];
          const isConfirming = confirmId === workout.id;

          return (
            <div
              key={workout.id}
              className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => handleExpand(workout.id)}
                className="w-full flex items-start gap-2 px-2.5 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <span className="text-sm mt-0.5 flex-shrink-0">{SPORT_ICONS[workout.sport] || '🏋'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">
                    {workout.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {workout.estimated_duration_minutes && (
                      <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                        <Clock size={9} />
                        {workout.estimated_duration_minutes}m
                      </span>
                    )}
                    {workout.difficulty_color && DIFFICULTY_COLORS[workout.difficulty_color] && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${DIFFICULTY_COLORS[workout.difficulty_color]}`}>
                        {workout.difficulty_color === 'green' ? 'Easy' : workout.difficulty_color === 'yellow' ? 'Moderate' : 'Hard'}
                      </span>
                    )}
                  </div>
                </div>
                {isOpen ? <ChevronDown size={12} className="text-gray-400 flex-shrink-0 mt-0.5" /> : <ChevronRight size={12} className="text-gray-400 flex-shrink-0 mt-0.5" />}
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 dark:border-gray-700 px-2.5 py-2 bg-gray-50 dark:bg-gray-800">
                  {workout.description && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
                      {workout.description}
                    </p>
                  )}

                  {steps.length > 0 ? (
                    <div className="space-y-0.5 mb-2">
                      {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px]">
                          <span className="w-3.5 h-3.5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-[8px] font-bold text-gray-500 flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300 capitalize font-medium">{step.step_type}</span>
                          <span className="text-gray-400">
                            {step.duration_type === 'time' ? formatDur(step.duration_value || 0) : `${((step.duration_value || 0) / 1000).toFixed(1)}km`}
                          </span>
                          {step.target_percent_ftp && (
                            <span className="text-gray-400">{step.target_percent_ftp}% FTP</span>
                          )}
                          {step.target_zone && !step.target_percent_ftp && (
                            <span className="text-gray-400">Z{step.target_zone}</span>
                          )}
                        </div>
                      ))}
                      <p className="text-[10px] text-gray-400 pt-1 flex items-center gap-1">
                        <Zap size={9} />
                        {formatDur(getTotalDuration(steps))} total · {steps.length} steps
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 mb-2">No steps available</p>
                  )}

                  {!isConfirming ? (
                    <button
                      onClick={() => setConfirmId(workout.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-semibold bg-primary-yellow hover:bg-amber-400 text-gray-900 rounded-lg transition"
                    >
                      <Copy size={10} />
                      Use this workout
                    </button>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 text-center mb-1">Load steps as...</p>
                      <button
                        onClick={() => handleLoad(workout, 'replace')}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-lg transition"
                      >
                        Replace current steps
                      </button>
                      <button
                        onClick={() => handleLoad(workout, 'append')}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 rounded-lg transition"
                      >
                        <Plus size={10} />
                        Append to current
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="w-full py-1 text-[10px] text-gray-400 hover:text-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
