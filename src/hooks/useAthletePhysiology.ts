import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AthletePhysiology, HRZone, PowerZone, PaceZone } from '../types/workout';

const HR_ZONE_NAMES_5 = ['Z1 Recovery', 'Z2 Aerobic Base', 'Z3 Tempo', 'Z4 Threshold', 'Z5 VO2max'];
const HR_ZONE_NAMES_7 = ['Z1 Recovery', 'Z2 Aerobic Base', 'Z3 Tempo', 'Z4 SubThreshold', 'Z5 Threshold', 'Z6 VO2max', 'Z7 Neuromuscular'];
const POWER_ZONE_NAMES_5 = ['Z1 Recovery', 'Z2 Endurance', 'Z3 Tempo', 'Z4 Threshold', 'Z5 VO2max'];
const POWER_ZONE_NAMES_7 = ['Z1 Recovery', 'Z2 Endurance', 'Z3 Tempo', 'Z4 SubThreshold', 'Z5 Threshold', 'Z6 VO2max', 'Z7 Neuromuscular'];
const RUN_ZONE_NAMES = ['Z1 Recovery', 'Z2 Aerobic', 'Z3 Tempo', 'Z4 Threshold', 'Z5 Speed'];
const SWIM_ZONE_NAMES = ['Z1 Easy', 'Z2 Aerobic', 'Z3 Tempo', 'Z4 Threshold', 'Z5 Speed'];

export function extractHRZones(physiology: AthletePhysiology | null, zoneSystemOverride?: '5' | '7'): HRZone[] {
  if (!physiology) return [];
  const system = zoneSystemOverride ?? physiology.zone_system ?? '5';

  if (system === '7' && physiology.zones7_hr_json && physiology.zones7_hr_json.length > 0) {
    return physiology.zones7_hr_json
      .sort((a, b) => a.zone - b.zone)
      .map((z, i) => ({ zone: z.zone, name: z.name || HR_ZONE_NAMES_7[i] || `Z${z.zone}`, min: z.min_bpm, max: z.max_bpm }));
  }
  if (system === '5' && physiology.zones5_hr_json && physiology.zones5_hr_json.length > 0) {
    return physiology.zones5_hr_json
      .sort((a, b) => a.zone - b.zone)
      .map((z, i) => ({ zone: z.zone, name: z.name || HR_ZONE_NAMES_5[i] || `Z${z.zone}`, min: z.min_bpm, max: z.max_bpm }));
  }

  const maxZones = system === '7' ? 7 : 7;
  const zoneNames = system === '7' ? HR_ZONE_NAMES_7 : HR_ZONE_NAMES_5;
  const zones: HRZone[] = [];
  for (let i = 1; i <= maxZones; i++) {
    const min = physiology[`hr_z${i}_min` as keyof AthletePhysiology] as number | undefined;
    const max = physiology[`hr_z${i}_max` as keyof AthletePhysiology] as number | undefined;
    if (min !== undefined || max !== undefined) {
      zones.push({ zone: i, name: zoneNames[i - 1] || `Z${i}`, min, max });
    }
  }
  return zones;
}

export function extractPowerZones(physiology: AthletePhysiology | null, ftp: number | null, zoneSystemOverride?: '5' | '7'): PowerZone[] {
  if (!physiology) return [];
  const system = zoneSystemOverride ?? physiology.zone_system ?? '5';

  if (system === '7' && physiology.zones7_power_json && physiology.zones7_power_json.length > 0 && ftp) {
    return physiology.zones7_power_json
      .sort((a, b) => a.zone - b.zone)
      .map((z, i) => ({
        zone: z.zone,
        name: z.name || POWER_ZONE_NAMES_7[i] || `Z${z.zone}`,
        minPercent: Math.round((z.min_watts / ftp) * 100),
        maxPercent: Math.round((z.max_watts / ftp) * 100),
        minWatts: z.min_watts,
        maxWatts: z.max_watts,
      }));
  }
  if (system === '5' && physiology.zones5_power_json && physiology.zones5_power_json.length > 0 && ftp) {
    return physiology.zones5_power_json
      .sort((a, b) => a.zone - b.zone)
      .map((z, i) => ({
        zone: z.zone,
        name: z.name || POWER_ZONE_NAMES_5[i] || `Z${z.zone}`,
        minPercent: Math.round((z.min_watts / ftp) * 100),
        maxPercent: Math.round((z.max_watts / ftp) * 100),
        minWatts: z.min_watts,
        maxWatts: z.max_watts,
      }));
  }

  const maxZones = system === '7' ? 7 : 5;
  const zoneNames = system === '7' ? POWER_ZONE_NAMES_7 : POWER_ZONE_NAMES_5;
  const zones: PowerZone[] = [];
  for (let i = 1; i <= maxZones; i++) {
    const minPercent = physiology[`power_z${i}_min` as keyof AthletePhysiology] as number | undefined;
    const maxPercent = physiology[`power_z${i}_max` as keyof AthletePhysiology] as number | undefined;
    if (minPercent !== undefined || maxPercent !== undefined) {
      zones.push({
        zone: i,
        name: zoneNames[i - 1] || `Z${i}`,
        minPercent,
        maxPercent,
        minWatts: ftp && minPercent ? Math.round(ftp * minPercent / 100) : undefined,
        maxWatts: ftp && maxPercent ? Math.round(ftp * maxPercent / 100) : undefined,
      });
    }
  }
  return zones;
}

export function extractRunPaceZones(physiology: AthletePhysiology | null): PaceZone[] {
  if (!physiology) return [];
  const zones: PaceZone[] = [];
  for (let i = 1; i <= 5; i++) {
    const min = physiology[`run_pace_z${i}_min` as keyof AthletePhysiology] as number | undefined;
    const max = physiology[`run_pace_z${i}_max` as keyof AthletePhysiology] as number | undefined;
    if (min !== undefined || max !== undefined) {
      zones.push({ zone: i, name: RUN_ZONE_NAMES[i - 1], minPacePerKm: min, maxPacePerKm: max });
    }
  }
  return zones;
}

export function extractSwimPaceZones(physiology: AthletePhysiology | null): PaceZone[] {
  if (!physiology) return [];
  const zones: PaceZone[] = [];
  for (let i = 1; i <= 5; i++) {
    const min = physiology[`swim_pace_z${i}_min` as keyof AthletePhysiology] as number | undefined;
    const max = physiology[`swim_pace_z${i}_max` as keyof AthletePhysiology] as number | undefined;
    if (min !== undefined || max !== undefined) {
      zones.push({ zone: i, name: SWIM_ZONE_NAMES[i - 1], minPacePerKm: min, maxPacePerKm: max });
    }
  }
  return zones;
}

export function getDefaultHRZones(hrMax: number | null, hrRest: number | null = 60): HRZone[] {
  if (!hrMax) return [];
  const rest = hrRest ?? 60;
  const hrr = hrMax - rest;
  const karvonen = (pct: number) => Math.round(rest + hrr * pct);
  return [
    { zone: 1, name: 'Z1 Recovery',   min: 0,              max: karvonen(0.50) },
    { zone: 2, name: 'Z2 Aerobic Base', min: karvonen(0.50), max: karvonen(0.60) },
    { zone: 3, name: 'Z3 Tempo',       min: karvonen(0.60), max: karvonen(0.70) },
    { zone: 4, name: 'Z4 Threshold',   min: karvonen(0.70), max: karvonen(0.85) },
    { zone: 5, name: 'Z5 VO2max',      min: karvonen(0.85), max: hrMax },
  ];
}

export function getDefaultPowerZones(ftp: number | null): PowerZone[] {
  if (!ftp) return [];
  return [
    { zone: 1, name: 'Z1 Recovery', minPercent: 0, maxPercent: 55, minWatts: 0, maxWatts: Math.round(ftp * 0.55) },
    { zone: 2, name: 'Z2 Endurance', minPercent: 55, maxPercent: 75, minWatts: Math.round(ftp * 0.55), maxWatts: Math.round(ftp * 0.75) },
    { zone: 3, name: 'Z3 Tempo', minPercent: 75, maxPercent: 90, minWatts: Math.round(ftp * 0.75), maxWatts: Math.round(ftp * 0.90) },
    { zone: 4, name: 'Z4 Threshold', minPercent: 90, maxPercent: 105, minWatts: Math.round(ftp * 0.90), maxWatts: Math.round(ftp * 1.05) },
    { zone: 5, name: 'Z5 VO2max', minPercent: 105, maxPercent: 150, minWatts: Math.round(ftp * 1.05), maxWatts: Math.round(ftp * 1.50) },
  ];
}

export function useAthletePhysiology(athleteId: string | null | undefined) {
  const [physiology, setPhysiology] = useState<AthletePhysiology | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (athleteId) {
      fetchPhysiology(athleteId);
    } else {
      setPhysiology(null);
    }
  }, [athleteId]);

  async function fetchPhysiology(id: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('athlete_physiology')
        .select('*')
        .eq('athlete_id', id)
        .maybeSingle();

      if (error) throw error;
      setPhysiology(data || null);
    } catch (err) {
      console.error('Error loading physiology:', err);
      setPhysiology(null);
    } finally {
      setLoading(false);
    }
  }

  return { physiology, loading, refetch: () => athleteId ? fetchPhysiology(athleteId) : undefined };
}
