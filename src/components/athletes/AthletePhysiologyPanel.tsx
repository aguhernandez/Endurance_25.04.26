import { useState, useEffect } from 'react';
import {
  FlaskConical, Heart, Zap, TrendingUp, Waves, Save, X, Info,
  ChevronDown, ChevronUp, Wind, CreditCard as Edit3,
} from 'lucide-react';
import { AthletePhysiology, HRZone, PowerZone, PaceZone } from '../../types/workout';
import { supabase } from '../../lib/supabase';
import {
  extractHRZones, extractPowerZones, extractRunPaceZones, extractSwimPaceZones,
  getDefaultHRZones, getDefaultPowerZones,
} from '../../hooks/useAthletePhysiology';

interface Props {
  athleteId: string;
  physiology: AthletePhysiology | null;
  ftp: number | null;
  onPhysiologyUpdated: () => void;
  onFTPUpdated: (ftp: number) => void;
}

function secPerKmToMinSec(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatRunPace(secPerKm: number | undefined): string {
  if (!secPerKm) return '';
  return `${secPerKmToMinSec(secPerKm)}/km`;
}

function formatSwimPace(secPerKm: number | undefined): string {
  if (!secPerKm) return '';
  const per100m = secPerKm / 10;
  return `${secPerKmToMinSec(per100m)}/100m`;
}

const HR_ZONE_COLORS = [
  { bar: 'bg-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-200 dark:border-sky-800', text: 'text-sky-700 dark:text-sky-300' },
  { bar: 'bg-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300' },
  { bar: 'bg-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-300' },
  { bar: 'bg-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
  { bar: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
  { bar: 'bg-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300' },
  { bar: 'bg-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300' },
];

const POWER_ZONE_COLORS = [
  { bar: 'bg-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-200 dark:border-sky-800', text: 'text-sky-700 dark:text-sky-300' },
  { bar: 'bg-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300' },
  { bar: 'bg-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-300' },
  { bar: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
  { bar: 'bg-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
];

const PACE_ZONE_COLORS = [
  { bar: 'bg-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-200 dark:border-sky-800', text: 'text-sky-700 dark:text-sky-300' },
  { bar: 'bg-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300' },
  { bar: 'bg-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-300' },
  { bar: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
  { bar: 'bg-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300' },
];

function ZoneBar({
  zone, name, range, intensity, barColor, bgColor, borderColor, textColor,
}: {
  zone: number; name: string; range: string; intensity: number;
  barColor: string; bgColor: string; borderColor: string; textColor: string;
}) {
  return (
    <div className={`rounded-xl border overflow-hidden ${bgColor} ${borderColor}`}>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`text-xs font-bold w-5 flex-shrink-0 ${textColor}`}>Z{zone}</span>
          <span className={`text-xs font-medium truncate ${textColor} opacity-80`}>{name.replace(/^Z\d+ /, '')}</span>
        </div>
        <span className={`text-xs font-semibold tabular-nums flex-shrink-0 ml-2 ${textColor}`}>{range}</span>
      </div>
      <div className="h-1.5 bg-black/5 dark:bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${intensity}%` }}
        />
      </div>
    </div>
  );
}

export default function AthletePhysiologyPanel({ athleteId, physiology, ftp, onPhysiologyUpdated, onFTPUpdated }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFTP, setEditFTP] = useState<string>(ftp?.toString() || '');
  const [formData, setFormData] = useState<Partial<AthletePhysiology>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>('hr');
  const [activeZoneSystem, setActiveZoneSystem] = useState<'5' | '7'>(physiology?.zone_system ?? '5');

  const hasZones7 = !!(physiology?.zones7_hr_json?.length || physiology?.zones7_power_json?.length);

  useEffect(() => {
    setEditFTP(ftp?.toString() || '');
  }, [ftp]);

  useEffect(() => {
    if (physiology) {
      setFormData(physiology);
      setActiveZoneSystem(physiology.zone_system ?? '5');
    }
  }, [physiology]);

  const hrZones: HRZone[] = physiology
    ? extractHRZones(physiology, activeZoneSystem).length > 0
      ? extractHRZones(physiology, activeZoneSystem)
      : getDefaultHRZones(physiology.hr_max || null, physiology.hr_rest || null)
    : getDefaultHRZones(null);

  const powerZones: PowerZone[] = physiology
    ? extractPowerZones(physiology, ftp, activeZoneSystem).length > 0
      ? extractPowerZones(physiology, ftp, activeZoneSystem)
      : getDefaultPowerZones(ftp)
    : getDefaultPowerZones(ftp);

  const runZones: PaceZone[] = physiology ? extractRunPaceZones(physiology) : [];
  const swimZones: PaceZone[] = physiology ? extractSwimPaceZones(physiology) : [];

  const hasData = !!physiology;
  const source = physiology?.source || 'manual';

  async function handleSave() {
    setSaving(true);
    try {
      const ftpVal = parseInt(editFTP);
      if (!isNaN(ftpVal) && ftpVal > 0) {
        await supabase.from('athlete_ftp').upsert({ athlete_id: athleteId, current_ftp_watts: ftpVal });
        onFTPUpdated(ftpVal);
      }

      const savePayload = { ...formData };
      delete (savePayload as any).id;
      delete (savePayload as any).created_at;
      delete (savePayload as any).updated_at;

      const payload = { ...savePayload, athlete_id: athleteId, source: 'manual' };
      if (physiology) {
        await supabase.from('athlete_physiology').update(payload).eq('athlete_id', athleteId);
      } else {
        await supabase.from('athlete_physiology').insert(payload);
      }
      onPhysiologyUpdated();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function startEditing() {
    setEditing(true);
    setFormData(physiology || {});
    setEditFTP(ftp?.toString() || '');
  }

  const toggleSection = (s: string) => setExpandedSection(prev => prev === s ? null : s);

  const sections = [
    {
      id: 'hr',
      icon: Heart,
      title: 'Heart Rate Zones',
      iconColor: 'bg-red-50 dark:bg-red-900/20 text-red-500',
      emptyText: physiology?.hr_max ? 'HR zones auto-generated from HR Max' : 'Enter HR Max to auto-generate zones',
      zones: hrZones.map((z, i) => {
        const hrMax = physiology?.hr_max || 190;
        const intensity = z.max ? Math.round((z.max / hrMax) * 100) : (z.min ? Math.round((z.min / hrMax) * 100) : 50);
        const c = HR_ZONE_COLORS[i] || HR_ZONE_COLORS[4];
        const range = z.min !== undefined && z.max !== undefined
          ? `${z.min}–${z.max} bpm`
          : z.max !== undefined ? `< ${z.max} bpm` : '—';
        return { zone: z.zone, name: z.name, range, intensity: Math.min(intensity, 100), ...c };
      }),
    },
    {
      id: 'power',
      icon: Zap,
      title: 'Power Zones (Cycling)',
      iconColor: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500',
      emptyText: 'Enter FTP to auto-generate power zones',
      zones: powerZones.map((z, i) => {
        const c = POWER_ZONE_COLORS[i] || POWER_ZONE_COLORS[4];
        const intensity = z.maxPercent ? Math.min(z.maxPercent, 150) / 1.5 : 50;
        const range = z.minWatts !== undefined && z.maxWatts !== undefined
          ? `${z.minWatts}–${z.maxWatts}W (${z.minPercent}–${z.maxPercent}%)`
          : '—';
        return { zone: z.zone, name: z.name, range, intensity, ...c };
      }),
    },
    {
      id: 'run',
      icon: TrendingUp,
      title: 'Running Pace Zones',
      iconColor: 'bg-teal-50 dark:bg-teal-900/20 text-teal-500',
      emptyText: 'Running pace zones sync from lab.asciende.pro or enter manually',
      zones: runZones.map((z, i) => {
        const c = PACE_ZONE_COLORS[i] || PACE_ZONE_COLORS[4];
        const fastestPace = runZones[runZones.length - 1]?.maxPacePerKm || 300;
        const slowestPace = runZones[0]?.minPacePerKm || 600;
        const paceVal = z.minPacePerKm || z.maxPacePerKm || 450;
        const intensity = Math.round(((slowestPace - paceVal) / (slowestPace - fastestPace)) * 100);
        const range = z.minPacePerKm && z.maxPacePerKm
          ? `${formatRunPace(z.minPacePerKm)} – ${formatRunPace(z.maxPacePerKm)}`
          : z.maxPacePerKm ? `< ${formatRunPace(z.maxPacePerKm)}` : '—';
        return { zone: z.zone, name: z.name, range, intensity: Math.max(10, Math.min(intensity, 100)), ...c };
      }),
    },
    {
      id: 'swim',
      icon: Waves,
      title: 'Swimming Pace Zones',
      iconColor: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
      emptyText: 'Swimming pace zones sync from lab.asciende.pro or enter manually',
      zones: swimZones.map((z, i) => {
        const c = PACE_ZONE_COLORS[i] || PACE_ZONE_COLORS[4];
        const fastestPace = swimZones[swimZones.length - 1]?.maxPacePerKm || 700;
        const slowestPace = swimZones[0]?.minPacePerKm || 1200;
        const paceVal = z.minPacePerKm || z.maxPacePerKm || 900;
        const intensity = Math.round(((slowestPace - paceVal) / (slowestPace - fastestPace)) * 100);
        const range = z.minPacePerKm && z.maxPacePerKm
          ? `${formatSwimPace(z.minPacePerKm)} – ${formatSwimPace(z.maxPacePerKm)}`
          : z.maxPacePerKm ? `< ${formatSwimPace(z.maxPacePerKm)}` : '—';
        return { zone: z.zone, name: z.name, range, intensity: Math.max(10, Math.min(intensity, 100)), ...c };
      }),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            hasData && source === 'lab'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
              : hasData
              ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
              : 'bg-gray-100 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700'
          }`}>
            <FlaskConical className="w-3 h-3" />
            {hasData && source === 'lab' ? 'Synced from LAB' : hasData ? 'Manual data' : 'No data'}
          </div>
          {physiology?.updated_at && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Updated {new Date(physiology.updated_at).toLocaleDateString()}
            </span>
          )}
        </div>
        {!editing ? (
          <button onClick={startEditing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <Edit3 className="w-3 h-3" />
            {hasData ? 'Edit data' : 'Enter data'}
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <X className="w-3 h-3" />
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50">
              <Save className="w-3 h-3" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {!hasData && !editing && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">No physiology data</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Data syncs automatically from lab.asciende.pro, or enter it manually.
            </p>
          </div>
        </div>
      )}

      {editing && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-5">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Manual Physiology Entry</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">FTP (watts)</label>
              <input type="number" value={editFTP} onChange={e => setEditFTP(e.target.value)} placeholder="280"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fdda36]" />
            </div>
            {([
              { label: 'HR Max (bpm)', field: 'hr_max' as keyof AthletePhysiology, placeholder: '185' },
              { label: 'HR Rest (bpm)', field: 'hr_rest' as keyof AthletePhysiology, placeholder: '55' },
              { label: 'VO2max (ml/kg/min)', field: 'vo2max' as keyof AthletePhysiology, placeholder: '55', step: '0.1' },
              { label: 'LT HR (bpm)', field: 'lactate_threshold_hr' as keyof AthletePhysiology, placeholder: '162' },
              { label: 'LT Power (%FTP)', field: 'lactate_threshold_power_percent' as keyof AthletePhysiology, placeholder: '95', step: '0.1' },
              { label: 'Run vDOT', field: 'run_vdot' as keyof AthletePhysiology, placeholder: '48', step: '0.1' },
              { label: 'Swim CSS (s/100m)', field: 'swim_css_per_100m' as keyof AthletePhysiology, placeholder: '95' },
            ] as { label: string; field: keyof AthletePhysiology; placeholder: string; step?: string }[]).map(({ label, field, placeholder, step }) => (
              <div key={String(field)}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
                <input type="number" step={step || '1'}
                  value={(formData[field] as number | undefined) || ''}
                  onChange={e => setFormData(p => ({ ...p, [field]: parseFloat(e.target.value) || undefined }))}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fdda36]" />
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Manual Zone Entry (optional)</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['hr_z1', 'hr_z2', 'hr_z3', 'hr_z4', 'hr_z5'] as const).map((zone, i) => (
                <div key={zone} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 w-8">Z{i + 1}</span>
                  <input type="number" placeholder="min bpm"
                    value={(formData[`${zone}_min` as keyof AthletePhysiology] as number | undefined) || ''}
                    onChange={e => setFormData(p => ({ ...p, [`${zone}_min`]: parseInt(e.target.value) || undefined }))}
                    className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#fdda36]" />
                  <span className="text-xs text-gray-400">–</span>
                  <input type="number" placeholder="max bpm"
                    value={(formData[`${zone}_max` as keyof AthletePhysiology] as number | undefined) || ''}
                    onChange={e => setFormData(p => ({ ...p, [`${zone}_max`]: parseInt(e.target.value) || undefined }))}
                    className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#fdda36]" />
                  <span className="text-xs text-gray-400 w-8">bpm</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Testing Notes</label>
            <textarea rows={2} value={formData.notes || ''} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="Testing conditions, equipment, protocol..."
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fdda36] resize-none" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'FTP', value: ftp ? `${ftp}W` : '—', sub: 'Cycling threshold', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'HR Max', value: physiology?.hr_max ? `${physiology.hr_max} bpm` : '—', sub: 'Maximum heart rate', icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'VO2max', value: physiology?.vo2max ? physiology.vo2max.toFixed(1) : '—', sub: 'ml/kg/min', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'vDOT', value: physiology?.run_vdot ? physiology.run_vdot.toFixed(1) : '—', sub: 'Running index', icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${bg}`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {physiology && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Umbral Lactato 1 (LT1)', value: physiology.lt1_hr ? `${physiology.lt1_hr} bpm` : '—' },
            { label: 'Umbral Lactato 2 (LT2)', value: physiology.lactate_threshold_hr ? `${physiology.lactate_threshold_hr} bpm` : '—' },
            { label: 'VAM', value: physiology.vam ? `${physiology.vam} m/h` : '—' },
            { label: 'PAM', value: physiology.pam ? `${physiology.pam} W` : '—' },
            { label: 'LT Power', value: physiology.lactate_threshold_power_percent ? `${physiology.lactate_threshold_power_percent}% FTP` : '—' },
            { label: 'CSS (swim)', value: physiology.swim_css_per_100m ? (() => { const m = Math.floor(physiology.swim_css_per_100m! / 60); const s = Math.round(physiology.swim_css_per_100m! % 60); return `${m}:${s.toString().padStart(2,'0')}/100m`; })() : '—' },
            { label: 'HR Rest', value: physiology.hr_rest ? (physiology.hr_rest + ' bpm') : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{value}</p>
            </div>
          ))}
          {physiology.notes && (
            <div className="sm:col-span-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Testing Notes</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{physiology.notes}</p>
            </div>
          )}
        </div>
      )}

      {hasZones7 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Zone System
            {physiology?.zone_base_method && (
              <span className="ml-2 font-normal normal-case text-gray-400 dark:text-gray-500">
                ({physiology.zone_base_method.replace(/_/g, ' ')})
              </span>
            )}
          </span>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {(['5', '7'] as const).map(sys => (
              <button
                key={sys}
                onClick={() => setActiveZoneSystem(sys)}
                className={'px-3 py-1 text-xs font-semibold transition ' + (
                  activeZoneSystem === sys
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                {sys} zones
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sections.map(({ id, icon: Icon, title, iconColor, emptyText, zones }) => (
          <div key={id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <button onClick={() => toggleSection(id)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
              <div className="flex items-center gap-2.5">
                <div className={'w-8 h-8 rounded-xl flex items-center justify-center ' + iconColor}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{title}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  {zones.length} zones{(id === 'hr' || id === 'power') && hasZones7 ? ` (${activeZoneSystem}-zone)` : ''}
                </span>
              </div>
              {expandedSection === id
                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {expandedSection === id && (
              <div className="px-4 pb-4">
                {zones.length > 0 ? (
                  <div className="space-y-1.5">
                    {zones.map(z => (
                      <ZoneBar key={z.zone} zone={z.zone} name={z.name} range={z.range}
                        intensity={z.intensity} barColor={z.bar} bgColor={z.bg}
                        borderColor={z.border} textColor={z.text} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">{emptyText}</p>
                )}
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}
