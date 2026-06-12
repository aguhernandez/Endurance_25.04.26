import { useState, useEffect } from 'react';
import { supabase, TrainingSession, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SessionsCalendarView from './SessionsCalendarView';
import WorkoutBuilder from './WorkoutBuilder';
import AIBlockGenerator from './ai/AIBlockGenerator';
import { Workout } from '../types/workout';
import { CalendarRange, Users, ChevronDown, Activity, Clock, TrendingUp, Upload, Download, CheckCircle, AlertCircle, RefreshCw, X, Sparkles } from 'lucide-react';
import { useAthletePhysiology, extractHRZones, extractPowerZones, extractRunPaceZones, extractSwimPaceZones, getDefaultHRZones, getDefaultPowerZones } from '../hooks/useAthletePhysiology';
import { useHubPlan } from '../hooks/useHubPlan';
import { useHubSchedule } from '../hooks/useHubSchedule';
import { useWeeklyAtpSummary } from '../hooks/useWeeklyAtpSummary';
import { useCoachAthletes } from '../hooks/useCoachAthletes';

interface PendingBuilder {
  date: Date;
  discipline: string;
  type: string;
  elevationM?: number;
  scheduledTime?: string;
}

export default function CalendarView() {
  const { profile, user } = useAuth();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [ftp, setFtp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingBuilder, setPendingBuilder] = useState<PendingBuilder | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<Profile | null>(null);
  const [showAthleteDropdown, setShowAthleteDropdown] = useState(false);
  const [syncBanner, setSyncBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [workoutsVersion, setWorkoutsVersion] = useState(0);

  const { pushing, pushWeeklyPlan } = useHubPlan();
  const { loading: pullLoading, fetchSchedule } = useHubSchedule();

  const isCoach = profile?.role === 'coach' || profile?.role === 'admin';
  const coachHubId = isCoach ? user?.id : undefined;
  const assignedAthletes = isCoach ? (user as any)?.assigned_athletes as string[] | undefined : undefined;
  const { athletes, loading: athletesLoading } = useCoachAthletes(coachHubId, assignedAthletes);
  const activeAthleteId = isCoach ? selectedAthlete?.id : profile?.id;
  const activeAthleteProfile = isCoach ? selectedAthlete : profile;
  const { physiology } = useAthletePhysiology(activeAthleteId || null);
  const { allWeeks, atpPlan, refresh: refreshAtp } = useWeeklyAtpSummary(activeAthleteId);

  const activeHubId = isCoach ? selectedAthlete?.hub_user_id : user?.id;

  const handlePushPlan = async () => {
    if (!activeHubId || !activeAthleteId) return;
    setSyncBanner(null);
    const result = await pushWeeklyPlan(activeHubId, activeAthleteId, ftp);
    if (result.success && result.errors.length === 0) {
      const tagsPart = result.pushedTags > 0
        ? `, ${result.pushedTags} tag${result.pushedTags !== 1 ? 's' : ''}`
        : '';
      setSyncBanner({
        type: 'success',
        message: `Plan enviado: ${result.pushedWeeks} semana${result.pushedWeeks !== 1 ? 's' : ''}, ${result.pushedLogs} sesion${result.pushedLogs !== 1 ? 'es' : ''} completada${result.pushedLogs !== 1 ? 's' : ''}${tagsPart}`,
      });
    } else if (result.errors.length > 0) {
      setSyncBanner({ type: 'error', message: result.errors[0] });
    } else {
      setSyncBanner({ type: 'success', message: 'No hay workouts en el rango para enviar.' });
    }
    setTimeout(() => setSyncBanner(null), 5000);
  };

  const handlePullActivity = async () => {
    if (!activeHubId) return;
    setSyncBanner(null);
    const today = new Date();
    const from = new Date(today); from.setDate(today.getDate() - 14);
    const to = new Date(today); to.setDate(today.getDate() + 28);
    const result = await fetchSchedule(
      activeHubId,
      from.toISOString().split('T')[0],
      to.toISOString().split('T')[0]
    );
    if (result) {
      const done = result.completed_training_logs.length;
      const planned = result.scheduled_workouts.length;
      setSyncBanner({
        type: 'success',
        message: `Hub: ${planned} entrenamiento${planned !== 1 ? 's' : ''} planificado${planned !== 1 ? 's' : ''}, ${done} completado${done !== 1 ? 's' : ''}`,
      });
    } else {
      setSyncBanner({ type: 'error', message: 'No se pudo obtener el calendario del Hub.' });
    }
    setTimeout(() => setSyncBanner(null), 5000);
  };

  useEffect(() => {
    if (isCoach && athletes.length > 0 && !selectedAthlete) {
      setSelectedAthlete(athletes[0]);
    } else if (isCoach && athletes.length === 0 && !athletesLoading) {
      setLoading(false);
    }
  }, [athletes, athletesLoading]);

  useEffect(() => {
    if (!isCoach && profile) {
      loadSessions(profile.id);
      loadFtp(profile.id);
    }
  }, [profile, isCoach]);

  useEffect(() => {
    if (isCoach && selectedAthlete) {
      loadSessions(selectedAthlete.id);
      loadFtp(selectedAthlete.id);
    }
  }, [selectedAthlete]);

  async function loadSessions(athleteId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('session_date', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadFtp(athleteId: string) {
    try {
      const { data } = await supabase
        .from('athlete_ftp')
        .select('current_ftp_watts')
        .eq('athlete_id', athleteId)
        .maybeSingle();
      setFtp(data?.current_ftp_watts || null);
    } catch (err) {
      console.error('Error loading FTP:', err);
    }
  }

  function handleCreateSessionRequest(date: Date, discipline: string, type: string, opts?: { elevationM?: number; scheduledTime?: string }) {
    setPendingBuilder({ date, discipline, type, elevationM: opts?.elevationM, scheduledTime: opts?.scheduledTime });
  }

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const plannedSessions = sessions.filter(s => s.status === 'planned');
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const thisWeek = sessions.filter(s => {
    const d = new Date(s.session_date);
    const now = new Date();
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return d >= weekStart;
  });

  const zoneSystem: '5' | '7' = (activeAthleteProfile?.preferred_zone_system ?? physiology?.zone_system ?? '5') as '5' | '7';

  const hrZones = physiology
    ? extractHRZones(physiology, zoneSystem)
    : getDefaultHRZones(physiology?.hr_max ?? null, physiology?.hr_rest ?? null);

  const powerZones = physiology
    ? extractPowerZones(physiology, ftp, zoneSystem)
    : getDefaultPowerZones(ftp);

  const runPaceZones = extractRunPaceZones(physiology);
  const swimPaceZones = extractSwimPaceZones(physiology);

  return (
    <>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <CalendarRange className="w-7 h-7 text-primary-yellow" />
            <div>
              <h1 className="text-3xl font-heading text-primary-purple dark:text-white">Training Calendar</h1>
              <p className="text-gray-500 dark:text-gray-400 font-body text-sm mt-0.5">
                {isCoach ? 'Plan and assign sessions for your athletes' : 'View and plan your training sessions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeAthleteId && (
              <button
                onClick={() => setShowAIGenerator(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold shadow-md shadow-amber-500/20 transition-all"
              >
                <Sparkles size={15} />
                AI Training Block
              </button>
            )}

            {activeHubId && (
              <>
                <button
                  onClick={handlePullActivity}
                  disabled={pullLoading}
                  title="Pull activity from Hub — see what was done vs planned"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 text-blue-700 dark:text-blue-300 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pullLoading
                    ? <RefreshCw size={15} className="animate-spin" />
                    : <Download size={15} />}
                  Pull Hub
                </button>
                <button
                  onClick={handlePushPlan}
                  disabled={pushing}
                  title="Push plan to Hub — send workouts to athlete's Hub"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-400 text-amber-700 dark:text-amber-300 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pushing
                    ? <RefreshCw size={15} className="animate-spin" />
                    : <Upload size={15} />}
                  Push Hub
                </button>
              </>
            )}

            {isCoach && athletes.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowAthleteDropdown(p => !p)}
                  className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-primary-yellow transition min-w-[180px]"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-yellow flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-900">
                      {(selectedAthlete?.full_name || selectedAthlete?.email || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Athlete</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {selectedAthlete?.full_name || selectedAthlete?.email || 'Select athlete'}
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                </button>

                {showAthleteDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowAthleteDropdown(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-30 overflow-hidden">
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                          <Users size={11} /> Athletes
                        </p>
                      </div>
                      <div className="max-h-64 overflow-y-auto py-1">
                        {athletes.map(athlete => (
                          <button
                            key={athlete.id}
                            onClick={() => { setSelectedAthlete(athlete); setShowAthleteDropdown(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition ${
                              selectedAthlete?.id === athlete.id
                                ? 'bg-primary-yellow/10 text-primary-purple dark:text-yellow-300'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              selectedAthlete?.id === athlete.id
                                ? 'bg-primary-yellow text-gray-900'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                              {(athlete.full_name || athlete.email).charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm truncate">{athlete.full_name || athlete.email}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {syncBanner && (
          <div className={`mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
            syncBanner.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300'
          }`}>
            {syncBanner.type === 'success'
              ? <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
              : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
            <span className="flex-1">{syncBanner.message}</span>
            <button onClick={() => setSyncBanner(null)} className="opacity-60 hover:opacity-100 transition">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {isCoach && !selectedAthlete && athletes.length === 0 && !loading && (
        <div className="card text-center py-16">
          <Users className="w-14 h-14 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No athletes assigned</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Athletes will appear here once assigned to you</p>
        </div>
      )}

      {(!isCoach || selectedAthlete) && (
        <>
          {activeAthleteProfile && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { icon: Activity, label: 'Total Sessions', value: sessions.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { icon: TrendingUp, label: 'Completed', value: completedSessions.length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { icon: CalendarRange, label: 'This Week', value: thisWeek.length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { icon: Clock, label: 'Total Hours', value: `${(totalMinutes / 60).toFixed(1)}h`, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <div className="card flex items-center justify-center py-16">
              <p className="text-gray-400 dark:text-gray-500">Loading calendar...</p>
            </div>
          ) : (
            <SessionsCalendarView
              key={`cal-${activeAthleteId}-${workoutsVersion}`}
              sessions={sessions}
              ftp={ftp}
              athleteId={activeAthleteId}
              isCoach={isCoach}
              currentUserId={profile?.id || ''}
              onCreateSession={handleCreateSessionRequest}
              onEditWorkout={(workout) => setEditingWorkout(workout)}
              onWorkoutsChanged={() => { refreshAtp(); setWorkoutsVersion(v => v + 1); }}
              weeklyAtpSummaries={allWeeks}
            />
          )}
        </>
      )}

      {pendingBuilder && (
        <WorkoutBuilder
          onClose={() => setPendingBuilder(null)}
          onSaved={() => {
            setPendingBuilder(null);
            if (activeAthleteId) loadSessions(activeAthleteId);
            refreshAtp();
            setWorkoutsVersion(v => v + 1);
          }}
          coachId={profile?.id || ''}
          athleteId={isCoach ? activeAthleteId : undefined}
          trainingDate={pendingBuilder.date}
          trainingType={{
            discipline: pendingBuilder.discipline,
            type: pendingBuilder.type,
            elevationM: pendingBuilder.elevationM,
            scheduledTime: pendingBuilder.scheduledTime,
          }}
          hrZones={hrZones}
          powerZones={powerZones}
          runPaceZones={runPaceZones}
          swimPaceZones={swimPaceZones}
          zoneSystem={zoneSystem}
        />
      )}

      {editingWorkout && (
        <WorkoutBuilder
          workout={editingWorkout}
          onClose={() => setEditingWorkout(null)}
          onSaved={() => {
            setEditingWorkout(null);
            if (activeAthleteId) loadSessions(activeAthleteId);
            refreshAtp();
            setWorkoutsVersion(v => v + 1);
          }}
          coachId={profile?.id || ''}
          athleteId={isCoach ? activeAthleteId : undefined}
          hrZones={hrZones}
          powerZones={powerZones}
          runPaceZones={runPaceZones}
          swimPaceZones={swimPaceZones}
          zoneSystem={zoneSystem}
        />
      )}

      {showAIGenerator && activeAthleteId && (
        <AIBlockGenerator
          athleteId={activeAthleteId}
          athleteName={isCoach ? (selectedAthlete?.full_name || selectedAthlete?.email) : undefined}
          coachId={isCoach ? profile?.id : undefined}
          requestedByRole={isCoach ? 'coach' : 'athlete'}
          onClose={() => setShowAIGenerator(false)}
        />
      )}
    </>
  );
}
