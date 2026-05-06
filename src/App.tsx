import { useState, useEffect } from 'react';
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

type View = 'dashboard' | 'settings' | 'athletes' | 'library' | 'reporting' | 'atp' | 'calendar' | 'weekly' | 'templates';

function AppContent() {
  const { user, profile, loading, hasToken, isDevMode, login, logout, setDevProfile } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    if (!loading && !user && !hasToken && !isDevMode) {
      login();
    }
  }, [user, loading, hasToken, isDevMode, login]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#514163] to-[#3a2e4a] flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (isDevMode && !profile) {
    return <LocalDevMode onProfileSelected={setDevProfile} />;
  }

  if (!user && !isDevMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#514163] to-[#3a2e4a] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-3xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-[#514163] mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              Redirecting to HUB for authentication...
            </p>
            <p className="text-sm text-gray-500">
              If you're not redirected automatically, click the button below.
            </p>
            <button
              onClick={login}
              className="mt-6 bg-[#514163] hover:bg-[#3d2f4a] text-white px-6 py-2 rounded-lg transition font-medium"
            >
              Go to HUB Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#514163] to-[#3a2e4a] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-3xl">⚠</span>
            </div>
            <h2 className="text-2xl font-bold text-[#514163] mb-2">No Local Profile Found</h2>
            <p className="text-gray-600 mb-4">
              You are authenticated in the HUB, but you don't have a local profile in this satellite application.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please contact your administrator to create a profile for you.
            </p>
            <button
              onClick={logout}
              className="bg-[#514163] hover:bg-[#3d2f4a] text-white px-6 py-2 rounded-lg transition font-medium"
            >
              Return to HUB
            </button>
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
      return <CalendarView />;
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
      return <WeeklySummaryView athleteId={athleteId} />;
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
