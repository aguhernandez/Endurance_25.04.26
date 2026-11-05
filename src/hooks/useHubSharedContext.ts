import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  hubGetAvailability,
  hubGetSharedEvents,
  hubUpsertAvailability,
  hubUpsertSharedEvent,
  HubAvailabilityWindow,
  HubSharedEvent,
} from '../lib/hubApi';

async function getHubAthleteId(localAthleteId: string): Promise<string> {
  const { data, error } = await supabase.from('profiles').select('hub_user_id').eq('id', localAthleteId).maybeSingle();
  if (error || !data?.hub_user_id) throw new Error('Athlete is not linked to Hub');
  return data.hub_user_id;
}

export interface HubSharedContextResult {
  events: HubSharedEvent[];
  availability: HubAvailabilityWindow[];
  loading: boolean;
  error: string | null;
  refresh: (athleteId: string) => Promise<void>;
  upsertEvent: (athleteId: string, event: Parameters<typeof hubUpsertSharedEvent>[1]) => Promise<HubSharedEvent>;
  upsertAvailability: (athleteId: string, availability: Parameters<typeof hubUpsertAvailability>[1]) => Promise<HubAvailabilityWindow>;
}

/**
 * Read-only shared planning context owned by Hub.
 * Endurance's ATP and load engines remain local; this hook only supplies
 * objectives/events and availability for planners that opt into the contract.
 */
export function useHubSharedContext(): HubSharedContextResult {
  const [events, setEvents] = useState<HubSharedEvent[]>([]);
  const [availability, setAvailability] = useState<HubAvailabilityWindow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (athleteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const hubAthleteId = await getHubAthleteId(athleteId);
      const [nextEvents, nextAvailability] = await Promise.all([
        hubGetSharedEvents(hubAthleteId),
        hubGetAvailability(hubAthleteId),
      ]);
      setEvents(nextEvents);
      setAvailability(nextAvailability);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cargar el contexto compartido del Hub');
    } finally {
      setLoading(false);
    }
  }, []);

  const upsertEvent = useCallback(async (
    athleteId: string,
    event: Parameters<typeof hubUpsertSharedEvent>[1]
  ) => {
    const saved = await hubUpsertSharedEvent(await getHubAthleteId(athleteId), event);
    setEvents(previous => {
      const withoutSaved = previous.filter(item => item.id !== saved.id);
      return [...withoutSaved, saved].sort((a, b) => (a.event_date || '9999-12-31').localeCompare(b.event_date || '9999-12-31'));
    });
    return saved;
  }, []);

  const upsertAvailability = useCallback(async (
    athleteId: string,
    availability: Parameters<typeof hubUpsertAvailability>[1]
  ) => {
    const saved = await hubUpsertAvailability(await getHubAthleteId(athleteId), availability);
    setAvailability(previous => {
      const withoutSaved = previous.filter(item => item.id !== saved.id);
      return [...withoutSaved, saved];
    });
    return saved;
  }, []);

  return { events, availability, loading, error, refresh, upsertEvent, upsertAvailability };
}
