import { useState, useMemo } from 'react';
import { GpsPoint } from '../../types/workoutDetail';

interface RouteMapProps {
  points: GpsPoint[];
  activePointIndex?: number | null;
}

type LayerType = 'pace' | 'heart_rate' | 'power_watts' | 'cadence';

const LAYER_CONFIG: Record<LayerType, { label: string; color: string; unit: string }> = {
  pace: { label: 'Pace', color: '#10b981', unit: 's/km' },
  heart_rate: { label: 'Pulso', color: '#ef4444', unit: 'bpm' },
  power_watts: { label: 'Watts', color: '#f59e0b', unit: 'W' },
  cadence: { label: 'Cadencia', color: '#3b82f6', unit: 'rpm' },
};

function intensityColor(t: number): string {
  if (t < 0.2) return '#3b82f6';
  if (t < 0.4) return '#06b6d4';
  if (t < 0.6) return '#10b981';
  if (t < 0.75) return '#eab308';
  if (t < 0.9) return '#f97316';
  return '#ef4444';
}

export function RouteMap({ points, activePointIndex = null }: RouteMapProps) {
  const [activeLayer, setActiveLayer] = useState<LayerType | null>(null);

  const bounds = useMemo(() => {
    if (points.length === 0) return null;
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    for (const p of points) {
      minLat = Math.min(minLat, p.lat);
      maxLat = Math.max(maxLat, p.lat);
      minLng = Math.min(minLng, p.lng);
      maxLng = Math.max(maxLng, p.lng);
    }
    const padLat = (maxLat - minLat) * 0.08 || 0.001;
    const padLng = (maxLng - minLng) * 0.08 || 0.001;
    return {
      minLat: minLat - padLat,
      maxLat: maxLat + padLat,
      minLng: minLng - padLng,
      maxLng: maxLng + padLng,
    };
  }, [points]);

  const layerValues = useMemo(() => {
    if (!activeLayer) return null;
    const vals = points
      .map((p) => (p[activeLayer] as number | null) ?? null)
      .filter((v): v is number => v != null && isFinite(v));
    if (vals.length === 0) return null;
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [points, activeLayer]);

  const segments = useMemo(() => {
    if (!bounds || points.length < 2) return [];
    const w = 800;
    const h = 500;
    const toX = (lng: number) => ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * w;
    const toY = (lat: number) => h - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * h;

    const segs: { x1: number; y1: number; x2: number; y2: number; color: string; value: number | null }[] = [];
    for (let i = 1; i < points.length; i++) {
      let color = '#6366f1';
      let value: number | null = null;
      if (activeLayer && layerValues) {
        const v = points[i][activeLayer] as number | null;
        if (v != null && isFinite(v)) {
          value = v;
          const t = (v - layerValues.min) / (layerValues.max - layerValues.min || 1);
          color = intensityColor(t);
        }
      }
      segs.push({
        x1: toX(points[i - 1].lng),
        y1: toY(points[i - 1].lat),
        x2: toX(points[i].lng),
        y2: toY(points[i].lat),
        color,
        value,
      });
    }
    return segs;
  }, [points, bounds, activeLayer, layerValues]);

  if (!bounds || points.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        No hay datos GPS disponibles para mostrar el mapa.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveLayer(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeLayer === null
              ? 'bg-[#514163] text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Ruta
        </button>
        {(Object.keys(LAYER_CONFIG) as LayerType[]).map((key) => {
          const hasData = points.some((p) => {
            const v = p[key] as number | null;
            return v != null && isFinite(v);
          });
          if (!hasData) return null;
          const cfg = LAYER_CONFIG[key];
          return (
            <button
              key={key}
              onClick={() => setActiveLayer(activeLayer === key ? null : key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeLayer === key
                  ? 'text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={activeLayer === key ? { backgroundColor: cfg.color } : undefined}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <svg viewBox="0 0 800 500" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <rect width={800} height={500} fill="#f9fafb" className="dark:fill-gray-900" />
          {[0.2, 0.4, 0.6, 0.8].map((t) => (
            <g key={t}>
              <line x1={0} x2={800} y1={500 * t} y2={500 * t} stroke="#e5e7eb" strokeWidth={0.5} className="dark:stroke-gray-700" />
              <line x1={800 * t} x2={800 * t} y1={0} y2={500} stroke="#e5e7eb" strokeWidth={0.5} className="dark:stroke-gray-700" />
            </g>
          ))}
          {segments.map((s, i) => (
            <line
              key={i}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke={s.color}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.85}
            />
          ))}
          {points.length > 0 && (
            <>
              <circle cx={segments[0]?.x1 ?? 0} cy={segments[0]?.y1 ?? 0} r={6} fill="#10b981" stroke="white" strokeWidth={2} />
              <circle cx={segments[segments.length - 1]?.x2 ?? 0} cy={segments[segments.length - 1]?.y2 ?? 0} r={6} fill="#ef4444" stroke="white" strokeWidth={2} />
            </>
          )}
          {activePointIndex != null && points[activePointIndex] && (
            <circle
              cx={((points[activePointIndex].lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 800}
              cy={500 - ((points[activePointIndex].lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 500}
              r={10}
              fill="#fdda36"
              stroke="#514163"
              strokeWidth={4}
            />
          )}
        </svg>
        {activeLayer && layerValues && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg px-3 py-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{LAYER_CONFIG[activeLayer].label}</span>
            <div className="flex-1 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #3b82f6, #06b6d4, #10b981, #eab308, #f97316, #ef4444)' }} />
            <span className="text-xs text-gray-500">{layerValues.min.toFixed(0)}{LAYER_CONFIG[activeLayer].unit}</span>
            <span className="text-xs text-gray-500">{layerValues.max.toFixed(0)}{LAYER_CONFIG[activeLayer].unit}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" />Inicio</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" />Fin</span>
        <span>{points.length} puntos GPS</span>
      </div>
    </div>
  );
}
