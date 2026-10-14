import { useState, useEffect, useCallback } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { hubGetCoachAthletes, hubGetAthleteProfile, HubCoachAthlete } from '../lib/hubApi';

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
        // Fallback: the coach's roster comes from the Hub-issued JWT
        // (assigned_athletes). Create stub profiles for Hub athletes that have
        // no local profile yet so they appear and their data can be pulled.
        if (assignedAthletes && assignedAthletes.length > 0) {
          const { data: localProfiles } = await supabase
            .from('profiles')
            .select('*')
            .in('hub_user_id', assignedAthletes);

          const existingMap = new Map((localProfiles || []).map(p => [p.hub_user_id, p]));
          const missing = assignedAthletes.filter(id => !existingMap.has(id));

          if (missing.length > 0) {
            // Try to enrich each unknown athlete with real name/email from Hub.
            // The athlete-profile endpoint may fail (Hub-side); fall back to a
            // readable placeholder so the athlete still appears in the list.
            const enriched = await Promise.all(
              missing.map(async id => {
                try {
                  const prof = await hubGetAthleteProfile(id);
                  const name = prof.athlete?.full_name;
                  return {
                    id,
                    hub_user_id: id,
                    email: name ? name.toLowerCase().replace(/\s+/g, '.') + '@hub.asciende.pro' : `atleta-${id.slice(0, 8)}@hub.asciende.pro`,
                    full_name: name || `Atleta Hub (${id.slice(0, 8)})`,
                    role: 'athlete' as const,
                  };
                } catch {
                  return {
                    id,
                    hub_user_id: id,
                    email: `atleta-${id.slice(0, 8)}@hub.asciende.pro`,
                    full_name: `Atleta Hub (${id.slice(0, 8)})`,
                    role: 'athlete' as const,
                  };
                }
              })
            );
            const { data: created, error: insertErr } = await supabase
              .from('profiles')
              .upsert(enriched, { onConflict: 'hub_user_id' })
              .select();

            if (insertErr) {
              console.warn('[useCoachAthletes] Error creating stub profiles:', insertErr);
            } else if (created) {
              for (const p of created) existingMap.set(p.hub_user_id, p);
            }
          }

          const result: Profile[] = [];
          for (const id of assignedAthletes) {
            const local = existingMap.get(id);
            if (local) result.push(local);
          }
          setAthletes(result);
        } else {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'athlete')
            .order('full_name');
          setAthletes(data || []);
        }
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
