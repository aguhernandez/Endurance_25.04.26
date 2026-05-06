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
} from 'lucide-react';
import { useHubPassport, PassportSnapshot } from '../../hooks/useHubPassport';
import { useHubPlan, PushPlanResult } from '../../hooks/useHubPlan';
import { useHubSchedule } from '../../hooks/useHubSchedule';
import { HubTrainingSchedule, HubPushTagsResult, collectAndPushAthleteTags } from '../../lib/hubApi';

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
  const [expanded, setExpanded] = useState(false);
  const total = schedule.scheduled_workouts.length + schedule.completed_training_logs.length;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-900/20 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
              Hub Calendar Loaded
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              {schedule.scheduled_workouts.length} planned · {schedule.completed_training_logs.length} completed · {schedule.weekly_loads.length} weeks
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-blue-600" /> : <ChevronDown size={16} className="text-blue-600" />}
      </button>

      {expanded && total > 0 && (
        <div className="px-5 py-4 bg-white dark:bg-gray-800 space-y-3">
          {schedule.weekly_loads.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Weekly Loads</p>
              <div className="space-y-1.5">
                {schedule.weekly_loads.slice(0, 4).map(wl => (
                  <div key={wl.week_start_date} className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">{wl.week_start_date}</span>
                    <div className="flex gap-4 text-xs">
                      {wl.planned_hours && (
                        <span className="text-gray-600 dark:text-gray-400">
                          Plan: <strong>{wl.planned_hours?.toFixed(1)}h</strong>
                          {wl.planned_tss ? ` / ${wl.planned_tss} TSS` : ''}
                        </span>
                      )}
                      {wl.actual_hours && (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Done: <strong>{wl.actual_hours?.toFixed(1)}h</strong>
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

          {schedule.scheduled_workouts.slice(0, 5).length > 0 && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Upcoming Workouts</p>
              <div className="space-y-1.5">
                {schedule.scheduled_workouts.slice(0, 5).map(sw => (
                  <div key={sw.id} className="flex items-center gap-3 text-sm">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      sw.status === 'completed' ? 'bg-emerald-500' :
                      sw.status === 'skipped' ? 'bg-gray-400' : 'bg-blue-400'
                    }`} />
                    <span className="text-gray-500 dark:text-gray-400 w-24 flex-shrink-0 text-xs">{sw.scheduled_date}</span>
                    <span className="text-gray-800 dark:text-gray-200 truncate">{sw.workout.name}</span>
                    {sw.workout.duration_minutes && (
                      <span className="text-xs text-gray-500 ml-auto flex-shrink-0">{sw.workout.duration_minutes} min</span>
                    )}
                  </div>
                ))}
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

export default function HubSyncPanel({ hubAthleteId, localAthleteId, ftpWatts, athleteName, athleteEmail }: HubSyncPanelProps) {
  const { snapshot, loading: passportLoading, error: passportError, fetchPassport } = useHubPassport();
  const { pushing, lastResult, pushWeeklyPlan } = useHubPlan();
  const { schedule, loading: scheduleLoading, error: scheduleError, fetchSchedule } = useHubSchedule();
  const [pushingTags, setPushingTags] = useState(false);
  const [tagsResult, setTagsResult] = useState<HubPushTagsResult | null>(null);
  const [tagsError, setTagsError] = useState<string | null>(null);

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
      dateFrom.toISOString().split('T')[0],
      dateTo.toISOString().split('T')[0]
    );
  };

  const handlePushTags = async () => {
    setPushingTags(true);
    setTagsError(null);
    setTagsResult(null);
    try {
      const result = await collectAndPushAthleteTags(hubAthleteId, `athlete:${localAthleteId}`);
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
      </div>

      {passportError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">Passport Error</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{passportError}</p>
          </div>
        </div>
      )}

      {scheduleError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">Schedule Error</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{scheduleError}</p>
          </div>
        </div>
      )}

      {tagsError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">Tags Error</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{tagsError}</p>
          </div>
        </div>
      )}

      {snapshot && <PassportCard snapshot={snapshot} />}
      {schedule && <SchedulePreview schedule={schedule} />}
      {lastResult && <PushResultBanner result={lastResult} />}
      {tagsResult && <TagsPushBanner result={tagsResult} />}
    </div>
  );
}

function SyncButton({ icon: Icon, label, description, loading, color, onClick }: {
  icon: React.ElementType;
  label: string;
  description: string;
  loading: boolean;
  color: 'emerald' | 'blue' | 'amber' | 'teal';
  onClick: () => void;
}) {
  const colors = {
    emerald: 'border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
    blue: 'border-blue-200 dark:border-blue-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    amber: 'border-amber-200 dark:border-amber-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-400',
    teal: 'border-teal-200 dark:border-teal-700 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-700 dark:text-teal-400',
  };

  const iconColors = {
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    teal: 'text-teal-500',
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
