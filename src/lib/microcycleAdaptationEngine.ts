import { WeekSimResult } from './banisterEngine';
import { WeeklySummaryData } from './weeklySummary';
import { Sport } from '../types/workout';

// ─── Input State ─────────────────────────────────────────────────────────────

export interface AdaptationInput {
  athleteId: string;
  planId: string | null;
  weekNumber: number;
  weekStartDate: string;
  nextWeekNumber: number;
  nextWeekStartDate: string;

  // Current state from Banister model (end of completed week)
  currentCA: number;
  currentAL: number;
  currentRB: number;

  // Planned state for next week (from ATP simulation)
  plannedNextWeekImpulse: number;
  plannedNextWeekCA: number;
  plannedNextWeekRB: number;

  // Execution quality this week
  weekFinalScore: number | null;
  weekClassification: 'green' | 'yellow' | 'red' | null;
  actualWeekImpulse: number;
  plannedWeekImpulse: number;

  // Banister params
  rbMin: number;
  tauChronic: number;
  tauAcute: number;

  // Context
  microcycleWeek: number;
  daysToNextAEvent: number | null;
  daysToNextBEvent: number | null;
  isNextWeekRecovery: boolean;

  // Athlete wellness (optional)
  avgPerceivedEffort: number | null;
  avgFatigueLevel: number | null;
  avgSleepQuality: number | null;
  injuryConcerns: boolean;

  // Recent analysis scores (last 3 sessions)
  recentScores: number[];
}

// ─── Output ───────────────────────────────────────────────────────────────────

export type AdaptationRuleId =
  | 'FATIGUE_HIGH'
  | 'FATIGUE_CRITICAL'
  | 'FORM_POSITIVE'
  | 'LOAD_UNDERACHIEVEMENT_SEVERE'
  | 'LOAD_UNDERACHIEVEMENT_MODERATE'
  | 'LOAD_OVERACHIEVEMENT_SEVERE'
  | 'LOAD_OVERACHIEVEMENT_MODERATE'
  | 'WELLNESS_RED_FLAG'
  | 'INJURY_CONCERN'
  | 'PRE_EVENT_TAPER_ADJUST'
  | 'MICROCYCLE_RECOVERY_PROTECT'
  | 'CONSISTENT_UNDERPERFORMANCE'
  | 'CONSISTENT_OVERPERFORMANCE'
  | 'NO_ADAPTATION_NEEDED';

export interface SafetyFlag {
  code: string;
  message: string;
  severity: 'warning' | 'block';
}

export interface AdaptationProposal {
  athleteId: string;
  planId: string | null;
  weekNumber: number;
  weekStartDate: string;
  triggerReason: 'post_workout' | 'weekly_review' | 'manual';
  ruleId: AdaptationRuleId;
  ruleLabel: string;
  previousImpulse: number;
  proposedImpulse: number;
  loadDeltaPct: number;
  rationale: string;
  safetyFlags: SafetyFlag[];
  inputSnapshot: AdaptationInput;
}

// ─── Safety constraints ───────────────────────────────────────────────────────

const MAX_WEEK_INCREASE_PCT = 0.10;
const MAX_WEEK_DECREASE_PCT = 0.30;
const ABSOLUTE_MAX_SINGLE_WEEK_IMPULSE = 8.0;
const RB_DANGER_FLOOR = -30;

function clampLoadChange(
  proposed: number,
  current: number,
  flags: SafetyFlag[]
): number {
  if (current <= 0) return Math.max(0, proposed);

  const maxIncrease = current * (1 + MAX_WEEK_INCREASE_PCT);
  const maxDecrease = current * (1 - MAX_WEEK_DECREASE_PCT);

  let clamped = proposed;

  if (clamped > maxIncrease) {
    flags.push({
      code: 'CLAMPED_INCREASE',
      message: `Load increase limited to ${Math.round(MAX_WEEK_INCREASE_PCT * 100)}% per week (progressive overload safety)`,
      severity: 'warning',
    });
    clamped = maxIncrease;
  }

  if (clamped < maxDecrease) {
    flags.push({
      code: 'CLAMPED_DECREASE',
      message: `Load decrease limited to ${Math.round(MAX_WEEK_DECREASE_PCT * 100)}% per week (detraining prevention)`,
      severity: 'warning',
    });
    clamped = maxDecrease;
  }

  if (clamped > ABSOLUTE_MAX_SINGLE_WEEK_IMPULSE) {
    flags.push({
      code: 'ABSOLUTE_MAX_IMPULSE',
      message: `Weekly impulse capped at ${ABSOLUTE_MAX_SINGLE_WEEK_IMPULSE} (absolute safety ceiling)`,
      severity: 'warning',
    });
    clamped = ABSOLUTE_MAX_SINGLE_WEEK_IMPULSE;
  }

  return Math.max(0, Math.round(clamped * 1000) / 1000);
}

function simulateWeekEndRB(
  currentCA: number,
  currentAL: number,
  weeklyImpulse: number,
  tauChronic: number,
  tauAcute: number,
  days = 7
): number {
  let ca = currentCA;
  let al = currentAL;
  const dailyImpulse = weeklyImpulse / days;

  for (let i = 0; i < days; i++) {
    ca = ca + (dailyImpulse - ca) / tauChronic;
    al = al + (dailyImpulse - al) / tauAcute;
  }

  return ca - al;
}

function buildNoAdaptation(input: AdaptationInput): AdaptationProposal {
  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'NO_ADAPTATION_NEEDED',
    ruleLabel: 'No Adaptation Needed',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: input.plannedNextWeekImpulse,
    loadDeltaPct: 0,
    rationale: 'Execution was consistent with plan. No adjustment required for next week.',
    safetyFlags: [],
    inputSnapshot: input,
  };
}

// ─── Rules ────────────────────────────────────────────────────────────────────

function ruleFatigueCritical(input: AdaptationInput): AdaptationProposal | null {
  if (input.currentRB >= RB_DANGER_FLOOR) return null;

  const flags: SafetyFlag[] = [
    {
      code: 'RB_CRITICAL',
      message: `RB = ${input.currentRB.toFixed(1)}, well below danger floor (${RB_DANGER_FLOOR})`,
      severity: 'block',
    },
  ];

  const proposedRaw = input.plannedNextWeekImpulse * 0.55;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'FATIGUE_CRITICAL',
    ruleLabel: 'Critical Fatigue — Mandatory Recovery',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: `Readiness Balance (RB = ${input.currentRB.toFixed(1)}) is critically low. Mandatory recovery block to prevent overtraining. Next week load reduced by ~45%.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleFatigueHigh(input: AdaptationInput): AdaptationProposal | null {
  const isHighFatigue = input.currentRB < -20 && input.currentRB >= RB_DANGER_FLOOR;
  const wellnessConfirms =
    (input.avgFatigueLevel !== null && input.avgFatigueLevel >= 7) ||
    (input.avgPerceivedEffort !== null && input.avgPerceivedEffort >= 8);

  if (!isHighFatigue && !wellnessConfirms) return null;
  if (!isHighFatigue && !(wellnessConfirms && input.currentRB < -10)) return null;

  const flags: SafetyFlag[] = [];
  const reductionFactor = isHighFatigue ? 0.80 : 0.88;
  const proposedRaw = input.plannedNextWeekImpulse * reductionFactor;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  const pct = Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'FATIGUE_HIGH',
    ruleLabel: 'High Fatigue — Load Reduction',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: pct,
    rationale: `RB = ${input.currentRB.toFixed(1)} indicates high fatigue accumulation${wellnessConfirms ? ' (confirmed by athlete wellness data)' : ''}. Reducing next week load by ${Math.abs(pct)}% to allow recovery without halting adaptation.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleInjuryConcern(input: AdaptationInput): AdaptationProposal | null {
  if (!input.injuryConcerns) return null;

  const flags: SafetyFlag[] = [
    {
      code: 'INJURY_CONCERN_REPORTED',
      message: 'Athlete reported injury concerns — load reduced as precaution',
      severity: 'warning',
    },
  ];

  const proposedRaw = input.plannedNextWeekImpulse * 0.70;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'INJURY_CONCERN',
    ruleLabel: 'Injury Concern — Precautionary Reduction',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: 'Athlete reported injury concern. Load reduced by 30% as precaution. Review with athlete before confirming.',
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleWellnessRedFlag(input: AdaptationInput): AdaptationProposal | null {
  const poorSleep = input.avgSleepQuality !== null && input.avgSleepQuality <= 3;
  const highStress = false;
  const severeRPE = input.avgPerceivedEffort !== null && input.avgPerceivedEffort >= 9;
  const highFatigue = input.avgFatigueLevel !== null && input.avgFatigueLevel >= 8;

  const flagCount = [poorSleep, highStress, severeRPE, highFatigue].filter(Boolean).length;
  if (flagCount < 2) return null;

  const flags: SafetyFlag[] = [];
  const proposedRaw = input.plannedNextWeekImpulse * 0.85;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  const concerns: string[] = [];
  if (poorSleep) concerns.push(`sleep quality (${input.avgSleepQuality?.toFixed(1)}/10)`);
  if (severeRPE) concerns.push(`perceived effort (${input.avgPerceivedEffort?.toFixed(1)}/10)`);
  if (highFatigue) concerns.push(`fatigue level (${input.avgFatigueLevel?.toFixed(1)}/10)`);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'WELLNESS_RED_FLAG',
    ruleLabel: 'Wellness Red Flag — Moderate Reduction',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: `Multiple wellness flags: ${concerns.join(', ')}. Reducing next week load by 15% to support recovery.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleMicrocycleRecovery(input: AdaptationInput): AdaptationProposal | null {
  if (!input.isNextWeekRecovery) return null;

  const plannedAlreadyReduced = input.plannedNextWeekImpulse < input.actualWeekImpulse * 0.80;
  if (plannedAlreadyReduced) return null;

  const flags: SafetyFlag[] = [];
  const proposedRaw = Math.min(input.plannedNextWeekImpulse, input.actualWeekImpulse * 0.75);
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'MICROCYCLE_RECOVERY_PROTECT',
    ruleLabel: 'Microcycle Week 4 — Recovery Protection',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: 'Next week is Week 4 of the microcycle (recovery week). Protecting planned recovery by ensuring load stays at ~75% of this week\'s actual impulse.',
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function rulePreEventTaper(input: AdaptationInput): AdaptationProposal | null {
  const days = input.daysToNextAEvent ?? input.daysToNextBEvent;
  const isPriority = input.daysToNextAEvent !== null ? 'A' : (input.daysToNextBEvent !== null ? 'B' : null);

  if (!days || !isPriority) return null;
  if (days > 14) return null;

  const taperFactor = isPriority === 'A'
    ? (days <= 7 ? 0.55 : 0.75)
    : (days <= 7 ? 0.65 : 0.85);

  const flags: SafetyFlag[] = [];
  const proposedRaw = input.plannedNextWeekImpulse * taperFactor;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'PRE_EVENT_TAPER_ADJUST',
    ruleLabel: `Pre-Event Taper (Priority ${isPriority})`,
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: `Priority ${isPriority} event in ${days} days. Applying taper — load reduced to ${Math.round(taperFactor * 100)}% of plan to optimize race readiness.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleLoadUnderachievementSevere(input: AdaptationInput): AdaptationProposal | null {
  if (!input.plannedWeekImpulse || input.plannedWeekImpulse <= 0) return null;

  const achievedPct = input.actualWeekImpulse / input.plannedWeekImpulse;
  if (achievedPct >= 0.70) return null;

  const flags: SafetyFlag[] = [];
  const recoveryFactor = 0.80 + achievedPct * 0.10;
  const proposedRaw = input.plannedNextWeekImpulse * recoveryFactor;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'post_workout',
    ruleId: 'LOAD_UNDERACHIEVEMENT_SEVERE',
    ruleLabel: 'Severe Load Shortfall — Adjusted Ramp',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: `This week achieved only ${Math.round(achievedPct * 100)}% of planned load. To prevent an aggressive jump, next week targets adjusted to realistic progression from actual baseline.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleLoadUnderachievementModerate(input: AdaptationInput): AdaptationProposal | null {
  if (!input.plannedWeekImpulse || input.plannedWeekImpulse <= 0) return null;

  const achievedPct = input.actualWeekImpulse / input.plannedWeekImpulse;
  if (achievedPct < 0.70 || achievedPct >= 0.85) return null;

  if (input.currentRB < -15) return null;

  const flags: SafetyFlag[] = [];
  const proposedRaw = input.plannedNextWeekImpulse * 0.92;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'post_workout',
    ruleId: 'LOAD_UNDERACHIEVEMENT_MODERATE',
    ruleLabel: 'Moderate Load Shortfall — Minor Adjustment',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: `This week achieved ${Math.round(achievedPct * 100)}% of planned load. Minor reduction to next week ensures progressive adaptation rather than an unrealistic jump.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleLoadOverachievementSevere(input: AdaptationInput): AdaptationProposal | null {
  if (!input.plannedWeekImpulse || input.plannedWeekImpulse <= 0) return null;

  const achievedPct = input.actualWeekImpulse / input.plannedWeekImpulse;
  if (achievedPct <= 1.20) return null;

  const flags: SafetyFlag[] = [];

  const projectedRBAfterNextWeek = simulateWeekEndRB(
    input.currentCA,
    input.currentAL,
    input.plannedNextWeekImpulse,
    input.tauChronic,
    input.tauAcute
  );

  if (projectedRBAfterNextWeek < input.rbMin) {
    flags.push({
      code: 'RB_FLOOR_RISK',
      message: `Proceeding with planned load would push RB below minimum (${input.rbMin})`,
      severity: 'warning',
    });
  }

  const proposedRaw = input.plannedNextWeekImpulse * 0.88;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'post_workout',
    ruleId: 'LOAD_OVERACHIEVEMENT_SEVERE',
    ruleLabel: 'Severe Load Excess — Compensatory Reduction',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: `This week was ${Math.round((achievedPct - 1) * 100)}% above plan. To prevent excessive fatigue accumulation next week, applying a compensatory reduction.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleLoadOverachievementModerate(input: AdaptationInput): AdaptationProposal | null {
  if (!input.plannedWeekImpulse || input.plannedWeekImpulse <= 0) return null;

  const achievedPct = input.actualWeekImpulse / input.plannedWeekImpulse;
  if (achievedPct < 1.10 || achievedPct >= 1.20) return null;

  if (input.currentRB > -5) return null;

  const flags: SafetyFlag[] = [];
  const proposedRaw = input.plannedNextWeekImpulse * 0.93;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'post_workout',
    ruleId: 'LOAD_OVERACHIEVEMENT_MODERATE',
    ruleLabel: 'Moderate Load Excess — Minor Trim',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: `Load was ${Math.round((achievedPct - 1) * 100)}% above plan while fatigue is elevated. Trimming next week slightly to maintain RB above floor.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleFormPositive(input: AdaptationInput): AdaptationProposal | null {
  if (input.currentRB <= 15) return null;
  if (input.weekClassification !== 'green') return null;
  if (input.isNextWeekRecovery) return null;
  if (input.daysToNextAEvent !== null && input.daysToNextAEvent <= 14) return null;

  const flags: SafetyFlag[] = [];
  const proposedRaw = input.plannedNextWeekImpulse * (1 + MAX_WEEK_INCREASE_PCT);
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  const pct = Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100);
  if (pct <= 0) return null;

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'FORM_POSITIVE',
    ruleLabel: 'Positive Form — Progressive Load Opportunity',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: pct,
    rationale: `RB = ${input.currentRB.toFixed(1)} (very fresh) and execution was excellent. Incrementally increasing load by ${pct}% to take advantage of supercompensation window.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleConsistentUnderperformance(input: AdaptationInput): AdaptationProposal | null {
  if (input.recentScores.length < 3) return null;
  const allBad = input.recentScores.every(s => s < 60);
  if (!allBad) return null;

  const flags: SafetyFlag[] = [];
  const proposedRaw = input.plannedNextWeekImpulse * 0.85;
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  const avg = Math.round(input.recentScores.reduce((s, v) => s + v, 0) / input.recentScores.length);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'CONSISTENT_UNDERPERFORMANCE',
    ruleLabel: 'Consistent Underperformance — Plan Recalibration',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: `Average session score over last 3 sessions: ${avg}/100. Plan may be too aggressive. Reducing load by 15% to find a sustainable level before progressing again.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

function ruleConsistentOverperformance(input: AdaptationInput): AdaptationProposal | null {
  if (input.recentScores.length < 3) return null;
  const allGood = input.recentScores.every(s => s >= 85);
  if (!allGood) return null;
  if (input.isNextWeekRecovery) return null;
  if (input.currentRB <= 5) return null;

  const flags: SafetyFlag[] = [];
  const proposedRaw = input.plannedNextWeekImpulse * (1 + MAX_WEEK_INCREASE_PCT);
  const proposed = clampLoadChange(proposedRaw, input.plannedNextWeekImpulse, flags);

  const avg = Math.round(input.recentScores.reduce((s, v) => s + v, 0) / input.recentScores.length);

  return {
    athleteId: input.athleteId,
    planId: input.planId,
    weekNumber: input.nextWeekNumber,
    weekStartDate: input.nextWeekStartDate,
    triggerReason: 'weekly_review',
    ruleId: 'CONSISTENT_OVERPERFORMANCE',
    ruleLabel: 'Consistent High Performance — Incremental Progression',
    previousImpulse: input.plannedNextWeekImpulse,
    proposedImpulse: proposed,
    loadDeltaPct: Math.round(((proposed - input.plannedNextWeekImpulse) / input.plannedNextWeekImpulse) * 100),
    rationale: `Average session score over last 3 sessions: ${avg}/100. Athlete is consistently exceeding targets. Incrementally increasing next week's load to keep pace with adaptation.`,
    safetyFlags: flags,
    inputSnapshot: input,
  };
}

// ─── Rule Priority Chain ──────────────────────────────────────────────────────
// Rules run in priority order. First rule that fires wins.
// Safety-critical rules override performance optimization rules.

export function computeAdaptation(input: AdaptationInput): AdaptationProposal {
  const rules = [
    ruleFatigueCritical,
    ruleInjuryConcern,
    ruleFatigueHigh,
    rulePreEventTaper,
    ruleWellnessRedFlag,
    ruleMicrocycleRecovery,
    ruleLoadUnderachievementSevere,
    ruleLoadOverachievementSevere,
    ruleConsistentUnderperformance,
    ruleLoadUnderachievementModerate,
    ruleLoadOverachievementModerate,
    ruleConsistentOverperformance,
    ruleFormPositive,
  ];

  for (const rule of rules) {
    const proposal = rule(input);
    if (proposal) return proposal;
  }

  return buildNoAdaptation(input);
}

// ─── Input Builder Helpers ────────────────────────────────────────────────────

export function buildAdaptationInput(params: {
  athleteId: string;
  planId: string | null;
  currentWeek: WeeklySummaryData;
  nextWeek: WeekSimResult;
  rbMin: number;
  tauChronic: number;
  tauAcute: number;
  daysToNextAEvent: number | null;
  daysToNextBEvent: number | null;
  avgPerceivedEffort: number | null;
  avgFatigueLevel: number | null;
  avgSleepQuality: number | null;
  injuryConcerns: boolean;
  recentScores: number[];
  weekFinalScore: number | null;
  weekClassification: 'green' | 'yellow' | 'red' | null;
}): AdaptationInput {
  const nextMicrocycleWeek = ((params.nextWeek.weekNumber % 4) + 1);

  return {
    athleteId: params.athleteId,
    planId: params.planId,
    weekNumber: params.currentWeek.weekNumber,
    weekStartDate: params.currentWeek.weekStartDate,
    nextWeekNumber: params.nextWeek.weekNumber,
    nextWeekStartDate: params.nextWeek.weekStartDate,

    currentCA: params.currentWeek.actualEndCA,
    currentAL: params.currentWeek.actualEndAF,
    currentRB: params.currentWeek.actualEndRB,

    plannedNextWeekImpulse: params.nextWeek.totalImpulse,
    plannedNextWeekCA: params.nextWeek.ca,
    plannedNextWeekRB: params.nextWeek.rb,

    weekFinalScore: params.weekFinalScore,
    weekClassification: params.weekClassification,
    actualWeekImpulse: params.currentWeek.actualTotalImpulse,
    plannedWeekImpulse: params.currentWeek.plannedTotalImpulse,

    rbMin: params.rbMin,
    tauChronic: params.tauChronic,
    tauAcute: params.tauAcute,

    microcycleWeek: params.currentWeek.weekNumber % 4 + 1,
    daysToNextAEvent: params.daysToNextAEvent,
    daysToNextBEvent: params.daysToNextBEvent,
    isNextWeekRecovery: nextMicrocycleWeek === 4,

    avgPerceivedEffort: params.avgPerceivedEffort,
    avgFatigueLevel: params.avgFatigueLevel,
    avgSleepQuality: params.avgSleepQuality,
    injuryConcerns: params.injuryConcerns,

    recentScores: params.recentScores,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// SESSION-LEVEL MICROCYCLE ADAPTATION ENGINE
// Operates on individual planned sessions within a microcycle.
// Outputs concrete per-session modifications + structured summary.
// ═════════════════════════════════════════════════════════════════════════════

// ─── Fatigue State Classification ─────────────────────────────────────────────

export type FatigueState = 'fresh' | 'optimal' | 'fatigued' | 'overreached';

export interface FatigueClassification {
  ratio: number;
  state: FatigueState;
  label: string;
  description: string;
  color: string;
}

export function classifyFatigueState(fitness: number, fatigue: number): FatigueClassification {
  const ratio = fitness > 0 ? fatigue / fitness : 0;

  if (ratio < 0.8) {
    return {
      ratio,
      state: 'fresh',
      label: 'Fresh',
      description: 'Fatigue is well below fitness. Athlete is ready for quality work and progression.',
      color: 'text-cyan-700',
    };
  }
  if (ratio <= 1.2) {
    return {
      ratio,
      state: 'optimal',
      label: 'Optimal',
      description: 'Balanced fatigue-to-fitness ratio. Ideal state for structured training.',
      color: 'text-emerald-700',
    };
  }
  if (ratio <= 1.5) {
    return {
      ratio,
      state: 'fatigued',
      label: 'Fatigued',
      description: 'Fatigue is accumulating above fitness. Reduce intensity and prioritize recovery.',
      color: 'text-amber-700',
    };
  }
  return {
    ratio,
    state: 'overreached',
    label: 'Overreached',
    description: 'Critical fatigue accumulation. Mandatory load reduction to prevent overtraining.',
    color: 'text-red-700',
  };
}

// ─── Session Snapshot ─────────────────────────────────────────────────────────

export interface RecentSession {
  sessionId: string;
  date: string;
  sport: Sport;
  finalScore: number;
  classification: 'green' | 'yellow' | 'red';
  impulseActual: number;
  impulsePlanned: number;
  actualDurationMinutes: number;
  plannedDurationMinutes: number | null;
  deviations: Array<{
    field: string;
    pct: number;
    direction: 'over' | 'under' | 'on_target';
  }>;
}

// ─── Planned Session to Adjust ────────────────────────────────────────────────

export interface PlannedSessionInput {
  sessionId: string;
  date: string;
  sport: Sport;
  name: string;
  plannedDurationMinutes: number;
  plannedImpulse: number;
  hasHighIntensity: boolean;
  plannedAvgIntensityPctFtp?: number | null;
  hasIntervals: boolean;
  intervalComplexity: 'low' | 'medium' | 'high';
}

// ─── Session Adjustment Output ────────────────────────────────────────────────

export type SessionAdjustmentType =
  | 'reduce_duration'
  | 'reduce_intensity'
  | 'remove_intervals'
  | 'simplify_intervals'
  | 'increase_duration'
  | 'add_intensity'
  | 'convert_to_recovery'
  | 'keep_as_planned';

export interface SessionAdjustment {
  sessionId: string;
  date: string;
  sport: Sport;
  sessionName: string;
  adjustmentType: SessionAdjustmentType;
  adjustmentLabel: string;

  originalDurationMinutes: number;
  proposedDurationMinutes: number;
  originalImpulse: number;
  proposedImpulse: number;
  originalIntensityPctFtp: number | null;
  proposedIntensityPctFtp: number | null;

  keepHighIntensity: boolean;
  simplifyIntervals: boolean;

  rationale: string;
  priority: 'mandatory' | 'recommended' | 'optional';
}

// ─── Full Microcycle Adaptation Output ────────────────────────────────────────

export type MicrocycleAdaptationFocus =
  | 'recovery'
  | 'aerobic_base'
  | 'threshold'
  | 'vo2max'
  | 'maintain'
  | 'progressive_overload';

export interface MicrocycleAdaptationResult {
  athleteId: string;
  weekNumber: number;
  weekStartDate: string;
  generatedAt: string;

  fatigueClassification: FatigueClassification;
  avgScore: number;
  avgScoreSessions: number;

  deviationSummary: {
    durationOverFreq: number;
    durationUnderFreq: number;
    intensityOverFreq: number;
    intensityUnderFreq: number;
    loadOverFreq: number;
    loadUnderFreq: number;
    dominantDeviation: string | null;
  };

  microcycle_adjustments: SessionAdjustment[];

  impulse_adjustment: string;
  focus: MicrocycleAdaptationFocus;
  reason: string;

  totalOriginalImpulse: number;
  totalProposedImpulse: number;
  impulseChangePct: number;
}

// ─── Score Aggregation ────────────────────────────────────────────────────────

function computeAvgScore(sessions: RecentSession[]): number {
  const scored = sessions.filter(s => s.finalScore > 0);
  if (scored.length === 0) return 75;
  return Math.round(scored.reduce((s, r) => s + r.finalScore, 0) / scored.length);
}

// ─── Deviation Frequency ──────────────────────────────────────────────────────

function aggregateDeviations(sessions: RecentSession[]) {
  let durationOver = 0, durationUnder = 0;
  let intensityOver = 0, intensityUnder = 0;
  let loadOver = 0, loadUnder = 0;
  const n = sessions.length;

  for (const s of sessions) {
    for (const d of s.deviations) {
      if (d.field === 'duration') {
        if (d.direction === 'over') durationOver++;
        if (d.direction === 'under') durationUnder++;
      } else if (d.field === 'intensity') {
        if (d.direction === 'over') intensityOver++;
        if (d.direction === 'under') intensityUnder++;
      } else if (d.field === 'load') {
        if (d.direction === 'over') loadOver++;
        if (d.direction === 'under') loadUnder++;
      }
    }
  }

  const normalize = (v: number) => n > 0 ? Math.round((v / n) * 100) / 100 : 0;

  const candidates: [string, number][] = [
    ['duration over-run', normalize(durationOver)],
    ['duration under-run', normalize(durationUnder)],
    ['intensity too high', normalize(intensityOver)],
    ['intensity too low', normalize(intensityUnder)],
    ['load excess', normalize(loadOver)],
    ['load shortfall', normalize(loadUnder)],
  ].filter(([, v]) => (v as number) >= 0.4) as [string, number][];

  candidates.sort((a, b) => b[1] - a[1]);

  return {
    durationOverFreq: normalize(durationOver),
    durationUnderFreq: normalize(durationUnder),
    intensityOverFreq: normalize(intensityOver),
    intensityUnderFreq: normalize(intensityUnder),
    loadOverFreq: normalize(loadOver),
    loadUnderFreq: normalize(loadUnder),
    dominantDeviation: candidates.length > 0 ? candidates[0][0] : null,
  };
}

// ─── Session-Level Adjustment Logic ──────────────────────────────────────────

const INTENSITY_REMOVE_THRESHOLD_FATIGUED = 0.90;
const INTENSITY_REMOVE_THRESHOLD_OVERREACHED = 0.85;
const DURATION_REDUCTION_FATIGUED = 0.85;
const DURATION_REDUCTION_OVERREACHED = 0.70;
const DURATION_SIMPLIFY = 0.90;
const DURATION_INCREASE = 1.08;
const INTENSITY_REDUCTION = 0.88;
const INTENSITY_INCREASE = 1.05;

function adjustSession(
  session: PlannedSessionInput,
  state: FatigueState,
  avgScore: number,
  redSessionCount: number
): SessionAdjustment {
  let adjustmentType: SessionAdjustmentType = 'keep_as_planned';
  let adjustmentLabel = 'Keep As Planned';
  let proposedDuration = session.plannedDurationMinutes;
  let proposedIntensity = session.plannedAvgIntensityPctFtp ?? null;
  let keepHighIntensity = true;
  let simplifyIntervals = false;
  let rationale = 'No changes required.';
  let priority: SessionAdjustment['priority'] = 'optional';

  const isMandatory = state === 'overreached' || (state === 'fatigued' && redSessionCount >= 2);
  const isHighIntensitySession = session.hasHighIntensity ||
    (session.plannedAvgIntensityPctFtp !== null && session.plannedAvgIntensityPctFtp !== undefined && session.plannedAvgIntensityPctFtp > 85);

  // ── Overreached: mandatory full recovery conversion for hard sessions ──
  if (state === 'overreached' && isHighIntensitySession) {
    adjustmentType = 'convert_to_recovery';
    adjustmentLabel = 'Convert to Recovery';
    proposedDuration = Math.round(session.plannedDurationMinutes * DURATION_REDUCTION_OVERREACHED);
    proposedIntensity = proposedIntensity !== null ? Math.round(proposedIntensity * INTENSITY_REDUCTION) : null;
    keepHighIntensity = false;
    simplifyIntervals = true;
    rationale = `Fatigue ratio is critically high (overreached state). Hard session converted to aerobic recovery to prevent overtraining injury.`;
    priority = 'mandatory';
  }

  // ── Overreached: reduce all sessions ──
  else if (state === 'overreached') {
    adjustmentType = 'reduce_duration';
    adjustmentLabel = 'Reduce Duration';
    proposedDuration = Math.round(session.plannedDurationMinutes * DURATION_REDUCTION_OVERREACHED);
    keepHighIntensity = false;
    rationale = `Overreached state requires reducing all training volume by 30%.`;
    priority = 'mandatory';
  }

  // ── Fatigued + multiple red sessions: remove high intensity ──
  else if (state === 'fatigued' && redSessionCount >= 2 && isHighIntensitySession) {
    adjustmentType = 'remove_intervals';
    adjustmentLabel = 'Remove High Intensity';
    proposedDuration = Math.round(session.plannedDurationMinutes * DURATION_REDUCTION_FATIGUED);
    proposedIntensity = proposedIntensity !== null ? Math.round(proposedIntensity * INTENSITY_REDUCTION) : null;
    keepHighIntensity = false;
    simplifyIntervals = true;
    rationale = `Multiple red sessions detected while fatigued. Removing high-intensity work to allow recovery stimulus to take effect.`;
    priority = 'mandatory';
  }

  // ── Fatigued: reduce duration ──
  else if (state === 'fatigued') {
    adjustmentType = 'reduce_duration';
    adjustmentLabel = 'Reduce Duration';
    proposedDuration = Math.round(session.plannedDurationMinutes * DURATION_REDUCTION_FATIGUED);
    rationale = `Fatigued state — reducing duration by 15% to manage cumulative load while maintaining training stimulus.`;
    priority = 'recommended';
  }

  // ── Low avg_score (0.60–0.85): simplify workouts ──
  else if (avgScore >= 60 && avgScore < 85) {
    if (session.hasIntervals && session.intervalComplexity === 'high') {
      adjustmentType = 'simplify_intervals';
      adjustmentLabel = 'Simplify Intervals';
      proposedDuration = Math.round(session.plannedDurationMinutes * DURATION_SIMPLIFY);
      simplifyIntervals = true;
      rationale = `Average session score ${avgScore}/100 indicates difficulty executing planned workouts. Simplifying interval structure to improve completion quality.`;
      priority = 'recommended';
    } else if (session.hasIntervals) {
      adjustmentType = 'reduce_intensity';
      adjustmentLabel = 'Reduce Intensity';
      proposedIntensity = proposedIntensity !== null ? Math.round(proposedIntensity * INTENSITY_REDUCTION) : null;
      rationale = `Average session score ${avgScore}/100. Reducing target intensity to improve execution quality and adaptation specificity.`;
      priority = 'recommended';
    }
  }

  // ── High avg_score (>0.85) + fresh state: progressive increase ──
  else if (avgScore >= 85 && (state === 'fresh' || state === 'optimal')) {
    if (isHighIntensitySession && session.intervalComplexity !== 'high') {
      adjustmentType = 'add_intensity';
      adjustmentLabel = 'Add Intensity';
      proposedIntensity = proposedIntensity !== null
        ? Math.min(Math.round(proposedIntensity * INTENSITY_INCREASE), 105)
        : null;
      rationale = `Excellent execution (${avgScore}/100) with low fatigue. Incrementally adding intensity to continue progressive adaptation.`;
      priority = 'recommended';
    } else {
      adjustmentType = 'increase_duration';
      adjustmentLabel = 'Increase Duration';
      proposedDuration = Math.round(session.plannedDurationMinutes * DURATION_INCREASE);
      rationale = `Excellent execution (${avgScore}/100) with low fatigue. Incrementally increasing volume to capitalize on supercompensation.`;
      priority = 'optional';
    }
  }

  // Safety clamp: never increase duration more than 10%
  proposedDuration = Math.min(proposedDuration, Math.round(session.plannedDurationMinutes * 1.10));
  // Safety clamp: never increase intensity above 105% FTP
  if (proposedIntensity !== null) {
    proposedIntensity = Math.min(proposedIntensity, 105);
  }

  // Recompute proposed impulse proportional to changes
  const durationRatio = proposedDuration / session.plannedDurationMinutes;
  const intensityRatio = (proposedIntensity !== null && session.plannedAvgIntensityPctFtp && session.plannedAvgIntensityPctFtp > 0)
    ? proposedIntensity / session.plannedAvgIntensityPctFtp
    : 1.0;
  const proposedImpulse = Math.round(session.plannedImpulse * durationRatio * intensityRatio * 1000) / 1000;

  return {
    sessionId: session.sessionId,
    date: session.date,
    sport: session.sport,
    sessionName: session.name,
    adjustmentType,
    adjustmentLabel,
    originalDurationMinutes: session.plannedDurationMinutes,
    proposedDurationMinutes: proposedDuration,
    originalImpulse: session.plannedImpulse,
    proposedImpulse,
    originalIntensityPctFtp: session.plannedAvgIntensityPctFtp ?? null,
    proposedIntensityPctFtp: proposedIntensity,
    keepHighIntensity,
    simplifyIntervals,
    rationale,
    priority: isMandatory ? 'mandatory' : priority,
  };
}

// ─── Focus Selector ───────────────────────────────────────────────────────────

function selectFocus(
  state: FatigueState,
  avgScore: number,
  deviations: ReturnType<typeof aggregateDeviations>
): MicrocycleAdaptationFocus {
  if (state === 'overreached') return 'recovery';
  if (state === 'fatigued') return 'aerobic_base';
  if (avgScore >= 85 && state === 'fresh') return 'progressive_overload';
  if (avgScore >= 85 && state === 'optimal') return 'threshold';
  if (avgScore < 60) return 'aerobic_base';
  if (deviations.intensityOverFreq >= 0.5) return 'aerobic_base';
  return 'maintain';
}

// ─── Impulse Adjustment String ────────────────────────────────────────────────

function describeImpulseAdjustment(
  originalTotal: number,
  proposedTotal: number,
  state: FatigueState
): string {
  const pct = originalTotal > 0
    ? Math.round(((proposedTotal - originalTotal) / originalTotal) * 100)
    : 0;

  if (pct === 0) return 'No change to weekly impulse.';
  const dir = pct > 0 ? 'increase' : 'reduction';
  const abs = Math.abs(pct);

  if (state === 'overreached') {
    return `Mandatory ${abs}% ${dir} in weekly impulse (overreached state — safety override).`;
  }
  if (state === 'fatigued') {
    return `${abs}% ${dir} in weekly impulse to manage fatigue accumulation.`;
  }
  if (pct > 0) {
    return `Progressive ${abs}% ${dir} in weekly impulse — athlete is responding well.`;
  }
  return `${abs}% ${dir} in weekly impulse to improve execution quality.`;
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export interface ComputeMicrocycleAdaptationParams {
  athleteId: string;
  weekNumber: number;
  weekStartDate: string;
  fitness: number;
  fatigue: number;
  recentSessions: RecentSession[];
  plannedSessions: PlannedSessionInput[];
}

export function computeMicrocycleAdaptation(
  params: ComputeMicrocycleAdaptationParams
): MicrocycleAdaptationResult {
  const { athleteId, weekNumber, weekStartDate, fitness, fatigue, recentSessions, plannedSessions } = params;

  const fatigueClassification = classifyFatigueState(fitness, fatigue);
  const { state } = fatigueClassification;

  const lookbackSessions = recentSessions.slice(0, 5);
  const avgScore = computeAvgScore(lookbackSessions);
  const deviationSummary = aggregateDeviations(lookbackSessions);

  const redSessionCount = lookbackSessions.filter(s => s.classification === 'red').length;

  const microcycle_adjustments = plannedSessions.map(session =>
    adjustSession(session, state, avgScore, redSessionCount)
  );

  const totalOriginalImpulse = Math.round(
    microcycle_adjustments.reduce((s, a) => s + a.originalImpulse, 0) * 1000
  ) / 1000;

  const totalProposedImpulse = Math.round(
    microcycle_adjustments.reduce((s, a) => s + a.proposedImpulse, 0) * 1000
  ) / 1000;

  const impulseChangePct = totalOriginalImpulse > 0
    ? Math.round(((totalProposedImpulse - totalOriginalImpulse) / totalOriginalImpulse) * 100)
    : 0;

  const focus = selectFocus(state, avgScore, deviationSummary);

  const reasonParts: string[] = [];
  reasonParts.push(`Athlete is in a ${fatigueClassification.label.toLowerCase()} state (fatigue/fitness ratio: ${fatigueClassification.ratio.toFixed(2)}).`);
  if (lookbackSessions.length > 0) {
    reasonParts.push(`Average execution score across last ${lookbackSessions.length} sessions: ${avgScore}/100.`);
  }
  if (deviationSummary.dominantDeviation) {
    reasonParts.push(`Most frequent deviation pattern: ${deviationSummary.dominantDeviation}.`);
  }

  return {
    athleteId,
    weekNumber,
    weekStartDate,
    generatedAt: new Date().toISOString(),

    fatigueClassification,
    avgScore,
    avgScoreSessions: lookbackSessions.length,

    deviationSummary,

    microcycle_adjustments,

    impulse_adjustment: describeImpulseAdjustment(totalOriginalImpulse, totalProposedImpulse, state),
    focus,
    reason: reasonParts.join(' '),

    totalOriginalImpulse,
    totalProposedImpulse,
    impulseChangePct,
  };
}
