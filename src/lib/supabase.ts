import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

const satelliteUrl = import.meta.env.VITE_SATELLITE_SUPABASE_URL;
const satelliteAnonKey = import.meta.env.VITE_SATELLITE_SUPABASE_ANON_KEY;

export const satelliteSupabase = satelliteUrl && satelliteAnonKey
  ? createClient(satelliteUrl, satelliteAnonKey)
  : supabase;

export type Profile = {
  id: string;
  hub_user_id: string;
  email: string;
  full_name: string | null;
  role: 'athlete' | 'coach' | 'admin';
  created_at: string;
  updated_at: string;
};

export type AthleteFTP = {
  athlete_id: string;
  current_ftp_watts: number;
  updated_at: string;
  updated_by: string | null;
};

export type TrainingSession = {
  id: string;
  athlete_id: string;
  sport: 'cycling' | 'running' | 'swimming';
  sport_subtype: string | null;
  session_date: string;
  session_name: string | null;
  planned_by_coach_id: string | null;
  status: 'planned' | 'completed';
  created_at: string;
  updated_at: string;
  duration_minutes: number;
  distance_km: number | null;
  avg_power_watts: number | null;
  avg_heart_rate: number | null;
  avg_pace_per_km: number | null;
  perceived_effort: number | null;
  fatigue_level: number | null;
  notes: string | null;
};

export type SessionWithProfile = TrainingSession & {
  athlete: Profile;
  planned_by_coach: Profile | null;
};

export type CyclingSession = TrainingSession;
