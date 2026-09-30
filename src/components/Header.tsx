import React from 'react';
import {
  ShieldAlert,
  Type,
  Moon,
  Sun,
  UserCheck,
  HeartHandshake,
  Users,
  Settings,
  HelpCircle,
  User,
} from 'lucide-react';
import { UserProfile, PersonaType } from '../types';

interface HeaderProps {
  profile: UserProfile;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  onOpenSOS: () => void;
  onOpenSettings: () => void;
  onOpenProfile?: () => void;
  onOpenCaregiver?: () => void;
  onOpenCaregiverPortal?: () => void;
  currentScreen?: string;
  activeTab?: string;
  onNavigate?: (screen: string) => void;
  onSwitchPersona?: (persona: PersonaType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateProfile,
  onOpenSOS,
  onOpenSettings,
  onOpenProfile,
  onOpenCaregiver,
  onOpenCaregiverPortal,
  currentScreen,
  activeTab,
  onNavigate,
  onSwitchPersona,
}) => {
  const isDark = profile.theme === 'dark';
  const screen = activeTab || currentScreen || 'home';

  const toggleTheme = () => {
    const currentlyDark = profile.theme === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark');
    const newTheme: 'light' | 'dark' = currentlyDark ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (onUpdateProfile) {
      onUpdateProfile({ theme: newTheme });
    }
  };

  const handleFontScaleChange = (delta: number) => {
    const next = Math.max(100, Math.min(160, profile.fontScale + delta));
    if (onUpdateProfile) {
      onUpdateProfile({ fontScale: next });
    }
    document.documentElement.style.setProperty('--app-font-scale', `${18 * (next / 100)}px`);
  };

  const handleSwitchPersona = (newPersona: PersonaType) => {
    if (newPersona === profile.persona) return;
    if (onSwitchPersona) {
      onSwitchPersona(newPersona);
      return;
    }
    if (onUpdateProfile) {
      onUpdateProfile({
        persona: newPersona,
        simplifiedMode: newPersona === 'elderly',
        fontScale: newPersona === 'elderly' ? 125 : 100,
      });
    }
    const scale = newPersona === 'elderly' ? 125 : 100;
    document.documentElement.style.setProperty('--app-font-scale', `${18 * (scale / 100)}px`);
  };

  const navigateTo = (toScreen: string) => {
    if (onNavigate) onNavigate(toScreen);
  };

  const openCaregiverView = () => {
    if (onOpenCaregiverPortal) onOpenCaregiverPortal();
    else if (onOpenCaregiver) onOpenCaregiver();
    else if (onNavigate) onNavigate('caregiver');
  };

  return (
    <header
      id="sathi-main-header"
      className="sticky top-0 z-30 w-full transition-colors border-b backdrop-blur-md shadow-xs"
      style={{
        backgroundColor: 'var(--header-bg-blur)',
        borderColor: 'var(--cloud-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 sm:gap-3.5 text-left group focus:outline-none"
            title="Return to Home"
            aria-label="Sathi Home"
          >
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl flex items-center justify-center font-heading font-black text-white shadow-xs transition-transform group-hover:scale-105 select-none"
              style={{ backgroundColor: 'var(--anchor-green)' }}
              aria-label="Sathi logo"
            >
              <span className="text-sm sm:text-base font-black tracking-wider leading-none text-white">SA</span>
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight leading-tight select-none opacity-100"
                  style={{ color: 'var(--deep-taupe)' }}
                >
                  Sathi
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold border hidden sm:inline-block leading-tight select-none"
                  style={{
                    backgroundColor: 'var(--soft-mint-soft)',
                    color: 'var(--soft-mint-text)',
                    borderColor: 'var(--soft-mint)',
                  }}
                >
                  AI Care Companion
                </span>
              </div>
              <p
                className="text-xs font-medium hidden md:block leading-snug mt-0.5"
                style={{ color: 'var(--deep-taupe-muted)' }}
              >
                {profile.persona === 'chronic' ? 'Chronic Condition Pattern Tracker' : 'Senior Independent Living Support'}
              </p>
            </div>
          </button>

          {/* Persona Switcher Quick Pill */}
          <div className="hidden lg:flex items-center p-1 rounded-xl border text-xs" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
            <button
              onClick={() => handleSwitchPersona('chronic')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                profile.persona === 'chronic'
                  ? 'shadow-xs font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: profile.persona === 'chronic' ? 'var(--cloud-card)' : 'transparent',
                color: profile.persona === 'chronic' ? 'var(--anchor-green)' : 'var(--deep-taupe)',
              }}
            >
              Chronic Patient
            </button>
            <button
              onClick={() => handleSwitchPersona('elderly')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                profile.persona === 'elderly'
                  ? 'shadow-xs font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: profile.persona === 'elderly' ? 'var(--cloud-card)' : 'transparent',
                color: profile.persona === 'elderly' ? 'var(--anchor-green)' : 'var(--deep-taupe)',
              }}
            >
              Elderly Living Alone
            </button>
          </div>
        </div>

        {/* Action Controls & Emergency SOS */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Caregiver Portal Switch */}
          <button
            id="nav-caregiver-portal-btn"
            onClick={openCaregiverView}
            className={`tap-target px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all ${
              screen === 'caregiver' ? 'ring-2' : ''
            }`}
            style={{
              backgroundColor: 'var(--cloud-card)',
              borderColor: 'var(--cloud-border)',
              color: 'var(--deep-taupe)',
            }}
            title="Open Caregiver Summary Portal"
          >
            <Users className="w-4 h-4" style={{ color: 'var(--anchor-green)' }} />
            <span className="hidden sm:inline">Caregiver Portal</span>
          </button>

          {/* Font Resizer Control (100% - 160%) */}
          <div className="hidden sm:flex items-center rounded-xl border p-0.5" style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}>
            <button
              onClick={() => handleFontScaleChange(-10)}
              disabled={profile.fontScale <= 100}
              className="w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg hover:bg-black/5 disabled:opacity-30"
              style={{ color: 'var(--deep-taupe)' }}
              title="Decrease Font Size"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <span className="px-1 text-xs font-mono font-semibold" style={{ color: 'var(--deep-taupe-muted)' }}>
              {profile.fontScale}%
            </span>
            <button
              onClick={() => handleFontScaleChange(10)}
              disabled={profile.fontScale >= 160}
              className="w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg hover:bg-black/5 disabled:opacity-30"
              style={{ color: 'var(--deep-taupe)' }}
              title="Increase Font Size"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-colors hover:bg-black/5"
            style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)', color: 'var(--deep-taupe)' }}
            title={isDark ? 'Switch to Warm Daylight' : 'Switch to Warm Night Mode'}
            aria-label="Toggle visual theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" style={{ color: 'var(--deep-taupe)' }} />}
          </button>

          {/* Profile & Security Button */}
          {onOpenProfile && (
            <button
              id="nav-profile-btn"
              onClick={onOpenProfile}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-colors hover:bg-black/5"
              style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)', color: 'var(--deep-taupe)' }}
              title="Patient Profile & Conditions"
              aria-label="Patient profile"
            >
              <User className="w-4 h-4" style={{ color: 'var(--anchor-green)' }} />
            </button>
          )}

          {/* Settings Button */}
          <button
            id="nav-settings-btn"
            onClick={onOpenSettings}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-colors hover:bg-black/5"
            style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)', color: 'var(--deep-taupe)' }}
            title="Accessibility & Settings"
            aria-label="Accessibility and settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* CRITICAL SOS / CRISIS BUTTON (RESERVED --alert-red ONLY) */}
          <button
            id="sos-crisis-header-btn"
            onClick={onOpenSOS}
            className="tap-target-senior px-3 sm:px-4 py-2 rounded-2xl flex items-center gap-1.5 sm:gap-2 text-white font-heading font-extrabold text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 animate-pulse"
            style={{
              backgroundColor: 'var(--alert-red)',
            }}
            title="Emergency SOS & Crisis Support — Always Available"
            aria-label="Open emergency crisis assistance"
          >
            <ShieldAlert className="w-5 h-5 text-white stroke-[2.5]" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
