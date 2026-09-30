import React, { useState, useEffect } from 'react';
import {
  loadProfile,
  saveProfile,
  loadReminders,
  saveReminders,
  loadSymptomLogs,
  saveSymptomLogs,
  loadChatMessages,
  saveChatMessages,
  exportAllHealthData,
  clearAllHealthData,
  SEED_CHRONIC_PROFILE,
  SEED_ELDERLY_PROFILE,
  SEED_CHRONIC_REMINDERS,
  SEED_ELDERLY_REMINDERS,
  SEED_CHRONIC_LOGS,
  SEED_ELDERLY_LOGS,
} from './services/storage';
import {
  UserProfile,
  Reminder,
  SymptomLog,
  ChatMessage,
  TelehealthBooking,
} from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { DailyCheckin } from './components/DailyCheckin';
import { CompanionChat } from './components/CompanionChat';
import { SymptomTracker } from './components/SymptomTracker';
import { RemindersManager } from './components/RemindersManager';
import { TelehealthBookingModal } from './components/TelehealthBookingModal';
import { CrisisModal } from './components/CrisisModal';
import { CaregiverPortal } from './components/CaregiverPortal';
import { DoctorVisitReport } from './components/DoctorVisitReport';
import { CommunityResources } from './components/CommunityResources';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // State Initialization
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [reminders, setReminders] = useState<Reminder[]>(() => loadReminders());
  const [logs, setLogs] = useState<SymptomLog[]>(() => loadSymptomLogs());
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatMessages());

  // Navigation and Modal Visibility
  const [activeTab, setActiveTab] = useState<
    'home' | 'chat' | 'tracker' | 'reminders' | 'community' | 'report' | 'caregiver'
  >('home');

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveProfile(profile);
    // Apply font scale
    document.documentElement.style.setProperty(
      '--app-font-scale',
      `${18 * (profile.fontScale / 100)}px`
    );
    // Apply theme
    if (profile.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }, [profile]);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    saveSymptomLogs(logs);
  }, [logs]);

  useEffect(() => {
    saveChatMessages(messages);
  }, [messages]);

  // Persona Switch Handler
  const handleSwitchPersona = (persona: 'chronic' | 'elderly') => {
    if (persona === 'chronic') {
      setProfile(SEED_CHRONIC_PROFILE);
      setReminders(SEED_CHRONIC_REMINDERS);
      setLogs(SEED_CHRONIC_LOGS);
      setMessages([
        {
          id: 'seed-chat-c1',
          role: 'assistant',
          content:
            "Hello Maya. I'm Sathi, your care companion. I see you're currently in your luteal phase and logged mild pelvic cramping yesterday. How is your energy feeling right now?",
          timestamp: new Date().toISOString(),
          suggestedAction: {
            title: 'Log Today’s Symptom & Pain Level',
            type: 'log_symptom',
          },
        },
      ]);
    } else {
      setProfile(SEED_ELDERLY_PROFILE);
      setReminders(SEED_ELDERLY_REMINDERS);
      setLogs(SEED_ELDERLY_LOGS);
      setMessages([
        {
          id: 'seed-chat-e1',
          role: 'assistant',
          content:
            "Good morning, Ramesh-da. I am Sathi, your companion. The morning sun is up. Have you had your glass of warm water and your morning blood pressure pill yet?",
          timestamp: new Date().toISOString(),
          suggestedAction: {
            title: 'Confirm Morning Lisinopril Taken',
            type: 'confirm_med',
          },
        },
      ]);
    }
    setActiveTab('home');
  };

  // Chat message sending to full-stack Express /api/chat
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userProfile: profile,
          conversationHistory: updatedMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          recentSymptomLogs: logs.slice(-3),
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I am right here with you. Let's record how you're feeling.",
        timestamp: new Date().toISOString(),
        isCrisis: data.isCrisis,
        suggestedAction: data.suggestedAction,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If crisis was detected by backend protocol, automatically open SOS support modal
      if (data.isCrisis) {
        setIsCrisisOpen(true);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `asst-fb-${Date.now()}`,
        role: 'assistant',
        content:
          "I am listening. I am logged into your care profile. Let's make sure we log this pattern for your doctor, and if you ever feel unsafe or overwhelmed, tap the red SOS button immediately.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  // Reminder toggle
  const handleToggleReminder = async (id: string) => {
    const target = reminders.find((r) => r.id === id);
    if (!target) return;

    const nextStatus = target.status === 'taken' ? 'pending' : 'taken';
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );

    // If marked taken and caregiver copy enabled, dispatch SMS notification
    if (nextStatus === 'taken' && target.notifyCaregiver && profile.caregiver?.phone) {
      try {
        await fetch('/api/caregiver/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caregiverName: profile.caregiver.name,
            recipientPhone: profile.caregiver.phone,
            patientName: profile.name,
            type: 'MEDICATION_ADHERENCE',
            message: `${profile.name} confirmed taking: "${target.title}" at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
          }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Add reminder
  const handleAddReminder = (newRem: Omit<Reminder, 'id'>) => {
    const item: Reminder = {
      ...newRem,
      id: `rem-${Date.now()}`,
    };
    setReminders((prev) => [item, ...prev]);
  };

  // Delete reminder
  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Add symptom log
  const handleAddLog = (newLog: Omit<SymptomLog, 'id' | 'timestamp' | 'dateStr'>) => {
    const now = new Date();
    const item: SymptomLog = {
      ...newLog,
      id: `log-${Date.now()}`,
      timestamp: now.toISOString(),
      dateStr: now.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    };

    setLogs((prev) => [...prev, item]);
  };

  // Telehealth Booking Confirmed Handler
  const handleBookingConfirmed = (booking: TelehealthBooking) => {
    // Add to reminders as an upcoming appointment
    const newAppointment: Reminder = {
      id: `rem-appt-${Date.now()}`,
      title: `Telehealth: ${booking.providerName}`,
      type: 'appointment',
      time: booking.dateTime,
      frequency: 'Once',
      status: 'pending',
      notifyCaregiver: true,
      provider: `${booking.providerName} (${booking.providerTitle})`,
    };
    setReminders((prev) => [newAppointment, ...prev]);
  };

  // Trigger Action from Chat Suggested Action
  const handleTriggerAction = (actionType: string, actionData?: any) => {
    if (actionType === 'confirm_med') {
      const firstPending = reminders.find((r) => r.type === 'medication' && r.status === 'pending');
      if (firstPending) {
        handleToggleReminder(firstPending.id);
      }
    } else if (actionType === 'caregiver_note') {
      setActiveTab('caregiver');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950"
      style={{
        backgroundColor: 'var(--cloud-base)',
        color: 'var(--deep-taupe)',
        fontSize: 'var(--app-font-scale)',
      }}
    >
      {/* Header with Persistent SOS Button */}
      <Header
        profile={profile}
        activeTab={activeTab}
        onUpdateProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
        onNavigate={(screen) => setActiveTab(screen as any)}
        onOpenSOS={() => setIsCrisisOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCaregiverPortal={() => setActiveTab('caregiver')}
        onSwitchPersona={handleSwitchPersona}
      />

      {/* Main Content View Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-12">
        {activeTab === 'home' && (
          <DailyCheckin
            profile={profile}
            reminders={reminders}
            logs={logs}
            onToggleReminder={handleToggleReminder}
            onOpenTracker={() => setActiveTab('tracker')}
            onOpenChat={() => setActiveTab('chat')}
            onOpenBooking={() => setIsBookingOpen(true)}
            onOpenDoctorReport={() => setActiveTab('report')}
            onOpenSOS={() => setIsCrisisOpen(true)}
          />
        )}

        {activeTab === 'chat' && (
          <CompanionChat
            profile={profile}
            messages={messages}
            onSendMessage={handleSendMessage}
            onTriggerAction={handleTriggerAction}
            onOpenBooking={() => setIsBookingOpen(true)}
            onOpenTracker={() => setActiveTab('tracker')}
            onOpenDoctorReport={() => setActiveTab('report')}
            onOpenSOS={() => setIsCrisisOpen(true)}
            recentLogs={logs}
          />
        )}

        {activeTab === 'tracker' && (
          <SymptomTracker
            profile={profile}
            logs={logs}
            onAddLog={handleAddLog}
            onOpenDoctorReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersManager
            profile={profile}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        )}

        {activeTab === 'report' && (
          <DoctorVisitReport
            profile={profile}
            logs={logs}
            reminders={reminders}
            onOpenTracker={() => setActiveTab('tracker')}
          />
        )}

        {activeTab === 'community' && (
          <CommunityResources simplifiedMode={profile.simplifiedMode} />
        )}

        {activeTab === 'caregiver' && (
          <CaregiverPortal
            profile={profile}
            reminders={reminders}
            logs={logs}
            onReturnToPatient={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation (Mobile + Desktop) */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (
            tab === 'chat' ||
            tab === 'tracker' ||
            tab === 'reminders' ||
            tab === 'community' ||
            tab === 'home' ||
            tab === 'report' ||
            tab === 'caregiver'
          ) {
            setActiveTab(tab);
          }
        }}
        onOpenSOS={() => setIsCrisisOpen(true)}
        simplifiedMode={profile.simplifiedMode}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(newProfile) => {
          setProfile(newProfile);
          setIsOnboardingOpen(false);
        }}
      />

      {/* Crisis SOS Modal */}
      <CrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
        profile={profile}
      />

      {/* Live Telehealth Booking Modal */}
      <TelehealthBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        profile={profile}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* Accessibility & Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
        onExportAllData={exportAllHealthData}
        onResetAllData={() => {
          clearAllHealthData();
          handleSwitchPersona(profile.persona);
        }}
      />

      {/* Patient Profile & Security Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
        onSwitchPersona={handleSwitchPersona}
      />
    </div>
  );
}
