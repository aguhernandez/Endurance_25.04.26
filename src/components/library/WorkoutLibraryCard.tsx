import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, CreditCard as Edit, Trash2, Download, Repeat2, Bike, PersonStanding, Waves, Dumbbell } from 'lucide-react';
import { Workout, WorkoutStep, StepType, Tag } from '../../types/workout';
import WorkoutPreview from '../WorkoutPreview';

const STEP_META: Record<StepType, { color: string; bg: string; border: string; dot: string }> = {
  warmup:   { color: 'text-amber-700',    bg: 'bg-amber-50',           border: 'border-amber-200',           dot: 'bg-amber-400' },
  steady:   { color: 'text-emerald-700',  bg: 'bg-emerald-50',         border: 'border-emerald-200',         dot: 'bg-emerald-500' },
  interval: { color: 'text-red-700',      bg: 'bg-red-50',             border: 'border-red-200',             dot: 'bg-red-500' },
  recovery: { color: 'text-cyan-700',     bg: 'bg-cyan-50',            border: 'border-cyan-200',            dot: 'bg-cyan-500' },
  cooldown: { color: 'text-[#514163]',    bg: 'bg-[#fdda36]/10',       border: 'border-[#fdda36]/30',        dot: 'bg-[#fdda36]' },
};

const DIFFICULTY_CONFIG = {
  easy:      { label: 'Easy',      color: 'bg-emerald-100 text-emerald-700' },
  moderate:  { label: 'Moderate',  color: 'bg-[#fdda36]/20 text-[#514163]' },
  hard:      { label: 'Hard',      color: 'bg-amber-100 text-amber-700' },
  very_hard: { label: 'Very Hard', color: 'bg-red-100 text-red-700' },
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  endurance:  { label: 'Endurance',  color: 'bg-gray-100 text-gray-600' },
  threshold:  { label: 'Threshold',  color: 'bg-[#fdda36]/20 text-[#514163]' },
  vo2max:     { label: 'VO₂max',    color: 'bg-red-100 text-red-600' },
  sprint:     { label: 'Sprint',    color: 'bg-rose-100 text-rose-600' },
  recovery:   { label: 'Recovery',  color: 'bg-emerald-100 text-emerald-600' },
  strength:   { label: 'Strength',  color: 'bg-orange-100 text-orange-600' },
  other:      { label: 'Other',     color: 'bg-gray-100 text-gray-600' },
};

const BASIS_LABELS: Record<string, string> = {
  power: 'Power',
  hr:    'Heart Rate',
  pace:  'Pace',
  rpe:   'RPE',
};

function SportIcon({ sport, className }: { sport: string; className?: string }) {
  const cls = className || 'w-5 h-5';
  switch (sport) {
    case 'cycling':  return <Bike className={cls} />;
    case 'running':  return <PersonStanding className={cls} />;
    case 'swimming': return <Waves className={cls} />;
    default:         return <Dumbbell className={cls} />;
  }
}

const SPORT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  cycling:  { bg: 'bg-[#fdda36]/20',                     text: 'text-[#514163]',       border: 'border-[#fdda36]/40' },
  running:  { bg: 'bg-emerald-50',                        text: 'text-emerald-700',     border: 'border-emerald-200' },
  swimming: { bg: 'bg-cyan-50',                           text: 'text-cyan-700',        border: 'border-cyan-200' },
  other:    { bg: 'bg-gray-100',                          text: 'text-gray-600',        border: 'border-gray-200' },
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function formatStepTarget(step: WorkoutStep): string {
  if (step.target_type === 'power') {
    if (step.target_percent_ftp) return `${step.target_percent_ftp}% FTP`;
    if (step.target_min_value && step.target_max_value) return `${step.target_min_value}–${step.target_max_value} W`;
  }
  if (step.target_type === 'hr') {
    if (step.target_zone) return `HRR Z${step.target_zone}`;
    if (step.target_min_value && step.target_max_value) return `${step.target_min_value}–${step.target_max_value} bpm`;
  }
  if (step.target_type === 'pace') {
    if (step.target_zone) return `Pace Z${step.target_zone}`;
    if (step.target_min_value && step.target_max_value) {
      const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
      return `${fmt(step.target_max_value)}–${fmt(step.target_min_value)}/km`;
    }
  }
  if (step.target_type === 'rpe') {
    if (step.target_zone) return `RPE ${step.target_zone}/10`;
  }
  return '—';
}

interface WorkoutLibraryCardProps {
  workout: Workout & { tags?: string[]; category?: string; difficulty?: string; estimated_tss?: number };
  steps: WorkoutStep[];
  isCoach: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
  tags?: Tag[];
}

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a2e' : '#ffffff';
}

export default function WorkoutLibraryCard({
  workout, steps, isCoach, isExpanded, onToggleExpand, onEdit, onDelete, onExport, tags = [],
}: WorkoutLibraryCardProps) {
  const [, forceUpdate] = useState(0);
  void forceUpdate;

  const sport = (workout as any).sport || 'cycling';
  const sportCfg = SPORT_COLORS[sport] || SPORT_COLORS.other;
  const category = (workout as any).category || 'other';
  const difficulty = (workout as any).difficulty || 'moderate';
  const diffCfg = DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.moderate;
  const catCfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
  const impulse = (workout as any).estimated_impulse ?? workout.estimated_impulse;
  const basisLabel = BASIS_LABELS[workout.intensity_basis || ''] || workout.intensity_basis || '—';

  const totalSeconds = steps.reduce((sum, s) =>
    sum + (s.duration_type === 'time' ? s.duration_value : 300), 0);
  const totalMin = Math.round(totalSeconds / 60);

  const intervalCount = steps.filter(s => s.step_type === 'interval').length;
  const stepTypeCounts = steps.reduce((acc, s) => {
    acc[s.step_type as StepType] = (acc[s.step_type as StepType] || 0) + 1;
    return acc;
  }, {} as Partial<Record<StepType, number>>);
  void stepTypeCounts;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-[#fdda36]/60 hover:shadow-md transition-all duration-200 group">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${sportCfg.bg} ${sportCfg.border}`}>
            <SportIcon sport={sport} className={`w-5 h-5 ${sportCfg.text}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate leading-snug">
                  {workout.name}
                </h3>
                {workout.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                    {workout.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {isCoach && (
                  <>
                    <button
                      onClick={onExport}
                      title="Export to FIT"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Download size={15} />
                    </button>
                    <button
                      onClick={onEdit}
                      title="Edit"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#514163] hover:bg-[#fdda36]/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={onDelete}
                      title="Delete"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
                <button
                  onClick={onToggleExpand}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#514163] hover:bg-[#fdda36]/20 transition-all"
                >
                  {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${catCfg.color}`}>
                {catCfg.label}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${diffCfg.color}`}>
                {diffCfg.label}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {basisLabel}
              </span>
              {totalMin > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-50">
                  <Clock size={10} />
                  {formatDuration(totalSeconds)}
                </span>
              )}
              {impulse != null && impulse > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#fdda36]/20 text-[#514163]">
                  Impulse {impulse}
                </span>
              )}
              {intervalCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-50">
                  <Repeat2 size={10} />
                  {intervalCount}× intervals
                </span>
              )}
              {tags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: tag.color, color: contrastColor(tag.color) }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700">
          {steps.length > 0 ? (
            <>
              <div className="px-5 pt-4 pb-2">
                <WorkoutPreview steps={steps} sport={sport} />
              </div>
              <div className="px-5 pb-5 pt-2 space-y-1.5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {steps.length} steps
                </p>
                {steps.map((step, i) => {
                  const meta = STEP_META[step.step_type as StepType] || STEP_META.steady;
                  const durationStr = step.duration_type === 'time'
                    ? formatDuration(step.duration_value)
                    : `${(step.duration_value / 1000).toFixed(1)} km`;
                  return (
                    <div key={step.id} className={`flex items-center gap-3 px-3.5 py-2 rounded-lg border ${meta.bg} ${meta.border}`}>
                      <span className="w-5 h-5 rounded-full bg-white/70 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                      <span className={`text-sm font-semibold capitalize flex-1 ${meta.color}`}>{step.step_type}</span>
                      {step.repeat_times && step.repeat_times > 1 && (
                        <span className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${meta.bg} ${meta.color} border ${meta.border}`}>
                          <Repeat2 size={10} />×{step.repeat_times}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={11} className="text-gray-400" />
                        {durationStr}
                      </span>
                      <span className={`text-xs font-semibold ${meta.color} min-w-[80px] text-right`}>
                        {formatStepTarget(step)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              No steps in this workout.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
