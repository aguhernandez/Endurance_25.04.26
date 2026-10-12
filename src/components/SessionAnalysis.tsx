/* eslint-disable @typescript-eslint/no-explicit-any -- The Hub response is a capability-dependent JSON contract without generated client types. */
import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock3, Loader2, RefreshCw } from 'lucide-react';
import { hubSessionAction, HubSessionPayload } from '../lib/hubApi';
import { useLanguage } from '../contexts/LanguageContext';

const card = 'rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900';
const text = 'text-gray-900 dark:text-white';
const muted = 'text-gray-500 dark:text-gray-400';
const number = (v: unknown, unit = '') => v == null || v === '' ? '—' : `${v}${unit}`;
const first = (...v: any[]) => v.find(x => x !== undefined && x !== null);
const obj = (v: any) => v && typeof v === 'object' ? v : {};
const arr = (v: any) => Array.isArray(v) ? v : [];
const seriesArray = (v: any) => Array.isArray(v) ? v : arr(v?.values ?? v?.data ?? v?.samples);

function Metric({ label, planned, actual, unit = '', es = false }: { label: string; planned: unknown; actual: unknown; unit?: string; es?: boolean }) {
  if (planned == null && actual == null) return null;
  return <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"><div className={`text-xs ${muted}`}>{label}</div><div className={`mt-2 grid grid-cols-2 gap-2 text-sm ${text}`}><div><span className={muted}>{es ? 'Plan ' : 'Planned '}</span>{number(planned, unit)}</div><div><span className={muted}>{es ? 'Real ' : 'Actual '}</span>{number(actual, unit)}</div></div></div>;
}

function ZonePanel({ title, zones, es }: { title: string; zones: any[]; es: boolean }) {
  if (!zones.length) return null;
  return <section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{title}</h2><div className="space-y-2">{zones.map((z, i) => <div key={z.zone ?? i} className="grid grid-cols-[3rem_1fr_1fr] items-center gap-2 text-sm"><span className={muted}>Z{z.zone ?? i + 1}</span><span className={text}>{es ? 'Plan' : 'Planned'} {number(first(z.planned_percent, z.planned_seconds, z.planned_time), z.planned_percent != null ? '%' : '')}</span><span className={text}>{es ? 'Real' : 'Actual'} {number(first(z.actual_percent, z.actual_seconds, z.actual_time), z.actual_percent != null ? '%' : '')}</span></div>)}</div></section>;
}

function SeriesChart({ series, steps, es }: { series: any; steps: any[]; es: boolean }) {
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState<number | null>(null);
  const hr = seriesArray(first(series.heart_rate, series.hr, series.heartrate));
  const power = seriesArray(first(series.power, series.watts));
  const values = [...hr, ...power].map((x: any) => Number(typeof x === 'object' ? x.value ?? x.y : x)).filter(Number.isFinite);
  if (!values.length) return null;
  const points = Math.max(hr.length, power.length);
  const poly = (data: any[]) => data.map((x: any, i: number) => {
    const v = Number(typeof x === 'object' ? x.value ?? x.y : x);
    const min = Math.min(...data.map((d: any) => Number(typeof d === 'object' ? d.value ?? d.y : d)).filter(Number.isFinite));
    const max = Math.max(...data.map((d: any) => Number(typeof d === 'object' ? d.value ?? d.y : d)).filter(Number.isFinite));
    return `${i / Math.max(1, data.length - 1) * 1000},${190 - ((v - min) / (max - min || 1)) * 170}`;
  }).join(' ');
  return <section className={card}><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className={`font-semibold ${text}`}>{es ? 'Series' : 'Time series'}</h2><div className="flex items-center gap-2"><span className="text-xs text-red-500">● {es ? 'FC' : 'HR'}</span><span className="text-xs text-amber-500">● {es ? 'Potencia' : 'Power'}</span><button className="rounded-lg border px-2 py-1 text-xs dark:border-gray-700" onClick={() => setZoom(z => z === 1 ? 2 : z === 2 ? 4 : 1)}>{es ? 'Zoom' : 'Zoom'} {zoom}×</button></div></div><div className="overflow-x-auto"><svg viewBox={`0 0 ${1000 / zoom} 210`} className="h-56 min-w-[600px] w-full" onMouseMove={e => setHover(Math.min(points - 1, Math.floor((e.nativeEvent.offsetX / e.currentTarget.clientWidth) * points)))} onMouseLeave={() => setHover(null)}>{steps.map((s: any, i) => { const start = Number(first(s.start_percent, s.start_fraction, s.start_time_percent)); const end = Number(first(s.end_percent, s.end_fraction, s.end_time_percent)); if (!Number.isFinite(start) || !Number.isFinite(end)) return null; const startX = start >= 0 && start <= 1 ? start * 1000 : start * 10; const endX = end >= 0 && end <= 1 ? end * 1000 : end * 10; return <rect key={i} x={startX} y="0" width={Math.max(1, endX - startX)} height="200" fill="#facc15" opacity=".13" />; })}<polyline points={poly(hr).split(' ').map(p => { const [x,y]=p.split(','); return `${Number(x)/zoom},${y}`; }).join(' ')} fill="none" stroke="#ef4444" strokeWidth="2" vectorEffect="non-scaling-stroke"/><polyline points={poly(power).split(' ').map(p => { const [x,y]=p.split(','); return `${Number(x)/zoom},${y}`; }).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="2" vectorEffect="non-scaling-stroke"/>{hover != null && <line x1={hover / Math.max(points - 1,1) * (1000/zoom)} x2={hover / Math.max(points - 1,1) * (1000/zoom)} y1="0" y2="200" stroke="#6b7280" strokeDasharray="4 3"/>}</svg></div>{hover != null && <p className={`text-xs ${muted}`}>{es ? 'Punto' : 'Point'} {hover + 1} · FC {number(typeof hr[hover] === 'object' ? hr[hover]?.value : hr[hover], ' bpm')} · {es ? 'Potencia' : 'Power'} {number(typeof power[hover] === 'object' ? power[hover]?.value : power[hover], ' W')}</p>}</section>;
}

function Elevation({ series, showMap, es }: { series: any; showMap: boolean; es: boolean }) {
  const gps = seriesArray(first(series.gps, series.route, series.points));
  const altitude = seriesArray(first(series.altitude, series.elevation));
  if (!gps.length && !altitude.length) return null;
  const alts = altitude.length ? altitude.map((p: any) => Number(typeof p === 'object' ? p.value ?? p.altitude_m : p)).filter(Number.isFinite) : gps.map((p: any) => Number(p.altitude_m)).filter(Number.isFinite);
  const route = gps.filter((p: any) => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng)));
  return <section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{es ? 'Mapa y perfil de elevación' : 'Map and elevation profile'}</h2>{showMap && route.length > 1 && <div className="mb-4 flex h-48 items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">{es ? 'Ruta disponible · el proyecto no tiene una librería de mapas instalada' : 'Route available · no map library is installed in this project'}</div>}{alts.length > 1 && <svg viewBox="0 0 1000 140" className="h-32 w-full"><polyline points={alts.map((v:number,i:number)=>`${i/(alts.length-1)*1000},${130-(v-Math.min(...alts))/(Math.max(...alts)-Math.min(...alts)||1)*120}`).join(' ')} fill="none" stroke="#10b981" strokeWidth="3"/></svg>}</section>;
}

export default function SessionAnalysis({ athleteId, plannedId, executedId, onBack }: { athleteId: string; plannedId: string; executedId: string; onBack: () => void }) {
  const { language } = useLanguage();
  const es = language === 'es';
  const [analysis, setAnalysis] = useState<HubSessionPayload | null>(null);
  const [series, setSeries] = useState<HubSessionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [error, setError] = useState('');
  const [seriesError, setSeriesError] = useState('');
  const [seriesAttempt, setSeriesAttempt] = useState(0);
  const [comment, setComment] = useState('');
  const [visibleToAthlete, setVisibleToAthlete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setSeries(null); setSeriesError('');
    hubSessionAction('get-session-analysis', { athlete_id: athleteId, planned_session_id: plannedId === 'none' ? null : plannedId, executed_session_id: executedId === 'none' ? null : executedId })
      .then(data => { if (active) { setAnalysis(obj(data.analysis ?? data.data ?? data)); setLoading(false); } })
      .catch(e => { if (active) { setError(e.message || (language === 'es' ? 'No se pudo cargar el análisis.' : 'Could not load session analysis.')); setLoading(false); } });
    return () => { active = false; };
  }, [athleteId, plannedId, executedId, language]);

  useEffect(() => {
    if (!analysis || !athleteId) return;
    const capabilities = obj(analysis.capabilities);
    if (!['timeseries', 'heart_rate_timeseries', 'power_timeseries', 'gps', 'altitude', 'laps'].some(key => capabilities[key])) {
      setSeriesLoading(false);
      return;
    }
    let active = true; setSeriesLoading(true); setSeriesError('');
    hubSessionAction('get-session-timeseries', { athlete_id: athleteId, planned_session_id: plannedId === 'none' ? null : plannedId, executed_session_id: executedId === 'none' ? null : executedId })
      .then(data => { if (active) { setSeries(obj(data.timeseries ?? data.series ?? data.data ?? data)); setSeriesLoading(false); } })
      .catch(e => { if (active) { setSeriesError(e.message || (language === 'es' ? 'No se pudieron cargar las series.' : 'Could not load time series.')); setSeriesLoading(false); } });
    return () => { active = false; };
  }, [analysis, athleteId, plannedId, executedId, seriesAttempt, language]);

  const data = analysis ?? {};
  const caps = obj(data.capabilities);
  const planned = obj(first(data.planned, data.planned_session, data.plan));
  const actual = obj(first(data.executed, data.executed_session, data.actual, data.execution));
  const subjective = obj(first(data.subjective, data.athlete_feedback, data.feedback));
  const zoneResult = first(data.zone_comparison, data.zones);
  const zones = Array.isArray(zoneResult) ? zoneResult : [
    ...arr(zoneResult?.heart_rate ?? zoneResult?.hr).map((z: any) => ({ ...z, type: 'hr' })),
    ...arr(zoneResult?.power).map((z: any) => ({ ...z, type: 'power' })),
  ];
  const hrZones = zones.filter((z:any) => String(z.type ?? z.metric ?? 'hr').toLowerCase().includes('hr') || String(z.type ?? z.metric ?? '').toLowerCase().includes('heart'));
  const powerZones = zones.filter((z:any) => String(z.type ?? z.metric ?? '').toLowerCase().includes('power'));
  const indicators = obj(data.indicators);
  const indicatorRows = [
    { key: es ? 'Deriva de FC' : 'HR drift', value: first(indicators.hr_drift, indicators.heart_rate_drift, data.hr_drift) },
    { key: es ? 'Eficiencia' : 'Efficiency', value: first(indicators.efficiency, data.efficiency) },
    { key: es ? 'IF planificado' : 'Planned IF', value: first(indicators.planned_if, planned.if, planned.intensity_factor) },
    { key: es ? 'IF real' : 'Actual IF', value: first(indicators.actual_if, actual.if, actual.intensity_factor) },
    { key: es ? 'TSS planificado' : 'Planned TSS', value: first(indicators.planned_tss, planned.tss) },
    { key: es ? 'TSS real' : 'Actual TSS', value: first(indicators.actual_tss, actual.tss) },
  ].filter(item => item.value != null);
  const laps = arr(first(data.laps, data.intervals));
  const detail = obj(data.review);
  const meta = { source: first(actual.source, actual.source_name, data.execution_source), passport: first(data.passport_date, data.passport_measurement_date, data.zones_passport_date, data.passport?.measurement_date) };

  if (loading) return <div className={`${card} flex items-center gap-3 ${muted}`}><Loader2 className="animate-spin"/>{es ? 'Cargando análisis de sesión…' : 'Loading session analysis…'}</div>;
  if (error) return <div className={`${card} text-red-600 dark:text-red-400`}><AlertCircle className="mb-2"/><p>{error}</p><button onClick={() => window.location.reload()} className="mt-3 rounded-lg border px-3 py-2 text-sm">{es ? 'Reintentar' : 'Retry'}</button></div>;

  const saveReview = async () => { setSaving(true); setSaveError(''); try { await hubSessionAction('save-review', { athlete_id: athleteId, planned_session_id: plannedId === 'none' ? null : plannedId, executed_session_id: executedId === 'none' ? null : executedId, comment, athlete_visible: visibleToAthlete, status: 'reviewed' }); setSaved(true); } catch(e:any) { setSaveError(e.message || (es ? 'No se pudo guardar la revisión.' : 'Could not save the review.')); } finally { setSaving(false); } };

  return <div className="space-y-4"><button onClick={onBack} className={`inline-flex items-center gap-2 text-sm ${muted}`}><ArrowLeft size={16}/>{es ? 'Volver' : 'Back'}</button><header className={card}><h1 className={`text-2xl font-semibold ${text}`}>{es ? 'Análisis de sesión' : 'Session analysis'}</h1><p className={`mt-1 text-sm ${muted}`}>{first(data.session_name, planned.name, actual.name, es ? 'Sesión' : 'Session')} · {first(actual.date, planned.date, data.session_date, '')}</p><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"><Metric es={es} label={es ? 'Duración' : 'Duration'} planned={first(planned.duration, planned.duration_minutes)} actual={first(actual.duration, actual.duration_minutes)} unit=" min"/><Metric es={es} label={es ? 'Distancia' : 'Distance'} planned={first(planned.distance, planned.distance_km)} actual={first(actual.distance, actual.distance_km)} unit=" km"/><Metric es={es} label={es ? 'FC media' : 'Average HR'} planned={first(planned.avg_hr, planned.average_heart_rate)} actual={first(actual.avg_hr, actual.average_heart_rate)} unit=" bpm"/><Metric es={es} label={es ? 'FC máxima' : 'Max HR'} planned={first(planned.max_hr, planned.max_heart_rate)} actual={first(actual.max_hr, actual.max_heart_rate)} unit=" bpm"/><Metric es={es} label={es ? 'Calorías' : 'Calories'} planned={first(planned.calories, planned.calories_kcal)} actual={first(actual.calories, actual.calories_kcal)} unit=" kcal"/></div><div className={`mt-3 flex flex-wrap gap-4 text-xs ${muted}`}><span>{es ? 'Fuente' : 'Source'}: {number(meta.source)}</span><span>{es ? 'Pasaporte para zonas' : 'Passport used for zones'}: {number(meta.passport)}</span></div></header>
    {(Object.values(subjective).some(v => v != null && v !== '') || data.rpe != null || data.athlete_comment != null) && <section className={card}><h2 className={`font-semibold ${text}`}>{es ? 'Contexto del atleta' : 'Athlete context'}</h2><div className={`mt-2 flex flex-wrap gap-4 text-sm ${muted}`}><span>RPE: {number(first(subjective.rpe, subjective.perceived_exertion, data.rpe))}</span><span>{first(subjective.comment, subjective.comments, subjective.notes, data.athlete_comment, '')}</span></div></section>}
    {(caps.heart_rate_zones || caps.hr_zones || caps.zones) && <ZonePanel es={es} title={es ? "Tiempo en zonas · FC" : "Time in zones · HR"} zones={hrZones.length ? hrZones : zones}/>} {(caps.power_zones || caps.power) && <ZonePanel es={es} title={es ? "Tiempo en zonas · Potencia" : "Time in zones · Power"} zones={powerZones}/>}
    {(caps.timeseries || caps.heart_rate_timeseries || caps.power_timeseries) && <>{seriesLoading && <div className={`${card} flex items-center gap-2 ${muted}`}><Loader2 className="animate-spin" size={16}/>{es ? 'Cargando series…' : 'Loading time series…'}</div>}{seriesError && <div className={`${card} text-sm text-red-600`}>{seriesError}<button className="ml-2 underline" onClick={() => setSeriesAttempt(n => n + 1)}>{es ? 'Reintentar' : 'Retry'}</button></div>}{series && <SeriesChart es={es} series={series} steps={arr(first(data.planned_steps, planned.steps))}/>}</>}
    {(caps.derived_indicators || caps.indicators || caps.drift || caps.efficiency || caps.if || caps.tss) && indicatorRows.length > 0 && <section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{es ? 'Indicadores' : 'Indicators'}</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{indicatorRows.map(({key, value}) => <div key={key} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"><p className={`text-xs ${muted}`}>{key}</p><p className={`mt-1 font-medium ${text}`}>{value}</p></div>)}</div></section>}
    {caps.laps && laps.length > 0 && <section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{es ? 'Vueltas e intervalos' : 'Laps and intervals'}</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className={muted}><tr><th className="p-2">{es ? 'Intervalo' : 'Interval'}</th><th className="p-2">{es ? 'Duración' : 'Duration'}</th><th className="p-2">FC</th><th className="p-2">{es ? 'Potencia' : 'Power'}</th></tr></thead><tbody>{laps.map((l:any,i:number)=><tr key={i} className="border-t dark:border-gray-700"><td className={`p-2 ${text}`}>{l.label ?? l.name ?? `#${i+1}`}</td><td className={`p-2 ${text}`}>{number(first(l.duration_s,l.duration))}</td><td className={`p-2 ${text}`}>{number(first(l.avg_hr,l.average_heart_rate))}</td><td className={`p-2 ${text}`}>{number(first(l.avg_power,l.average_power))}</td></tr>)}</tbody></table></div></section>}
    {(caps.gps || caps.altitude) && series && <Elevation es={es} series={series} showMap={Boolean(caps.gps)}/>}<section className={card}><h2 className={`mb-3 font-semibold ${text}`}>{es ? 'Revisión' : 'Review'}</h2>{detail.comment && <p className={`mb-3 text-sm ${muted}`}>{es ? 'Comentario previo' : 'Previous comment'}: {detail.comment}</p>}<textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3} placeholder={es ? "Comentario del coach" : "Coach comment"} className="w-full rounded-xl border border-gray-300 bg-transparent p-3 text-sm dark:border-gray-700"/><label className={`mt-3 flex items-center gap-2 text-sm ${muted}`}><input type="checkbox" checked={visibleToAthlete} onChange={e=>setVisibleToAthlete(e.target.checked)}/>{es ? 'Visible para el atleta' : 'Visible to athlete'}</label>{saveError && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{saveError}</p>}<button disabled={saving || saved} onClick={saveReview} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary-purple px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saved ? <CheckCircle2 size={16}/> : saving ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>} {saved ? (es ? 'Revisada' : 'Reviewed') : (es ? 'Marcar como revisada' : 'Mark as reviewed')}</button></section></div>;
}

export function ReviewInbox({ onOpen }: { onOpen: (row: HubSessionPayload) => void }) {
  const { language } = useLanguage();
  const es = language === 'es';
  const [rows,setRows]=useState<HubSessionPayload[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [athlete,setAthlete]=useState(''); const [status,setStatus]=useState('');
  const refresh=()=>{setLoading(true);setError('');hubSessionAction('list-review-inbox').then(d=>setRows(arr(d.sessions ?? d.items ?? d.data ?? d))).catch(e=>setError(e.message || 'Error al cargar bandeja')).finally(()=>setLoading(false));};
  useEffect(refresh,[]);
  const athletes=Array.from(new Set(rows.map(r=>String(first(r.athlete_name,r.athlete?.name,r.athlete_id,''))).filter(Boolean)));
  const filtered=rows.filter(r=>(!athlete || String(first(r.athlete_name,r.athlete?.name,r.athlete_id,''))===athlete) && (!status || String(r.status ?? 'pending')===status));
  return <div className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className={`text-2xl font-semibold ${text}`}>{es ? 'Bandeja de revisión' : 'Review inbox'}</h1><p className={`mt-1 text-sm ${muted}`}>{es ? 'Sesiones pendientes de los atletas' : 'Sessions waiting for review'}</p></div><button onClick={refresh} className="rounded-lg border p-2 dark:border-gray-700" aria-label={es ? "Actualizar" : "Refresh"}><RefreshCw size={16}/></button></div><div className="flex flex-wrap gap-2"><select value={athlete} onChange={e=>setAthlete(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">{es ? 'Todos los atletas' : 'All athletes'}</option>{athletes.map(a=><option key={a}>{a}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2 text-sm dark:border-gray-700"><option value="">{es ? 'Todos los estados' : 'All statuses'}</option><option value="pending">{es ? 'Pendiente' : 'Pending'}</option><option value="reviewed">{es ? 'Revisada' : 'Reviewed'}</option></select></div>{loading ? <p className={muted}><Loader2 className="mr-2 inline animate-spin" size={16}/>{es ? 'Cargando sesiones…' : 'Loading sessions…'}</p> : error ? <p className="text-sm text-red-500">{error}</p> : filtered.length ? filtered.map((r,i)=><button key={r.executed_session_id ?? r.id ?? i} onClick={()=>onOpen(r)} className={`${card} block w-full text-left transition hover:border-primary-purple`}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className={`font-semibold ${text}`}>{first(r.session_name,r.name,es ? 'Sesión' : 'Session')}</h2><p className={`mt-1 text-sm ${muted}`}>{first(r.athlete_name,r.athlete?.name,es ? 'Atleta' : 'Athlete')} · {first(r.date,r.session_date,'')}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">{r.status ?? 'Pendiente'}</span></div><div className={`mt-3 flex flex-wrap gap-4 text-xs ${muted}`}><span>{es ? 'Desvío duración' : 'Duration deviation'}: {number(r.duration_deviation_percent, '%')}</span><span>{es ? 'Desvío distancia' : 'Distance deviation'}: {number(r.distance_deviation_percent, '%')}</span><span className="inline-flex items-center gap-1"><Clock3 size={13}/>{number(r.actual_duration_minutes, ' min')}</span></div></button>) : <p className={`${card} ${muted}`}>{es ? 'No hay sesiones para revisar.' : 'No sessions to review.'}</p>}</div>;
}
