import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X, Activity, Gauge, Heart, Zap, MapPin, TrendingUp, Mountain, Timer, Bike,
  Edit2, CopyCheck, Copy, Trash2, ExternalLink, ArrowLeft, ClipboardList,
} from 'lucide-react';
import { WorkoutData, GpsPoint } from '../../types/workout';
import { WorkoutStep } from '../../types/workout';
import { BarChart, LineChart } from './Charts';
import { RouteMap } from './RouteMap';
import WorkoutPreview from '../WorkoutPreview';
import { useLanguage } from '../../contexts/LanguageContext';

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutData: WorkoutData;
  userRole: 'coach' | 'athlete';
  isCompleted?: boolean;
  isActivityOnly?: boolean;
  steps?: WorkoutStep[];
  sport?: string;
  ftp?: number | null;
  activitySource?: string;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
}

type View = 'plan' | 'activity';
type TabId = 'resumen' | 'mapa' | 'pace' | 'watts' | 'pulso' | 'cadencia';

const TAB_CONFIG: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: 'resumen', label: 'Resumen', icon: Activity },
  { id: 'mapa', label: 'Mapa', icon: MapPin },
  { id: 'pace', label: 'Pace', icon: Gauge },
  { id: 'watts', label: 'Watts', icon: Zap },
  { id: 'pulso', label: 'Pulso', icon: Heart },
  { id: 'cadencia', label: 'Cadencia', icon: TrendingUp },
];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getGpsPoints(data: WorkoutData): GpsPoint[] {
  return data.gps_track || data.map || [];
}

function getPaceArray(data: WorkoutData): number[] {
  if (data.pace && data.pace.length) return data.pace;
  if (data.pace_sec_per_km && data.pace_sec_per_km.length) return data.pace_sec_per_km;
  const splits = data.splits;
  if (splits && splits.length) return splits.map((s) => s.avg_pace_sec_per_km ?? 0).filter((v) => v > 0);
  return [];
}

function getHeartRateArray(data: WorkoutData): number[] {
  if (data.heartRate && data.heartRate.length) return data.heartRate;
  if (data.heart_rate && data.heart_rate.length) return data.heart_rate;
  const gps = getGpsPoints(data);
  if (gps.length) return gps.map((p) => p.heart_rate ?? 0).filter((v) => v > 0);
  return [];
}

function getWattsArray(data: WorkoutData): number[] {
  if (data.watts && data.watts.length) return data.watts;
  if (data.power_watts && data.power_watts.length) return data.power_watts;
  const gps = getGpsPoints(data);
  if (gps.length) return gps.map((p) => p.power_watts ?? 0).filter((v) => v > 0);
  return [];
}

function getCadenceArray(data: WorkoutData): number[] {
  if (data.cadence && data.cadence.length) return data.cadence;
  if (data.cadence_rpm && data.cadence_rpm.length) return data.cadence_rpm;
  const gps = getGpsPoints(data);
  if (gps.length) return gps.map((p) => p.cadence ?? 0).filter((v) => v > 0);
  return [];
}

function KpiCard({ icon: Icon, label, value, sub, color }: { icon: typeof Activity; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium truncate">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

function NoData({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
        <Activity size={24} />
      </div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

function ZoneBar({ zones }: { zones: { zone: number; name: string; actual_percent?: number | null; color?: string }[] }) {
  if (!zones || zones.length === 0) return null;
  const total = zones.reduce((s, z) => s + (z.actual_percent ?? 0), 0) || 100;
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Distribución por zonas</h4>
      <div className="flex h-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {zones.map((z, i) => {
          const pct = ((z.actual_percent ?? 0) / total) * 100;
          if (pct === 0) return null;
          const colors = ['#3b82f6', '#06b6d4', '#10b981', '#eab308', '#f97316', '#ef4444', '#8b5cf6'];
          return (
            <div key={i} className="flex items-center justify-center text-xs font-bold text-white transition-all"
              style={{ width: `${pct}%`, backgroundColor: z.color || colors[z.zone - 1] || '#6366f1' }}
              title={`${z.name}: ${(z.actual_percent ?? 0).toFixed(0)}%`}
            >
              {pct > 8 ? `Z${z.zone}` : ''}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {zones.map((z, i) => (
          <span key={i} className="text-xs text-gray-500 dark:text-gray-400">
            Z{z.zone} {z.name}: {(z.actual_percent ?? 0).toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  );
}

function StepList({ steps }: { steps: WorkoutStep[] }) {
  if (!steps || steps.length === 0) return null;
  const STEP_META: Record<string, { color: string; bg: string; border: string; label: string }> = {
    warmup:   { color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   label: 'Warm Up' },
    steady:   { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Steady' },
    interval: { color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     label: 'Interval' },
    recovery: { color: 'text-cyan-700',    bg: 'bg-cyan-50',    border: 'border-cyan-200',    label: 'Recovery' },
    cooldown: { color: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200',  label: 'Cool Down' },
  };
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <ClipboardList size={15} /> Pasos del entrenamiento
      </h4>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
        {steps.map((s, i) => {
          const meta = STEP_META[s.step_type] || STEP_META.steady;
          const dur = s.duration_type === 'time'
            ? `${Math.floor(s.duration_value / 60)}:${String(s.duration_value % 60).padStart(2, '0')}`
            : `${s.duration_value} m`;
          const target = s.target_percent_ftp
            ? `${s.target_percent_ftp}% FTP`
            : s.target_zone
            ? `Zona ${s.target_zone}`
            : s.target_min_value && s.target_max_value
            ? `${s.target_min_value}-${s.target_max_value}`
            : '';
          return (
            <div key={s.id || i} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${meta.bg}`}>
              <span className="text-xs font-mono text-gray-400 w-6">{i + 1}.</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${meta.color} ${meta.border} border ${meta.bg}`}>
                {meta.label}
              </span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">{dur}</span>
              {target && <span className="text-gray-500 dark:text-gray-400 text-xs">{target}</span>}
              {s.repeat_times && s.repeat_times > 1 && (
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">×{s.repeat_times}</span>
              )}
              {s.cadence_rpm && (
                <span className="text-xs text-gray-400">{s.cadence_rpm} rpm</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkoutDetailModal({
  isOpen,
  onClose,
  workoutData: data,
  userRole,
  isCompleted = false,
  isActivityOnly = false,
  steps = [],
  sport = 'cycling',
  ftp = null,
  activitySource,
  onEdit,
  onDuplicate,
  onCopy,
  onDelete,
}: WorkoutDetailModalProps) {
  const { t } = useLanguage();
  const [view, setView] = useState<View>(isActivityOnly ? 'activity' : 'plan');
  const [activeTab, setActiveTab] = useState<TabId>('resumen');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setView(isActivityOnly ? 'activity' : 'plan');
      setActiveTab('resumen');
      setShowDeleteConfirm(false);
    }
  }, [isOpen, isActivityOnly]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) setShowDeleteConfirm(false);
        else onClose();
      }
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, showDeleteConfirm]);

  const gpsPoints = useMemo(() => getGpsPoints(data), [data]);
  const paceData = useMemo(() => getPaceArray(data), [data]);
  const hrData = useMemo(() => getHeartRateArray(data), [data]);
  const wattsData = useMemo(() => getWattsArray(data), [data]);
  const cadenceData = useMemo(() => getCadenceArray(data), [data]);

  const availableTabs = useMemo(() => {
    const tabs: TabId[] = ['resumen'];
    if (gpsPoints.length >= 2) tabs.push('mapa');
    if (paceData.length > 0) tabs.push('pace');
    if (wattsData.length > 0) tabs.push('watts');
    if (hrData.length > 0) tabs.push('pulso');
    if (cadenceData.length > 0) tabs.push('cadencia');
    return tabs;
  }, [gpsPoints, paceData, wattsData, hrData, cadenceData]);

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) setActiveTab('resumen');
  }, [availableTabs, activeTab]);

  const distance = data.distance_km ?? data.distance ?? 0;
  const durationSec = data.duration_seconds ?? data.duration ?? (data.actual_duration_minutes ?? 0) * 60;
  const avgPace = distance > 0 && durationSec > 0 ? durationSec / distance : null;
  const avgWatts = data.actual_avg_power_watts ?? (wattsData.length ? wattsData.reduce((s, v) => s + v, 0) / wattsData.length : null);
  const maxWatts = data.actual_max_power_watts ?? (wattsData.length ? Math.max(...wattsData) : null);
  const np = data.normalized_power_watts ?? null;
  const avgHr = data.actual_avg_hr ?? (hrData.length ? hrData.reduce((s, v) => s + v, 0) / hrData.length : null);
  const maxHr = data.actual_max_hr ?? (hrData.length ? Math.max(...hrData) : null);
  const minHr = hrData.length ? Math.min(...hrData) : null;
  const avgCadence = data.actual_avg_cadence ?? (cadenceData.length ? cadenceData.reduce((s, v) => s + v, 0) / cadenceData.length : null);
  const maxCadence = cadenceData.length ? Math.max(...cadenceData) : null;
  const elevGain = data.actual_elevation_gain_m ?? null;
  const elevLoss = data.actual_elevation_loss_m ?? null;
  const calories = data.actual_calories ?? null;
  const tss = data.actual_tss ?? null;
  const rpe = data.rpe ?? null;

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (showDeleteConfirm) setShowDeleteConfirm(false);
      else onClose();
    }
  }, [onClose, showDeleteConfirm]);

  if (!isOpen) return null;

  const hasActions = onEdit || onDuplicate || onCopy || onDelete;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdrop} role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
        style={{ width: '80vw', height: '80vh', maxWidth: 1400, maxHeight: 900 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {view === 'activity' && !isActivityOnly && (
              <button onClick={() => setView('plan')}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0">
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="w-10 h-10 rounded-lg bg-[#514163] flex items-center justify-center flex-shrink-0">
              <Bike size={20} className="text-[#fdda36]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {data.name || 'Entrenamiento'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data.date || data.scheduled_date || '—'} · {sport} · {userRole === 'coach' ? 'Vista Coach' : 'Vista Atleta'}
                {view === 'activity' && (isActivityOnly ? ` · Actividad${activitySource ? ` (${activitySource})` : ''}` : ' · Actividad realizada')}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0"
            aria-label={t('workout.cancel')}>
            <X size={20} />
          </button>
        </div>

        {/* View toggle (only if completed and not activity-only) */}
        {isCompleted && !isActivityOnly && (
          <div className="flex items-center gap-1 px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
            <button onClick={() => setView('plan')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                view === 'plan' ? 'bg-[#514163] text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>
              <ClipboardList size={14} /> Planificación
            </button>
            <button onClick={() => setView('activity')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                view === 'activity' ? 'bg-[#514163] text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>
              <ExternalLink size={14} /> {t('workout.viewActivity')}
            </button>
          </div>
        )}
        {isActivityOnly && (
          <div className="flex items-center gap-2 px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 flex-shrink-0">
            <Activity size={14} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Actividad sin planificación previa</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* PLAN VIEW */}
          {view === 'plan' && !isActivityOnly && (
            <div className="space-y-6">
              <WorkoutPreview
                steps={steps}
                sport={sport}
                physiology={ftp ? { ftp, zoneSystem: '5' } : undefined}
              />
              <StepList steps={steps} />

              {(data.athlete_notes || data.athlete_feedback || data.athlete_feeling || data.coach_notes) && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notas y feedback</h4>
                  {data.athlete_notes && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium">Notas del atleta</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{data.athlete_notes}</p>
                    </div>
                  )}
                  {data.athlete_feedback && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium">Feedback</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{data.athlete_feedback}</p>
                    </div>
                  )}
                  {data.athlete_feeling && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium">Sensación</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{data.athlete_feeling}</p>
                    </div>
                  )}
                  {data.coach_notes && userRole === 'coach' && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium">Notas del coach</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{data.coach_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ACTIVITY VIEW */}
          {view === 'activity' && (
            <>
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 mb-4 overflow-x-auto">
                {TAB_CONFIG.filter((tab) => availableTabs.includes(tab.id)).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        isActive ? 'bg-[#514163] text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}>
                      <Icon size={15} /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* RESUMEN */}
              {activeTab === 'resumen' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <KpiCard icon={MapPin} label="Distancia" value={`${distance.toFixed(1)} km`} color="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
                    <KpiCard icon={Timer} label="Duración" value={formatDuration(durationSec)} color="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" />
                    {avgPace != null && <KpiCard icon={Gauge} label="Pace medio" value={formatPace(avgPace)} sub="/km" color="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" />}
                    {avgWatts != null && <KpiCard icon={Zap} label="Watts avg" value={`${Math.round(avgWatts)} W`} color="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" />}
                    {maxWatts != null && <KpiCard icon={Zap} label="Watts max" value={`${Math.round(maxWatts)} W`} color="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" />}
                    {np != null && <KpiCard icon={Zap} label="Potencia norm." value={`${Math.round(np)} W`} color="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" />}
                    {avgHr != null && <KpiCard icon={Heart} label="Pulso avg" value={`${Math.round(avgHr)} bpm`} color="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400" />}
                    {maxHr != null && <KpiCard icon={Heart} label="Pulso max" value={`${Math.round(maxHr)} bpm`} color="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" />}
                    {avgCadence != null && <KpiCard icon={TrendingUp} label="Cadencia avg" value={`${Math.round(avgCadence)} rpm`} color="bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400" />}
                    {elevGain != null && <KpiCard icon={Mountain} label="Desnivel +" value={`${Math.round(elevGain)} m`} color="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" />}
                    {calories != null && <KpiCard icon={Activity} label="Calorías" value={`${Math.round(calories)} kcal`} color="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" />}
                    {tss != null && <KpiCard icon={Activity} label="TSS" value={tss.toFixed(0)} color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" />}
                    {rpe != null && <KpiCard icon={Activity} label="RPE" value={`${rpe}/10`} color="bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" />}
                  </div>

                  {data.zone_distribution && data.zone_distribution.length > 0 && <ZoneBar zones={data.zone_distribution} />}

                  {paceData.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pace por segmento</h4>
                      <BarChart data={paceData} labels={data.splits?.map((_, i) => `${i + 1}`) || paceData.map((_, i) => `${i + 1}`)}
                        color="#10b981" unit=" s/km" highlightBest highlightWorst averageLine formatValue={(v) => formatPace(v)} height={180} />
                    </div>
                  )}
                  {wattsData.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Watts por segmento</h4>
                      <BarChart data={wattsData} labels={data.splits?.map((_, i) => `${i + 1}`) || wattsData.map((_, i) => `${i + 1}`)}
                        color="#f59e0b" unit=" W" averageLine formatValue={(v) => Math.round(v).toString()} height={180} />
                    </div>
                  )}
                  {hrData.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pulso por segmento</h4>
                      <BarChart data={hrData} labels={data.splits?.map((_, i) => `${i + 1}`) || hrData.map((_, i) => `${i + 1}`)}
                        color="#ef4444" unit=" bpm" averageLine formatValue={(v) => Math.round(v).toString()} height={180} />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'mapa' && gpsPoints.length >= 2 && <RouteMap points={gpsPoints} />}

              {activeTab === 'pace' && (
                <div className="space-y-6">
                  {paceData.length === 0 ? <NoData message="No hay datos de pace disponibles." /> : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <KpiCard icon={Gauge} label="Pace medio" value={avgPace ? formatPace(avgPace) : '—'} sub="/km" color="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" />
                        <KpiCard icon={Gauge} label="Mejor pace" value={formatPace(Math.min(...paceData))} sub="/km" color="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" />
                        <KpiCard icon={Gauge} label="Peor pace" value={formatPace(Math.max(...paceData))} sub="/km" color="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400" />
                        <KpiCard icon={Activity} label="Segmentos" value={`${paceData.length}`} color="bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <BarChart data={paceData} labels={data.splits?.map((_, i) => `${i + 1}`) || paceData.map((_, i) => `${i + 1}`)}
                          color="#10b981" unit=" s/km" highlightBest highlightWorst averageLine formatValue={(v) => formatPace(v)} />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <LineChart series={[{ data: paceData, color: '#10b981', label: 'Pace' }]}
                          labels={data.splits?.map((_, i) => `${i + 1}`) || paceData.map((_, i) => `${i + 1}`)}
                          unit=" s/km" fillArea formatValue={(v) => formatPace(v)} />
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'watts' && (
                <div className="space-y-6">
                  {wattsData.length === 0 ? <NoData message="No hay datos de potencia disponibles." /> : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <KpiCard icon={Zap} label="Watts avg" value={avgWatts ? `${Math.round(avgWatts)} W` : '—'} color="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" />
                        <KpiCard icon={Zap} label="Watts max" value={maxWatts ? `${Math.round(maxWatts)} W` : '—'} color="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" />
                        {np && <KpiCard icon={Zap} label="Potencia normalizada" value={`${Math.round(np)} W`} color="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" />}
                        <KpiCard icon={Activity} label="Segmentos" value={`${wattsData.length}`} color="bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400" />
                      </div>
                      {data.zone_distribution && data.zone_distribution.length > 0 && <ZoneBar zones={data.zone_distribution} />}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <BarChart data={wattsData} labels={data.splits?.map((_, i) => `${i + 1}`) || wattsData.map((_, i) => `${i + 1}`)}
                          color="#f59e0b" unit=" W" averageLine formatValue={(v) => Math.round(v).toString()} />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <LineChart series={[{ data: wattsData, color: '#f59e0b', label: 'Watts' }]}
                          labels={data.splits?.map((_, i) => `${i + 1}`) || wattsData.map((_, i) => `${i + 1}`)}
                          unit=" W" fillArea formatValue={(v) => Math.round(v).toString()} />
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'pulso' && (
                <div className="space-y-6">
                  {hrData.length === 0 ? <NoData message="No hay datos de frecuencia cardíaca disponibles." /> : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <KpiCard icon={Heart} label="Pulso avg" value={avgHr ? `${Math.round(avgHr)} bpm` : '—'} color="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400" />
                        <KpiCard icon={Heart} label="Pulso max" value={maxHr ? `${Math.round(maxHr)} bpm` : '—'} color="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" />
                        {minHr && <KpiCard icon={Heart} label="Pulso min" value={`${Math.round(minHr)} bpm`} color="bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" />}
                        <KpiCard icon={Activity} label="Puntos" value={`${hrData.length}`} color="bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400" />
                      </div>
                      {data.zone_distribution && data.zone_distribution.length > 0 && <ZoneBar zones={data.zone_distribution} />}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <BarChart data={hrData} labels={data.splits?.map((_, i) => `${i + 1}`) || hrData.map((_, i) => `${i + 1}`)}
                          color="#ef4444" unit=" bpm" averageLine formatValue={(v) => Math.round(v).toString()} />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <LineChart series={[{ data: hrData, color: '#ef4444', label: 'FC' }]}
                          labels={data.splits?.map((_, i) => `${i + 1}`) || hrData.map((_, i) => `${i + 1}`)}
                          unit=" bpm" fillArea formatValue={(v) => Math.round(v).toString()} />
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'cadencia' && (
                <div className="space-y-6">
                  {cadenceData.length === 0 ? <NoData message="No hay datos de cadencia disponibles." /> : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <KpiCard icon={TrendingUp} label="Cadencia avg" value={avgCadence ? `${Math.round(avgCadence)} rpm` : '—'} color="bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400" />
                        <KpiCard icon={TrendingUp} label="Cadencia max" value={maxCadence ? `${Math.round(maxCadence)} rpm` : '—'} color="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" />
                        <KpiCard icon={Activity} label="Segmentos" value={`${cadenceData.length}`} color="bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <BarChart data={cadenceData} labels={data.splits?.map((_, i) => `${i + 1}`) || cadenceData.map((_, i) => `${i + 1}`)}
                          color="#3b82f6" unit=" rpm" averageLine formatValue={(v) => Math.round(v).toString()} />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <LineChart series={[{ data: cadenceData, color: '#3b82f6', label: 'Cadencia' }]}
                          labels={data.splits?.map((_, i) => `${i + 1}`) || cadenceData.map((_, i) => `${i + 1}`)}
                          unit=" rpm" fillArea formatValue={(v) => Math.round(v).toString()} />
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons Bar */}
        {hasActions && (
          <div className="flex items-center gap-2 px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0 overflow-x-auto">
            {onEdit && (
              <button onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <Edit2 size={15} /> {t('workout.edit')}
              </button>
            )}
            {onDuplicate && (
              <button onClick={onDuplicate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <CopyCheck size={15} /> {t('workout.duplicate')}
              </button>
            )}
            {onCopy && (
              <button onClick={onCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                <Copy size={15} /> {t('workout.copy')}
              </button>
            )}
            <div className="flex-1" />
            {onDelete && (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                <Trash2 size={15} /> {t('workout.delete')}
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm rounded-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-center font-bold text-gray-900 dark:text-white mb-2">{t('workout.deleteConfirmTitle')}</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">{t('workout.deleteConfirmMessage')}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  {t('workout.cancel')}
                </button>
                <button onClick={() => { setShowDeleteConfirm(false); onDelete?.(); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition">
                  {t('workout.delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutDetailModal;
