export type Sport = 'cycling' | 'running' | 'swimming';

export type TagCategory = 'training' | 'nutrition' | 'recovery' | 'performance' | 'mindset' | 'methodology' | 'other';

export interface Tag {
  id: string;
  name: string;
  name_es?: string;
  slug: string;
  category: TagCategory;
  description?: string;
  color: string;
  created_by?: string;
  created_at: string;
}

export type IntensityBasis = 'power' | 'hr' | 'pace' | 'rpe';

export type StepType = 'warmup' | 'steady' | 'interval' | 'recovery' | 'cooldown';

export type DurationType = 'time' | 'distance';

export type TargetType = 'power' | 'hr' | 'pace' | 'rpe';

export interface WorkoutStep {
  id: string;
  workout_id: string;
  order: number;
  step_type: StepType;
  duration_type: DurationType;
  duration_value: number;
  target_type?: TargetType;
  target_min_value?: number;
  target_max_value?: number;
  target_percent_ftp?: number;
  target_zone?: number;
  zone_system?: '5' | '7';
  repeat_times?: number;
  repeat_rest_step_id?: string;
  repeat_group_id?: string;
  cadence_rpm?: number;
  created_at: string;
}

export type WorkoutStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';

export interface Workout {
  id: string;
  coach_id: string;
  athlete_id?: string;
  sport: Sport;
  name: string;
  description?: string;
  intensity_basis?: IntensityBasis;
  scheduled_date?: string;
  status?: WorkoutStatus;
  estimated_duration_minutes?: number;
  estimated_impulse?: number;
  actual_duration_minutes?: number;
  actual_impulse?: number;
  actual_avg_intensity_percent_ftp?: number;
  rpe?: number;
  notes?: string;
  sub_discipline?: string;
  elevation_m?: number;
  scheduled_time?: string;
  completed_at?: string;
  difficulty_color?: 'green' | 'yellow' | 'red' | null;
  compliance_status?: 'completed' | 'modified' | 'missed' | null;
  created_at: string;
  updated_at: string;
  steps?: WorkoutStep[];
}

export interface WorkoutWithSteps extends Workout {
  steps: WorkoutStep[];
}

export interface DailyLoad {
  id: string;
  athlete_id: string;
  date: string;
  planned_impulse: number;
  actual_impulse: number;
  created_at: string;
  updated_at: string;
}

export interface PerformanceState {
  id: string;
  athlete_id: string;
  date: string;
  ct?: number;
  al?: number;
  rb?: number;
  twl?: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingSession {
  id: string;
  athlete_id: string;
  sport: Sport;
  sport_subtype?: string;
  session_date: string;
  session_name?: string;
  planned_by_coach_id?: string;
  status: 'planned' | 'completed';
  duration_minutes: number;
  distance_km?: number;
  avg_power_watts?: number;
  avg_heart_rate?: number;
  avg_pace_per_km?: number;
  perceived_effort?: number;
  fatigue_level?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AthletePhysiology {
  id: string;
  athlete_id: string;
  hr_max?: number;
  hr_rest?: number;
  hr_z1_min?: number;
  hr_z1_max?: number;
  hr_z2_min?: number;
  hr_z2_max?: number;
  hr_z3_min?: number;
  hr_z3_max?: number;
  hr_z4_min?: number;
  hr_z4_max?: number;
  hr_z5_min?: number;
  hr_z5_max?: number;
  hr_z6_min?: number;
  hr_z6_max?: number;
  hr_z7_min?: number;
  hr_z7_max?: number;
  power_z1_min?: number;
  power_z1_max?: number;
  power_z2_min?: number;
  power_z2_max?: number;
  power_z3_min?: number;
  power_z3_max?: number;
  power_z4_min?: number;
  power_z4_max?: number;
  power_z5_min?: number;
  power_z5_max?: number;
  power_z6_min?: number;
  power_z6_max?: number;
  power_z7_min?: number;
  power_z7_max?: number;
  run_pace_z1_min?: number;
  run_pace_z1_max?: number;
  run_pace_z2_min?: number;
  run_pace_z2_max?: number;
  run_pace_z3_min?: number;
  run_pace_z3_max?: number;
  run_pace_z4_min?: number;
  run_pace_z4_max?: number;
  run_pace_z5_min?: number;
  run_pace_z5_max?: number;
  run_vdot?: number;
  swim_css_per_100m?: number;
  swim_pace_z1_min?: number;
  swim_pace_z1_max?: number;
  swim_pace_z2_min?: number;
  swim_pace_z2_max?: number;
  swim_pace_z3_min?: number;
  swim_pace_z3_max?: number;
  swim_pace_z4_min?: number;
  swim_pace_z4_max?: number;
  swim_pace_z5_min?: number;
  swim_pace_z5_max?: number;
  vo2max?: number;
  lactate_threshold_hr?: number;
  lt1_hr?: number;
  lactate_threshold_power_percent?: number;
  vam?: number;
  pam?: number;
  zone_system?: '5' | '7';
  zone_base_method?: string;
  zones5_hr_json?: Array<{ zone: number; name: string; min_bpm: number; max_bpm: number }> | null;
  zones5_power_json?: Array<{ zone: number; name: string; min_watts: number; max_watts: number }> | null;
  zones7_hr_json?: Array<{ zone: number; name: string; min_bpm: number; max_bpm: number }> | null;
  zones7_power_json?: Array<{ zone: number; name: string; min_watts: number; max_watts: number }> | null;
  source?: string;
  notes?: string;
  updated_at: string;
  created_at: string;
}

export interface HRZone {
  zone: number;
  name: string;
  min?: number;
  max?: number;
}

export interface PowerZone {
  zone: number;
  name: string;
  minPercent?: number;
  maxPercent?: number;
  minWatts?: number;
  maxWatts?: number;
}

export interface PaceZone {
  zone: number;
  name: string;
  minPacePerKm?: number;
  maxPacePerKm?: number;
}

export interface ATPPlan {
  id: string;
  athlete_id: string;
  plan_name: string;
  ca_start: number;
  al_start: number;
  tau_chronic: number;
  tau_acute: number;
  rb_min: number;
  rb_peak_target: number;
  ca_target_main_event: number;
  plan_start_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ATPEvent {
  id: string;
  plan_id: string;
  athlete_id: string;
  event_name: string;
  event_date: string;
  priority: 'A' | 'B' | 'C';
  notes?: string;
  created_at: string;
  updated_at: string;
}
