import { Sport, WorkoutStep } from '../types/workout';

export type DifficultyColor = 'green' | 'yellow' | 'red';

export interface SessionImpulseInput {
  durationMinutes: number;
  sport: Sport;
  avgPowerWatts?: number | null;
  ftp?: number | null;
  avgPacePerKm?: number | null;
  thresholdPacePerKm?: number | null;
  perceivedEffort?: number | null;
}

export interface SSRResult {
  sessionImpulse: number;
  currentCA: number;
  ssr: number;
  difficulty: DifficultyColor;
}

export interface CUResult {
  sessionImpulse: number;
  currentCA: number;
  cu: number;
  difficulty: DifficultyColor;
  label: string;
}

const SPORT_FACTORS: Record<Sport, number> = {
  cycling: 1.00,
  running: 1.15,
  swimming: 0.85,
};

const CU_SPORT_FACTORS: Record<Sport, number> = {
  cycling: 1.00,
  running: 0.85,
  swimming: 0.65,
};

const TAU_CHRONIC = 28;

export function calculateSessionImpulse(input: SessionImpulseInput): number {
  const durationHours = input.durationMinutes / 60;
  const sportFactor = SPORT_FACTORS[input.sport] ?? 1.0;

  let relativeIntensity = 0;

  if (input.sport === 'cycling' && input.avgPowerWatts && input.ftp && input.ftp > 0) {
    relativeIntensity = input.avgPowerWatts / input.ftp;
  } else if (
    (input.sport === 'running' || input.sport === 'swimming') &&
    input.avgPacePerKm &&
    input.thresholdPacePerKm &&
    input.avgPacePerKm > 0
  ) {
    relativeIntensity = input.thresholdPacePerKm / input.avgPacePerKm;
  } else if (input.perceivedEffort && input.perceivedEffort > 0) {
    relativeIntensity = input.perceivedEffort / 10;
  } else {
    relativeIntensity = 0.65;
  }

  return durationHours * relativeIntensity * sportFactor;
}

export interface DailyImpulseEntry {
  date: string;
  impulse: number;
}

export function reconstructCA(dailyImpulses: DailyImpulseEntry[], targetDate: string): number {
  if (dailyImpulses.length === 0) return 0;

  const sorted = [...dailyImpulses].sort((a, b) => a.date.localeCompare(b.date));

  const avgImpulse = sorted.reduce((sum, d) => sum + d.impulse, 0) / sorted.length;
  let ca = avgImpulse;

  const target = new Date(targetDate + 'T00:00:00');
  const start = new Date(sorted[0].date + 'T00:00:00');

  const impulseMap = new Map<string, number>();
  for (const entry of sorted) {
    impulseMap.set(entry.date, entry.impulse);
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.round((target.getTime() - start.getTime()) / msPerDay);

  for (let i = 0; i <= totalDays; i++) {
    const d = new Date(start.getTime() + i * msPerDay);
    const dateStr = d.toISOString().split('T')[0];
    const impulse = impulseMap.get(dateStr) ?? 0;
    ca = ca + (impulse - ca) / TAU_CHRONIC;
  }

  return ca;
}

export function reconstructCAAndAL(
  dailyImpulses: DailyImpulseEntry[],
  targetDate: string
): { ca: number; al: number; rb: number } {
  if (dailyImpulses.length === 0) return { ca: 0, al: 0, rb: 0 };

  const sorted = [...dailyImpulses].sort((a, b) => a.date.localeCompare(b.date));

  const avgImpulse = sorted.reduce((sum, d) => sum + d.impulse, 0) / sorted.length;
  let ca = avgImpulse;
  let al = avgImpulse;

  const target = new Date(targetDate + 'T00:00:00');
  const start = new Date(sorted[0].date + 'T00:00:00');

  const impulseMap = new Map<string, number>();
  for (const entry of sorted) {
    impulseMap.set(entry.date, entry.impulse);
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.round((target.getTime() - start.getTime()) / msPerDay);

  for (let i = 0; i <= totalDays; i++) {
    const d = new Date(start.getTime() + i * msPerDay);
    const dateStr = d.toISOString().split('T')[0];
    const impulse = impulseMap.get(dateStr) ?? 0;
    ca = ca + (impulse - ca) / TAU_CHRONIC;
    al = al + (impulse - al) / 7;
  }

  return { ca, al, rb: ca - al };
}

export function classifySSR(ssr: number, rb: number): DifficultyColor {
  let base: DifficultyColor;

  if (ssr < 1.5) {
    base = 'green';
  } else if (ssr <= 2.5) {
    base = 'yellow';
  } else {
    base = 'red';
  }

  if (rb < -20) {
    if (base === 'green') base = 'yellow';
    else if (base === 'yellow') base = 'red';
  }

  return base;
}

export function computeSSR(
  sessionImpulse: number,
  currentCA: number,
  currentRB: number
): SSRResult {
  const ca = currentCA > 0 ? currentCA : 1;
  const ssr = sessionImpulse / ca;
  const difficulty = classifySSR(ssr, currentRB);

  return {
    sessionImpulse,
    currentCA: ca,
    ssr,
    difficulty,
  };
}

export function getDifficultyLabel(color: DifficultyColor): string {
  switch (color) {
    case 'green': return 'Easy';
    case 'yellow': return 'Moderate';
    case 'red': return 'Hard';
  }
}

export function classifyCU(cu: number): DifficultyColor {
  if (cu < 0.8) return 'green';
  if (cu <= 1.2) return 'yellow';
  return 'red';
}

export function getCULabel(cu: number): string {
  if (cu < 0.8) return 'Easy stimulus';
  if (cu <= 1.2) return 'Optimal stimulus';
  if (cu <= 1.5) return 'Heavy stimulus';
  return 'Excessive load risk';
}

export function computeCapacityUtilization(
  sessionImpulse: number,
  currentCA: number,
  sport: Sport
): CUResult {
  const ca = currentCA > 0 ? currentCA : 1;
  const cuSportFactor = CU_SPORT_FACTORS[sport] ?? 1.0;
  const cu = sessionImpulse / (ca * cuSportFactor);
  const difficulty = classifyCU(cu);
  const label = getCULabel(cu);

  return {
    sessionImpulse,
    currentCA: ca,
    cu,
    difficulty,
    label,
  };
}

const ZONE5_RELATIVE_INTENSITY: Record<number, number> = {
  1: 0.55,
  2: 0.70,
  3: 0.83,
  4: 0.95,
  5: 1.10,
};

const ZONE7_RELATIVE_INTENSITY: Record<number, number> = {
  1: 0.50,
  2: 0.62,
  3: 0.73,
  4: 0.83,
  5: 0.95,
  6: 1.05,
  7: 1.20,
};

const STEP_TYPE_DEFAULT_INTENSITY: Record<string, number> = {
  warmup: 0.55,
  cooldown: 0.55,
  recovery: 0.60,
  steady: 0.75,
  interval: 1.00,
};

function stepRelativeIntensity(
  step: WorkoutStep,
  ftp: number | null,
  thresholdPacePerKm: number | null,
  zoneSystem: '5' | '7' = '5'
): number {
  if (step.target_percent_ftp && step.target_percent_ftp > 0) {
    return step.target_percent_ftp / 100;
  }

  if (step.target_zone && step.target_zone > 0) {
    const map = zoneSystem === '7' ? ZONE7_RELATIVE_INTENSITY : ZONE5_RELATIVE_INTENSITY;
    return map[step.target_zone] ?? 0.75;
  }

  if (step.target_type === 'power' && step.target_min_value && step.target_max_value && ftp && ftp > 0) {
    const avgWatts = (step.target_min_value + step.target_max_value) / 2;
    return avgWatts / ftp;
  }

  if (step.target_type === 'pace' && step.target_min_value && step.target_max_value && thresholdPacePerKm && thresholdPacePerKm > 0) {
    const avgPace = (step.target_min_value + step.target_max_value) / 2;
    return avgPace > 0 ? thresholdPacePerKm / avgPace : 0.75;
  }

  return STEP_TYPE_DEFAULT_INTENSITY[step.step_type] ?? 0.75;
}

export interface WorkoutImpulseInput {
  steps: WorkoutStep[];
  sport: Sport;
  ftp?: number | null;
  thresholdPacePerKm?: number | null;
  zoneSystem?: '5' | '7';
  fallbackDurationMinutes?: number;
}

export function calculateWorkoutImpulseFromSteps(input: WorkoutImpulseInput): number {
  const sportFactor = SPORT_FACTORS[input.sport] ?? 1.0;

  if (!input.steps || input.steps.length === 0) {
    const durationHours = (input.fallbackDurationMinutes ?? 60) / 60;
    return durationHours * 0.65 * sportFactor;
  }

  let totalImpulse = 0;

  for (const step of input.steps) {
    let durationHours = 0;

    if (step.duration_type === 'time') {
      durationHours = step.duration_value / 3600;
    } else {
      durationHours = step.duration_value / 1000 / 15;
    }

    const relIntensity = stepRelativeIntensity(
      step,
      input.ftp ?? null,
      input.thresholdPacePerKm ?? null,
      input.zoneSystem ?? '5'
    );

    totalImpulse += durationHours * relIntensity * sportFactor;
  }

  return Math.round(totalImpulse * 100) / 100;
}

export function getDifficultyClasses(color: DifficultyColor): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  badge: string;
} {
  switch (color) {
    case 'green':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-800 dark:text-emerald-200',
        border: 'border-emerald-300 dark:border-emerald-700',
        dot: 'bg-emerald-400',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      };
    case 'yellow':
      return {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-800 dark:text-amber-200',
        border: 'border-amber-300 dark:border-amber-700',
        dot: 'bg-amber-400',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      };
    case 'red':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-800 dark:text-red-200',
        border: 'border-red-300 dark:border-red-700',
        dot: 'bg-red-400',
        badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
      };
  }
}
