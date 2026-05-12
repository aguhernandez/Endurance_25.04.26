import { useState, useRef, useEffect } from 'react';
import { WorkoutStep, StepType, DurationType, TargetType, Sport } from '../types/workout';
import { HRZone, PowerZone, PaceZone } from '../types/workout';
import { ArrowUp, ArrowDown, Trash2, ChevronDown, GripVertical } from 'lucide-react';
import { formatPace, formatPacePer100m } from '../lib/calculations';

interface StepEditorProps {
  step: Partial<WorkoutStep>;
  index: number;
  totalSteps: number;
  sport?: Sport;
  onUpdate: (step: Partial<WorkoutStep>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  hrZones?: HRZone[];
  powerZones?: PowerZone[];
  runPaceZones?: PaceZone[];
  swimPaceZones?: PaceZone[];
  zoneSystem?: '5' | '7';
}

const STEP_TYPES: { value: StepType; label: string; color: string; dot: string }[] = [
  { value: 'warmup',   label: 'Warm Up',   color: 'text-amber-600',  dot: 'bg-amber-400' },
  { value: 'steady',   label: 'Steady',    color: 'text-emerald-600', dot: 'bg-emerald-400' },
  { value: 'interval', label: 'Interval',  color: 'text-red-600',    dot: 'bg-red-400' },
  { value: 'recovery', label: 'Recovery',  color: 'text-sky-600',    dot: 'bg-sky-400' },
  { value: 'cooldown', label: 'Cool Down', color: 'text-slate-600',  dot: 'bg-slate-400' },
];

const RPE_COLORS = [
  '', // index 0 unused
  'bg-gray-100 text-gray-700 border-gray-300',
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-blue-100 text-blue-700 border-blue-300',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-emerald-100 text-emerald-700 border-emerald-300',
  'bg-yellow-100 text-yellow-700 border-yellow-300',
  'bg-orange-100 text-orange-700 border-orange-300',
  'bg-red-100 text-red-700 border-red-300',
  'bg-red-200 text-red-800 border-red-400',
  'bg-red-300 text-red-900 border-red-500',
];

const RPE_LABELS = ['', 'Very Easy', 'Easy', 'Easy', 'Moderate', 'Moderate', 'Hard', 'Hard', 'Very Hard', 'Very Hard', 'Max'];

const ZONE_BG: Record<number, string> = {
  1: 'bg-gray-100 border-gray-300 text-gray-700',
  2: 'bg-blue-100 border-blue-300 text-blue-700',
  3: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  4: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  5: 'bg-orange-100 border-orange-300 text-orange-700',
  6: 'bg-red-100 border-red-300 text-red-700',
  7: 'bg-pink-100 border-pink-300 text-pink-700',
};

function formatSeconds(v: number) {
  const h = Math.floor(v / 3600);
  const m = Math.floor((v % 3600) / 60);
  const s = v % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (s > 0) return `${m}:${s.toString().padStart(2, '0')}`;
  return `${m} min`;
}

export default function StepEditor({
  step,
  index,
  totalSteps,
  sport = 'cycling',
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  hrZones = [],
  powerZones = [],
  runPaceZones = [],
  swimPaceZones = [],
  zoneSystem = '5',
}: StepEditorProps) {
  const [expanded, setExpanded] = useState(true);

  const stepMeta = STEP_TYPES.find(t => t.value === (step.step_type || 'steady'))!;
  const activePaceZones = sport === 'swimming' ? swimPaceZones : runPaceZones;

  const getAvailableTargetTypes = (): { value: string; label: string }[] => {
    if (sport === 'cycling') return [
      { value: 'power', label: 'Power' },
      { value: 'hr', label: 'HR' },
      { value: 'rpe', label: 'RPE' },
    ];
    return [
      { value: 'pace', label: 'Pace' },
      { value: 'hr', label: 'HR' },
      { value: 'rpe', label: 'RPE' },
    ];
  };

  const handleHRZoneSelect = (zone: HRZone) =>
    onUpdate({ ...step, target_zone: zone.zone, target_min_value: zone.min, target_max_value: zone.max, zone_system: zoneSystem });

  const handlePowerZoneSelect = (zone: PowerZone) =>
    onUpdate({ ...step, target_zone: zone.zone, target_percent_ftp: zone.minPercent, target_min_value: zone.minWatts, target_max_value: zone.maxWatts, zone_system: zoneSystem });

  const handlePaceZoneSelect = (zone: PaceZone) =>
    onUpdate({ ...step, target_zone: zone.zone, target_min_value: zone.minPacePerKm, target_max_value: zone.maxPacePerKm, zone_system: zoneSystem });

  const selectedPowerZone = step.target_type === 'power' && step.target_zone ? powerZones.find(z => z.zone === step.target_zone) : null;
  const selectedHRZone    = step.target_type === 'hr'    && step.target_zone ? hrZones.find(z => z.zone === step.target_zone) : null;
  const selectedPaceZone  = step.target_type === 'pace'  && step.target_zone ? activePaceZones.find(z => z.zone === step.target_zone) : null;

  // Compact inline summary for collapsed state
  const summaryParts: string[] = [];
  if (step.duration_type === 'time' && step.duration_value) summaryParts.push(formatSeconds(step.duration_value));
  else if (step.duration_type === 'distance' && step.duration_value) summaryParts.push(`${(step.duration_value / 1000).toFixed(1)} km`);
  if (selectedPowerZone) summaryParts.push(`${selectedPowerZone.name} · ${selectedPowerZone.minPercent}–${selectedPowerZone.maxPercent}% FTP`);
  else if (selectedHRZone) summaryParts.push(`${selectedHRZone.name} · ${selectedHRZone.min}–${selectedHRZone.max} bpm`);
  else if (selectedPaceZone) summaryParts.push(selectedPaceZone.name);
  else if (step.target_type === 'rpe' && step.target_min_value) summaryParts.push(`RPE ${step.target_min_value}`);

  const dur = step.duration_value || 0;
  const hVal = Math.floor(dur / 3600);
  const mVal = Math.floor((dur % 3600) / 60);
  const sVal = dur % 60;

  const setTimePart = (h: number, m: number, s: number) =>
    onUpdate({ ...step, duration_value: h * 3600 + m * 60 + s });

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header row */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none group"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="text-gray-300 group-hover:text-gray-400 transition flex-shrink-0">
          <GripVertical size={14} />
        </div>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${stepMeta.dot}`} />
        <span className={`text-xs font-bold uppercase tracking-wide flex-shrink-0 ${stepMeta.color}`}>
          {stepMeta.label}
        </span>
        {summaryParts.length > 0 && (
          <span className="text-xs text-gray-400 truncate flex-1 min-w-0">{summaryParts.join(' · ')}</span>
        )}
        <div className="flex items-center gap-0.5 ml-auto flex-shrink-0" onClick={e => e.stopPropagation()}>
          {onMoveUp && index > 0 && (
            <button onClick={onMoveUp} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition">
              <ArrowUp size={13} />
            </button>
          )}
          {onMoveDown && index < totalSteps - 1 && (
            <button onClick={onMoveDown} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition">
              <ArrowDown size={13} />
            </button>
          )}
          <button onClick={onDelete} className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition">
            <Trash2 size={13} />
          </button>
          <ChevronDown size={13} className={`text-gray-400 transition-transform ml-1 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-3 py-3 space-y-3">
          {/* Row 1: Step type · Target type · Duration type · Duration */}
          <div className="flex items-end gap-2 flex-wrap">
            {/* Step type */}
            <div className="flex-1 min-w-[100px]">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Type</p>
              <select
                value={step.step_type || 'steady'}
                onChange={e => onUpdate({ ...step, step_type: e.target.value as StepType })}
                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
              >
                {STEP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {/* Target type */}
            <div className="flex-1 min-w-[90px]">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Target</p>
              <select
                value={step.target_type || ''}
                onChange={e => onUpdate({ ...step, target_type: e.target.value as TargetType, target_zone: undefined, target_min_value: undefined, target_max_value: undefined, target_percent_ftp: undefined })}
                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
              >
                <option value="">None</option>
                {getAvailableTargetTypes().map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {/* Duration type */}
            <div className="flex-1 min-w-[80px]">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">By</p>
              <select
                value={step.duration_type || 'time'}
                onChange={e => onUpdate({ ...step, duration_type: e.target.value as DurationType })}
                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
              >
                <option value="time">Time</option>
                <option value="distance">Distance</option>
              </select>
            </div>

            {/* Duration value */}
            {step.duration_type === 'time' ? (
              <div className="flex-[2] min-w-[140px]">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Duration{dur > 0 ? ` · ${formatSeconds(dur)}` : ''}
                </p>
                <div className="flex items-center gap-1">
                  {[
                    { label: 'h',  val: hVal, max: 23, set: (v: number) => setTimePart(v, mVal, sVal) },
                    { label: 'm',  val: mVal, max: 59, set: (v: number) => setTimePart(hVal, v, sVal) },
                    { label: 's',  val: sVal, max: 59, set: (v: number) => setTimePart(hVal, mVal, v) },
                  ].map(({ label, val, max, set }) => (
                    <div key={label} className="flex items-center gap-0.5 flex-1">
                      <input
                        type="number" min={0} max={max} value={val}
                        onChange={e => set(Math.max(0, Math.min(max, parseInt(e.target.value) || 0)))}
                        className="w-full text-xs text-center px-1.5 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      />
                      <span className="text-[10px] text-gray-400 w-3 flex-shrink-0">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-[2] min-w-[100px]">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Distance (m)</p>
                <input
                  type="number" value={step.duration_value || 0} min={0}
                  onChange={e => onUpdate({ ...step, duration_value: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
              </div>
            )}
          </div>

          {/* Zone / target row */}
          {step.target_type === 'power' && sport === 'cycling' && (
            <ZoneSection
              label="Power Zone"
              zones={powerZones.map(z => ({
                zone: z.zone,
                name: z.name,
                detail: z.minPercent !== undefined ? `${z.minPercent}–${z.maxPercent}%` : undefined,
                sub: z.minWatts !== undefined ? `${z.minWatts}–${z.maxWatts} W` : undefined,
              }))}
              selectedZone={step.target_zone}
              onSelect={z => handlePowerZoneSelect(powerZones.find(p => p.zone === z)!)}
              noZonesMessage="No power zones — set FTP in LAB."
              extraFields={
                <div className="flex gap-2 mt-2">
                  <MiniField label="% FTP" value={step.target_percent_ftp}
                    onChange={v => onUpdate({ ...step, target_percent_ftp: v })} placeholder="e.g. 75" max={200} />
                  <MiniField label="Min W" value={step.target_min_value}
                    onChange={v => onUpdate({ ...step, target_min_value: v })} placeholder="—" />
                  <MiniField label="Max W" value={step.target_max_value}
                    onChange={v => onUpdate({ ...step, target_max_value: v })} placeholder="—" />
                </div>
              }
            />
          )}

          {step.target_type === 'hr' && (
            <ZoneSection
              label="HR Zone"
              zones={hrZones.map(z => ({
                zone: z.zone,
                name: z.name,
                detail: z.min !== undefined ? `${z.min}–${z.max} bpm` : undefined,
              }))}
              selectedZone={step.target_zone}
              onSelect={z => handleHRZoneSelect(hrZones.find(h => h.zone === z)!)}
              noZonesMessage="No HR zones — configure in LAB."
              extraFields={
                <div className="flex gap-2 mt-2">
                  <MiniField label="Min bpm" value={step.target_min_value}
                    onChange={v => onUpdate({ ...step, target_min_value: v })} placeholder="—" />
                  <MiniField label="Max bpm" value={step.target_max_value}
                    onChange={v => onUpdate({ ...step, target_max_value: v })} placeholder="—" />
                </div>
              }
            />
          )}

          {step.target_type === 'pace' && (sport === 'running' || sport === 'swimming') && (
            <ZoneSection
              label="Pace Zone"
              zones={activePaceZones.map(z => ({
                zone: z.zone,
                name: z.name,
                detail: sport === 'swimming'
                  ? `${formatPacePer100m(z.minPacePerKm || null)}–${formatPacePer100m(z.maxPacePerKm || null)}`
                  : `${formatPace(z.minPacePerKm || null)}–${formatPace(z.maxPacePerKm || null)}`,
              }))}
              selectedZone={step.target_zone}
              onSelect={z => handlePaceZoneSelect(activePaceZones.find(p => p.zone === z)!)}
              noZonesMessage={`No pace zones — configure ${sport} zones in LAB.`}
            />
          )}

          {step.target_type === 'rpe' && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">RPE Target</p>
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onUpdate({ ...step, target_min_value: v, target_max_value: v })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                      step.target_min_value === v
                        ? RPE_COLORS[v]
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {step.target_min_value !== undefined && (
                <p className="text-[10px] text-gray-400 mt-1">RPE {step.target_min_value} — {RPE_LABELS[step.target_min_value]}</p>
              )}
            </div>
          )}

          {/* Repeat */}
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex-shrink-0">Repeat</p>
            <input
              type="number"
              value={step.repeat_times || ''}
              onChange={e => onUpdate({ ...step, repeat_times: parseInt(e.target.value) || undefined })}
              placeholder="×1 (optional)"
              min={0}
              className="w-28 text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mini numeric field ──────────────────────────────────────────────────────────

function MiniField({ label, value, onChange, placeholder, max }: {
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
  max?: number;
}) {
  return (
    <div className="flex-1">
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      <input
        type="number" value={value || ''} min={0} max={max}
        placeholder={placeholder}
        onChange={e => onChange(parseInt(e.target.value) || undefined)}
        className="w-full text-xs text-center px-1.5 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}

// ── Zone pill selector ──────────────────────────────────────────────────────────

const ZONE_BG_MAP: Record<number, string> = {
  1: 'bg-gray-100 border-gray-300 text-gray-700',
  2: 'bg-blue-100 border-blue-300 text-blue-700',
  3: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  4: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  5: 'bg-orange-100 border-orange-300 text-orange-700',
  6: 'bg-red-100 border-red-300 text-red-700',
  7: 'bg-pink-100 border-pink-300 text-pink-700',
};

interface ZoneSectionProps {
  label: string;
  zones: { zone: number; name: string; detail?: string; sub?: string }[];
  selectedZone?: number;
  onSelect: (zone: number) => void;
  noZonesMessage: string;
  extraFields?: React.ReactNode;
}

function ZoneSection({ label, zones, selectedZone, onSelect, noZonesMessage, extraFields }: ZoneSectionProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const sel = zones.find(z => z.zone === selectedZone);

  if (zones.length === 0) {
    return (
      <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-600">{noZonesMessage}</p>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</p>
      {/* Pill row */}
      <div className="flex gap-1.5 flex-wrap">
        {zones.map(z => (
          <button
            key={z.zone}
            type="button"
            onClick={() => onSelect(z.zone)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              selectedZone === z.zone
                ? `${ZONE_BG_MAP[z.zone]} shadow-sm`
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-white'
            }`}
          >
            <span className="font-bold">Z{z.zone}</span>
            <span className="hidden sm:inline opacity-80">{z.name}</span>
            {z.detail && <span className="font-semibold">{z.detail}</span>}
          </button>
        ))}
      </div>
      {extraFields}
    </div>
  );
}
