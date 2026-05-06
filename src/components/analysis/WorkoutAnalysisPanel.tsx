import { useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  Clock,
  BarChart2,
  Brain,
} from 'lucide-react';
import { StoredWorkoutAnalysis, useWorkoutAnalysis } from '../../hooks/useWorkoutAnalysis';

interface WorkoutAnalysisPanelProps {
  workoutId: string;
  className?: string;
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : score >= 60
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-red-100 text-red-800 border-red-200';

  return (
    <div className={`flex flex-col items-center px-4 py-3 rounded-xl border ${color}`}>
      <span className="text-2xl font-bold tabular-nums">{Math.round(score)}</span>
      <span className="text-xs font-medium mt-0.5">{label}</span>
    </div>
  );
}

function ClassificationBadge({ classification }: { classification: 'green' | 'yellow' | 'red' }) {
  if (classification === 'green') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" />
        On Target
      </span>
    );
  }
  if (classification === 'yellow') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-3.5 h-3.5" />
        Minor Deviations
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
      <XCircle className="w-3.5 h-3.5" />
      Significant Deviations
    </span>
  );
}

function DeviationRow({
  label,
  planned,
  actual,
  pct,
  direction,
  unit = '',
}: {
  label: string;
  planned: number;
  actual: number;
  pct: number;
  direction: 'over' | 'under' | 'on_target';
  unit?: string;
}) {
  const isOnTarget = direction === 'on_target';
  const isOver = direction === 'over';

  const iconColor = isOnTarget
    ? 'text-emerald-500'
    : isOver
    ? 'text-amber-500'
    : 'text-blue-400';

  const Icon = isOnTarget ? Minus : isOver ? TrendingUp : TrendingDown;

  const pctText = isOnTarget
    ? 'On target'
    : `${isOver ? '+' : ''}${pct}%`;

  const pctColor = isOnTarget
    ? 'text-emerald-600 font-medium'
    : Math.abs(pct) <= 15
    ? 'text-amber-600 font-medium'
    : 'text-red-600 font-semibold';

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
        <span className="text-sm text-gray-700 font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-400">
          Plan: <span className="text-gray-600">{Math.round(planned)}{unit}</span>
        </span>
        <span className="text-gray-400">
          Actual: <span className="text-gray-700 font-medium">{Math.round(actual)}{unit}</span>
        </span>
        <span className={`w-20 text-right tabular-nums ${pctColor}`}>{pctText}</span>
      </div>
    </div>
  );
}

function BanisterRow({ label, value, delta }: { label: string; value: number; delta?: number }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        {delta !== undefined && (
          <span className={`text-xs tabular-nums ${delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {delta >= 0 ? '+' : ''}{delta.toFixed(2)}
          </span>
        )}
        <span className="text-sm font-semibold text-gray-800 tabular-nums w-16 text-right">
          {value.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function ZoneBar({ zone, seconds, totalSeconds }: { zone: string; seconds: number; totalSeconds: number }) {
  const pct = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;
  const zoneColors: Record<string, string> = {
    z1: 'bg-sky-300',
    z2: 'bg-emerald-400',
    z3: 'bg-yellow-400',
    z4: 'bg-orange-400',
    z5: 'bg-red-400',
    z6: 'bg-rose-600',
    z7: 'bg-purple-600',
  };
  const color = zoneColors[zone] ?? 'bg-gray-300';

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-5 uppercase font-mono">{zone}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-2 w-24 justify-end">
        <span className="text-xs text-gray-500 tabular-nums">{fmt(seconds)}</span>
        <span className="text-xs text-gray-400 tabular-nums">({Math.round(pct)}%)</span>
      </div>
    </div>
  );
}

function AnalysisContent({ analysis }: { analysis: StoredWorkoutAnalysis }) {
  const deviations = analysis.deviations ?? [];
  const insights = analysis.insights ?? [];
  const timeInZones = analysis.time_in_zones;

  const totalZoneSecs = timeInZones
    ? Object.values(timeInZones).reduce((s, v) => s + (v ?? 0), 0)
    : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-800">Session Analysis</h3>
        </div>
        <ClassificationBadge classification={analysis.classification} />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <ScoreBadge score={analysis.final_score} label="Overall" />
        <ScoreBadge score={analysis.completion_score} label="Completion" />
        <ScoreBadge score={analysis.intensity_score} label="Intensity" />
        <ScoreBadge score={analysis.load_score} label="Load" />
      </div>

      {deviations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-700">Execution vs Plan</h4>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-1 divide-y divide-gray-100">
            {deviations.map(d => (
              <DeviationRow
                key={d.field}
                label={d.label}
                planned={d.planned}
                actual={d.actual}
                pct={d.pct}
                direction={d.direction}
                unit={d.field === 'duration' ? ' min' : d.field === 'intensity' ? '%' : ''}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <h4 className="text-sm font-semibold text-gray-700">Training Load (Banister)</h4>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-1 divide-y divide-gray-100">
          <BanisterRow label="Fitness (CTL)" value={analysis.fitness} />
          <BanisterRow label="Fatigue (ATL)" value={analysis.fatigue} />
          <BanisterRow
            label="Form (Readiness)"
            value={analysis.form}
          />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Load Planned</span>
            <span className="text-sm font-semibold text-gray-800 tabular-nums">
              {analysis.impulse_planned.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Load Actual</span>
            <span className="text-sm font-semibold text-gray-800 tabular-nums">
              {analysis.impulse_actual.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {timeInZones && totalZoneSecs > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-700">Time in Zones</h4>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-2">
            {Object.entries(timeInZones)
              .sort(([a], [b]) => a.localeCompare(b))
              .filter(([, v]) => v > 0)
              .map(([zone, seconds]) => (
                <ZoneBar
                  key={zone}
                  zone={zone}
                  seconds={seconds}
                  totalSeconds={totalZoneSecs}
                />
              ))}
          </div>
        </div>
      )}

      {insights.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-700">Insights</h4>
          </div>
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700"
              >
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
        <Clock className="w-3 h-3" />
        <span>
          Analysis v{analysis.analysis_version} ·{' '}
          {new Date(analysis.created_at).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}

export default function WorkoutAnalysisPanel({ workoutId, className = '' }: WorkoutAnalysisPanelProps) {
  const { analysis, loading, refetch } = useWorkoutAnalysis(workoutId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div className={`rounded-2xl border border-gray-200 bg-white p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-100 rounded w-40" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
          <div className="h-32 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={`rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center ${className}`}>
        <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No analysis available yet.</p>
        <p className="text-xs text-gray-400 mt-1">Analysis runs automatically when a session is marked complete.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-6 ${className}`}>
      <AnalysisContent analysis={analysis} />
    </div>
  );
}
