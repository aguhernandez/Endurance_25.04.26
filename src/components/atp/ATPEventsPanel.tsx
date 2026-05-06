import { useState } from 'react';
import { Plus, Trash2, Trophy, Target, Flag } from 'lucide-react';
import { ATPEvent } from '../../types/workout';

interface ATPEventsPanelProps {
  events: ATPEvent[];
  planId: string | null;
  onAdd: (evt: { event_name: string; event_date: string; priority: 'A' | 'B' | 'C'; notes?: string }) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  saving: boolean;
}

const PRIORITY_CONFIG = {
  A: {
    label: 'A — Peak',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    icon: Trophy,
    description: 'Full taper, RB peak target',
  },
  B: {
    label: 'B — Moderate',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    icon: Target,
    description: 'Short taper (7 days)',
  },
  C: {
    label: 'C — Training',
    color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600',
    dot: 'bg-gray-400',
    icon: Flag,
    description: 'No taper',
  },
};

export default function ATPEventsPanel({ events, planId, onAdd, onRemove, saving }: ATPEventsPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    priority: 'A' as 'A' | 'B' | 'C',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!planId || !formData.event_name || !formData.event_date) return;
    setSubmitting(true);
    try {
      await onAdd({
        event_name: formData.event_name,
        event_date: formData.event_date,
        priority: formData.priority,
        notes: formData.notes || undefined,
      });
      setFormData({ event_name: '', event_date: '', priority: 'A', notes: '' });
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getDaysUntil(dateStr: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const evt = new Date(dateStr + 'T00:00:00');
    const diff = Math.round((evt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)}d ago`;
    if (diff === 0) return 'Today';
    return `${diff}d away`;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Events & Races</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{events.length} event{events.length !== 1 ? 's' : ''} scheduled</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={!planId}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            planId
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus size={14} />
          Add Event
        </button>
      </div>

      {!planId && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Save parameters first to add events</p>
        </div>
      )}

      {showForm && planId && (
        <form onSubmit={handleSubmit} className="mb-5 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Event Name</label>
            <input
              type="text"
              required
              value={formData.event_name}
              onChange={e => setFormData(p => ({ ...p, event_name: e.target.value }))}
              placeholder="e.g. Ironman Lake Placid"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.event_date}
                onChange={e => setFormData(p => ({ ...p, event_date: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData(p => ({ ...p, priority: e.target.value as 'A' | 'B' | 'C' }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A">A — Peak</option>
                <option value="B">B — Moderate</option>
                <option value="C">C — Training</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="Optional notes"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              {submitting ? 'Adding...' : 'Add Event'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {events.length === 0 && planId && (
          <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
            No events yet. Add your first race or target event.
          </div>
        )}
        {events.map(evt => {
          const cfg = PRIORITY_CONFIG[evt.priority];
          const Icon = cfg.icon;
          return (
            <div
              key={evt.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${cfg.color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{evt.event_name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                    {evt.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(evt.event_date)}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{getDaysUntil(evt.event_date)}</span>
                </div>
              </div>
              <button
                onClick={() => onRemove(evt.id)}
                disabled={saving}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="space-y-1.5">
          {(Object.entries(PRIORITY_CONFIG) as [string, typeof PRIORITY_CONFIG['A']][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{cfg.label}</span>
                {' '}— {cfg.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
