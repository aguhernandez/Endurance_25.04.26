import { supabase } from './supabase';

const HUB_API_URL = import.meta.env.VITE_HUB_API_URL || 'https://ngkcbygyoobqhlmlnuvl.supabase.co';
const BASE_URL = `${HUB_API_URL}/functions/v1`;

/**
 * Hub pull configuration — the ONLY place these limits are defined.
 * - PULL_WINDOW_DAYS: pull past workouts only from the last 90 days.
 * - FUTURE_WINDOW_DAYS: pull planned workouts up to 12 weeks ahead.
 * - RECENT_RECHECK_DAYS: workouts newer than 7 days (and future ones) may have
 *   changed in Hub, so they are re-consulted; older ones are immutable once loaded.
 * - PULL_MIN_INTERVAL_MS: minimum time between full pulls of the same athlete.
 * - PAGE_SIZE: rows per request when paginating.
 */
export const PULL_WINDOW_DAYS = 90;
export const FUTURE_WINDOW_DAYS = 84; // 12 weeks
export const RECENT_RECHECK_DAYS = 7;
export const PULL_MIN_INTERVAL_MS = 10 * 60 * 1000;
export const PAGE_SIZE = 200;
const SESSION_REVIEW_FUNCTION = import.meta.env.VITE_HUB_SESSION_REVIEW_FUNCTION || 'endurance-satellite-bridge';

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
  return _cachedPlannerToken ?? '';
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

/** The Hub-issued session token is distinct from the Planner Supabase session. */
function hubUserAuthorization(): string {
  const token = getSessionToken();
  if (!token) {
    throw new Error('No hay una sesión activa de Asciende Hub. Vuelve a iniciar sesión desde el Hub.');
  }
  return `Bearer ${token}`;
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

export type HubSessionAction = 'get-session-analysis' | 'get-session-timeseries' | 'list-review-inbox' | 'save-review';
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- These Hub actions return capability-dependent JSON with no generated schema.
export type HubSessionPayload = Record<string, any>;

/** Session analysis and review data are owned and calculated by the Hub. */
export async function hubSessionAction(action: HubSessionAction, params: HubSessionPayload = {}): Promise<HubSessionPayload> {
  const plannerToken = await getPlannerToken();
  if (!plannerToken) throw new Error('Falta el X-Planner-Token configurado para conectar con Asciende Hub.');
  const headers: Record<string, string> = {
    'X-Planner-Token': plannerToken,
    'Content-Type': 'application/json',
  };
  headers.Authorization = hubUserAuthorization();
  const res = await fetch(`${BASE_URL}/${SESSION_REVIEW_FUNCTION}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, ...params }),
  });
  return handleResponse<HubSessionPayload>(res);
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

/**
 * Compute the pull window for one athlete: the past 90 days plus planned
 * workouts up to 12 weeks ahead. All Hub pulls must use this window — never
 * fetch the full history.
 */
export function hubPullWindow(reference = new Date()): { dateFrom: string; dateTo: string } {
  const from = new Date(reference);
  from.setDate(from.getDate() - PULL_WINDOW_DAYS);
  const to = new Date(reference);
  to.setDate(to.getDate() + FUTURE_WINDOW_DAYS);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { dateFrom: fmt(from), dateTo: fmt(to) };
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
  const json = await handleResponse<Record<string, unknown>>(res);
  const workouts = (json.scheduled_workouts || json.schedule || json.data || []) as HubScheduledWorkout[];
  const logs = (json.completed_training_logs || json.logs || []) as HubCompletedLog[];
  const loads = (json.weekly_loads || []) as HubWeeklyLoad[];
  // Completed logs can carry gps_track/zone blobs; the planner renders those
  // from workouts it already imported, so drop them from the bulk schedule pull.
  const lightLogs = logs.map(l => ({
    ...l,
    gps_track: undefined,
    zone_distribution: undefined,
    activity_log: undefined,
  }));
  return {
    date_from: (json.date_from as string) || dateFrom,
    date_to: (json.date_to as string) || dateTo,
    scheduled_workouts: workouts.map(w => ({ ...w, gps_track: undefined, zone_distribution: undefined, activity_log: undefined })),
    completed_training_logs: lightLogs,
    weekly_loads: loads,
  };
}

export interface HubActivityGpsPoint {
  lat: number;
  lng: number;
  altitude?: number | null;
  speed?: number | null;
  speed_kmh?: number | null;
  distance?: number | null;
  distance_m?: number | null;
  time?: string | null;
  timestamp?: string | null;
  hr?: number | null;
  heart_rate?: number | null;
  power?: number | null;
  power_watts?: number | null;
  cadence?: number | null;
}

export interface HubActivitySplit {
  index?: number;
  label?: string;
  distance_km?: number;
  duration_seconds?: number;
  avg_pace_sec_per_km?: number;
  avg_power_watts?: number | null;
  avg_heart_rate?: number | null;
  avg_cadence?: number | null;
  max_power_watts?: number | null;
  max_heart_rate?: number | null;
  elevation_gain_m?: number | null;
}

export interface HubActivityZoneDist {
  zone: number;
  name: string;
  color?: string;
  actual_percent?: number | null;
  actual_seconds?: number | null;
  within_target?: boolean | null;
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
  average_heartrate?: number | null;
  max_heartrate?: number | null;
  average_power?: number | null;
  max_power?: number | null;
  average_cadence?: number | null;
  max_cadence?: number | null;
  average_speed?: number | null;
  max_speed?: number | null;
  elevation_gain?: number | null;
  elevation_loss?: number | null;
  tss?: number | null;
  rpe?: number | null;
  notes?: string | null;
  map_polyline?: string | null;
  start_latlng?: [number, number] | null;
  end_latlng?: [number, number] | null;
  gps_track?: HubActivityGpsPoint[] | null;
  zone_distribution?: HubActivityZoneDist[] | null;
  activity_log?: HubActivityLog[] | null;
  splits?: HubActivitySplit[] | null;
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
    page_size: String(PAGE_SIZE),
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
  const items: HubExternalActivity[] = json.activities || json.data || [];
  // Strip heavy JSON the planner never renders (raw payload from the source app)
  return items.map(a => ({ ...a, raw_data: undefined }));
}

export function hubActivityToWorkoutData(act: HubExternalActivity): import('../types/workoutDetail').WorkoutData {
  const rawGps = act.gps_track || [];
  const gpsTrack = rawGps.map(p => ({
    lat: p.lat,
    lng: p.lng,
    altitude_m: p.altitude ?? null,
    timestamp: p.timestamp ?? p.time ?? null,
    speed_kmh: p.speed_kmh ?? p.speed ?? null,
    heart_rate: p.heart_rate ?? p.hr ?? null,
    power_watts: p.power_watts ?? p.power ?? null,
    cadence: p.cadence ?? null,
    distance_m: p.distance_m ?? p.distance ?? null,
  }));

  const gpsHr = gpsTrack.map(p => p.heart_rate).filter((v): v is number => v != null && v > 0);
  const gpsWatts = gpsTrack.map(p => p.power_watts).filter((v): v is number => v != null && v > 0);
  const gpsCadence = gpsTrack.map(p => p.cadence).filter((v): v is number => v != null && v > 0);
  const gpsElevation = gpsTrack.map(p => p.altitude_m).filter((v): v is number => v != null);

  const splits = act.splits || [];
  const paceArr = splits.map(s => s.avg_pace_sec_per_km ?? 0).filter(v => v > 0);
  const wattsArr = splits.map(s => s.avg_power_watts ?? 0).filter(v => v != null && v > 0);
  const hrArr = splits.map(s => s.avg_heart_rate ?? 0).filter(v => v != null && v > 0);
  const cadenceArr = splits.map(s => s.avg_cadence ?? 0).filter(v => v != null && v > 0);

  const distanceKm = act.distance_meters ? act.distance_meters / 1000 : null;
  const durationSec = act.duration_seconds ?? null;
  const avgPace = distanceKm && durationSec && distanceKm > 0 ? durationSec / distanceKm : null;

  return {
    id: act.id,
    name: act.name || 'Actividad',
    date: act.local_date,
    sport: act.sport_type || undefined,
    distance: distanceKm,
    distance_km: distanceKm,
    duration: durationSec,
    duration_seconds: durationSec,
    actual_duration_minutes: durationSec ? durationSec / 60 : null,
    actual_distance_km: distanceKm,
    actual_avg_hr: act.average_heartrate ?? null,
    actual_max_hr: act.max_heartrate ?? null,
    actual_avg_power_watts: act.average_power ?? null,
    actual_max_power_watts: act.max_power ?? null,
    actual_avg_cadence: act.average_cadence ?? null,
    actual_avg_speed_kmh: act.average_speed ?? null,
    actual_elevation_gain_m: act.elevation_gain ?? null,
    actual_elevation_loss_m: act.elevation_loss ?? null,
    actual_calories: act.calories ?? null,
    actual_tss: act.tss ?? null,
    rpe: act.rpe ?? null,
    athlete_notes: act.notes ?? null,
    gps_track: gpsTrack.length > 0 ? gpsTrack : null,
    map: gpsTrack.length > 0 ? gpsTrack : null,
    heart_rate: gpsHr.length > 0 ? gpsHr : (hrArr.length > 0 ? hrArr : null),
    heartRate: gpsHr.length > 0 ? gpsHr : (hrArr.length > 0 ? hrArr : null),
    watts: gpsWatts.length > 0 ? gpsWatts : (wattsArr.length > 0 ? wattsArr : null),
    power_watts: gpsWatts.length > 0 ? gpsWatts : (wattsArr.length > 0 ? wattsArr : null),
    cadence: gpsCadence.length > 0 ? gpsCadence : (cadenceArr.length > 0 ? cadenceArr : null),
    cadence_rpm: gpsCadence.length > 0 ? gpsCadence : (cadenceArr.length > 0 ? cadenceArr : null),
    elevation: gpsElevation.length > 0 ? gpsElevation : null,
    elevation_m: gpsElevation.length > 0 ? gpsElevation : null,
    pace: paceArr.length > 0 ? paceArr : (avgPace ? [avgPace] : null),
    pace_sec_per_km: paceArr.length > 0 ? paceArr : null,
    splits: splits.length > 0 ? splits.map((s, i) => ({
      index: s.index ?? i + 1,
      label: s.label,
      distance_km: s.distance_km,
      duration_seconds: s.duration_seconds,
      avg_pace_sec_per_km: s.avg_pace_sec_per_km,
      avg_power_watts: s.avg_power_watts,
      avg_heart_rate: s.avg_heart_rate,
      avg_cadence: s.avg_cadence,
      max_power_watts: s.max_power_watts,
      max_heart_rate: s.max_heart_rate,
      elevation_gain_m: s.elevation_gain_m,
    })) : null,
    zone_distribution: (act.zone_distribution || []).map(z => ({
      zone: z.zone,
      name: z.name,
      color: z.color,
      actual_percent: z.actual_percent ?? null,
      actual_seconds: z.actual_seconds ?? null,
      within_target: z.within_target ?? null,
    })),
    activity_log: (act.activity_log || []).map(a => ({
      timestamp: a.timestamp,
      type: a.type,
      label: a.label,
      value: a.value ?? null,
      duration_s: a.duration_s ?? null,
      avg_hr: a.avg_hr ?? null,
      avg_power: a.avg_power ?? null,
      avg_speed: a.avg_speed ?? null,
    })),
  };
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

export function hubCompletedLogToWorkoutData(log: HubCompletedLog): import('../types/workoutDetail').WorkoutData {
  const gpsTrack = (log.gps_track || []).map(p => ({
    lat: p.lat,
    lng: p.lng,
    altitude_m: p.altitude_m ?? null,
    timestamp: p.timestamp ?? null,
    speed_kmh: p.speed_kmh ?? null,
    heart_rate: p.heart_rate ?? null,
    power_watts: p.power_watts ?? null,
    cadence: p.cadence ?? null,
    distance_m: p.distance_m ?? null,
  }));

  const gpsHr = gpsTrack.map(p => p.heart_rate).filter((v): v is number => v != null && v > 0);
  const gpsWatts = gpsTrack.map(p => p.power_watts).filter((v): v is number => v != null && v > 0);
  const gpsCadence = gpsTrack.map(p => p.cadence).filter((v): v is number => v != null && v > 0);
  const gpsElevation = gpsTrack.map(p => p.altitude_m).filter((v): v is number => v != null);

  return {
    id: log.id,
    name: log.workout_name || log.workout_type || 'Actividad',
    date: log.training_date,
    sport: log.workout_type || undefined,
    distance: log.distance_km ?? null,
    distance_km: log.distance_km ?? null,
    duration: log.duration_minutes ? log.duration_minutes * 60 : null,
    duration_seconds: log.duration_minutes ? log.duration_minutes * 60 : null,
    actual_duration_minutes: log.duration_minutes ?? null,
    actual_distance_km: log.distance_km ?? null,
    actual_avg_hr: log.avg_heart_rate ?? null,
    actual_max_hr: log.max_heart_rate ?? null,
    actual_avg_power_watts: log.avg_power_watts ?? null,
    actual_max_power_watts: log.max_power_watts ?? null,
    actual_avg_cadence: log.avg_cadence ?? null,
    actual_avg_speed_kmh: log.avg_speed_kmh ?? null,
    actual_elevation_gain_m: log.elevation_gain_m ?? null,
    actual_calories: log.calories ?? null,
    actual_tss: log.tss ?? null,
    actual_impulse: log.session_impulse ?? null,
    rpe: log.rpe ?? null,
    compliance_percent: log.compliance_percent ?? null,
    athlete_notes: log.athlete_notes ?? log.notes ?? null,
    athlete_feedback: log.athlete_feedback ?? null,
    athlete_feeling: log.athlete_feeling ?? null,
    gps_track: gpsTrack.length > 0 ? gpsTrack : null,
    map: gpsTrack.length > 0 ? gpsTrack : null,
    heart_rate: gpsHr.length > 0 ? gpsHr : null,
    heartRate: gpsHr.length > 0 ? gpsHr : null,
    watts: gpsWatts.length > 0 ? gpsWatts : null,
    power_watts: gpsWatts.length > 0 ? gpsWatts : null,
    cadence: gpsCadence.length > 0 ? gpsCadence : null,
    cadence_rpm: gpsCadence.length > 0 ? gpsCadence : null,
    elevation: gpsElevation.length > 0 ? gpsElevation : null,
    elevation_m: gpsElevation.length > 0 ? gpsElevation : null,
    zone_distribution: (log.zone_distribution || []).map(z => ({
      zone: z.zone,
      name: z.name,
      color: z.color,
      actual_percent: z.actual_percent ?? null,
      actual_seconds: z.actual_seconds ?? null,
      within_target: z.within_target ?? null,
    })),
    activity_log: (log.activity_log || []).map(a => ({
      timestamp: a.timestamp,
      type: a.type,
      label: a.label,
      value: a.value ?? null,
      duration_s: a.duration_s ?? null,
      avg_hr: a.avg_hr ?? null,
      avg_power: a.avg_power ?? null,
      avg_speed: a.avg_speed ?? null,
    })),
  };
}
