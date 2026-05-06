import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { Sport } from '../types/workout';
import { getSportIcon, getSportLabel } from '../lib/calculations';
import { pushActivityRecord } from '../hooks/useHubSync';
import { triggerWorkoutAnalysis, buildAnalysisInput } from '../hooks/useWorkoutAnalysis';

interface CompleteSessionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SPORTS: Sport[] = ['cycling', 'running', 'swimming'];

export default function CompleteSessionModal({ onClose, onSuccess }: CompleteSessionModalProps) {
  const { profile } = useAuth();
  const [sport, setSport] = useState<Sport>('cycling');
  const [formData, setFormData] = useState({
    session_name: '',
    session_date: new Date().toISOString().split('T')[0],
    duration_minutes: '',
    distance_km: '',
    avg_power_watts: '',
    avg_heart_rate: '',
    avg_pace_min: '',
    avg_pace_sec: '',
    perceived_effort: '5',
    fatigue_level: '5',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hubSyncStatus, setHubSyncStatus] = useState<'idle' | 'synced' | 'failed'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let avg_pace_per_km: number | null = null;
      if ((sport === 'running' || sport === 'swimming') && formData.avg_pace_min) {
        const mins = parseInt(formData.avg_pace_min) || 0;
        const secs = parseInt(formData.avg_pace_sec) || 0;
        avg_pace_per_km = mins * 60 + secs;
      }

      const { error: insertError } = await supabase
        .from('training_sessions')
        .insert({
          athlete_id: profile?.id,
          sport,
          session_name: formData.session_name || null,
          session_date: formData.session_date,
          duration_minutes: parseInt(formData.duration_minutes),
          distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
          avg_power_watts: sport === 'cycling' && formData.avg_power_watts ? parseInt(formData.avg_power_watts) : null,
          avg_heart_rate: formData.avg_heart_rate ? parseInt(formData.avg_heart_rate) : null,
          avg_pace_per_km,
          perceived_effort: parseInt(formData.perceived_effort),
          fatigue_level: parseInt(formData.fatigue_level),
          notes: formData.notes || null,
          status: 'completed'
        });

      if (insertError) throw insertError;

      const distanceMeters = formData.distance_km
        ? parseFloat(formData.distance_km) * (sport === 'swimming' ? 1 : 1000)
        : undefined;

      const avgSpeedKmh = formData.distance_km && formData.duration_minutes
        ? (parseFloat(formData.distance_km) / (parseInt(formData.duration_minutes) / 60))
        : undefined;

      const hubResult = await pushActivityRecord({
        athlete_id: profile!.hub_user_id,
        sport,
        activity_date: formData.session_date,
        activity_name: formData.session_name || undefined,
        duration_seconds: parseInt(formData.duration_minutes) * 60,
        distance_meters: distanceMeters,
        avg_power_watts: sport === 'cycling' && formData.avg_power_watts ? parseInt(formData.avg_power_watts) : undefined,
        avg_heart_rate_bpm: formData.avg_heart_rate ? parseInt(formData.avg_heart_rate) : undefined,
        avg_pace_sec_per_km: avg_pace_per_km ?? undefined,
        avg_speed_kmh: avgSpeedKmh,
        perceived_effort: parseInt(formData.perceived_effort),
        fatigue_level: parseInt(formData.fatigue_level),
        notes: formData.notes || undefined,
      });

      setHubSyncStatus(hubResult.success ? 'synced' : 'failed');

      if (profile?.id) {
        const analysisInput = buildAnalysisInput({
          athleteId: profile.id,
          workoutId: null,
          sport,
          sessionDate: formData.session_date,
          plannedDurationMinutes: null,
          actualDurationMinutes: parseInt(formData.duration_minutes),
          plannedImpulse: null,
          avgPowerWatts: sport === 'cycling' && formData.avg_power_watts ? parseInt(formData.avg_power_watts) : null,
          avgPacePerKm: avg_pace_per_km,
          avgHeartRate: formData.avg_heart_rate ? parseInt(formData.avg_heart_rate) : null,
          perceivedEffort: parseInt(formData.perceived_effort),
          wellness: {
            perceived_effort: parseInt(formData.perceived_effort),
            fatigue_level: parseInt(formData.fatigue_level),
            notes: formData.notes || null,
          },
        });
        triggerWorkoutAnalysis(analysisInput).catch(err =>
          console.warn('Analysis trigger failed (non-blocking):', err)
        );
      }

      setTimeout(() => {
        onSuccess();
      }, hubResult.success ? 800 : 0);
    } catch (err: any) {
      setError(err.message || 'Failed to log session');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#514163]">Log Session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
            <div className="flex gap-3">
              {SPORTS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSport(s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium transition ${
                    sport === s
                      ? 'border-[#fdda36] bg-yellow-50 text-[#514163]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span>{getSportIcon(s)}</span>
                  {getSportLabel(s)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
              <input
                type="text"
                value={formData.session_name}
                onChange={(e) => setFormData({ ...formData, session_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
                placeholder={`e.g., Morning ${getSportLabel(sport)}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.session_date}
                onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (min) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
                placeholder="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance {sport === 'swimming' ? '(m)' : '(km)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.distance_km}
                onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
                placeholder={sport === 'swimming' ? '1500' : '10.0'}
              />
            </div>

            {sport === 'cycling' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avg Power (watts)</label>
                <input
                  type="number"
                  value={formData.avg_power_watts}
                  onChange={(e) => setFormData({ ...formData, avg_power_watts: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
                  placeholder="200"
                />
              </div>
            )}

            {(sport === 'running' || sport === 'swimming') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avg Pace ({sport === 'running' ? 'min:sec /km' : 'min:sec /100m'})
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.avg_pace_min}
                    onChange={(e) => setFormData({ ...formData, avg_pace_min: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
                    placeholder="5"
                  />
                  <span className="text-gray-500 font-medium">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.avg_pace_sec}
                    onChange={(e) => setFormData({ ...formData, avg_pace_sec: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
                    placeholder="30"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avg Heart Rate (bpm)</label>
              <input
                type="number"
                value={formData.avg_heart_rate}
                onChange={(e) => setFormData({ ...formData, avg_heart_rate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
                placeholder="145"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RPE (1-10) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={formData.perceived_effort}
                onChange={(e) => setFormData({ ...formData, perceived_effort: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fatigue (1-10) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={formData.fatigue_level}
                onChange={(e) => setFormData({ ...formData, fatigue_level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdda36] focus:border-transparent"
              placeholder="How did it feel? Weather conditions, etc."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {hubSyncStatus === 'synced' && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Session logged and synced to Planner</span>
            </div>
          )}

          {hubSyncStatus === 'failed' && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Session logged locally. Planner sync will retry.</span>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || hubSyncStatus === 'synced'}
              className="flex-1 bg-[#fdda36] hover:bg-[#e5c430] text-[#514163] font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Logging...' : hubSyncStatus === 'synced' ? 'Synced!' : 'Log Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
