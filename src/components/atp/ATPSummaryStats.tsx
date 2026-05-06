import { WeekSimResult } from '../../lib/banisterEngine';
import { TrendingUp, Activity, Zap, Calendar } from 'lucide-react';

interface ATPSummaryStatsProps {
  weeks: WeekSimResult[];
  caStart: number;
  rbMin: number;
  rbPeakTarget: number;
}

export default function ATPSummaryStats({ weeks, caStart, rbMin, rbPeakTarget }: ATPSummaryStatsProps) {
  if (weeks.length === 0) return null;

  const lastWeek = weeks[weeks.length - 1];
  const maxCA = Math.max(...weeks.map(w => w.ca));
  const minRB = Math.min(...weeks.map(w => w.rb));
  const totalImpulse = weeks.reduce((s, w) => s + w.totalImpulse, 0);
  const caGain = lastWeek.ca - caStart;
  const rbViolations = weeks.filter(w => w.rb < rbMin).length;

  const stats = [
    {
      label: 'Peak CA (Fitness)',
      value: maxCA.toFixed(1),
      sub: `+${caGain.toFixed(1)} from start`,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Total Plan Impulse',
      value: Math.round(totalImpulse).toLocaleString(),
      sub: `${weeks.length} weeks`,
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Lowest RB',
      value: minRB.toFixed(1),
      sub: rbViolations > 0 ? `${rbViolations}w below RB min` : 'Within limits',
      icon: Activity,
      color: minRB < rbMin ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
      bg: minRB < rbMin ? 'bg-red-50 dark:bg-red-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Plan Duration',
      value: `${weeks.length}w`,
      sub: `${Math.round(weeks.length / 4)} 4-week blocks`,
      icon: Calendar,
      color: 'text-gray-700 dark:text-gray-300',
      bg: 'bg-gray-50 dark:bg-gray-700/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className={`rounded-xl p-4 ${stat.bg} border border-gray-100 dark:border-gray-700/50`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className={stat.color} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
