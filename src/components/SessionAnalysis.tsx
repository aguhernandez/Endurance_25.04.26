/* eslint-disable @typescript-eslint/no-explicit-any -- Hub response fields are capability-dependent. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock3, Loader2, RefreshCw } from 'lucide-react';
import { hubSessionAction, HubSessionPayload } from '../lib/hubApi';
import { useLanguage } from '../contexts/LanguageContext';
import { RouteMap } from './detail/RouteMap';
import { GpsPoint } from '../types/workoutDetail';

const card = 'rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900';
const text = 'text-gray-900 dark:text-white';
const muted = 'text-gray-500 dark:text-gray-400';
const number = (v: unknown, unit = '') => v == null || v === '' ? '—' : `${v}${unit}`;
const first = (...v: any[]) => v.find(x => x !== undefined && x !== null);
const obj = (v: any) => v && typeof v === 'object' && !Array.isArray(v) ? v : {};
const arr = (v: any) => Array.isArray(v) ? v : [];
const seriesArray = (v: any) => Array.isArray(v) ? v : arr(v?.values ?? v?.data ?? v?.samples);

function localizedDate(value: unknown, language: string): string {
  if (typeof value !== 'string' || !value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(language === 'es' ? 'es' : 'en', { dateStyle: 'medium', timeStyle: value.includes('T') ? 'short' : undefined }).format(date);
}

function Metric({ label, planned, actual, unit = '', es = false }: { label: string; planned: unknown; actual: unknown; unit?: string; es?: boolean }) {
  if (planned == null && actual == null) return null;
  return <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"><div className={`text-xs ${muted}`}>{label}</div><div className={`mt-2 grid grid-cols-2 gap-2 text-sm ${text}`}><div><span className={muted}>{es ? 'Plan ' : 'Planned '}</span>{number(planned, unit)}</div><div><span className={muted}>{es ? 'Real ' : 'Actual '}</span>{number(actual, unit)}</div></div></div>;
}

function ZonePanel({ title, planned, actual, es }: { title: string; planned: any; actual: any; es: boolean }) {
  const entries = (v: any) => Array.isArray(v) ? v.map((z, i) => [z.zone ?? z.zone_number ?? i + 1, z.seconds ?? z.duration_seconds ?? z.time_seconds ?? z]) : Object.entries(obj(v));
  const p = new Map(entries(planned).map(([zone, seconds]) => [String(zone), seconds]));
  const a = new Map(entries(actual).map(([zone, seconds]) => [String(zone), seconds]));
  const zones = Array.from(new Set([...p.keys(), ...a.keys()]));
  const duration = (v: any) => typeof v === 'number' ? `${Math.round(v)} s` : number(first(v?.seconds, v?.duration_seconds, v?.time_seconds, v));
  return <section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{title}</h2>{zones.length ? <div className="space-y-2">{zones.map(z => <div key={z} className="grid grid-cols-[3rem_1fr_1fr] gap-2 text-sm"><span className={muted}>Z{z}</span><span className={text}>{es ? 'Plan' : 'Planned'} {duration(p.get(z))}</span><span className={text}>{es ? 'Real' : 'Actual'} {duration(a.get(z))}</span></div>)}</div> : <p className={`text-sm ${muted}`}>{es ? 'El Hub no devolvió tiempos en zonas.' : 'The Hub returned no zone time data.'}</p>}</section>;
}

function SeriesChart({ series, es, allowCadence, steps = [] }: { series: any; es: boolean; allowCadence: boolean; steps?: any[] }) {
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState<number | null>(null);
  const hr = seriesArray(first(series.heart_rate, series.hr, series.heartrate));
  const power = seriesArray(first(series.power, series.watts));
  const cadence = allowCadence ? seriesArray(first(series.cadence, series.cadence_rpm)) : [];
  const lines = [
    { name: es ? 'FC' : 'HR', data: hr, color: '#ef4444', unit: ' bpm' },
    { name: es ? 'Potencia' : 'Power', data: power, color: '#f59e0b', unit: ' W' },
    { name: es ? 'Cadencia' : 'Cadence', data: cadence, color: '#2563eb', unit: ' rpm' },
  ].filter(x => x.data.length);
  if (!lines.length) return <section className={card}><h2 className={`mb-2 font-semibold ${text}`}>{es ? 'Series temporales' : 'Time series'}</h2><p className={`text-sm ${muted}`}>{es ? 'El Hub no devolvió muestras de FC o potencia.' : 'The Hub returned no HR or power samples.'}</p></section>;
  const points = Math.max(...lines.map(l => l.data.length));
  const poly = (data: any[], zoomValue: number) => {
    const numeric = data.map((x: any) => Number(typeof x === 'object' ? x.value ?? x.y : x)).filter(Number.isFinite);
    if (!numeric.length) return '';
    const min = Math.min(...numeric), max = Math.max(...numeric);
    return data.map((x: any, i: number) => {
      const v = Number(typeof x === 'object' ? x.value ?? x.y : x);
      return Number.isFinite(v) ? `${(i / Math.max(1, data.length - 1) * 1000) / zoomValue},${190 - ((v - min) / (max - min || 1)) * 170}` : '';
    }).filter(Boolean).join(' ');
  };
  return <section className={card}><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className={`font-semibold ${text}`}>{es ? 'Series temporales' : 'Time series'}</h2><div className="flex items-center gap-3">{lines.map(l => <span key={l.name} className="text-xs" style={{ color: l.color }}>● {l.name}</span>)}<button className="rounded-lg border px-2 py-1 text-xs dark:border-gray-700" onClick={() => setZoom(z => z === 1 ? 2 : z === 2 ? 4 : 1)}>Zoom {zoom}×</button></div></div><div className="overflow-x-auto"><svg viewBox={`0 0 ${1000 / zoom} 210`} className="h-56 min-w-[600px] w-full" onMouseMove={e => setHover(Math.min(points - 1, Math.floor((e.nativeEvent.offsetX / e.currentTarget.clientWidth) * points)))} onMouseLeave={() => setHover(null)}>{steps.map((step: any, i: number) => { const start = Number(first(step.start_percent, step.start_fraction)), end = Number(first(step.end_percent, step.end_fraction)); if (!Number.isFinite(start) || !Number.isFinite(end)) return null; const x1 = start >= 0 && start <= 1 ? start * 1000 : start * 10; const x2 = end >= 0 && end <= 1 ? end * 1000 : end * 10; return <rect key={step.id ?? i} x={x1 / zoom} y="0" width={Math.max(1, (x2 - x1) / zoom)} height="200" fill="#facc15" opacity=".13"/>; })}{lines.map(l => <polyline key={l.name} points={poly(l.data, zoom)} fill="none" stroke={l.color} strokeWidth="2" vectorEffect="non-scaling-stroke"/>)}{hover != null && <line x1={hover / Math.max(points - 1, 1) * (1000 / zoom)} x2={hover / Math.max(points - 1, 1) * (1000 / zoom)} y1="0" y2="200" stroke="#6b7280" strokeDasharray="4 3"/>}</svg></div>{hover != null && <p className={`text-xs ${muted}`}>{es ? 'Muestra' : 'Sample'} {hover + 1} · {lines.map(l => `${l.name}: ${number(typeof l.data[hover] === 'object' ? l.data[hover]?.value ?? l.data[hover]?.y : l.data[hover], l.unit)}`).join(' · ')}</p>}</section>;
}

function ElevationAndRoute({ data, caps, es }: { data: any; caps: any; es: boolean }) {
  const route = arr(data.route);
  const altitude = seriesArray(first(data.series?.altitude, data.series?.elevation));
  const alts = altitude.map((p: any) => Number(typeof p === 'object' ? p.value ?? p.altitude_m : p)).filter(Number.isFinite);
  const points = route.filter((p: any) => Number.isFinite(Number(p.lat ?? p.latitude)) && Number.isFinite(Number(p.lng ?? p.longitude))).map((p: any) => ({
    lat: Number(p.lat ?? p.latitude), lng: Number(p.lng ?? p.longitude),
    altitude_m: p.altitude_m == null ? null : Number(p.altitude_m), timestamp: p.timestamp ?? null,
    speed_kmh: p.speed_kmh == null ? null : Number(p.speed_kmh), heart_rate: caps.hr && p.heart_rate != null ? Number(p.heart_rate) : null,
    power_watts: caps.power && p.power_watts != null ? Number(p.power_watts) : null, cadence: caps.cadence && p.cadence != null ? Number(p.cadence) : null,
    distance_m: p.distance_m == null ? null : Number(p.distance_m),
  } as GpsPoint));
  if (!caps.gps && !caps.altitude) return null;
  return <section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{es ? 'Ruta y elevación' : 'Route and elevation'}</h2>{caps.gps && points.length > 1 && <div className="mb-3"><RouteMap points={points}/></div>}{caps.gps && points.length < 2 && <p className={`mb-3 text-sm ${muted}`}>{es ? 'El Hub indica GPS disponible, pero no devolvió puntos suficientes para dibujar la ruta.' : 'Hub reports GPS available, but returned too few points to draw the route.'}</p>}{caps.altitude && alts.length > 1 && <svg aria-label={es ? 'Perfil de elevación' : 'Elevation profile'} viewBox="0 0 1000 140" className="h-32 w-full"><polyline points={alts.map((v: number, i: number) => `${i / (alts.length - 1) * 1000},${130 - (v - Math.min(...alts)) / (Math.max(...alts) - Math.min(...alts) || 1) * 120}`).join(' ')} fill="none" stroke="#10b981" strokeWidth="3"/></svg>}{caps.altitude && <div className={`mt-2 flex flex-wrap gap-4 text-sm ${muted}`}><span>{es ? 'Ascenso' : 'Elevation gain'}: {number(data.elevation_gain_m, ' m')}</span><span>{es ? 'Descenso' : 'Elevation loss'}: {number(data.elevation_loss_m, ' m')}</span></div>}</section>;
}

export default function SessionAnalysis({ athleteId, executedId, onBack, canReview = false }: { athleteId: string; executedId: string; onBack: () => void; canReview?: boolean }) {
  const { language } = useLanguage();
  const es = language === 'es';
  const [analysis, setAnalysis] = useState<HubSessionPayload | null>(null);
  const [seriesData, setSeriesData] = useState<HubSessionPayload | null>(null);
  const [loading, setLoading] = useState(true), [seriesLoading, setSeriesLoading] = useState(false);
  const [error, setError] = useState(''), [seriesError, setSeriesError] = useState('');
  const [seriesAttempt, setSeriesAttempt] = useState(0);
  const [comment, setComment] = useState(''), [visibleToAthlete, setVisibleToAthlete] = useState(false);
  const [saving, setSaving] = useState(false), [saved, setSaved] = useState(false), [saveError, setSaveError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setAnalysis(null); setSeriesData(null); setSeriesError(''); setSaved(false); setComment('');
    if (!executedId || executedId === 'none') { setError(es ? 'Falta el identificador de la actividad ejecutada.' : 'The executed activity id is missing.'); setLoading(false); return () => { active = false; }; }
    hubSessionAction('get-session-analysis', { executed_session_id: executedId, ...(athleteId ? { athlete_id: athleteId } : {}) })
      .then(result => { if (active) { setAnalysis(obj(result)); setComment(String(result.coach_comment ?? '')); setLoading(false); } })
      .catch(e => { if (active) { setError(e.message || (es ? 'No se pudo cargar el análisis.' : 'Could not load session analysis.')); setLoading(false); } });
    return () => { active = false; };
  }, [athleteId, executedId, es]);

  const caps = obj(analysis?.capabilities);
  useEffect(() => {
    if (!analysis) return;
    if (!(caps.hr || caps.power || caps.gps || caps.altitude)) { setSeriesLoading(false); return; }
    let active = true; setSeriesLoading(true); setSeriesError('');
    hubSessionAction('get-session-timeseries', { executed_session_id: executedId, ...(athleteId ? { athlete_id: athleteId } : {}) })
      .then(result => { if (active) { setSeriesData(obj(result)); setSeriesLoading(false); } })
      .catch(e => { if (active) { setSeriesError(e.message || (es ? 'No se pudieron cargar las series.' : 'Could not load time series.')); setSeriesLoading(false); } });
    return () => { active = false; };
  // caps are derived from analysis; analysis identity is the request boundary.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis, athleteId, executedId, seriesAttempt, es]);

  const data = analysis ?? {};
  const session = obj(data.session), metrics = obj(data.metrics), planned = obj(data.planned_workout);
  const match = obj(data.match), seriesCaps = obj(seriesData?.capabilities);
  const actualDuration = first(metrics.duration_minutes, metrics.duration_seconds, metrics.duration, session.duration_minutes, session.duration_seconds);
  const plannedDuration = first(planned.duration_minutes, planned.duration);
  const actualDistance = first(metrics.distance_km, metrics.distance_m, metrics.distance, session.distance_km, session.distance_m);
  const plannedDistance = first(planned.distance_km, planned.distance);
  const zones = obj(seriesData?.zones_used ?? data.zones_used);
  const derived = obj(seriesData?.derived);
  const indicators = [
    [es ? 'Deriva de FC' : 'HR drift', first(derived.hr_drift, derived.heart_rate_drift)],
    [es ? 'Eficiencia' : 'Efficiency', derived.efficiency],
    ['IF', first(seriesData?.power_metrics?.if, derived.if)],
    ['TSS', first(seriesData?.power_metrics?.tss, derived.tss)],
  ].filter(([, value]) => value != null);
  const laps = arr(first(session.laps, data.laps));
  const subjective = obj(first(session.subjective, session.athlete_feedback, session.feedback));
  const reviewComment = first(data.coach_comment, session.coach_comment);
  const dateValue = first(session.started_at, session.session_date, session.date, session.start_time);

  const saveReview = async () => {
    if (!canReview) return;
    setSaving(true); setSaveError('');
    try {
      const result = await hubSessionAction('save-review', {
        executed_session_id: executedId,
        ...(planned.id ? { planned_workout_id: planned.id } : {}),
        comment,
        visible_to_athlete: visibleToAthlete,
        status: 'reviewed',
      });
      if (result.success === false) throw new Error(result.message || 'Hub could not save the review.');
      setSaved(true);
    } catch (e: any) { setSaveError(e.message || (es ? 'No se pudo guardar la revisión.' : 'Could not save the review.')); }
    finally { setSaving(false); }
  };

  if (loading) return <div className={`${card} flex items-center gap-3 ${muted}`}><Loader2 className="animate-spin"/>{es ? 'Cargando análisis de sesión…' : 'Loading session analysis…'}</div>;
  if (error) return <div className={`${card} text-red-600 dark:text-red-400`}><AlertCircle className="mb-2"/><p>{error}</p><button onClick={() => window.location.reload()} className="mt-3 rounded-lg border px-3 py-2 text-sm">{es ? 'Reintentar' : 'Retry'}</button></div>;

  return <div className="space-y-4"><button onClick={onBack} className={`inline-flex items-center gap-2 text-sm ${muted}`}><ArrowLeft size={16}/>{es ? 'Volver' : 'Back'}</button>
    <header className={card}><h1 className={`text-2xl font-semibold ${text}`}>{es ? 'Análisis de sesión' : 'Session analysis'}</h1><p className={`mt-1 text-sm ${muted}`}>{first(session.name, session.session_name, planned.name, es ? 'Actividad ejecutada' : 'Executed activity')} · {localizedDate(dateValue, language)}</p>
      {match.status && <p className={`mt-1 text-sm ${muted}`}>{es ? 'Coincidencia' : 'Plan match'}: {match.status}</p>}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Metric es={es} label={es ? 'Duración' : 'Duration'} planned={plannedDuration} actual={actualDuration} unit={metrics.duration_minutes != null || session.duration_minutes != null || planned.duration_minutes != null ? ' min' : metrics.duration_seconds != null || session.duration_seconds != null ? ' s' : ''}/>
        <Metric es={es} label={es ? 'Distancia' : 'Distance'} planned={plannedDistance} actual={actualDistance} unit={metrics.distance_km != null || session.distance_km != null || planned.distance_km != null ? ' km' : metrics.distance_m != null || session.distance_m != null ? ' m' : ''}/>
        {caps.hr && <><Metric es={es} label={es ? 'FC media' : 'Average HR'} planned={first(planned.avg_hr, planned.average_heart_rate)} actual={first(metrics.avg_hr, metrics.average_heart_rate, session.avg_hr)} unit=" bpm"/><Metric es={es} label={es ? 'FC máxima' : 'Max HR'} planned={first(planned.max_hr, planned.max_heart_rate)} actual={first(metrics.max_hr, metrics.max_heart_rate, session.max_hr)} unit=" bpm"/></>}
        <Metric es={es} label={es ? 'Calorías' : 'Calories'} planned={first(planned.calories_kcal, planned.calories)} actual={first(metrics.calories_kcal, metrics.calories, session.calories_kcal)} unit=" kcal"/>
      </div>
      <div className={`mt-3 flex flex-wrap gap-4 text-xs ${muted}`}><span>{es ? 'Fuente' : 'Source'}: {number(first(session.source, session.source_name))}</span><span>{es ? 'Pasaporte para zonas' : 'Passport used for zones'}: {localizedDate(data.biological_passport_date, language)}</span></div>
      {session.id == null && Object.keys(metrics).length === 0 && Object.keys(planned).length === 0 && <p className={`mt-3 text-sm ${muted}`}>{es ? 'El Hub no devolvió métricas para esta actividad.' : 'The Hub returned no metrics for this activity.'}</p>}
    </header>
    {(subjective.rpe != null || subjective.comment || subjective.comments || session.rpe != null || session.athlete_comment) && <section className={card}><h2 className={`font-semibold ${text}`}>{es ? 'Contexto del atleta' : 'Athlete context'}</h2><div className={`mt-2 flex flex-wrap gap-4 text-sm ${muted}`}>{first(subjective.rpe, session.rpe) != null && <span>RPE: {number(first(subjective.rpe, session.rpe))}</span>}<span>{first(subjective.comment, subjective.comments, session.athlete_comment)}</span></div></section>}
    {caps.hr && <ZonePanel es={es} title={es ? 'Tiempo en zonas · FC' : 'Time in zones · HR'} planned={first(data.planned_zone_time?.hr, data.planned_zone_time?.heart_rate, data.planned_zone_time?.hr_zone_seconds)} actual={first(seriesData?.hr_zone_seconds, zones.hr, zones.heart_rate)}/>}
    {caps.power && <ZonePanel es={es} title={es ? 'Tiempo en zonas · Potencia' : 'Time in zones · Power'} planned={first(data.planned_zone_time?.power)} actual={first(seriesData?.power_zone_seconds, zones.power)}/>}
    {(caps.hr || caps.power) && <>{seriesLoading && <div className={`${card} flex items-center gap-2 ${muted}`}><Loader2 className="animate-spin" size={16}/>{es ? 'Cargando series…' : 'Loading time series…'}</div>}{seriesError && <div className={`${card} text-sm text-red-600`}>{seriesError}<button className="ml-2 underline" onClick={() => setSeriesAttempt(n => n + 1)}>{es ? 'Reintentar' : 'Retry'}</button></div>}{seriesData && (seriesCaps.hr || seriesCaps.power) && <SeriesChart es={es} series={{...(seriesCaps.hr ? { hr: seriesData.series?.hr ?? seriesData.series?.heart_rate } : {}), ...(seriesCaps.power ? { power: seriesData.series?.power } : {}), ...(caps.cadence ? { cadence: seriesData.series?.cadence ?? seriesData.series?.cadence_rpm } : {})}} allowCadence={Boolean(caps.cadence)} steps={arr(first(planned.steps, data.planned_steps))}/>}</>}
    {(caps.hr || caps.power) && indicators.length > 0 && <section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{es ? 'Indicadores derivados' : 'Derived indicators'}</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{indicators.map(([label, value]) => <div key={String(label)} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"><p className={`text-xs ${muted}`}>{label}</p><p className={`mt-1 font-medium ${text}`}>{number(value)}</p></div>)}</div></section>}
    {caps.laps && <section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{es ? 'Vueltas e intervalos' : 'Laps and intervals'}</h2>{laps.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className={muted}><tr><th className="p-2">{es ? 'Intervalo' : 'Interval'}</th><th className="p-2">{es ? 'Duración' : 'Duration'}</th>{caps.hr && <th className="p-2">FC</th>}{caps.power && <th className="p-2">{es ? 'Potencia' : 'Power'}</th>}</tr></thead><tbody>{laps.map((l: any, i: number) => <tr key={l.id ?? i} className="border-t dark:border-gray-700"><td className={`p-2 ${text}`}>{l.label ?? l.name ?? `#${i + 1}`}</td><td className={`p-2 ${text}`}>{number(first(l.duration_s, l.duration_seconds, l.duration), l.duration_s || l.duration_seconds ? ' s' : '')}</td>{caps.hr && <td className={`p-2 ${text}`}>{number(first(l.avg_hr, l.average_heart_rate), ' bpm')}</td>}{caps.power && <td className={`p-2 ${text}`}>{number(first(l.avg_power, l.average_power), ' W')}</td>}</tr>)}</tbody></table></div> : <p className={`text-sm ${muted}`}>{es ? 'No se recibieron vueltas para esta actividad.' : 'No laps were returned for this activity.'}</p>}</section>}
    {(caps.gps || caps.altitude) && <>{seriesLoading && <div className={`${card} flex items-center gap-2 ${muted}`}><Loader2 className="animate-spin" size={16}/>{es ? 'Cargando ruta y elevación…' : 'Loading route and elevation…'}</div>}{seriesError && !(caps.hr || caps.power) && <div className={`${card} text-sm text-red-600`}>{seriesError}<button className="ml-2 underline" onClick={() => setSeriesAttempt(n => n + 1)}>{es ? 'Reintentar' : 'Retry'}</button></div>}{seriesData && <ElevationAndRoute es={es} data={seriesData} caps={{ gps: Boolean(caps.gps && seriesCaps.gps), altitude: Boolean(caps.altitude && seriesCaps.altitude), cadence: Boolean(caps.cadence), hr: Boolean(caps.hr && seriesCaps.hr), power: Boolean(caps.power && seriesCaps.power) }}/>}</>}
    {reviewComment && !canReview && <section className={card}><h2 className={`font-semibold ${text}`}>{es ? 'Comentario del coach' : 'Coach comment'}</h2><p className={`mt-2 whitespace-pre-wrap text-sm ${muted}`}>{reviewComment}</p></section>}
    {canReview && <section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{es ? 'Revisión' : 'Review'}</h2><textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder={es ? 'Comentario del coach' : 'Coach comment'} className="w-full rounded-xl border border-gray-300 bg-transparent p-3 text-sm dark:border-gray-700"/><label className={`mt-3 flex items-center gap-2 text-sm ${muted}`}><input type="checkbox" checked={visibleToAthlete} onChange={e => setVisibleToAthlete(e.target.checked)}/>{es ? 'Visible para el atleta' : 'Visible to athlete'}</label>{saveError && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{saveError}</p>}<button disabled={saving || saved} onClick={saveReview} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary-purple px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saved ? <CheckCircle2 size={16}/> : saving ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>} {saved ? (es ? 'Revisada' : 'Reviewed') : (es ? 'Marcar como revisada' : 'Mark as reviewed')}</button></section>}
  </div>;
}

export function ReviewInbox({ onOpen, defaultAthleteId, canReview = false }: { onOpen: (row: HubSessionPayload) => void; defaultAthleteId?: string; canReview?: boolean }) {
  const { language } = useLanguage();
  const es = language === 'es';
  const [rows, setRows] = useState<HubSessionPayload[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const [athlete, setAthlete] = useState(''), [status, setStatus] = useState('');
  const range = useMemo(() => { const end = new Date(), start = new Date(); start.setDate(end.getDate() - 30); return { date_from: start.toISOString().slice(0, 10), date_to: end.toISOString().slice(0, 10) }; }, []);
  const refresh = useCallback(() => {
    setLoading(true); setError('');
    hubSessionAction('list-review-inbox', { ...range, ...(!canReview && defaultAthleteId ? { athlete_id: defaultAthleteId } : {}) })
      .then(d => setRows(arr(d.inbox)))
      .catch(e => setError(e.message || (es ? 'Error al cargar la bandeja.' : 'Could not load review inbox.')))
      .finally(() => setLoading(false));
  }, [range, es, canReview, defaultAthleteId]);
  useEffect(() => { refresh(); }, [refresh]);
  const athletes = Array.from(new Set(rows.map(r => String(first(r.athlete_name, r.athlete?.name, r.athlete_id, ''))).filter(Boolean)));
  const filtered = rows.filter(r => (!athlete || String(first(r.athlete_name, r.athlete?.name, r.athlete_id, '')) === athlete) && (!status || String(r.status ?? 'pending') === status));
  return <div className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className={`text-2xl font-semibold ${text}`}>{es ? 'Bandeja de revisión' : 'Review inbox'}</h1><p className={`mt-1 text-sm ${muted}`}>{es ? 'Sesiones ejecutadas · últimos 30 días' : 'Executed sessions · last 30 days'}</p></div><button onClick={refresh} className="rounded-lg border p-2 dark:border-gray-700" aria-label={es ? 'Actualizar' : 'Refresh'}><RefreshCw size={16}/></button></div>
    {canReview && <div className="flex flex-wrap gap-2"><select value={athlete} onChange={e => setAthlete(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">{es ? 'Todos los atletas' : 'All athletes'}</option>{athletes.map(a => <option key={a}>{a}</option>)}</select><select value={status} onChange={e => setStatus(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">{es ? 'Todos los estados' : 'All statuses'}</option><option value="pending">{es ? 'Pendiente' : 'Pending'}</option><option value="reviewed">{es ? 'Revisada' : 'Reviewed'}</option></select></div>}
    {loading ? <p className={muted}><Loader2 className="mr-2 inline animate-spin" size={16}/>{es ? 'Cargando sesiones…' : 'Loading sessions…'}</p> : error ? <p role="alert" className="text-sm text-red-500">{error}</p> : filtered.length ? filtered.map((r, i) => <button key={r.executed_session_id ?? r.id ?? i} onClick={() => onOpen(r)} className={`${card} block w-full text-left transition hover:border-primary-purple`}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className={`font-semibold ${text}`}>{first(r.session_name, r.session?.name, r.name, es ? 'Sesión ejecutada' : 'Executed session')}</h2><p className={`mt-1 text-sm ${muted}`}>{first(r.athlete_name, r.athlete?.name, es ? 'Actividad' : 'Activity')} · {localizedDate(first(r.session_date, r.date, r.started_at), language)}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">{r.status ?? (es ? 'Pendiente' : 'Pending')}</span></div><div className={`mt-3 flex flex-wrap gap-4 text-xs ${muted}`}><span>{es ? 'Desvío duración' : 'Duration deviation'}: {number(first(r.duration_deviation_percent, r.match?.duration_deviation_percent), '%')}</span><span>{es ? 'Desvío distancia' : 'Distance deviation'}: {number(first(r.distance_deviation_percent, r.match?.distance_deviation_percent), '%')}</span><span className="inline-flex items-center gap-1"><Clock3 size={13}/>{number(first(r.duration_minutes, r.metrics?.duration_minutes), ' min')}</span></div></button>) : <p className={`${card} ${muted}`}>{es ? 'No hay sesiones ejecutadas para mostrar en este período.' : 'No executed sessions found for this period.'}</p>}</div>;
}
