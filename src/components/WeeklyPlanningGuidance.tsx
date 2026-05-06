import { Calendar, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface WeeklyPlanningGuidanceProps {
  weekStartDate: Date;
  athleteId: string;
  athleteName: string;

  // ATP targets for this week
  targetWeeklyImpulse: number;
  targetCA: number;
  targetAF: number;
  targetRB: number;

  // Currently planned workouts
  plannedWorkouts: Array<{
    date: Date;
    name: string;
    estimated_impulse: number;
    status: string;
  }>;

  // Days of week that should have workouts (from ATP plan)
  recommendedSessionDays: number[]; // e.g., [1, 3, 5] for Mon, Wed, Fri
  sessionsPerWeek: number;
}

export default function WeeklyPlanningGuidance({
  weekStartDate,
  athleteId,
  athleteName,
  targetWeeklyImpulse,
  targetCA,
  targetAF,
  targetRB,
  plannedWorkouts,
  recommendedSessionDays,
  sessionsPerWeek
}: WeeklyPlanningGuidanceProps) {

  // Calculate current planned impulse
  const currentPlannedImpulse = plannedWorkouts.reduce((sum, w) => {
    return sum + (w.estimated_impulse || 0);
  }, 0);

  const impulseGap = targetWeeklyImpulse - currentPlannedImpulse;
  const impulsePercent = targetWeeklyImpulse > 0
    ? (currentPlannedImpulse / targetWeeklyImpulse) * 100
    : 0;

  // Count planned sessions
  const plannedSessionCount = plannedWorkouts.length;
  const sessionGap = sessionsPerWeek - plannedSessionCount;

  // Check which recommended days have workouts
  const daysWithWorkouts = new Set(
    plannedWorkouts.map(w => {
      const dayOfWeek = w.date.getDay();
      return dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday from 0 to 7
    })
  );

  const missingDays = recommendedSessionDays.filter(day => !daysWithWorkouts.has(day));

  // Determine planning status
  const getStatusConfig = () => {
    if (impulsePercent >= 95 && impulsePercent <= 105 && sessionGap === 0) {
      return {
        icon: CheckCircle,
        color: 'green',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-300',
        iconColor: 'text-green-600 dark:text-green-400',
        message: 'Week fully planned according to ATP',
        status: 'complete'
      };
    } else if (impulsePercent < 80 || sessionGap > 0) {
      return {
        icon: AlertTriangle,
        color: 'red',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-700 dark:text-red-300',
        iconColor: 'text-red-600 dark:text-red-400',
        message: 'Under-planned: Add more workouts',
        status: 'under'
      };
    } else if (impulsePercent > 115) {
      return {
        icon: AlertTriangle,
        color: 'yellow',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        message: 'Over-planned: Consider reducing load',
        status: 'over'
      };
    } else {
      return {
        icon: Target,
        color: 'blue',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-700 dark:text-blue-300',
        iconColor: 'text-blue-600 dark:text-blue-400',
        message: 'Nearly complete - review and adjust',
        status: 'partial'
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const getDayName = (dayNum: number) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[dayNum - 1] || '';
  };

  // Check if ATP is configured
  const hasATPData = targetWeeklyImpulse > 0 || targetCA > 0 || targetAF > 0;

  return (
    <div className={`rounded-xl border-2 p-6 mb-6 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
      {!hasATPData && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <p className="text-amber-800 dark:text-amber-200 text-sm font-semibold">
            ⚠️ No ATP configured - Create an Annual Training Plan to see targets
          </p>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-white dark:bg-gray-800`}>
          <StatusIcon size={32} className={statusConfig.iconColor} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Weekly Planning Status
            </h3>
            <span className={`text-sm font-semibold ${statusConfig.textColor}`}>
              {hasATPData ? statusConfig.message : 'No ATP targets set'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Impulse Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Weekly Impulse
                </span>
                <TrendingUp size={16} className="text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentPlannedImpulse}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  / {targetWeeklyImpulse}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    impulsePercent >= 95 && impulsePercent <= 105
                      ? 'bg-green-500'
                      : impulsePercent < 80
                        ? 'bg-red-500'
                        : impulsePercent > 115
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(impulsePercent, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={statusConfig.textColor}>
                  {impulsePercent.toFixed(0)}%
                </span>
                {impulseGap !== 0 && (
                  <span className={impulseGap > 0 ? 'text-red-600' : 'text-yellow-600'}>
                    {impulseGap > 0 ? '+' : ''}{impulseGap} needed
                  </span>
                )}
              </div>
            </div>

            {/* Session Count */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sessions Planned
                </span>
                <Calendar size={16} className="text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plannedSessionCount}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  / {sessionsPerWeek}
                </span>
              </div>
              {sessionGap > 0 ? (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {sessionGap} more session{sessionGap > 1 ? 's' : ''} needed
                </p>
              ) : sessionGap < 0 ? (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  {Math.abs(sessionGap)} extra session{Math.abs(sessionGap) > 1 ? 's' : ''}
                </p>
              ) : (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  All sessions planned
                </p>
              )}
            </div>

            {/* Missing Days */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Recommended Days
                </span>
                <Target size={16} className="text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {recommendedSessionDays.map(day => {
                  const hasWorkout = daysWithWorkouts.has(day);
                  return (
                    <span
                      key={day}
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        hasWorkout
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {getDayName(day)}
                    </span>
                  );
                })}
              </div>
              {missingDays.length > 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-2">
                  Missing: {missingDays.map(getDayName).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* ATP Targets Summary */}
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-primary-purple" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                ATP Targets for this Week
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chronic (CA)</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {targetCA.toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Acute (AF)</p>
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {targetAF.toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance (RB)</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {targetRB.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
