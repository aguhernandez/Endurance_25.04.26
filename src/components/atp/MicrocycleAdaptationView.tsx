import { useEffect } from 'react';
import {
  Activity,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Minus,
  ShieldAlert,
  CheckCircle,
  Zap,
  Target,
  BarChart2,
  AlertTriangle,
} from 'lucide-react';
import { useMicrocycleAdaptation } from '../../hooks/useMicrocycleAdaptation';
import {
  MicrocycleAdaptationResult,
  SessionAdjustment,
  SessionAdjustmentType,
  FatigueState,
  MicrocycleAdaptationFocus,
} from '../../lib/microcycleAdaptationEngine';
import { Sport } from '../../types/workout';

interface MicrocycleAdaptationViewProps {
  athleteId: string;
  planStartDate: string | null;
  className?: string;
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const FATIGUE_STATE_STYLES: Record<FatigueState, { bg: string; border: string; text: string; dot: string }> = {
  fresh:       { bg: 'bg-cyan-50',    border: 'border-cyan-200',    text: 'text-cyan-800',    dot: 'bg-cyan-500' },
  optimal:     { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  fatigued:    { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800',   dot: 'bg-amber-500' },
  overreached: { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-800',     dot: 'bg-red-500' },
};

const ADJUSTMENT_STYLES: Record<SessionAdjustmentType, { icon: React.ElementType; color: string; bg: string }> = {
  reduce_duration:    { icon: TrendingDown, color: 'text-amber-700',   bg: 'bg-amber-50' },
  reduce_intensity:   { icon: TrendingDown, color: 'text-orange-700',  bg: 'bg-orange-50' },
  remove_intervals:   { icon: TrendingDown, color: 'text-red-700',     bg: 'bg-red-50' },
  simplify_intervals: { icon: Minus,        color: 'text-yellow-700',  bg: 'bg-yellow-50' },
  increase_duration:  { icon: TrendingUp,   color: 'text-emerald-700', bg: 'bg-emerald-50' },
  add_intensity:      { icon: TrendingUp,   color: 'text-emerald-700', bg: 'bg-emerald-50' },
  convert_to_recovery:{ icon: ShieldAlert,  color: 'text-red-700',     bg: 'bg-red-50' },
  keep_as_planned:    { icon: CheckCircle,  color: 'text-gray-500',    bg: 'bg-gray-50' },
};

const FOCUS_LABELS: Record<MicrocycleAdaptationFocus, { label: string; color: string }> = {
  recovery:            { label: 'Recovery',            color: 'text-red-600' },
  aerobic_base:        { label: 'Aerobic Base',        color: 'text-sky-600' },
  threshold:           { label: 'Threshold',           color: 'text-amber-600' },
  vo2max:              { label: 'VO2max',              color: 'text-orange-600' },
  maintain:            { label: 'Maintain',            color: 'text-gray-600' },
  progressive_overload:{ label: 'Progressive Overload',color: 'text-emerald-600' },
};

const SPORT_LABELS: Record<Sport, string> = {
  cycling: 'Cycling',
  running: 'Running',
  swimming: 'Swimming',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FatigueStateBar({ result }: { result: MicrocycleAdaptationResult }) {
  const cls = result.fatigueClassification;
  const styles = FATIGUE_STATE_STYLES[cls.state];
  const ratio = Math.min(cls.ratio, 2.0);
  const fillPct = Math.round((ratio / 2.0) * 100);

  return (
    <div className={`rounded-xl border ${styles.border} ${styles.bg} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
            <span className={`text-sm font-bold ${styles.text}`}>{cls.label}</span>
            <span className="text-xs text-gray-400 tabular-nums">
              ratio {cls.ratio.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-snug">{cls.description}</p>
        </div>
        <Activity className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.text}`} />
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-[10px] text-gray-400 tabular-nums">
          <span>Fresh &lt;0.8</span>
          <span>Optimal 0.8–1.2</span>
          <span>Fatigued 1.2–1.5</span>
          <span>Overreached &gt;1.5</span>
        </div>
        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-200 via-emerald-200 via-amber-200 to-red-300 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full w-1 ${styles.dot} rounded-full shadow-lg transition-all`}
            style={{ left: `calc(${fillPct}% - 2px)` }}
          />
        </div>
      </div>
    </div>
  );
}

function ScoreSummaryRow({ result }: { result: MicrocycleAdaptationResult }) {
  const focusMeta = FOCUS_LABELS[result.focus];
  const scoreColor = result.avgScore >= 85 ? 'text-emerald-700' : result.avgScore >= 60 ? 'text-amber-700' : 'text-red-700';
  const scoreBg = result.avgScore >= 85 ? 'bg-emerald-50' : result.avgScore >= 60 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className={`rounded-xl p-3 text-center border border-gray-100 ${scoreBg}`}>
        <div className={`text-xl font-bold tabular-nums ${scoreColor}`}>{result.avgScore}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">Avg Score / 100</div>
        <div className="text-[10px] text-gray-400">last {result.avgScoreSessions} sessions</div>
      </div>
      <div className="rounded-xl p-3 text-center border border-gray-100 bg-gray-50">
        <div className="text-xl font-bold tabular-nums text-gray-700">{result.impulseChangePct > 0 ? '+' : ''}{result.impulseChangePct}%</div>
        <div className="text-[10px] text-gray-400 mt-0.5">Load Change</div>
        <div className="text-[10px] text-gray-400">week total</div>
      </div>
      <div className="rounded-xl p-3 text-center border border-gray-100 bg-gray-50">
        <div className={`text-sm font-bold ${focusMeta.color}`}>{focusMeta.label}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">Week Focus</div>
      </div>
    </div>
  );
}

function DeviationBadge({ label, freq, type }: { label: string; freq: number; type: 'over' | 'under' | 'neutral' }) {
  if (freq < 0.2) return null;
  const color = type === 'over' ? 'bg-orange-100 text-orange-700' : type === 'under' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${color}`}>
      {label} ({Math.round(freq * 100)}%)
    </span>
  );
}

function DeviationSummary({ result }: { result: MicrocycleAdaptationResult }) {
  const d = result.deviationSummary;
  const hasSomething = d.dominantDeviation !== null ||
    d.durationOverFreq >= 0.2 || d.durationUnderFreq >= 0.2 ||
    d.intensityOverFreq >= 0.2 || d.intensityUnderFreq >= 0.2;

  if (!hasSomething) return null;

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deviation Patterns</div>
      <div className="flex flex-wrap gap-1.5">
        <DeviationBadge label="Duration over" freq={d.durationOverFreq} type="over" />
        <DeviationBadge label="Duration under" freq={d.durationUnderFreq} type="under" />
        <DeviationBadge label="Intensity high" freq={d.intensityOverFreq} type="over" />
        <DeviationBadge label="Intensity low" freq={d.intensityUnderFreq} type="under" />
        <DeviationBadge label="Load excess" freq={d.loadOverFreq} type="over" />
        <DeviationBadge label="Load shortfall" freq={d.loadUnderFreq} type="under" />
      </div>
    </div>
  );
}

function SessionAdjustmentCard({ adj }: { adj: SessionAdjustment }) {
  const styles = ADJUSTMENT_STYLES[adj.adjustmentType];
  const Icon = styles.icon;
  const isNoChange = adj.adjustmentType === 'keep_as_planned';
  const durationDelta = adj.proposedDurationMinutes - adj.originalDurationMinutes;
  const impulseDelta = Math.round(((adj.proposedImpulse - adj.originalImpulse) / (adj.originalImpulse || 1)) * 100);

  const priorityBadge = adj.priority === 'mandatory'
    ? 'bg-red-100 text-red-700'
    : adj.priority === 'recommended'
    ? 'bg-amber-100 text-amber-700'
    : 'bg-gray-100 text-gray-500';

  return (
    <div className={`rounded-xl border border-gray-100 overflow-hidden ${isNoChange ? 'opacity-60' : ''}`}>
      <div className={`px-3 py-2.5 ${styles.bg}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Icon className={`w-4 h-4 flex-shrink-0 ${styles.color}`} />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{adj.sessionName}</div>
              <div className="text-[11px] text-gray-400">
                {SPORT_LABELS[adj.sport]} · {adj.date}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${priorityBadge}`}>
              {adj.priority}
            </span>
            <span className={`text-[11px] font-medium ${styles.color}`}>{adj.adjustmentLabel}</span>
          </div>
        </div>
      </div>

      {!isNoChange && (
        <div className="px-3 py-2 bg-white border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[
              {
                label: 'Duration',
                original: `${adj.originalDurationMinutes}min`,
                proposed: `${adj.proposedDurationMinutes}min`,
                delta: durationDelta !== 0 ? `${durationDelta > 0 ? '+' : ''}${durationDelta}min` : null,
              },
              {
                label: 'Intensity',
                original: adj.originalIntensityPctFtp !== null ? `${adj.originalIntensityPctFtp}%` : '—',
                proposed: adj.proposedIntensityPctFtp !== null ? `${adj.proposedIntensityPctFtp}%` : '—',
                delta: (adj.originalIntensityPctFtp !== null && adj.proposedIntensityPctFtp !== null && adj.originalIntensityPctFtp !== adj.proposedIntensityPctFtp)
                  ? `${adj.proposedIntensityPctFtp - adj.originalIntensityPctFtp > 0 ? '+' : ''}${adj.proposedIntensityPctFtp - adj.originalIntensityPctFtp}%`
                  : null,
              },
              {
                label: 'Load',
                original: adj.originalImpulse.toFixed(2),
                proposed: adj.proposedImpulse.toFixed(2),
                delta: impulseDelta !== 0 ? `${impulseDelta > 0 ? '+' : ''}${impulseDelta}%` : null,
              },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="text-[10px] text-gray-400">{item.label}</div>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span className="text-xs text-gray-400 line-through">{item.original}</span>
                  <span className="text-xs font-semibold text-gray-800">{item.proposed}</span>
                </div>
                {item.delta && (
                  <div className={`text-[10px] font-medium ${item.delta.startsWith('+') ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {item.delta}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">{adj.rationale}</p>

          {adj.simplifyIntervals && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-700">
              <AlertTriangle className="w-3 h-3" />
              Simplify interval structure (reduce reps or zones)
            </div>
          )}
          {!adj.keepHighIntensity && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-red-600">
              <ShieldAlert className="w-3 h-3" />
              Remove Z4+ intensity work
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ImpulseAdjustmentBanner({ result }: { result: MicrocycleAdaptationResult }) {
  const isPositive = result.impulseChangePct > 0;
  const isNeutral = result.impulseChangePct === 0;
  const bg = isNeutral ? 'bg-gray-50 border-gray-200' : isPositive ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200';
  const text = isNeutral ? 'text-gray-600' : isPositive ? 'text-emerald-700' : 'text-amber-700';
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${bg}`}>
      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${text}`} />
      <div>
        <div className={`text-sm font-semibold ${text}`}>{result.impulse_adjustment}</div>
        <div className="text-xs text-gray-500 mt-0.5">
          {result.totalOriginalImpulse.toFixed(2)} → {result.totalProposedImpulse.toFixed(2)} weekly impulse
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MicrocycleAdaptationView({
  athleteId,
  planStartDate,
  className = '',
}: MicrocycleAdaptationViewProps) {
  const { result, fatigueClassification, loading, error, compute } = useMicrocycleAdaptation(
    athleteId,
    planStartDate
  );

  useEffect(() => {
    compute();
  }, [compute]);

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-800">Microcycle Adaptation</h3>
        </div>
        <button
          onClick={compute}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition px-2 py-1 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Recompute
        </button>
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-24 rounded-xl bg-gray-100" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100" />)}
          </div>
          <div className="h-12 rounded-xl bg-gray-100" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-gray-100" />)}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && !result && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Click Recompute to analyze current microcycle.</p>
        </div>
      )}

      {!loading && result && (
        <>
          <FatigueStateBar result={result} />

          <ScoreSummaryRow result={result} />

          <DeviationSummary result={result} />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reason</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.reason}</p>
          </div>

          <ImpulseAdjustmentBanner result={result} />

          {result.microcycle_adjustments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Session Adjustments ({result.microcycle_adjustments.length})
                </span>
              </div>
              {result.microcycle_adjustments.map(adj => (
                <SessionAdjustmentCard key={adj.sessionId} adj={adj} />
              ))}
            </div>
          )}

          {result.microcycle_adjustments.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
              <CheckCircle className="w-6 h-6 text-gray-300 mx-auto mb-1.5" />
              <p className="text-sm text-gray-400">No planned sessions found for the upcoming week.</p>
              <p className="text-xs text-gray-400 mt-0.5">Schedule workouts to see session-level adjustments.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
