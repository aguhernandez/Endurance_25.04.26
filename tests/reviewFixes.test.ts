import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { analyzeWorkout } from '../src/lib/workoutAnalysisEngine';
import { computeWeeklySummaries } from '../src/lib/weeklySummary';
import { buildPlannerAlerts } from '../src/lib/smartPlanner';

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('review regressions', () => {
  it('does not score or update state for an activity with unknown Impulse', () => {
    expect(() => analyzeWorkout({ athleteId: 'a', workoutId: null, sport: 'cycling', plannedDurationMinutes: 60, actualDurationMinutes: 60, plannedImpulse: 100, currentFitness: 30, currentFatigue: 40 })).toThrow(/Insufficient data/);
  });
  it('does not advance weekly actual load for an unsupported activity', () => {
    const day = { date: '2026-01-01', dayOfWeek: 4, ca: 30, al: 40, rb: -10, impulse: 50 };
    const week = { weekNumber: 0, weekStartDate: day.date, weekEndDate: day.date, days: [day] };
    expect(() => computeWeeklySummaries([week as any], [{ session_date: day.date, sport: 'cycling', duration_minutes: 60 }], [], null, null, day.date)).toThrow(/Insufficient data/);
  });
  it('warns about a session outside available duration or day', () => {
    const alerts = buildPlannerAlerts({ events: [], availability: [{ day_of_week: 1, available_minutes: 30 }], biological_passport_available: true, fetched_at: '' }, { weeks: [{ week_start_date: '2026-01-05', sessions: [{ day_of_week: 1, estimated_duration_minutes: 60, estimated_impulse: 10 }] }] });
    expect(alerts.warnings.join(' ')).toContain('2026-01-05');
  });
  it('uses physiology and refuses incomplete adaptation histories', () => {
    const hook = source('src/hooks/useMicrocycleAdaptation.ts');
    expect(hook).toContain('ftp: ftpRes.data?.current_ftp_watts');
    expect(hook).toContain('avgPacePerKm: s.avg_pace_per_km');
    expect(hook).toContain('Insufficient data to reconstruct training load');
  });
  it('does not label missing load as zero or multiply impulse by 100 as intensity', () => {
    const preview = source('src/components/WorkoutPreview.tsx');
    expect(preview).toContain('sessionImpulseResult.impulse;');
    expect(preview).toContain('Math.sqrt(sessionImpulse / (durationHours * 100))');
    expect(preview).toContain('banister.sessionImpulse?.toFixed(2) ??');
  });
  it('includes availability details in generation', () => {
    const fn = source('supabase/functions/generate-ai-block/index.ts');
    expect(fn).toContain('JSON.stringify(planner_context?.availability ?? [])');
    expect(fn).toContain('JSON.stringify(planner_context?.events ?? [])');
  });
  it('publishes in a locked database transaction from stored weeks only', () => {
    const sql = source('supabase/migrations/20261105180000_atomic_ai_block_publication.sql');
    const fn = source('supabase/functions/generate-ai-block/index.ts');
    expect(sql).toContain('FOR UPDATE');
    expect(sql).toContain("b.status = 'applied'");
    expect(sql).toContain('jsonb_array_elements(b.weeks::jsonb)');
    expect(sql).toContain('INSERT INTO public.workout_steps');
    expect(sql).toContain("status = 'applied'");
    expect(sql).toContain('FROM PUBLIC, anon, authenticated');
    expect(fn).toContain('supabase.rpc("publish_ai_block"');
    expect(fn).not.toContain('Array.isArray((body as any).weeks)');
  });
});
