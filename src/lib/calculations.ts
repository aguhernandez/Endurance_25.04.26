import { TrainingSession } from '../lib/supabase';
import { Workout, DailyLoad, Sport } from '../types/workout';

export function calculateRelativeIntensity(avgPower: number | null, ftp: number | null): number | null {
  if (!avgPower || !ftp || ftp === 0) return null;
  return (avgPower / ftp) * 100;
}

export function calculateSessionLoad(durationMinutes: number, avgPower: number | null, ftp: number | null): number | null {
  if (!avgPower || !ftp || ftp === 0) return null;
  return Math.round(durationMinutes * (avgPower / ftp));
}

export function getPowerZone(avgPower: number | null, ftp: number | null): number | null {
  if (!avgPower || !ftp || ftp === 0) return null;
  const percentage = (avgPower / ftp) * 100;
  if (percentage <= 55) return 1;
  if (percentage <= 75) return 2;
  if (percentage <= 90) return 3;
  if (percentage <= 105) return 4;
  return 5;
}

export function getZoneName(zone: number, sport: Sport = 'cycling'): string {
  if (sport === 'running' || sport === 'swimming') {
    const zones: Record<number, string> = {
      1: 'Z1 Recovery',
      2: 'Z2 Aerobic',
      3: 'Z3 Tempo',
      4: 'Z4 Threshold',
      5: 'Z5 Speed',
    };
    return zones[zone] || 'Unknown';
  }
  const zones: Record<number, string> = {
    1: 'Z1 Recovery',
    2: 'Z2 Endurance',
    3: 'Z3 Tempo',
    4: 'Z4 Threshold',
    5: 'Z5 VO2max',
  };
  return zones[zone] || 'Unknown';
}

export function getZoneColor(zone: number): string {
  const colors: Record<number, string> = {
    1: 'bg-gray-400',
    2: 'bg-blue-400',
    3: 'bg-green-400',
    4: 'bg-yellow-400',
    5: 'bg-red-400',
  };
  return colors[zone] || 'bg-gray-400';
}

export function formatPace(secondsPerKm: number | null): string {
  if (!secondsPerKm) return '-';
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

export function formatPacePer100m(secondsPerKm: number | null): string {
  if (!secondsPerKm) return '-';
  const per100 = secondsPerKm / 10;
  const minutes = Math.floor(per100 / 60);
  const seconds = Math.round(per100 % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/100m`;
}

export function getSportIcon(sport: Sport): string {
  switch (sport) {
    case 'cycling': return '🚴';
    case 'running': return '🏃';
    case 'swimming': return '🏊';
    default: return '🏋️';
  }
}

export function getSportLabel(sport: Sport): string {
  switch (sport) {
    case 'cycling': return 'Cycling';
    case 'running': return 'Running';
    case 'swimming': return 'Swimming';
    default: return sport;
  }
}

export function getDefaultIntensityBasis(sport: Sport): string {
  switch (sport) {
    case 'cycling': return 'power';
    case 'running': return 'pace';
    case 'swimming': return 'pace';
    default: return 'hr';
  }
}

export interface WeeklyStats {
  totalDuration: number;
  totalLoad: number;
  avgIntensity: number;
  sessionCount: number;
  cyclingCount: number;
  runningCount: number;
  swimmingCount: number;
}

export function calculateWeeklyStats(sessions: TrainingSession[], ftp: number | null): WeeklyStats {
  const completedSessions = sessions.filter(s => s.status === 'completed');

  const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration_minutes, 0);

  const cyclingSessions = completedSessions.filter(s => s.sport === 'cycling');
  const loadsAndIntensities = cyclingSessions
    .map(s => ({
      load: calculateSessionLoad(s.duration_minutes, s.avg_power_watts, ftp),
      intensity: calculateRelativeIntensity(s.avg_power_watts, ftp)
    }))
    .filter(x => x.load !== null && x.intensity !== null);

  const totalLoad = loadsAndIntensities.reduce((sum, x) => sum + (x.load || 0), 0);
  const avgIntensity = loadsAndIntensities.length > 0
    ? loadsAndIntensities.reduce((sum, x) => sum + (x.intensity || 0), 0) / loadsAndIntensities.length
    : 0;

  return {
    totalDuration,
    totalLoad,
    avgIntensity: Math.round(avgIntensity),
    sessionCount: completedSessions.length,
    cyclingCount: completedSessions.filter(s => s.sport === 'cycling').length,
    runningCount: completedSessions.filter(s => s.sport === 'running').length,
    swimmingCount: completedSessions.filter(s => s.sport === 'swimming').length,
  };
}

export function calculateWorkoutImpulse(
  durationMinutes: number,
  intensityPercentFtp: number
): number {
  if (durationMinutes <= 0 || intensityPercentFtp < 0) return 0;
  return Math.round(durationMinutes * (intensityPercentFtp / 100));
}

export function calculateEstimatedImpulse(workout: Workout): number | null {
  if (!workout.estimated_duration_minutes || !workout.estimated_impulse) {
    return null;
  }
  return workout.estimated_impulse;
}

export function calculateActualImpulse(workout: Workout): number | null {
  if (!workout.actual_duration_minutes || !workout.actual_avg_intensity_percent_ftp) {
    return workout.actual_impulse || null;
  }
  return calculateWorkoutImpulse(workout.actual_duration_minutes, workout.actual_avg_intensity_percent_ftp);
}

export interface TrainingMetrics {
  acuteLoad: number;
  chronicLoad: number;
  stressBalance: number;
  trainingRatio: number;
}

export function calculateTrainingMetrics(
  dailyLoads: DailyLoad[],
  daysBack: number = 42
): TrainingMetrics {
  const sortedLoads = dailyLoads.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const al = sortedLoads.slice(-7).reduce((sum, d) => sum + d.actual_impulse, 0);
  const ct = sortedLoads.slice(-14).reduce((sum, d) => sum + d.actual_impulse, 0);
  const sb = ct - al;
  const ratio = al > 0 ? ct / al : 0;

  return {
    acuteLoad: Math.round(al / 7),
    chronicLoad: Math.round(ct / 14),
    stressBalance: Math.round(sb),
    trainingRatio: Math.round(ratio * 100) / 100
  };
}
