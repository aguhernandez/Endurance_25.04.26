import { useState, useEffect } from 'react';
import { X, Save, Download, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, GripVertical, Layers, Puzzle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Workout, WorkoutStep, IntensityBasis, Sport, StepType, Tag } from '../types/workout';
import { HRZone, PowerZone, PaceZone } from '../types/workout';
import TagSelector from './tags/TagSelector';
import StepEditor from './StepEditor';
import WorkoutPreview, { STEP_COLORS } from './WorkoutPreview';
import StepPalette, { PaletteBlock } from './StepPalette';
import LibraryPanel from './library/LibraryPanel';
import { downloadFIT } from '../lib/fitExport';
import { getDefaultIntensityBasis } from '../lib/calculations';
import { collectAndPushAthleteTags } from '../lib/hubApi';

interface WorkoutBuilderProps {
  workout?: Workout;
  onClose: () => void;
  onSaved: () => void;
  coachId: string;
  trainingDate?: Date | null;
  trainingType?: { discipline: string; type: string; elevationM?: number; scheduledTime?: string } | null;
  hrZones?: HRZone[];
  powerZones?: PowerZone[];
  runPaceZones?: PaceZone[];
  swimPaceZones?: PaceZone[];
  zoneSystem?: '5' | '7';
  isLibrary?: boolean;
  hubAthleteId?: string;
  athleteId?: string;
}

const SPORT_OPTIONS: { value: Sport; label: string; icon: string }[] = [
  { value: 'cycling', label: 'Cycling', icon: '🚴' },
  { value: 'running', label: 'Running', icon: '🏃' },
  { value: 'swimming', label: 'Swimming', icon: '🏊' },
];

function expandStepsForRepeatPairs(steps: Partial<WorkoutStep>[]): Partial<WorkoutStep>[] {
  const result: Partial<WorkoutStep>[] = [];
  const processed = new Set<number>();

  for (let i = 0; i < steps.length; i++) {
    if (processed.has(i)) continue;
    const step = steps[i];

    // Paired interval repeat (two steps sharing a repeat_group_id)
    if (step.repeat_group_id && step.repeat_times && step.repeat_times > 1) {
      const pairPartner = steps.findIndex((s, idx) =>
        idx !== i && s.repeat_group_id === step.repeat_group_id && !processed.has(idx)
      );

      if (pairPartner >= 0) {
        const partnerStep = steps[pairPartner];
        const repeatCount = step.repeat_times;
        const [first, second] = i < pairPartner ? [step, partnerStep] : [partnerStep, step];

        for (let r = 0; r < repeatCount; r++) {
          result.push({ ...first, repeat_times: undefined });
          result.push({ ...second, repeat_times: undefined });
        }
        processed.add(i);
        processed.add(pairPartner);
        continue;
      }
    }

    // Solo step repeat (single step with repeat_times, no pair partner)
    if (!step.repeat_group_id && step.repeat_times && step.repeat_times > 1) {
      for (let r = 0; r < step.repeat_times; r++) {
        result.push({ ...step, repeat_times: undefined });
      }
      processed.add(i);
      continue;
    }

    result.push(step);
    processed.add(i);
  }
  return result;
}

function disciplineToSport(discipline: string): Sport {
  if (discipline === 'running') return 'running';
  if (discipline === 'swimming') return 'swimming';
  return 'cycling';
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${m} min`;
}

const STEP_META: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  warmup:   { color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-400' },
  steady:   { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  interval: { color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     dot: 'bg-red-500' },
  recovery: { color: 'text-cyan-700',    bg: 'bg-cyan-50',    border: 'border-cyan-200',    dot: 'bg-cyan-500' },
  cooldown: { color: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  dot: 'bg-indigo-500' },
};

export default function WorkoutBuilder({
  workout,
  onClose,
  onSaved,
  coachId,
  trainingDate,
  trainingType,
  hrZones = [],
  powerZones = [],
  runPaceZones = [],
  swimPaceZones = [],
  zoneSystem = '5',
  isLibrary = false,
  hubAthleteId,
  athleteId,
}: WorkoutBuilderProps) {
  const initialSport: Sport = workout?.sport || (trainingType ? disciplineToSport(trainingType.discipline) : 'cycling');
  const [name, setName] = useState(
    workout?.name || (trainingType ? `${trainingType.type} - ${trainingType.discipline}` : '')
  );
  const [description, setDescription] = useState(workout?.description || '');
  const [sport, setSport] = useState<Sport>(initialSport);
  const [intensityBasis, setIntensityBasis] = useState<IntensityBasis>(
    (workout?.intensity_basis as IntensityBasis) || (getDefaultIntensityBasis(initialSport) as IntensityBasis)
  );
  const [subDiscipline] = useState<string>(workout?.sub_discipline || trainingType?.type || '');
  const [elevationM, setElevationM] = useState<number>(workout?.elevation_m || trainingType?.elevationM || 0);
  const [scheduledTime] = useState<string>(workout?.scheduled_time || trainingType?.scheduledTime || '');
  const toLocalDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const [scheduledDate, setScheduledDate] = useState<string>(
    workout?.scheduled_date || (trainingDate ? toLocalDateStr(trainingDate) : '')
  );
  const [steps, setSteps] = useState<Partial<WorkoutStep>[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingBlock, setDraggingBlock] = useState<{ block: PaletteBlock; steps: Partial<WorkoutStep>[] } | null>(null);
  const [dragStepIndex, setDragStepIndex] = useState<number | null>(null);
  const [dragOverStepIndex, setDragOverStepIndex] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [sidebarTab, setSidebarTab] = useState<'blocks' | 'library'>('blocks');

  useEffect(() => {
    if (workout?.id) {
      loadSteps();
      loadWorkoutTags();
    }
  }, [workout?.id]);

  const loadSteps = async () => {
    if (!workout?.id) return;
    const { data, error } = await supabase
      .from('workout_steps')
      .select('*')
      .eq('workout_id', workout.id)
      .order('order');
    if (error) { console.error('Error loading steps:', error); return; }
    if (data) setSteps(data);
  };

  const loadWorkoutTags = async () => {
    if (!workout?.id) return;
    const { data } = await supabase
      .from('workout_tags')
      .select('tags(*)')
      .eq('workout_id', workout.id);
    if (data) {
      const tags = data.map((row: any) => row.tags).filter(Boolean) as Tag[];
      setSelectedTags(tags);
    }
  };

  const handleSportChange = (newSport: Sport) => {
    setSport(newSport);
    setIntensityBasis(getDefaultIntensityBasis(newSport) as IntensityBasis);
  };

  const appendSteps = (newSteps: Partial<WorkoutStep>[]) => {
    setSteps(prev => [
      ...prev,
      ...newSteps.map((s, i) => ({ ...s, order: prev.length + i })),
    ]);
  };

  const handleLibraryLoad = (libraryWorkout: Workout, librarySteps: WorkoutStep[], mode: 'replace' | 'append') => {
    const stripped = librarySteps.map((s, i) => ({
      step_type: s.step_type,
      duration_type: s.duration_type,
      duration_value: s.duration_value,
      target_type: s.target_type,
      target_min_value: s.target_min_value,
      target_max_value: s.target_max_value,
      target_percent_ftp: s.target_percent_ftp,
      target_zone: s.target_zone,
      repeat_times: s.repeat_times,
      repeat_group_id: s.repeat_group_id,
      order: i,
    } as Partial<WorkoutStep>));

    if (mode === 'replace') {
      setName(libraryWorkout.name);
      setDescription(libraryWorkout.description || '');
      setSidebarTab('blocks');
      setSteps(stripped);
      setExpandedStep(null);
    } else {
      setSteps(prev => [
        ...prev,
        ...stripped.map((s, i) => ({ ...s, order: prev.length + i })),
      ]);
    }
  };

  const updateStep = (index: number, updatedStep: Partial<WorkoutStep>) => {
    setSteps(prev => {
      const next = [...prev];
      next[index] = { ...updatedStep, order: index };
      return next;
    });
  };

  const deleteStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
    if (expandedStep === index) setExpandedStep(null);
    else if (expandedStep !== null && expandedStep > index) setExpandedStep(expandedStep - 1);
  };

  const moveStep = (from: number, to: number) => {
    if (to < 0 || to >= steps.length) return;
    setSteps(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next.map((s, i) => ({ ...s, order: i }));
    });
    if (expandedStep === from) setExpandedStep(to);
  };

  const saveWorkout = async () => {
    if (!name.trim()) { setError('Workout name is required'); return; }
    if (steps.length === 0) { setError('Add at least one step'); return; }

    setSaving(true);
    setError(null);

    try {
      let workoutId = workout?.id;

      if (workoutId) {
        const updateData: any = { name, description, intensity_basis: intensityBasis, sport, sub_discipline: subDiscipline || null, elevation_m: elevationM || 0 };
        if (scheduledDate) updateData.scheduled_date = scheduledDate;
        else if (trainingDate) updateData.scheduled_date = toLocalDateStr(trainingDate);
        if (scheduledTime) updateData.scheduled_time = scheduledTime;
        const { error: updateError } = await supabase.from('workouts').update(updateData).eq('id', workoutId);
        if (updateError) throw updateError;
        const { error: deleteError } = await supabase.from('workout_steps').delete().eq('workout_id', workoutId);
        if (deleteError) throw deleteError;
      } else {
        const insertData: any = { coach_id: coachId, sport, name, description, intensity_basis: intensityBasis, sub_discipline: subDiscipline || null, elevation_m: elevationM || 0, is_library: isLibrary };
        if (athleteId) insertData.athlete_id = athleteId;
        if (scheduledDate) insertData.scheduled_date = scheduledDate;
        else if (trainingDate) insertData.scheduled_date = toLocalDateStr(trainingDate);
        if (scheduledTime) insertData.scheduled_time = scheduledTime;
        const { data, error: insertError } = await supabase.from('workouts').insert(insertData).select().single();
        if (insertError) throw insertError;
        workoutId = data.id;
      }

      const expandedSteps = expandStepsForRepeatPairs(steps);
      const stepsToInsert = expandedSteps.map((step, i) => ({
        workout_id: workoutId,
        order: i,
        step_type: step.step_type!,
        duration_type: step.duration_type!,
        duration_value: step.duration_value!,
        target_type: step.target_type,
        target_min_value: step.target_min_value,
        target_max_value: step.target_max_value,
        target_percent_ftp: step.target_percent_ftp,
        target_zone: step.target_zone,
        repeat_times: step.repeat_times,
        repeat_group_id: step.repeat_group_id,
        cadence_rpm: step.cadence_rpm,
      }));

      const { error: stepsError } = await supabase.from('workout_steps').insert(stepsToInsert);
      if (stepsError) throw stepsError;

      await supabase.from('workout_tags').delete().eq('workout_id', workoutId);
      if (selectedTags.length > 0) {
        const tagRows = selectedTags.map(t => ({ workout_id: workoutId, tag_id: t.id }));
        await supabase.from('workout_tags').insert(tagRows);
      }

      if (hubAthleteId && selectedTags.length > 0) {
        collectAndPushAthleteTags(hubAthleteId, `workout:${name}`).catch(() => {});
      }

      onSaved();
      onClose();
    } catch (err: any) {
      console.error('Error saving workout:', err);
      setError(err.message || 'Failed to save workout');
    } finally {
      setSaving(false);
    }
  };

  const exportToFIT = async () => {
    if (!workout?.id || steps.length === 0) { setError('Save the workout first before exporting'); return; }
    try { downloadFIT({ ...workout, steps: steps as WorkoutStep[] }); } catch {
      setError('Failed to export FIT file');
    }
  };

  const getIntensityOptions = (): { value: IntensityBasis; label: string }[] => {
    if (sport === 'cycling') return [
      { value: 'power', label: 'Power (% FTP)' },
      { value: 'hr', label: 'Heart Rate' },
      { value: 'rpe', label: 'RPE' },
    ];
    if (sport === 'running') return [
      { value: 'pace', label: 'Pace (/km)' },
      { value: 'hr', label: 'Heart Rate' },
      { value: 'rpe', label: 'RPE' },
    ];
    return [
      { value: 'pace', label: 'Pace (/100m)' },
      { value: 'hr', label: 'Heart Rate' },
      { value: 'rpe', label: 'RPE' },
    ];
  };

  const totalMin = Math.round(
    steps.reduce((s, step) => {
      const base = step.duration_type === 'time' ? (step.duration_value || 0) : 300;
      const times = (!step.repeat_group_id && step.repeat_times && step.repeat_times > 1) ? step.repeat_times : 1;
      return s + base * times;
    }, 0) / 60
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-primary-purple dark:text-white font-heading">
              {workout ? 'Edit Workout' : 'Create Workout'}
            </h2>
            {steps.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 font-body mt-0.5">
                {steps.length} steps · {totalMin} min
                {subDiscipline && <span className="ml-1 opacity-70">· {subDiscipline}</span>}
                {elevationM > 0 && <span className="ml-1 opacity-70">· +{elevationM}m</span>}
                {scheduledTime && <span className="ml-1 opacity-70">· {scheduledTime}</span>}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex min-h-0">
          <div className="w-56 flex-shrink-0 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setSidebarTab('blocks')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition ${
                  sidebarTab === 'blocks'
                    ? 'bg-primary-yellow text-gray-900 border-b-2 border-primary-yellow'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Puzzle size={13} />
                Blocks
              </button>
              <button
                onClick={() => setSidebarTab('library')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition ${
                  sidebarTab === 'library'
                    ? 'bg-primary-yellow text-gray-900 border-b-2 border-primary-yellow'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Layers size={13} />
                Library
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 min-h-0">
              {sidebarTab === 'blocks' ? (
                <StepPalette
                  intensityBasis={intensityBasis}
                  onDragStart={(block, remapped) => setDraggingBlock({ block, steps: remapped })}
                  onDragEnd={() => setDraggingBlock(null)}
                  onAdd={(remappedSteps) => appendSteps(remappedSteps)}
                />
              ) : (
                <LibraryPanel
                  currentSport={sport}
                  onLoadWorkout={handleLibraryLoad}
                />
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm font-body">
                {error}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-body">Sport</label>
                <div className="flex gap-2">
                  {SPORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSportChange(opt.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm transition font-body ${
                        sport === opt.value
                          ? 'border-primary-yellow bg-primary-yellow/10 text-primary-purple dark:text-white'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 font-body">Workout Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:border-primary-yellow bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-body text-sm"
                    placeholder="e.g., Z2 Endurance Ride"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 font-body">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-yellow focus:border-primary-yellow bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-body text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 font-body">Intensity Basis</label>
                  <select
                    value={intensityBasis}
                    onChange={(e) => setIntensityBasis(e.target.value as IntensityBasis)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-yellow bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-body text-sm"
                  >
                    {getIntensityOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 font-body">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-yellow bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-body text-sm"
                  rows={2}
                  placeholder="Optional description..."
                />
              </div>

              <TagSelector
                selectedTags={selectedTags}
                onChange={setSelectedTags}
                createdBy={coachId}
              />
            </div>

            <WorkoutPreview
              steps={steps}
              sport={sport}
              dropTarget={true}
              isDragOver={isDragOver}
              onDrop={() => {
                if (draggingBlock) {
                  appendSteps(draggingBlock.steps);
                  setDraggingBlock(null);
                }
                setIsDragOver(false);
              }}
              onDragOver={() => setIsDragOver(true)}
              onDragLeave={() => setIsDragOver(false)}
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-body">
                  Steps ({steps.length})
                </p>
                {steps.length > 0 && (
                  <button
                    onClick={() => { setSteps([]); setExpandedStep(null); }}
                    className="text-xs text-red-500 hover:text-red-700 font-body transition"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {steps.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-sm text-gray-400 dark:text-gray-500 font-body">
                    Drag blocks from the left panel or click them to add steps
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {steps.map((step, index) => {
                    const type = (step.step_type || 'steady') as StepType;
                    const meta = STEP_META[type] || STEP_META.steady;
                    const colors = STEP_COLORS[type] || STEP_COLORS.steady;
                    const isExpanded = expandedStep === index;
                    const durStr = step.duration_type === 'time' && step.duration_value
                      ? formatDuration(step.duration_value)
                      : step.duration_value
                      ? `${(step.duration_value / 1000).toFixed(1)} km`
                      : '—';
                    const targetStr = step.target_percent_ftp
                      ? `${step.target_percent_ftp}% FTP`
                      : step.target_zone
                      ? `Zone ${step.target_zone}`
                      : step.target_min_value && step.target_max_value
                      ? `${step.target_min_value}–${step.target_max_value}`
                      : '—';

                    return (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => { e.stopPropagation(); setDragStepIndex(index); }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverStepIndex(index); }}
                        onDragLeave={() => setDragOverStepIndex(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (dragStepIndex !== null && dragStepIndex !== index) {
                            moveStep(dragStepIndex, index);
                          }
                          setDragStepIndex(null);
                          setDragOverStepIndex(null);
                        }}
                        onDragEnd={() => { setDragStepIndex(null); setDragOverStepIndex(null); }}
                        className={`transition-all ${
                          dragOverStepIndex === index && dragStepIndex !== index
                            ? 'border-l-4 border-primary-yellow bg-primary-yellow/5'
                            : dragStepIndex === index
                            ? 'opacity-40'
                            : ''
                        }`}
                      >
                        <div className="flex items-stretch">
                          <div className="w-1 flex-shrink-0" style={{ backgroundColor: colors.stroke }} />
                          <div className="flex-1 px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <GripVertical size={14} className="text-gray-300 dark:text-gray-600 cursor-grab flex-shrink-0" />
                              <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                                {index + 1}
                              </span>
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                              <span className={`text-sm font-semibold capitalize font-body ${meta.color} flex-1`}>
                                {type}
                              </span>
                              <span className="text-xs text-gray-500 font-body">{durStr}</span>
                              <span className={`text-xs font-semibold font-body min-w-[60px] text-right ${meta.color}`}>{targetStr}</span>

                              <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
                                <button onClick={() => moveStep(index, index - 1)} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20 transition rounded">
                                  <ArrowUp size={13} />
                                </button>
                                <button onClick={() => moveStep(index, index + 1)} disabled={index === steps.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20 transition rounded">
                                  <ArrowDown size={13} />
                                </button>
                                <button onClick={() => setExpandedStep(isExpanded ? null : index)} className="p-1 text-gray-400 hover:text-primary-purple dark:hover:text-white transition rounded">
                                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                </button>
                                <button onClick={() => deleteStep(index)} className="p-1 text-gray-400 hover:text-red-600 transition rounded">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <StepEditor
                                  step={step}
                                  index={index}
                                  totalSteps={steps.length}
                                  sport={sport}
                                  onUpdate={(updatedStep) => updateStep(index, updatedStep)}
                                  onDelete={() => deleteStep(index)}
                                  hrZones={hrZones}
                                  powerZones={powerZones}
                                  runPaceZones={runPaceZones}
                                  swimPaceZones={swimPaceZones}
                                  zoneSystem={zoneSystem}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition font-body"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            {workout?.id && steps.length > 0 && (
              <button
                onClick={exportToFIT}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-body"
              >
                <Download size={16} />
                Export FIT
              </button>
            )}
            <button
              onClick={saveWorkout}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-primary-purple text-white rounded-lg hover:bg-primary-purple-light transition disabled:opacity-50 font-body font-semibold"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Workout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
