import { useState } from 'react';
import { Home, Users, BookOpen, Settings, BarChart3, LogOut, Sun, Moon, Globe, CalendarRange, TrendingUp, Layers, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { profile } = useAuth();
  const { language, setLanguage } = useLanguage();

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'coach', 'athlete'] },
    { id: 'calendar', label: 'Calendar', icon: CalendarRange, roles: ['admin', 'coach', 'athlete'] },
    { id: 'athletes', label: 'Athletes', icon: Users, roles: ['admin', 'coach'] },
    { id: 'library', label: 'Library', icon: BookOpen, roles: ['admin', 'coach', 'athlete'] },
    { id: 'templates', label: 'Programs', icon: Layers, roles: ['admin', 'coach', 'athlete'] },
    { id: 'weekly', label: 'Weekly Summary', icon: TrendingUp, roles: ['admin', 'coach', 'athlete'] },
    { id: 'reporting', label: 'Reporting', icon: BarChart3, roles: ['admin', 'coach'] },
    { id: 'reviews', label: language === 'es' ? 'Revisión de sesiones' : 'Session reviews', icon: ClipboardCheck, roles: ['admin', 'coach', 'athlete'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'coach', 'athlete'] },
  ];

  const visibleMenuItems = menuItems.filter(item =>
    !item.roles || item.roles.includes(profile?.role || 'athlete')
  );

  const userInitial = profile?.full_name?.charAt(0).toUpperCase() || '?';

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="h-24 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center px-4">
          {isExpanded ? (
            <img src="/logo_transp.png" alt="Asciende" className="h-20 w-auto object-contain" />
          ) : (
            <img src="/favicon_fondo_blanco.png" alt="A" className="h-12 w-12 object-contain" />
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-2">
            {visibleMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-yellow text-primary-purple font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isExpanded && <span className="text-sm font-body font-medium">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
          {/* Language */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${!isExpanded && 'justify-center'}`}
          >
            <Globe className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="text-sm font-body font-medium">{language === 'en' ? 'Eng' : 'Esp'}</span>}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${!isExpanded && 'justify-center'}`}
          >
            {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
            {isExpanded && <span className="text-sm font-body font-medium">{isDark ? 'Light' : 'Dark'}</span>}
          </button>

          {/* User Avatar */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${!isExpanded && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-primary-yellow text-primary-purple flex items-center justify-center font-body font-semibold text-sm">
              {userInitial}
            </div>
            {isExpanded && <span className="text-sm font-body font-medium truncate">{profile?.full_name || 'User'}</span>}
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ${!isExpanded && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="text-sm font-body font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
