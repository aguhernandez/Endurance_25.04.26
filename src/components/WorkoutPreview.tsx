import { useMemo } from 'react';
import { WorkoutStep, StepType } from '../types/workout';
import { calculateWorkoutImpulseFromSteps, getDifficultyClasses, getDifficultyLabel, classifySSR, computeCapacityUtilization, classifyCU, getCULabel } from '../lib/sessionDifficulty';
import type { Sport } from '../types/workout';

function expandForPreview(steps: Partial<WorkoutStep>[]): Partial<WorkoutStep>[] {
  const result: Partial<WorkoutStep>[] = [];
  const processed = new Set<number>();

  for (let i = 0; i < steps.length; i++) {
    if (processed.has(i)) continue;
    const step = steps[i];

    if (step.repeat_group_id && step.repeat_times && step.repeat_times > 1) {
      const partnerIdx = steps.findIndex((s, idx) =>
        idx !== i && s.repeat_group_id === step.repeat_group_id && !processed.has(idx)
      );
      if (partnerIdx >= 0) {
        const partner = steps[partnerIdx];
        const count = step.repeat_times;
        const [first, second] = i < partnerIdx ? [step, partner] : [partner, step];
        for (let r = 0; r < count; r++) {
          result.push({ ...first, repeat_times: undefined });
          result.push({ ...second, repeat_times: undefined });
        }
        processed.add(i);
        processed.add(partnerIdx);
        continue;
      }
    }
    result.push(step);
    processed.add(i);
  }
  return result;
}

export interface WorkoutPhysiologyProps {
  ftp?: number | null;
  thresholdPacePerKm?: number | null;
  zoneSystem?: '5' | '7';
  currentCA?: number | null;
  currentRB?: number | null;
}

interface WorkoutPreviewProps {
  steps: Partial<WorkoutStep>[];
  sport?: string;
  physiology?: WorkoutPhysiologyProps;
  dropTarget?: boolean;
  isDragOver?: boolean;
  onDrop?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
}

export const STEP_COLORS: Record<StepType, { fill: string; stroke: string; label: string }> = {
  warmup:   { fill: '#FEF3C7', stroke: '#F59E0B', label: 'Warm Up' },
  steady:   { fill: '#D1FAE5', stroke: '#10B981', label: 'Steady' },
  interval: { fill: '#FEE2E2', stroke: '#EF4444', label: 'Interval' },
  recovery: { fill: '#CFFAFE', stroke: '#06B6D4', label: 'Recovery' },
  cooldown: { fill: '#E0E7FF', stroke: '#6366F1', label: 'Cool Down' },
};

const ZONE_BANDS = [
  { label: 'Z5', y: 0,   height: 20,  color: 'rgba(239,68,68,0.06)' },
  { label: 'Z4', y: 20,  height: 20,  color: 'rgba(251,146,60,0.06)' },
  { label: 'Z3', y: 40,  height: 20,  color: 'rgba(234,179,8,0.06)' },
  { label: 'Z2', y: 60,  height: 25,  color: 'rgba(34,197,94,0.06)' },
  { label: 'Z1', y: 85,  height: 15,  color: 'rgba(59,130,246,0.06)' },
];

export function getStepIntensity(step: Partial<WorkoutStep>): number {
  if (step.target_percent_ftp) return Math.min(step.target_percent_ftp, 130);
  if (step.target_zone) return step.target_zone * 18;
  switch (step.step_type) {
    case 'warmup':   return 55;
    case 'cooldown': return 50;
    case 'recovery': return 50;
    case 'steady':   return 76;
    case 'interval': return 105;
    default:         return 70;
  }
}

function getStepLabel(step: Partial<WorkoutStep>): string {
  if (step.target_percent_ftp) return `${step.target_percent_ftp}%`;
  if (step.target_zone) return `Z${step.target_zone}`;
  return '';
}

interface BanisterMetrics {
  sessionImpulse: number;
  relativeIntensity: number;
  durationHours: number;
  ssrColor: 'green' | 'yellow' | 'red' | null;
  ssrValue: number | null;
  cuColor: 'green' | 'yellow' | 'red' | null;
  cuValue: number | null;
  cuLabel: string | null;
}

function computeBanisterMetrics(
  steps: Partial<WorkoutStep>[],
  sport: string,
  physiology: WorkoutPhysiologyProps | undefined,
  totalDurationSeconds: number
): BanisterMetrics | null {
  if (!physiology) return null;

  const rawSteps = steps.filter(s => s.id || s.step_type) as WorkoutStep[];

  const sessionImpulse = calculateWorkoutImpulseFromSteps({
    steps: rawSteps,
    sport: sport as Sport,
    ftp: physiology.ftp ?? null,
    thresholdPacePerKm: physiology.thresholdPacePerKm ?? null,
    zoneSystem: physiology.zoneSystem ?? '5',
    fallbackDurationMinutes: totalDurationSeconds / 60,
  });

  const durationHours = totalDurationSeconds / 3600;
  const relativeIntensity = durationHours > 0 ? sessionImpulse / durationHours : 0;

  let ssrColor: 'green' | 'yellow' | 'red' | null = null;
  let ssrValue: number | null = null;
  let cuColor: 'green' | 'yellow' | 'red' | null = null;
  let cuValue: number | null = null;
  let cuLabel: string | null = null;

  if (physiology.currentCA && physiology.currentCA > 0) {
    ssrValue = sessionImpulse / physiology.currentCA;
    const rb = physiology.currentRB ?? 0;
    ssrColor = classifySSR(ssrValue, rb);

    const cuResult = computeCapacityUtilization(sessionImpulse, physiology.currentCA, sport as Sport);
    cuValue = cuResult.cu;
    cuColor = cuResult.difficulty;
    cuLabel = cuResult.label;
  }

  return { sessionImpulse, relativeIntensity, durationHours, ssrColor, ssrValue, cuColor, cuValue, cuLabel };
}

export default function WorkoutPreview({
  steps: rawSteps,
  sport = 'cycling',
  physiology,
  dropTarget = false,
  isDragOver = false,
  onDrop,
  onDragOver,
  onDragLeave,
}: WorkoutPreviewProps) {
  const steps = useMemo(() => expandForPreview(rawSteps), [rawSteps]);
  const isEmpty = rawSteps.length === 0;

  const totalDuration = steps.reduce((sum, step) => {
    return sum + (step.duration_type === 'time' ? (step.duration_value || 0) : 300);
  }, 0);

  const totalMinutes = Math.round(totalDuration / 60);
  const maxIntensity = 130;
  const chartH = 160;
  const chartW = 1000;

  const avgIntensity = steps.length > 0
    ? Math.round(steps.reduce((sum, s) => sum + getStepIntensity(s), 0) / steps.length)
    : 0;

  const banister = useMemo(
    () => computeBanisterMetrics(rawSteps, sport, physiology, totalDuration),
    [rawSteps, sport, physiology, totalDuration]
  );

  const dropProps = dropTarget ? {
    onDrop: (e: React.DragEvent) => { e.preventDefault(); onDrop?.(); },
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); onDragOver?.(e); },
    onDragLeave,
  } : {};

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-200 ${
        isDragOver
          ? 'border-primary-yellow bg-primary-yellow/5 shadow-lg shadow-primary-yellow/20 scale-[1.01]'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
      {...dropProps}
    >
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider font-body">
          {dropTarget ? 'Workout Preview — drop blocks here' : 'Workout Preview'}
        </h3>
        {!isEmpty && (
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-body">
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M8 4.5v4l2.5 2" strokeLinecap="round" />
              </svg>
              {totalMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 11L5.5 6 9 9 12.5 4 14 5.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {steps.length} steps
            </span>
            <span className="px-2 py-0.5 bg-primary-yellow/20 text-primary-purple dark:text-yellow-300 rounded font-medium">
              ~{avgIntensity}% FTP
            </span>
          </div>
        )}
      </div>

      {banister && !isEmpty && (
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex flex-wrap gap-3">
            <MetricPill
              label="Session Impulse"
              value={banister.sessionImpulse.toFixed(2)}
              sublabel="hrs · rel. intensity"
              accent="blue"
            />
            <MetricPill
              label="Rel. Intensity"
              value={`${(banister.relativeIntensity * 100).toFixed(0)}%`}
              sublabel="impulse / duration"
              accent="amber"
            />
            <MetricPill
              label="Duration"
              value={totalMinutes >= 60
                ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
                : `${totalMinutes} min`}
              sublabel="planned"
              accent="gray"
            />
            {banister.ssrValue !== null && banister.ssrColor !== null && (
              <SSRPill ssr={banister.ssrValue} color={banister.ssrColor} />
            )}
            {banister.cuValue !== null && banister.cuColor !== null && banister.cuLabel !== null && (
              <CUPill cu={banister.cuValue} color={banister.cuColor} label={banister.cuLabel} />
            )}
          </div>
        </div>
      )}

      <div className="p-4">
        {isEmpty ? (
          <div className={`flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
            dropTarget
              ? isDragOver
                ? 'h-36 border-2 border-dashed border-primary-yellow bg-primary-yellow/5'
                : 'h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
              : 'h-24 bg-gray-50 dark:bg-gray-800/50 rounded-xl'
          }`}>
            {isDragOver ? (
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary-yellow/20 flex items-center justify-center mx-auto mb-2">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-primary-yellow" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-primary-yellow font-body">Drop to add</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-2">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-400" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 13l4-4 4 4 5-6 5 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-body">
                  {dropTarget ? 'Drag blocks here to build your workout' : 'Add steps to see the workout preview'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="relative" style={{ height: chartH + 24 }}>
              {isDragOver && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-primary-yellow/10 border-2 border-dashed border-primary-yellow">
                  <div className="text-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary-yellow mx-auto mb-1" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm font-semibold text-primary-yellow font-body">Drop to append</p>
                  </div>
                </div>
              )}
              <div className="absolute left-8 right-0 top-0" style={{ height: chartH }}>
                <svg
                  className="w-full h-full"
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  preserveAspectRatio="none"
                >
                  {ZONE_BANDS.map((band) => (
                    <rect
                      key={band.label}
                      x={0}
                      y={chartH * (band.y / 100)}
                      width={chartW}
                      height={chartH * (band.height / 100)}
                      fill={band.color}
                    />
                  ))}

                  <line x1={0} y1={chartH * 0.20} x2={chartW} y2={chartH * 0.20} stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="6,4" />
                  <line x1={0} y1={chartH * 0.40} x2={chartW} y2={chartH * 0.40} stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="6,4" />
                  <line x1={0} y1={chartH * 0.60} x2={chartW} y2={chartH * 0.60} stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="6,4" />
                  <line x1={0} y1={chartH * 0.85} x2={chartW} y2={chartH * 0.85} stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="6,4" />

                  {steps.map((step, index) => {
                    const stepDuration = step.duration_type === 'time' ? (step.duration_value || 0) : 300;
                    const stepStart = steps.slice(0, index).reduce((sum, s) => {
                      return sum + (s.duration_type === 'time' ? (s.duration_value || 0) : 300);
                    }, 0);

                    const x1 = (stepStart / totalDuration) * chartW;
                    const x2 = ((stepStart + stepDuration) / totalDuration) * chartW;
                    const barW = x2 - x1;

                    const intensity = getStepIntensity(step);
                    const barH = (intensity / maxIntensity) * chartH;
                    const y = chartH - barH;

                    const type = (step.step_type || 'steady') as StepType;
                    const colors = STEP_COLORS[type] || STEP_COLORS.steady;
                    const label = getStepLabel(step);

                    return (
                      <g key={index}>
                        <defs>
                          <linearGradient id={`bar-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.85" />
                            <stop offset="100%" stopColor={colors.stroke} stopOpacity="0.35" />
                          </linearGradient>
                        </defs>
                        <rect
                          x={x1 + 1}
                          y={y}
                          width={Math.max(barW - 2, 1)}
                          height={barH}
                          fill={`url(#bar-${index})`}
                          rx="2"
                        />
                        <rect
                          x={x1 + 1}
                          y={y}
                          width={Math.max(barW - 2, 1)}
                          height={3}
                          fill={colors.stroke}
                          rx="1"
                        />
                        {barW > 45 && label && (
                          <text
                            x={(x1 + x2) / 2}
                            y={y + 14}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill={colors.stroke}
                            fontFamily="Jost, sans-serif"
                          >
                            {label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute left-0 top-0 h-full -translate-x-full pr-1 flex flex-col justify-between text-right">
                  {['130%', '100%', '75%', '55%', '0%'].map(l => (
                    <span key={l} className="text-[9px] text-gray-400 font-body leading-none">{l}</span>
                  ))}
                </div>
              </div>

              <div className="absolute left-8 right-0 bottom-0 flex justify-between">
                {[0, 0.25, 0.5, 0.75, 1].map(frac => (
                  <span key={frac} className="text-[9px] text-gray-400 font-body">
                    {Math.round(frac * totalMinutes)}m
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              {(Object.entries(STEP_COLORS) as [StepType, typeof STEP_COLORS[StepType]][]).map(([type, colors]) => {
                const hasType = steps.some(s => s.step_type === type);
                return (
                  <div
                    key={type}
                    className={`flex items-center gap-1.5 text-xs font-body transition ${!hasType ? 'opacity-30' : ''}`}
                  >
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors.stroke }} />
                    <span className="text-gray-600 dark:text-gray-400">{colors.label}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type AccentColor = 'blue' | 'amber' | 'gray' | 'emerald';

const ACCENT_STYLES: Record<AccentColor, { bg: string; text: string; label: string; dot: string }> = {
  blue:    { bg: 'bg-blue-50 dark:bg-blue-900/20',    text: 'text-blue-700 dark:text-blue-300',    label: 'text-blue-500 dark:text-blue-400',    dot: 'bg-blue-400' },
  amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20',  text: 'text-amber-700 dark:text-amber-300',  label: 'text-amber-500 dark:text-amber-400',  dot: 'bg-amber-400' },
  gray:    { bg: 'bg-gray-100 dark:bg-gray-700/40',   text: 'text-gray-700 dark:text-gray-300',    label: 'text-gray-400 dark:text-gray-500',    dot: 'bg-gray-400' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', label: 'text-emerald-500 dark:text-emerald-400', dot: 'bg-emerald-400' },
};

function MetricPill({ label, value, sublabel, accent }: {
  label: string;
  value: string;
  sublabel: string;
  accent: AccentColor;
}) {
  const style = ACCENT_STYLES[accent];
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${style.bg}`}>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
      <div>
        <p className={`text-[10px] font-medium uppercase tracking-wide ${style.label} font-body`}>{label}</p>
        <p className={`text-sm font-bold leading-tight ${style.text} font-heading`}>{value}</p>
        <p className={`text-[10px] ${style.label} font-body`}>{sublabel}</p>
      </div>
    </div>
  );
}

function SSRPill({ ssr, color }: { ssr: number; color: 'green' | 'yellow' | 'red' }) {
  const cls = getDifficultyClasses(color);
  const label = getDifficultyLabel(color);
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${cls.bg} border ${cls.border}`}>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cls.dot}`} />
      <div>
        <p className={`text-[10px] font-medium uppercase tracking-wide ${cls.text} opacity-70 font-body`}>SSR</p>
        <p className={`text-sm font-bold leading-tight ${cls.text} font-heading`}>{ssr.toFixed(2)}</p>
        <p className={`text-[10px] ${cls.text} opacity-70 font-body`}>{label} load</p>
      </div>
    </div>
  );
}

function CUPill({ cu, color, label }: { cu: number; color: 'green' | 'yellow' | 'red'; label: string }) {
  const cls = getDifficultyClasses(color);
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${cls.bg} border ${cls.border}`}>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cls.dot}`} />
      <div>
        <p className={`text-[10px] font-medium uppercase tracking-wide ${cls.text} opacity-70 font-body`}>Capacity Utilization</p>
        <p className={`text-sm font-bold leading-tight ${cls.text} font-heading`}>{cu.toFixed(2)}</p>
        <p className={`text-[10px] ${cls.text} opacity-70 font-body`}>{label}</p>
      </div>
    </div>
  );
}
