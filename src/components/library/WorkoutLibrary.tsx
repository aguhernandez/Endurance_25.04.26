import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, X, Bike, PersonStanding, Waves, Dumbbell, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Workout, WorkoutStep, Tag as TagType } from '../../types/workout';
import WorkoutBuilder from '../WorkoutBuilder';
import WorkoutLibraryCard from './WorkoutLibraryCard';
import { downloadFIT } from '../../lib/fitExport';

type SportTab = 'all' | 'cycling' | 'running' | 'swimming' | 'other';
type CategoryFilter = 'all' | 'endurance' | 'threshold' | 'vo2max' | 'sprint' | 'recovery' | 'strength' | 'other';
type DifficultyFilter = 'all' | 'easy' | 'moderate' | 'hard' | 'very_hard';

interface WorkoutLibraryProps {
  coachId: string;
  isCoach: boolean;
}

const SPORT_TABS: { id: SportTab; label: string; icon: React.ReactNode }[] = [
  { id: 'all',      label: 'All',      icon: <SlidersHorizontal size={15} /> },
  { id: 'cycling',  label: 'Cycling',  icon: <Bike size={15} /> },
  { id: 'running',  label: 'Running',  icon: <PersonStanding size={15} /> },
  { id: 'swimming', label: 'Swimming', icon: <Waves size={15} /> },
  { id: 'other',    label: 'Other',    icon: <Dumbbell size={15} /> },
];

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all',       label: 'All Categories' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'threshold', label: 'Threshold' },
  { value: 'vo2max',    label: 'VO₂max' },
  { value: 'sprint',    label: 'Sprint' },
  { value: 'recovery',  label: 'Recovery' },
  { value: 'strength',  label: 'Strength' },
  { value: 'other',     label: 'Other' },
];

const DIFFICULTY_OPTIONS: { value: DifficultyFilter; label: string }[] = [
  { value: 'all',       label: 'Any Difficulty' },
  { value: 'easy',      label: 'Easy' },
  { value: 'moderate',  label: 'Moderate' },
  { value: 'hard',      label: 'Hard' },
  { value: 'very_hard', label: 'Very Hard' },
];

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a2e' : '#ffffff';
}

export default function WorkoutLibrary({ coachId, isCoach }: WorkoutLibraryProps) {
  const { profile } = useAuth();
  const zoneSystem: '5' | '7' = (profile?.preferred_zone_system ?? '5') as '5' | '7';
  const [workouts, setWorkouts] = useState<(Workout & { tags?: string[]; category?: string; difficulty?: string; estimated_tss?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | undefined>();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stepsCache, setStepsCache] = useState<Record<string, WorkoutStep[]>>({});
  const [workoutTagsMap, setWorkoutTagsMap] = useState<Record<string, TagType[]>>({});
  const [allTags, setAllTags] = useState<TagType[]>([]);

  const [activeSport, setActiveSport] = useState<SportTab>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  useEffect(() => { loadWorkouts(); }, []);

  async function loadWorkouts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('is_library', true)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setWorkouts(data);
      const ids = data.map((w: Workout) => w.id);
      if (ids.length > 0) {
        const { data: stepsData } = await supabase
          .from('workout_steps')
          .select('*')
          .in('workout_id', ids)
          .order('order');
        if (stepsData) {
          const cache: Record<string, WorkoutStep[]> = {};
          for (const step of stepsData) {
            if (!cache[step.workout_id]) cache[step.workout_id] = [];
            cache[step.workout_id].push(step);
          }
          setStepsCache(cache);
        }

        const { data: wtData } = await supabase
          .from('workout_tags')
          .select('workout_id, tags(*)')
          .in('workout_id', ids);
        if (wtData) {
          const map: Record<string, TagType[]> = {};
          for (const row of wtData as any[]) {
            if (!map[row.workout_id]) map[row.workout_id] = [];
            if (row.tags) map[row.workout_id].push(row.tags as TagType);
          }
          setWorkoutTagsMap(map);

          const seen = new Set<string>();
          const tags: TagType[] = [];
          for (const tagList of Object.values(map)) {
            for (const t of tagList) {
              if (!seen.has(t.id)) { seen.add(t.id); tags.push(t); }
            }
          }
          setAllTags(tags.sort((a, b) => a.name.localeCompare(b.name)));
        }
      }
    }
    setLoading(false);
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

  async function deleteWorkout(id: string) {
    if (!confirm('Delete this workout?')) return;
    await supabase.from('workouts').delete().eq('id', id);
    loadWorkouts();
  }

  async function exportWorkout(workout: Workout) {
    await loadSteps(workout.id);
    const steps = stepsCache[workout.id] || [];
    if (!steps.length) { alert('No steps to export'); return; }
    try { downloadFIT({ ...workout, steps }); }
    catch { alert('Export failed'); }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: workouts.length, cycling: 0, running: 0, swimming: 0, other: 0 };
    workouts.forEach(w => {
      const s = (w as any).sport || 'cycling';
      if (c[s] !== undefined) c[s]++;
      else c.other++;
    });
    return c;
  }, [workouts]);

  const filtered = useMemo(() => {
    return workouts.filter(w => {
      const sport = (w as any).sport || 'cycling';
      if (activeSport !== 'all') {
        if (activeSport === 'other') {
          if (['cycling', 'running', 'swimming'].includes(sport)) return false;
        } else if (sport !== activeSport) return false;
      }
      if (categoryFilter !== 'all' && (w as any).category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && (w as any).difficulty !== difficultyFilter) return false;
      if (activeTagFilter) {
        const wTags = workoutTagsMap[w.id] || [];
        if (!wTags.some(t => t.id === activeTagFilter)) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const legacyTags = ((w as any).tags || []) as string[];
        const structuredTags = (workoutTagsMap[w.id] || []).map(t => t.name);
        const allTagNames = [...legacyTags, ...structuredTags];
        if (!w.name.toLowerCase().includes(q) &&
            !(w.description || '').toLowerCase().includes(q) &&
            !allTagNames.some(t => t.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [workouts, activeSport, categoryFilter, difficultyFilter, search, activeTagFilter, workoutTagsMap]);

  const activeFilterCount = (categoryFilter !== 'all' ? 1 : 0) + (difficultyFilter !== 'all' ? 1 : 0) + (activeTagFilter ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workout Library</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {workouts.length} structured workout{workouts.length !== 1 ? 's' : ''} · cycling, running, swimming & more
          </p>
        </div>
        {isCoach && (
          <button
            onClick={() => { setEditingWorkout(undefined); setShowBuilder(true); }}
            className="btn-primary flex items-center gap-2 flex-shrink-0"
          >
            <Plus size={16} />
            New Workout
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, tag..."
            className="input-base w-full pl-9 pr-4"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
            activeFilterCount > 0
              ? 'bg-[#fdda36] border-[#fdda36] text-[#514163]'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#514163]/20 flex items-center justify-center text-xs font-bold text-[#514163]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setCategoryFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      categoryFilter === opt.value
                        ? 'bg-[#fdda36] text-[#514163] border border-[#fdda36]'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-1.5">
                {DIFFICULTY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficultyFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      difficultyFilter === opt.value
                        ? 'bg-[#fdda36] text-[#514163] border border-[#fdda36]'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {allTags.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Tag size={11} /> Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveTagFilter(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    !activeTagFilter
                      ? 'bg-[#fdda36] text-[#514163] border-[#fdda36]'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All Tags
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => setActiveTagFilter(activeTagFilter === tag.id ? null : tag.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                    style={
                      activeTagFilter === tag.id
                        ? { backgroundColor: tag.color, color: contrastColor(tag.color), borderColor: tag.color }
                        : { backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color + '40' }
                    }
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {SPORT_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSport(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeSport === tab.id
                ? 'bg-white dark:bg-gray-700 text-[#514163] dark:text-[#fdda36] shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {counts[tab.id] !== undefined && counts[tab.id] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeSport === tab.id
                  ? 'bg-[#fdda36]/30 text-[#514163] dark:text-[#fdda36]'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded-full w-20" />
                    <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded-full w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#fdda36]/20 flex items-center justify-center mx-auto mb-4">
            {activeSport === 'cycling' ? <Bike className="w-7 h-7 text-[#514163]" />
              : activeSport === 'running' ? <PersonStanding className="w-7 h-7 text-[#514163]" />
              : activeSport === 'swimming' ? <Waves className="w-7 h-7 text-[#514163]" />
              : <Dumbbell className="w-7 h-7 text-[#514163]" />}
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {workouts.length === 0 ? 'No workouts yet' : 'No workouts match your filters'}
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mx-auto mb-5">
            {workouts.length === 0
              ? isCoach ? 'Build your first structured workout with precision step-by-step targets.' : 'Your coach has not added any workouts yet.'
              : 'Try adjusting your search or filters.'}
          </p>
          {workouts.length === 0 && isCoach && (
            <button
              onClick={() => { setEditingWorkout(undefined); setShowBuilder(true); }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Create First Workout
            </button>
          )}
          {(search || categoryFilter !== 'all' || difficultyFilter !== 'all' || activeTagFilter) && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter('all'); setDifficultyFilter('all'); setActiveTagFilter(null); }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length !== workouts.length && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing {filtered.length} of {workouts.length} workouts
            </p>
          )}
          {filtered.map(workout => (
            <WorkoutLibraryCard
              key={workout.id}
              workout={workout}
              steps={stepsCache[workout.id] || []}
              isCoach={isCoach}
              isExpanded={expandedId === workout.id}
              onToggleExpand={() => toggleExpand(workout.id)}
              onEdit={() => { setEditingWorkout(workout); setShowBuilder(true); }}
              onDelete={() => deleteWorkout(workout.id)}
              onExport={() => exportWorkout(workout)}
              tags={workoutTagsMap[workout.id] || []}
            />
          ))}
        </div>
      )}

      {showBuilder && (
        <WorkoutBuilder
          workout={editingWorkout}
          onClose={() => { setShowBuilder(false); setEditingWorkout(undefined); }}
          onSaved={loadWorkouts}
          coachId={coachId}
          zoneSystem={zoneSystem}
          isLibrary={true}
        />
      )}
    </div>
  );
}
