import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import CoachDashboard from './components/CoachDashboard';
import AthleteDashboard from './components/AthleteDashboard';
import Settings from './components/Settings';
import LocalDevMode from './components/LocalDevMode';
import MainLayout from './components/MainLayout';
import AthletesView from './components/AthletesView';
import ATPView from './components/atp/ATPView';
import WorkoutLibrary from './components/library/WorkoutLibrary';
import CalendarView from './components/CalendarView';
import WeeklySummaryView from './components/WeeklySummaryView';
import ProgramTemplates from './components/templates/ProgramTemplates';
import PublicLanding from './components/PublicLanding';
import LoginModal from './components/auth/LoginModal';
import SessionAnalysis, { ReviewInbox } from './components/SessionAnalysis';

type View = 'dashboard' | 'settings' | 'athletes' | 'library' | 'reporting' | 'atp' | 'calendar' | 'weekly' | 'templates' | 'reviews' | 'workouts';

function AppContent() {
  const { user, profile, loading, isDevMode, logout, setDevProfile, login } = useAuth();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>(() => params.get('view') === 'review-inbox' ? 'reviews' : 'dashboard');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const requestedHubLogin = useRef(false);
  const analysisView = params.get('view') === 'session-analysis';
  const protectedHubView = analysisView || params.get('view') === 'review-inbox';
  const athleteId = params.get('athlete') || '';
  const plannedId = params.get('planned') || 'none';
  const executedId = params.get('executed') || 'none';

  useEffect(() => {
    if (!protectedHubView || user || isDevMode) requestedHubLogin.current = false;
    if (!loading && !user && !isDevMode && protectedHubView && !requestedHubLogin.current) {
      requestedHubLogin.current = true;
      login();
    }
  }, [loading, user, isDevMode, protectedHubView, login]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo_transp.png" alt="Asciende" className="h-12 w-auto opacity-60 animate-pulse" />
          <div className="text-gray-500 text-sm font-body tracking-widest uppercase">Loading...</div>
        </div>
      </div>
    );
  }

  if (isDevMode && !profile) {
    return <LocalDevMode onProfileSelected={devProfile => setDevProfile({ ...devProfile, full_name: devProfile.full_name ?? '' })} />;
  }

  // Show public landing when not authenticated
  if (!user && !isDevMode) {
    return (
      <>
        <PublicLanding onLogin={() => setLoginModalOpen(true)} />
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PublicLanding onLogin={() => setLoginModalOpen(true)} />
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </>
    );
  }

  if (user && !profile) {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6">
          <img src="/logo_transp.png" alt="Asciende" className="h-14 w-auto opacity-80 animate-pulse" />
          <div className="text-center">
            <p className="text-gray-400 text-sm font-body tracking-widest uppercase">Syncing with Hub...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const renderContent = () => {
    if (analysisView) {
      return <SessionAnalysis athleteId={athleteId} plannedId={plannedId} executedId={executedId} onBack={() => { const next = new URLSearchParams(params); next.delete('view'); next.delete('athlete'); next.delete('planned'); next.delete('executed'); setParams(next); setCurrentView('dashboard'); }} />;
    }
    if (currentView === 'reviews' || params.get('view') === 'review-inbox') {
      return <ReviewInbox onOpen={row => {
        const next = new URLSearchParams({ view: 'session-analysis', athlete: String(row.athlete_id ?? row.athlete?.id ?? ''), planned: String(row.planned_session_id ?? 'none'), executed: String(row.executed_session_id ?? row.id ?? 'none') });
        setParams(next);
      }} />;
    }
    if (currentView === 'settings') {
      return <Settings />;
    }

    if (currentView === 'athletes') {
      if (profile.role === 'coach' || profile.role === 'admin') {
        return <AthletesView />;
      }
      return <AthleteDashboard onNavigate={setCurrentView} />;
    }

    if (currentView === 'library') {
      return (
        <WorkoutLibrary
          coachId={profile.id}
          isCoach={profile.role === 'coach' || profile.role === 'admin'}
        />
      );
    }

    if (currentView === 'templates') {
      return <ProgramTemplates />;
    }

    if (currentView === 'atp') {
      return <ATPView isCoach={profile.role === 'coach' || profile.role === 'admin'} />;
    }

    if (currentView === 'calendar') {
      return <CalendarView onNavigate={view => setCurrentView(view as View)} />;
    }

    if (currentView === 'weekly') {
      const athleteId = profile.role === 'athlete' ? profile.id : null;
      if (!athleteId) {
        return (
          <div className="card text-center py-12">
            <h2 className="text-2xl font-heading text-primary-purple dark:text-white mb-2">Weekly Summary</h2>
            <p className="text-gray-600 dark:text-gray-400 font-body">
              Select an athlete from the Athletes view to see their weekly summary
            </p>
          </div>
        );
      }
      return <WeeklySummaryView athleteId={athleteId} onNavigate={view => setCurrentView(view as View)} />;
    }

    if (currentView === 'dashboard') {
      if (profile.role === 'admin') {
        return <AdminDashboard onNavigate={view => setCurrentView(view)} />;
      }
      if (profile.role === 'coach') {
        return <CoachDashboard onNavigate={view => setCurrentView(view)} />;
      }
      return <AthleteDashboard onNavigate={view => setCurrentView(view)} />;
    }

    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-heading text-primary-purple dark:text-white mb-2">
          {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-body">
          This section is under development
        </p>
      </div>
    );
  };

  return (
    <MainLayout
      currentPage={currentView}
      onNavigate={(page) => { setCurrentView(page as View); if (page !== 'session-analysis') navigate('/', { replace: false }); }}
      onLogout={logout}
    >
      {renderContent()}
    </MainLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="*" element={<AppContent />} />
    </Routes>
  );
}

export default App;
