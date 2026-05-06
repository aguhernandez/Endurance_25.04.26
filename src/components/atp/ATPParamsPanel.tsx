import { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react';
import { ATPPlan } from '../../types/workout';

interface ATPParamsPanelProps {
  plan: ATPPlan | null;
  onSave: (params: Partial<ATPPlan>) => Promise<void>;
  onChange?: (params: Partial<ATPPlan>) => void;
  saving: boolean;
}

const DEFAULT_PARAMS = {
  plan_name: 'Annual Training Plan',
  ca_start: 50,
  al_start: 50,
  tau_chronic: 28,
  tau_acute: 7,
  rb_min: -25,
  rb_peak_target: 10,
  ca_target_main_event: 100,
  plan_start_date: new Date().toISOString().split('T')[0],
};

interface FieldConfig {
  key: keyof typeof DEFAULT_PARAMS;
  label: string;
  description: string;
  type: 'number' | 'text' | 'date';
  min?: number;
  max?: number;
  step?: number;
}

const FIELDS: FieldConfig[] = [
  {
    key: 'plan_start_date',
    label: 'Plan Start Date',
    description: 'The date from which the simulation begins',
    type: 'date',
  },
  {
    key: 'ca_start',
    label: 'CA Start',
    description: 'Current Chronic Adaptation (fitness baseline)',
    type: 'number',
    min: 0,
    max: 300,
    step: 1,
  },
  {
    key: 'al_start',
    label: 'AL Start',
    description: 'Current Acute Load (fatigue baseline)',
    type: 'number',
    min: 0,
    max: 300,
    step: 1,
  },
  {
    key: 'ca_target_main_event',
    label: 'CA Target (Main Event)',
    description: 'Desired Chronic Adaptation at A-priority event',
    type: 'number',
    min: 0,
    max: 500,
    step: 1,
  },
  {
    key: 'tau_chronic',
    label: 'τ Chronic (days)',
    description: 'Time constant for fitness adaptation decay (default: 28)',
    type: 'number',
    min: 14,
    max: 60,
    step: 1,
  },
  {
    key: 'tau_acute',
    label: 'τ Acute (days)',
    description: 'Time constant for fatigue decay (default: 7)',
    type: 'number',
    min: 3,
    max: 21,
    step: 1,
  },
  {
    key: 'rb_min',
    label: 'RB Minimum',
    description: 'Minimum allowed Readiness Balance (e.g., -25)',
    type: 'number',
    min: -80,
    max: 0,
    step: 1,
  },
  {
    key: 'rb_peak_target',
    label: 'RB Peak Target',
    description: 'Target Readiness Balance on event day (e.g., +10)',
    type: 'number',
    min: -10,
    max: 40,
    step: 1,
  },
];

export default function ATPParamsPanel({ plan, onSave, onChange, saving }: ATPParamsPanelProps) {
  const [values, setValues] = useState<typeof DEFAULT_PARAMS>(DEFAULT_PARAMS);
  const [dirty, setDirty] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    if (plan) {
      setValues({
        plan_name: plan.plan_name,
        ca_start: plan.ca_start,
        al_start: plan.al_start,
        tau_chronic: plan.tau_chronic,
        tau_acute: plan.tau_acute,
        rb_min: plan.rb_min,
        rb_peak_target: plan.rb_peak_target,
        ca_target_main_event: plan.ca_target_main_event,
        plan_start_date: plan.plan_start_date,
      });
      setDirty(false);
    }
  }, [plan]);

  function handleChange(key: keyof typeof DEFAULT_PARAMS, raw: string) {
    const field = FIELDS.find(f => f.key === key);
    let parsed: number | string = raw;
    if (field && field.type === 'number') {
      parsed = parseFloat(raw) || 0;
    }
    const newValues = { ...values, [key]: parsed };
    setValues(newValues);
    setDirty(true);
    if (onChange) {
      onChange(newValues);
    }
  }

  async function handleSave() {
    await onSave(values);
    setDirty(false);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Banister Parameters</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Chart updates live as you type · Save to persist</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            dirty && !saving
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={14} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Plan Name</label>
        <input
          type="text"
          value={values.plan_name}
          onChange={e => handleChange('plan_name', e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {FIELDS.map(field => (
          <div key={field.key} className="relative">
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
              <button
                onMouseEnter={() => setActiveTooltip(field.key)}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Info size={12} />
              </button>
              {activeTooltip === field.key && (
                <div className="absolute left-0 top-6 z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg whitespace-normal">
                  {field.description}
                </div>
              )}
            </div>
            <input
              type={field.type}
              value={values[field.key] as string | number}
              min={field.min}
              max={field.max}
              step={field.step}
              onChange={e => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      {!plan && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            No active plan found. Configure parameters and save to create your ATP.
          </p>
        </div>
      )}
    </div>
  );
}
