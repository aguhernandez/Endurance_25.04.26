import { useState } from 'react';
import { Plus, Trash2, Trophy, Target, Flag, Link2 } from 'lucide-react';
import { ATPEvent } from '../../types/workout';
import { HubSharedEvent } from '../../lib/hubApi';

interface ATPEventsPanelProps {
  events: ATPEvent[];
  planId: string | null;
  onAdd: (evt: { event_name: string; event_date: string; priority: 'A' | 'B' | 'C'; notes?: string; shared_event_id?: string | null }) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  saving: boolean;
  sharedEvents?: HubSharedEvent[];
  sharedLoading?: boolean;
  onCreateShared?: (event: { title: string; event_date: string; priority: 'A' | 'B' | 'C'; notes?: string; external_key: string }) => Promise<void>;
  onSelectShared?: (event: HubSharedEvent) => Promise<void>;
}

const priorities = ['A', 'B', 'C'] as const;
const makeKey = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

export default function ATPEventsPanel({ events, planId, onAdd, onRemove, saving, sharedEvents = [], sharedLoading, onCreateShared, onSelectShared }: ATPEventsPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', priority: 'A' as 'A' | 'B' | 'C', notes: '', key: makeKey() });
  const [submitting, setSubmitting] = useState(false);
  const selected = new Set(events.map(event => event.shared_event_id).filter(Boolean));
  const datedShared = sharedEvents.filter(event => event.event_date && event.status !== 'cancelled');
  const reset = () => setForm({ title: '', date: '', priority: 'A', notes: '', key: makeKey() });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!planId || !form.title || !form.date) return;
    setSubmitting(true);
    try {
      if (onCreateShared) await onCreateShared({ title: form.title, event_date: form.date, priority: form.priority, notes: form.notes || undefined, external_key: `atp:${planId}:${form.key}` });
      else await onAdd({ event_name: form.title, event_date: form.date, priority: form.priority, notes: form.notes || undefined });
      reset(); setShowForm(false);
    } finally { setSubmitting(false); }
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Events & races</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Hub is the source of truth; ATP stores only selected planning references.</p>
        </div>
        <button type="button" onClick={() => setShowForm(value => !value)} disabled={!planId} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#514163] hover:bg-[#42334f] disabled:bg-gray-200 text-white disabled:text-gray-500 text-sm font-medium">
          <Plus size={14} /> Add event
        </button>
      </div>

      {showForm && planId && <form onSubmit={submit} className="mb-4 grid gap-3 border border-[#514163]/20 bg-[#514163]/5 p-4 rounded-lg">
        <input required value={form.title} onChange={e => setForm(value => ({ ...value, title: e.target.value }))} placeholder="Event name" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
        <div className="grid grid-cols-2 gap-3">
          <input required type="date" value={form.date} onChange={e => setForm(value => ({ ...value, date: e.target.value }))} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
          <select value={form.priority} onChange={e => setForm(value => ({ ...value, priority: e.target.value as 'A' | 'B' | 'C' }))} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600">
            {priorities.map(priority => <option key={priority} value={priority}>{priority} priority</option>)}
          </select>
        </div>
        <input value={form.notes} onChange={e => setForm(value => ({ ...value, notes: e.target.value }))} placeholder="Notes (optional)" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
        <div className="flex gap-2"><button disabled={submitting} className="rounded-md bg-[#514163] px-3 py-2 text-sm font-medium text-white">{submitting ? 'Saving…' : 'Save in Hub'}</button><button type="button" onClick={() => { reset(); setShowForm(false); }} className="rounded-md border border-gray-300 px-3 py-2 text-sm">Cancel</button></div>
      </form>}

      {planId && <div className="mb-5 border-y border-gray-100 py-3 dark:border-gray-700">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Hub competitions available to this ATP</p>
        {sharedLoading ? <p className="text-sm text-gray-500">Loading shared context…</p> : datedShared.length === 0 ? <p className="text-sm text-gray-500">No dated Hub competitions yet.</p> : <div className="space-y-2">
          {datedShared.map(event => <div key={event.id} className="flex items-center gap-2 rounded-md bg-gray-50 p-2 dark:bg-gray-700/40">
            <Flag size={14} className="text-[#FDDA36]" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{event.title}</p><p className="text-xs text-gray-500">{event.event_date} · {event.priority || 'C'} · {event.status}</p></div>
            <button type="button" disabled={selected.has(event.id) || saving} onClick={() => onSelectShared?.(event)} className="rounded-md border border-[#514163] px-2 py-1 text-xs font-medium text-[#514163] disabled:border-gray-200 disabled:text-gray-400">{selected.has(event.id) ? 'In ATP' : 'Use in ATP'}</button>
          </div>)}
        </div>}
        {sharedEvents.some(event => !event.event_date && event.status !== 'cancelled') && <p className="mt-2 text-xs text-gray-500">Continuous objectives remain visible in Hub context and do not receive an invented ATP date.</p>}
      </div>}

      <div className="space-y-2">
        {events.length === 0 && <p className="py-3 text-center text-sm text-gray-500">No events selected for this ATP.</p>}
        {events.map(event => <div key={event.id} className="group flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/30">
          {event.priority === 'A' ? <Trophy size={16} className="text-red-500" /> : event.priority === 'B' ? <Target size={16} className="text-amber-500" /> : <Flag size={16} className="text-gray-500" />}
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-gray-900 dark:text-white">{event.event_name}</p><p className="text-xs text-gray-500">{event.event_date} · {event.priority}{event.shared_event_id ? <span className="ml-2 inline-flex items-center gap-1"><Link2 size={10} /> Hub</span> : null}</p></div>
          <button type="button" onClick={() => onRemove(event.id)} disabled={saving} title="Remove from this ATP only" className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
        </div>)}
      </div>
    </section>
  );
}
