import { useState, useMemo, useRef, useCallback } from 'react';
import { WeekSimResult, DaySimResult, getMonthlyAggregates } from '../../lib/banisterEngine';
import { ATPEvent } from '../../types/workout';

interface ATPChartProps {
  weeks: WeekSimResult[];
  days: DaySimResult[];
  events: ATPEvent[];
  rbMin: number;
  rbPeakTarget: number;
  weekOverrideMap?: Map<number, number>;
  onWeekOverride?: (weekNumber: number, weekStartDate: string, impulse: number) => void;
  onWeekOverrideClear?: (weekNumber: number) => void;
}

type ViewMode = 'weekly' | 'monthly';

function getChartBounds(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.12 || 5;
  return { min: min - pad, max: max + pad };
}

function Row({ label, color, value }: { label: string; color: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className={color}>{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function LegendLine({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="22" height="10"><line x1="0" y1="5" x2="22" y2="5" stroke={color} strokeWidth="2.5" strokeLinecap="round" /></svg>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}

function LegendBar({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-4 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}

export default function ATPChart({
  weeks, days, events, rbMin, rbPeakTarget,
  weekOverrideMap,
  onWeekOverride,
  onWeekOverrideClear,
}: ATPChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  void days;

  const dragState = useRef<{
    active: boolean;
    barIndex: number;
    startY: number;
    startImpulse: number;
    maxImpulse: number;
    barAreaH: number;
    barTop: number;
    svgTop: number;
    svgHeight: number;
  } | null>(null);

  const monthly = useMemo(() => getMonthlyAggregates(weeks), [weeks]);

  const dataPoints = useMemo(() => viewMode === 'weekly'
    ? weeks.map(w => ({
        label: `W${w.weekNumber + 1}`,
        ca: w.ca, al: w.al, rb: w.rb,
        impulse: w.totalImpulse,
        date: w.weekEndDate,
        weekStartDate: w.weekStartDate,
        weekNumber: w.weekNumber,
        hasAEvent: w.hasAEvent,
        hasBEvent: w.hasBEvent,
        isOverride: weekOverrideMap?.has(w.weekNumber) ?? false,
      }))
    : monthly.map(m => {
        const monthWeeks = weeks.filter(w => {
          const d = new Date(w.weekEndDate + 'T00:00:00');
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          return key === m.month;
        });
        const hasAEvent = monthWeeks.some(w => w.hasAEvent);
        const hasBEvent = monthWeeks.some(w => w.hasBEvent);
        const d = new Date(m.month + '-01T00:00:00');
        const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        const firstWeek = monthWeeks[0];
        return {
          label,
          ca: m.ca, al: m.al, rb: m.rb,
          impulse: m.totalImpulse,
          date: m.month,
          weekStartDate: firstWeek?.weekStartDate ?? m.month,
          weekNumber: firstWeek?.weekNumber ?? -1,
          hasAEvent, hasBEvent,
          isOverride: false,
        };
      }), [viewMode, weeks, monthly, weekOverrideMap]);

  if (dataPoints.length === 0) return null;

  const caValues = dataPoints.map(d => d.ca);
  const alValues = dataPoints.map(d => d.al);
  const rbValues = dataPoints.map(d => d.rb);
  const impulseValues = dataPoints.map(d => d.impulse);

  const allLineValues = [...caValues, ...alValues, rbMin - 5, rbPeakTarget + 5];
  const lineBounds = getChartBounds(allLineValues);
  const maxImpulse = Math.max(...impulseValues, 1) * 1.3;

  const COL_W = viewMode === 'weekly' ? 20 : 60;
  const totalW = Math.max(dataPoints.length * COL_W + 80, 700);

  const W = totalW;
  const LINE_H = 210;
  const BAR_H = 80;
  const TOTAL_H = LINE_H + BAR_H + 36;
  const PAD = { top: 22, right: 40, bottom: 28, left: 52 };
  const chartW = W - PAD.left - PAD.right;
  const lineAreaH = LINE_H - PAD.top;

  function xPos(i: number) {
    return PAD.left + (i + 0.5) * (chartW / dataPoints.length);
  }

  function yLine(val: number) {
    const norm = (val - lineBounds.min) / (lineBounds.max - lineBounds.min || 1);
    return PAD.top + (1 - norm) * lineAreaH;
  }

  function buildPath(values: number[]) {
    return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yLine(v).toFixed(1)}`).join(' ');
  }

  const rbBaseY = Math.min(Math.max(yLine(0), PAD.top), LINE_H);
  const rbMinY = yLine(rbMin);
  const rbPeakY = yLine(rbPeakTarget);

  const yGridLines = 5;
  const gridValues = Array.from({ length: yGridLines }, (_, i) =>
    lineBounds.min + (lineBounds.max - lineBounds.min) * (i / (yGridLines - 1))
  );

  const barTop = LINE_H + 10;
  const barAreaH = BAR_H - 14;
  const colW = chartW / dataPoints.length;

  const hovered = hoveredIndex !== null ? dataPoints[hoveredIndex] : null;

  const canDrag = viewMode === 'weekly' && !!onWeekOverride;

  const handleBarMouseDown = useCallback((e: React.MouseEvent, barIndex: number) => {
    if (!canDrag) return;
    e.preventDefault();
    e.stopPropagation();

    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const scaleY = TOTAL_H / rect.height;
    const svgY = (e.clientY - rect.top) * scaleY;
    const startImpulse = dataPoints[barIndex].impulse;

    dragState.current = {
      active: true,
      barIndex,
      startY: svgY,
      startImpulse,
      maxImpulse,
      barAreaH,
      barTop,
      svgTop: rect.top,
      svgHeight: rect.height,
    };

    const onMove = (me: MouseEvent) => {
      if (!dragState.current?.active) return;
      const curRect = svgEl.getBoundingClientRect();
      const curScaleY = TOTAL_H / curRect.height;
      const curSvgY = (me.clientY - curRect.top) * curScaleY;
      const dy = dragState.current.startY - curSvgY;
      const impulsePerPx = dragState.current.maxImpulse / dragState.current.barAreaH;
      const newImpulse = Math.max(0, dragState.current.startImpulse + dy * impulsePerPx);

      const pt = dataPoints[dragState.current.barIndex];
      if (onWeekOverride) {
        onWeekOverride(pt.weekNumber, pt.weekStartDate, Math.round(newImpulse));
      }
    };

    const onUp = () => {
      dragState.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [canDrag, dataPoints, maxImpulse, barAreaH, barTop, onWeekOverride]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Annual Training Plan — Performance Manager</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Fitness (CA) · Fatigue (AL) · Form (RB) · Weekly Load (bars)
            {canDrag && <span className="ml-2 text-blue-500 dark:text-blue-400">· Drag bars to adjust load</span>}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {(['monthly', 'weekly'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                viewMode === mode
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-3">
        <LegendLine color="#2563eb" label="CA — Fitness" />
        <LegendLine color="#f59e0b" label="AL — Fatigue" />
        <LegendLine color="#10b981" label="RB — Form" />
        <LegendBar color="#93c5fd" label="Load (Impulse)" />
        {canDrag && <LegendBar color="#f97316" label="Overridden Load" />}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">A-Race</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">B-Race</span>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto rounded-lg">
        <div style={{ minWidth: totalW, width: totalW }} className="relative" onMouseLeave={() => setHoveredIndex(null)}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${TOTAL_H}`}
            width={W}
            height={TOTAL_H}
            style={{ display: 'block', userSelect: 'none' }}
          >
            {gridValues.map((val, i) => (
              <g key={i}>
                <line
                  x1={PAD.left} y1={yLine(val)}
                  x2={W - PAD.right} y2={yLine(val)}
                  stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="4,3"
                />
                <text x={PAD.left - 5} y={yLine(val) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                  {Math.round(val)}
                </text>
              </g>
            ))}

            <line x1={PAD.left} y1={rbMinY} x2={W - PAD.right} y2={rbMinY}
              stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5,3" opacity="0.55" />
            <text x={W - PAD.right + 3} y={rbMinY + 4} fontSize="9" fill="#ef4444" opacity="0.8">min</text>

            <line x1={PAD.left} y1={rbPeakY} x2={W - PAD.right} y2={rbPeakY}
              stroke="#10b981" strokeWidth="1.2" strokeDasharray="5,3" opacity="0.45" />
            <text x={W - PAD.right + 3} y={rbPeakY + 4} fontSize="9" fill="#10b981" opacity="0.8">peak</text>

            <line x1={PAD.left} y1={rbBaseY} x2={W - PAD.right} y2={rbBaseY}
              stroke="#9ca3af" strokeWidth="0.8" opacity="0.35" />

            {rbValues.map((v, i) => {
              if (i === 0) return null;
              const x0 = xPos(i - 1), x1p = xPos(i);
              const y0 = yLine(rbValues[i - 1]), y1 = yLine(v);
              const above = v >= 0;
              return (
                <polygon
                  key={`rbarea-${i}`}
                  points={`${x0},${rbBaseY} ${x0},${y0} ${x1p},${y1} ${x1p},${rbBaseY}`}
                  fill={above ? '#10b981' : '#ef4444'}
                  opacity="0.1"
                />
              );
            })}

            <path d={buildPath(caValues)} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={buildPath(alValues)} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={buildPath(rbValues)} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {caValues.map((v, i) => (
              hoveredIndex === i ? <circle key={`ca-dot-${i}`} cx={xPos(i)} cy={yLine(v)} r="4" fill="#2563eb" /> : null
            ))}
            {alValues.map((v, i) => (
              hoveredIndex === i ? <circle key={`al-dot-${i}`} cx={xPos(i)} cy={yLine(v)} r="4" fill="#f59e0b" /> : null
            ))}
            {rbValues.map((v, i) => (
              hoveredIndex === i ? <circle key={`rb-dot-${i}`} cx={xPos(i)} cy={yLine(v)} r="4" fill="#10b981" /> : null
            ))}

            {dataPoints.map((pt, i) => {
              if (!pt.hasAEvent && !pt.hasBEvent) return null;
              const x = xPos(i);
              const color = pt.hasAEvent ? '#ef4444' : '#f59e0b';
              return (
                <g key={`evt-${i}`}>
                  <line x1={x} y1={PAD.top} x2={x} y2={LINE_H - 2} stroke={color} strokeWidth="1.5" strokeDasharray="3,2" opacity="0.65" />
                  <circle cx={x} cy={PAD.top + 8} r="6" fill={color} />
                  <text x={x} y={PAD.top + 8} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="white" fontWeight="bold">
                    {pt.hasAEvent ? 'A' : 'B'}
                  </text>
                </g>
              );
            })}

            <line x1={PAD.left} y1={LINE_H} x2={W - PAD.right} y2={LINE_H} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD.left - 5} y={barTop + barAreaH / 2 + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
              Load
            </text>

            {dataPoints.map((pt, i) => {
              const barWidth = Math.max(colW * 0.6, 5);
              const x = xPos(i) - barWidth / 2;
              const bh = Math.max(1, (pt.impulse / maxImpulse) * barAreaH);
              const y = barTop + (barAreaH - bh);

              const isOvr = pt.isOverride;
              const isHov = hoveredIndex === i;
              let barColor: string;
              if (isOvr) {
                barColor = isHov ? '#ea580c' : '#f97316';
              } else if (pt.hasAEvent) {
                barColor = isHov ? '#ef4444' : '#fca5a5';
              } else if (pt.hasBEvent) {
                barColor = isHov ? '#f59e0b' : '#fcd34d';
              } else {
                barColor = isHov ? '#3b82f6' : '#93c5fd';
              }

              return (
                <g key={`bar-${i}`}>
                  <rect
                    x={x} y={y} width={barWidth} height={bh}
                    rx="2"
                    fill={barColor}
                    opacity="0.9"
                    style={{ cursor: canDrag ? 'ns-resize' : 'default' }}
                    onMouseDown={canDrag ? (e) => handleBarMouseDown(e, i) : undefined}
                  />
                  {canDrag && isHov && (
                    <line
                      x1={x - 2} y1={y} x2={x + barWidth + 2} y2={y}
                      stroke={barColor} strokeWidth="2.5" strokeLinecap="round"
                    />
                  )}
                  {isOvr && (
                    <circle cx={xPos(i)} cy={y - 4} r="2.5" fill="#f97316" />
                  )}
                </g>
              );
            })}

            {viewMode === 'monthly' && dataPoints.map((pt, i) => (
              <text key={`xlabel-${i}`} x={xPos(i)} y={TOTAL_H - 4} textAnchor="middle" fontSize="10" fill="#9ca3af" fontWeight="500">
                {pt.label}
              </text>
            ))}

            {viewMode === 'weekly' && dataPoints.map((pt, i) => {
              if (i % 4 !== 0) return null;
              const d = new Date(pt.date + 'T00:00:00');
              const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
              return (
                <text key={`xlabel-${i}`} x={xPos(i)} y={TOTAL_H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">
                  {label}
                </text>
              );
            })}

            {dataPoints.map((_, i) => (
              <rect
                key={`hzone-${i}`}
                x={xPos(i) - colW / 2}
                y={PAD.top}
                width={colW}
                height={LINE_H - PAD.top}
                fill={hoveredIndex === i ? 'rgba(100,116,139,0.06)' : 'transparent'}
                onMouseEnter={() => setHoveredIndex(i)}
              />
            ))}
          </svg>

          {hovered && hoveredIndex !== null && (
            <div
              className="absolute pointer-events-none bg-gray-900/95 text-white rounded-xl p-3 shadow-2xl text-xs z-20 min-w-[175px]"
              style={{
                left: `${Math.min(Math.max((hoveredIndex / dataPoints.length) * 100, 5), 80)}%`,
                top: '4%',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="font-semibold mb-2 text-gray-100 border-b border-gray-700 pb-1.5">
                {viewMode === 'monthly'
                  ? (() => { try { return new Date(hovered.date + '-01T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); } catch { return hovered.date; } })()
                  : hovered.date}
                {hovered.isOverride && <span className="ml-2 text-orange-400 text-[10px]">edited</span>}
              </div>
              <div className="space-y-1">
                <Row label="CA (Fitness)" color="text-blue-400" value={hovered.ca.toFixed(1)} />
                <Row label="AL (Fatigue)" color="text-amber-400" value={hovered.al.toFixed(1)} />
                <Row
                  label="RB (Form)"
                  color={hovered.rb >= 0 ? 'text-emerald-400' : 'text-red-400'}
                  value={`${hovered.rb > 0 ? '+' : ''}${hovered.rb.toFixed(1)}`}
                />
                <div className="pt-1 mt-1 border-t border-gray-700">
                  <Row label="Load" color="text-gray-300" value={hovered.impulse.toFixed(0)} />
                </div>
                {(hovered.hasAEvent || hovered.hasBEvent) && (
                  <div className={`mt-1.5 text-center px-2 py-0.5 rounded-full text-[10px] font-bold ${hovered.hasAEvent ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/30 text-amber-300'}`}>
                    {hovered.hasAEvent ? 'A-Race — Taper week' : 'B-Race — Short taper'}
                  </div>
                )}
                {hovered.isOverride && canDrag && onWeekOverrideClear && (
                  <button
                    className="pointer-events-auto mt-2 w-full text-center py-1 rounded bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 text-[10px] transition"
                    onMouseDown={e => { e.stopPropagation(); onWeekOverrideClear(hovered.weekNumber); }}
                  >
                    Reset to auto
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 px-1">
        <div className="flex items-center gap-3">
          <span>RB Min floor: <strong>{rbMin}</strong></span>
          <span>RB Peak target: <strong>+{rbPeakTarget}</strong></span>
        </div>
        {viewMode === 'weekly' && (
          <span>{dataPoints.length} weeks — scroll to explore{canDrag ? ' · drag bars to adjust load' : ''}</span>
        )}
      </div>
    </div>
  );
}
