import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  computeAdaptation,
  buildAdaptationInput,
  AdaptationProposal,
  AdaptationRuleId,
} from '../lib/microcycleAdaptationEngine';
import { WeeklySummaryData } from '../lib/weeklySummary';
import { WeekSimResult } from '../lib/banisterEngine';
import { ATPPlan, ATPEvent } from '../types/workout';

export interface StoredAdaptation {
  id: string;
  athlete_id: string;
  plan_id: string | null;
  week_number: number;
  week_start_date: string;
  trigger_reason: 'post_workout' | 'weekly_review' | 'manual';
  rule_id: AdaptationRuleId;
  rule_label: string;
  previous_impulse: number;
  proposed_impulse: number;
  load_delta_pct: number;
  rationale: string;
  safety_flags: Array<{ code: string; message: string; severity: 'warning' | 'block' }> | null;
  status: 'pending' | 'approved' | 'dismissed';
  applied_at: string | null;
  input_snapshot: Record<string, unknown> | null;
  created_at: string;
}

function daysBetweenDates(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function daysToEvent(events: ATPEvent[], priority: 'A' | 'B', refDate: Date): number | null {
  const matching = events
    .filter(e => e.priority === priority)
    .map(e => {
      const d = new Date(e.event_date ?? (e as any).eventDate + 'T00:00:00');
      return daysBetweenDates(refDate, d);
    })
    .filter(d => d >= 0)
    .sort((a, b) => a - b);

  return matching.length > 0 ? matching[0] : null;
}

export async function generateAndStoreAdaptation(params: {
  athleteId: string;
  plan: ATPPlan;
  events: ATPEvent[];
  currentWeek: WeeklySummaryData;
  nextWeek: WeekSimResult;
  recentScores: number[];
  weekFinalScore: number | null;
  weekClassification: 'green' | 'yellow' | 'red' | null;
  avgPerceivedEffort: number | null;
  avgFatigueLevel: number | null;
  avgSleepQuality: number | null;
  injuryConcerns: boolean;
  triggerReason: 'post_workout' | 'weekly_review' | 'manual';
}): Promise<{ success: boolean; proposal?: StoredAdaptation; ruleId?: AdaptationRuleId; error?: string }> {
  try {
    const refDate = new Date(params.currentWeek.weekEndDate + 'T00:00:00');

    const input = buildAdaptationInput({
      athleteId: params.athleteId,
      planId: params.plan.id,
      currentWeek: params.currentWeek,
      nextWeek: params.nextWeek,
      rbMin: params.plan.rb_min ?? -25,
      tauChronic: params.plan.tau_chronic ?? 28,
      tauAcute: params.plan.tau_acute ?? 7,
      daysToNextAEvent: daysToEvent(params.events, 'A', refDate),
      daysToNextBEvent: daysToEvent(params.events, 'B', refDate),
      avgPerceivedEffort: params.avgPerceivedEffort,
      avgFatigueLevel: params.avgFatigueLevel,
      avgSleepQuality: params.avgSleepQuality,
      injuryConcerns: params.injuryConcerns,
      recentScores: params.recentScores,
      weekFinalScore: params.weekFinalScore,
      weekClassification: params.weekClassification,
    });

    const proposal = computeAdaptation(input);

    const { data, error } = await supabase
      .from('adaptation_log')
      .insert({
        athlete_id: proposal.athleteId,
        plan_id: proposal.planId,
        week_number: proposal.weekNumber,
        week_start_date: proposal.weekStartDate,
        trigger_reason: params.triggerReason,
        rule_id: proposal.ruleId,
        rule_label: proposal.ruleLabel,
        previous_impulse: proposal.previousImpulse,
        proposed_impulse: proposal.proposedImpulse,
        load_delta_pct: proposal.loadDeltaPct,
        rationale: proposal.rationale,
        safety_flags: proposal.safetyFlags.length > 0 ? proposal.safetyFlags : null,
        status: 'pending',
        input_snapshot: proposal.inputSnapshot as Record<string, unknown>,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, proposal: data as StoredAdaptation, ruleId: proposal.ruleId };
  } catch (err: any) {
    console.error('Adaptation generation failed:', err);
    return { success: false, error: err.message };
  }
}

export async function applyAdaptation(
  adaptation: StoredAdaptation,
  planId: string,
  athleteId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: upsertError } = await supabase
      .from('atp_week_overrides')
      .upsert(
        {
          plan_id: planId,
          athlete_id: athleteId,
          week_number: adaptation.week_number,
          week_start_date: adaptation.week_start_date,
          override_impulse: adaptation.proposed_impulse,
        },
        { onConflict: 'plan_id,week_number' }
      );

    if (upsertError) throw upsertError;

    const { error: logError } = await supabase
      .from('adaptation_log')
      .update({ status: 'approved', applied_at: new Date().toISOString() })
      .eq('id', adaptation.id);

    if (logError) throw logError;

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function dismissAdaptation(
  adaptationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('adaptation_log')
      .update({ status: 'dismissed' })
      .eq('id', adaptationId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function usePendingAdaptations(athleteId: string | null, planId: string | null) {
  const [adaptations, setAdaptations] = useState<StoredAdaptation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!athleteId) return;
    setLoading(true);
    try {
      let query = supabase
        .from('adaptation_log')
        .select('*')
        .eq('athlete_id', athleteId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (planId) {
        query = query.eq('plan_id', planId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAdaptations((data ?? []) as StoredAdaptation[]);
    } catch (err) {
      console.error('Failed to fetch pending adaptations:', err);
    } finally {
      setLoading(false);
    }
  }, [athleteId, planId]);

  return { adaptations, loading, refetch: fetch };
}

export function useAdaptationHistory(athleteId: string | null, limit = 20) {
  const [history, setHistory] = useState<StoredAdaptation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!athleteId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('adaptation_log')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setHistory((data ?? []) as StoredAdaptation[]);
    } catch (err) {
      console.error('Failed to fetch adaptation history:', err);
    } finally {
      setLoading(false);
    }
  }, [athleteId, limit]);

  return { history, loading, refetch: fetch };
}

export type { AdaptationProposal };
