import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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

type View = 'dashboard' | 'settings' | 'athletes' | 'library' | 'reporting' | 'atp' | 'calendar' | 'weekly' | 'templates';

function AppContent() {
  const { user, profile, loading, isDevMode, logout, setDevProfile } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
    return <LocalDevMode onProfileSelected={setDevProfile} />;
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

  const renderContent = () => {
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
      return <CalendarView onNavigate={setCurrentView} />;
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
      return <WeeklySummaryView athleteId={athleteId} onNavigate={setCurrentView} />;
    }

    if (currentView === 'dashboard') {
      if (profile.role === 'admin') {
        return <AdminDashboard onNavigate={setCurrentView} />;
      }
      if (profile.role === 'coach') {
        return <CoachDashboard onNavigate={setCurrentView} />;
      }
      return <AthleteDashboard onNavigate={setCurrentView} />;
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
      onNavigate={(page) => setCurrentView(page as View)}
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
