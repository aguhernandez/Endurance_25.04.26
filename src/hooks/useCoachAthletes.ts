import { useState, useEffect, useCallback } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { hubGetCoachAthletes, HubCoachAthlete } from '../lib/hubApi';

interface UseCoachAthletesResult {
  athletes: Profile[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useCoachAthletes(
  coachHubId: string | undefined,
  assignedAthletes: string[] | undefined
): UseCoachAthletesResult {
  const [athletes, setAthletes] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refresh = useCallback(() => setTrigger(t => t + 1), []);

  useEffect(() => {
    if (!coachHubId) {
      setLoading(false);
      return;
    }
    loadAthletes();
  }, [coachHubId, trigger]);

  async function loadAthletes() {
    setLoading(true);
    setError(null);

    try {
      const athleteIds = new Set<string>();
      const hubAthleteMap = new Map<string, HubCoachAthlete>();

      // Source 1: Hub coach-athletes endpoint (may work in the future)
      let hubAthletes: HubCoachAthlete[] = [];
      try {
        hubAthletes = await hubGetCoachAthletes(coachHubId!);
        for (const a of hubAthletes) {
          athleteIds.add(a.id);
          hubAthleteMap.set(a.id, a);
        }
      } catch (err) {
        console.warn('[useCoachAthletes] Hub fetch failed:', err);
      }

      // Source 2: assigned_athletes from JWT
      if (assignedAthletes && assignedAthletes.length > 0) {
        for (const id of assignedAthletes) {
          athleteIds.add(id);
        }
      }

      // Source 3: workouts table — find all athletes this coach has scheduled
      const coachProfile = await supabase
        .from('profiles')
        .select('id')
        .eq('hub_user_id', coachHubId!)
        .maybeSingle();

      if (coachProfile.data?.id) {
        const { data: workoutAthletes } = await supabase
          .from('workouts')
          .select('athlete_id')
          .eq('coach_id', coachProfile.data.id)
          .not('athlete_id', 'is', null);

        for (const w of workoutAthletes || []) {
          if (w.athlete_id) athleteIds.add(w.athlete_id);
        }
      }



      if (athleteIds.size === 0) {
        // Last resort: load all athlete profiles
        const { data: allAthletes } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'athlete')
          .order('full_name');
        setAthletes(allAthletes || []);
        return;
      }

      const idsArray = Array.from(athleteIds);

      // Fetch existing profiles — query by hub_user_id first, then by id for any not found
      const { data: byHubId } = await supabase
        .from('profiles')
        .select('*')
        .in('hub_user_id', idsArray);

      const foundIds = new Set((byHubId || []).map(p => p.hub_user_id || p.id));
      const remainingIds = idsArray.filter(id => !foundIds.has(id));

      let byId: Profile[] = [];
      if (remainingIds.length > 0) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .in('id', remainingIds);
        byId = data || [];
      }

      const localProfiles = [...(byHubId || []), ...byId];

      const existingMap = new Map<string, Profile>();
      for (const p of localProfiles) {
        const key = p.hub_user_id || p.id;
        if (key) existingMap.set(key, p);
      }

      const missingIds = idsArray.filter(id => !existingMap.has(id));
      const uniqueMissing = [...new Set(missingIds)];

      if (uniqueMissing.length > 0) {
        const toInsert = uniqueMissing.map(id => {
          const hubAthlete = hubAthleteMap.get(id);
          return {
            id,
            hub_user_id: id,
            email: hubAthlete?.email || `unknown-${id.slice(0, 8)}@hub`,
            full_name: hubAthlete?.full_name || hubAthlete?.email || `Athlete ${id.slice(0, 8)}`,
            role: 'athlete' as const,
          };
        });

        const { data: created, error: insertErr } = await supabase
          .from('profiles')
          .upsert(toInsert, { onConflict: 'hub_user_id' })
          .select();

        if (insertErr) {
          console.warn('[useCoachAthletes] Error creating stub profiles:', insertErr);
        } else if (created) {
          for (const p of created) {
            const key = p.hub_user_id || p.id;
            if (key) existingMap.set(key, p);
          }
        }
      }

      // Build final list preserving discovery order
      const result: Profile[] = [];
      for (const id of idsArray) {
        const local = existingMap.get(id);
        if (local) {
          const hubAthlete = hubAthleteMap.get(id);
          if (hubAthlete?.full_name && local.full_name === local.email && hubAthlete.full_name !== local.email) {
            local.full_name = hubAthlete.full_name;
          }
          result.push(local);
        }
      }

      // Deduplicate by profile id
      const seen = new Set<string>();
      const deduped = result.filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });

      setAthletes(deduped);
    } catch (err: any) {
      console.error('[useCoachAthletes] Error:', err);
      setError(err.message || 'Failed to load athletes');
    } finally {
      setLoading(false);
    }
  }

  return { athletes, loading, error, refresh };
}
