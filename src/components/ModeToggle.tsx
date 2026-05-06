import { useAuth } from '../contexts/AuthContext';
import { Code, Globe } from 'lucide-react';

export default function ModeToggle() {
  const { isDevMode, toggleDevMode } = useAuth();

  const handleToggle = () => {
    const newMode = !isDevMode;
    const confirmMessage = newMode
      ? 'Switch to Development Mode?\n\nYou will be able to select test profiles without HUB authentication. The page will reload.'
      : 'Switch to Production Mode?\n\nYou will need to authenticate through the HUB (hub.asciende.pro). The page will reload.';

    if (confirm(confirmMessage)) {
      toggleDevMode(newMode);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isDevMode
          ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-900'
          : 'bg-green-500 hover:bg-green-600 text-white'
      }`}
      title={isDevMode ? 'Currently in Development Mode - Click to switch to Production' : 'Currently in Production Mode - Click to switch to Development'}
    >
      {isDevMode ? (
        <>
          <Code className="w-4 h-4" />
          <span>Dev Mode</span>
        </>
      ) : (
        <>
          <Globe className="w-4 h-4" />
          <span>Production</span>
        </>
      )}
    </button>
  );
}
