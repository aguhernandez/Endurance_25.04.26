import { useEffect, useState } from 'react';
import { supabase, TrainingSession } from '../lib/supabase';
import { useAuth, hasAIAccess } from '../contexts/AuthContext';
import { useAIBlock } from '../hooks/useAIBlock';
import { useAthletePhysiology } from '../hooks/useAthletePhysiology';
import { useHubPassport, PassportSnapshot } from '../hooks/useHubPassport';
import { calculateWeeklyStats, getPowerZone, getZoneName, getZoneColor } from '../lib/calculations';
import { Activity, Calendar, TrendingUp, Plus, Sparkles, Lock, Download, RefreshCw, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Zap, Heart, User, FlaskConical, BarChart2 } from 'lucide-react';
import CompleteSessionModal from './CompleteSessionModal';
import SessionsList from './SessionsList';
import WorkoutsList from './WorkoutsList';
import AIBlockGenerator from './ai/AIBlockGenerator';
import ActivityHistory from './ActivityHistory';
import AthletePhysiologyPanel from './athletes/AthletePhysiologyPanel';
import AthleteATPPanel from './athletes/AthleteATPPanel';
import { pushAthleteThresholds } from '../hooks/useHubSync';

type View = 'dashboard' | 'settings';

interface AthleteDashboardProps {
  onNavigate: (view: View) => void;
}

function PassportStatBox({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType; label: string; value: string; color: string; bg: string;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${bg}`}>
      <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
      <div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function PassportCard({ snapshot }: { snapshot: PassportSnapshot }) {
  const [expanded, setExpanded] = useState(false);
  const p = snapshot.passport;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 bg-emerald-50 dark:bg-emerald-900/20 text-left hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Pasaporte Biologico Sincronizado</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              Medido {p.measurement_date}
              {p.source ? ` · ${p.source}` : ''}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-emerald-600" /> : <ChevronDown size={16} className="text-emerald-600" />}
      </button>

      {expanded && (
        <div className="px-5 py-4 bg-white dark:bg-gray-800 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {p.ftp_watts && (
            <PassportStatBox icon={Zap} label="FTP" value={`${p.ftp_watts} W`} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
          )}
          {p.vo2max && (
            <PassportStatBox icon={TrendingUp} label="VO2max" value={`${p.vo2max} ml/kg/min`} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
          )}
          {p.lt2_hr && (
            <PassportStatBox icon={Heart} label="LT2 HR" value={`${p.lt2_hr} bpm`} color="text-red-600" bg="bg-red-50 dark:bg-red-900/20" />
          )}
          {p.lt1_hr && (
            <PassportStatBox icon={Heart} label="LT1 HR" value={`${p.lt1_hr} bpm`} color="text-orange-600" bg="bg-orange-50 dark:bg-orange-900/20" />
          )}
          {p.running_threshold_pace && (
            <PassportStatBox icon={Activity} label="Umbral Carrera" value={`${p.running_threshold_pace}/km`} color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" />
          )}
          {p.weight_kg && (
            <PassportStatBox icon={User} label="Peso" value={`${p.weight_kg} kg`} color="text-gray-600" bg="bg-gray-50 dark:bg-gray-700/50" />
          )}
          {p.athlete_level && (
            <div className="col-span-full">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full capitalize">
                {p.athlete_level}
                {p.training_age_years ? ` · ${p.training_age_years} años entrenamiento` : ''}
              </span>
            </div>
          )}
          {p.hydration && (
            <div className="col-span-full pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Hidratacion (Lab)</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Tasa sudoracion {p.hydration.sweat_rate_l_h} L/h · {p.hydration.temperature_c}°C / {p.hydration.humidity_percent}% humedad
              </p>
            </div>
          )}
          {p.force_velocity && (
            <div className="col-span-full pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Perfil Fuerza-Velocidad</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pmax {p.force_velocity.pmax_w}W ({p.force_velocity.pmax_w_kg} W/kg) ·{' '}
                <span className={`font-semibold ${
                  p.force_velocity.fv_imbalance_direction === 'balanced' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {p.force_velocity.fv_imbalance_direction.replace('_', ' ')} ({p.force_velocity.fv_imbalance_percent}%)
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AthleteDashboard({ onNavigate }: AthleteDashboardProps) {
  const { profile, user } = useAuth();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [athleteFTP, setAthleteFTP] = useState<number | null>(null);
  const { physiology, refetch: refetchPhysiology } = useAthletePhysiology(profile?.id);
  const { snapshot: passportSnapshot, loading: passportLoading, error: passportError, fetchPassport } = useHubPassport();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'workouts' | 'history' | 'physiology' | 'atp'>('dashboard');

  const { settings: aiSettings } = useAIBlock(null);
  const canUseAI = aiSettings?.ai_enabled && hasAIAccess(user?.membership_slug);

  const handleFetchPassport = () => {
    if (!profile || !user?.id) return;
    fetchPassport(user.id, profile.id, profile.email).then(() => refetchPhysiology?.());
  };

  useEffect(() => {
    if (profile) {
      loadSessions();
      loadFTP();
    }
  }, [profile]);

  async function loadSessions() {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('athlete_id', profile.id)
        .order('session_date', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadFTP() {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('athlete_ftp')
        .select('current_ftp_watts')
        .eq('athlete_id', profile.id)
        .maybeSingle();

      if (error) throw error;
      setAthleteFTP(data?.current_ftp_watts || null);
    } catch (error) {
      console.error('Error loading FTP:', error);
    }
  }

  async function updateFTP(newFTP: number) {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('athlete_ftp')
        .upsert({
          athlete_id: profile.id,
          current_ftp_watts: newFTP,
          updated_by: profile.id
        });

      if (error) throw error;
      setAthleteFTP(newFTP);

      pushAthleteThresholds(profile.hub_user_id, physiology, newFTP);
    } catch (error) {
      console.error('Error updating FTP:', error);
    }
  }

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const plannedSessions = sessions.filter(s => s.status === 'planned');

  const stats = calculateWeeklyStats(sessions, athleteFTP);

  const zoneDistribution = completedSessions.reduce((acc, session) => {
    const zone = getPowerZone(session.avg_power_watts, athleteFTP);
    if (zone) {
      acc[zone] = (acc[zone] || 0) + session.duration_minutes;
    }
    return acc;
  }, {} as Record<number, number>);

  const totalZoneTime = Object.values(zoneDistribution).reduce((sum, time) => sum + time, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primary-purple dark:text-white text-xl font-body">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-heading text-primary-purple dark:text-white">My Training</h1>
            <p className="text-gray-600 dark:text-gray-400 font-body mt-1">Welcome, {profile?.full_name}</p>
          </div>
          {user?.id && (
            <button
              onClick={handleFetchPassport}
              disabled={passportLoading}
              title="Leer Pasaporte Biologico desde el Hub"
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-400 text-emerald-700 dark:text-emerald-300 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passportLoading
                ? <RefreshCw size={15} className="animate-spin" />
                : <Download size={15} />}
              Pasaporte Bio
            </button>
          )}
        </div>
        {passportError && (
          <div className="flex items-start gap-3 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 dark:text-red-400">{passportError}</p>
          </div>
        )}
        {passportSnapshot && (
          <div className="mt-3">
            <PassportCard snapshot={passportSnapshot} />
          </div>
        )}
      </div>

      <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {([
          { id: 'dashboard', label: 'My Training', icon: Activity },
          { id: 'physiology', label: 'Physiology', icon: FlaskConical },
          { id: 'atp', label: 'Annual Plan', icon: BarChart2 },
          { id: 'workouts', label: 'Workouts', icon: Zap },
          { id: 'history', label: 'Planner Sync', icon: TrendingUp },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id)}
            className={`flex items-center gap-2 px-4 py-3 font-body font-medium border-b-2 whitespace-nowrap transition ${
              currentView === id
                ? 'border-primary-yellow text-primary-purple dark:text-white'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {currentView === 'dashboard' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-body">Current FTP</span>
                <TrendingUp className="w-5 h-5 text-primary-yellow" />
              </div>
              <div className="flex items-baseline space-x-2">
                <input
                  type="number"
                  value={athleteFTP || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) updateFTP(value);
                  }}
                  className="text-3xl font-bold text-primary-purple dark:text-white w-24 border-b-2 border-transparent hover:border-primary-yellow focus:border-primary-yellow focus:outline-none bg-transparent"
                  placeholder="0"
                />
                <span className="text-gray-500 dark:text-gray-400 font-body">watts</span>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-body">Total Load</span>
                <Calendar className="w-5 h-5 text-primary-yellow" />
              </div>
              <p className="text-3xl font-bold text-primary-purple dark:text-white">{stats.totalLoad}</p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-body">Avg Intensity</span>
                <TrendingUp className="w-5 h-5 text-primary-yellow" />
              </div>
              <p className="text-3xl font-bold text-primary-purple dark:text-white">{stats.avgIntensity}% FTP</p>
            </div>
          </div>

          {totalZoneTime > 0 && (
            <div className="card mb-8">
              <h2 className="text-xl font-heading font-semibold text-primary-purple dark:text-white mb-4">Zone Distribution (Last 20 Sessions)</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((zoneNum) => {
                  const time = zoneDistribution[zoneNum] || 0;
                  const percentage = totalZoneTime > 0 ? (time / totalZoneTime) * 100 : 0;
                  return (
                    <div key={zoneNum}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-200 font-body font-medium">{getZoneName(zoneNum)}</span>
                        <span className="text-gray-600 dark:text-gray-400 font-body">{time} min ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`${getZoneColor(zoneNum)} h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                <Sparkles size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-primary-purple dark:text-white">AI Training Block</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Generate a personalized training block based on your history and goals</p>
              </div>
            </div>
            {canUseAI ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowAIGenerator(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]"
                >
                  <Sparkles size={14} />
                  Generate AI Block
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  The AI will analyze your training history, Banister model state, feedback, and upcoming events to design a personalized block.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <Lock size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-0.5">AI Block Generation</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {!aiSettings?.ai_enabled
                      ? 'AI block generation is currently disabled by the administrator.'
                      : 'Requires Asciende Intermediate or Asciende Pro membership to access AI-powered training blocks.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold text-primary-purple dark:text-white">My Sessions</h2>
              <button
                onClick={() => setShowCompleteModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Log Session</span>
              </button>
            </div>


            {completedSessions.length > 0 && (
              <div>
                <h3 className="text-sm font-body font-semibold text-gray-600 dark:text-gray-400 uppercase mb-3">Completed Sessions</h3>
                <SessionsList sessions={completedSessions} ftp={athleteFTP} athleteId={profile?.id} onRefresh={loadSessions} />
              </div>
            )}

            {sessions.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-body">No sessions yet. Log your first session!</p>
              </div>
            )}
          </div>
        </>
      ) : currentView === 'physiology' ? (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-heading font-semibold text-primary-purple dark:text-white">Physiology & Zones</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your training zones and physiological data</p>
            </div>
          </div>
          <AthletePhysiologyPanel
            athleteId={profile?.id || ''}
            physiology={physiology}
            ftp={athleteFTP}
            onPhysiologyUpdated={() => refetchPhysiology?.()}
            onFTPUpdated={(ftp) => setAthleteFTP(ftp)}
          />
        </div>
      ) : currentView === 'atp' ? (
        <div className="card">
          <div className="mb-5">
            <h2 className="text-xl font-heading font-semibold text-primary-purple dark:text-white">Annual Training Plan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Banister model fitness-fatigue simulation</p>
          </div>
          <AthleteATPPanel
            athleteId={profile?.id || ''}
            athleteName={profile?.full_name}
            isCoach={false}
          />
        </div>
      ) : currentView === 'workouts' ? (
        <div>
          <WorkoutsList coachId={profile?.id || ''} isCoach={false} />
        </div>
      ) : (
        <div className="card">
          <ActivityHistory />
        </div>
      )}

      {showCompleteModal && (
        <CompleteSessionModal
          onClose={() => setShowCompleteModal(false)}
          onSuccess={() => {
            setShowCompleteModal(false);
            loadSessions();
          }}
        />
      )}

      {showAIGenerator && profile && (
        <AIBlockGenerator
          athleteId={profile.id}
          requestedByRole="athlete"
          onClose={() => setShowAIGenerator(false)}
        />
      )}
    </>
  );
}
