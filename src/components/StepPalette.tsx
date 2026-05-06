import { WorkoutStep, StepType, IntensityBasis } from '../types/workout';

export interface PaletteBlock {
  id: string;
  label: string;
  description: string;
  icon: string;
  steps: Partial<WorkoutStep>[];
  accentColor: string;
  bgColor: string;
  borderColor: string;
  isIntervalPair?: boolean;
}

function makeStep(
  step_type: StepType,
  duration_value: number,
  target_type?: string,
  target_percent_ftp?: number,
  target_zone?: number,
  repeat_times?: number,
  repeat_group_id?: string
): Partial<WorkoutStep> {
  return {
    step_type,
    duration_type: 'time',
    duration_value,
    target_type: target_type as any,
    target_percent_ftp,
    target_zone,
    repeat_times,
    repeat_group_id,
  };
}

export const PALETTE_BLOCKS: PaletteBlock[] = [
  {
    id: 'warmup',
    label: 'Warm Up',
    description: '10 min progressive',
    icon: '🌅',
    accentColor: '#F59E0B',
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
    steps: [makeStep('warmup', 600, 'power', 55)],
  },
  {
    id: 'steady',
    label: 'Steady',
    description: '20 min Z2 endurance',
    icon: '〰️',
    accentColor: '#10B981',
    bgColor: '#D1FAE5',
    borderColor: '#A7F3D0',
    steps: [makeStep('steady', 1200, 'power', 70)],
  },
  {
    id: 'interval_pair',
    label: 'Interval Block',
    description: 'Hard (3m) + Easy (2m) — repeat together',
    icon: '⚡',
    accentColor: '#EF4444',
    bgColor: '#FEE2E2',
    borderColor: '#FECACA',
    isIntervalPair: true,
    steps: [
      makeStep('interval', 180, 'power', 105, undefined, undefined, 'pair-0'),
      makeStep('recovery', 120, 'power', 55, undefined, undefined, 'pair-0'),
    ],
  },
  {
    id: 'interval_short',
    label: 'Short Intervals',
    description: 'Hard (1m) + Easy (1m) — repeat together',
    icon: '🔥',
    accentColor: '#DC2626',
    bgColor: '#FEE2E2',
    borderColor: '#FECACA',
    isIntervalPair: true,
    steps: [
      makeStep('interval', 60, 'power', 120, undefined, undefined, 'pair-1'),
      makeStep('recovery', 60, 'power', 50, undefined, undefined, 'pair-1'),
    ],
  },
  {
    id: 'threshold_intervals',
    label: 'Threshold Block',
    description: 'Hard (8m) + Easy (4m) pair',
    icon: '📊',
    accentColor: '#7C3AED',
    bgColor: '#EDE9FE',
    borderColor: '#DDD6FE',
    isIntervalPair: true,
    steps: [
      makeStep('interval', 480, 'power', 95, undefined, undefined, 'pair-2'),
      makeStep('recovery', 240, 'power', 55, undefined, undefined, 'pair-2'),
    ],
  },
  {
    id: 'ramp_up',
    label: 'Ramp Up',
    description: '4 ascending steps',
    icon: '📈',
    accentColor: '#3B82F6',
    bgColor: '#DBEAFE',
    borderColor: '#BFDBFE',
    steps: [
      makeStep('steady', 300, 'power', 65),
      makeStep('steady', 300, 'power', 75),
      makeStep('steady', 300, 'power', 85),
      makeStep('steady', 300, 'power', 95),
    ],
  },
  {
    id: 'ramp_down',
    label: 'Ramp Down',
    description: '4 descending steps',
    icon: '📉',
    accentColor: '#6366F1',
    bgColor: '#EDE9FE',
    borderColor: '#DDD6FE',
    steps: [
      makeStep('steady', 300, 'power', 95),
      makeStep('steady', 300, 'power', 85),
      makeStep('steady', 300, 'power', 75),
      makeStep('steady', 300, 'power', 65),
    ],
  },
  {
    id: 'recovery',
    label: 'Recovery',
    description: '5 min easy spin',
    icon: '💤',
    accentColor: '#06B6D4',
    bgColor: '#CFFAFE',
    borderColor: '#A5F3FC',
    steps: [makeStep('recovery', 300, 'power', 50)],
  },
  {
    id: 'cooldown',
    label: 'Cool Down',
    description: '10 min easy',
    icon: '🌙',
    accentColor: '#64748B',
    bgColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    steps: [makeStep('cooldown', 600, 'power', 50)],
  },
];

function remapStepTargetType(
  steps: Partial<WorkoutStep>[],
  intensityBasis: IntensityBasis
): Partial<WorkoutStep>[] {
  return steps.map(s => {
    const remapped = { ...s };
    if (intensityBasis === 'hr') {
      remapped.target_type = 'hr';
      remapped.target_percent_ftp = undefined;
      if (!remapped.target_zone) remapped.target_zone = 2;
    } else if (intensityBasis === 'pace') {
      remapped.target_type = 'pace';
      remapped.target_percent_ftp = undefined;
      if (!remapped.target_zone) remapped.target_zone = 2;
    } else if (intensityBasis === 'rpe') {
      remapped.target_type = 'rpe';
      remapped.target_percent_ftp = undefined;
    } else {
      remapped.target_type = 'power';
    }
    return remapped;
  });
}

interface StepPaletteProps {
  intensityBasis: IntensityBasis;
  onDragStart: (block: PaletteBlock, remappedSteps: Partial<WorkoutStep>[]) => void;
  onDragEnd: () => void;
  onAdd: (steps: Partial<WorkoutStep>[]) => void;
}

export default function StepPalette({ intensityBasis, onDragStart, onDragEnd, onAdd }: StepPaletteProps) {
  const intervalBlocks = PALETTE_BLOCKS.filter(b => b.isIntervalPair);
  const otherBlocks = PALETTE_BLOCKS.filter(b => !b.isIntervalPair);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 font-body">
        Blocks — drag or click
      </p>

      <div className="grid grid-cols-1 gap-2 mb-3">
        {otherBlocks.map(block => {
          const remapped = remapStepTargetType(block.steps, intensityBasis);
          return (
            <div
              key={block.id}
              draggable
              onDragStart={() => onDragStart(block, remapped)}
              onDragEnd={onDragEnd}
              onClick={() => onAdd(remapped)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-sm hover:-translate-y-0.5 active:scale-95"
              style={{ backgroundColor: block.bgColor, borderColor: block.borderColor }}
            >
              <span className="text-lg flex-shrink-0 leading-none">{block.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold font-body leading-tight" style={{ color: block.accentColor }}>
                  {block.label}
                </p>
                <p className="text-xs text-gray-500 font-body truncate">{block.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 font-body">
          Interval Pairs — hard + easy together
        </p>
        <div className="grid grid-cols-1 gap-2">
          {intervalBlocks.map(block => {
            const remapped = remapStepTargetType(block.steps, intensityBasis);
            const hardStep = block.steps[0];
            const easyStep = block.steps[1];
            const hardSec = hardStep?.duration_value || 0;
            const easySec = easyStep?.duration_value || 0;
            const fmt = (s: number) => s >= 60 ? `${Math.round(s / 60)}m` : `${s}s`;

            return (
              <div
                key={block.id}
                draggable
                onDragStart={() => onDragStart(block, remapped)}
                onDragEnd={onDragEnd}
                onClick={() => onAdd(remapped)}
                className="rounded-lg border cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-sm hover:-translate-y-0.5 active:scale-95 overflow-hidden"
                style={{ borderColor: block.borderColor }}
              >
                <div className="flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: block.bgColor }}>
                  <span className="text-sm leading-none">{block.icon}</span>
                  <p className="text-xs font-bold font-body flex-1 leading-tight" style={{ color: block.accentColor }}>
                    {block.label}
                  </p>
                  <div className="text-[9px] font-bold font-body px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: block.accentColor }}>
                    PAIR
                  </div>
                </div>
                <div className="flex divide-x divide-gray-200 dark:divide-gray-700">
                  <div className="flex-1 px-2.5 py-1.5 bg-red-50 dark:bg-red-900/10">
                    <p className="text-[9px] font-semibold text-red-500 uppercase tracking-wide">Hard</p>
                    <p className="text-xs font-bold text-red-700 dark:text-red-300">
                      {fmt(hardSec)}
                      {hardStep?.target_percent_ftp ? <span className="ml-1 opacity-70">{hardStep.target_percent_ftp}%</span> : null}
                    </p>
                  </div>
                  <div className="flex-1 px-2.5 py-1.5 bg-cyan-50 dark:bg-cyan-900/10">
                    <p className="text-[9px] font-semibold text-cyan-500 uppercase tracking-wide">Easy</p>
                    <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">
                      {fmt(easySec)}
                      {easyStep?.target_percent_ftp ? <span className="ml-1 opacity-70">{easyStep.target_percent_ftp}%</span> : null}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
