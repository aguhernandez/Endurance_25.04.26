import { Sport, WorkoutStep } from '../types/workout';

export const IMPULSE_ALGORITHM_VERSION = 'impulse-v1';
export const DEFAULT_TAU_CHRONIC = 28;
export const DEFAULT_TAU_ACUTE = 7;

export type ImpulseStatus = 'calculated' | 'estimated' | 'manual' | 'insufficient';
export type ImpulseMethod =
  | 'cycling_np_if_ftp'
  | 'cycling_avg_power_ftp'
  | 'running_adjusted_pace_threshold'
  | 'running_average_pace_threshold'
  | 'swimming_css_pace_if3'
  | 'swimming_threshold_pace_if3'
  | 'planned_steps'
  | 'manual';

export interface ImpulseResult {
  impulse: number | null;
  status: ImpulseStatus;
  method: ImpulseMethod | null;
  algorithmVersion: string;
  reason?: string;
}

export interface ImpulseInput {
  sport: Sport;
  durationMinutes: number;
  normalizedPowerWatts?: number | null;
  avgPowerWatts?: number | null;
  ftp?: number | null;
  avgPacePerKm?: number | null;
  adjustedPacePerKm?: number | null;
  thresholdPacePerKm?: number | null;
  manualImpulse?: number | null;
}

export interface DailyImpulseEntry {
  date: string;
  impulse: number;
  status?: ImpulseStatus;
  sourceId?: string;
}

export interface LoadState {
  ca: number;
  al: number;
  rb: number;
  status: 'bootstrap' | 'ready' | 'incomplete';
  daysProcessed: number;
  daysWithData: number;
  caNearZero: boolean;
}

export interface SSRResult {
  sessionImpulse: number;
  currentCA: number;
  ssr: number;
  difficulty: DifficultyColor;
}

export interface StepImpulseInput {
  steps: WorkoutStep[];
  sport: Sport;
  ftp?: number | null;
  thresholdPacePerKm?: number | null;
  zoneSystem?: '5' | '7';
}

function invalidDuration(minutes: number): boolean {
  return !Number.isFinite(minutes) || minutes <= 0;
}

function result(
  impulse: number | null,
  status: ImpulseStatus,
  method: ImpulseMethod | null,
  reason?: string,
): ImpulseResult {
  return {
    impulse: impulse == null ? null : Math.round(impulse * 100) / 100,
    status,
    method,
    algorithmVersion: IMPULSE_ALGORITHM_VERSION,
    reason,
  };
}

function tssEquivalent(durationMinutes: number, intensityFactor: number, exponent: 2 | 3): number {
  return (durationMinutes / 60) * Math.pow(intensityFactor, exponent) * 100;
}

export function calculateImpulse(input: ImpulseInput): ImpulseResult {
  if (input.manualImpulse != null && Number.isFinite(input.manualImpulse) && input.manualImpulse >= 0) {
    return result(input.manualImpulse, 'manual', 'manual');
  }

  if (invalidDuration(input.durationMinutes)) {
    return result(null, 'insufficient', null, 'Duration must be greater than zero');
  }

  if (input.sport === 'cycling') {
    const power = input.normalizedPowerWatts ?? input.avgPowerWatts;
    if (power != null && input.ftp != null && power > 0 && input.ftp > 0) {
      const intensityFactor = power / input.ftp;
      const method = input.normalizedPowerWatts != null
        ? 'cycling_np_if_ftp'
        : 'cycling_avg_power_ftp';
      const status: ImpulseStatus = input.normalizedPowerWatts != null ? 'calculated' : 'estimated';
      return result(tssEquivalent(input.durationMinutes, intensityFactor, 2), status, method);
    }
    return result(null, 'insufficient', null, 'Cycling requires NP or average power plus FTP');
  }

  if (input.sport === 'running') {
    if (input.thresholdPacePerKm == null || input.thresholdPacePerKm <= 0) {
      return result(null, 'insufficient', null, 'Running requires a threshold pace');
    }
    const pace = input.adjustedPacePerKm ?? input.avgPacePerKm;
    if (pace == null || pace <= 0) {
      return result(null, 'insufficient', null, 'Running requires average or adjusted pace');
    }
    const adjusted = input.adjustedPacePerKm != null;
    return result(
      tssEquivalent(input.durationMinutes, input.thresholdPacePerKm / pace, 2),
      adjusted ? 'calculated' : 'estimated',
      adjusted ? 'running_adjusted_pace_threshold' : 'running_average_pace_threshold',
      adjusted ? undefined : 'Average pace is not equivalent to grade-adjusted pace',
    );
  }

  if (input.thresholdPacePerKm == null || input.thresholdPacePerKm <= 0) {
    return result(null, 'insufficient', null, 'Swimming requires CSS or a threshold pace');
  }
  if (input.avgPacePerKm == null || input.avgPacePerKm <= 0) {
    return result(null, 'insufficient', null, 'Swimming requires average pace');
  }
  return result(
    tssEquivalent(input.durationMinutes, input.thresholdPacePerKm / input.avgPacePerKm, 3),
    'estimated',
    'swimming_threshold_pace_if3',
    'Swimming uses a provisional sTSS-style IF^3 method; it is not a validated cross-sport equivalence',
  );
}

function stepDurationMinutes(step: WorkoutStep): number {
  if (step.duration_type === 'time') return step.duration_value / 60;
  return 0;
}

function stepIntensity(step: WorkoutStep, input: StepImpulseInput): number | null {
  if (input.sport === 'cycling' && step.target_percent_ftp != null && step.target_percent_ftp > 0) {
    return step.target_percent_ftp / 100;
  }
  if (input.sport === 'cycling' && step.target_type === 'power' && step.target_min_value != null && step.target_max_value != null && input.ftp && input.ftp > 0) {
    return ((step.target_min_value + step.target_max_value) / 2) / input.ftp;
  }
  if ((input.sport === 'running' || input.sport === 'swimming') && step.target_type === 'pace' && step.target_min_value != null && step.target_max_value != null && input.thresholdPacePerKm && input.thresholdPacePerKm > 0) {
    const pace = (step.target_min_value + step.target_max_value) / 2;
    return pace > 0 ? input.thresholdPacePerKm / pace : null;
  }
  return null;
}

export function calculatePlannedSteps(input: StepImpulseInput): ImpulseResult {
  if (!input.steps.length) return result(null, 'insufficient', null, 'Structured workout has no calculable steps');

  let total = 0;
  for (const step of input.steps) {
    const minutes = stepDurationMinutes(step);
    const intensity = stepIntensity(step, input);
    if (minutes <= 0 || intensity == null || intensity < 0) {
      return result(null, 'insufficient', null, `Step ${step.order} has no supported duration or intensity target`);
    }
    total += (minutes / 60) * Math.pow(intensity, 2) * 100 * (step.repeat_times && step.repeat_times > 1 ? step.repeat_times : 1);
  }

  return result(
    total,
    'estimated',
    'planned_steps',
    'Step-based planning estimate; not an exact equivalent of normalized-power analysis for variable efforts',
  );
}

export function aggregateDailyImpulse(entries: DailyImpulseEntry[]): DailyImpulseEntry[] {
  const daily = new Map<string, number>();
  for (const entry of entries) {
    if (!Number.isFinite(entry.impulse) || entry.impulse < 0) continue;
    daily.set(entry.date, (daily.get(entry.date) ?? 0) + entry.impulse);
  }
  return Array.from(daily.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, impulse]) => ({ date, impulse: Math.round(impulse * 100) / 100 }));
}

export function advanceLoadState(
  state: Pick<LoadState, 'ca' | 'al'>,
  impulse: number,
  tauChronic = DEFAULT_TAU_CHRONIC,
  tauAcute = DEFAULT_TAU_ACUTE,
): Pick<LoadState, 'ca' | 'al' | 'rb'> {
  const ca = state.ca + (impulse - state.ca) / tauChronic;
  const al = state.al + (impulse - state.al) / tauAcute;
  return { ca, al, rb: ca - al };
}

export function reconstructLoadState(
  entries: DailyImpulseEntry[],
  targetDate: string,
  options: { tauChronic?: number; tauAcute?: number; minimumHistoryDays?: number } = {},
): LoadState {
  const daily = aggregateDailyImpulse(entries);
  if (!daily.length) {
    return { ca: 0, al: 0, rb: 0, status: 'incomplete', daysProcessed: 0, daysWithData: 0, caNearZero: true };
  }

  const start = new Date(`${daily[0].date}T00:00:00`);
  const target = new Date(`${targetDate}T00:00:00`);
  if (target.getTime() < start.getTime()) {
    return { ca: 0, al: 0, rb: 0, status: 'incomplete', daysProcessed: 0, daysWithData: 0, caNearZero: true };
  }

  const byDate = new Map(daily.map(entry => [entry.date, entry.impulse]));
  const daysProcessed = Math.floor((target.getTime() - start.getTime()) / 86400000) + 1;
  let ca = 0;
  let al = 0;
  let daysWithData = 0;

  for (let index = 0; index < daysProcessed; index++) {
    const date = new Date(start.getTime() + index * 86400000).toISOString().slice(0, 10);
    const impulse = byDate.get(date) ?? 0;
    if (byDate.has(date)) daysWithData++;
    ({ ca, al } = advanceLoadState({ ca, al }, impulse, options.tauChronic, options.tauAcute));
  }

  const caNearZero = ca < 0.001;
  const minimumHistoryDays = options.minimumHistoryDays ?? DEFAULT_TAU_CHRONIC;
  const status = daysProcessed < minimumHistoryDays || caNearZero ? 'bootstrap' : 'ready';
  return { ca, al, rb: ca - al, status, daysProcessed, daysWithData, caNearZero };
}

export type DifficultyColor = 'green' | 'yellow' | 'red';

export interface DifficultyResult {
  ratio: number | null;
  difficulty: DifficultyColor | null;
  status: 'ready' | 'bootstrap' | 'insufficient';
}

export function calculateDifficulty(sessionImpulse: number | null, state: LoadState): DifficultyResult {
  if (sessionImpulse == null || state.caNearZero || state.status === 'incomplete') {
    return { ratio: null, difficulty: null, status: 'insufficient' };
  }
  const ratio = sessionImpulse / state.ca;
  let difficulty: DifficultyColor = ratio < 1.5 ? 'green' : ratio <= 2.5 ? 'yellow' : 'red';
  if (state.status === 'bootstrap') return { ratio, difficulty: null, status: 'bootstrap' };
  if (state.rb < -20) difficulty = difficulty === 'green' ? 'yellow' : difficulty === 'yellow' ? 'red' : 'red';
  return { ratio, difficulty, status: 'ready' };
}

export function classifyDifficultyRatio(ratio: number, rb = 0): DifficultyColor {
  let difficulty: DifficultyColor = ratio < 1.5 ? 'green' : ratio <= 2.5 ? 'yellow' : 'red';
  if (rb < -20) difficulty = difficulty === 'green' ? 'yellow' : 'red';
  return difficulty;
}

export function getDifficultyLabel(color: DifficultyColor): string {
  return color === 'green' ? 'Easy' : color === 'yellow' ? 'Moderate' : 'Hard';
}

export function getDifficultyClasses(color: DifficultyColor): {
  bg: string; text: string; border: string; dot: string; badge: string;
} {
  if (color === 'green') return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-300 dark:border-emerald-700', dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' };
  if (color === 'yellow') return { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-300 dark:border-amber-700', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' };
  return { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-200', border: 'border-red-300 dark:border-red-700', dot: 'bg-red-400', badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' };
}
