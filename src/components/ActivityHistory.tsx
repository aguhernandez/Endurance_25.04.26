import { useEffect, useState } from 'react';
import { getActivityRecords } from '../hooks/useHubSync';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Calendar, Clock, Zap, Heart, TrendingUp, RefreshCw } from 'lucide-react';

interface ActivityRecord {
  id: string;
  athlete_id: string;
  source_satellite: string;
  sport: string;
  activity_date: string;
  activity_name?: string;
  duration_seconds: number;
  distance_meters?: number;
  avg_power_watts?: number;
  normalized_power_watts?: number;
  training_stress_score?: number;
  avg_heart_rate_bpm?: number;
  avg_pace_sec_per_km?: number;
  avg_speed_kmh?: number;
  perceived_effort?: number;
  fatigue_level?: number;
  impulse?: number;
  notes?: string;
  created_at: string;
}

const SPORT_ICONS: Record<string, string> = {
  cycling: '🚴',
  running: '🏃',
  swimming: '🏊',
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, '0')} /km`;
}

function formatDistance(meters: number, sport: string): string {
  if (sport === 'swimming') {
    return meters >= 1000
      ? `${(meters / 1000).toFixed(2)} km`
      : `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

function getEffortColor(rpe?: number): string {
  if (!rpe) return 'bg-gray-100 text-gray-600';
  if (rpe <= 3) return 'bg-green-100 text-green-700';
  if (rpe <= 5) return 'bg-blue-100 text-blue-700';
  if (rpe <= 7) return 'bg-yellow-100 text-yellow-700';
  if (rpe <= 9) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
}

function getImpulseColor(impulse?: number): string {
  if (!impulse) return 'text-gray-400';
  if (impulse < 50) return 'text-green-600';
  if (impulse < 100) return 'text-blue-600';
  if (impulse < 150) return 'text-yellow-600';
  if (impulse < 200) return 'text-orange-600';
  return 'text-red-600';
}

export default function ActivityHistory() {
  const { profile } = useAuth();
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (profile?.hub_user_id) {
      loadRecords();
    }
  }, [profile?.hub_user_id]);

  async function loadRecords() {
    if (!profile?.hub_user_id) return;
    setLoading(true);
    try {
      const data = await getActivityRecords(profile.hub_user_id, 30);
      setRecords(data as ActivityRecord[]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    if (!profile?.hub_user_id) return;
    setRefreshing(true);
    try {
      const data = await getActivityRecords(profile.hub_user_id, 30);
      setRecords(data as ActivityRecord[]);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Loading activity history...</div>
      </div>
    );
  }

  const totalImpulse = records.reduce((sum, r) => sum + (r.impulse ?? 0), 0);
  const totalDuration = records.reduce((sum, r) => sum + r.duration_seconds, 0);
  const avgEffort = records.filter(r => r.perceived_effort).length > 0
    ? Math.round(records.reduce((sum, r) => sum + (r.perceived_effort ?? 0), 0) / records.filter(r => r.perceived_effort).length * 10) / 10
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-primary-purple dark:text-white">Activity History</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Synced to Planner</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-purple dark:hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {records.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Activities</p>
            <p className="text-2xl font-bold text-primary-purple dark:text-white">{records.length}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Time</p>
            <p className="text-2xl font-bold text-primary-purple dark:text-white">{formatDuration(totalDuration)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Load</p>
            <p className={`text-2xl font-bold ${getImpulseColor(totalImpulse)}`}>{Math.round(totalImpulse)}</p>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No activities synced yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Log a session and it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-yellow-300 dark:hover:border-yellow-500/50 transition bg-white dark:bg-gray-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-2xl flex-shrink-0">
                    {SPORT_ICONS[record.sport] ?? '🏅'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {record.activity_name || `${record.sport.charAt(0).toUpperCase() + record.sport.slice(1)} Session`}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <Calendar size={11} />
                      <span>
                        {new Date(record.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {record.perceived_effort && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getEffortColor(record.perceived_effort)}`}>
                      RPE {record.perceived_effort}
                    </span>
                  )}
                  {record.impulse != null && record.impulse > 0 && (
                    <span className={`text-xs font-bold ${getImpulseColor(record.impulse)}`}>
                      {Math.round(record.impulse)} load
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {formatDuration(record.duration_seconds)}
                </span>

                {record.distance_meters != null && record.distance_meters > 0 && (
                  <span className="flex items-center gap-1">
                    <Activity size={11} />
                    {formatDistance(record.distance_meters, record.sport)}
                  </span>
                )}

                {record.avg_power_watts && (
                  <span className="flex items-center gap-1">
                    <Zap size={11} />
                    {record.avg_power_watts}W
                    {record.normalized_power_watts && <span className="text-gray-400">(NP {record.normalized_power_watts}W)</span>}
                  </span>
                )}

                {record.training_stress_score != null && (
                  <span className="flex items-center gap-1">
                    <TrendingUp size={11} />
                    TSS {Math.round(record.training_stress_score)}
                  </span>
                )}

                {record.avg_heart_rate_bpm && (
                  <span className="flex items-center gap-1">
                    <Heart size={11} />
                    {record.avg_heart_rate_bpm} bpm
                  </span>
                )}

                {record.avg_pace_sec_per_km && record.sport !== 'cycling' && (
                  <span className="flex items-center gap-1">
                    <TrendingUp size={11} />
                    {formatPace(record.avg_pace_sec_per_km)}
                  </span>
                )}

                {record.avg_speed_kmh && record.sport === 'cycling' && (
                  <span className="flex items-center gap-1">
                    <TrendingUp size={11} />
                    {record.avg_speed_kmh.toFixed(1)} km/h
                  </span>
                )}
              </div>

              {record.notes && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-2">
                  {record.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {records.length > 0 && avgEffort && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
          Average perceived effort: {avgEffort}/10 across last {records.length} activities
        </p>
      )}
    </div>
  );
}
