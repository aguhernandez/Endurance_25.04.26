export interface GpsPoint {
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

export interface Split {
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

export interface ZoneDistribution {
  zone: number;
  name: string;
  color?: string;
  actual_percent?: number | null;
  actual_seconds?: number | null;
  within_target?: boolean | null;
}

export interface ActivityLogEntry {
  timestamp?: string;
  type?: 'lap' | 'segment' | 'note' | 'event';
  label?: string;
  value?: string | null;
  duration_s?: number | null;
  avg_hr?: number | null;
  avg_power?: number | null;
  avg_speed?: number | null;
}

export interface WorkoutData {
  id: string;
  name?: string;
  date?: string;
  sport?: string;
  distance?: number;
  duration?: number;
  duration_seconds?: number;
  distance_km?: number;
  map?: GpsPoint[];
  gps_track?: GpsPoint[];
  pace?: number[];
  pace_sec_per_km?: number[];
  splits?: Split[];
  heartRate?: number[];
  heart_rate?: number[];
  cadence?: number[];
  cadence_rpm?: number[];
  watts?: number[];
  power_watts?: number[];
  elevation?: number[];
  elevation_m?: number[];
  altitude?: number[];
  summary?: Record<string, number | string | null>;
  zone_distribution?: ZoneDistribution[];
  activity_log?: ActivityLogEntry[];
  // Hub completion fields
  actual_duration_minutes?: number | null;
  actual_distance_km?: number | null;
  actual_avg_hr?: number | null;
  actual_max_hr?: number | null;
  actual_avg_power_watts?: number | null;
  actual_max_power_watts?: number | null;
  actual_avg_cadence?: number | null;
  actual_avg_speed_kmh?: number | null;
  actual_elevation_gain_m?: number | null;
  actual_elevation_loss_m?: number | null;
  actual_calories?: number | null;
  actual_tss?: number | null;
  actual_impulse?: number | null;
  rpe?: number | null;
  compliance_percent?: number | null;
  athlete_notes?: string | null;
  athlete_feedback?: string | null;
  athlete_feeling?: string | null;
  coach_notes?: string | null;
  normalized_power_watts?: number | null;
  lap_count?: number | null;
  [key: string]: unknown;
}
