import { describe, expect, it } from 'vitest';
import {
  aggregateDailyImpulse,
  calculateDifficulty,
  calculateImpulse,
  calculatePlannedSteps,
  reconstructLoadState,
} from '../src/lib/impulseEngine';

describe('Impulse Engine v1', () => {
  it('returns 100 for 60 minutes at constant FTP', () => {
    const result = calculateImpulse({ sport: 'cycling', durationMinutes: 60, normalizedPowerWatts: 250, ftp: 250 });
    expect(result.impulse).toBe(100);
    expect(result.status).toBe('calculated');
    expect(result.method).toBe('cycling_np_if_ftp');
  });

  it('uses average power as an explicitly estimated cycling method', () => {
    const result = calculateImpulse({ sport: 'cycling', durationMinutes: 60, avgPowerWatts: 250, ftp: 250 });
    expect(result.impulse).toBe(100);
    expect(result.status).toBe('estimated');
    expect(result.method).toBe('cycling_avg_power_ftp');
  });

  it('uses adjusted running pace distinctly from average pace', () => {
    const adjusted = calculateImpulse({ sport: 'running', durationMinutes: 60, adjustedPacePerKm: 300, avgPacePerKm: 330, thresholdPacePerKm: 300 });
    const average = calculateImpulse({ sport: 'running', durationMinutes: 60, avgPacePerKm: 330, thresholdPacePerKm: 300 });
    expect(adjusted.method).toBe('running_adjusted_pace_threshold');
    expect(average.method).toBe('running_average_pace_threshold');
    expect(adjusted.impulse).not.toBe(average.impulse);
    expect(average.reason).toContain('grade-adjusted');
  });

  it('uses IF cubed for swimming', () => {
    const result = calculateImpulse({ sport: 'swimming', durationMinutes: 60, avgPacePerKm: 400, thresholdPacePerKm: 500 });
    expect(result.impulse).toBeCloseTo(195.31, 2);
    expect(result.method).toBe('swimming_threshold_pace_if3');
  });

  it('does not fabricate HR or RPE load', () => {
    const result = calculateImpulse({ sport: 'cycling', durationMinutes: 60 });
    expect(result.impulse).toBeNull();
    expect(result.status).toBe('insufficient');
  });

  it('marks structured steps as estimates and does not claim NP equivalence', () => {
    const result = calculatePlannedSteps({
      sport: 'cycling',
      ftp: 250,
      steps: [{ id: '1', workout_id: 'w', order: 1, step_type: 'steady', duration_type: 'time', duration_value: 3600, target_percent_ftp: 100, created_at: '' }],
    });
    expect(result.impulse).toBe(100);
    expect(result.status).toBe('estimated');
    expect(result.reason).toContain('not an exact equivalent');
  });

  it('returns insufficient for unsupported structured steps', () => {
    const result = calculatePlannedSteps({
      sport: 'cycling',
      steps: [{ id: '1', workout_id: 'w', order: 1, step_type: 'steady', duration_type: 'time', duration_value: 3600, target_type: 'rpe', created_at: '' }],
    });
    expect(result.impulse).toBeNull();
    expect(result.status).toBe('insufficient');
  });

  it('does not convert an unqualified zone into an arbitrary intensity', () => {
    const result = calculatePlannedSteps({
      sport: 'cycling',
      ftp: 250,
      zoneSystem: '5',
      steps: [{ id: '1', workout_id: 'w', order: 1, step_type: 'steady', duration_type: 'time', duration_value: 1800, target_zone: 3, created_at: '' }],
    });
    expect(result.impulse).toBeNull();
    expect(result.status).toBe('insufficient');
  });

  it('aggregates daily load without mutating the source', () => {
    const input = [{ date: '2026-01-02', impulse: 40 }, { date: '2026-01-01', impulse: 10 }, { date: '2026-01-02', impulse: 5 }];
    expect(aggregateDailyImpulse(input)).toEqual([{ date: '2026-01-01', impulse: 10 }, { date: '2026-01-02', impulse: 45 }]);
    expect(input[0].impulse).toBe(40);
  });

  it('reconstructs CA/AL with zero-load rest days and exposes bootstrap state', () => {
    const state = reconstructLoadState([{ date: '2026-01-01', impulse: 100 }], '2026-01-02');
    expect(state.ca).toBeGreaterThan(0);
    expect(state.al).toBeGreaterThan(0);
    expect(state.status).toBe('bootstrap');
    expect(state.daysProcessed).toBe(2);
  });

  it('does not classify difficulty when CA is near zero or state is bootstrap', () => {
    const state = reconstructLoadState([{ date: '2026-01-01', impulse: 0 }], '2026-01-01');
    expect(calculateDifficulty(50, state).difficulty).toBeNull();
  });
});
