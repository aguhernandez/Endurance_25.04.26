import { useEffect, useState } from 'react';
import { Target, Zap, TrendingUp, Award, BookOpen, Filter, Search, Calendar, Users, ChevronRight, X, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ApplyProgramModal from '../programs/ApplyProgramModal';

interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  objective: 'base' | 'vo2max' | 'threshold' | 'race_prep';
  discipline: 'cycling' | 'running' | 'swimming' | 'triathlon';
  duration_weeks: number;
  sessions_per_week: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  weekly_structure: any;
  is_featured: boolean;
}

const objectiveConfig = {
  base: {
    icon: Target,
    color: 'blue',
  },
  vo2max: {
    icon: Zap,
    color: 'red',
  },
  threshold: {
    icon: TrendingUp,
    color: 'yellow',
  },
  race_prep: {
    icon: Award,
    color: 'green',
  }
};

const disciplineConfig = {
  cycling: { emoji: '🚴' },
  running: { emoji: '🏃' },
  swimming: { emoji: '🏊' },
  triathlon: { emoji: '🏊🚴🏃' }
};

export default function ProgramTemplates() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [programs, setPrograms] = useState<ProgramTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedObjective, setSelectedObjective] = useState<string>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<ProgramTemplate | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [programToApply, setProgramToApply] = useState<string | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('program_templates')
        .select('*')
        .order('objective', { ascending: true })
        .order('discipline', { ascending: true })
        .order('level', { ascending: true });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesObjective = selectedObjective === 'all' || program.objective === selectedObjective;
    const matchesDiscipline = selectedDiscipline === 'all' || program.discipline === selectedDiscipline;
    const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel;
    const matchesSearch = searchTerm === '' ||
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesObjective && matchesDiscipline && matchesLevel && matchesSearch;
  });

  const groupedPrograms = filteredPrograms.reduce((acc, program) => {
    if (!acc[program.objective]) {
      acc[program.objective] = [];
    }
    acc[program.objective].push(program);
    return acc;
  }, {} as Record<string, ProgramTemplate[]>);

  const handleApplyToAthlete = (programId: string) => {
    setProgramToApply(programId);
    setShowApplyModal(true);
    setSelectedProgram(null);
  };

  const isCoachOrAdmin = profile?.role === 'coach' || profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={32} className="text-primary-purple" />
            <h1 className="text-3xl font-bold text-primary-purple dark:text-white font-heading">
              {t('programs.title')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('programs.subtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              {t('programs.filters')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('programs.search')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('programs.objective')}
              </label>
              <select
                value={selectedObjective}
                onChange={(e) => setSelectedObjective(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">{t('programs.all')}</option>
                {Object.keys(objectiveConfig).map((key) => (
                  <option key={key} value={key}>{t(`objective.${key}.label`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('programs.discipline')}
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">{t('programs.all')}</option>
                {Object.entries(disciplineConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.emoji} {t(`discipline.${key}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('programs.level')}
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">{t('programs.all')}</option>
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <option key={level} value={level}>{t(`level.${level}`)}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-bold text-primary-purple">{filteredPrograms.length}</span> {t('programs.results')}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('programs.loading')}
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('programs.noResults')}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPrograms).map(([objective, objectivePrograms]) => {
              const config = objectiveConfig[objective as keyof typeof objectiveConfig];
              const Icon = config.icon;

              return (
                <div key={objective} className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
                    <Icon size={24} className={`text-${config.color}-600`} />
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {t(`objective.${objective}.label`)}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(`objective.${objective}.description`)}
                      </p>
                    </div>
                    <div className="ml-auto bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {objectivePrograms.length}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {objectivePrograms.map((program) => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        onViewDetails={() => setSelectedProgram(program)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedProgram && (
        <ProgramDetailModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onApplyToAthlete={isCoachOrAdmin ? handleApplyToAthlete : undefined}
        />
      )}

      {showApplyModal && programToApply && (
        <AthleteSelectionModal
          programId={programToApply}
          onClose={() => {
            setShowApplyModal(false);
            setProgramToApply(null);
          }}
        />
      )}
    </div>
  );
}

function ProgramCard({ program, onViewDetails }: { program: ProgramTemplate; onViewDetails: () => void }) {
  const { t } = useLanguage();
  const disciplineInfo = disciplineConfig[program.discipline];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all hover:border-primary-purple group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{disciplineInfo.emoji}</span>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-purple transition">
              {program.name}
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t(`discipline.${program.discipline}`)}
          </p>
        </div>
        {program.is_featured && (
          <span className="bg-primary-yellow text-white text-xs font-bold px-2 py-1 rounded-full">
            ⭐ {t('programs.featured')}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {program.description}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Calendar size={16} className="mx-auto mb-1 text-blue-600" />
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{program.duration_weeks}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('programs.weeks')}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Target size={16} className="mx-auto mb-1 text-green-600" />
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{program.sessions_per_week}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('programs.sessionsPerWeek')}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Users size={16} className="mx-auto mb-1 text-purple-600" />
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t(`level.${program.level}`)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('programs.level.label')}</p>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold rounded-lg transition group-hover:shadow-md"
      >
        {t('programs.viewDetails')}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

interface ProgramDetailModalProps {
  program: ProgramTemplate;
  onClose: () => void;
  onApplyToAthlete?: (programId: string) => void;
}

function ProgramDetailModal({ program, onClose, onApplyToAthlete }: ProgramDetailModalProps) {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const disciplineInfo = disciplineConfig[program.discipline];
  const weeklyStructure = Array.isArray(program.weekly_structure) ? program.weekly_structure : [];

  const isCoachOrAdmin = profile?.role === 'coach' || profile?.role === 'admin';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{disciplineInfo.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{program.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t(`discipline.${program.discipline}`)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400">{program.description}</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <Calendar size={20} className="mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{program.duration_weeks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('programs.weeks')}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <Target size={20} className="mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{program.sessions_per_week}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('programs.sessionsPerWeek')}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <Users size={20} className="mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-bold text-gray-900 dark:text-white">{t(`level.${program.level}`)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('programs.level.label')}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <Award size={20} className="mx-auto mb-2 text-amber-600" />
              <p className="text-sm font-bold text-gray-900 dark:text-white">{t(`objective.${program.objective}.label`)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Objective</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Structure ({weeklyStructure.length} weeks)</h3>
            {weeklyStructure.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                No weekly structure available for this program
              </div>
            ) : (
              <div className="space-y-4">
                {weeklyStructure.map((week: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Week {week.week_number}
                      </h4>
                      <span className="text-sm font-medium text-primary-purple dark:text-primary-yellow px-3 py-1 bg-white dark:bg-gray-800 rounded-full">
                        {week.focus}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {week.sessions?.map((session: any, sidx: number) => (
                        <div key={sidx} className="flex items-center gap-3 text-sm bg-white dark:bg-gray-800 p-3 rounded-lg">
                          <span className="font-semibold text-gray-700 dark:text-gray-300 w-20">
                            Day {session.day}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{session.workout_name}</p>
                            {session.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{session.description}</p>
                            )}
                          </div>
                          <span className="text-xs bg-primary-yellow text-primary-purple px-3 py-1 rounded-full font-bold">
                            {session.duration_minutes} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isCoachOrAdmin && onApplyToAthlete && (
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={() => onApplyToAthlete(program.id)}
              className="w-full px-6 py-3 bg-primary-purple hover:bg-primary-purple/90 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
            >
              <Users size={20} />
              {t('programs.applyToAthlete')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface AthleteSelectionModalProps {
  programId: string;
  onClose: () => void;
}

function AthleteSelectionModal({ programId, onClose }: AthleteSelectionModalProps) {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'athlete')
        .order('full_name');

      if (error) throw error;
      setAthletes(data || []);
    } catch (error) {
      console.error('Error loading athletes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAthlete = (athleteId: string) => {
    setSelectedAthleteId(athleteId);
    setShowApplyModal(true);
  };

  const selectedAthlete = athletes.find(a => a.id === selectedAthleteId);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Athlete</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choose an athlete to apply this program</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Loading athletes...
              </div>
            ) : athletes.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No athletes found
              </div>
            ) : (
              <div className="space-y-2">
                {athletes.map((athlete) => (
                  <button
                    key={athlete.id}
                    onClick={() => handleSelectAthlete(athlete.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-purple hover:bg-primary-purple/5 dark:hover:bg-primary-purple/10 transition text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-yellow text-primary-purple flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {athlete.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {athlete.full_name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {athlete.email}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && selectedAthleteId && (
        <ApplyProgramModal
          isOpen={showApplyModal}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedAthleteId(null);
            onClose();
          }}
          athleteId={selectedAthleteId}
          athleteName={selectedAthlete?.full_name}
        />
      )}
    </>
  );
}
