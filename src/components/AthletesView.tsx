import { useEffect, useState } from 'react';
import { supabase, Profile, TrainingSession } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { calculateWeeklyStats } from '../lib/calculations';
import { Users, FlaskConical, BarChart3, Download, RefreshCw, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Zap, Heart, TrendingUp, User, Activity, BookOpen } from 'lucide-react';
import { useAthletePhysiology } from '../hooks/useAthletePhysiology';
import { pushAthleteThresholds } from '../hooks/useHubSync';
import AthletePhysiologyPanel from './athletes/AthletePhysiologyPanel';
import AthleteATPPanel from './athletes/AthleteATPPanel';
import { useHubPassport, PassportSnapshot } from '../hooks/useHubPassport';
import ApplyProgramModal from './programs/ApplyProgramModal';
import { useCoachAthletes } from '../hooks/useCoachAthletes';

type Tab = 'physiology' | 'atp';

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
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mt-4">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 bg-emerald-50 dark:bg-emerald-900/20 text-left hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Pasaporte Biologico Sincronizado
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              {snapshot.profile.athlete.full_name} · Medido {p.measurement_date}
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
            <PassportStatBox icon={Activity} label="VO2max" value={`${p.vo2max} ml/kg/min`} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
          )}
          {p.lt2_hr && (
            <PassportStatBox icon={Heart} label="LT2 HR" value={`${p.lt2_hr} bpm`} color="text-red-600" bg="bg-red-50 dark:bg-red-900/20" />
          )}
          {p.lt1_hr && (
            <PassportStatBox icon={Heart} label="LT1 HR" value={`${p.lt1_hr} bpm`} color="text-orange-600" bg="bg-orange-50 dark:bg-orange-900/20" />
          )}
          {p.running_threshold_pace && (
            <PassportStatBox icon={TrendingUp} label="Umbral Carrera" value={`${p.running_threshold_pace}/km`} color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" />
          )}
          {p.weight_kg && (
            <PassportStatBox icon={User} label="Peso" value={`${p.weight_kg} kg`} color="text-gray-600" bg="bg-gray-50 dark:bg-gray-700/50" />
          )}
          {p.athlete_level && (
            <div className="col-span-full">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full capitalize">
                {p.athlete_level} · {p.source}
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
          {p.heat_adaptation && (
            <div className="col-span-full pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Adaptacion al Calor</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {p.heat_adaptation.adaptation_classification} · Score {p.heat_adaptation.heat_adaptation_score} ({p.heat_adaptation.total_sessions} sesiones)
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

export default function AthletesView() {
  const { profile, user } = useAuth();
  const [selectedAthlete, setSelectedAthlete] = useState<Profile | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [athleteFTP, setAthleteFTP] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('physiology');
  const [showProgramModal, setShowProgramModal] = useState(false);

  const coachHubId = user?.id;
  const assignedAthletes = (user as any)?.assigned_athletes as string[] | undefined;
  const { athletes, loading, refresh: refreshAthletes } = useCoachAthletes(coachHubId, assignedAthletes);

  const { physiology, refetch: refetchPhysiology } = useAthletePhysiology(selectedAthlete?.id);
  const { snapshot: passportSnapshot, loading: passportLoading, error: passportError, fetchPassport } = useHubPassport();

  const handleFetchPassport = () => {
    if (!selectedAthlete) return;
    const hubId = selectedAthlete.hub_user_id;
    if (!hubId) return;
    fetchPassport(hubId, selectedAthlete.id, selectedAthlete.email).then(() => refetchPhysiology?.());
  };

  useEffect(() => {
    if (athletes.length > 0 && !selectedAthlete) {
      setSelectedAthlete(athletes[0]);
    }
  }, [athletes]);

  useEffect(() => {
    if (selectedAthlete) {
      loadAthleteSessions(selectedAthlete.id);
      loadAthleteFTP(selectedAthlete.id);
    }
  }, [selectedAthlete]);

  async function loadAthleteSessions(athleteId: string) {
    const { data } = await supabase.from('training_sessions').select('*').eq('athlete_id', athleteId).order('session_date', { ascending: false }).limit(20);
    setSessions(data || []);
  }

  async function loadAthleteFTP(athleteId: string) {
    const { data } = await supabase.from('athlete_ftp').select('current_ftp_watts').eq('athlete_id', athleteId).maybeSingle();
    setAthleteFTP(data?.current_ftp_watts || null);
  }

  const stats = calculateWeeklyStats(sessions, athleteFTP);

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'physiology', label: 'Physiology', icon: FlaskConical },
    { id: 'atp', label: 'Annual Training Plan', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading athletes...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-heading text-primary-purple dark:text-white">Athletes</h1>
        <p className="text-gray-600 dark:text-gray-400 font-body mt-1">Athlete profiles, physiology, and training plans</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Athletes</h2>
            {athletes.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No athletes assigned</p>
            ) : (
              <div className="space-y-1.5">
                {athletes.map((athlete) => (
                  <button
                    key={athlete.id}
                    onClick={() => setSelectedAthlete(athlete)}
                    className={`w-full text-left px-3 py-3 rounded-xl transition-all font-body ${
                      selectedAthlete?.id === athlete.id
                        ? 'bg-primary-yellow text-primary-purple font-semibold shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        selectedAthlete?.id === athlete.id
                          ? 'bg-primary-purple text-primary-yellow'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {(athlete.full_name || athlete.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm truncate">{athlete.full_name || athlete.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedAthlete ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-5 shadow-sm">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#fdda36] flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-gray-900">
                          {(selectedAthlete.full_name || selectedAthlete.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{selectedAthlete.full_name || selectedAthlete.email}</h2>
                        <p className="text-gray-400 text-sm">{selectedAthlete.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <button
                        onClick={() => setShowProgramModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <BookOpen size={16} />
                        Apply Program
                      </button>
                      <div className="flex gap-5 text-right">
                        <div>
                          <p className="text-2xl font-bold text-white">{athleteFTP || '—'}</p>
                          <p className="text-xs text-gray-400">watts FTP</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{stats.totalLoad}</p>
                          <p className="text-xs text-gray-400">weekly load</p>
                        </div>
                      </div>
                      {selectedAthlete.hub_user_id && (
                        <button
                          onClick={handleFetchPassport}
                          disabled={passportLoading}
                          title="Leer Pasaporte Biologico del Hub"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-400/50 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {passportLoading
                            ? <RefreshCw size={13} className="animate-spin" />
                            : <Download size={13} />}
                          Pasaporte Bio
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex border-b border-gray-100 dark:border-gray-700 px-2 overflow-x-auto">
                  {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === id
                          ? 'border-primary-yellow text-primary-purple dark:text-white'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {activeTab === 'physiology' && (
                  <>
                    {passportError && (
                      <div className="flex items-start gap-3 p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 dark:text-red-300">Error al leer pasaporte</p>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{passportError}</p>
                        </div>
                      </div>
                    )}
                    {passportSnapshot && <PassportCard snapshot={passportSnapshot} />}
                    <div className={passportSnapshot ? 'mt-4' : ''}>
                      <AthletePhysiologyPanel
                        athleteId={selectedAthlete.id}
                        physiology={physiology}
                        ftp={athleteFTP}
                        onPhysiologyUpdated={() => refetchPhysiology?.()}
                        onFTPUpdated={(ftp) => {
                          setAthleteFTP(ftp);
                          pushAthleteThresholds(selectedAthlete.hub_user_id, physiology, ftp);
                        }}
                      />
                    </div>
                  </>
                )}

                {activeTab === 'atp' && (
                  <AthleteATPPanel
                    athleteId={selectedAthlete.id}
                    athleteName={selectedAthlete.full_name || selectedAthlete.email}
                    isCoach={profile?.role === 'coach' || profile?.role === 'admin'}
                  />
                )}

              </div>
            </>
          ) : (
            <div className="card text-center py-16">
              <Users className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Select an athlete to view their profile</p>
            </div>
          )}
        </div>
      </div>

      {selectedAthlete && (
        <ApplyProgramModal
          isOpen={showProgramModal}
          onClose={() => setShowProgramModal(false)}
          athleteId={selectedAthlete.id}
          athleteName={selectedAthlete.full_name || selectedAthlete.email}
        />
      )}
    </>
  );
}
