import { useState } from 'react';
import { Home, Users, BookOpen, Settings, BarChart3, MoreHorizontal, CalendarRange, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const [showMore, setShowMore] = useState(false);
  const { profile } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'coach', 'athlete'] },
    { id: 'library', label: 'Library', icon: BookOpen, roles: ['admin', 'coach', 'athlete'] },
    { id: 'templates', label: 'Programs', icon: Layers, roles: ['admin', 'coach', 'athlete'] },
    { id: 'calendar', label: 'Calendar', icon: CalendarRange, roles: ['admin', 'coach', 'athlete'] },
    { id: 'athletes', label: 'Athletes', icon: Users, roles: ['admin', 'coach'] },
    { id: 'reporting', label: 'Reporting', icon: BarChart3, roles: ['admin', 'coach'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'coach', 'athlete'] },
  ];

  const visibleMenuItems = menuItems.filter(item =>
    !item.roles || item.roles.includes(profile?.role || 'athlete')
  );

  const mainItems = visibleMenuItems.slice(0, 4);
  const moreItems = visibleMenuItems.slice(4);

  const MenuItem = ({ item, onClick }: { item: typeof menuItems[0]; onClick: () => void }) => {
    const Icon = item.icon;
    const isActive = currentPage === item.id;
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
          isActive
            ? 'bg-primary-yellow text-primary-purple'
            : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        <Icon className="w-6 h-6" />
        <span className="text-xs font-body font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden z-30">
        <div className="flex items-center justify-around px-2 py-2">
          {mainItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              onClick={() => onNavigate(item.id)}
            />
          ))}
          {moreItems.length > 0 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-xs font-body font-medium">More</span>
            </button>
          )}
        </div>
      </div>

      {/* More Menu Overlay */}
      {showMore && moreItems.length > 0 && (
        <>
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-20"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-20 md:hidden animate-slide-up">
            <div className="space-y-1 p-4">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setShowMore(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-primary-yellow text-primary-purple font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-body font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
