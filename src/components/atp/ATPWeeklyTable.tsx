import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Trophy, Target, Flag, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import { WeekSimResult } from '../../lib/banisterEngine';

interface ATPWeeklyTableProps {
  weeks: WeekSimResult[];
  weekOverrideMap?: Map<number, number>;
  onWeekOverride?: (weekNumber: number, weekStartDate: string, impulse: number) => void;
  onWeekOverrideClear?: (weekNumber: number) => void;
}

const MICROCYCLE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Load 1', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  2: { label: 'Load 2', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  3: { label: 'Load 3', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  4: { label: 'Deload', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function RBBadge({ rb }: { rb: number }) {
  if (rb >= 5) return (
    <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
      <TrendingUp size={11} />
      +{rb.toFixed(1)}
    </span>
  );
  if (rb >= -10) return (
    <span className="text-gray-600 dark:text-gray-400 font-medium">
      {rb.toFixed(1)}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-red-500 dark:text-red-400 font-medium">
      <TrendingDown size={11} />
      {rb.toFixed(1)}
    </span>
  );
}

function EventBadge({ priority, name }: { priority: 'A' | 'B' | 'C'; name: string }) {
  const configs = {
    A: { Icon: Trophy, cls: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
    B: { Icon: Target, cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
    C: { Icon: Flag, cls: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600' },
  };
  const { Icon, cls } = configs[priority];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs font-medium ${cls}`}>
      <Icon size={10} />
      {name}
    </span>
  );
}

interface ImpulseCellProps {
  week: WeekSimResult;
  isOverride: boolean;
  onOverride?: (weekNumber: number, weekStartDate: string, impulse: number) => void;
  onClear?: (weekNumber: number) => void;
}

function ImpulseCell({ week, isOverride, onOverride, onClear }: ImpulseCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (!onOverride) {
    return <span className="text-sm font-medium text-gray-900 dark:text-white">{week.totalImpulse.toFixed(0)}</span>;
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min="0"
        step="1"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            const v = parseFloat(draft);
            if (!isNaN(v) && v >= 0) {
              onOverride(week.weekNumber, week.weekStartDate, v);
            }
            setEditing(false);
          } else if (e.key === 'Escape') {
            setEditing(false);
          }
        }}
        onBlur={() => {
          const v = parseFloat(draft);
          if (!isNaN(v) && v >= 0) {
            onOverride(week.weekNumber, week.weekStartDate, v);
          }
          setEditing(false);
        }}
        autoFocus
        className="w-16 text-sm text-center font-medium border border-blue-400 rounded px-1 py-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    );
  }

  return (
    <div className="flex items-center gap-1 group/imp">
      <button
        onClick={() => { setDraft(week.totalImpulse.toFixed(0)); setEditing(true); }}
        title="Click to edit weekly load"
        className={`text-sm font-medium tabular-nums rounded px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer ${
          isOverride ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'
        }`}
      >
        {week.totalImpulse.toFixed(0)}
      </button>
      {isOverride && onClear && (
        <button
          onClick={() => onClear(week.weekNumber)}
          title="Reset to auto-computed load"
          className="opacity-0 group-hover/imp:opacity-100 p-0.5 rounded text-gray-400 hover:text-orange-500 transition"
        >
          <RotateCcw size={11} />
        </button>
      )}
    </div>
  );
}

const PAGE_SIZE = 20;

export default function ATPWeeklyTable({
  weeks,
  weekOverrideMap,
  onWeekOverride,
  onWeekOverrideClear,
}: ATPWeeklyTableProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(weeks.length / PAGE_SIZE);
  const pageWeeks = weeks.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (weeks.length === 0) return null;

  const hasOverrides = weekOverrideMap && weekOverrideMap.size > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Weekly Training Plan</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {weeks.length} weeks · Click row to expand · Click impulse value to edit load
            {hasOverrides && <span className="ml-2 text-orange-500 dark:text-orange-400">{weekOverrideMap!.size} week{weekOverrideMap!.size !== 1 ? 's' : ''} overridden</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {page > 0 && (
            <button onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Prev
            </button>
          )}
          <span>Page {page + 1} / {totalPages}</span>
          {page < totalPages - 1 && (
            <button onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Next
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Week</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Dates</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cycle</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Impulse</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">CA</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">AL</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">RB</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Events</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {pageWeeks.map(week => {
              const mc = MICROCYCLE_LABELS[week.microcycleWeek];
              const isExpanded = expandedWeek === week.weekNumber;
              const eventDays = week.days.filter(d => d.isEventDay);
              const isOverride = weekOverrideMap?.has(week.weekNumber) ?? false;
              const rowBg = week.hasAEvent
                ? 'bg-red-50/30 dark:bg-red-900/10'
                : week.hasBEvent
                ? 'bg-amber-50/30 dark:bg-amber-900/10'
                : isOverride
                ? 'bg-orange-50/20 dark:bg-orange-900/5'
                : week.microcycleWeek === 4
                ? 'bg-emerald-50/20 dark:bg-emerald-900/10'
                : '';

              return (
                <>
                  <tr
                    key={week.weekNumber}
                    onClick={() => setExpandedWeek(isExpanded ? null : week.weekNumber)}
                    className={`border-b border-gray-50 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${rowBg}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">W{week.weekNumber + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(week.weekStartDate)} – {formatDate(week.weekEndDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${mc.color}`}>
                        {mc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <ImpulseCell
                        week={week}
                        isOverride={isOverride}
                        onOverride={onWeekOverride}
                        onClear={onWeekOverrideClear}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{week.ca.toFixed(1)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">{week.al.toFixed(1)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RBBadge rb={week.rb} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {eventDays.map(d => (
                          <EventBadge key={d.date} priority={d.eventPriority!} name={d.eventName!} />
                        ))}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-gray-400">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr key={`${week.weekNumber}-expanded`} className="bg-gray-50 dark:bg-gray-900/30">
                      <td colSpan={9} className="px-4 py-3">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                {['Day', 'Date', 'Impulse', 'CA', 'AL', 'RB', ''].map(h => (
                                  <th key={h} className="text-xs font-medium text-gray-400 dark:text-gray-500 text-left pb-2 pr-4 uppercase tracking-wide">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {week.days.map(day => {
                                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                return (
                                  <tr key={day.date} className={`${day.isEventDay ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                                    <td className="py-1.5 pr-4 text-xs font-medium text-gray-700 dark:text-gray-300">{dayNames[day.dayOfWeek]}</td>
                                    <td className="py-1.5 pr-4 text-xs text-gray-500 dark:text-gray-400">{day.date}</td>
                                    <td className="py-1.5 pr-4 text-xs text-gray-700 dark:text-gray-300 font-medium">{day.impulse.toFixed(1)}</td>
                                    <td className="py-1.5 pr-4 text-xs text-blue-600 dark:text-blue-400">{day.ca.toFixed(1)}</td>
                                    <td className="py-1.5 pr-4 text-xs text-amber-600 dark:text-amber-400">{day.al.toFixed(1)}</td>
                                    <td className="py-1.5 pr-4">
                                      <RBBadge rb={day.rb} />
                                    </td>
                                    <td className="py-1.5">
                                      {day.isEventDay && (
                                        <EventBadge priority={day.eventPriority!} name={day.eventName!} />
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
