export interface ATPParams {
  caStart: number;
  alStart: number;
  tauChronic: number;
  tauAcute: number;
  rbMin: number;
  rbPeakTarget: number;
  caTargetMainEvent: number;
  planStartDate: string;
}

export interface ATPEvent {
  id: string;
  eventName: string;
  eventDate: string;
  priority: 'A' | 'B' | 'C';
}

export interface DaySimResult {
  date: string;
  ca: number;
  al: number;
  rb: number;
  impulse: number;
  weekNumber: number;
  dayOfWeek: number;
  isEventDay: boolean;
  eventPriority?: 'A' | 'B' | 'C';
  eventName?: string;
  microcycleWeek: number;
}

export interface WeekSimResult {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  ca: number;
  al: number;
  rb: number;
  totalImpulse: number;
  days: DaySimResult[];
  microcycleWeek: number;
  hasAEvent: boolean;
  hasBEvent: boolean;
  hasCEvent: boolean;
}

function dateToStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function getWeeksBetween(a: Date, b: Date): number {
  return daysBetween(a, b) / 7;
}

function caTargetAtDay(
  caStart: number,
  caFinal: number,
  totalDays: number,
  dayIndex: number,
  k: number = 0.1
): number {
  const weekIndex = dayIndex / 7;
  const totalWeeks = totalDays / 7;
  if (totalWeeks <= 0) return caFinal;
  const progress = weekIndex / totalWeeks;
  return caStart + (caFinal - caStart) * (1 - Math.exp(-k * weekIndex));
}

function getTaperMultiplier(
  daysToEvent: number,
  priority: 'A' | 'B' | 'C'
): number {
  if (priority === 'A') {
    if (daysToEvent <= 2) return 0.40;
    if (daysToEvent <= 7) return 0.60;
    if (daysToEvent <= 14) return 0.85;
  } else if (priority === 'B') {
    if (daysToEvent <= 2) return 0.55;
    if (daysToEvent <= 7) return 0.75;
  }
  return 1.0;
}

function getActiveTaper(
  date: Date,
  events: ATPEvent[]
): { multiplier: number; priority: 'A' | 'B' | 'C' } | null {
  let lowestMultiplier = 1.0;
  let taperPriority: 'A' | 'B' | 'C' = 'C';
  let hasTaper = false;

  for (const evt of events) {
    const evtDate = new Date(evt.eventDate + 'T00:00:00');
    const daysTo = daysBetween(date, evtDate);
    if (daysTo < 0) continue;

    const mult = getTaperMultiplier(daysTo, evt.priority);
    if (mult < lowestMultiplier) {
      lowestMultiplier = mult;
      taperPriority = evt.priority;
      hasTaper = true;
    }
  }

  if (!hasTaper || lowestMultiplier >= 1.0) return null;
  return { multiplier: lowestMultiplier, priority: taperPriority };
}

function getMicrocycleWeek(absoluteWeek: number): number {
  return (absoluteWeek % 4) + 1;
}

function getMicrocycleMultiplier(microcycleWeek: number): number {
  if (microcycleWeek === 4) return 0.75;
  return 1.05;
}

function computeImpulseNeeded(
  caYesterday: number,
  caTargetTomorrow: number,
  tauChronic: number
): number {
  return (caTargetTomorrow - caYesterday) * tauChronic + caYesterday;
}

function clampImpulse(impulse: number): number {
  return Math.max(0, impulse);
}

function simulateDayForward(
  ca: number,
  al: number,
  impulse: number,
  tauChronic: number,
  tauAcute: number
): { ca: number; al: number; rb: number } {
  const newCa = ca + (impulse - ca) / tauChronic;
  const newAl = al + (impulse - al) / tauAcute;
  const newRb = newCa - newAl;
  return { ca: newCa, al: newAl, rb: newRb };
}

export interface WeekOverride {
  weekNumber: number;
  overrideImpulse: number;
}

export function runATPSimulation(
  params: ATPParams,
  events: ATPEvent[],
  weekOverrides: WeekOverride[] = []
): { days: DaySimResult[]; weeks: WeekSimResult[] } {
  const overrideMap = new Map<number, number>();
  for (const o of weekOverrides) {
    overrideMap.set(o.weekNumber, o.overrideImpulse);
  }
  const startDate = new Date(params.planStartDate + 'T00:00:00');

  const aEvents = events.filter(e => e.priority === 'A').sort((a, b) =>
    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  const mainEvent = aEvents.length > 0 ? aEvents[aEvents.length - 1] : null;

  const endDate = mainEvent
    ? new Date(mainEvent.eventDate + 'T00:00:00')
    : addDays(startDate, 365);

  const totalDays = daysBetween(startDate, endDate);

  let ca = params.caStart;
  let al = params.alStart;

  const days: DaySimResult[] = [];
  const eventMap = new Map<string, ATPEvent>();
  for (const evt of events) {
    eventMap.set(evt.eventDate, evt);
  }

  for (let dayIdx = 0; dayIdx <= totalDays; dayIdx++) {
    const currentDate = addDays(startDate, dayIdx);
    const dateStr = dateToStr(currentDate);
    const absoluteWeek = Math.floor(dayIdx / 7);
    const microcycleWeek = getMicrocycleWeek(absoluteWeek);
    const microcycleMultiplier = getMicrocycleMultiplier(microcycleWeek);

    const caTargetToday = caTargetAtDay(
      params.caStart,
      params.caTargetMainEvent,
      totalDays,
      dayIdx
    );

    const caTargetNextDay = caTargetAtDay(
      params.caStart,
      params.caTargetMainEvent,
      totalDays,
      dayIdx + 1
    );

    let impulseNeeded = computeImpulseNeeded(ca, caTargetNextDay, params.tauChronic);
    impulseNeeded = clampImpulse(impulseNeeded);
    impulseNeeded *= microcycleMultiplier;

    const taperInfo = getActiveTaper(currentDate, events);
    if (taperInfo) {
      impulseNeeded *= taperInfo.multiplier;
    }

    impulseNeeded = clampImpulse(impulseNeeded);

    const weekOverrideTotal = overrideMap.get(absoluteWeek);
    if (weekOverrideTotal !== undefined) {
      const daysInWeek = Math.min(7, totalDays - absoluteWeek * 7 + 1);
      impulseNeeded = Math.max(0, weekOverrideTotal / daysInWeek);
    }

    let sim = simulateDayForward(ca, al, impulseNeeded, params.tauChronic, params.tauAcute);

    let iterations = 0;
    while (sim.rb < params.rbMin && iterations < 50) {
      impulseNeeded *= 0.95;
      if (impulseNeeded < 0) { impulseNeeded = 0; break; }
      sim = simulateDayForward(ca, al, impulseNeeded, params.tauChronic, params.tauAcute);
      iterations++;
    }

    const evt = eventMap.get(dateStr);

    days.push({
      date: dateStr,
      ca: Math.round(sim.ca * 100) / 100,
      al: Math.round(sim.al * 100) / 100,
      rb: Math.round(sim.rb * 100) / 100,
      impulse: Math.round(impulseNeeded * 10) / 10,
      weekNumber: absoluteWeek,
      dayOfWeek: currentDate.getDay(),
      isEventDay: !!evt,
      eventPriority: evt?.priority,
      eventName: evt?.eventName,
      microcycleWeek,
    });

    ca = sim.ca;
    al = sim.al;
  }

  const weekMap = new Map<number, DaySimResult[]>();
  for (const day of days) {
    const existing = weekMap.get(day.weekNumber) || [];
    existing.push(day);
    weekMap.set(day.weekNumber, existing);
  }

  const weeks: WeekSimResult[] = [];
  const sortedWeekNums = Array.from(weekMap.keys()).sort((a, b) => a - b);

  for (const wn of sortedWeekNums) {
    const wDays = weekMap.get(wn)!;
    const lastDay = wDays[wDays.length - 1];
    const firstDay = wDays[0];

    weeks.push({
      weekNumber: wn,
      weekStartDate: firstDay.date,
      weekEndDate: lastDay.date,
      ca: lastDay.ca,
      al: lastDay.al,
      rb: lastDay.rb,
      totalImpulse: Math.round(wDays.reduce((s, d) => s + d.impulse, 0) * 10) / 10,
      days: wDays,
      microcycleWeek: lastDay.microcycleWeek,
      hasAEvent: wDays.some(d => d.eventPriority === 'A'),
      hasBEvent: wDays.some(d => d.eventPriority === 'B'),
      hasCEvent: wDays.some(d => d.eventPriority === 'C'),
    });
  }

  return { days, weeks };
}

export function getMonthlyAggregates(weeks: WeekSimResult[]): {
  month: string;
  ca: number;
  al: number;
  rb: number;
  totalImpulse: number;
}[] {
  const monthMap = new Map<string, WeekSimResult[]>();
  for (const week of weeks) {
    const d = new Date(week.weekEndDate + 'T00:00:00');
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const existing = monthMap.get(key) || [];
    existing.push(week);
    monthMap.set(key, existing);
  }

  const result = [];
  for (const [month, mWeeks] of monthMap.entries()) {
    const lastWeek = mWeeks[mWeeks.length - 1];
    result.push({
      month,
      ca: lastWeek.ca,
      al: lastWeek.al,
      rb: lastWeek.rb,
      totalImpulse: Math.round(mWeeks.reduce((s, w) => s + w.totalImpulse, 0) * 10) / 10,
    });
  }

  return result.sort((a, b) => a.month.localeCompare(b.month));
}
