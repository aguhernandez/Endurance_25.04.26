import { useEffect } from 'react';
import { X, TrendingUp, Activity, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { WeeklySummaryData, getRBStatus } from '../lib/weeklySummary';

interface WeeklyAtpDrawerProps {
  week: WeeklySummaryData | null;
  onClose: () => void;
}

function getLoadStatus(planned: number, actual: number, projected: number) {
  const pct = planned > 0 ? (projected / planned) * 100 : 0;
  if (pct >= 95 && pct <= 115) return { label: 'On Track', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle };
  if (pct < 80) return { label: 'Under Load', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', icon: AlertTriangle };
  if (pct > 120) return { label: 'Over Load', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', icon: AlertTriangle };
  return { label: 'Nearly There', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: Target };
}

export default function WeeklyAtpDrawer({ week, onClose }: WeeklyAtpDrawerProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed right-0 top-0 h-full w-[380px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${week ? 'translate-x-0' : 'translate-x-full'}`}>
        {week && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Semana {week.weekNumber + 1}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(week.weekStartDate)} — {formatDate(week.weekEndDate)}
                  {week.isCurrentWeek && (
                    <span className="ml-2 text-amber-500 font-semibold">• Esta semana</span>
                  )}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Load Status Banner */}
              {(() => {
                const status = getLoadStatus(week.plannedTotalImpulse, week.actualTotalImpulse, week.projectedTotalImpulse);
                const StatusIcon = status.icon;
                return (
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${status.bg}`}>
                    <StatusIcon size={20} className={status.color} />
                    <div>
                      <p className={`text-sm font-bold ${status.color}`}>{status.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {week.plannedTotalImpulse > 0
                          ? `${Math.round((week.projectedTotalImpulse / week.plannedTotalImpulse) * 100)}% del objetivo`
                          : 'Sin objetivo ATP configurado'}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Impulse Card */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={15} className="text-blue-500" />
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Impulso Semanal</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">Planificado</p>
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{week.plannedTotalImpulse.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">Real</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{week.actualTotalImpulse.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">Proyectado</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{week.projectedTotalImpulse.toFixed(0)}</p>
                  </div>
                </div>
                {week.plannedTotalImpulse > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Progreso</span>
                      <span>{Math.round((week.projectedTotalImpulse / week.plannedTotalImpulse) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          week.projectedTotalImpulse >= week.plannedTotalImpulse * 0.95 ? 'bg-emerald-500' :
                          week.projectedTotalImpulse < week.plannedTotalImpulse * 0.8 ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (week.projectedTotalImpulse / week.plannedTotalImpulse) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CA / AF / RB Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <TrendingUp size={14} className="text-emerald-500 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">CA (Forma)</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {(week.actualEndCA || week.projectedEndCA).toFixed(0)}
                  </p>
                  <p className="text-[10px] text-gray-400">objetivo {week.plannedEndCA.toFixed(0)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                  <Activity size={14} className="text-amber-500 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">AF (Fatiga)</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {(week.actualEndAF || week.projectedEndAF).toFixed(0)}
                  </p>
                  <p className="text-[10px] text-gray-400">objetivo {week.plannedEndAF.toFixed(0)}</p>
                </div>
                <div className={`rounded-xl p-3 text-center ${getRBStatus(week.actualEndRB || week.projectedEndRB).bg} ${getRBStatus(week.actualEndRB || week.projectedEndRB).border} border`}>
                  <Target size={14} className={`${getRBStatus(week.actualEndRB || week.projectedEndRB).color} mx-auto mb-1`} />
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">RB (Balance)</p>
                  <p className={`text-lg font-bold ${getRBStatus(week.actualEndRB || week.projectedEndRB).color}`}>
                    {(week.actualEndRB || week.projectedEndRB).toFixed(0)}
                  </p>
                  <p className="text-[10px] text-gray-400">{getRBStatus(week.actualEndRB || week.projectedEndRB).label}</p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-800 dark:text-blue-200 mb-2">Recomendacion</p>
                {(() => {
                  const impulseGap = week.plannedTotalImpulse - week.projectedTotalImpulse;
                  const rb = week.actualEndRB || week.projectedEndRB;
                  const rbStatus = getRBStatus(rb);

                  if (impulseGap > 20) {
                    return <p className="text-xs text-blue-700 dark:text-blue-300">Faltan <strong>{impulseGap.toFixed(0)} puntos</strong> de impulso. Agrega {Math.ceil(impulseGap / 15)} sesion(es) mas o aumenta la intensidad de las existentes.</p>;
                  } else if (impulseGap < -20) {
                    return <p className="text-xs text-blue-700 dark:text-blue-300">Carga <strong>{Math.abs(impulseGap).toFixed(0)} puntos</strong> por encima del objetivo. Considera reducir o eliminar alguna sesion para evitar sobreentrenamiento.</p>;
                  } else if (rb < -30) {
                    return <p className="text-xs text-blue-700 dark:text-blue-300">Balance negativo (<strong>{rb.toFixed(0)}</strong>). Prioriza recuperacion activa y considera reducir intensidad esta semana.</p>;
                  } else if (rb > 15) {
                    return <p className="text-xs text-blue-700 dark:text-blue-300">Muy descansado (<strong>RB {rb.toFixed(0)}</strong>). Es buen momento para una semana de mayor carga o sesion de calidad.</p>;
                  } else {
                    return <p className="text-xs text-blue-700 dark:text-blue-300">Semana bien equilibrada. Mantiene el plan tal como esta planificado.</p>;
                  }
                })()}
              </div>

              {/* Daily Breakdown */}
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Dias de la Semana</p>
                <div className="space-y-1.5">
                  {week.days.map(day => {
                    const d = new Date(day.date + 'T00:00:00');
                    const label = d.toLocaleDateString('es', { weekday: 'short', day: 'numeric' });
                    return (
                      <div key={day.date} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400 w-20 capitalize">{label}</p>
                        <div className="flex-1">
                          {day.plannedImpulse > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className={`h-1.5 rounded-full ${day.isCompleted ? 'bg-emerald-400' : day.hasPlannedWorkout ? 'bg-blue-400' : 'bg-gray-300'}`}
                                style={{ width: `${Math.min(100, (day.plannedImpulse / (week.plannedTotalImpulse / 7)) * 50)}px` }}
                              />
                              <span className="text-[10px] text-gray-400">{day.plannedImpulse.toFixed(0)} pts</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-300 dark:text-gray-600">Descanso</span>
                          )}
                        </div>
                        {day.isCompleted && (
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">OK</span>
                        )}
                        {day.hasPlannedWorkout && !day.isCompleted && (
                          <span className="text-[9px] font-bold text-blue-500">Plan</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
