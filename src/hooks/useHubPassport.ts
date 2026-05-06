import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  hubGetAthleteProfile,
  hubGetBiologicalPassport,
  HubAthleteProfile,
  HubBiologicalPassport,
  HubPassportEntry,
} from '../lib/hubApi';

export interface PassportSnapshot {
  profile: HubAthleteProfile;
  passport: HubBiologicalPassport;
  fetchedAt: string;
}

export interface UseHubPassportResult {
  snapshot: PassportSnapshot | null;
  loading: boolean;
  error: string | null;
  fetchPassport: (hubAthleteId: string, localAthleteId: string, fallbackEmail?: string) => Promise<PassportSnapshot | null>;
}

function mapPassportToPhysiology(entry: HubPassportEntry, localAthleteId: string): Record<string, unknown> {
  const tz = entry.training_zones;
  const defaultDisplay = tz?.default_display ?? '5';

  const p: Record<string, unknown> = {
    athlete_id: localAthleteId,
    vo2max: entry.vo2max ?? null,
    lactate_threshold_hr: entry.lt2_hr ?? null,
    lt1_hr: entry.lt1_hr ?? null,
    vam: entry.vam ?? null,
    pam: entry.pam ?? null,
    source: entry.source ?? 'imported',
    notes: `Imported from Hub Biological Passport${entry.measurement_date ? ` (${entry.measurement_date})` : ''}`,
    zone_system: defaultDisplay,
    zone_base_method: tz?.base_method ?? null,
    updated_at: new Date().toISOString(),
  };

  if (entry.running_threshold_pace != null) {
    const pace = parseFloat(entry.running_threshold_pace);
    if (!isNaN(pace) && pace > 0) {
      p['run_vdot'] = pace;
    }
  }

  if (entry.lt2_power != null && entry.ftp_watts) {
    p['lactate_threshold_power_percent'] = Math.round((entry.lt2_power / entry.ftp_watts) * 100);
  }

  if (tz) {
    const hr5 = Array.isArray(tz.zones5?.hr) ? tz.zones5.hr : [];
    const pw5 = Array.isArray(tz.zones5?.power) ? tz.zones5.power : [];
    const hr7 = Array.isArray(tz.zones7?.hr) ? tz.zones7.hr : [];
    const pw7 = Array.isArray(tz.zones7?.power) ? tz.zones7.power : [];

    p['zones5_hr_json'] = hr5.length > 0 ? hr5 : null;
    p['zones5_power_json'] = pw5.length > 0 ? pw5 : null;
    p['zones7_hr_json'] = hr7.length > 0 ? hr7 : null;
    p['zones7_power_json'] = pw7.length > 0 ? pw7 : null;

    const activeHR = defaultDisplay === '7' ? hr7 : hr5;
    const activePower = defaultDisplay === '7' ? pw7 : pw5;

    if (activeHR.length > 0) {
      const sorted = [...activeHR].sort((a, b) => a.zone - b.zone);
      sorted.forEach(z => {
        p[`hr_z${z.zone}_min`] = z.min_bpm;
        p[`hr_z${z.zone}_max`] = z.max_bpm;
      });
      const allMax = sorted.map(z => z.max_bpm).filter(v => v != null && v > 0);
      if (allMax.length > 0) p['hr_max'] = Math.max(...allMax);
    }

    if (activePower.length > 0 && entry.ftp_watts) {
      activePower.forEach(z => {
        p[`power_z${z.zone}_min`] = Math.round((z.min_watts / entry.ftp_watts!) * 100);
        p[`power_z${z.zone}_max`] = Math.round((z.max_watts / entry.ftp_watts!) * 100);
      });
    }
  } else {
    const hrZones = entry.hr_zones_json;
    if (hrZones && hrZones.length > 0) {
      const sorted = [...hrZones].sort((a, b) => a.zone - b.zone);
      sorted.forEach(z => {
        p[`hr_z${z.zone}_min`] = z.min_bpm;
        p[`hr_z${z.zone}_max`] = z.max_bpm;
      });
      const allMax = sorted.map(z => z.max_bpm).filter(v => v != null && v > 0);
      if (allMax.length > 0) p['hr_max'] = Math.max(...allMax);
    }

    const powerZones = entry.power_zones_json;
    if (powerZones && powerZones.length > 0 && entry.ftp_watts) {
      powerZones.forEach(z => {
        p[`power_z${z.zone}_min`] = Math.round((z.min_watts / entry.ftp_watts!) * 100);
        p[`power_z${z.zone}_max`] = Math.round((z.max_watts / entry.ftp_watts!) * 100);
      });
    }
  }

  return p;
}

export function useHubPassport(): UseHubPassportResult {
  const [snapshot, setSnapshot] = useState<PassportSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPassport = useCallback(async (
    hubAthleteId: string,
    localAthleteId: string,
    fallbackEmail?: string
  ): Promise<PassportSnapshot | null> => {
    setLoading(true);
    setError(null);

    try {
      const [profile, passport] = await Promise.all([
        hubGetAthleteProfile(hubAthleteId, fallbackEmail),
        hubGetBiologicalPassport(hubAthleteId, fallbackEmail),
      ]);

      const result: PassportSnapshot = {
        profile,
        passport,
        fetchedAt: new Date().toISOString(),
      };

      setSnapshot(result);

      const entry = passport.active_passport;
      const physiology = mapPassportToPhysiology(entry, localAthleteId);
      const { error: upsertError } = await supabase
        .from('athlete_physiology')
        .upsert(physiology, { onConflict: 'athlete_id' });

      if (upsertError) {
        console.warn('[HubPassport] Could not sync physiology to local DB:', upsertError.message);
      }

      if (entry.ftp_watts) {
        await supabase
          .from('athlete_ftp')
          .upsert(
            { athlete_id: localAthleteId, current_ftp_watts: entry.ftp_watts },
            { onConflict: 'athlete_id' }
          );
      }

      return result;
    } catch (err: any) {
      const raw = err.message || '';
      const msg = raw.includes('404') || raw.toLowerCase().includes('not found')
        ? 'Este atleta no tiene perfil en el Hub. El coach debe crear el perfil en la plataforma Hub antes de poder sincronizar el pasaporte biologico.'
        : raw || 'Error al obtener el Pasaporte Biologico del Hub';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { snapshot, loading, error, fetchPassport };
}
