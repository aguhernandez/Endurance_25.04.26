import { supabase } from './supabase';
import { hubImpulseAction } from './hubApi';
import {
  IMPULSE_ALGORITHM_VERSION,
  calculateImpulse,
  ImpulseInput,
  ImpulseResult,
} from './impulseEngine';

export type ImpulseSourceKind = 'activity_record' | 'training_session' | 'workout';

export interface PersistedImpulseCalculation {
  athlete_id: string;
  source_kind: ImpulseSourceKind;
  source_id: string;
  activity_dedupe_key: string;
  activity_date: string;
  sport: 'cycling' | 'running' | 'swimming' | 'triathlon';
  duration_seconds: number;
  impulse: number | null;
  method: string;
  status: ImpulseResult['status'];
  calculation_context: 'planned' | 'actual';
  algorithm_version: string;
  reason: string | null;
  input_snapshot: Record<string, unknown>;
}

export async function persistImpulseCalculation(
  record: PersistedImpulseCalculation
): Promise<{ data: PersistedImpulseCalculation | null; error: Error | null }> {
  try {
    const response = await hubImpulseAction('upsert-impulse-calculation', record as unknown as Record<string, unknown>);
    return { data: (response.data ?? null) as PersistedImpulseCalculation | null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

export async function calculateAndPersistImpulseCalculation(args: {
  athleteId: string;
  sourceKind: ImpulseSourceKind;
  sourceId: string;
  activityDedupeKey: string;
  calculationContext: 'planned' | 'actual';
  activityDate: string;
  sport: PersistedImpulseCalculation['sport'];
  durationSeconds: number;
  input: ImpulseInput;
}): Promise<{ result: ImpulseResult; error: Error | null }> {
  const result = calculateImpulse(args.input);
  const { error } = await persistImpulseCalculation({
    athlete_id: args.athleteId,
    source_kind: args.sourceKind,
    source_id: args.sourceId,
    activity_dedupe_key: args.activityDedupeKey,
    activity_date: args.activityDate,
    sport: args.sport,
    duration_seconds: args.durationSeconds,
    impulse: result.impulse,
    method: result.method ?? 'insufficient',
    status: result.status,
    calculation_context: args.calculationContext,
    algorithm_version: IMPULSE_ALGORITHM_VERSION,
    reason: result.reason ?? null,
    input_snapshot: args.input as unknown as Record<string, unknown>,
  });

  return { result, error };
}

export async function getImpulseCalculations(athleteId: string, fromDate?: string) {
  try {
    const response = await hubImpulseAction('get-impulse-calculations', {
      athlete_id: athleteId,
      algorithm_version: IMPULSE_ALGORITHM_VERSION,
      ...(fromDate ? { from_date: fromDate } : {}),
    });
    return { data: (response.data ?? []) as PersistedImpulseCalculation[], error: null };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error : new Error(String(error)) };
  }
}

export async function persistLibraryImpulseCalculation(record: {
  workout_id: string;
  algorithm_version: string;
  impulse: number | null;
  method: string;
  status: 'calculated' | 'estimated' | 'insufficient';
  reason: string | null;
  input_snapshot: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from('impulse_library_calculations')
    .upsert(record, { onConflict: 'workout_id,algorithm_version' })
    .select()
    .single();
  return { data, error: error ?? null };
}
