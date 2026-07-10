import { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Clock,
  MapPin,
  Heart,
  Zap,
  Activity,
  TrendingUp,
  Flame,
  BarChart2,
  Wind,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Map,
  List,
} from 'lucide-react';
import {
  HubScheduledWorkout,
  HubCompletedLog,
  HubGpsPoint,
  HubZoneDistribution,
  HubActivityLog,
} from '../../lib/hubApi';

// ─── GPS Map ──────────────────────────────────────────────────────────────────

function projectPoints(points: HubGpsPoint[], width: number, height: number, padding: number) {
  const lats = points.map(p => p.lat);
  const lngs = points.map(p => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 0.001;
  const lngRange = maxLng - minLng || 0.001;
  const scale = Math.min(
    (width - padding * 2) / lngRange,
    (height - padding * 2) / latRange
  );
  return points.map(p => ({
    x: padding + (p.lng - minLng) * scale,
    y: padding + (maxLat - p.lat) * scale,
    hr: p.heart_rate,
    power: p.power_watts,
    speed: p.speed_kmh,
  }));
}

function hrColor(hr: number | null | undefined): string {
  if (!hr) return '#6b7280';
  if (hr < 120) return '#22c55e';
  if (hr < 145) return '#3b82f6';
  if (hr < 165) return '#f59e0b';
  if (hr < 180) return '#f97316';
  return '#ef4444';
}

function GpsMap({ points }: { points: HubGpsPoint[] }) {
  const [colorBy, setColorBy] = useState<'hr' | 'power' | 'speed' | 'none'>('hr');
  const W = 600, H = 280, PAD = 24;

  const projected = projectPoints(points, W, H, PAD);

  const pathD = projected
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const start = projected[0];
  const end = projected[projected.length - 1];

  const hasHr = points.some(p => p.heart_rate);
  const hasPower = points.some(p => p.power_watts);
  const hasSpeed = points.some(p => p.speed_kmh);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5" /> GPS Route
        </p>
        <div className="flex gap-1">
          {(['none', hasHr && 'hr', hasPower && 'power', hasSpeed && 'speed'] as const)
            .filter(Boolean)
            .map(mode => (
              <button
                key={mode as string}
                onClick={() => setColorBy(mode as typeof colorBy)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition ${
                  colorBy === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {mode === 'none' ? 'route' : mode === 'hr' ? 'HR' : mode === 'power' ? 'power' : 'speed'}
              </button>
            ))}
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 260 }}>
          {/* Background grid */}
          <rect width={W} height={H} fill="currentColor" className="text-gray-100 dark:text-gray-900" />

          {/* Route as segments colored by metric */}
          {projected.map((p, i) => {
            if (i === 0) return null;
            const prev = projected[i - 1];
            const color = colorBy === 'hr'
              ? hrColor(p.hr)
              : colorBy === 'power'
              ? (p.power ? (p.power > 300 ? '#ef4444' : p.power > 240 ? '#f97316' : p.power > 180 ? '#f59e0b' : '#22c55e') : '#6b7280')
              : colorBy === 'speed'
              ? (p.speed ? (p.speed > 35 ? '#ef4444' : p.speed > 28 ? '#f97316' : p.speed > 20 ? '#3b82f6' : '#22c55e') : '#6b7280')
              : '#3b82f6';
            return (
              <line
                key={i}
                x1={prev.x} y1={prev.y}
                x2={p.x} y2={p.y}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* Start / end markers */}
          {start && (
            <circle cx={start.x} cy={start.y} r="6" fill="#22c55e" stroke="white" strokeWidth="2" />
          )}
          {end && start !== end && (
            <circle cx={end.x} cy={end.y} r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
          )}
        </svg>

        {/* Legend */}
        {colorBy === 'hr' && (
          <div className="absolute bottom-2 right-2 flex gap-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
            {[['#22c55e', '<120'], ['#3b82f6', '120-145'], ['#f59e0b', '145-165'], ['#f97316', '165-180'], ['#ef4444', '>180']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-0.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c }} />
                <span className="text-[9px] text-gray-600 dark:text-gray-300">{l}</span>
              </div>
            ))}
          </div>
        )}

        <div className="absolute top-2 left-2 flex gap-2 text-[10px]">
          <span className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-emerald-700 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Start
          </span>
          <span className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-red-700 dark:text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> End
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Zone Distribution Chart ──────────────────────────────────────────────────

const ZONE_COLORS: Record<number, string> = {
  1: '#22c55e',
  2: '#84cc16',
  3: '#3b82f6',
  4: '#f59e0b',
  5: '#f97316',
  6: '#ef4444',
  7: '#dc2626',
};

function ZonesChart({ zones }: { zones: HubZoneDistribution[] }) {
  const hasActual = zones.some(z => z.actual_percent != null);
  const hasPlanned = zones.some(z => z.planned_percent != null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5" /> Training Zones
        </p>
        {hasPlanned && hasActual && (
          <div className="flex gap-3 text-[10px] text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-1.5 rounded bg-gray-300 dark:bg-gray-600 inline-block" />Planned</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block bg-blue-500" />Actual</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {zones.map(z => {
          const actual = z.actual_percent ?? 0;
          const planned = z.planned_percent ?? 0;
          const color = ZONE_COLORS[z.zone] ?? '#6b7280';
          const overTarget = z.within_target === false && actual > planned;
          const underTarget = z.within_target === false && actual < planned;

          return (
            <div key={z.zone} className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color }} />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Z{z.zone}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-[10px]">{z.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasActual && (
                    <span className={`font-bold ${
                      overTarget ? 'text-orange-600' : underTarget ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {actual.toFixed(0)}%
                    </span>
                  )}
                  {z.actual_seconds != null && (
                    <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                      {Math.floor(z.actual_seconds / 60)}m{String(Math.round(z.actual_seconds % 60)).padStart(2, '0')}s
                    </span>
                  )}
                  {z.within_target !== null && z.within_target !== undefined && (
                    <span>{z.within_target ? '✓' : overTarget ? '↑' : '↓'}</span>
                  )}
                </div>
              </div>
              <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                {/* Planned bar (ghost) */}
                {hasPlanned && planned > 0 && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gray-300 dark:bg-gray-600"
                    style={{ width: `${Math.min(planned, 100)}%` }}
                  />
                )}
                {/* Actual bar */}
                {hasActual && actual > 0 && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{
                      width: `${Math.min(actual, 100)}%`,
                      background: color,
                      opacity: 0.85,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall zone compliance summary */}
      {hasActual && hasPlanned && (
        <div className="pt-2 flex gap-3">
          {(() => {
            const compliant = zones.filter(z => z.within_target === true).length;
            const total = zones.filter(z => z.within_target !== null).length;
            if (total === 0) return null;
            const pct = Math.round((compliant / total) * 100);
            return (
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                pct >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' :
                pct >= 50 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
                'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}>
                <CheckCircle className="w-3.5 h-3.5" />
                Zone compliance: {compliant}/{total} zones on target ({pct}%)
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

function ActivityLogView({ logs }: { logs: HubActivityLog[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <List className="w-3.5 h-3.5" /> Session Log
      </p>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
        {logs.map((entry, i) => (
          <div key={i} className={`flex items-start gap-3 px-4 py-2.5 text-sm ${
            entry.type === 'note' ? 'bg-amber-50/50 dark:bg-amber-900/10' : 'bg-white dark:bg-gray-800'
          }`}>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 w-14 flex-shrink-0 font-mono pt-0.5">
              {entry.timestamp?.slice(11, 16) ?? `#${i + 1}`}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold uppercase tracking-wide ${
                  entry.type === 'lap' ? 'text-blue-600 dark:text-blue-400' :
                  entry.type === 'segment' ? 'text-violet-600 dark:text-violet-400' :
                  entry.type === 'note' ? 'text-amber-600 dark:text-amber-400' :
                  'text-gray-500 dark:text-gray-400'
                }`}>{entry.type}</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">{entry.label}</span>
                {entry.value && <span className="text-gray-500 dark:text-gray-400">{entry.value}</span>}
              </div>
              {(entry.duration_s || entry.avg_hr || entry.avg_power || entry.avg_speed || entry.compliance) && (
                <div className="flex gap-3 mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                  {entry.duration_s != null && (
                    <span>{Math.floor(entry.duration_s / 60)}:{String(Math.round(entry.duration_s % 60)).padStart(2, '0')}</span>
                  )}
                  {entry.avg_hr != null && <span>♥ {entry.avg_hr} bpm</span>}
                  {entry.avg_power != null && <span>⚡ {entry.avg_power} W</span>}
                  {entry.avg_speed != null && <span>→ {entry.avg_speed.toFixed(1)} km/h</span>}
                  {entry.compliance != null && (
                    <span className={entry.compliance >= 90 ? 'text-emerald-600' : entry.compliance >= 70 ? 'text-amber-600' : 'text-red-500'}>
                      {entry.compliance}% on target
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Metric Box ───────────────────────────────────────────────────────────────

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

// ─── Feeling helpers ──────────────────────────────────────────────────────────

const FEELING_MAP: Record<string, { emoji: string; label: string; color: string }> = {
  great: { emoji: '😄', label: 'Great', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' },
  good: { emoji: '🙂', label: 'Good', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' },
  average: { emoji: '😐', label: 'Average', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700' },
  bad: { emoji: '😕', label: 'Bad', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' },
  terrible: { emoji: '😞', label: 'Terrible', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' },
};

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = 'overview' | 'map' | 'zones' | 'log';

export function WorkoutCompletionDetail({ sw, log, onBack }: {
  sw: HubScheduledWorkout;
  log: HubCompletedLog | null;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Resolve values, preferring sw (more likely to have fresh completion data) over log
  const workoutName = (sw as any).name ?? sw.workout?.name ?? log?.workout_name ?? 'Workout';
  const planned = (sw as any).planned_duration_minutes ?? sw.workout?.duration_minutes ?? null;
  const actual = sw.actual_duration_minutes ?? log?.duration_minutes ?? null;
  const compliance = sw.compliance_percent
    ?? log?.compliance_percent
    ?? (planned && actual ? Math.round((actual / planned) * 100) : null);
  const feeling = sw.athlete_feeling ?? log?.athlete_feeling ?? null;
  const feelingMeta = feeling ? (FEELING_MAP[feeling] ?? { emoji: '•', label: feeling, color: 'text-gray-600 bg-gray-50' }) : null;
  const athleteNotes = sw.athlete_notes ?? sw.athlete_feedback ?? log?.athlete_notes ?? log?.athlete_feedback ?? log?.notes ?? null;
  const coachNotes = sw.coach_notes ?? null;
  const rpe = sw.rpe ?? log?.rpe ?? null;
  const avgHr = sw.actual_avg_hr ?? log?.avg_heart_rate ?? null;
  const maxHr = sw.actual_max_hr ?? log?.max_heart_rate ?? null;
  const avgPower = sw.actual_avg_power_watts ?? log?.avg_power_watts ?? null;
  const maxPower = sw.actual_max_power_watts ?? log?.max_power_watts ?? null;
  const avgCadence = sw.actual_avg_cadence ?? log?.avg_cadence ?? null;
  const avgSpeed = sw.actual_avg_speed_kmh ?? log?.avg_speed_kmh ?? null;
  const elevation = sw.actual_elevation_gain_m ?? log?.elevation_gain_m ?? null;
  const calories = sw.actual_calories ?? log?.calories ?? null;
  const distanceKm = sw.actual_distance_km ?? log?.distance_km ?? null;
  const impulse = sw.actual_impulse ?? log?.session_impulse ?? log?.tss ?? null;
  const relIntensity = log?.relative_intensity ?? null;

  const gpsTrack = sw.gps_track ?? log?.gps_track ?? null;
  const zoneDist = sw.zone_distribution ?? log?.zone_distribution ?? null;
  const activityLog = sw.activity_log ?? log?.activity_log ?? null;

  const hasGps = gpsTrack && gpsTrack.length > 1;
  const hasZones = zoneDist && zoneDist.length > 0;
  const hasLog = activityLog && activityLog.length > 0;
  const hasAnyData = compliance != null || avgHr != null || avgPower != null || rpe != null || athleteNotes || feeling;

  const tabs: { id: Tab; label: string; available: boolean }[] = [
    { id: 'overview', label: 'Overview', available: true },
    { id: 'map', label: 'GPS Map', available: !!hasGps },
    { id: 'zones', label: 'Zones', available: !!hasZones },
    { id: 'log', label: 'Activity Log', available: !!hasLog },
  ].filter(t => t.available);

  const sport = (sw as any).sport ?? log?.workout_type ?? null;

  return (
    <div className="border border-emerald-200 dark:border-emerald-700 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 flex items-start gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800/40 transition mt-0.5 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-100 truncate">{workoutName}</h3>
            {feelingMeta && (
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${feelingMeta.color}`}>
                {feelingMeta.emoji} {feelingMeta.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-emerald-700 dark:text-emerald-400 flex-wrap">
            <span>{sw.scheduled_date}</span>
            {sport && <span className="capitalize">{sport}</span>}
            {compliance != null && (
              <span className={`font-bold ${compliance >= 90 ? 'text-emerald-600' : compliance >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                {compliance}% compliance
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      {tabs.length > 1 && (
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 px-5 py-4 space-y-5">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            {/* Compliance bar */}
            {compliance != null && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Workout Compliance</p>
                  <span className={`text-sm font-bold ${compliance >= 90 ? 'text-emerald-600' : compliance >= 70 ? 'text-amber-600' : 'text-red-500'}`}>
                    {compliance}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      compliance >= 90 ? 'bg-emerald-500' : compliance >= 70 ? 'bg-amber-500' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(compliance, 100)}%` }}
                  />
                </div>
                {planned && actual && (
                  <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    <span>Planned: {planned} min</span>
                    <span>Actual: {actual} min</span>
                  </div>
                )}
              </div>
            )}

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {actual != null && <MetricBox icon={Clock} label="Duration" value={`${actual} min`} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />}
              {distanceKm != null && <MetricBox icon={MapPin} label="Distance" value={`${distanceKm} km`} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/20" />}
              {avgHr != null && <MetricBox icon={Heart} label="Avg HR" value={`${avgHr} bpm`} color="text-red-600" bg="bg-red-50 dark:bg-red-900/20" />}
              {maxHr != null && <MetricBox icon={Heart} label="Max HR" value={`${maxHr} bpm`} color="text-rose-600" bg="bg-rose-50 dark:bg-rose-900/20" />}
              {avgPower != null && <MetricBox icon={Zap} label="Avg Power" value={`${avgPower} W`} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />}
              {maxPower != null && <MetricBox icon={Zap} label="Max Power" value={`${maxPower} W`} color="text-yellow-600" bg="bg-yellow-50 dark:bg-yellow-900/20" />}
              {avgSpeed != null && <MetricBox icon={Wind} label="Avg Speed" value={`${avgSpeed} km/h`} color="text-cyan-600" bg="bg-cyan-50 dark:bg-cyan-900/20" />}
              {avgCadence != null && <MetricBox icon={Activity} label="Cadence" value={`${avgCadence} rpm`} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/20" />}
              {elevation != null && <MetricBox icon={TrendingUp} label="Elevation" value={`${elevation} m`} color="text-teal-600" bg="bg-teal-50 dark:bg-teal-900/20" />}
              {calories != null && <MetricBox icon={Flame} label="Calories" value={`${calories} kcal`} color="text-orange-600" bg="bg-orange-50 dark:bg-orange-900/20" />}
              {impulse != null && <MetricBox icon={BarChart2} label="Impulse" value={String(typeof impulse === 'number' ? Math.round(impulse * 100) / 100 : impulse)} color="text-violet-600" bg="bg-violet-50 dark:bg-violet-900/20" />}
              {rpe != null && <MetricBox icon={Activity} label="RPE" value={`${rpe} / 10`} color="text-pink-600" bg="bg-pink-50 dark:bg-pink-900/20" />}
              {relIntensity != null && <MetricBox icon={BarChart2} label="Rel. Intensity" value={`${(relIntensity * 100).toFixed(1)}%`} color="text-gray-600" bg="bg-gray-50 dark:bg-gray-700/50" />}
            </div>

            {/* Inline mini zones preview when available but no tab selected */}
            {hasZones && activeTab === 'overview' && (
              <div className="pt-1">
                <ZonesChart zones={zoneDist!} />
              </div>
            )}

            {/* Athlete feedback */}
            {athleteNotes && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Athlete Feedback
                </p>
                <p className="text-sm text-amber-900 dark:text-amber-200 italic leading-relaxed">"{athleteNotes}"</p>
              </div>
            )}

            {/* Coach notes */}
            {coachNotes && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1.5">Coach Notes</p>
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">{coachNotes}</p>
              </div>
            )}

            {/* Planned description */}
            {sw.workout?.description && (
              <details className="group">
                <summary className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-200 transition select-none">
                  <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                  Workout Plan
                </summary>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed pl-5">
                  {sw.workout.description}
                </p>
              </details>
            )}

            {/* No data notice */}
            {!hasAnyData && (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>El atleta marcó este entrenamiento como completado en el Hub, pero no registró métricas ni feedback adicionales.</span>
              </div>
            )}
          </>
        )}

        {/* ── MAP TAB ── */}
        {activeTab === 'map' && hasGps && (
          <GpsMap points={gpsTrack!} />
        )}

        {/* ── ZONES TAB ── */}
        {activeTab === 'zones' && hasZones && (
          <ZonesChart zones={zoneDist!} />
        )}

        {/* ── LOG TAB ── */}
        {activeTab === 'log' && hasLog && (
          <ActivityLogView logs={activityLog!} />
        )}
      </div>
    </div>
  );
}
