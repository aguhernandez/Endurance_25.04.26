import { Sport } from '../types/workout';

export interface TimeInZones {
  z1?: number;
  z2?: number;
  z3?: number;
  z4?: number;
  z5?: number;
  z6?: number;
  z7?: number;
}

export interface WellnessData {
  sleep_quality?: number | null;
  stress_level?: number | null;
  muscle_soreness?: number | null;
  mood?: number | null;
  perceived_effort?: number | null;
  fatigue_level?: number | null;
  notes?: string | null;
}

export interface AnalysisInput {
  athleteId: string;
  workoutId: string | null;
  sport: Sport;
  plannedDurationMinutes: number | null;
  actualDurationMinutes: number;
  plannedImpulse: number | null;
  actualAvgIntensityPctFtp?: number | null;
  plannedAvgIntensityPctFtp?: number | null;
  avgPowerWatts?: number | null;
  ftp?: number | null;
  avgPacePerKm?: number | null;
  thresholdPacePerKm?: number | null;
  avgHeartRate?: number | null;
  hrMax?: number | null;
  perceivedEffort?: number | null;
  timeInZones?: TimeInZones | null;
  currentFitness: number;
  currentFatigue: number;
  wellness?: WellnessData | null;
}

export interface Deviation {
  field: string;
  label: string;
  planned: number;
  actual: number;
  pct: number;
  direction: 'over' | 'under' | 'on_target';
}

export interface WorkoutAnalysisResult {
  athleteId: string;
  workoutId: string | null;
  completionScore: number;
  intensityScore: number;
  loadScore: number;
  finalScore: number;
  classification: 'green' | 'yellow' | 'red';
  impulsePlanned: number;
  impulseActual: number;
  fitness: number;
  fatigue: number;
  form: number;
  timeInZones: TimeInZones | null;
  deviations: Deviation[];
  insights: string[];
  wellness: WellnessData | null;
}

const SPORT_FACTORS: Record<Sport, number> = {
  cycling: 1.00,
  running: 1.15,
  swimming: 0.85,
};

const TAU_CHRONIC = 42;
const TAU_ACUTE = 7;

function computeActualImpulse(input: AnalysisInput): number {
  const durationHours = input.actualDurationMinutes / 60;
  const sportFactor = SPORT_FACTORS[input.sport] ?? 1.0;

  if (input.avgPowerWatts && input.ftp && input.ftp > 0) {
    const relIntensity = input.avgPowerWatts / input.ftp;
    return Math.round(durationHours * relIntensity * sportFactor * 100) / 100;
  }

  if (input.actualAvgIntensityPctFtp && input.actualAvgIntensityPctFtp > 0) {
    const relIntensity = input.actualAvgIntensityPctFtp / 100;
    return Math.round(durationHours * relIntensity * sportFactor * 100) / 100;
  }

  if (input.avgPacePerKm && input.thresholdPacePerKm && input.avgPacePerKm > 0) {
    const relIntensity = input.thresholdPacePerKm / input.avgPacePerKm;
    return Math.round(durationHours * relIntensity * sportFactor * 100) / 100;
  }

  if (input.timeInZones) {
    return computeImpulseFromZones(input.timeInZones, sportFactor);
  }

  if (input.perceivedEffort && input.perceivedEffort > 0) {
    const relIntensity = input.perceivedEffort / 10;
    return Math.round(durationHours * relIntensity * sportFactor * 100) / 100;
  }

  return Math.round(durationHours * 0.65 * sportFactor * 100) / 100;
}

const ZONE_INTENSITY_MAP: Record<number, number> = {
  1: 0.55,
  2: 0.70,
  3: 0.83,
  4: 0.95,
  5: 1.10,
  6: 1.20,
  7: 1.35,
};

function computeImpulseFromZones(zones: TimeInZones, sportFactor: number): number {
  let totalImpulse = 0;
  const entries = Object.entries(zones) as [string, number][];

  for (const [key, seconds] of entries) {
    if (!seconds || seconds <= 0) continue;
    const zoneNum = parseInt(key.replace('z', ''));
    const intensity = ZONE_INTENSITY_MAP[zoneNum] ?? 0.75;
    totalImpulse += (seconds / 3600) * intensity * sportFactor;
  }

  return Math.round(totalImpulse * 100) / 100;
}

function updateBanister(
  currentFitness: number,
  currentFatigue: number,
  impulse: number
): { fitness: number; fatigue: number; form: number } {
  const newFitness = currentFitness + (impulse - currentFitness) / TAU_CHRONIC;
  const newFatigue = currentFatigue + (impulse - currentFatigue) / TAU_ACUTE;
  return {
    fitness: Math.round(newFitness * 1000) / 1000,
    fatigue: Math.round(newFatigue * 1000) / 1000,
    form: Math.round((newFitness - newFatigue) * 1000) / 1000,
  };
}

function scoreCompletion(plannedDuration: number | null, actualDuration: number): number {
  if (!plannedDuration || plannedDuration <= 0) return 75;
  const ratio = actualDuration / plannedDuration;
  if (ratio >= 0.95 && ratio <= 1.10) return 100;
  if (ratio >= 0.85 && ratio < 0.95) return 80;
  if (ratio > 1.10 && ratio <= 1.20) return 85;
  if (ratio >= 0.70 && ratio < 0.85) return 60;
  if (ratio > 1.20) return 65;
  return Math.max(0, Math.round(ratio * 80));
}

function scoreIntensity(
  plannedPctFtp: number | null | undefined,
  actualPctFtp: number | null | undefined,
  perceivedEffort: number | null | undefined
): number {
  if (!plannedPctFtp || plannedPctFtp <= 0) {
    if (perceivedEffort && perceivedEffort >= 1) {
      const rpe = perceivedEffort;
      if (rpe >= 4 && rpe <= 7) return 85;
      if (rpe >= 3 && rpe <= 8) return 70;
      if (rpe === 1 || rpe === 2) return 60;
      return 55;
    }
    return 75;
  }

  if (!actualPctFtp || actualPctFtp <= 0) {
    if (perceivedEffort && perceivedEffort >= 1) {
      const rpeAsPct = perceivedEffort * 10;
      const diff = Math.abs(rpeAsPct - plannedPctFtp);
      if (diff <= 5) return 85;
      if (diff <= 15) return 70;
      return 55;
    }
    return 70;
  }

  const ratio = actualPctFtp / plannedPctFtp;
  if (ratio >= 0.95 && ratio <= 1.05) return 100;
  if (ratio >= 0.88 && ratio < 0.95) return 82;
  if (ratio > 1.05 && ratio <= 1.12) return 85;
  if (ratio >= 0.75 && ratio < 0.88) return 65;
  if (ratio > 1.12) return 60;
  return Math.max(0, Math.round(ratio * 75));
}

function scoreLoad(plannedImpulse: number | null, actualImpulse: number): number {
  if (!plannedImpulse || plannedImpulse <= 0) return 75;
  const ratio = actualImpulse / plannedImpulse;
  if (ratio >= 0.90 && ratio <= 1.10) return 100;
  if (ratio >= 0.75 && ratio < 0.90) return 80;
  if (ratio > 1.10 && ratio <= 1.25) return 75;
  if (ratio >= 0.60 && ratio < 0.75) return 55;
  if (ratio > 1.25) return 45;
  return Math.max(0, Math.round(ratio * 60));
}

function computeFinalScore(completion: number, intensity: number, load: number): number {
  return Math.round(completion * 0.30 + intensity * 0.35 + load * 0.35);
}

function classifyScore(score: number, form: number): 'green' | 'yellow' | 'red' {
  if (score >= 80 && form > -10) return 'green';
  if (score >= 60 && form > -25) return 'yellow';
  return 'red';
}

function buildDeviations(
  plannedDuration: number | null,
  actualDuration: number,
  plannedPctFtp: number | null | undefined,
  actualPctFtp: number | null | undefined,
  plannedImpulse: number | null,
  actualImpulse: number
): Deviation[] {
  const deviations: Deviation[] = [];

  if (plannedDuration && plannedDuration > 0) {
    const pct = Math.round(((actualDuration - plannedDuration) / plannedDuration) * 100);
    deviations.push({
      field: 'duration',
      label: 'Duration',
      planned: plannedDuration,
      actual: actualDuration,
      pct,
      direction: Math.abs(pct) <= 5 ? 'on_target' : pct > 0 ? 'over' : 'under',
    });
  }

  if (plannedPctFtp && plannedPctFtp > 0 && actualPctFtp && actualPctFtp > 0) {
    const pct = Math.round(((actualPctFtp - plannedPctFtp) / plannedPctFtp) * 100);
    deviations.push({
      field: 'intensity',
      label: 'Intensity (%FTP)',
      planned: plannedPctFtp,
      actual: actualPctFtp,
      pct,
      direction: Math.abs(pct) <= 5 ? 'on_target' : pct > 0 ? 'over' : 'under',
    });
  }

  if (plannedImpulse && plannedImpulse > 0) {
    const pct = Math.round(((actualImpulse - plannedImpulse) / plannedImpulse) * 100);
    deviations.push({
      field: 'load',
      label: 'Training Load',
      planned: plannedImpulse,
      actual: actualImpulse,
      pct,
      direction: Math.abs(pct) <= 10 ? 'on_target' : pct > 0 ? 'over' : 'under',
    });
  }

  return deviations;
}

function generateInsights(
  input: AnalysisInput,
  completionScore: number,
  intensityScore: number,
  loadScore: number,
  finalScore: number,
  deviations: Deviation[],
  newForm: number,
  timeInZones: TimeInZones | null
): string[] {
  const insights: string[] = [];

  if (finalScore >= 90) {
    insights.push('Excellent execution — session aligned very closely with the plan.');
  } else if (finalScore >= 75) {
    insights.push('Good session — minor deviations within acceptable range.');
  } else if (finalScore >= 55) {
    insights.push('Session completed with notable deviations from the plan. Consider adjusting future workouts.');
  } else {
    insights.push('Session deviated significantly from plan. Review load and intensity targets.');
  }

  const durationDev = deviations.find(d => d.field === 'duration');
  if (durationDev && durationDev.pct > 15) {
    insights.push(`Duration exceeded plan by ${durationDev.pct}%. Watch accumulated fatigue this week.`);
  } else if (durationDev && durationDev.pct < -15) {
    insights.push(`Session was cut short by ${Math.abs(durationDev.pct)}% of planned duration.`);
  }

  const intensityDev = deviations.find(d => d.field === 'intensity');
  if (intensityDev && intensityDev.pct > 10) {
    insights.push(`Intensity ran ${intensityDev.pct}% above target — monitor recovery over next 48h.`);
  } else if (intensityDev && intensityDev.pct < -10) {
    insights.push(`Intensity was ${Math.abs(intensityDev.pct)}% below target. If unintentional, check pacing strategy.`);
  }

  if (newForm < -20) {
    insights.push('Form (readiness) is deeply negative. Prioritize recovery before next hard session.');
  } else if (newForm < -10) {
    insights.push('Fatigue accumulation detected. Ensure adequate sleep and nutrition.');
  } else if (newForm > 10) {
    insights.push('Form is positive — athlete is fresh and ready for quality work.');
  }

  if (timeInZones) {
    const totalSec = Object.values(timeInZones).reduce((s, v) => s + (v ?? 0), 0);
    if (totalSec > 0) {
      const z4z5Sec = (timeInZones.z4 ?? 0) + (timeInZones.z5 ?? 0) + (timeInZones.z6 ?? 0) + (timeInZones.z7 ?? 0);
      const highIntensityPct = Math.round((z4z5Sec / totalSec) * 100);
      if (highIntensityPct > 40) {
        insights.push(`High intensity zones (Z4+) accounted for ${highIntensityPct}% of session time. High metabolic demand.`);
      }
      const z2Sec = timeInZones.z2 ?? 0;
      const z2Pct = Math.round((z2Sec / totalSec) * 100);
      if (z2Pct > 60 && input.sport === 'cycling') {
        insights.push('Good aerobic base work — majority of time in Z2 endurance zone.');
      }
    }
  }

  if (input.wellness?.sleep_quality && input.wellness.sleep_quality <= 3) {
    insights.push('Low reported sleep quality may have impacted performance today.');
  }

  if (input.wellness?.muscle_soreness && input.wellness.muscle_soreness >= 7) {
    insights.push('High muscle soreness reported. Consider extra mobility or reduce intensity tomorrow.');
  }

  return insights;
}

export function analyzeWorkout(input: AnalysisInput): WorkoutAnalysisResult {
  const impulseActual = computeActualImpulse(input);
  const impulsePlanned = input.plannedImpulse ?? 0;

  const completionScore = scoreCompletion(input.plannedDurationMinutes, input.actualDurationMinutes);
  const intensityScore = scoreIntensity(
    input.plannedAvgIntensityPctFtp,
    input.actualAvgIntensityPctFtp,
    input.perceivedEffort
  );
  const loadScore = scoreLoad(impulsePlanned > 0 ? impulsePlanned : null, impulseActual);
  const finalScore = computeFinalScore(completionScore, intensityScore, loadScore);

  const { fitness, fatigue, form } = updateBanister(
    input.currentFitness,
    input.currentFatigue,
    impulseActual
  );

  const classification = classifyScore(finalScore, form);

  const deviations = buildDeviations(
    input.plannedDurationMinutes,
    input.actualDurationMinutes,
    input.plannedAvgIntensityPctFtp,
    input.actualAvgIntensityPctFtp,
    impulsePlanned > 0 ? impulsePlanned : null,
    impulseActual
  );

  const insights = generateInsights(
    input,
    completionScore,
    intensityScore,
    loadScore,
    finalScore,
    deviations,
    form,
    input.timeInZones ?? null
  );

  return {
    athleteId: input.athleteId,
    workoutId: input.workoutId,
    completionScore,
    intensityScore,
    loadScore,
    finalScore,
    classification,
    impulsePlanned,
    impulseActual,
    fitness,
    fatigue,
    form,
    timeInZones: input.timeInZones ?? null,
    deviations,
    insights,
    wellness: input.wellness ?? null,
  };
}
