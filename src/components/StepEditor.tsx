import { useState } from 'react';
import { WorkoutStep, StepType, DurationType, TargetType, Sport } from '../types/workout';
import { HRZone, PowerZone, PaceZone } from '../types/workout';
import { ArrowUp, ArrowDown, Trash2, Zap, Heart, Timer } from 'lucide-react';
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

const STEP_TYPES: { value: StepType; label: string }[] = [
  { value: 'warmup', label: 'Warm Up' },
  { value: 'steady', label: 'Steady' },
  { value: 'interval', label: 'Interval' },
  { value: 'recovery', label: 'Recovery' },
  { value: 'cooldown', label: 'Cool Down' },
];

const ZONE_COLORS: Record<number, string> = {
  1: 'bg-gray-100 border-gray-300 text-gray-700',
  2: 'bg-blue-100 border-blue-300 text-blue-700',
  3: 'bg-green-100 border-green-300 text-green-700',
  4: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  5: 'bg-orange-100 border-orange-300 text-orange-700',
  6: 'bg-red-100 border-red-300 text-red-700',
  7: 'bg-pink-100 border-pink-300 text-pink-700',
};

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

  const formatDuration = (type: DurationType, value: number): string => {
    if (type === 'time') {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return seconds > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${minutes} min`;
    }
    return `${(value / 1000).toFixed(1)} km`;
  };

  const getStepColor = (type: StepType): string => {
    switch (type) {
      case 'warmup': return 'bg-yellow-50 border-yellow-300';
      case 'steady': return 'bg-green-50 border-green-300';
      case 'interval': return 'bg-red-50 border-red-300';
      case 'recovery': return 'bg-blue-50 border-blue-300';
      case 'cooldown': return 'bg-slate-50 border-slate-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  const getAvailableTargetTypes = (): { value: string; label: string }[] => {
    if (sport === 'cycling') return [
      { value: 'power', label: 'Power' },
      { value: 'hr', label: 'Heart Rate' },
      { value: 'rpe', label: 'RPE' },
    ];
    if (sport === 'running') return [
      { value: 'pace', label: 'Pace' },
      { value: 'hr', label: 'Heart Rate' },
      { value: 'rpe', label: 'RPE' },
    ];
    return [
      { value: 'pace', label: 'Pace' },
      { value: 'hr', label: 'Heart Rate' },
      { value: 'rpe', label: 'RPE' },
    ];
  };

  const handleHRZoneSelect = (zone: HRZone) => {
    onUpdate({ ...step, target_zone: zone.zone, target_min_value: zone.min, target_max_value: zone.max, zone_system: zoneSystem });
  };

  const handlePowerZoneSelect = (zone: PowerZone) => {
    onUpdate({ ...step, target_zone: zone.zone, target_percent_ftp: zone.minPercent, target_min_value: zone.minWatts, target_max_value: zone.maxWatts, zone_system: zoneSystem });
  };

  const handlePaceZoneSelect = (zone: PaceZone) => {
    onUpdate({ ...step, target_zone: zone.zone, target_min_value: zone.minPacePerKm, target_max_value: zone.maxPacePerKm, zone_system: zoneSystem });
  };

  const selectedHRZone = step.target_type === 'hr' && step.target_zone ? hrZones.find(z => z.zone === step.target_zone) : null;
  const selectedPowerZone = step.target_type === 'power' && step.target_zone ? powerZones.find(z => z.zone === step.target_zone) : null;
  const activePaceZones = sport === 'swimming' ? swimPaceZones : runPaceZones;
  const selectedPaceZone = step.target_type === 'pace' && step.target_zone ? activePaceZones.find(z => z.zone === step.target_zone) : null;

  const summaryLabel = () => {
    const base = step.step_type ? STEP_TYPES.find(t => t.value === step.step_type)?.label : 'Step';
    const dur = step.duration_type && step.duration_value ? ` (${formatDuration(step.duration_type, step.duration_value)})` : '';
    if (selectedHRZone) return `${base}${dur} — ${selectedHRZone.name} ${selectedHRZone.min ? `${selectedHRZone.min}-${selectedHRZone.max} bpm` : ''}`;
    if (selectedPowerZone) return `${base}${dur} — ${selectedPowerZone.name} (${selectedPowerZone.minPercent}-${selectedPowerZone.maxPercent}% FTP)`;
    if (selectedPaceZone) return `${base}${dur} — ${selectedPaceZone.name} (${formatPace(selectedPaceZone.minPacePerKm || null)}-${formatPace(selectedPaceZone.maxPacePerKm || null)})`;
    return `${base}${dur}`;
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getStepColor(step.step_type || 'steady')}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="font-bold text-gray-700 text-sm flex-shrink-0">#{index + 1}</span>
          <button onClick={() => setExpanded(!expanded)} className="text-sm font-medium text-gray-700 text-left truncate">
            {summaryLabel()}
          </button>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {onMoveUp && index > 0 && (
            <button onClick={onMoveUp} className="p-1 hover:bg-white/50 rounded transition"><ArrowUp size={15} /></button>
          )}
          {onMoveDown && index < totalSteps - 1 && (
            <button onClick={onMoveDown} className="p-1 hover:bg-white/50 rounded transition"><ArrowDown size={15} /></button>
          )}
          <button onClick={onDelete} className="p-1 hover:bg-red-200 rounded transition text-red-600"><Trash2 size={15} /></button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 mt-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Step Type</label>
              <select
                value={step.step_type || 'steady'}
                onChange={(e) => onUpdate({ ...step, step_type: e.target.value as StepType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {STEP_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
              <select
                value={step.target_type || ''}
                onChange={(e) => onUpdate({ ...step, target_type: e.target.value as TargetType, target_zone: undefined, target_min_value: undefined, target_max_value: undefined, target_percent_ftp: undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">None</option>
                {getAvailableTargetTypes().map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration Type</label>
              <select
                value={step.duration_type || 'time'}
                onChange={(e) => onUpdate({ ...step, duration_type: e.target.value as DurationType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="time">Time</option>
                <option value="distance">Distance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration ({step.duration_type === 'time' ? 'seconds' : 'meters'})
              </label>
              <input
                type="number"
                value={step.duration_value || 0}
                onChange={(e) => onUpdate({ ...step, duration_value: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                min="0"
              />
              {step.duration_type === 'time' && step.duration_value ? (
                <p className="text-xs text-gray-500 mt-1">{formatDuration('time', step.duration_value)}</p>
              ) : null}
            </div>
          </div>

          {step.target_type === 'hr' && (
            <div className="space-y-3">
              {hrZones.length > 0 ? (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Heart size={14} className="text-red-500" /> Select HR Zone
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {hrZones.map((zone) => (
                      <button key={zone.zone} type="button" onClick={() => handleHRZoneSelect(zone)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 text-left transition hover:shadow-sm ${
                          step.target_zone === zone.zone ? `${ZONE_COLORS[zone.zone]} border-current font-semibold shadow-sm` : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}>
                        <span className="font-medium text-sm">{zone.name}</span>
                        {zone.min !== undefined && zone.max !== undefined && (
                          <span className="text-sm font-bold">{zone.min} – {zone.max} bpm</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700 font-medium">No HR zones from LAB for this athlete.</p>
                  <p className="text-xs text-amber-600 mt-1">Enter values manually below.</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Zone #</label>
                  <input type="number" value={step.target_zone || ''} onChange={(e) => {
                    const zoneNum = parseInt(e.target.value) || undefined;
                    const match = zoneNum ? hrZones.find(z => z.zone === zoneNum) : undefined;
                    onUpdate({ ...step, target_zone: zoneNum, target_min_value: match?.min ?? step.target_min_value, target_max_value: match?.max ?? step.target_max_value, zone_system: zoneSystem });
                  }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" min="1" max="7" placeholder="1-7" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min bpm</label>
                  <input type="number" value={step.target_min_value || ''} onChange={(e) => onUpdate({ ...step, target_min_value: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" placeholder="Min" min="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max bpm</label>
                  <input type="number" value={step.target_max_value || ''} onChange={(e) => onUpdate({ ...step, target_max_value: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" placeholder="Max" min="0" />
                </div>
              </div>
            </div>
          )}

          {step.target_type === 'power' && sport === 'cycling' && (
            <div className="space-y-3">
              {powerZones.length > 0 ? (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Zap size={14} className="text-yellow-500" /> Select Power Zone
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {powerZones.map((zone) => (
                      <button key={zone.zone} type="button" onClick={() => handlePowerZoneSelect(zone)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 text-left transition hover:shadow-sm ${
                          step.target_zone === zone.zone ? `${ZONE_COLORS[zone.zone]} border-current font-semibold shadow-sm` : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}>
                        <span className="font-medium text-sm">{zone.name}</span>
                        <div className="text-right">
                          {zone.minPercent !== undefined && zone.maxPercent !== undefined && (
                            <span className="text-sm font-bold">{zone.minPercent}–{zone.maxPercent}% FTP</span>
                          )}
                          {zone.minWatts !== undefined && zone.maxWatts !== undefined && (
                            <span className="text-xs text-gray-500 ml-2">({zone.minWatts}–{zone.maxWatts}W)</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700 font-medium">No power zones configured.</p>
                  <p className="text-xs text-amber-600 mt-1">Set FTP to use default zones, or configure in LAB.</p>
                </div>
              )}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Zone #</label>
                  <input type="number" value={step.target_zone || ''} onChange={(e) => {
                    const zoneNum = parseInt(e.target.value) || undefined;
                    const match = zoneNum ? powerZones.find(z => z.zone === zoneNum) : undefined;
                    onUpdate({ ...step, target_zone: zoneNum, target_percent_ftp: match?.minPercent ?? step.target_percent_ftp, target_min_value: match?.minWatts ?? step.target_min_value, target_max_value: match?.maxWatts ?? step.target_max_value, zone_system: zoneSystem });
                  }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" min="1" max="7" placeholder="1-7" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">% FTP</label>
                  <input type="number" value={step.target_percent_ftp || ''} onChange={(e) => onUpdate({ ...step, target_percent_ftp: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" min="0" max="200" placeholder="e.g. 75" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min (W)</label>
                  <input type="number" value={step.target_min_value || ''} onChange={(e) => onUpdate({ ...step, target_min_value: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" placeholder="Min" min="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max (W)</label>
                  <input type="number" value={step.target_max_value || ''} onChange={(e) => onUpdate({ ...step, target_max_value: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" placeholder="Max" min="0" />
                </div>
              </div>
            </div>
          )}

          {step.target_type === 'pace' && (sport === 'running' || sport === 'swimming') && (
            <div className="space-y-3">
              {activePaceZones.length > 0 ? (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Timer size={14} className="text-green-500" /> Select Pace Zone
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {activePaceZones.map((zone) => (
                      <button key={zone.zone} type="button" onClick={() => handlePaceZoneSelect(zone)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 text-left transition hover:shadow-sm ${
                          step.target_zone === zone.zone ? `${ZONE_COLORS[zone.zone]} border-current font-semibold shadow-sm` : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}>
                        <span className="font-medium text-sm">{zone.name}</span>
                        <div className="text-right text-sm font-bold">
                          {sport === 'swimming'
                            ? `${formatPacePer100m(zone.minPacePerKm || null)} – ${formatPacePer100m(zone.maxPacePerKm || null)}`
                            : `${formatPace(zone.minPacePerKm || null)} – ${formatPace(zone.maxPacePerKm || null)}`
                          }
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700 font-medium">No pace zones from LAB for this athlete.</p>
                  <p className="text-xs text-amber-600 mt-1">Configure {sport} pace zones in the LAB satellite, or enter manually.</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Zone #</label>
                  <input type="number" value={step.target_zone || ''} onChange={(e) => {
                    const zoneNum = parseInt(e.target.value) || undefined;
                    const match = zoneNum ? activePaceZones.find(z => z.zone === zoneNum) : undefined;
                    onUpdate({ ...step, target_zone: zoneNum, target_min_value: match?.minPacePerKm ?? step.target_min_value, target_max_value: match?.maxPacePerKm ?? step.target_max_value, zone_system: zoneSystem });
                  }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" min="1" max="5" placeholder="1-5" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slow pace (s/km)</label>
                  <input type="number" value={step.target_min_value || ''} onChange={(e) => onUpdate({ ...step, target_min_value: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" placeholder="e.g. 360" min="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fast pace (s/km)</label>
                  <input type="number" value={step.target_max_value || ''} onChange={(e) => onUpdate({ ...step, target_max_value: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm" placeholder="e.g. 300" min="0" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repeat (optional)</label>
            <input
              type="number"
              value={step.repeat_times || ''}
              onChange={(e) => onUpdate({ ...step, repeat_times: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              min="0"
              placeholder="Number of repetitions"
            />
          </div>
        </div>
      )}
    </div>
  );
}
