import { DayDetail } from '../lib/weeklySummary';

interface WeeklyChartProps {
  days: DayDetail[];
  plannedEndCA: number;
  plannedEndAF: number;
  plannedEndRB: number;
}

export default function WeeklyChart({ days, plannedEndCA, plannedEndAF, plannedEndRB }: WeeklyChartProps) {
  if (days.length === 0) return null;

  // Calculate chart dimensions and scaling
  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 80, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max values for scaling
  const allCA = days.map(d => d.actualCA ?? d.plannedCA);
  const allAF = days.map(d => d.actualAF ?? d.plannedAF);
  const allRB = days.map(d => d.actualRB ?? d.plannedRB);
  const allImpulses = days.map(d => d.actualImpulse > 0 ? d.actualImpulse : d.plannedImpulse);

  const minValue = Math.min(...allCA, ...allAF, ...allRB, 0) - 10;
  const maxValue = Math.max(...allCA, ...allAF, ...allRB, plannedEndCA, plannedEndAF, plannedEndRB) + 10;
  const maxImpulse = Math.max(...allImpulses, 10);

  // Scaling functions
  const scaleX = (index: number) => padding.left + (index / (days.length - 1)) * chartWidth;
  const scaleY = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
  const scaleImpulse = (impulse: number) => (impulse / maxImpulse) * (chartHeight * 0.3);

  // Create path strings
  const createPath = (values: (number | null)[]) => {
    const points = values
      .map((val, idx) => val !== null ? `${scaleX(idx)},${scaleY(val)}` : null)
      .filter(p => p !== null);
    return points.length > 0 ? `M ${points.join(' L ')}` : '';
  };

  const plannedCAPath = createPath(days.map(d => d.plannedCA));
  const plannedAFPath = createPath(days.map(d => d.plannedAF));
  const plannedRBPath = createPath(days.map(d => d.plannedRB));

  const actualCAPath = createPath(days.map(d => d.actualCA));
  const actualAFPath = createPath(days.map(d => d.actualAF));
  const actualRBPath = createPath(days.map(d => d.actualRB));

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    minValue + (maxValue - minValue) * (i / yTicks)
  );

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-primary-purple dark:text-white font-heading mb-4">
        Progresión Semanal de Carga y Fitness / Weekly Load & Fitness Progression
      </h3>

      <svg width={width} height={height} className="w-full h-auto">
        {/* Grid lines */}
        <g className="grid">
          {yTickValues.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={scaleY(tick)}
                x2={width - padding.right}
                y2={scaleY(tick)}
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 10}
                y={scaleY(tick)}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
              >
                {tick.toFixed(0)}
              </text>
            </g>
          ))}
        </g>

        {/* X-axis labels */}
        <g className="x-axis">
          {days.map((day, i) => (
            <g key={i}>
              <text
                x={scaleX(i)}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className={`text-xs ${
                  day.isEventDay
                    ? 'fill-primary-yellow font-bold'
                    : 'fill-gray-600 dark:fill-gray-400'
                }`}
              >
                {dayLabels[day.dayOfWeek]}
              </text>
              {day.isEventDay && (
                <text
                  x={scaleX(i)}
                  y={height - padding.bottom + 35}
                  textAnchor="middle"
                  className="text-xs fill-primary-yellow font-bold"
                >
                  {day.eventPriority}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Impulse bars */}
        <g className="impulse-bars">
          {days.map((day, i) => {
            const impulse = day.actualImpulse > 0 ? day.actualImpulse : day.plannedImpulse;
            const barHeight = scaleImpulse(impulse);
            const isActual = day.actualImpulse > 0;
            return (
              <rect
                key={i}
                x={scaleX(i) - 8}
                y={height - padding.bottom - barHeight}
                width={16}
                height={barHeight}
                className={isActual ? 'fill-blue-500/40' : 'fill-gray-300/40 dark:fill-gray-600/40'}
                rx={2}
              />
            );
          })}
        </g>

        {/* Planned lines (dashed) */}
        <g className="planned-lines">
          <path
            d={plannedCAPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity="0.4"
          />
          <path
            d={plannedAFPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity="0.4"
          />
          <path
            d={plannedRBPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity="0.4"
          />
        </g>

        {/* Actual lines (solid) */}
        <g className="actual-lines">
          <path
            d={actualCAPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
          />
          <path
            d={actualAFPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
          />
          <path
            d={actualRBPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
          />
        </g>

        {/* Data points */}
        <g className="data-points">
          {days.map((day, i) => {
            if (day.actualCA === null) return null;
            return (
              <g key={i}>
                <circle cx={scaleX(i)} cy={scaleY(day.actualCA)} r="4" className="fill-emerald-500" />
                <circle cx={scaleX(i)} cy={scaleY(day.actualAF!)} r="4" className="fill-amber-500" />
                <circle cx={scaleX(i)} cy={scaleY(day.actualRB!)} r="4" className="fill-blue-500" />
              </g>
            );
          })}
        </g>

        {/* Legend */}
        <g className="legend" transform={`translate(${width - padding.right + 10}, ${padding.top})`}>
          <text x="0" y="0" className="text-xs font-bold fill-gray-700 dark:fill-gray-300">Leyenda</text>

          <line x1="0" y1="20" x2="20" y2="20" stroke="#10b981" strokeWidth="3" />
          <text x="25" y="23" className="text-xs fill-gray-600 dark:fill-gray-400">CA</text>

          <line x1="0" y1="40" x2="20" y2="40" stroke="#f59e0b" strokeWidth="3" />
          <text x="25" y="43" className="text-xs fill-gray-600 dark:fill-gray-400">AF</text>

          <line x1="0" y1="60" x2="20" y2="60" stroke="#3b82f6" strokeWidth="3" />
          <text x="25" y="63" className="text-xs fill-gray-600 dark:fill-gray-400">RB</text>

          <line x1="0" y1="85" x2="20" y2="85" stroke="#666" strokeWidth="2" strokeDasharray="4,4" opacity="0.4" />
          <text x="25" y="88" className="text-xs fill-gray-500 dark:fill-gray-500">Plan</text>
        </g>

        {/* Axes */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="currentColor"
          className="text-gray-400 dark:text-gray-600"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="currentColor"
          className="text-gray-400 dark:text-gray-600"
          strokeWidth="2"
        />

        {/* Y-axis label */}
        <text
          x={padding.left - 45}
          y={height / 2}
          transform={`rotate(-90, ${padding.left - 45}, ${height / 2})`}
          textAnchor="middle"
          className="text-sm font-semibold fill-gray-600 dark:fill-gray-400"
        >
          Unidades de Carga
        </text>
      </svg>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-600 dark:text-gray-400">CA = Actividad Crónica (Fitness)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-600 dark:text-gray-400">AF = Fatiga Aguda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600 dark:text-gray-400">RB = Balance de Recuperación</span>
        </div>
      </div>
    </div>
  );
}
