import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TrainingSession, supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Clock, TrendingUp, Zap, Activity, Gauge, Plus, BookOpen, Dumbbell, CreditCard as Edit2, Trash2, Copy, CopyCheck, X, BarChart2, Tag as TagIcon } from 'lucide-react';
import TrainingTypeModal from './TrainingTypeModal';
import ScheduleWorkoutModal from './ScheduleWorkoutModal';
import WeeklyAtpDrawer from './WeeklyAtpDrawer';
import { Workout, WorkoutStep, Tag } from '../types/workout';
import { getSportIcon, formatPace, formatPacePer100m } from '../lib/calculations';
import { useSessionDifficulty } from '../hooks/useSessionDifficulty';
import { getDifficultyClasses, getDifficultyLabel, SSRResult } from '../lib/sessionDifficulty';
import { WeeklySummaryData } from '../lib/weeklySummary';
import { WorkoutDetailModal } from './detail/WorkoutDetailModal';
import { WorkoutData } from '../types/workoutDetail';
import { hubGetExternalActivities, hubActivityToWorkoutData, HubExternalActivity } from '../lib/hubApi';

interface SessionsCalendarViewProps {
  sessions: TrainingSession[];
  ftp: number | null;
  athleteId?: string | null;
  onCreateSession?: (date: Date, discipline: string, type: string, opts?: { elevationM?: number; scheduledTime?: string }) => void;
  onEditWorkout?: (workout: Workout) => void;
  onWorkoutsChanged?: () => void;
  isCoach?: boolean;
  currentUserId?: string;
  weeklyAtpSummaries?: WeeklySummaryData[];
  hasAtpPlan?: boolean;
  onNavigateToATP?: () => void;
}

type ViewType = 'day' | 'week' | 'month';

const SPORT_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  cycling: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-200 dark:border-amber-700', dot: 'bg-amber-400' },
  running: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-200 dark:border-emerald-700', dot: 'bg-emerald-400' },
  swimming: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-200 dark:border-blue-700', dot: 'bg-blue-400' },
  default: { bg: 'bg-gray-50 dark:bg-gray-700/30', text: 'text-gray-800 dark:text-gray-200', border: 'border-gray-200 dark:border-gray-600', dot: 'bg-gray-400' },
};

function getSportColor(sport?: string) {
  return SPORT_COLORS[sport || ''] || SPORT_COLORS.default;
}

interface WorkoutContextMenuProps {
  workout: Workout;
  position: { x: number; y: number };
  onEdit: () => void;
  onDuplicate: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function WorkoutContextMenu({ workout, position, onEdit, onDuplicate, onCopy, onDelete, onClose }: WorkoutContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const panelWidth = 220;
  const panelHeight = 200;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const left = position.x + panelWidth > vw ? position.x - panelWidth : position.x;
  const top = position.y + panelHeight > vh ? position.y - panelHeight : position.y;

  const sport = workout.sport || 'default';
  const colors = getSportColor(sport);

  return createPortal(
    <>
      <div className="fixed inset-0 z-[998]" onClick={onClose} />
      <div
        ref={menuRef}
        className="fixed z-[999] w-[220px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ left, top }}
        onClick={e => e.stopPropagation()}
      >
        <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 ${colors.bg}`}>
          <div className="flex items-center gap-2 mb-0.5">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
            <p className={`text-sm font-bold truncate ${colors.text}`}>{workout.name}</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize pl-4">
            {workout.sport}
            {workout.estimated_duration_minutes ? ` · ${workout.estimated_duration_minutes} min` : ''}
          </p>
        </div>
        <div className="py-1.5">
          <button
            onClick={onEdit}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
          >
            <Edit2 size={14} className="text-gray-400 flex-shrink-0" />
            Edit workout
          </button>
          <button
            onClick={onDuplicate}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
          >
            <CopyCheck size={14} className="text-gray-400 flex-shrink-0" />
            Duplicate
          </button>
          <button
            onClick={onCopy}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
          >
            <Copy size={14} className="text-gray-400 flex-shrink-0" />
            Copy to clipboard
          </button>
          <div className="my-1 mx-3 border-t border-gray-100 dark:border-gray-800" />
          <button
            onClick={onDelete}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left"
          >
            <Trash2 size={14} className="flex-shrink-0" />
            Delete
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

interface WorkoutPillProps {
  workout: Workout;
  difficulty?: SSRResult | null;
  onEdit: (w: Workout) => void;
  onDuplicate: (w: Workout) => void;
  onCopy: (w: Workout) => void;
  onDelete: (w: Workout) => void;
  onDragStart: (w: Workout) => void;
  onViewDetail?: (w: Workout) => void;
  compact?: boolean;
}

function WorkoutPill({ workout, difficulty, onEdit, onDuplicate, onCopy, onDelete, onDragStart, onViewDetail, compact = false }: WorkoutPillProps) {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const colors = difficulty
    ? getDifficultyClasses(difficulty.difficulty)
    : getSportColor(workout.sport);

  const compliance = workout.compliance_status;

  const complianceRing: Record<string, string> = {
    completed: 'ring-2 ring-emerald-500',
    modified: 'ring-2 ring-amber-500',
    missed: 'ring-2 ring-red-500',
  };

  const complianceDot: Record<string, string> = {
    completed: 'bg-emerald-500',
    modified: 'bg-amber-500',
    missed: 'bg-red-500',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetail) {
      onViewDetail(workout);
      return;
    }
    if (menuPos) {
      setMenuPos(null);
      return;
    }
    const rect = pillRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({ x: rect.left, y: rect.bottom + 4 });
    }
  };

  return (
    <div
      ref={pillRef}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(workout);
      }}
      className={`relative group cursor-pointer select-none ${
        compact ? 'text-[10px] px-1.5 py-1' : 'text-xs p-1.5'
      } rounded-lg border ${colors.bg} ${colors.text} ${colors.border} ${compliance ? complianceRing[compliance] : ''} transition hover:shadow-sm hover:brightness-95`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1 min-w-0">
        {compliance ? (
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${complianceDot[compliance]}`} title={compliance === 'completed' ? 'Completado correctamente' : compliance === 'modified' ? 'Modificado' : 'No realizado'} />
        ) : (
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
        )}
        <span className="truncate font-semibold leading-tight">{workout.name}</span>
        {!compact && workout.estimated_duration_minutes && (
          <span className="opacity-60 flex-shrink-0">{workout.estimated_duration_minutes}m</span>
        )}
      </div>

      {menuPos && (
        <WorkoutContextMenu
          workout={workout}
          position={menuPos}
          onEdit={() => { setMenuPos(null); onEdit(workout); }}
          onDuplicate={() => { setMenuPos(null); onDuplicate(workout); }}
          onCopy={() => { setMenuPos(null); onCopy(workout); }}
          onDelete={() => { setMenuPos(null); onDelete(workout); }}
          onClose={() => setMenuPos(null)}
        />
      )}
    </div>
  );
}

export default function SessionsCalendarView({
  sessions, ftp, athleteId, onCreateSession, onEditWorkout, onWorkoutsChanged, isCoach = false, currentUserId = '',
  weeklyAtpSummaries = [],
  hasAtpPlan = true,
  onNavigateToATP,
}: SessionsCalendarViewProps) {
  const [viewType, setViewType] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const { computeDifficulty } = useSessionDifficulty(athleteId, ftp);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDateForTraining, setSelectedDateForTraining] = useState<Date | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutTagsMap, setWorkoutTagsMap] = useState<Record<string, Tag[]>>({});
  const [copiedWorkout, setCopiedWorkout] = useState<Workout | null>(null);
  const [draggedWorkout, setDraggedWorkout] = useState<Workout | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Workout | null>(null);
  const [drawerWeek, setDrawerWeek] = useState<WeeklySummaryData | null>(null);
  const [detailWorkout, setDetailWorkout] = useState<WorkoutData | null>(null);
  const [detailWorkoutSource, setDetailWorkoutSource] = useState<Workout | null>(null);
  const [detailSteps, setDetailSteps] = useState<WorkoutStep[]>([]);
  const [detailActivityOnly, setDetailActivityOnly] = useState(false);
  const [detailActivitySource, setDetailActivitySource] = useState<string | undefined>(undefined);
  const [hubActivities, setHubActivities] = useState<HubExternalActivity[]>([]);

  const handleViewHubActivity = useCallback((act: HubExternalActivity) => {
    setDetailActivityOnly(true);
    setDetailActivitySource(act.source === 'asciende_gps' ? 'GPS Asciende' : act.source === 'strava' ? 'Strava' : act.source || 'Hub');
    setDetailWorkoutSource(null);
    setDetailSteps([]);
    setDetailWorkout(hubActivityToWorkoutData(act));
  }, []);

  const renderHubActivityPill = (act: HubExternalActivity, compact = false) => {
    const sport = act.sport_type || 'other';
    const colors = getSportColor(sport);
    const name = act.name || sport;
    const dur = act.duration_seconds ? `${Math.round(act.duration_seconds / 60)}m` : '';
    return (
      <div
        key={`hub-${act.id}`}
        onClick={(e) => { e.stopPropagation(); handleViewHubActivity(act); }}
        className={`cursor-pointer select-none ${compact ? 'text-[10px] px-1.5 py-1' : 'text-xs p-1.5'} rounded-lg border ${colors.bg} ${colors.text} ${colors.border} transition hover:shadow-sm hover:brightness-95 flex items-center gap-1`}
      >
        <Activity size={10} className="flex-shrink-0 opacity-60" />
        <span className="truncate font-semibold leading-tight">{name}</span>
        {!compact && dur && <span className="opacity-60 flex-shrink-0">{dur}</span>}
      </div>
    );
  };

  const handleViewDetail = useCallback(async (w: Workout) => {
    setDetailWorkoutSource(w);
    setDetailActivityOnly(false);
    setDetailActivitySource(undefined);
    setDetailSteps([]);
    try {
      const { data: stepRows } = await supabase
        .from('workout_steps')
        .select('*')
        .eq('workout_id', w.id)
        .order('order');
      if (stepRows) setDetailSteps(stepRows);
    } catch (err) {
      console.error('Error loading steps for detail:', err);
    }
    const hubData = (w.hub_data ?? null) as Record<string, unknown> | null;
    const data: WorkoutData = {
      id: w.id,
      name: w.name,
      date: w.scheduled_date,
      sport: w.sport,
      distance: (hubData?.actual_distance_km as number) ?? null,
      duration: w.actual_duration_minutes ? w.actual_duration_minutes * 60 : null,
      duration_seconds: w.actual_duration_minutes ? w.actual_duration_minutes * 60 : null,
      distance_km: (hubData?.actual_distance_km as number) ?? null,
      actual_duration_minutes: w.actual_duration_minutes ?? null,
      actual_distance_km: (hubData?.actual_distance_km as number) ?? null,
      actual_avg_hr: (hubData?.actual_avg_hr as number) ?? null,
      actual_max_hr: (hubData?.actual_max_hr as number) ?? null,
      actual_avg_power_watts: (hubData?.actual_avg_power_watts as number) ?? null,
      actual_max_power_watts: (hubData?.actual_max_power_watts as number) ?? null,
      actual_avg_cadence: (hubData?.actual_avg_cadence as number) ?? null,
      actual_avg_speed_kmh: (hubData?.actual_avg_speed_kmh as number) ?? null,
      actual_elevation_gain_m: (hubData?.actual_elevation_gain_m as number) ?? null,
      actual_elevation_loss_m: (hubData?.actual_elevation_loss_m as number) ?? null,
      actual_calories: (hubData?.actual_calories as number) ?? null,
      actual_tss: (hubData?.actual_tss as number) ?? null,
      actual_impulse: w.actual_impulse ?? null,
      rpe: w.rpe ?? null,
      compliance_percent: (hubData?.compliance_percent as number) ?? null,
      athlete_notes: (hubData?.athlete_notes as string) ?? w.notes ?? null,
      athlete_feedback: (hubData?.athlete_feedback as string) ?? null,
      athlete_feeling: (hubData?.athlete_feeling as string) ?? null,
      coach_notes: (hubData?.coach_notes as string) ?? null,
      normalized_power_watts: (hubData?.normalized_power_watts as number) ?? null,
      map: (hubData?.gps_track as any) ?? null,
      gps_track: (hubData?.gps_track as any) ?? null,
      splits: (hubData?.splits as any) ?? null,
      pace: (hubData?.pace as number[]) ?? null,
      pace_sec_per_km: (hubData?.pace_sec_per_km as number[]) ?? null,
      heartRate: (hubData?.heart_rate as number[]) ?? null,
      heart_rate: (hubData?.heart_rate as number[]) ?? null,
      cadence: (hubData?.cadence as number[]) ?? null,
      cadence_rpm: (hubData?.cadence_rpm as number[]) ?? null,
      watts: (hubData?.watts as number[]) ?? null,
      power_watts: (hubData?.power_watts as number[]) ?? null,
      elevation: (hubData?.elevation as number[]) ?? null,
      zone_distribution: (hubData?.zone_distribution as any) ?? null,
      activity_log: (hubData?.activity_log as any) ?? null,
      summary: hubData?.summary as Record<string, number | string | null> | undefined,
    };
    setDetailWorkout(data);
  }, []);

  const handleEditFromDetail = useCallback(() => {
    if (detailWorkoutSource) {
      setDetailWorkout(null);
      onEditWorkout?.(detailWorkoutSource);
    }
  }, [detailWorkoutSource, onEditWorkout]);

  const handleDuplicateFromDetail = useCallback(() => {
    if (detailWorkoutSource) {
      setDetailWorkout(null);
      handleDuplicateWorkout(detailWorkoutSource);
    }
  }, [detailWorkoutSource]);

  const handleCopyFromDetail = useCallback(() => {
    if (detailWorkoutSource) {
      handleCopyWorkout(detailWorkoutSource);
    }
  }, [detailWorkoutSource]);

  const handleDeleteFromDetail = useCallback(() => {
    if (detailWorkoutSource) {
      const w = detailWorkoutSource;
      setDetailWorkout(null);
      setDetailWorkoutSource(null);
      handleDeleteWorkout(w);
    }
  }, [detailWorkoutSource]);

  useEffect(() => {
    if (athleteId || currentUserId) {
      loadWorkouts();
      loadHubActivities();
    }
  }, [athleteId, currentUserId]);

  const loadHubActivities = async () => {
    const hubId = athleteId || currentUserId;
    if (!hubId) return;
    try {
      const now = new Date();
      const dateTo = toLocalDateStr(now);
      const dateFrom = toLocalDateStr(new Date(now.getFullYear(), now.getMonth() - 3, 1));
      const acts = await hubGetExternalActivities(hubId, dateFrom, dateTo);
      setHubActivities(acts);
    } catch (err) {
      console.error('Error loading Hub activities:', err);
      setHubActivities([]);
    }
  };

  const loadWorkouts = async () => {
    const filterAthleteId = athleteId;
    const filterUserId = currentUserId;

    if (!filterAthleteId && !filterUserId) return;

    try {
      let query = supabase
        .from('workouts')
        .select('*')
        .not('scheduled_date', 'is', null)
        .eq('is_library', false)
        .order('scheduled_date');

      if (filterAthleteId && filterUserId && filterAthleteId !== filterUserId) {
        query = query.eq('athlete_id', filterAthleteId);
      } else if (filterAthleteId || filterUserId) {
        const id = filterAthleteId || filterUserId;
        query = query.or(`coach_id.eq.${id},athlete_id.eq.${id}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      const ws = data || [];
      setWorkouts(ws);

      if (ws.length > 0) {
        const ids = ws.map((w: Workout) => w.id);
        const map: Record<string, Tag[]> = {};
        for (let start = 0; start < ids.length; start += 20) {
          const { data: wtRows } = await supabase
            .from('workout_tags')
            .select('workout_id, tags(*)')
            .in('workout_id', ids.slice(start, start + 20));
          if (wtRows) {
            for (const row of wtRows as any[]) {
              if (!map[row.workout_id]) map[row.workout_id] = [];
              if (row.tags) map[row.workout_id].push(row.tags as Tag);
            }
          }
        }
        setWorkoutTagsMap(map);
      }
    } catch (err) {
      console.error('Error loading workouts:', err);
    }
  };

  const getTagsForDateRange = (startStr: string, endStr: string): Tag[] => {
    const tagMap = new Map<string, Tag>();
    for (const w of workouts) {
      if (w.scheduled_date && w.scheduled_date >= startStr && w.scheduled_date <= endStr) {
        for (const t of (workoutTagsMap[w.id] || [])) {
          tagMap.set(t.slug, t);
        }
      }
    }
    return Array.from(tagMap.values());
  };

  const getSessionsByDate = (date: Date): TrainingSession[] => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.session_date);
      return (
        sessionDate.getFullYear() === date.getFullYear() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getDate() === date.getDate()
      );
    });
  };

  const getWorkoutsByDate = (date: Date): Workout[] => {
    const dateStr = toLocalDateStr(date);
    return workouts.filter(w => w.scheduled_date === dateStr);
  };

  const getUnplannedHubActivitiesByDate = (date: Date): HubExternalActivity[] => {
    const dateStr = toLocalDateStr(date);
    const plannedDates = new Set(workouts.map(w => w.scheduled_date));
    return hubActivities.filter(act => {
      if (act.local_date !== dateStr) return false;
      if (plannedDates.has(act.local_date)) return false;
      return true;
    });
  };

  const toLocalDateStr = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return d;
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatDayShort = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short' });

  const getSessionColor = (session: { status: string; session_date: string; sport: string; duration_minutes: number; avg_power_watts?: number | null; avg_pace_per_km?: number | null; perceived_effort?: number | null }): string => {
    if (session.status === 'completed') {
      const diff = computeDifficulty({
        session_date: session.session_date,
        sport: session.sport as any,
        duration_minutes: session.duration_minutes,
        avg_power_watts: session.avg_power_watts,
        avg_pace_per_km: session.avg_pace_per_km,
        perceived_effort: session.perceived_effort,
        status: 'completed',
        ftp,
      });
      if (diff) {
        const cls = getDifficultyClasses(diff.difficulty);
        return `${cls.bg} ${cls.text}`;
      }
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
    }
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
  };

  const stats = useMemo(() => {
    const startDate = viewType === 'month'
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      : viewType === 'week'
      ? new Date(currentDate.getTime() - currentDate.getDay() * 86400000)
      : currentDate;

    const endDate = viewType === 'month'
      ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      : viewType === 'week'
      ? new Date(startDate.getTime() + 7 * 86400000)
      : new Date(startDate.getTime() + 86400000);

    const periodSessions = sessions.filter(s => {
      const d = new Date(s.session_date);
      return d >= startDate && d <= endDate;
    });

    return {
      total: periodSessions.length,
      completed: periodSessions.filter(s => s.status === 'completed').length,
      pending: periodSessions.filter(s => s.status === 'pending').length,
      totalHours: periodSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60,
    };
  }, [sessions, viewType, currentDate]);

  const handlePrevious = () => {
    if (viewType === 'month') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    else if (viewType === 'week') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
    else setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
  };

  const handleNext = () => {
    if (viewType === 'month') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    else if (viewType === 'week') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
    else setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
  };

  const handleEditWorkout = (workout: Workout) => {
    onEditWorkout?.(workout);
  };

  const handleDuplicateWorkout = async (workout: Workout) => {
    try {
      const { data: steps } = await supabase
        .from('workout_steps')
        .select('*')
        .eq('workout_id', workout.id)
        .order('order');

      const { data: newWorkout, error } = await supabase
        .from('workouts')
        .insert({
          coach_id: workout.coach_id,
          athlete_id: workout.athlete_id,
          sport: workout.sport,
          name: `${workout.name} (copy)`,
          description: workout.description,
          intensity_basis: workout.intensity_basis,
          scheduled_date: workout.scheduled_date,
          estimated_duration_minutes: workout.estimated_duration_minutes,
          estimated_impulse: workout.estimated_impulse,
          sub_discipline: workout.sub_discipline,
        })
        .select()
        .single();

      if (error || !newWorkout) throw error;

      if (steps && steps.length > 0) {
        const newSteps = steps.map(({ id, workout_id, created_at, ...rest }: WorkoutStep) => ({
          ...rest,
          workout_id: newWorkout.id,
        }));
        await supabase.from('workout_steps').insert(newSteps);
      }

      loadWorkouts();
    } catch (err) {
      console.error('Error duplicating workout:', err);
    }
  };

  const handleCopyWorkout = (workout: Workout) => {
    setCopiedWorkout(workout);
  };

  const handlePasteWorkout = async (date: Date) => {
    if (!copiedWorkout) return;
    try {
      const { data: steps } = await supabase
        .from('workout_steps')
        .select('*')
        .eq('workout_id', copiedWorkout.id)
        .order('order');

      const dateStr = toLocalDateStr(date);
      const { data: newWorkout, error } = await supabase
        .from('workouts')
        .insert({
          coach_id: copiedWorkout.coach_id,
          athlete_id: copiedWorkout.athlete_id,
          sport: copiedWorkout.sport,
          name: copiedWorkout.name,
          description: copiedWorkout.description,
          intensity_basis: copiedWorkout.intensity_basis,
          scheduled_date: dateStr,
          estimated_duration_minutes: copiedWorkout.estimated_duration_minutes,
          estimated_impulse: copiedWorkout.estimated_impulse,
          sub_discipline: copiedWorkout.sub_discipline,
        })
        .select()
        .single();

      if (error || !newWorkout) throw error;

      if (steps && steps.length > 0) {
        const newSteps = steps.map(({ id, workout_id, created_at, ...rest }: WorkoutStep) => ({
          ...rest,
          workout_id: newWorkout.id,
        }));
        await supabase.from('workout_steps').insert(newSteps);
      }

      loadWorkouts();
    } catch (err) {
      console.error('Error pasting workout:', err);
    }
  };

  const handleDeleteWorkout = async (workout: Workout) => {
    try {
      await supabase.from('workout_steps').delete().eq('workout_id', workout.id);
      await supabase.from('workouts').delete().eq('id', workout.id);
      setDeleteConfirm(null);
      loadWorkouts();
      onWorkoutsChanged?.();
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  };

  const handleDragStart = (workout: Workout) => {
    setDraggedWorkout(workout);
  };

  const handleDrop = async (date: Date) => {
    if (!draggedWorkout) return;
    const dateStr = toLocalDateStr(date);
    try {
      await supabase
        .from('workouts')
        .update({ scheduled_date: dateStr })
        .eq('id', draggedWorkout.id);
      loadWorkouts();
      onWorkoutsChanged?.();
    } catch (err) {
      console.error('Error moving workout:', err);
    }
    setDraggedWorkout(null);
    setDragOverDate(null);
  };

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    return { firstDow, lastDay, year, month };
  }, [currentDate]);

  const getAtpWeekForDate = (date: Date): WeeklySummaryData | null => {
    const dateStr = toLocalDateStr(date);
    return weeklyAtpSummaries.find(w => w.weekStartDate <= dateStr && w.weekEndDate >= dateStr) || null;
  };

  const getAtpWeekColor = (week: WeeklySummaryData): { bg: string; text: string; dot: string } => {
    if (week.plannedTotalImpulse <= 0) return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' };
    const pct = (week.projectedTotalImpulse / week.plannedTotalImpulse) * 100;
    if (pct >= 90 && pct <= 115) return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-400' };
    if (pct < 70) return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-400' };
    if (pct > 120) return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-400' };
    return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-400' };
  };

  const monthWeekRows = useMemo(() => {
    const { firstDow, lastDay, year, month } = monthDays;
    const cells: Array<Date | null> = [
      ...Array.from({ length: firstDow }, () => null),
      ...Array.from({ length: lastDay }, (_, i) => new Date(year, month, i + 1)),
    ];
    const rows: Array<Array<Date | null>> = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [monthDays]);

  const weekDays = useMemo(() => {
    const start = getWeekStart(new Date(currentDate));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const visibleTags = useMemo((): Tag[] => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (viewType === 'month') {
      const { year, month, lastDay } = monthDays;
      const start = fmt(new Date(year, month, 1));
      const end = fmt(new Date(year, month, lastDay));
      return getTagsForDateRange(start, end);
    }
    if (viewType === 'week') {
      return getTagsForDateRange(fmt(weekDays[0]), fmt(weekDays[6]));
    }
    const d = fmt(new Date(currentDate));
    return getTagsForDateRange(d, d);
  }, [viewType, currentDate, monthDays, weekDays, workouts, workoutTagsMap]);

  const renderWorkoutPill = (workout: Workout, compact = false) => {
    const difficulty = workout.scheduled_date
      ? computeDifficulty({
          session_date: workout.scheduled_date,
          sport: workout.sport,
          duration_minutes: workout.estimated_duration_minutes ?? 60,
          avg_power_watts: null,
          avg_pace_per_km: null,
          perceived_effort: null,
          status: 'planned',
          ftp,
        })
      : null;

    if (difficulty && difficulty.difficulty !== workout.difficulty_color) {
      supabase
        .from('workouts')
        .update({ difficulty_color: difficulty.difficulty })
        .eq('id', workout.id)
        .then(() => {});
    }

    return (
      <WorkoutPill
        key={workout.id}
        workout={workout}
        difficulty={difficulty}
        compact={compact}
        onEdit={handleEditWorkout}
        onDuplicate={handleDuplicateWorkout}
        onCopy={handleCopyWorkout}
        onDelete={w => setDeleteConfirm(w)}
        onDragStart={handleDragStart}
        onViewDetail={handleViewDetail}
      />
    );
  };

  return (
    <div className="space-y-6">
      {copiedWorkout && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-sm">
          <Copy size={15} className="text-blue-500 flex-shrink-0" />
          <span className="text-blue-800 dark:text-blue-200 flex-1">
            <span className="font-semibold">{copiedWorkout.name}</span> copied — click any empty day to paste
          </span>
          <button onClick={() => setCopiedWorkout(null)} className="text-blue-400 hover:text-blue-600 transition">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: Activity },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: TrendingUp },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Clock },
          { label: 'Total Hours', value: `${stats.totalHours.toFixed(1)}h`, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', icon: Zap },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-transparent`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-body">{label}</p>
                <p className={`text-3xl font-bold mt-0.5 ${color}`}>{value}</p>
              </div>
              <Icon className={`w-7 h-7 opacity-50 ${color}`} />
            </div>
          </div>
        ))}
      </div>

      {visibleTags.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 flex-shrink-0">
            <TagIcon size={13} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map(tag => (
              <span
                key={tag.slug}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold leading-tight transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: `${tag.color}1a`,
                  color: tag.color,
                  border: `1px solid ${tag.color}44`,
                }}
                title={tag.description || tag.name}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex gap-1.5">
            {(['day', 'week', 'month'] as const).map(view => (
              <button
                key={view}
                onClick={() => setViewType(view)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold capitalize transition ${
                  viewType === view
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevious} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-gray-800 dark:text-white min-w-[180px] text-center">
              {viewType === 'month'
                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : viewType === 'week'
                ? `Week of ${formatDate(getWeekStart(new Date(currentDate)))}`
                : formatDate(currentDate)}
            </span>
            <button onClick={handleNext} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="p-4">
          {viewType === 'month' && (
            <>
              <div className="grid mb-2 grid-cols-[repeat(7,1fr)_72px]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-1.5">
                    {d}
                  </div>
                ))}
                <div className="text-center text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-1.5">
                  ATP
                </div>
              </div>

              <div className="space-y-1">
                {monthWeekRows.map((row, rowIndex) => {
                  const firstRealDate = row.find(d => d !== null);
                  const atpWeek = firstRealDate ? getAtpWeekForDate(firstRealDate) : null;
                  const atpColors = atpWeek ? getAtpWeekColor(atpWeek) : null;

                  return (
                    <div key={rowIndex} className="grid gap-1 grid-cols-[repeat(7,1fr)_72px]">
                      {row.map((dateForDay, colIndex) => {
                        if (!dateForDay) return <div key={`empty-${rowIndex}-${colIndex}`} className="h-[96px]" />;

                        const dateStr = toLocalDateStr(dateForDay);
                        const daySess = getSessionsByDate(dateForDay);
                        const dayWkts = getWorkoutsByDate(dateForDay);
                        const dayHubActs = getUnplannedHubActivitiesByDate(dateForDay);
                        const isToday = isSameDay(dateForDay, new Date());
                        const isDragTarget = dragOverDate === dateStr;
                        const hasContent = dayWkts.length > 0 || daySess.length > 0 || dayHubActs.length > 0;

                        return (
                          <div
                            key={dateStr}
                            className={`min-h-[96px] max-h-[120px] overflow-hidden border rounded-lg p-2 transition-all relative flex flex-col group ${
                              isToday
                                ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-900/10'
                                : isDragTarget
                                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                                : 'border-gray-100 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50/60 dark:hover:bg-gray-700/20'
                            }`}
                            onClick={() => {
                              if (copiedWorkout) { handlePasteWorkout(dateForDay); return; }
                              if (!hasContent) {
                                setSelectedDateForTraining(dateForDay);
                                setShowTrainingModal(true);
                              }
                            }}
                            onDragOver={e => { e.preventDefault(); setDragOverDate(dateStr); }}
                            onDragLeave={() => setDragOverDate(null)}
                            onDrop={e => { e.preventDefault(); handleDrop(dateForDay); }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className={`text-xs font-bold ${isToday ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {dateForDay.getDate()}
                              </p>
                              {hasContent && (
                                <button
                                  onClick={e => { e.stopPropagation(); setSelectedDateForTraining(dateForDay); setShowTrainingModal(true); }}
                                  className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                                >
                                  <Plus size={8} className="text-gray-500 dark:text-gray-400" />
                                </button>
                              )}
                            </div>

                            <div className="flex-1 space-y-1 min-w-0">
                              {daySess.slice(0, 1).map(session => (
                                <div key={session.id} className={`text-[10px] px-1.5 py-1 rounded truncate font-semibold ${getSessionColor(session)}`}>
                                  {getSportIcon(session.sport)} {session.session_name || 'Session'}
                                </div>
                              ))}
                              {dayWkts.slice(0, 2).map(workout => renderWorkoutPill(workout, true))}
                              {dayHubActs.slice(0, 1).map(log => renderHubActivityPill(log, true))}
                              {(daySess.length + dayWkts.length + dayHubActs.length) > 3 && (
                                <p className="text-[9px] text-gray-400 dark:text-gray-500 px-0.5">
                                  +{daySess.length + dayWkts.length + dayHubActs.length - 3} more
                                </p>
                              )}
                            </div>

                            {isDragTarget && (
                              <div className="absolute inset-0 rounded-lg border-2 border-dashed border-blue-400 pointer-events-none flex items-center justify-center">
                                <span className="text-[10px] font-bold text-blue-500">Drop here</span>
                              </div>
                            )}

                            {copiedWorkout && !hasContent && (
                              <div className="absolute inset-0 rounded-lg border border-dashed border-blue-300 dark:border-blue-600 pointer-events-none opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-[10px] font-semibold text-blue-500">Paste</span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      <div className="min-h-[96px] max-h-[120px] flex flex-col items-center justify-center">
                        {atpWeek && atpColors ? (
                          <button
                            onClick={() => setDrawerWeek(atpWeek)}
                            className={`w-full h-[96px] rounded-lg border flex flex-col items-center justify-center gap-1 px-1 transition-all hover:scale-105 ${atpColors.bg} border-transparent hover:border-current`}
                          >
                            <div className={`w-2 h-2 rounded-full ${atpColors.dot}`} />
                            <p className={`text-[9px] font-bold text-center leading-tight ${atpColors.text}`}>
                              CA {(atpWeek.actualEndCA || atpWeek.projectedEndCA).toFixed(0)}
                            </p>
                            <p className={`text-[9px] font-semibold text-center ${atpColors.text} opacity-80`}>
                              AF {(atpWeek.actualEndAF || atpWeek.projectedEndAF).toFixed(0)}
                            </p>
                            <p className={`text-[9px] font-semibold text-center ${atpColors.text} opacity-70`}>
                              RB {(atpWeek.actualEndRB || atpWeek.projectedEndRB).toFixed(0)}
                            </p>
                            <BarChart2 size={10} className={`${atpColors.text} opacity-60 mt-0.5`} />
                          </button>
                        ) : hasAtpPlan ? (
                          <div className="w-full h-[96px] rounded-lg border border-dashed border-gray-200 dark:border-gray-700/50 flex items-center justify-center">
                            <span className="text-[9px] text-gray-300 dark:text-gray-600">—</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onNavigateToATP?.()}
                            title="No hay plan ATP — click para crear uno"
                            className="w-full h-[96px] rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 flex flex-col items-center justify-center gap-1 transition-all"
                          >
                            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500">N/D</p>
                            <p className="text-[8px] text-gray-400 dark:text-gray-500 text-center leading-tight">Crear ATP</p>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {viewType === 'week' && (() => {
            const weekAtpData = weekDays[0] ? getAtpWeekForDate(weekDays[0]) : null;
            const weekAtpColors = weekAtpData ? getAtpWeekColor(weekAtpData) : null;
            return (
            <>
              {weekAtpData && weekAtpColors ? (
                <div className={`mb-3 flex items-center justify-between px-4 py-2.5 rounded-xl ${weekAtpColors.bg}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${weekAtpColors.dot}`} />
                    <p className={`text-xs font-bold ${weekAtpColors.text}`}>
                      Semana {weekAtpData.weekNumber + 1} ATP
                      {weekAtpData.isCurrentWeek && <span className="ml-2 opacity-70">• Esta semana</span>}
                    </p>
                  </div>
                  <div className={`flex items-center gap-4 text-xs ${weekAtpColors.text}`}>
                    <span>CA <strong>{(weekAtpData.actualEndCA || weekAtpData.projectedEndCA).toFixed(0)}</strong></span>
                    <span>AF <strong>{(weekAtpData.actualEndAF || weekAtpData.projectedEndAF).toFixed(0)}</strong></span>
                    <span>RB <strong>{(weekAtpData.actualEndRB || weekAtpData.projectedEndRB).toFixed(0)}</strong></span>
                    {weekAtpData.plannedTotalImpulse > 0 && (
                      <span>Carga <strong>{Math.round((weekAtpData.projectedTotalImpulse / weekAtpData.plannedTotalImpulse) * 100)}%</strong></span>
                    )}
                    <button
                      onClick={() => setDrawerWeek(weekAtpData)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${weekAtpColors.text} border-current opacity-60 hover:opacity-100 transition`}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ) : !hasAtpPlan ? (
                <button
                  onClick={() => onNavigateToATP?.()}
                  className="mb-3 w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <BarChart2 size={14} className="text-gray-400 dark:text-gray-500" />
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      N/D — Sin plan ATP
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    Crear ATP →
                  </span>
                </button>
              ) : null}
              <div className="grid grid-cols-7 gap-2">
              {weekDays.map(date => {
                const dateStr = toLocalDateStr(date);
                const daySess = getSessionsByDate(date);
                const dayWkts = getWorkoutsByDate(date);
                const dayHubActs = getUnplannedHubActivitiesByDate(date);
                const isToday = isSameDay(date, new Date());
                const isDragTarget = dragOverDate === dateStr;

                return (
                  <div
                    key={dateStr}
                    className={`border rounded-xl p-2.5 min-h-[140px] flex flex-col transition-all ${
                      isToday
                        ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-900/10'
                        : isDragTarget
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onDragOver={e => { e.preventDefault(); setDragOverDate(dateStr); }}
                    onDragLeave={() => setDragOverDate(null)}
                    onDrop={e => { e.preventDefault(); handleDrop(date); }}
                    onClick={() => {
                      if (copiedWorkout) { handlePasteWorkout(date); return; }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-xs font-bold ${isToday ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {formatDayShort(date)} {date.getDate()}
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedDateForTraining(date); setShowTrainingModal(true); }}
                        className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 flex items-center justify-center transition opacity-0 hover:opacity-100 group-hover:opacity-100"
                      >
                        <Plus size={10} className="text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      {daySess.map(session => (
                        <div key={session.id} className={`p-1.5 rounded-lg text-xs ${getSessionColor(session)}`}>
                          <p className="font-semibold truncate">{session.session_name}</p>
                          <p className="opacity-70 text-[10px]">{session.duration_minutes} min</p>
                        </div>
                      ))}
                      {dayWkts.map(workout => renderWorkoutPill(workout))}
                      {dayHubActs.map(log => renderHubActivityPill(log))}
                      {daySess.length === 0 && dayWkts.length === 0 && dayHubActs.length === 0 && (
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedDateForTraining(date); setShowTrainingModal(true); }}
                          className="w-full py-2 text-[10px] text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500 transition border border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          + add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            </>
            );
          })()}

          {viewType === 'day' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300">{formatDate(currentDate)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedDateForTraining(new Date(currentDate)); setShowTrainingModal(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold transition"
                  >
                    <Plus size={14} /> New Session
                  </button>
                  <button
                    onClick={() => { setSelectedDateForTraining(new Date(currentDate)); setShowScheduleModal(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-semibold transition"
                  >
                    <BookOpen size={14} /> Load Workout
                  </button>
                </div>
              </div>

              {(() => {
                const daySess = getSessionsByDate(currentDate);
                const dayWkts = getWorkoutsByDate(currentDate);
                const dayHubActs = getUnplannedHubActivitiesByDate(currentDate);
                return (
                  <>
                    {daySess.length === 0 && dayWkts.length === 0 && dayHubActs.length === 0 ? (
                      <p className="text-center text-gray-400 dark:text-gray-500 py-12 text-sm">No sessions scheduled</p>
                    ) : (
                      <div className="space-y-3">
                        {daySess.map(session => {
                          const diff = computeDifficulty({
                            session_date: session.session_date,
                            sport: session.sport,
                            duration_minutes: session.duration_minutes,
                            avg_power_watts: session.avg_power_watts,
                            avg_pace_per_km: session.avg_pace_per_km,
                            perceived_effort: session.perceived_effort,
                            status: session.status,
                            ftp,
                          });
                          const diffCls = diff ? getDifficultyClasses(diff.difficulty) : null;

                          return (
                          <div key={session.id} className={`border rounded-xl p-4 ${diffCls ? `${diffCls.border}` : 'border-gray-200 dark:border-gray-700'}`}>
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-gray-800 dark:text-white">
                                {getSportIcon(session.sport)} {session.session_name || `${session.sport} Session`}
                              </h4>
                              <div className="flex items-center gap-2">
                                {diff && (
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${diffCls!.badge}`}>
                                    {getDifficultyLabel(diff.difficulty)}
                                  </span>
                                )}
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSessionColor(session)}`}>
                                  {session.status}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Clock size={15} />
                                <span>{session.duration_minutes} min</span>
                              </div>
                              {session.distance_km && (
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                  <Gauge size={15} /><span>{session.distance_km} km</span>
                                </div>
                              )}
                              {session.sport === 'cycling' && session.avg_power_watts && (
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                  <Zap size={15} /><span>{session.avg_power_watts}W</span>
                                </div>
                              )}
                              {(session.sport === 'running' || session.sport === 'swimming') && session.avg_pace_per_km && (
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                  <TrendingUp size={15} />
                                  <span>{session.sport === 'running' ? formatPace(session.avg_pace_per_km) : formatPacePer100m(session.avg_pace_per_km)}</span>
                                </div>
                              )}
                              {session.avg_heart_rate && (
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                  <Activity size={15} /><span>{session.avg_heart_rate} bpm</span>
                                </div>
                              )}
                            </div>
                            {diff && session.status === 'completed' && (
                              <div className={`mt-3 flex items-center gap-4 px-3 py-2 rounded-lg text-xs ${diffCls!.bg}`}>
                                <span className={`font-semibold ${diffCls!.text}`}>SSR: {diff.ssr.toFixed(2)}</span>
                                <span className="text-gray-400 dark:text-gray-500">Impulse: {diff.sessionImpulse.toFixed(1)}</span>
                                <span className="text-gray-400 dark:text-gray-500">CA: {diff.currentCA.toFixed(1)}</span>
                              </div>
                            )}
                            {session.notes && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{session.notes}</p>}
                          </div>
                          );
                        })}
                        {dayWkts.map(workout => {
                          const diff = workout.scheduled_date ? computeDifficulty({
                            session_date: workout.scheduled_date,
                            sport: workout.sport,
                            duration_minutes: workout.estimated_duration_minutes ?? 60,
                            avg_power_watts: null,
                            avg_pace_per_km: null,
                            perceived_effort: null,
                            status: 'planned',
                            ftp,
                          }) : null;
                          const diffCls = diff ? getDifficultyClasses(diff.difficulty) : null;
                          const wColors = diffCls ?? getSportColor(workout.sport);
                          return (
                          <div key={workout.id} className={`border rounded-xl p-4 ${wColors.border} ${wColors.bg}`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className={`font-semibold ${wColors.text}`}>{workout.name}</h4>
                                  {diff && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${diffCls!.badge}`}>
                                      {getDifficultyLabel(diff.difficulty)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize">
                                  {workout.sport} · {workout.estimated_duration_minutes} min
                                  {workout.intensity_basis && ` · ${workout.intensity_basis.toUpperCase()}`}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => handleEditWorkout(workout)} className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700 transition" title="Edit">
                                  <Edit2 size={14} className="text-gray-500" />
                                </button>
                                <button onClick={() => handleDuplicateWorkout(workout)} className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700 transition" title="Duplicate">
                                  <CopyCheck size={14} className="text-gray-500" />
                                </button>
                                <button onClick={() => handleCopyWorkout(workout)} className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700 transition" title="Copy">
                                  <Copy size={14} className="text-gray-500" />
                                </button>
                                <button onClick={() => setDeleteConfirm(workout)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Delete">
                                  <Trash2 size={14} className="text-red-400" />
                                </button>
                              </div>
                            </div>
                            {workout.description && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{workout.description}</p>}
                            {diff && (
                              <div className={`mt-2 flex items-center gap-4 px-3 py-1.5 rounded-lg text-xs ${diffCls!.bg}`}>
                                <span className={`font-bold ${diffCls!.text}`}>{getDifficultyLabel(diff.difficulty)}</span>
                                <span className="text-gray-400 dark:text-gray-500">SSR: {diff.ssr.toFixed(2)}</span>
                                <span className="text-gray-400 dark:text-gray-500">Impulse: {diff.sessionImpulse.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          );
                        })}
                        {dayHubActs.map(act => {
                          const sport = act.sport_type || 'other';
                          const colors = getSportColor(sport);
                          const distKm = act.distance_meters ? act.distance_meters / 1000 : null;
                          const durMin = act.duration_seconds ? Math.round(act.duration_seconds / 60) : 0;
                          const sourceLabel = act.source === 'asciende_gps' ? 'GPS Asciende' : act.source === 'strava' ? 'Strava' : act.source || '';
                          return (
                            <div key={`hub-day-${act.id}`} className={`border rounded-xl p-4 ${colors.border} ${colors.bg} cursor-pointer hover:shadow-md transition`}
                              onClick={() => handleViewHubActivity(act)}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Activity size={16} className={colors.text} />
                                    <h4 className={`font-semibold ${colors.text}`}>{act.name || sport}</h4>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                      Sin planificación
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize">
                                    {sport} · {durMin} min
                                    {distKm ? ` · ${distKm.toFixed(1)} km` : ''}
                                    {sourceLabel ? ` · ${sourceLabel}` : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                {act.average_heartrate && <span className="flex items-center gap-1"><Activity size={12} /> {Math.round(act.average_heartrate)} bpm</span>}
                                {act.average_power && <span className="flex items-center gap-1"><Zap size={12} /> {Math.round(act.average_power)}W</span>}
                                {act.tss && <span>TSS: {Math.round(act.tss)}</span>}
                                {act.rpe && <span>RPE: {act.rpe}/10</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">Delete workout?</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              "<span className="font-semibold text-gray-700 dark:text-gray-300">{deleteConfirm.name}</span>" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteWorkout(deleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <TrainingTypeModal
        isOpen={showTrainingModal}
        selectedDate={selectedDateForTraining}
        onClose={() => { setShowTrainingModal(false); setSelectedDateForTraining(null); }}
        onSelect={(discipline, type, opts) => {
          setShowTrainingModal(false);
          if (selectedDateForTraining && onCreateSession) {
            onCreateSession(selectedDateForTraining, discipline, type, opts);
          }
          setSelectedDateForTraining(null);
        }}
      />

      <ScheduleWorkoutModal
        isOpen={showScheduleModal}
        onClose={() => { setShowScheduleModal(false); setSelectedDateForTraining(null); }}
        selectedDate={selectedDateForTraining}
        isCoach={isCoach}
        currentUserId={currentUserId}
        onScheduled={() => { loadWorkouts(); setShowScheduleModal(false); setSelectedDateForTraining(null); }}
      />

      {drawerWeek && (
        <WeeklyAtpDrawer
          week={drawerWeek}
          onClose={() => setDrawerWeek(null)}
        />
      )}

      {detailWorkout && (
        <WorkoutDetailModal
          isOpen={true}
          onClose={() => { setDetailWorkout(null); setDetailWorkoutSource(null); setDetailSteps([]); setDetailActivityOnly(false); setDetailActivitySource(undefined); }}
          workoutData={detailWorkout}
          userRole={isCoach ? 'coach' : 'athlete'}
          isCompleted={detailWorkoutSource?.compliance_status === 'completed'}
          isActivityOnly={detailActivityOnly}
          activitySource={detailActivitySource}
          steps={detailSteps}
          sport={detailWorkoutSource?.sport || 'cycling'}
          ftp={ftp}
          onEdit={detailActivityOnly ? undefined : handleEditFromDetail}
          onDuplicate={detailActivityOnly ? undefined : handleDuplicateFromDetail}
          onCopy={detailActivityOnly ? undefined : handleCopyFromDetail}
          onDelete={detailActivityOnly ? undefined : handleDeleteFromDetail}
        />
      )}
    </div>
  );
}
