import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAIBlock } from '../hooks/useAIBlock';
import { Activity, Sparkles, Lock, Users } from 'lucide-react';
import WorkoutsList from './WorkoutsList';
import AIBlockGenerator from './ai/AIBlockGenerator';
import { supabase } from '../lib/supabase';

type View = 'dashboard' | 'settings' | 'workouts';

interface CoachDashboardProps {
  onNavigate: (view: View) => void;
}

interface AthleteOption {
  id: string;
  full_name: string | null;
  email: string;
}

export default function CoachDashboard({ onNavigate }: CoachDashboardProps) {
  const { profile } = useAuth();
  const [athletes, setAthletes] = useState<AthleteOption[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [athletesLoaded, setAthletesLoaded] = useState(false);

  const { settings: aiSettings } = useAIBlock(null);
  const canSendAIBlock = aiSettings?.ai_enabled && aiSettings?.coaches_can_send;

  useEffect(() => {
    if (athletesLoaded) return;
    async function loadAthletes() {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'athlete')
        .order('full_name', { ascending: true });
      setAthletes(data || []);
      if (data && data.length > 0) setSelectedAthleteId(data[0].id);
      setAthletesLoaded(true);
    }
    loadAthletes();
  }, [athletesLoaded]);

  const selectedAthlete = athletes.find(a => a.id === selectedAthleteId);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-heading text-primary-purple dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 font-body mt-1">Welcome, {profile?.full_name}</p>
      </div>

      <div className="card mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <Sparkles size={17} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-primary-purple dark:text-white">AI Training Block</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Generate and send AI-designed blocks to your athletes</p>
          </div>
        </div>

        {canSendAIBlock ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users size={15} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Select Athlete</label>
              {athletes.length > 0 ? (
                <select
                  value={selectedAthleteId}
                  onChange={e => setSelectedAthleteId(e.target.value)}
                  className="flex-1 max-w-xs border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {athletes.map(a => (
                    <option key={a.id} value={a.id}>{a.full_name || a.email}</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">No athletes yet</span>
              )}
            </div>

            <button
              onClick={() => selectedAthleteId && setShowAIGenerator(true)}
              disabled={!selectedAthleteId}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <Sparkles size={14} />
              Generate AI Block for {selectedAthlete ? (selectedAthlete.full_name || selectedAthlete.email) : 'Athlete'}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              The AI will analyze the athlete's training history, Banister model state, feedback, and upcoming events to design a personalized block.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <Lock size={16} className="text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {!aiSettings?.ai_enabled
                ? 'AI block generation is currently disabled by the administrator.'
                : 'Coach AI block sending is currently disabled. Contact your administrator.'}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Activity size={24} className="text-primary-yellow" />
        <h2 className="text-2xl font-heading font-semibold text-primary-purple dark:text-white">Structured Workouts</h2>
      </div>

      <div>
        <WorkoutsList coachId={profile?.id || ''} isCoach={true} />
      </div>

      {showAIGenerator && selectedAthleteId && (
        <AIBlockGenerator
          athleteId={selectedAthleteId}
          athleteName={selectedAthlete ? (selectedAthlete.full_name || selectedAthlete.email) : undefined}
          coachId={profile?.id}
          requestedByRole="coach"
          onClose={() => setShowAIGenerator(false)}
        />
      )}
    </>
  );
}
