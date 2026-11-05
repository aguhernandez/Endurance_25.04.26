export interface PlannerActor {
  id: string;
  role: 'athlete' | 'coach' | 'trainer' | 'head_coach' | 'admin';
  assignedTrainerId: string | null;
  activeMembershipSlugs: string[];
}

export interface PlannerBlockOwner {
  athleteId: string;
  assignedTrainerId?: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'applied';
}

export function hasActivePro(actor: PlannerActor): boolean {
  return actor.activeMembershipSlugs.some(slug => ['asciende-pro', 'pro', 'asciende_pro'].includes(slug));
}

export function canAccessPlannerBlock(actor: PlannerActor, owner: PlannerBlockOwner): boolean {
  return actor.role === 'admin' || actor.id === owner.athleteId ||
    (['coach', 'trainer', 'head_coach'].includes(actor.role) && owner.assignedTrainerId === actor.id);
}

export function canSelfServe(actor: PlannerActor, owner: PlannerBlockOwner): boolean {
  return actor.id === owner.athleteId && actor.assignedTrainerId === null && hasActivePro(actor);
}

export function canApproveOrPublish(actor: PlannerActor, owner: PlannerBlockOwner): boolean {
  if (actor.role === 'admin' || ['coach', 'trainer', 'head_coach'].includes(actor.role)) return true;
  return canSelfServe(actor, owner);
}

export function canEditProposal(owner: PlannerBlockOwner): boolean {
  return owner.status === 'pending';
}
