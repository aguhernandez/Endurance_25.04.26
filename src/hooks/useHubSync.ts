import { supabase } from '../lib/supabase';
import { AthletePhysiology } from '../types/workout';

export interface ActivityRecordPayload {
  athlete_id: string;
  source_satellite?: string;
  sport: string;
  sport_subtype?: string;
  activity_date: string;
  activity_name?: string;
  duration_seconds: number;
  distance_meters?: number;
  elevation_gain_meters?: number;
  avg_power_watts?: number;
  max_power_watts?: number;
  normalized_power_watts?: number;
  ftp_at_time?: number;
  intensity_factor?: number;
  training_stress_score?: number;
  avg_heart_rate_bpm?: number;
  max_heart_rate_bpm?: number;
  hr_zone_distribution?: Record<string, number>;
  avg_pace_sec_per_km?: number;
  best_pace_sec_per_km?: number;
  avg_speed_kmh?: number;
  perceived_effort?: number;
  fatigue_level?: number;
  notes?: string;
  impulse?: number;
}

function calcImpulse(payload: ActivityRecordPayload): number {
  const durationMin = payload.duration_seconds / 60;
  if (payload.avg_heart_rate_bpm) {
    return Math.round(durationMin * payload.avg_heart_rate_bpm * 0.64 * 1.92);
  }
  if (payload.avg_power_watts && payload.ftp_at_time) {
    const if_ = payload.avg_power_watts / payload.ftp_at_time;
    return Math.round((payload.duration_seconds * payload.avg_power_watts * if_) / (payload.ftp_at_time * 3600) * 100);
  }
  if (payload.perceived_effort) {
    return Math.round(durationMin * payload.perceived_effort * 1.5);
  }
  return 0;
}

export async function pushActivityRecord(payload: ActivityRecordPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const impulse = payload.impulse ?? calcImpulse(payload);

    const { error } = await supabase
      .from('activity_records')
      .insert({
        ...payload,
        source_satellite: payload.source_satellite ?? 'lab',
        impulse,
      });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('HUB sync: failed to push activity record', err);
    return { success: false, error: err.message };
  }
}

export async function pushAthleteThresholds(
  athleteId: string,
  physiology: AthletePhysiology | null,
  ftpWatts: number | null
): Promise<{ success: boolean; error?: string }> {
  if (!physiology && !ftpWatts) return { success: true };

  try {
    const payload: Record<string, unknown> = {
      athlete_id: athleteId,
      source_satellite: 'lab',
      updated_at: new Date().toISOString(),
    };

    if (ftpWatts) {
      payload.current_ftp_watts = ftpWatts;
      if (physiology) {
        payload.power_z1_min = physiology.power_z1_min ? Math.round(ftpWatts * physiology.power_z1_min / 100) : null;
        payload.power_z1_max = physiology.power_z1_max ? Math.round(ftpWatts * physiology.power_z1_max / 100) : null;
        payload.power_z2_min = physiology.power_z2_min ? Math.round(ftpWatts * physiology.power_z2_min / 100) : null;
        payload.power_z2_max = physiology.power_z2_max ? Math.round(ftpWatts * physiology.power_z2_max / 100) : null;
        payload.power_z3_min = physiology.power_z3_min ? Math.round(ftpWatts * physiology.power_z3_min / 100) : null;
        payload.power_z3_max = physiology.power_z3_max ? Math.round(ftpWatts * physiology.power_z3_max / 100) : null;
        payload.power_z4_min = physiology.power_z4_min ? Math.round(ftpWatts * physiology.power_z4_min / 100) : null;
        payload.power_z4_max = physiology.power_z4_max ? Math.round(ftpWatts * physiology.power_z4_max / 100) : null;
        payload.power_z5_min = physiology.power_z5_min ? Math.round(ftpWatts * physiology.power_z5_min / 100) : null;
        payload.power_z5_max = physiology.power_z5_max ? Math.round(ftpWatts * physiology.power_z5_max / 100) : null;
      }
    }

    if (physiology) {
      payload.hr_max = physiology.hr_max ?? null;
      payload.hr_rest = physiology.hr_rest ?? null;
      payload.lactate_threshold_hr = physiology.lactate_threshold_hr ?? null;
      payload.hr_z1_min = physiology.hr_z1_min ?? null;
      payload.hr_z1_max = physiology.hr_z1_max ?? null;
      payload.hr_z2_min = physiology.hr_z2_min ?? null;
      payload.hr_z2_max = physiology.hr_z2_max ?? null;
      payload.hr_z3_min = physiology.hr_z3_min ?? null;
      payload.hr_z3_max = physiology.hr_z3_max ?? null;
      payload.hr_z4_min = physiology.hr_z4_min ?? null;
      payload.hr_z4_max = physiology.hr_z4_max ?? null;
      payload.hr_z5_min = physiology.hr_z5_min ?? null;
      payload.hr_z5_max = physiology.hr_z5_max ?? null;
      payload.hr_z6_min = physiology.hr_z6_min ?? null;
      payload.hr_z6_max = physiology.hr_z6_max ?? null;
      payload.hr_z7_min = physiology.hr_z7_min ?? null;
      payload.hr_z7_max = physiology.hr_z7_max ?? null;

      payload.run_vdot = physiology.run_vdot ?? null;
      payload.run_pace_z1_min = physiology.run_pace_z1_min ?? null;
      payload.run_pace_z1_max = physiology.run_pace_z1_max ?? null;
      payload.run_pace_z2_min = physiology.run_pace_z2_min ?? null;
      payload.run_pace_z2_max = physiology.run_pace_z2_max ?? null;
      payload.run_pace_z3_min = physiology.run_pace_z3_min ?? null;
      payload.run_pace_z3_max = physiology.run_pace_z3_max ?? null;
      payload.run_pace_z4_min = physiology.run_pace_z4_min ?? null;
      payload.run_pace_z4_max = physiology.run_pace_z4_max ?? null;
      payload.run_pace_z5_min = physiology.run_pace_z5_min ?? null;
      payload.run_pace_z5_max = physiology.run_pace_z5_max ?? null;

      payload.swim_css_sec_per_100m = physiology.swim_css_per_100m ?? null;
      payload.swim_pace_z1_min = physiology.swim_pace_z1_min ?? null;
      payload.swim_pace_z1_max = physiology.swim_pace_z1_max ?? null;
      payload.swim_pace_z2_min = physiology.swim_pace_z2_min ?? null;
      payload.swim_pace_z2_max = physiology.swim_pace_z2_max ?? null;
      payload.swim_pace_z3_min = physiology.swim_pace_z3_min ?? null;
      payload.swim_pace_z3_max = physiology.swim_pace_z3_max ?? null;
      payload.swim_pace_z4_min = physiology.swim_pace_z4_min ?? null;
      payload.swim_pace_z4_max = physiology.swim_pace_z4_max ?? null;
      payload.swim_pace_z5_min = physiology.swim_pace_z5_min ?? null;
      payload.swim_pace_z5_max = physiology.swim_pace_z5_max ?? null;

      payload.vo2max = physiology.vo2max ?? null;
    }

    const { error } = await supabase
      .from('athlete_thresholds')
      .upsert(payload, { onConflict: 'athlete_id' });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('HUB sync: failed to push athlete thresholds', err);
    return { success: false, error: err.message };
  }
}

export async function getAthleteThresholds(athleteId: string) {
  const { data, error } = await supabase
    .from('athlete_thresholds')
    .select('*')
    .eq('athlete_id', athleteId)
    .maybeSingle();

  if (error) {
    console.error('HUB sync: failed to get athlete thresholds', error);
    return null;
  }
  return data;
}

export async function getActivityRecords(athleteId: string, limit = 50) {
  const { data, error } = await supabase
    .from('activity_records')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('activity_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('HUB sync: failed to get activity records', error);
    return [];
  }
  return data ?? [];
}
