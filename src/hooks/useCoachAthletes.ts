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
      // Fetch roster from Hub
      let hubAthletes: HubCoachAthlete[] = [];
      try {
        hubAthletes = await hubGetCoachAthletes(coachHubId!);
      } catch (err) {
        console.warn('[useCoachAthletes] Hub fetch failed, falling back to local:', err);
      }

      if (hubAthletes.length > 0) {
        // Get existing local profiles for these athletes
        const hubIds = hubAthletes.map(a => a.id);
        const { data: localProfiles } = await supabase
          .from('profiles')
          .select('*')
          .in('hub_user_id', hubIds);

        const existingMap = new Map((localProfiles || []).map(p => [p.hub_user_id, p]));

        // Create stubs for athletes not yet in local DB
        const missingAthletes = hubAthletes.filter(a => !existingMap.has(a.id));

        if (missingAthletes.length > 0) {
          const toInsert = missingAthletes.map(a => ({
            id: a.id,
            hub_user_id: a.id,
            email: a.email,
            full_name: a.full_name || a.email,
            role: 'athlete' as const,
          }));

          const { data: created, error: insertErr } = await supabase
            .from('profiles')
            .upsert(toInsert, { onConflict: 'hub_user_id' })
            .select();

          if (insertErr) {
            console.warn('[useCoachAthletes] Error creating stub profiles:', insertErr);
          } else if (created) {
            for (const p of created) {
              existingMap.set(p.hub_user_id, p);
            }
          }
        }

        // Build final list preserving Hub order
        const result: Profile[] = [];
        for (const ha of hubAthletes) {
          const local = existingMap.get(ha.id);
          if (local) {
            // Update name if Hub has a better one
            if (ha.full_name && local.full_name === local.email && ha.full_name !== local.email) {
              local.full_name = ha.full_name;
            }
            result.push(local);
          }
        }

        setAthletes(result);
      } else {
        // Fallback: use assigned_athletes from JWT to query local profiles
        let query = supabase.from('profiles').select('*').eq('role', 'athlete').order('full_name');
        if (assignedAthletes && assignedAthletes.length > 0) {
          query = query.in('hub_user_id', assignedAthletes);
        }
        const { data } = await query;
        setAthletes(data || []);
      }
    } catch (err: any) {
      console.error('[useCoachAthletes] Error:', err);
      setError(err.message || 'Failed to load athletes');
    } finally {
      setLoading(false);
    }
  }

  return { athletes, loading, error, refresh };
}
