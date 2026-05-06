import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

interface MainLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function MainLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: MainLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Top Bar - Fixed */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Desktop Sidebar */}
        <div
          className="hidden md:block transition-all duration-300"
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />
        </div>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto pb-24 md:pb-0 ${
          sidebarExpanded ? 'md:ml-64' : 'md:ml-16'
        } transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>

        {/* Mobile Header - Repositioned for mobile */}
        <div className="md:hidden absolute top-16 left-0 right-0">
          <MobileHeader />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
}
