import { describe, expect, it } from 'vitest';
import { buildPlannerAlerts, isPublishablePlannerBlock } from '../src/lib/smartPlanner';

const block = {
  weeks: [{ sessions: [{ estimated_impulse: 42, intensity_basis: 'power' }] }],
};

describe('Smart Planner proposal guardrails', () => {
  it('requires Hub context before publication', () => {
    const alerts = buildPlannerAlerts(undefined, block);
    expect(alerts.blocks).toContain('No se pudo verificar el contexto compartido de Hub. La propuesta no debe publicarse.');
    expect(isPublishablePlannerBlock('accepted', alerts)).toBe(false);
  });

  it('warns when physiology is missing but keeps the proposal reviewable', () => {
    const alerts = buildPlannerAlerts({ events: [], availability: [], biological_passport_available: false, fetched_at: 'now' }, block);
    expect(alerts.blocks).toHaveLength(0);
    expect(alerts.warnings.some(message => message.includes('Biological Passport'))).toBe(true);
    expect(isPublishablePlannerBlock('pending', alerts)).toBe(false);
  });

  it('only permits accepted proposals without blocking alerts', () => {
    const alerts = buildPlannerAlerts({
      events: [{ event_date: '2030-01-01' }],
      availability: [{ day_of_week: 1, available_minutes: 60 }],
      biological_passport_available: true,
      fetched_at: 'now',
    }, block);
    expect(isPublishablePlannerBlock('accepted', alerts)).toBe(true);
    expect(isPublishablePlannerBlock('pending', alerts)).toBe(false);
  });
});
