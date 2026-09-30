import React, { useState, useEffect } from 'react';
import {
  Settings,
  Type,
  Moon,
  Sun,
  Volume2,
  Globe,
  Sliders,
  ShieldCheck,
  Download,
  Trash2,
  X,
  FileCheck,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { UserProfile, AuditLogEntry } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onExportAllData: () => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onExportAllData,
  onResetAllData,
}) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (showAuditTrail) {
      fetch('/api/audit-logs')
        .then((res) => res.json())
        .then((data) => {
          if (data.auditTrail) setAuditLogs(data.auditTrail);
        })
        .catch((e) => console.error(e));
    }
  }, [showAuditTrail]);

  if (!isOpen) return null;

  const handleFontChange = (scale: number) => {
    onUpdateProfile({ fontScale: scale });
    document.documentElement.style.setProperty('--app-font-scale', `${18 * (scale / 100)}px`);
  };

  const handleToggleTheme = () => {
    const currentlyDark = profile.theme === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark');
    const nextTheme: 'light' | 'dark' = currentlyDark ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    onUpdateProfile({ theme: nextTheme });
  };

  return (
    <div
      id="settings-accessibility-modal"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 bg-black/65 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 relative my-auto ring-1 ring-black/5"
        style={{
          backgroundColor: 'var(--cloud-card)',
          borderColor: 'var(--cloud-border)',
          color: 'var(--deep-taupe)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--cloud-border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: 'var(--anchor-green)' }}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl leading-tight truncate">
                Accessibility & Privacy Settings
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                Customize sizing, visual comfort, voice audio, and regulatory compliance.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all"
            style={{
              borderColor: 'var(--cloud-border)',
              backgroundColor: 'var(--cloud-subtle)',
              color: 'var(--deep-taupe)',
            }}
            aria-label="Close settings"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Font Scale Slider (100% - 160%) */}
        <div className="p-4 sm:p-5 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" style={{ color: 'var(--anchor-green)' }} />
              <span className="font-heading font-bold text-sm">
                Display Text Size (Scales 100% – 160%)
              </span>
            </div>
            <span className="font-mono font-bold text-sm" style={{ color: 'var(--anchor-green)' }}>
              {profile.fontScale}%
            </span>
          </div>

          <input
            id="font-scale-slider"
            type="range"
            min="100"
            max="160"
            step="5"
            value={profile.fontScale}
            onChange={(e) => handleFontChange(parseInt(e.target.value, 10))}
            className="w-full h-3 rounded-lg cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] font-semibold" style={{ color: 'var(--deep-taupe-muted)' }}>
            <span>100% (Standard 18px)</span>
            <span>125% (Senior / Low-Vision)</span>
            <span>160% (Maximum Scale)</span>
          </div>
        </div>

        {/* Visual & Audio Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Simplified Mode Toggle */}
          <div className="p-4 rounded-2xl border space-y-2" style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">Simplified Mode</span>
              <input
                type="checkbox"
                checked={profile.simplifiedMode}
                onChange={(e) => onUpdateProfile({ simplifiedMode: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] leading-tight" style={{ color: 'var(--deep-taupe-muted)' }}>
              Enlarges buttons and simplifies layouts for elderly or tired users.
            </p>
          </div>

          {/* Theme Toggle */}
          <div className="p-4 rounded-2xl border space-y-2" style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">Warm Night Theme</span>
              <button
                onClick={handleToggleTheme}
                className="px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5"
                style={{ borderColor: 'var(--cloud-border)', color: 'var(--deep-taupe)' }}
              >
                {profile.theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-amber-600" />}
                <span>{profile.theme === 'dark' ? 'Night' : 'Day'}</span>
              </button>
            </div>
            <p className="text-[11px] leading-tight" style={{ color: 'var(--deep-taupe-muted)' }}>
              Eye-safe warm contrast without cold blue glare.
            </p>
          </div>

          {/* Voice Output */}
          <div className="p-4 rounded-2xl border space-y-2" style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">Read Aloud Audio</span>
              <input
                type="checkbox"
                checked={profile.voiceEnabled}
                onChange={(e) => onUpdateProfile({ voiceEnabled: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] leading-tight" style={{ color: 'var(--deep-taupe-muted)' }}>
              Audio reading for messages and check-in prompts.
            </p>
          </div>

          {/* Language Toggle */}
          <div className="p-4 rounded-2xl border space-y-2" style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">Companion Language</span>
              <select
                value={profile.language}
                onChange={(e) => onUpdateProfile({ language: e.target.value as any })}
                className="text-xs font-bold p-1 rounded-lg border"
                style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)', color: 'var(--deep-taupe)' }}
              >
                <option value="en" style={{ backgroundColor: 'var(--cloud-card)', color: 'var(--deep-taupe)' }}>English (US)</option>
                <option value="bn" style={{ backgroundColor: 'var(--cloud-card)', color: 'var(--deep-taupe)' }}>বাংলা (Bengali - সাথী)</option>
              </select>
            </div>
            <p className="text-[11px] leading-tight" style={{ color: 'var(--deep-taupe-muted)' }}>
              Select language for Sathi companion voice.
            </p>
          </div>
        </div>

        {/* Security & Regulatory Compliance Center (Section 7) */}
        <div className="p-5 rounded-2xl border space-y-4" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" style={{ color: 'var(--anchor-green)' }} />
              <h3 className="font-heading font-bold text-sm sm:text-base">
                Health Data Privacy & HIPAA/GDPR Controls
              </h3>
            </div>
            <button
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              className="text-xs font-bold hover:underline"
              style={{ color: 'var(--anchor-green)' }}
            >
              {showAuditTrail ? 'Hide Audit Log' : 'View Audit Log'}
            </button>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--deep-taupe-muted)' }}>
            All health observations are encrypted. Data minimization is strictly enforced. Role-based security prevents caregivers from accessing raw chats.
          </p>

          {/* Audit Trail List */}
          {showAuditTrail && (
            <div
              className="p-3 rounded-xl border space-y-2 max-h-48 overflow-y-auto text-[11px] font-mono"
              style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
            >
              <div className="font-bold font-sans text-xs mb-1" style={{ color: 'var(--deep-taupe)' }}>
                Cryptographic Access & Compliance Audit Trail
              </div>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded border space-y-0.5"
                  style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}
                >
                  <div className="flex justify-between" style={{ color: 'var(--deep-taupe-muted)' }}>
                    <span className="font-bold" style={{ color: 'var(--anchor-green)' }}>{log.eventType}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="font-sans" style={{ color: 'var(--deep-taupe)' }}>{log.summary}</div>
                  <div className="text-[9px] truncate" style={{ color: 'var(--deep-taupe-muted)' }}>Hash: {log.hash}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onExportAllData}
              className="tap-target w-full sm:flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-black/5"
              style={{ borderColor: 'var(--cloud-border)' }}
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Export Complete Health Data (JSON)</span>
            </button>

            {!deleteConfirm ? (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="tap-target w-full sm:flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-black/5"
                style={{ borderColor: 'var(--cloud-border)', color: 'var(--deep-taupe)' }}
              >
                <Trash2 className="w-4 h-4" style={{ color: 'var(--deep-taupe-muted)' }} />
                <span>Delete All Saved Data</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  setDeleteConfirm(false);
                  onClose();
                }}
                className="tap-target w-full sm:flex-1 py-2 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                style={{ backgroundColor: 'var(--alert-red)' }}
              >
                <span>Confirm Permanent Wipe</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
