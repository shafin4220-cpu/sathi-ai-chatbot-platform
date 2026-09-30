import React from 'react';
import { Home, MessageSquare, Activity, CalendarCheck, FileText, BookOpen } from 'lucide-react';

interface BottomNavProps {
  currentScreen?: string;
  activeTab?: string;
  onNavigate?: (screen: string) => void;
  onChangeTab?: (screen: string) => void;
  onOpenSOS?: () => void;
  simplifiedMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  activeTab,
  onNavigate,
  onChangeTab,
  onOpenSOS,
  simplifiedMode = false,
}) => {
  const current = activeTab || currentScreen || 'home';

  const handleSelect = (id: string) => {
    if (onChangeTab) onChangeTab(id);
    else if (onNavigate) onNavigate(id);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      sublabel: 'Daily Check-in',
      icon: Home,
    },
    {
      id: 'chat',
      label: 'Companion',
      sublabel: 'AI Chat',
      icon: MessageSquare,
    },
    {
      id: 'tracker',
      label: 'Tracker',
      sublabel: 'Symptom Trends',
      icon: Activity,
    },
    {
      id: 'reminders',
      label: 'Schedule',
      sublabel: 'Meds & Visits',
      icon: CalendarCheck,
    },
    {
      id: 'report',
      label: 'Doctor Report',
      sublabel: 'Visit Ready',
      icon: FileText,
    },
    {
      id: 'community',
      label: 'Community',
      sublabel: 'Resources',
      icon: BookOpen,
    },
  ];

  return (
    <nav
      id="sathi-bottom-tabbar"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-20 border-t backdrop-blur-md shadow-lg no-print"
      style={{
        backgroundColor: 'var(--cloud-card)',
        borderColor: 'var(--cloud-border)',
      }}
    >
      <div className="max-w-xl mx-auto px-1.5 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.id || (item.id === 'report' && current === 'doctor_report');
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => handleSelect(item.id)}
              className={`tap-target flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all relative ${
                isActive ? 'font-bold' : 'opacity-70 hover:opacity-100 font-medium'
              }`}
              style={{
                color: isActive ? 'var(--anchor-green)' : 'var(--deep-taupe)',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span
                  className="absolute -top-1.5 w-6 h-1 rounded-full"
                  style={{ backgroundColor: 'var(--anchor-green)' }}
                />
              )}
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--anchor-green-soft)' : 'transparent',
                }}
              >
                <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-xs mt-0.5 leading-tight tracking-tight text-center truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
