import { DaySimResult, WeekSimResult } from './banisterEngine';
import { calculateSessionImpulse, SessionImpulseInput, DailyImpulseEntry } from './sessionDifficulty';
import { Sport } from '../types/workout';

export interface CompletedSession {
  session_date: string;
  sport: Sport;
  duration_minutes: number;
  avg_power_watts?: number | null;
  avg_pace_per_km?: number | null;
  perceived_effort?: number | null;
}

export interface PlannedWorkout {
  scheduled_date: string;
  sport: string;
  estimated_duration_minutes: number;
}

export interface WeeklySummaryData {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;

  // Planned metrics (from ATP)
  plannedTotalImpulse: number;
  plannedAvgCA: number;
  plannedAvgAF: number;
  plannedAvgRB: number;
  plannedEndCA: number;
  plannedEndAF: number;
  plannedEndRB: number;

  // Actual metrics (from completed sessions)
  actualTotalImpulse: number;
  actualAvgCA: number;
  actualAvgAF: number;
  actualAvgRB: number;
  actualEndCA: number;
  actualEndAF: number;
  actualEndRB: number;

  // Combined metrics (completed + planned remaining)
  projectedTotalImpulse: number;
  projectedEndCA: number;
  projectedEndAF: number;
  projectedEndRB: number;

  // Daily details
  days: DayDetail[];

  // Completion status
  completedDays: number;
  totalDays: number;
  isCurrentWeek: boolean;
}

export interface DayDetail {
  date: string;
  dayOfWeek: number;

  // Planned (from ATP)
  plannedImpulse: number;
  plannedCA: number;
  plannedAF: number;
  plannedRB: number;

  // Actual (from completed sessions)
  actualImpulse: number;
  actualCA: number | null;
  actualAF: number | null;
  actualRB: number | null;

  // Status
  isCompleted: boolean;
  hasPlannedWorkout: boolean;

  // Events
  isEventDay: boolean;
  eventName?: string;
  eventPriority?: 'A' | 'B' | 'C';
}

export interface PhysiologyData {
  ftp?: number | null;
  run_pace_z4_min?: number | null;
  run_pace_z4_max?: number | null;
  swim_css_per_100m?: number | null;
  swim_pace_z4_min?: number | null;
  swim_pace_z4_max?: number | null;
}

function getThresholdPace(sport: Sport, physiology: PhysiologyData | null): number | null {
  if (!physiology) return null;
  if (sport === 'running') {
    if (physiology.run_pace_z4_min && physiology.run_pace_z4_max) {
      return (physiology.run_pace_z4_min + physiology.run_pace_z4_max) / 2;
    }
    return physiology.run_pace_z4_min ?? null;
  }
  if (sport === 'swimming') {
    if (physiology.swim_css_per_100m) {
      return physiology.swim_css_per_100m * 10;
    }
    if (physiology.swim_pace_z4_min && physiology.swim_pace_z4_max) {
      return (physiology.swim_pace_z4_min + physiology.swim_pace_z4_max) / 2;
    }
  }
  return null;
}

function simulateForward(
  ca: number,
  af: number,
  impulse: number,
  tauChronic: number = 28,
  tauAcute: number = 7
): { ca: number; af: number; rb: number } {
  const newCA = ca + (impulse - ca) / tauChronic;
  const newAF = af + (impulse - af) / tauAcute;
  const newRB = newCA - newAF;
  return { ca: newCA, af: newAF, rb: newRB };
}

export function computeWeeklySummaries(
  atpWeeks: WeekSimResult[],
  completedSessions: CompletedSession[],
  plannedWorkouts: PlannedWorkout[],
  ftp: number | null,
  physiology: PhysiologyData | null,
  currentDateStr: string
): WeeklySummaryData[] {
  const currentDate = new Date(currentDateStr + 'T00:00:00');

  // Build completed sessions map
  const completedMap = new Map<string, CompletedSession[]>();
  for (const session of completedSessions) {
    const existing = completedMap.get(session.session_date) || [];
    existing.push(session);
    completedMap.set(session.session_date, existing);
  }

  // Build planned workouts map
  const plannedMap = new Map<string, PlannedWorkout[]>();
  for (const workout of plannedWorkouts) {
    const existing = plannedMap.get(workout.scheduled_date) || [];
    existing.push(workout);
    plannedMap.set(workout.scheduled_date, existing);
  }

  // Reconstruct actual CA/AF from completed sessions
  const tauChronic = 28;
  const tauAcute = 7;

  let actualCA = 0;
  let actualAF = 0;

  // Initialize with first week's starting values
  if (atpWeeks.length > 0 && atpWeeks[0].days.length > 0) {
    actualCA = atpWeeks[0].days[0].ca;
    actualAF = atpWeeks[0].days[0].al;
  }

  const result: WeeklySummaryData[] = [];

  for (const week of atpWeeks) {
    const weekStart = new Date(week.weekStartDate + 'T00:00:00');
    const weekEnd = new Date(week.weekEndDate + 'T00:00:00');
    const isCurrentWeek = currentDate >= weekStart && currentDate <= weekEnd;

    const days: DayDetail[] = [];
    let completedDaysCount = 0;
    let actualWeekImpulse = 0;
    let weekActualCASum = 0;
    let weekActualAFSum = 0;
    let weekActualRBSum = 0;
    let actualDaysWithData = 0;

    let weekStartCA = actualCA;
    let weekStartAF = actualAF;

    for (const atpDay of week.days) {
      const dayDate = new Date(atpDay.date + 'T00:00:00');
      const isPast = dayDate < currentDate;
      const isToday = atpDay.date === currentDateStr;

      const completed = completedMap.get(atpDay.date) || [];
      const planned = plannedMap.get(atpDay.date) || [];

      const isCompleted = completed.length > 0;
      const hasPlannedWorkout = planned.length > 0;

      if (isCompleted) completedDaysCount++;

      // Calculate actual impulse for this day
      let dayActualImpulse = 0;
      if (isCompleted) {
        for (const session of completed) {
          const input: SessionImpulseInput = {
            durationMinutes: session.duration_minutes,
            sport: session.sport,
            avgPowerWatts: session.avg_power_watts,
            ftp,
            avgPacePerKm: session.avg_pace_per_km,
            thresholdPacePerKm: getThresholdPace(session.sport, physiology),
            perceivedEffort: session.perceived_effort,
          };
          dayActualImpulse += calculateSessionImpulse(input);
        }
      }

      actualWeekImpulse += dayActualImpulse;

      // Simulate actual CA/AF forward
      const sim = simulateForward(actualCA, actualAF, dayActualImpulse, tauChronic, tauAcute);
      actualCA = sim.ca;
      actualAF = sim.af;

      if (isCompleted || (isPast && !isCompleted)) {
        weekActualCASum += actualCA;
        weekActualAFSum += actualAF;
        weekActualRBSum += sim.rb;
        actualDaysWithData++;
      }

      days.push({
        date: atpDay.date,
        dayOfWeek: atpDay.dayOfWeek,

        plannedImpulse: atpDay.impulse,
        plannedCA: atpDay.ca,
        plannedAF: atpDay.al,
        plannedRB: atpDay.rb,

        actualImpulse: dayActualImpulse,
        actualCA: isCompleted || isPast ? actualCA : null,
        actualAF: isCompleted || isPast ? actualAF : null,
        actualRB: isCompleted || isPast ? sim.rb : null,

        isCompleted,
        hasPlannedWorkout,

        isEventDay: atpDay.isEventDay,
        eventName: atpDay.eventName,
        eventPriority: atpDay.eventPriority,
      });
    }

    // Planned metrics
    const plannedAvgCA = week.days.reduce((sum, d) => sum + d.ca, 0) / week.days.length;
    const plannedAvgAF = week.days.reduce((sum, d) => sum + d.al, 0) / week.days.length;
    const plannedAvgRB = week.days.reduce((sum, d) => sum + d.rb, 0) / week.days.length;

    // Actual metrics
    const actualAvgCA = actualDaysWithData > 0 ? weekActualCASum / actualDaysWithData : 0;
    const actualAvgAF = actualDaysWithData > 0 ? weekActualAFSum / actualDaysWithData : 0;
    const actualAvgRB = actualDaysWithData > 0 ? weekActualRBSum / actualDaysWithData : 0;

    const weekEndCA = actualCA;
    const weekEndAF = actualAF;
    const weekEndRB = weekEndCA - weekEndAF;

    // Projected: simulate remaining days with planned impulses
    let projCA = actualCA;
    let projAF = actualAF;
    let projectedWeekImpulse = actualWeekImpulse;

    for (const day of days) {
      const dayDate = new Date(day.date + 'T00:00:00');
      const isFuture = dayDate > currentDate;

      if (isFuture && !day.isCompleted) {
        projectedWeekImpulse += day.plannedImpulse;
        const sim = simulateForward(projCA, projAF, day.plannedImpulse, tauChronic, tauAcute);
        projCA = sim.ca;
        projAF = sim.af;
      }
    }

    const projRB = projCA - projAF;

    result.push({
      weekNumber: week.weekNumber,
      weekStartDate: week.weekStartDate,
      weekEndDate: week.weekEndDate,

      plannedTotalImpulse: week.totalImpulse,
      plannedAvgCA,
      plannedAvgAF,
      plannedAvgRB,
      plannedEndCA: week.ca,
      plannedEndAF: week.al,
      plannedEndRB: week.rb,

      actualTotalImpulse: actualWeekImpulse,
      actualAvgCA,
      actualAvgAF,
      actualAvgRB,
      actualEndCA: weekEndCA,
      actualEndAF: weekEndAF,
      actualEndRB: weekEndRB,

      projectedTotalImpulse: projectedWeekImpulse,
      projectedEndCA: projCA,
      projectedEndAF: projAF,
      projectedEndRB: projRB,

      days,

      completedDays: completedDaysCount,
      totalDays: week.days.length,
      isCurrentWeek,
    });
  }

  return result;
}

export function getRBStatus(rb: number): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  if (rb > 10) {
    return {
      label: 'Very Fresh',
      color: 'text-cyan-700 dark:text-cyan-300',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      border: 'border-cyan-300 dark:border-cyan-700',
    };
  }
  if (rb >= 0 && rb <= 10) {
    return {
      label: 'Competition Ready',
      color: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-300 dark:border-emerald-700',
    };
  }
  if (rb >= -10 && rb < 0) {
    return {
      label: 'Normal Load',
      color: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-300 dark:border-amber-700',
    };
  }
  return {
    label: 'High Fatigue',
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-300 dark:border-red-700',
  };
}
