import { useMemo, useState } from 'react';
import { RefreshCw, Sparkles, Lock, Info, Trash2, RotateCcw } from 'lucide-react';
import { useAuth, hasAIAccess } from '../../contexts/AuthContext';
import { useATPPlan } from '../../hooks/useATPPlan';
import { useAIBlock } from '../../hooks/useAIBlock';
import { runATPSimulation, ATPParams, ATPEvent as EngineEvent } from '../../lib/banisterEngine';
import { ATPEvent, ATPPlan } from '../../types/workout';
import ATPParamsPanel from '../atp/ATPParamsPanel';
import ATPEventsPanel from '../atp/ATPEventsPanel';
import ATPChart from '../atp/ATPChart';
import ATPWeeklyTable from '../atp/ATPWeeklyTable';
import ATPSummaryStats from '../atp/ATPSummaryStats';
import AIBlockGenerator from '../ai/AIBlockGenerator';

interface Props {
  athleteId: string;
  athleteName?: string;
  isCoach: boolean;
}

function mapEventsToEngine(events: ATPEvent[]): EngineEvent[] {
  return events.map(e => ({
    id: e.id,
    eventName: e.event_name,
    eventDate: e.event_date,
    priority: e.priority,
  }));
}

function paramsFromPlan(plan: ATPPlan): ATPParams {
  return {
    caStart: plan.ca_start,
    alStart: plan.al_start,
    tauChronic: plan.tau_chronic,
    tauAcute: plan.tau_acute,
    rbMin: plan.rb_min,
    rbPeakTarget: plan.rb_peak_target,
    caTargetMainEvent: plan.ca_target_main_event,
    planStartDate: plan.plan_start_date,
  };
}

export default function AthleteATPPanel({ athleteId, athleteName, isCoach }: Props) {
  const { profile, user } = useAuth();
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [liveParams, setLiveParams] = useState<Partial<ATPPlan> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    plan, events, weekOverrides, engineOverrides,
    loading, saving,
    savePlan, deletePlan,
    addEvent, removeEvent,
    setWeekOverride, clearWeekOverride, clearAllOverrides,
  } = useATPPlan(athleteId);

  const { settings: aiSettings } = useAIBlock(null);

  const canUseAI = isCoach
    ? (aiSettings?.ai_enabled && aiSettings?.coaches_can_send)
    : (aiSettings?.ai_enabled && hasAIAccess(user?.membership_slug));

  const aiLockedReason = !aiSettings?.ai_enabled
    ? 'AI generation is currently disabled by the administrator'
    : !isCoach && !hasAIAccess(user?.membership_slug)
    ? 'Requires Asciende Intermediate or Asciende Pro membership'
    : null;

  const effectiveParams: ATPParams | null = useMemo(() => {
    if (!plan) return null;
    const base = paramsFromPlan(plan);
    if (!liveParams) return base;
    return {
      caStart: (liveParams.ca_start ?? base.caStart),
      alStart: (liveParams.al_start ?? base.alStart),
      tauChronic: (liveParams.tau_chronic ?? base.tauChronic),
      tauAcute: (liveParams.tau_acute ?? base.tauAcute),
      rbMin: (liveParams.rb_min ?? base.rbMin),
      rbPeakTarget: (liveParams.rb_peak_target ?? base.rbPeakTarget),
      caTargetMainEvent: (liveParams.ca_target_main_event ?? base.caTargetMainEvent),
      planStartDate: (liveParams.plan_start_date ?? base.planStartDate),
    };
  }, [plan, liveParams]);

  const simResult = useMemo(() => {
    if (!effectiveParams) return null;
    return runATPSimulation(effectiveParams, mapEventsToEngine(events), engineOverrides);
  }, [effectiveParams, events, engineOverrides]);

  const weeks = simResult?.weeks || [];
  const days = simResult?.days || [];

  const weekOverrideMap = useMemo(() => {
    const m = new Map<number, number>();
    for (const o of weekOverrides) m.set(o.week_number, o.override_impulse);
    return m;
  }, [weekOverrides]);

  const handleDeletePlan = async () => {
    await deletePlan();
    setConfirmDelete(false);
    setLiveParams(null);
  };

  const noAEvents = events.filter(e => e.priority === 'A').length === 0;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Banister Fitness-Fatigue model · Live simulation · Updates as you type
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RefreshCw size={14} className="animate-spin" />
              Loading...
            </div>
          )}
          {weekOverrides.length > 0 && (
            <button onClick={clearAllOverrides} disabled={saving}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition">
              <RotateCcw size={13} />
              Reset load ({weekOverrides.length})
            </button>
          )}
          {plan && (
            <button onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              <Trash2 size={13} />
              Delete plan
            </button>
          )}
          {canUseAI ? (
            <button onClick={() => setShowAIGenerator(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]">
              <Sparkles size={14} />
              AI Block
            </button>
          ) : (
            <div className="relative group">
              <button disabled className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium cursor-not-allowed">
                <Lock size={13} />
                AI Block
              </button>
              {aiLockedReason && (
                <div className="absolute right-0 top-full mt-2 z-10 w-64 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {aiLockedReason}
                  <div className="absolute -top-1.5 right-5 w-3 h-3 bg-gray-900 dark:bg-gray-800 rotate-45" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {noAEvents && plan && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Info size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Add A-priority races first</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              The simulation builds around your target events. Add your main race(s) first.
            </p>
          </div>
        </div>
      )}

      {simResult && (
        <ATPSummaryStats weeks={weeks} caStart={effectiveParams!.caStart} rbMin={effectiveParams!.rbMin} rbPeakTarget={effectiveParams!.rbPeakTarget} />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-1 space-y-5">
          <ATPEventsPanel events={events} planId={plan?.id || null} onAdd={addEvent} onRemove={removeEvent} saving={saving} />
          <ATPParamsPanel plan={plan} onSave={async (p) => { setLiveParams(p); await savePlan(p); }} onChange={setLiveParams} saving={saving} />
        </div>
        <div className="xl:col-span-2 space-y-5">
          {simResult && weeks.length > 0 ? (
            <>
              <ATPChart weeks={weeks} days={days} events={events} rbMin={effectiveParams!.rbMin} rbPeakTarget={effectiveParams!.rbPeakTarget}
                weekOverrideMap={weekOverrideMap} onWeekOverride={setWeekOverride} onWeekOverrideClear={clearWeekOverride} />
              <ATPWeeklyTable weeks={weeks} weekOverrideMap={weekOverrideMap} onWeekOverride={setWeekOverride} onWeekOverrideClear={clearWeekOverride} />
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <RefreshCw size={22} className="text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No simulation yet</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                Add target races, then adjust Banister parameters. The chart updates live as you type.
              </p>
            </div>
          )}
        </div>
      </div>

      {showAIGenerator && (
        <AIBlockGenerator athleteId={athleteId} athleteName={athleteName} coachId={isCoach ? profile?.id : undefined}
          requestedByRole={isCoach ? 'coach' : 'athlete'} onClose={() => setShowAIGenerator(false)} />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Annual Training Plan?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This will permanently delete the plan, all events, and all manual load overrides. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                Cancel
              </button>
              <button onClick={handleDeletePlan} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition">
                {saving ? 'Deleting...' : 'Delete Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
