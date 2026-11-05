import { describe, expect, it } from 'vitest';
import { canApproveOrPublish, canEditProposal, canSelfServe, hasActivePro } from '../src/lib/aiBlockAuthorization';

const proAthlete = { id: 'a1', role: 'athlete' as const, assignedTrainerId: null, activeMembershipSlugs: ['asciende-pro'] };
const supervisedAthlete = { ...proAthlete, assignedTrainerId: 'c1' };
const coach = { id: 'c1', role: 'coach' as const, assignedTrainerId: 'c1', activeMembershipSlugs: [] };

describe('AI Block authorization contract', () => {
  it('allows only active Pro self-service without a trainer', () => {
    expect(hasActivePro(proAthlete)).toBe(true);
    expect(canSelfServe(proAthlete, { athleteId: 'a1', status: 'pending' })).toBe(true);
    expect(canSelfServe({ ...proAthlete, activeMembershipSlugs: [] }, { athleteId: 'a1', status: 'pending' })).toBe(false);
    expect(canSelfServe(supervisedAthlete, { athleteId: 'a1', status: 'pending' })).toBe(false);
  });

  it('requires the authorized coach for supervised approval/publication', () => {
    const block = { athleteId: 'a1', status: 'pending' as const };
    expect(canApproveOrPublish(coach, block)).toBe(true);
    expect(canApproveOrPublish(supervisedAthlete, block)).toBe(false);
  });

  it('allows editing only while pending', () => {
    expect(canEditProposal({ athleteId: 'a1', status: 'pending' })).toBe(true);
    expect(canEditProposal({ athleteId: 'a1', status: 'accepted' })).toBe(false);
    expect(canEditProposal({ athleteId: 'a1', status: 'applied' })).toBe(false);
  });
});
