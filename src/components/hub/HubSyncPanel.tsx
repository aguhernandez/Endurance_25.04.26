import { useState } from 'react';
import {
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Activity,
  Zap,
  Heart,
  TrendingUp,
  Calendar,
  User,
  Tag,
  Clock,
  MapPin,
  Flame,
  BarChart2,
  Wind,
  ArrowLeft,
} from 'lucide-react';
import { useHubPassport, PassportSnapshot } from '../../hooks/useHubPassport';
import { useHubPlan, PushPlanResult } from '../../hooks/useHubPlan';
import { useHubSchedule } from '../../hooks/useHubSchedule';
import { useHubTrainingLog } from '../../hooks/useHubTrainingLog';
import { HubTrainingSchedule, HubPushTagsResult, HubCompletedLog, collectAndPushAthleteTags } from '../../lib/hubApi';
import { WorkoutCompletionDetail } from './WorkoutCompletionDetail';

interface HubSyncPanelProps {
  hubAthleteId: string;
  localAthleteId: string;
  ftpWatts: number | null;
  athleteName?: string;
  athleteEmail?: string;
}

function PassportCard({ snapshot }: { snapshot: PassportSnapshot }) {
  const [expanded, setExpanded] = useState(false);
  const p = snapshot.passport;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 bg-emerald-50 dark:bg-emerald-900/20 text-left hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Biological Passport Synced
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              {snapshot.profile.athlete.full_name} · Measured {p.measurement_date}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-emerald-600" /> : <ChevronDown size={16} className="text-emerald-600" />}
      </button>

      {expanded && (
        <div className="px-5 py-4 bg-white dark:bg-gray-800 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {p.ftp_watts && (
            <StatBox icon={Zap} label="FTP" value={`${p.ftp_watts} W`} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
          )}
          {p.vo2max && (
            <StatBox icon={TrendingUp} label="VO2max" value={`${p.vo2max} ml/kg/min`} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
          )}
          {p.lt2_hr && (
            <StatBox icon={Heart} label="LT2 HR" value={`${p.lt2_hr} bpm`} color="text-red-600" bg="bg-red-50 dark:bg-red-900/20" />
          )}
          {p.lt1_hr && (
            <StatBox icon={Heart} label="LT1 HR" value={`${p.lt1_hr} bpm`} color="text-orange-600" bg="bg-orange-50 dark:bg-orange-900/20" />
          )}
          {p.running_threshold_pace && (
            <StatBox icon={Activity} label="Run Threshold" value={`${p.running_threshold_pace}/km`} color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" />
          )}
          {p.weight_kg && (
            <StatBox icon={User} label="Weight" value={`${p.weight_kg} kg`} color="text-gray-600" bg="bg-gray-50 dark:bg-gray-700/50" />
          )}
          {p.athlete_level && (
            <div className="col-span-full">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full capitalize">
                {p.athlete_level} · {p.source}
                {p.training_age_years ? ` · ${p.training_age_years}y training` : ''}
              </span>
            </div>
          )}
          {p.hydration && (
            <div className="col-span-full pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Hydration (Lab)</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Sweat rate {p.hydration.sweat_rate_l_h} L/h · {p.hydration.temperature_c}°C / {p.hydration.humidity_percent}% humidity
              </p>
            </div>
          )}
          {p.heat_adaptation && (
            <div className="col-span-full pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Heat Adaptation</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {p.heat_adaptation.adaptation_classification} · Score {p.heat_adaptation.heat_adaptation_score} ({p.heat_adaptation.total_sessions} sessions)
              </p>
            </div>
          )}
          {p.force_velocity && (
            <div className="col-span-full pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Force-Velocity Profile</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pmax {p.force_velocity.pmax_w}W ({p.force_velocity.pmax_w_kg} W/kg) ·{' '}
                <span className={`font-semibold ${
                  p.force_velocity.fv_imbalance_direction === 'balanced' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {p.force_velocity.fv_imbalance_direction.replace('_', ' ')} ({p.force_velocity.fv_imbalance_percent}%)
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${bg}`}>
      <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
      <div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function PushResultBanner({ result }: { result: PushPlanResult }) {
  if (result.success && result.errors.length === 0) {
    return (
      <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl">
        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Plan sent to Hub</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
            {result.pushedWeeks} week{result.pushedWeeks !== 1 ? 's' : ''} pushed ·{' '}
            {result.pushedLogs} completed session{result.pushedLogs !== 1 ? 's' : ''} logged
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          Partial sync: {result.pushedWeeks} weeks, {result.pushedLogs} logs
        </p>
        {result.errors.slice(0, 3).map((e, i) => (
          <p key={i} className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{e}</p>
        ))}
      </div>
    </div>
  );
}

function SchedulePreview({ schedule }: { schedule: HubTrainingSchedule }) {
  const [expanded, setExpanded] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<HubScheduledWorkout | null>(null);
  const total = schedule.scheduled_workouts.length + schedule.completed_training_logs.length;

  // Build a map from training_date → completed log for cross-referencing
  const logByDate = new Map<string, HubCompletedLog>();
  for (const log of schedule.completed_training_logs) {
    logByDate.set(log.training_date, log);
  }

  if (selectedWorkout) {
    const matchingLog = logByDate.get(selectedWorkout.scheduled_date) ?? null;
    return (
      <WorkoutCompletionDetail
        sw={selectedWorkout}
        log={matchingLog}
        onBack={() => setSelectedWorkout(null)}
      />
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Hub Calendar Loaded</p>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              {schedule.scheduled_workouts.filter(w => w.status === 'completed').length} completed ·{' '}
              {schedule.scheduled_workouts.filter(w => w.status === 'pending').length} pending ·{' '}
              {schedule.weekly_loads.length} weeks
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-blue-600" /> : <ChevronDown size={16} className="text-blue-600" />}
      </button>

      {expanded && total > 0 && (
        <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {schedule.weekly_loads.length > 0 && (
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Weekly Loads</p>
              <div className="space-y-1.5">
                {schedule.weekly_loads.slice(0, 4).map(wl => (
                  <div key={wl.week_start_date} className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">{wl.week_start_date}</span>
                    <div className="flex gap-4 text-xs">
                      {wl.planned_hours != null && (
                        <span className="text-gray-600 dark:text-gray-400">
                          Plan: <strong>{wl.planned_hours.toFixed(1)}h</strong>
                          {wl.planned_tss ? ` / ${wl.planned_tss} TSS` : ''}
                        </span>
                      )}
                      {wl.actual_hours != null && (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Done: <strong>{wl.actual_hours.toFixed(1)}h</strong>
                          {wl.actual_tss ? ` / ${wl.actual_tss} TSS` : ''}
                        </span>
                      )}
                      {wl.load_status && (
                        <span className="text-amber-600 dark:text-amber-400 capitalize">{wl.load_status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {schedule.scheduled_workouts.length > 0 && (
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sessions</p>
              <div className="space-y-1.5">
                {[...schedule.scheduled_workouts]
                  .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
                  .map(sw => {
                    const isCompleted = sw.status === 'completed';
                    const isSkipped = sw.status === 'skipped';
                    const log = logByDate.get(sw.scheduled_date);
                    const hasDetail = isCompleted;

                    return (
                      <button
                        key={sw.id}
                        onClick={() => hasDetail && setSelectedWorkout(sw)}
                        disabled={!hasDetail}
                        className={`w-full flex items-center gap-3 text-sm rounded-lg px-2 py-1.5 -mx-2 transition text-left ${
                          hasDetail
                            ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer'
                            : 'cursor-default'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : isSkipped ? (
                          <span className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-blue-300 dark:bg-blue-600 flex-shrink-0" />
                        )}
                        <span className="text-gray-500 dark:text-gray-400 w-24 flex-shrink-0 text-xs">{sw.scheduled_date}</span>
                        <span className={`flex-1 truncate font-medium ${
                          isCompleted ? 'text-gray-900 dark:text-gray-100' :
                          isSkipped ? 'line-through text-gray-400 dark:text-gray-500' :
                          'text-gray-700 dark:text-gray-300'
                        }`}>
                          {sw.workout.name}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isCompleted && sw.compliance_percent != null && (
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                              sw.compliance_percent >= 90 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                              sw.compliance_percent >= 70 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                              'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            }`}>
                              {sw.compliance_percent}%
                            </span>
                          )}
                          {isCompleted && log?.rpe != null && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">RPE {log.rpe}</span>
                          )}
                          {isCompleted && (
                            <ChevronDown size={12} className="text-gray-400 -rotate-90" />
                          )}
                          {!isCompleted && sw.workout.duration_minutes && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">{sw.workout.duration_minutes} min</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TagsPushBanner({ result }: { result: HubPushTagsResult }) {
  if (result.success && result.errors.length === 0) {
    return (
      <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl">
        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Tags synced to Hub</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
            {result.message}
            {result.saved.length > 0 && (
              <span className="ml-1">· {result.saved.join(', ')}</span>
            )}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{result.message}</p>
        {result.errors.slice(0, 3).map((e, i) => (
          <p key={i} className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{e}</p>
        ))}
      </div>
    </div>
  );
}

function MetricBox({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType; label: string; value: string; color: string; bg: string;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${bg}`}>
      <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
      <div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function TrainingLogDetail({ log, onBack }: { log: HubCompletedLog; onBack: () => void }) {
  const sportColor: Record<string, string> = {
    cycling: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    running: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    swimming: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    triathlon: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  };
  const colorClass = sportColor[log.workout_type || ''] || 'text-gray-600 bg-gray-50 dark:bg-gray-700/50';

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="px-5 py-4 bg-violet-50 dark:bg-violet-900/20 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-800/40 transition"
        >
          <ArrowLeft className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-violet-900 dark:text-violet-200 truncate">
            Training Session — {log.training_date}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {log.workout_type && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${colorClass}`}>
                {log.workout_type}
              </span>
            )}
            <span className="text-xs text-violet-600 dark:text-violet-400">ID: {log.id}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {log.duration_minutes != null && (
            <MetricBox icon={Clock} label="Duration" value={`${log.duration_minutes} min`} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
          )}
          {log.distance_km != null && (
            <MetricBox icon={MapPin} label="Distance" value={`${log.distance_km} km`} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/20" />
          )}
          {log.avg_heart_rate != null && (
            <MetricBox icon={Heart} label="Avg HR" value={`${log.avg_heart_rate} bpm`} color="text-red-600" bg="bg-red-50 dark:bg-red-900/20" />
          )}
          {log.max_heart_rate != null && (
            <MetricBox icon={Heart} label="Max HR" value={`${log.max_heart_rate} bpm`} color="text-rose-600" bg="bg-rose-50 dark:bg-rose-900/20" />
          )}
          {log.avg_power_watts != null && (
            <MetricBox icon={Zap} label="Avg Power" value={`${log.avg_power_watts} W`} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
          )}
          {log.max_power_watts != null && (
            <MetricBox icon={Zap} label="Max Power" value={`${log.max_power_watts} W`} color="text-yellow-600" bg="bg-yellow-50 dark:bg-yellow-900/20" />
          )}
          {log.avg_speed_kmh != null && (
            <MetricBox icon={Wind} label="Avg Speed" value={`${log.avg_speed_kmh} km/h`} color="text-cyan-600" bg="bg-cyan-50 dark:bg-cyan-900/20" />
          )}
          {log.avg_cadence != null && (
            <MetricBox icon={Activity} label="Avg Cadence" value={`${log.avg_cadence} rpm`} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/20" />
          )}
          {log.elevation_gain_m != null && (
            <MetricBox icon={TrendingUp} label="Elevation" value={`${log.elevation_gain_m} m`} color="text-teal-600" bg="bg-teal-50 dark:bg-teal-900/20" />
          )}
          {log.calories != null && (
            <MetricBox icon={Flame} label="Calories" value={`${log.calories} kcal`} color="text-orange-600" bg="bg-orange-50 dark:bg-orange-900/20" />
          )}
          {(log.session_impulse != null || log.tss != null) && (
            <MetricBox icon={BarChart2} label="Impulse / TSS" value={`${log.session_impulse ?? log.tss}`} color="text-violet-600" bg="bg-violet-50 dark:bg-violet-900/20" />
          )}
          {log.rpe != null && (
            <MetricBox icon={Activity} label="RPE" value={`${log.rpe} / 10`} color="text-pink-600" bg="bg-pink-50 dark:bg-pink-900/20" />
          )}
          {log.relative_intensity != null && (
            <MetricBox icon={BarChart2} label="Rel. Intensity" value={`${(log.relative_intensity * 100).toFixed(1)}%`} color="text-gray-600" bg="bg-gray-50 dark:bg-gray-700/50" />
          )}
        </div>

        {log.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Notes</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{log.notes}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Metadata</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
            {log.external_source && (
              <span>Source: <span className="font-medium text-gray-700 dark:text-gray-300">{log.external_source}</span></span>
            )}
            {log.external_activity_id && (
              <span>Activity ID: <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{log.external_activity_id}</span></span>
            )}
            {log.created_at && (
              <span>Logged: <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(log.created_at).toLocaleDateString()}</span></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrainingLogList({ logs, onSelect }: { logs: HubCompletedLog[]; onSelect: (log: HubCompletedLog) => void }) {
  const [expanded, setExpanded] = useState(true);

  if (logs.length === 0) return null;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 bg-violet-50 dark:bg-violet-900/20 text-left hover:bg-violet-100 dark:hover:bg-violet-900/30 transition"
      >
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">Training Logs from Hub</p>
            <p className="text-xs text-violet-600 dark:text-violet-500">{logs.length} session{logs.length !== 1 ? 's' : ''} retrieved</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-violet-600" /> : <ChevronDown size={16} className="text-violet-600" />}
      </button>

      {expanded && (
        <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {logs.map(log => (
            <button
              key={log.id}
              onClick={() => onSelect(log)}
              className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {log.training_date}
                  {log.workout_type && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 capitalize">{log.workout_type}</span>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {log.duration_minutes != null && <span>{log.duration_minutes} min</span>}
                  {log.distance_km != null && <span>{log.distance_km} km</span>}
                  {log.avg_heart_rate != null && <span>{log.avg_heart_rate} bpm</span>}
                  {(log.session_impulse != null || log.tss != null) && (
                    <span>Impulse {log.session_impulse ?? log.tss}</span>
                  )}
                </div>
              </div>
              <ChevronDown size={14} className="text-gray-400 -rotate-90 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HubSyncPanel({ hubAthleteId, localAthleteId, ftpWatts, athleteName, athleteEmail }: HubSyncPanelProps) {
  const { snapshot, loading: passportLoading, error: passportError, fetchPassport } = useHubPassport();
  const { pushing, lastResult, pushWeeklyPlan } = useHubPlan();
  const { schedule, loading: scheduleLoading, error: scheduleError, fetchSchedule } = useHubSchedule();
  const { logs, selectedLog, loading: logsLoading, error: logsError, fetchByDateRange, fetchById, selectLog, clear: clearLogs } = useHubTrainingLog();
  const [pushingTags, setPushingTags] = useState(false);
  const [tagsResult, setTagsResult] = useState<HubPushTagsResult | null>(null);
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [showLogIdInput, setShowLogIdInput] = useState(false);
  const [logIdInput, setLogIdInput] = useState('');

  const handleFetchPassport = () => {
    fetchPassport(hubAthleteId, localAthleteId, athleteEmail);
  };

  const handlePushPlan = () => {
    pushWeeklyPlan(hubAthleteId, localAthleteId, ftpWatts);
  };

  const handleFetchSchedule = () => {
    const today = new Date();
    const dateFrom = new Date(today);
    dateFrom.setDate(today.getDate() - 14);
    const dateTo = new Date(today);
    dateTo.setDate(today.getDate() + 28);
    fetchSchedule(
      hubAthleteId,
      localAthleteId,
      dateFrom.toISOString().split('T')[0],
      dateTo.toISOString().split('T')[0]
    );
  };

  const handlePullTrainingLogs = () => {
    clearLogs();
    const today = new Date();
    const dateFrom = new Date(today);
    dateFrom.setDate(today.getDate() - 60);
    fetchByDateRange(
      hubAthleteId,
      dateFrom.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  };

  const handleFetchById = () => {
    if (!logIdInput.trim()) return;
    clearLogs();
    fetchById(hubAthleteId, logIdInput.trim());
    setShowLogIdInput(false);
    setLogIdInput('');
  };

  const handlePushTags = async () => {
    setPushingTags(true);
    setTagsError(null);
    setTagsResult(null);
    try {
      const result = await collectAndPushAthleteTags(localAthleteId, hubAthleteId, `athlete:${localAthleteId}`);
      if (result) {
        setTagsResult(result);
      } else {
        setTagsError('Failed to push tags to Hub');
      }
    } catch (err: any) {
      setTagsError(err.message || 'Failed to push tags');
    } finally {
      setPushingTags(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-yellow/20 flex items-center justify-center flex-shrink-0">
          <RefreshCw className="w-4 h-4 text-primary-purple dark:text-primary-yellow" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Hub Sync{athleteName ? ` — ${athleteName}` : ''}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Bidirectional sync with Asciende Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SyncButton
          icon={Download}
          label="Read Biological Passport"
          description="Zones, FTP, VO2max, lab data"
          loading={passportLoading}
          color="emerald"
          onClick={handleFetchPassport}
        />
        <SyncButton
          icon={Calendar}
          label="Read Hub Calendar"
          description="Planned & completed sessions"
          loading={scheduleLoading}
          color="blue"
          onClick={handleFetchSchedule}
        />
        <SyncButton
          icon={Upload}
          label="Push Plan to Hub"
          description="Send workouts & completed logs"
          loading={pushing}
          color="amber"
          onClick={handlePushPlan}
        />
        <SyncButton
          icon={Tag}
          label="Push Tags to Hub"
          description="Sync athlete tags to Asciende"
          loading={pushingTags}
          color="teal"
          onClick={handlePushTags}
        />
        <SyncButton
          icon={Download}
          label="Pull Training Logs"
          description="Retrieve completed sessions (60 days)"
          loading={logsLoading}
          color="violet"
          onClick={handlePullTrainingLogs}
        />
        <button
          onClick={() => setShowLogIdInput(v => !v)}
          className="flex flex-col items-start gap-2 p-4 rounded-xl border-2 border-violet-200 dark:border-violet-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-violet-700 dark:text-violet-400 transition text-left"
        >
          <Activity className="w-5 h-5 text-violet-500" />
          <div>
            <p className="text-sm font-semibold">Pull by Session ID</p>
            <p className="text-xs opacity-70 mt-0.5">Fetch one specific log from Hub</p>
          </div>
        </button>
      </div>

      {showLogIdInput && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={logIdInput}
            onChange={e => setLogIdInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFetchById()}
            placeholder="Paste training log ID..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <button
            onClick={handleFetchById}
            disabled={!logIdInput.trim()}
            className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-40 transition"
          >
            Fetch
          </button>
          <button
            onClick={() => { setShowLogIdInput(false); setLogIdInput(''); }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {passportError && <ErrorBanner title="Passport Error" message={passportError} />}
      {scheduleError && <ErrorBanner title="Schedule Error" message={scheduleError} />}
      {tagsError && <ErrorBanner title="Tags Error" message={tagsError} />}
      {logsError && <ErrorBanner title="Training Logs Error" message={logsError} />}

      {snapshot && <PassportCard snapshot={snapshot} />}
      {schedule && <SchedulePreview schedule={schedule} />}
      {lastResult && <PushResultBanner result={lastResult} />}
      {tagsResult && <TagsPushBanner result={tagsResult} />}

      {selectedLog ? (
        <TrainingLogDetail log={selectedLog} onBack={() => selectLog(null)} />
      ) : logs.length > 0 ? (
        <TrainingLogList logs={logs} onSelect={selectLog} />
      ) : null}
    </div>
  );
}

function ErrorBanner({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-red-800 dark:text-red-300">{title}</p>
        <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{message}</p>
      </div>
    </div>
  );
}

function SyncButton({ icon: Icon, label, description, loading, color, onClick }: {
  icon: React.ElementType;
  label: string;
  description: string;
  loading: boolean;
  color: 'emerald' | 'blue' | 'amber' | 'teal' | 'violet';
  onClick: () => void;
}) {
  const colors = {
    emerald: 'border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
    blue: 'border-blue-200 dark:border-blue-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    amber: 'border-amber-200 dark:border-amber-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-400',
    teal: 'border-teal-200 dark:border-teal-700 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-700 dark:text-teal-400',
    violet: 'border-violet-200 dark:border-violet-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-violet-700 dark:text-violet-400',
  };

  const iconColors = {
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    teal: 'text-teal-500',
    violet: 'text-violet-500',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition text-left disabled:opacity-50 disabled:cursor-not-allowed ${colors[color]}`}
    >
      {loading ? (
        <RefreshCw className={`w-5 h-5 animate-spin ${iconColors[color]}`} />
      ) : (
        <Icon className={`w-5 h-5 ${iconColors[color]}`} />
      )}
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs opacity-70 mt-0.5">{description}</p>
      </div>
    </button>
  );
}
