import { supabase } from './supabase';

const HUB_API_URL = import.meta.env.VITE_HUB_API_URL || 'https://ngkcbygyoobqhlmlnuvl.supabase.co';
const BASE_URL = `${HUB_API_URL}/functions/v1`;

const SESSION_TOKEN_KEY = 'hub_session_token';

let _cachedPlannerToken: string | null = null;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function loadPlannerToken(): Promise<string> {
  if (_cachedPlannerToken !== null) return _cachedPlannerToken;
  try {
    const sessionToken = getSessionToken();
    const headers: Record<string, string> = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };
    if (sessionToken) headers['X-Hub-Token'] = sessionToken;

    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/admin-config?key=hub_planner_token`,
      { headers }
    );
    if (res.ok) {
      const json = await res.json();
      _cachedPlannerToken = json.data?.value || import.meta.env.VITE_HUB_PLANNER_TOKEN || '';
    } else {
      _cachedPlannerToken = import.meta.env.VITE_HUB_PLANNER_TOKEN || '';
    }
  } catch {
    _cachedPlannerToken = import.meta.env.VITE_HUB_PLANNER_TOKEN || '';
  }
  return _cachedPlannerToken;
}

export function invalidatePlannerTokenCache() {
  _cachedPlannerToken = null;
}

async function getPlannerToken(): Promise<string> {
  return loadPlannerToken();
}

function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

async function plannerHeaders(): Promise<HeadersInit> {
  return {
    'X-Planner-Token': await getPlannerToken(),
    'Content-Type': 'application/json',
  };
}

function sessionBearerHeaders(): HeadersInit {
  const token = getSessionToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

function bearerHeaders(): HeadersInit {
  const token = getSessionToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Hub API error ${res.status}`;
    try {
      const body = await res.json();
      message = body.error || body.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HubAthleteProfile {
  athlete: {
    id: string;
    full_name: string;
    sport: string;
    weight_kg: number | null;
    height_cm: number | null;
    birth_date: string | null;
    gender: 'male' | 'female' | 'other' | null;
    role: 'athlete';
  };
  body_composition: {
    fat_mass_kg: number | null;
    lean_mass_kg: number | null;
    fat_percent: number | null;
    measurement_date: string | null;
  } | null;
  nutrition_targets: {
    target_kcal: number | null;
    target_protein_g: number | null;
    target_carbs_g: number | null;
    target_fat_g: number | null;
    updated_at: string | null;
  } | null;
}

export interface HubZoneHR { zone: number; name: string; min_bpm: number; max_bpm: number; }
export interface HubZonePower { zone: number; name: string; min_watts: number; max_watts: number; }
export interface HubZoneRPE { zone: number; name: string; rpe_min: number; rpe_max: number; description?: string; }

export interface HubTrainingZones {
  base_method: string;
  zones5: {
    hr: HubZoneHR[];
    power: HubZonePower[];
    rpe: HubZoneRPE[];
  };
  zones7: {
    hr: HubZoneHR[];
    power: HubZonePower[];
    rpe: HubZoneRPE[];
  };
  default_display: '5' | '7';
}

export interface HubPassportEntry {
  id: string;
  measurement_date: string;
  source: string;
  source_satellite?: string | null;
  source_test_type?: string | null;
  sport_context?: string | null;
  status: string;
  notes?: string | null;
  vo2max: number | null;
  ftp_watts: number | null;
  critical_power: number | null;
  anaerobic_capacity_kj: number | null;
  lt1_hr: number | null;
  lt2_hr: number | null;
  lt1_power: number | null;
  lt2_power: number | null;
  running_threshold_pace: string | null;
  vam: number | null;
  pam: number | null;
  training_zones: HubTrainingZones | null;
  power_zones_json: HubZonePower[] | null;
  hr_zones_json: HubZoneHR[] | null;
  rpe_zones_json: HubZoneRPE[] | null;
  height_cm: number | null;
  weight_kg: number | null;
  body_fat_percent: number | null;
  muscle_mass_kg: number | null;
  lean_mass_kg: number | null;
  bone_mass_kg: number | null;
  athlete_level: 'beginner' | 'intermediate' | 'advanced' | 'elite' | null;
  training_age_years: number | null;
  version_number: number;
  created_at: string;
}

export interface HubBiologicalPassport {
  active_passport: HubPassportEntry;
  passport_history: Array<{
    id: string;
    measurement_date: string;
    source: string;
    source_test_type?: string | null;
    status: string;
    vo2max: number | null;
    ftp_watts: number | null;
    lt2_power: number | null;
    version_number: number;
  }>;
}

export interface HubGpsPoint {
  lat: number;
  lng: number;
  altitude_m?: number | null;
  timestamp?: string | null;
  speed_kmh?: number | null;
  heart_rate?: number | null;
  power_watts?: number | null;
  cadence?: number | null;
  distance_m?: number | null;
}

export interface HubZoneDistribution {
  zone: number;
  name: string;
  color: string;
  planned_percent: number | null;
  actual_percent: number | null;
  actual_seconds: number | null;
  within_target: boolean | null;
}

export interface HubActivityLog {
  timestamp: string;
  type: 'lap' | 'segment' | 'note' | 'event';
  label: string;
  value?: string | null;
  duration_s?: number | null;
  avg_hr?: number | null;
  avg_power?: number | null;
  avg_speed?: number | null;
  compliance?: number | null;
}

export interface HubScheduledWorkout {
  id: string;
  scheduled_date: string;
  status: 'pending' | 'completed' | 'skipped';
  workout: {
    id: string;
    name: string;
    workout_type: string;
    duration_minutes: number | null;
    description: string | null;
  };
  // Completion data (populated when status === 'completed')
  completed_at?: string | null;
  actual_duration_minutes?: number | null;
  actual_distance_km?: number | null;
  actual_avg_hr?: number | null;
  actual_max_hr?: number | null;
  actual_avg_power_watts?: number | null;
  actual_max_power_watts?: number | null;
  actual_avg_cadence?: number | null;
  actual_avg_speed_kmh?: number | null;
  actual_elevation_gain_m?: number | null;
  actual_calories?: number | null;
  actual_tss?: number | null;
  actual_impulse?: number | null;
  rpe?: number | null;
  compliance_percent?: number | null;
  athlete_notes?: string | null;
  athlete_feedback?: string | null;
  athlete_feeling?: string | null;
  coach_notes?: string | null;
  training_log_id?: string | null;
  // New rich fields
  gps_track?: HubGpsPoint[] | null;
  zone_distribution?: HubZoneDistribution[] | null;
  activity_log?: HubActivityLog[] | null;
  lap_count?: number | null;
  // Flat fields the Hub may also use
  name?: string;
  sport?: string;
  planned_duration_minutes?: number | null;
  planned_impulse?: number | null;
  session_type?: string | null;
  target_zones?: unknown[];
  intensity_basis?: string | null;
  planner_source?: string | null;
  workout_source?: string;
  intensity_color?: string | null;
  intensity_label?: string | null;
}

export interface HubCompletedLog {
  id: string;
  training_date: string;
  duration_minutes: number | null;
  distance_km: number | null;
  avg_heart_rate: number | null;
  avg_power_watts: number | null;
  tss: number | null;
  rpe: number | null;
  workout_type: string | null;
  notes: string | null;
  max_heart_rate?: number | null;
  max_power_watts?: number | null;
  session_impulse?: number | null;
  relative_intensity?: number | null;
  elevation_gain_m?: number | null;
  avg_cadence?: number | null;
  avg_speed_kmh?: number | null;
  calories?: number | null;
  external_source?: string | null;
  external_activity_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  athlete_notes?: string | null;
  athlete_feedback?: string | null;
  athlete_feeling?: string | null;
  compliance_percent?: number | null;
  workout_name?: string | null;
  gps_track?: HubGpsPoint[] | null;
  zone_distribution?: HubZoneDistribution[] | null;
  activity_log?: HubActivityLog[] | null;
}

export interface HubWeeklyLoad {
  week_start_date: string;
  planned_tss: number | null;
  actual_tss: number | null;
  planned_hours: number | null;
  actual_hours: number | null;
  load_status: string | null;
}

export interface HubTrainingSchedule {
  date_from: string;
  date_to: string;
  scheduled_workouts: HubScheduledWorkout[];
  completed_training_logs: HubCompletedLog[];
  weekly_loads: HubWeeklyLoad[];
}

export interface HubEndurancePlanStep {
  order: number;
  step_type: string;
  duration_type: string;
  duration_value: number;
  target_type?: string | null;
  target_min_value?: number | null;
  target_max_value?: number | null;
  target_percent_ftp?: number | null;
  target_zone?: number | null;
  zone_system?: string | null;
  repeat_times?: number | null;
  repeat_group_id?: string | null;
  cadence_rpm?: number | null;
}

export interface HubEndurancePlanDay {
  date: string;
  name?: string | null;
  session_type: 'easy' | 'tempo' | 'interval' | 'long' | 'race' | 'rest' | 'recovery';
  sport: 'cycling' | 'running' | 'swimming' | 'triathlon' | 'other';
  planned_duration_minutes: number;
  planned_distance_km: number | null;
  planned_tss: number | null;
  planned_impulse: number | null;
  target_zones: number[];
  description: string | null;
  steps: HubEndurancePlanStep[];
  completed: boolean;
  actual_duration_minutes: number | null;
  actual_distance_km: number | null;
  actual_tss: number | null;
  actual_impulse: number | null;
  actual_avg_hr: number | null;
  actual_avg_power_watts: number | null;
  rpe: number | null;
  notes: string | null;
}

export interface HubEndurancePlanPayload {
  week_start_date: string;
  plan_name?: string;
  summary: {
    total_hours: number;
    total_tss: number;
    total_impulse: number;
    total_distance_km: number;
    sessions_count: number;
    intensity_distribution?: {
      zone1_percent: number;
      zone2_percent: number;
      zone3_percent: number;
      zone4_percent: number;
      zone5_percent: number;
    };
  };
  plan_data: {
    days: HubEndurancePlanDay[];
  };
  notes: string | null;
}

export interface HubTrainingLogPayload {
  training_date: string;
  workout_type: 'cycling' | 'running' | 'swimming' | 'triathlon' | 'other';
  duration_minutes: number;
  distance_km: number | null;
  avg_heart_rate: number | null;
  max_heart_rate: number | null;
  avg_power_watts: number | null;
  max_power_watts: number | null;
  session_impulse: number | null;
  relative_intensity: number | null;
  rpe: number | null;
  elevation_gain_m: number | null;
  avg_cadence: number | null;
  avg_speed_kmh: number | null;
  calories: number | null;
  external_source: string | null;
  external_activity_id: string | null;
  notes: string | null;
}

// ─── Types: Coach Athletes ────────────────────────────────────────────────────

export interface HubCoachAthlete {
  id: string;
  email: string;
  full_name: string;
  sport?: string;
  role: 'athlete';
}

// ─── API Functions ─────────────────────────────────────────────────────────────

export async function hubGetCoachAthletes(coachHubId: string): Promise<HubCoachAthlete[]> {
  const headers = await plannerHeaders();
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/coach-athletes?coach_id=${encodeURIComponent(coachHubId)}`,
    { headers }
  );
  if (!res.ok) {
    console.warn('[HubApi] coach-athletes failed', res.status);
    return [];
  }
  const json = await res.json();
  return json.athletes || json.data || [];
}

export async function hubGetAthleteProfile(athleteId: string, fallbackEmail?: string): Promise<HubAthleteProfile> {
  const headers = await plannerHeaders();
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/athlete-profile?athlete_id=${encodeURIComponent(athleteId)}`,
    { headers }
  );
  if (!res.ok) {
    let errBody: unknown = null;
    try { errBody = await res.clone().json(); } catch {}
    console.warn('[HubApi] athlete-profile by id failed', res.status, errBody);
    if (fallbackEmail) {
      console.log('[HubApi] Trying athlete-profile by email:', fallbackEmail);
      const res2 = await fetch(
        `${BASE_URL}/endurance-satellite-bridge/athlete-profile?athlete_email=${encodeURIComponent(fallbackEmail)}`,
        { headers }
      );
      if (!res2.ok) {
        let errBody2: unknown = null;
        try { errBody2 = await res2.clone().json(); } catch {}
        console.warn('[HubApi] athlete-profile by email failed', res2.status, errBody2);
      }
      return handleResponse<HubAthleteProfile>(res2);
    }
  }
  return handleResponse<HubAthleteProfile>(res);
}

export async function hubGetBiologicalPassport(athleteId: string, fallbackEmail?: string): Promise<HubBiologicalPassport> {
  const headers = await plannerHeaders();
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/biological-passport?athlete_id=${encodeURIComponent(athleteId)}`,
    { headers }
  );
  if (!res.ok) {
    let errBody: unknown = null;
    try { errBody = await res.clone().json(); } catch {}
    console.warn('[HubApi] biological-passport by id failed', res.status, errBody);
    if (fallbackEmail) {
      console.log('[HubApi] Trying biological-passport by email:', fallbackEmail);
      const res2 = await fetch(
        `${BASE_URL}/endurance-satellite-bridge/biological-passport?athlete_email=${encodeURIComponent(fallbackEmail)}`,
        { headers }
      );
      if (!res2.ok) {
        let errBody2: unknown = null;
        try { errBody2 = await res2.clone().json(); } catch {}
        console.warn('[HubApi] biological-passport by email failed', res2.status, errBody2);
      }
      return handleResponse<HubBiologicalPassport>(res2);
    }
  }
  return handleResponse<HubBiologicalPassport>(res);
}

export async function hubGetTrainingSchedule(
  athleteId: string,
  dateFrom: string,
  dateTo: string
): Promise<HubTrainingSchedule> {
  const params = new URLSearchParams({
    athlete_id: athleteId,
    date_from: dateFrom,
    date_to: dateTo,
  });
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/training-schedule?${params}`,
    { headers: await plannerHeaders() }
  );
  return handleResponse<HubTrainingSchedule>(res);
}

export interface HubExternalActivity {
  id: string;
  user_id: string;
  name: string;
  source: string;
  sport_type: string;
  distance_meters: number | null;
  duration_seconds: number | null;
  calories: number | null;
  start_time: string;
  local_date: string;
  raw_data?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export async function hubGetExternalActivities(
  athleteId: string,
  dateFrom: string,
  dateTo: string
): Promise<HubExternalActivity[]> {
  const params = new URLSearchParams({
    athlete_id: athleteId,
    date_from: dateFrom,
    date_to: dateTo,
  });
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/activities?${params}`,
    { headers: await plannerHeaders() }
  );
  if (!res.ok) {
    console.warn('[HubApi] activities endpoint failed', res.status);
    return [];
  }
  const json = await res.json();
  return json.activities || json.data || [];
}

export async function hubPushEndurancePlan(
  athleteId: string,
  payload: HubEndurancePlanPayload
): Promise<{ success: boolean; record: { id: string; week_start_date: string; plan_name: string | null; updated_at: string }; message: string }> {
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/push-endurance-plan?athlete_id=${encodeURIComponent(athleteId)}`,
    {
      method: 'POST',
      headers: await plannerHeaders(),
      body: JSON.stringify(payload),
    }
  );
  return handleResponse(res);
}

export async function hubPushTrainingLog(
  athleteId: string,
  payload: HubTrainingLogPayload
): Promise<{ success: boolean; record: { id: string; training_date: string; workout_type: string; duration_minutes: number }; message: string }> {
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/push-training-log?athlete_id=${encodeURIComponent(athleteId)}`,
    {
      method: 'POST',
      headers: await plannerHeaders(),
      body: JSON.stringify(payload),
    }
  );
  return handleResponse(res);
}

export interface HubTagPayload {
  name: string;
  name_es?: string;
  slug: string;
  category: string;
  color?: string;
  description?: string;
  source_context?: string;
}

export interface HubPushTagsResult {
  success: boolean;
  saved: string[];
  errors: string[];
  message: string;
}

export async function hubGetTrainingLog(
  athleteId: string,
  trainingLogId: string
): Promise<HubCompletedLog> {
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/training-log?athlete_id=${encodeURIComponent(athleteId)}&log_id=${encodeURIComponent(trainingLogId)}`,
    { headers: await plannerHeaders() }
  );
  return handleResponse<HubCompletedLog>(res);
}

export async function hubGetTrainingLogs(
  athleteId: string,
  dateFrom: string,
  dateTo: string
): Promise<HubCompletedLog[]> {
  const params = new URLSearchParams({ athlete_id: athleteId, date_from: dateFrom, date_to: dateTo });
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/training-logs?${params}`,
    { headers: await plannerHeaders() }
  );
  const json = await handleResponse<{ logs?: HubCompletedLog[]; data?: HubCompletedLog[] }>(res);
  return json.logs || json.data || [];
}

export async function hubPushTags(
  athleteId: string,
  tags: HubTagPayload[]
): Promise<HubPushTagsResult> {
  const res = await fetch(
    `${BASE_URL}/endurance-satellite-bridge/push-tags?athlete_id=${encodeURIComponent(athleteId)}`,
    {
      method: 'POST',
      headers: await plannerHeaders(),
      body: JSON.stringify({ tags }),
    }
  );
  return handleResponse<HubPushTagsResult>(res);
}

export async function collectAndPushAthleteTags(
  localAthleteId: string,
  hubAthleteId: string,
  sourceContext?: string
): Promise<HubPushTagsResult | null> {
  try {
    const { data: workoutRows } = await supabase
      .from('workouts')
      .select('id')
      .or(`coach_id.eq.${localAthleteId},athlete_id.eq.${localAthleteId}`);

    if (!workoutRows || workoutRows.length === 0) {
      return { success: true, saved: [], errors: [], message: 'No tags to sync' };
    }

    const workoutIds = workoutRows.map((w: any) => w.id);

    const tagMap = new Map<string, HubTagPayload>();

    for (let tagStart = 0; tagStart < workoutIds.length; tagStart += 20) {
      const { data: wtRows } = await supabase
        .from('workout_tags')
        .select('workout_id, tags(*)')
        .in('workout_id', workoutIds.slice(tagStart, tagStart + 20));

      if (wtRows) {
        for (const row of wtRows as any[]) {
          const t = row.tags;
          if (t && !tagMap.has(t.slug)) {
            tagMap.set(t.slug, {
              name: t.name,
              name_es: t.name_es ?? undefined,
              slug: t.slug,
              category: t.category,
              color: t.color ?? undefined,
              description: t.description ?? undefined,
              source_context: sourceContext,
          });
        }
      }
    }
    }

    if (tagMap.size === 0) return { success: true, saved: [], errors: [], message: 'No tags to sync' };

    return await hubPushTags(hubAthleteId, Array.from(tagMap.values()));
  } catch (err: any) {
    console.error('[HubApi] collectAndPushAthleteTags failed:', err);
    return null;
  }
}
