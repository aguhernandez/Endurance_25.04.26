import { useState, useCallback } from 'react';
import { hubGetTrainingSchedule, HubTrainingSchedule } from '../lib/hubApi';

export interface UseHubScheduleResult {
  schedule: HubTrainingSchedule | null;
  loading: boolean;
  error: string | null;
  fetchSchedule: (hubAthleteId: string, dateFrom: string, dateTo: string) => Promise<HubTrainingSchedule | null>;
}

export function useHubSchedule(): UseHubScheduleResult {
  const [schedule, setSchedule] = useState<HubTrainingSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async (
    hubAthleteId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<HubTrainingSchedule | null> => {
    setLoading(true);
    setError(null);

    try {
      const data = await hubGetTrainingSchedule(hubAthleteId, dateFrom, dateTo);
      setSchedule(data);
      return data;
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch Hub training schedule';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { schedule, loading, error, fetchSchedule };
}
