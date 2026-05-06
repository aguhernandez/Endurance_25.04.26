import { useState, useEffect, useRef } from 'react';
import { X, Search, Clock, Bike, PersonStanding, Waves, Dumbbell, Repeat2, Check, Users, ChevronDown, Mountain, Filter, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Workout, WorkoutStep } from '../types/workout';
import WorkoutPreview from './WorkoutPreview';

interface AthleteOption {
  id: string;
  full_name: string | null;
  email: string;
}

interface ScheduleWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  isCoach: boolean;
  currentUserId: string;
  onScheduled: () => void;
}

function SportIcon({ sport, className }: { sport: string; className?: string }) {
  const cls = className || 'w-5 h-5';
  switch (sport) {
    case 'cycling':  return <Bike className={cls} />;
    case 'running':  return <PersonStanding className={cls} />;
    case 'swimming': return <Waves className={cls} />;
    default:         return <Dumbbell className={cls} />;
  }
}

const SPORT_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  cycling:  { bg: 'bg-amber-50 dark:bg-amber-900/15',  text: 'text-amber-700 dark:text-amber-400',  border: 'border-amber-200 dark:border-amber-800', accent: '#F59E0B' },
  running:  { bg: 'bg-emerald-50 dark:bg-emerald-900/15', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', accent: '#10B981' },
  swimming: { bg: 'bg-cyan-50 dark:bg-cyan-900/15',    text: 'text-cyan-700 dark:text-cyan-400',    border: 'border-cyan-200 dark:border-cyan-800', accent: '#06B6D4' },
};

const SUB_DISCIPLINE_LABELS: Record<string, string> = {
  road: 'Road', gravel: 'Gravel', mtb: 'MTB', indoor: 'Indoor',
  'road-running': 'Road', track: 'Track', trail: 'Trail', treadmill: 'Treadmill',
  pool: 'Pool', 'open-water': 'Open Water',
};

const WORKOUT_CATEGORIES = [
  { id: 'all', label: 'All Types' },
  { id: 'endurance', label: 'Endurance' },
  { id: 'intervals', label: 'Intervals' },
  { id: 'threshold', label: 'Threshold' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'strength', label: 'Strength' },
];

const TIMES = [
  '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '21:00',
];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export default function ScheduleWorkoutModal({
  isOpen, onClose, selectedDate, isCoach, currentUserId, onScheduled,
}: ScheduleWorkoutModalProps) {
  const [workouts, setWorkouts] = useState<(Workout & { tags?: string[]; category?: string; difficulty?: string })[]>([]);
  const [stepsCache, setStepsCache] = useState<Record<string, WorkoutStep[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [athletes, setAthletes] = useState<AthleteOption[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterSport, setFilterSport] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [manualTime, setManualTime] = useState('');
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadWorkouts();
      if (isCoach) loadAthletes();
      setSelectedWorkout(null);
      setSearch('');
      setExpandedId(null);
      setError(null);
      setScheduledTime('');
      setManualTime('');
      setShowTimeDropdown(false);
      setFilterSport('all');
      setFilterCategory('all');
    }
  }, [isOpen, isCoach]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
        setShowTimeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadWorkouts() {
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });
    setWorkouts(data || []);
  }

  async function loadAthletes() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'athlete')
      .order('full_name');
    setAthletes(data || []);
    if (data && data.length > 0) setSelectedAthleteId(data[0].id);
  }

  async function loadSteps(workoutId: string) {
    if (stepsCache[workoutId]) return;
    const { data } = await supabase
      .from('workout_steps')
      .select('*')
      .eq('workout_id', workoutId)
      .order('order');
    if (data) setStepsCache(prev => ({ ...prev, [workoutId]: data }));
  }

  async function toggleExpand(workoutId: string) {
    if (expandedId === workoutId) {
      setExpandedId(null);
    } else {
      setExpandedId(workoutId);
      await loadSteps(workoutId);
    }
  }

  function handleTimeSelect(time: string) {
    setScheduledTime(time);
    setManualTime('');
    setShowTimeDropdown(false);
  }

  function handleManualTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setManualTime(val);
    if (/^\d{2}:\d{2}$/.test(val)) {
      setScheduledTime(val);
    }
  }

  async function handleSchedule() {
    if (!selectedWorkout || !selectedDate) return;
    const targetId = isCoach ? selectedAthleteId : currentUserId;
    if (!targetId) { setError('Please select an athlete.'); return; }

    setSaving(true);
    setError(null);

    try {
      const y = selectedDate.getFullYear();
      const mo = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dy = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${y}-${mo}-${dy}`;

      const isLibrary = (selectedWorkout as any).is_library === true;

      if (isLibrary) {
        const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = selectedWorkout as any;
        const newWorkout = {
          ...rest,
          is_library: false,
          scheduled_date: dateStr,
          athlete_id: targetId,
          coach_id: isCoach ? currentUserId : (rest.coach_id ?? null),
          status: 'planned',
          ...(scheduledTime ? { scheduled_time: scheduledTime } : {}),
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('workouts')
          .insert(newWorkout)
          .select()
          .single();

        if (insertErr) throw insertErr;

        const originalSteps = stepsCache[selectedWorkout.id];
        if (!originalSteps) {
          const { data: fetchedSteps } = await supabase
            .from('workout_steps')
            .select('*')
            .eq('workout_id', selectedWorkout.id)
            .order('order');
          if (fetchedSteps && fetchedSteps.length > 0 && inserted) {
            const newSteps = fetchedSteps.map(({ id: _sid, workout_id: _wid, created_at: _sca, ...step }: any) => ({
              ...step,
              workout_id: inserted.id,
            }));
            await supabase.from('workout_steps').insert(newSteps);
          }
        } else if (originalSteps.length > 0 && inserted) {
          const newSteps = originalSteps.map(({ id: _sid, workout_id: _wid, created_at: _sca, ...step }: any) => ({
            ...step,
            workout_id: inserted.id,
          }));
          await supabase.from('workout_steps').insert(newSteps);
        }
      } else {
        const updateData: Record<string, unknown> = {
          scheduled_date: dateStr,
          athlete_id: targetId,
          coach_id: isCoach ? currentUserId : null,
          is_library: false,
        };
        if (scheduledTime) updateData.scheduled_time = scheduledTime;

        const { error: err } = await supabase
          .from('workouts')
          .update(updateData)
          .eq('id', selectedWorkout.id);

        if (err) throw err;
      }

      onScheduled();
      onClose();
    } catch (e) {
      setError('Failed to schedule workout. Please try again.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const filtered = workouts.filter(w => {
    const sport = (w as any).sport || 'cycling';
    if (filterSport !== 'all' && sport !== filterSport) return false;
    if (filterCategory !== 'all') {
      const steps = stepsCache[w.id] || [];
      const hasIntervals = steps.some(s => s.step_type === 'interval');
      if (filterCategory === 'intervals' && !hasIntervals) return false;
      if (filterCategory !== 'intervals' && (w as any).category && (w as any).category !== filterCategory) return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const tags: string[] = (w as any).tags || [];
    return (
      w.name.toLowerCase().includes(q) ||
      (w.description || '').toLowerCase().includes(q) ||
      tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  const activeSportCount = workouts.reduce((acc, w) => {
    const s = (w as any).sport || 'cycling';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Load from Library</h2>
            {selectedDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{dateLabel}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {isCoach && athletes.length > 0 && (
          <div className="px-6 pt-4 flex-shrink-0">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users size={12} />
              Assign to Athlete
            </label>
            <div className="relative">
              <select
                value={selectedAthleteId}
                onChange={e => setSelectedAthleteId(e.target.value)}
                className="w-full appearance-none border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 pr-10 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fdda36]"
              >
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>{a.full_name || a.email}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="px-6 pt-4 space-y-3 flex-shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search workouts by name, tag..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fdda36]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                showFilters || filterSport !== 'all' || filterCategory !== 'all'
                  ? 'border-[#fdda36] bg-[#fdda36]/10 text-[#514163] dark:text-yellow-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filter
              {(filterSport !== 'all' || filterCategory !== 'all') && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#fdda36] flex-shrink-0" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Filter size={11} />
                  Sport
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All', icon: null },
                    { id: 'cycling', label: 'Cycling', icon: <Bike size={11} /> },
                    { id: 'running', label: 'Running', icon: <PersonStanding size={11} /> },
                    { id: 'swimming', label: 'Swimming', icon: <Waves size={11} /> },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setFilterSport(s.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        filterSport === s.id
                          ? 'bg-[#fdda36] border-[#fdda36] text-[#514163]'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {s.icon}
                      {s.label}
                      {s.id !== 'all' && activeSportCount[s.id] ? (
                        <span className="text-[10px] opacity-60">({activeSportCount[s.id]})</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Workout Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {WORKOUT_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        filterCategory === cat.id
                          ? 'bg-[#fdda36] border-[#fdda36] text-[#514163]'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock size={11} />
              Start Time (optional)
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1" ref={timeDropdownRef}>
                <button
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fdda36] transition"
                >
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className={scheduledTime ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                      {scheduledTime || 'Select time'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showTimeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                    {TIMES.map(t => (
                      <button
                        key={t}
                        onClick={() => handleTimeSelect(t)}
                        className={`w-full px-3.5 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                          scheduledTime === t
                            ? 'bg-[#fdda36]/10 text-[#514163] dark:text-yellow-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={manualTime}
                onChange={handleManualTimeChange}
                placeholder="HH:MM"
                maxLength={5}
                className="w-24 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-[#fdda36]"
              />
              {scheduledTime && (
                <button
                  onClick={() => { setScheduledTime(''); setManualTime(''); }}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2 mt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
              {search || filterSport !== 'all' || filterCategory !== 'all'
                ? 'No workouts match your filters'
                : 'No workouts in library yet'}
            </div>
          ) : (
            filtered.map(workout => {
              const sport = (workout as any).sport || 'cycling';
              const subDiscipline = (workout as any).sub_discipline;
              const elevationM = (workout as any).elevation_m;
              const steps = stepsCache[workout.id] || [];
              const totalSeconds = steps.reduce((sum, s) =>
                sum + (s.duration_type === 'time' ? s.duration_value : 300), 0);
              const intervalCount = steps.filter(s => s.step_type === 'interval').length;
              const isSelected = selectedWorkout?.id === workout.id;
              const isExpanded = expandedId === workout.id;
              const sc = SPORT_COLORS[sport] || SPORT_COLORS.cycling;

              return (
                <div
                  key={workout.id}
                  className={`rounded-xl border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-[#fdda36] bg-[#fdda36]/5 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedWorkout(isSelected ? null : workout)}
                >
                  <div className="flex items-center gap-3 p-3.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${sc.bg} ${sc.border}`}>
                      <SportIcon sport={sport} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{workout.name}</p>
                      <div className="flex items-center flex-wrap gap-2 mt-0.5">
                        {subDiscipline && (
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${sc.bg} ${sc.text}`}>
                            {SUB_DISCIPLINE_LABELS[subDiscipline] || subDiscipline}
                          </span>
                        )}
                        {totalSeconds > 0 && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={9} />
                            {formatDuration(totalSeconds)}
                          </span>
                        )}
                        {intervalCount > 0 && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Repeat2 size={9} />
                            {intervalCount} intervals
                          </span>
                        )}
                        {elevationM > 0 && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Mountain size={9} />
                            +{elevationM}m
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#fdda36] flex items-center justify-center">
                          <Check size={12} className="text-[#514163]" />
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleExpand(workout.id); }}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        {isExpanded ? 'Hide' : 'Preview'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && steps.length > 0 && (
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                      <WorkoutPreview steps={steps} sport={sport} />
                      <div className="mt-3 space-y-0.5">
                        {steps.map((step, i) => {
                          const COLORS: Record<string, string> = {
                            warmup: 'text-amber-600', steady: 'text-emerald-600',
                            interval: 'text-red-600', recovery: 'text-cyan-600', cooldown: 'text-[#514163]',
                          };
                          const stepColor = COLORS[step.step_type] || 'text-gray-600';
                          const dur = step.duration_type === 'time'
                            ? formatDuration(step.duration_value)
                            : `${(step.duration_value / 1000).toFixed(1)} km`;
                          const target = step.target_percent_ftp
                            ? `${step.target_percent_ftp}% FTP`
                            : step.target_zone ? `Z${step.target_zone}` : '';

                          return (
                            <div key={step.id} className="flex items-center gap-2 text-xs py-0.5">
                              <span className="w-4 text-center text-gray-400 flex-shrink-0">{i + 1}</span>
                              <span className={`font-medium capitalize flex-1 ${stepColor}`}>{step.step_type}</span>
                              <span className="text-gray-400">{dur}</span>
                              {target && <span className={`font-semibold ${stepColor}`}>{target}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {error && (
          <div className="px-6 pb-2 flex-shrink-0">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {filtered.length} workout{filtered.length !== 1 ? 's' : ''}
            {selectedWorkout && (
              <span className="ml-2 font-medium text-gray-600 dark:text-gray-300">· Selected: {selectedWorkout.name}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={!selectedWorkout || saving}
              className="px-6 py-2.5 rounded-xl bg-[#fdda36] hover:bg-yellow-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-[#514163] dark:disabled:text-gray-400 text-sm font-semibold transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {saving ? 'Scheduling...' : selectedWorkout ? `Schedule${scheduledTime ? ` · ${scheduledTime}` : ''}` : 'Select a workout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
