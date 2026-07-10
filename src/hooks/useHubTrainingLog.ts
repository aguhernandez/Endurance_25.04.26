import { useState, useCallback } from 'react';
import { hubGetTrainingLog, hubGetTrainingLogs, HubCompletedLog } from '../lib/hubApi';

export interface UseHubTrainingLogResult {
  logs: HubCompletedLog[];
  selectedLog: HubCompletedLog | null;
  loading: boolean;
  error: string | null;
  fetchByDateRange: (hubAthleteId: string, dateFrom: string, dateTo: string) => Promise<void>;
  fetchById: (hubAthleteId: string, logId: string) => Promise<void>;
  selectLog: (log: HubCompletedLog | null) => void;
  clear: () => void;
}

export function useHubTrainingLog(): UseHubTrainingLogResult {
  const [logs, setLogs] = useState<HubCompletedLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<HubCompletedLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByDateRange = useCallback(async (
    hubAthleteId: string,
    dateFrom: string,
    dateTo: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await hubGetTrainingLogs(hubAthleteId, dateFrom, dateTo);
      setLogs(data);
      setSelectedLog(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch training logs from Hub');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (
    hubAthleteId: string,
    logId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const log = await hubGetTrainingLog(hubAthleteId, logId);
      setSelectedLog(log);
      setLogs(prev => {
        const exists = prev.find(l => l.id === log.id);
        return exists ? prev.map(l => l.id === log.id ? log : l) : [log, ...prev];
      });
    } catch (err: any) {
      setError(err.message || 'Training log not found or access denied');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectLog = useCallback((log: HubCompletedLog | null) => {
    setSelectedLog(log);
  }, []);

  const clear = useCallback(() => {
    setLogs([]);
    setSelectedLog(null);
    setError(null);
  }, []);

  return { logs, selectedLog, loading, error, fetchByDateRange, fetchById, selectLog, clear };
}
