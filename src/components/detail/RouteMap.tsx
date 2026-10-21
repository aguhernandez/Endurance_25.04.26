import { useMemo } from 'react';
import { GpsPoint } from '../../types/workoutDetail';

interface RouteMapProps {
  points: GpsPoint[];
  activePointIndex?: number | null;
}

export function RouteMap({ points, activePointIndex = null }: RouteMapProps) {
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

  if (!bounds || points.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        No hay datos GPS disponibles para mostrar el mapa.
      </div>
    );
  }

  const mapBounds = useMemo(() => {
    const longitudePadding = Math.max((bounds.maxLng - bounds.minLng) * 0.12, 0.002);
    const latitudePadding = Math.max((bounds.maxLat - bounds.minLat) * 0.12, 0.002);
    const minLng = bounds.minLng - longitudePadding;
    const maxLng = bounds.maxLng + longitudePadding;
    const minLat = Math.max(-85, bounds.minLat - latitudePadding);
    const maxLat = Math.min(85, bounds.maxLat + latitudePadding);
    const mercatorY = (latitude: number) => Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360));
    return {
      minLng, maxLng, minLat, maxLat,
      project: (point: GpsPoint) => ({
        x: ((point.lng - minLng) / (maxLng - minLng)) * 1000,
        y: ((mercatorY(maxLat) - mercatorY(point.lat)) / (mercatorY(maxLat) - mercatorY(minLat))) * 600,
      }),
    };
  }, [bounds]);
  const routePath = points.map((point, index) => {
    const projected = mapBounds.project(point);
    return `${index === 0 ? 'M' : 'L'} ${projected.x} ${projected.y}`;
  }).join(' ');
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.minLng},${mapBounds.minLat},${mapBounds.maxLng},${mapBounds.maxLat}&layer=mapnik`;
  const activePoint = activePointIndex == null ? null : points[Math.max(0, Math.min(points.length - 1, activePointIndex))];
  const activeProjected = activePoint ? mapBounds.project(activePoint) : null;

  return (
    <div className="space-y-2">
      <div className="relative h-64 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900 sm:h-72">
        <iframe title="Mapa de la actividad" src={mapUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" />
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          <path d={routePath} fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {(() => { const start = mapBounds.project(points[0]); return <circle cx={start.x} cy={start.y} r="7" fill="#22c55e" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />; })()}
          {(() => { const end = mapBounds.project(points[points.length - 1]); return <circle cx={end.x} cy={end.y} r="7" fill="#ef4444" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />; })()}
          {activeProjected && <circle cx={activeProjected.x} cy={activeProjected.y} r="9" fill="#fdda36" stroke="#514163" strokeWidth="4" vectorEffect="non-scaling-stroke" />}
        </svg>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" />Inicio</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" />Fin</span>
        <span>{points.length} puntos GPS</span>
      </div>
    </div>
  );
}
