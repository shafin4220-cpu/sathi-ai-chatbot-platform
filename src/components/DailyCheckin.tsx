import React, { useState } from 'react';
import {
  Heart,
  Smile,
  Meh,
  Frown,
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  Calendar,
  ArrowRight,
  Send,
  BellRing,
  Pill,
  Coffee,
  Check,
  MessageCircleHeart,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, SymptomLog, Reminder } from '../types';

interface DailyCheckinProps {
  profile: UserProfile;
  reminders: Reminder[];
  logs?: SymptomLog[];
  onToggleReminder: (id: string) => void;
  onQuickLogMood?: (mood: SymptomLog['mood'], painLevel: number) => void;
  onNavigate?: (screen: string) => void;
  onOpenBooking?: () => void;
  onOpenTracker?: () => void;
  onOpenChat?: () => void;
  onOpenDoctorReport?: () => void;
  onOpenSOS?: () => void;
  todayLog?: SymptomLog;
}

export const DailyCheckin: React.FC<DailyCheckinProps> = ({
  profile,
  reminders,
  logs,
  onToggleReminder,
  onQuickLogMood,
  onNavigate,
  onOpenBooking,
  onOpenTracker,
  onOpenChat,
  onOpenDoctorReport,
  onOpenSOS,
  todayLog,
}) => {
  const isElderly = profile.persona === 'elderly';
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const navigateTo = (screen: string) => {
    if (screen === 'tracker' && onOpenTracker) onOpenTracker();
    else if (screen === 'chat' && onOpenChat) onOpenChat();
    else if ((screen === 'doctor_report' || screen === 'report') && onOpenDoctorReport) onOpenDoctorReport();
    else if (onNavigate) onNavigate(screen);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    if (isElderly) {
      return `${timeOfDay}, ${profile.name}. It is wonderful to spend today with you.`;
    }
    return `${timeOfDay}, ${profile.name}. How is your body feeling right now?`;
  };

  const getSubtitle = () => {
    if (isElderly) {
      return 'Take things at your own gentle pace. Sathi is right here by your side.';
    }
    return 'Your daily symptoms are tracked automatically for your upcoming doctor report.';
  };

  const moodOptions: Array<{
    id: SymptomLog['mood'];
    label: string;
    sublabel: string;
    icon: any;
    painEst: number;
    color: string;
  }> = [
    {
      id: 'good',
      label: 'Feeling Well',
      sublabel: 'Low or no pain',
      icon: Smile,
      painEst: 1,
      color: 'var(--anchor-green)',
    },
    {
      id: 'steady',
      label: 'Steady & Managing',
      sublabel: 'Mild background ache',
      icon: Meh,
      painEst: 3,
      color: 'var(--soft-mint)',
    },
    {
      id: 'tired',
      label: 'Low Energy / Fog',
      sublabel: 'Need rest & pacing',
      icon: Frown,
      painEst: 5,
      color: 'var(--bloom-coral)',
    },
    {
      id: 'flare',
      label: 'Active Flare / Pain',
      sublabel: 'Severe symptoms',
      icon: Flame,
      painEst: 7,
      color: 'var(--terracotta)', // Theme-aware terracotta, NOT alert-red
    },
  ];

  const handleMoodSelect = (mood: SymptomLog['mood'], painEst: number) => {
    if (onQuickLogMood) {
      onQuickLogMood(mood, painEst);
    } else if (onOpenTracker) {
      onOpenTracker();
    }
    if (profile.caregiver?.notifyOnCheckin && profile.caregiver.phone) {
      triggerCaregiverSMS(`Daily check-in completed: ${profile.name} reported feeling "${mood}".`);
    }
  };

  const triggerCaregiverSMS = async (message: string) => {
    try {
      await fetch('/api/caregiver/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caregiverName: profile.caregiver.name,
          recipientPhone: profile.caregiver.phone,
          patientName: profile.name,
          type: 'DAILY_CHECKIN',
          message,
        }),
      });
      setNotificationToast(`Reassurance SMS sent to ${profile.caregiver.name || 'caregiver'}`);
      setTimeout(() => setNotificationToast(null), 4000);
    } catch (e) {
      console.error('Caregiver notification failed', e);
    }
  };

  const todayReminders = reminders.slice(0, 3);
  const pendingMeds = reminders.filter((r) => r.type === 'medication' && r.status === 'pending');

  return (
    <div id="screen-daily-checkin" className="space-y-6 sm:space-y-8 animate-fadeIn max-w-2xl mx-auto pb-12">
      {/* Toast Confirmation */}
      {notificationToast && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-md animate-bounce"
          style={{
            backgroundColor: 'var(--soft-mint-soft)',
            borderColor: 'var(--soft-mint)',
            color: 'var(--deep-taupe)',
          }}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{notificationToast}</span>
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="text-xs font-bold underline opacity-75 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Warm Greeting Card — Never a wall of widgets */}
      <section
        className="p-6 sm:p-8 rounded-3xl border shadow-xs relative overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--cloud-card)',
          borderColor: 'var(--cloud-border)',
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--anchor-green-soft)',
                color: 'var(--anchor-green)',
              }}
            >
              Today's Check-in
            </span>
            <span className="text-xs font-medium" style={{ color: 'var(--deep-taupe-muted)' }}>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight leading-tight mb-2"
            style={{ color: 'var(--deep-taupe)' }}
          >
            {getGreeting()}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: 'var(--deep-taupe-muted)' }}>
            {getSubtitle()}
          </p>

          {/* If already checked in today */}
          {todayLog && (
            <div
              className="mt-4 p-3 rounded-2xl border flex items-center justify-between gap-3"
              style={{
                backgroundColor: 'var(--cloud-subtle)',
                borderColor: 'var(--cloud-border)',
              }}
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Today logged as: <strong>{todayLog.mood.toUpperCase()}</strong> (Pain level {todayLog.painLevel}/10)
                </span>
              </div>
              <button
                onClick={() => navigateTo('tracker')}
                className="text-xs font-bold underline text-emerald-800 hover:text-emerald-900"
              >
                View Tracker
              </button>
            </div>
          )}
        </div>
      </section>

      {/* One-Tap Mood & Symptom Quick-Log */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-heading font-bold" style={{ color: 'var(--deep-taupe)' }}>
            How does your body feel right now?
          </h2>
          <span className="text-xs font-medium" style={{ color: 'var(--deep-taupe-muted)' }}>
            One-tap quick log
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {moodOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = todayLog?.mood === opt.id;
            return (
              <button
                key={opt.id}
                id={`mood-btn-${opt.id}`}
                onClick={() => handleMoodSelect(opt.id, opt.painEst)}
                className={`tap-target-senior p-4 sm:p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected ? 'ring-3 shadow-md' : 'shadow-xs hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: 'var(--cloud-card)',
                  borderColor: isSelected ? 'var(--anchor-green)' : 'var(--cloud-border)',
                }}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: opt.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-emerald-700 font-bold" />}
                </div>
                <div>
                  <div className="font-heading font-bold text-sm sm:text-base leading-tight mb-1" style={{ color: 'var(--deep-taupe)' }}>
                    {opt.label}
                  </div>
                  <div className="text-xs leading-snug" style={{ color: 'var(--deep-taupe-muted)' }}>
                    {opt.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Primary Action — Companion Conversation */}
      <section>
        <button
          id="home-chat-cta-btn"
          onClick={() => navigateTo('chat')}
          className="tap-target-senior w-full p-5 sm:p-6 rounded-3xl border flex items-center justify-between gap-4 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] text-left group"
          style={{
            backgroundColor: 'var(--cloud-card)',
            borderColor: 'var(--cloud-border)',
          }}
        >
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-110 transition-transform"
              style={{ backgroundColor: 'var(--anchor-green)' }}
            >
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base sm:text-lg" style={{ color: 'var(--deep-taupe)' }}>
                  Talk with Sathi
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  AI Companion
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                {isElderly
                  ? 'Share a memory, ask about your medicines, or just chat with a warm friend.'
                  : 'Describe your flare pattern, triggers, or discuss notes for Dr. Sen.'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-stone-400 group-hover:text-emerald-700 shrink-0 transition-colors" />
        </button>
      </section>

      {/* Today's Schedule & Medications */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-heading font-bold" style={{ color: 'var(--deep-taupe)' }}>
              Today's Care Schedule
            </h2>
            {pendingMeds.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                {pendingMeds.length} pending
              </span>
            )}
          </div>
          <button
            onClick={() => navigateTo('reminders')}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            View All Schedule
          </button>
        </div>

        <div className="space-y-2.5">
          {todayReminders.map((item) => {
            const isTaken = item.status === 'taken';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isTaken ? 'opacity-80 bg-stone-50/60' : 'bg-white shadow-xs'
                }`}
                style={{
                  backgroundColor: 'var(--cloud-card)',
                  borderColor: 'var(--cloud-border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isTaken ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.type === 'medication' ? <Pill className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm sm:text-base ${isTaken ? 'line-through text-stone-500' : ''}`} style={{ color: 'var(--deep-taupe)' }}>
                        {item.title}
                      </span>
                      {item.dosage && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                          {item.dosage}
                        </span>
                      )}
                    </div>
                    <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                      {item.notifyCaregiver && (
                        <span className="text-[11px] text-emerald-700 font-semibold">• Auto-notifies family</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  id={`reminder-toggle-${item.id}`}
                  onClick={() => onToggleReminder(item.id)}
                  className={`tap-target px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                    isTaken
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isTaken ? 'Taken' : 'Mark Taken'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verified Telehealth / Clinic Action Card (Section 2 Differentiator) */}
      <section
        className="p-5 sm:p-6 rounded-3xl border shadow-xs"
        style={{
          backgroundColor: 'var(--cloud-card)',
          borderColor: 'var(--cloud-border)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block"
              style={{ backgroundColor: 'var(--bloom-coral-soft)', color: 'var(--terracotta-text)' }}
            >
              Real Telehealth & Clinic Booking
            </span>
            <h3 className="font-heading font-extrabold text-base sm:text-lg" style={{ color: 'var(--deep-taupe)' }}>
              Need to see your doctor or specialist?
            </h3>
            <p className="text-xs sm:text-sm max-w-md" style={{ color: 'var(--deep-taupe-muted)' }}>
              Sathi connects directly to your clinic's scheduling desk with verified slots and hands over your exported symptom patterns.
            </p>
          </div>

          <button
            type="button"
            id="home-book-visit-btn"
            onClick={onOpenBooking}
            className="tap-target-senior px-5 py-3 rounded-2xl text-white font-heading font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all hover:scale-105 shrink-0"
            style={{ backgroundColor: 'var(--anchor-green)' }}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Visit Slot</span>
          </button>
        </div>
      </section>
    </div>
  );
};
