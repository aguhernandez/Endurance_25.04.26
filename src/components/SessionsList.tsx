import { TrainingSession } from '../lib/supabase';
import { calculateRelativeIntensity, calculateSessionLoad, formatPace, formatPacePer100m, getSportIcon } from '../lib/calculations';
import { Calendar, Clock, TrendingUp, Zap, Heart } from 'lucide-react';
import { useSessionDifficulty } from '../hooks/useSessionDifficulty';
import { getDifficultyClasses, getDifficultyLabel } from '../lib/sessionDifficulty';

interface SessionsListProps {
  sessions: TrainingSession[];
  ftp: number | null;
  athleteId?: string | null;
  onRefresh: () => void;
}

export default function SessionsList({ sessions, ftp, athleteId }: SessionsListProps) {
  const { computeDifficulty, computeMetrics } = useSessionDifficulty(athleteId, ftp);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const relativeIntensity = session.sport === 'cycling'
          ? calculateRelativeIntensity(session.avg_power_watts, ftp)
          : null;
        const sessionLoad = session.sport === 'cycling'
          ? calculateSessionLoad(session.duration_minutes, session.avg_power_watts, ftp)
          : null;

        const diff = computeDifficulty({
          session_date: session.session_date,
          sport: session.sport,
          duration_minutes: session.duration_minutes,
          avg_power_watts: session.avg_power_watts,
          avg_pace_per_km: session.avg_pace_per_km,
          perceived_effort: session.perceived_effort,
          status: session.status,
          ftp,
        });

        const metrics = computeMetrics({
          session_date: session.session_date,
          sport: session.sport,
          duration_minutes: session.duration_minutes,
          avg_power_watts: session.avg_power_watts,
          avg_pace_per_km: session.avg_pace_per_km,
          perceived_effort: session.perceived_effort,
          status: session.status,
          ftp,
        });

        const diffCls = diff ? getDifficultyClasses(diff.difficulty) : null;

        return (
          <div
            key={session.id}
            className={`border rounded-lg p-4 hover:shadow-sm transition ${
              diffCls ? `${diffCls.border}` : 'border-gray-200 hover:border-[#fdda36]'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[#514163]">
                  {getSportIcon(session.sport)} {session.session_name || `${session.sport} Session`}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(session.session_date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {diff && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${diffCls!.badge}`}>
                    {getDifficultyLabel(diff.difficulty)}
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {session.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-semibold text-[#514163]">{session.duration_minutes} min</p>
                </div>
              </div>

              {session.distance_km && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="font-semibold text-[#514163]">{session.distance_km} km</p>
                  </div>
                </div>
              )}

              {session.sport === 'cycling' && session.avg_power_watts && (
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Avg Power</p>
                    <p className="font-semibold text-[#514163]">{session.avg_power_watts}w</p>
                  </div>
                </div>
              )}

              {(session.sport === 'running' || session.sport === 'swimming') && session.avg_pace_per_km && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Avg Pace</p>
                    <p className="font-semibold text-[#514163]">
                      {session.sport === 'running'
                        ? formatPace(session.avg_pace_per_km)
                        : formatPacePer100m(session.avg_pace_per_km)}
                    </p>
                  </div>
                </div>
              )}

              {session.avg_heart_rate && (
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Avg HR</p>
                    <p className="font-semibold text-[#514163]">{session.avg_heart_rate} bpm</p>
                  </div>
                </div>
              )}

              {relativeIntensity && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Intensity</p>
                    <p className="font-semibold text-[#514163]">{relativeIntensity.toFixed(0)}% FTP</p>
                  </div>
                </div>
              )}

              {sessionLoad && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Load</p>
                    <p className="font-semibold text-[#514163]">{sessionLoad}</p>
                  </div>
                </div>
              )}
            </div>

            {metrics && session.status === 'completed' && (
              <div className="mt-3 space-y-2">
                <div className={`flex items-center gap-5 px-3 py-2 rounded-lg text-xs ${diffCls!.bg}`}>
                  <div>
                    <span className="text-gray-500">Impulse</span>
                    <span className={`ml-1.5 font-bold ${diffCls!.text}`}>{metrics.ssr.sessionImpulse.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">CA</span>
                    <span className="ml-1.5 font-semibold text-gray-700 dark:text-gray-300">{metrics.ssr.currentCA.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">SSR</span>
                    <span className={`ml-1.5 font-bold ${diffCls!.text}`}>{metrics.ssr.ssr.toFixed(2)}</span>
                  </div>
                </div>
                {(() => {
                  const cuCls = getDifficultyClasses(metrics.cu.difficulty);
                  return (
                    <div className={`flex items-center gap-5 px-3 py-2 rounded-lg text-xs ${cuCls.bg} border ${cuCls.border}`}>
                      <div>
                        <span className="text-gray-500">CU</span>
                        <span className={`ml-1.5 font-bold ${cuCls.text}`}>{metrics.cu.cu.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className={`text-xs ${cuCls.text}`}>{metrics.cu.label}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {session.notes && (
              <div className="mt-3 text-sm text-gray-600 bg-gray-50 rounded p-3">
                {session.notes}
              </div>
            )}

            {session.status === 'completed' && (session.perceived_effort || session.fatigue_level) && (
              <div className="mt-3 flex space-x-4 text-sm">
                {session.perceived_effort && (
                  <div>
                    <span className="text-gray-500">RPE:</span>
                    <span className="ml-1 font-semibold text-[#514163]">{session.perceived_effort}/10</span>
                  </div>
                )}
                {session.fatigue_level && (
                  <div>
                    <span className="text-gray-500">Fatigue:</span>
                    <span className="ml-1 font-semibold text-[#514163]">{session.fatigue_level}/10</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
