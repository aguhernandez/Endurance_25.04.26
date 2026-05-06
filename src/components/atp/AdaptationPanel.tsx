import { useEffect, useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldAlert,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { StoredAdaptation, usePendingAdaptations, applyAdaptation, dismissAdaptation, useAdaptationHistory } from '../../hooks/useAdaptation';
import { AdaptationRuleId } from '../../lib/microcycleAdaptationEngine';

interface AdaptationPanelProps {
  athleteId: string;
  planId: string | null;
  onApplied?: () => void;
}

const RULE_META: Record<AdaptationRuleId, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  FATIGUE_CRITICAL:               { icon: ShieldAlert,  color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200' },
  FATIGUE_HIGH:                   { icon: TrendingDown, color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200' },
  INJURY_CONCERN:                 { icon: ShieldAlert,  color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200' },
  WELLNESS_RED_FLAG:              { icon: AlertTriangle,color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  PRE_EVENT_TAPER_ADJUST:         { icon: TrendingDown, color: 'text-sky-700',     bg: 'bg-sky-50',     border: 'border-sky-200' },
  MICROCYCLE_RECOVERY_PROTECT:    { icon: TrendingDown, color: 'text-teal-700',    bg: 'bg-teal-50',    border: 'border-teal-200' },
  LOAD_UNDERACHIEVEMENT_SEVERE:   { icon: TrendingDown, color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  LOAD_UNDERACHIEVEMENT_MODERATE: { icon: TrendingDown, color: 'text-yellow-700',  bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  LOAD_OVERACHIEVEMENT_SEVERE:    { icon: TrendingDown, color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200' },
  LOAD_OVERACHIEVEMENT_MODERATE:  { icon: TrendingDown, color: 'text-yellow-700',  bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  FORM_POSITIVE:                  { icon: TrendingUp,   color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  CONSISTENT_UNDERPERFORMANCE:    { icon: TrendingDown, color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200' },
  CONSISTENT_OVERPERFORMANCE:     { icon: TrendingUp,   color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  NO_ADAPTATION_NEEDED:           { icon: CheckCircle,  color: 'text-gray-500',    bg: 'bg-gray-50',    border: 'border-gray-200' },
};

function LoadDeltaBadge({ pct }: { pct: number }) {
  if (pct === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
        No change
      </span>
    );
  }
  const isUp = pct > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isUp
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-amber-100 text-amber-800'
      }`}
    >
      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isUp ? '+' : ''}{pct}%
    </span>
  );
}

function SafetyFlagBadge({ flag }: { flag: { code: string; message: string; severity: 'warning' | 'block' } }) {
  const isBlock = flag.severity === 'block';
  return (
    <div
      className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${
        isBlock
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}
    >
      <ShieldAlert className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isBlock ? 'text-red-500' : 'text-amber-500'}`} />
      <span>{flag.message}</span>
    </div>
  );
}

function AdaptationCard({
  adaptation,
  onApply,
  onDismiss,
}: {
  adaptation: StoredAdaptation;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);
  const meta = RULE_META[adaptation.rule_id] ?? RULE_META.NO_ADAPTATION_NEEDED;
  const Icon = meta.icon;
  const flags = adaptation.safety_flags ?? [];
  const hasBlockFlag = flags.some(f => f.severity === 'block');

  const handleApply = async () => {
    setApplying(true);
    onApply();
  };

  return (
    <div className={`rounded-2xl border ${meta.border} ${meta.bg} overflow-hidden transition-all`}>
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg} border ${meta.border}`}>
              <Icon className={`w-4.5 h-4.5 ${meta.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className={`text-sm font-semibold ${meta.color}`}>{adaptation.rule_label}</h4>
                <LoadDeltaBadge pct={adaptation.load_delta_pct} />
                {hasBlockFlag && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                    <ShieldAlert className="w-3 h-3" />
                    Safety
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Week {adaptation.week_number + 1} · starts {new Date(adaptation.week_start_date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition text-gray-400"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: 'Current Plan', value: adaptation.previous_impulse.toFixed(2), sub: 'weekly impulse' },
            { label: 'Proposed', value: adaptation.proposed_impulse.toFixed(2), sub: 'weekly impulse', highlight: true },
            { label: 'Change', value: `${adaptation.load_delta_pct > 0 ? '+' : ''}${adaptation.load_delta_pct}%`, sub: 'load delta' },
          ].map(item => (
            <div
              key={item.label}
              className={`rounded-xl px-3 py-2 text-center border ${item.highlight ? `${meta.border} bg-white` : 'border-gray-200 bg-white/60'}`}
            >
              <div className={`text-base font-bold tabular-nums ${item.highlight ? meta.color : 'text-gray-700'}`}>
                {item.value}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {expanded && (
          <div className="mt-3 space-y-2.5">
            <p className="text-sm text-gray-700 leading-relaxed">{adaptation.rationale}</p>

            {flags.length > 0 && (
              <div className="space-y-1.5">
                {flags.map((f, i) => (
                  <SafetyFlagBadge key={i} flag={f} />
                ))}
              </div>
            )}
          </div>
        )}

        {adaptation.status === 'pending' && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleApply}
              disabled={applying}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold border transition ${
                meta.color
              } ${meta.bg} ${meta.border} hover:opacity-80 disabled:opacity-50`}
            >
              {applying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              Apply to Plan
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 border border-gray-200 hover:bg-gray-100 transition"
            >
              <XCircle className="w-3.5 h-3.5" />
              Dismiss
            </button>
          </div>
        )}

        {adaptation.status !== 'pending' && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            {adaptation.status === 'approved' ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-medium">Applied</span>
                {adaptation.applied_at && (
                  <span className="text-gray-400 ml-1">
                    · {new Date(adaptation.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400">Dismissed</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HistorySection({ athleteId }: { athleteId: string }) {
  const { history, loading, refetch } = useAdaptationHistory(athleteId, 10);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  const applied = history.filter(h => h.status !== 'pending');

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
      >
        <Clock className="w-4 h-4" />
        <span>Adaptation History</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {loading && (
            <div className="text-sm text-gray-400 py-4 text-center">Loading...</div>
          )}
          {!loading && applied.length === 0 && (
            <p className="text-sm text-gray-400 py-3 text-center">No adaptation history yet.</p>
          )}
          {!loading && applied.map(a => {
            const meta = RULE_META[a.rule_id] ?? RULE_META.NO_ADAPTATION_NEEDED;
            const isApproved = a.status === 'approved';
            return (
              <div
                key={a.id}
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isApproved ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isApproved ? meta.color : 'text-gray-400'}`}>
                      {a.rule_label}
                    </span>
                    <LoadDeltaBadge pct={a.load_delta_pct} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Week {a.week_number + 1} · {new Date(a.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}{isApproved ? 'Applied' : 'Dismissed'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdaptationPanel({ athleteId, planId, onApplied }: AdaptationPanelProps) {
  const { adaptations, loading, refetch } = usePendingAdaptations(athleteId, planId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleApply = async (adaptation: StoredAdaptation) => {
    if (!planId) return;
    const result = await applyAdaptation(adaptation, planId, athleteId);
    if (result.success) {
      refetch();
      onApplied?.();
    }
  };

  const handleDismiss = async (adaptationId: string) => {
    await dismissAdaptation(adaptationId);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-800">Microcycle Adaptations</h3>
          {adaptations.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              {adaptations.length}
            </span>
          )}
        </div>
        <button
          onClick={refetch}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-48" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && adaptations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <CheckCircle className="w-7 h-7 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No pending adaptations.</p>
          <p className="text-xs text-gray-400 mt-1">
            Adaptations are generated automatically after weekly review.
          </p>
        </div>
      )}

      {!loading && adaptations.map(a => (
        <AdaptationCard
          key={a.id}
          adaptation={a}
          onApply={() => handleApply(a)}
          onDismiss={() => handleDismiss(a.id)}
        />
      ))}

      <div className="pt-2 border-t border-gray-100">
        <HistorySection athleteId={athleteId} />
      </div>
    </div>
  );
}
