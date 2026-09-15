import { useState, useRef, useMemo } from 'react';

interface BarChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  unit?: string;
  highlightBest?: boolean;
  highlightWorst?: boolean;
  averageLine?: boolean;
  formatValue?: (v: number) => string;
  formatLabel?: (l: string) => string;
}

export function BarChart({
  data,
  labels,
  color = '#3b82f6',
  height = 200,
  unit = '',
  highlightBest = false,
  highlightWorst = false,
  averageLine = true,
  formatValue = (v) => v.toFixed(1),
  formatLabel = (l) => l,
}: BarChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(600);

  useMemo(() => {
    if (containerRef.current) {
      const ro = new ResizeObserver((entries) => {
        setContainerW(entries[0].contentRect.width);
      });
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    }
  }, []);

  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data.filter((v) => isFinite(v)));
  const range = max - min || 1;
  const avg = data.reduce((s, v) => s + v, 0) / data.length;
  const barW = data.length > 30 ? Math.max(4, containerW / data.length - 2) : Math.max(20, containerW / data.length - 4);
  const gap = data.length > 30 ? 2 : 4;
  const chartH = height;
  const padTop = 20;
  const padBottom = 24;
  const plotH = chartH - padTop - padBottom;
  const bestIdx = data.indexOf(max);
  const worstIdx = data.indexOf(min);

  const avgY = padTop + plotH - ((avg - min) / range) * plotH;

  return (
    <div ref={containerRef} className="w-full relative">
      <svg width={containerW} height={chartH} className="overflow-visible">
        {averageLine && (
          <g>
            <line
              x1={0}
              x2={containerW}
              y1={avgY}
              y2={avgY}
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text x={containerW - 4} y={avgY - 4} textAnchor="end" fontSize={10} fill="#6b7280">
              avg {formatValue(avg)}{unit}
            </text>
          </g>
        )}
        {data.map((v, i) => {
          const x = i * (barW + gap);
          const h = ((v - min) / range) * plotH;
          const y = padTop + plotH - h;
          let barColor = color;
          if (highlightBest && i === bestIdx) barColor = '#10b981';
          if (highlightWorst && i === worstIdx) barColor = '#ef4444';
          return (
            <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={2}
                fill={barColor}
                opacity={hoverIdx === null || hoverIdx === i ? 0.85 : 0.4}
                className="transition-opacity duration-150"
              />
              {labels && data.length <= 30 && (
                <text x={x + barW / 2} y={chartH - 6} textAnchor="middle" fontSize={9} fill="#9ca3af">
                  {formatLabel(labels[i] || '')}
                </text>
              )}
            </g>
          );
        })}
        {hoverIdx !== null && (
          <g>
            <rect
              x={Math.min(hoverIdx * (barW + gap), containerW - 100)}
              y={0}
              width={100}
              height={padTop}
              fill="rgba(0,0,0,0.75)"
              rx={4}
            />
            <text
              x={Math.min(hoverIdx * (barW + gap), containerW - 100) + 8}
              y={14}
              fontSize={11}
              fill="white"
            >
              {labels ? formatLabel(labels[hoverIdx] || '') : `#${hoverIdx + 1}`}
            </text>
            <text
              x={Math.min(hoverIdx * (barW + gap), containerW - 100) + 8}
              y={padTop - 4}
              fontSize={11}
              fill="#fdda36"
              fontWeight="bold"
            >
              {formatValue(data[hoverIdx])}{unit}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

interface LineChartProps {
  series: { data: number[]; color: string; label?: string }[];
  labels?: string[];
  height?: number;
  unit?: string;
  fillArea?: boolean;
  formatValue?: (v: number) => string;
  formatLabel?: (l: string) => string;
}

export function LineChart({
  series,
  labels,
  height = 200,
  unit = '',
  fillArea = false,
  formatValue = (v) => v.toFixed(1),
  formatLabel = (l) => l,
}: LineChartProps) {
  const [hoverX, setHoverX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(600);

  useMemo(() => {
    if (containerRef.current) {
      const ro = new ResizeObserver((entries) => {
        setContainerW(entries[0].contentRect.width);
      });
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    }
  }, []);

  const allValues = series.flatMap((s) => s.data).filter((v) => isFinite(v));
  if (allValues.length === 0) return null;

  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min || 1;
  const chartH = height;
  const padTop = 16;
  const padBottom = 24;
  const padLeft = 40;
  const padRight = 12;
  const plotW = containerW - padLeft - padRight;
  const plotH = chartH - padTop - padBottom;

  const xStep = series[0].data.length > 1 ? plotW / (series[0].data.length - 1) : plotW;

  const toX = (i: number) => padLeft + i * xStep;
  const toY = (v: number) => padTop + plotH - ((v - min) / range) * plotH;

  const hoverIdx = hoverX !== null ? Math.round((hoverX - padLeft) / xStep) : null;
  const clampedIdx = hoverIdx !== null ? Math.max(0, Math.min(series[0].data.length - 1, hoverIdx)) : null;

  return (
    <div ref={containerRef} className="w-full relative">
      <svg
        width={containerW}
        height={chartH}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setHoverX(e.clientX - rect.left);
        }}
        onMouseLeave={() => setHoverX(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const v = min + t * range;
          const y = toY(v);
          return (
            <g key={t}>
              <line x1={padLeft} x2={containerW - padRight} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={9} fill="#9ca3af">
                {formatValue(v)}
              </text>
            </g>
          );
        })}
        {series.map((s, si) => {
          const path = s.data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ');
          const areaPath =
            fillArea && s.data.length > 0
              ? `${path} L ${toX(s.data.length - 1)} ${padTop + plotH} L ${toX(0)} ${padTop + plotH} Z`
              : '';
          return (
            <g key={si}>
              {fillArea && areaPath && <path d={areaPath} fill={s.color} opacity={0.12} />}
              <path d={path} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
        {labels && series[0].data.length <= 30 && (
          <>
            {labels.map((l, i) => {
              if (i % Math.ceil(labels.length / 6) !== 0 && i !== labels.length - 1) return null;
              return (
                <text key={i} x={toX(i)} y={chartH - 6} textAnchor="middle" fontSize={9} fill="#9ca3af">
                  {formatLabel(l)}
                </text>
              );
            })}
          </>
        )}
        {clampedIdx !== null && (
          <g>
            <line
              x1={toX(clampedIdx)}
              x2={toX(clampedIdx)}
              y1={padTop}
              y2={padTop + plotH}
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {series.map((s, si) => (
              <circle key={si} cx={toX(clampedIdx)} cy={toY(s.data[clampedIdx])} r={3} fill={s.color} stroke="white" strokeWidth={1} />
            ))}
            <rect
              x={Math.min(toX(clampedIdx) + 6, containerW - 120)}
              y={padTop}
              width={110}
              height={16 + series.length * 14}
              fill="rgba(0,0,0,0.78)"
              rx={4}
            />
            {series.map((s, si) => (
              <text
                key={si}
                x={Math.min(toX(clampedIdx) + 12, containerW - 114)}
                y={padTop + 12 + si * 14}
                fontSize={10}
                fill={s.color}
                fontWeight="bold"
              >
                {s.label ? `${s.label}: ` : ''}{formatValue(s.data[clampedIdx])}{unit}
              </text>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
