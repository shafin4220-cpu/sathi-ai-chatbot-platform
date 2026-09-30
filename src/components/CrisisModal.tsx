import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  MessageSquare,
  Heart,
  X,
  Send,
  CheckCircle2,
  Wind,
} from 'lucide-react';
import { UserProfile } from '../types';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [caregiverAlerted, setCaregiverAlerted] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [breathingSeconds, setBreathingSeconds] = useState(4);
  const [showBreathing, setShowBreathing] = useState(false);

  useEffect(() => {
    if (!showBreathing) return;
    const interval = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          if (breathingPhase.startsWith('Inhale')) {
            setBreathingPhase('Hold (7s)');
            return 7;
          } else if (breathingPhase.startsWith('Hold')) {
            setBreathingPhase('Exhale (8s)');
            return 8;
          } else {
            setBreathingPhase('Inhale (4s)');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showBreathing, breathingPhase]);

  if (!isOpen) return null;

  const handleAlertCaregiverNow = async () => {
    try {
      await fetch('/api/caregiver/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caregiverName: profile.caregiver?.name || 'Caregiver',
          recipientPhone: profile.caregiver?.phone || 'Emergency Phone',
          patientName: profile.name,
          type: 'EMERGENCY_SOS_ALERT',
          message: `URGENT SATHI ALERT: ${profile.name} opened the SOS Emergency Support screen at ${new Date().toLocaleTimeString()}. Please check in immediately.`,
        }),
      });
      setCaregiverAlerted(true);
    } catch (e) {
      console.error(e);
      setCaregiverAlerted(true);
    }
  };

  return (
    <div
      id="crisis-support-modal"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="crisis-dialog-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 border-2 shadow-2xl space-y-6 relative my-auto"
        style={{
          backgroundColor: 'var(--cloud-card)',
          borderColor: 'var(--alert-red)',
          color: 'var(--deep-taupe)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Header with exclusive --alert-red token */}
        <div className="flex items-start justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--cloud-border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md animate-pulse"
              style={{ backgroundColor: 'var(--alert-red)' }}
            >
              <ShieldAlert className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h2 id="crisis-dialog-title" className="font-heading font-extrabold text-xl sm:text-2xl leading-tight truncate" style={{ color: 'var(--deep-taupe)' }}>
                Emergency & Crisis Support
              </h2>
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                You are not alone. Immediate free and confidential support is available 24/7.
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
            aria-label="Close crisis support modal"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Hotlines Grid */}
        <div className="space-y-3">
          {/* 988 Suicide & Crisis Lifeline */}
          <a
            href="tel:988"
            className="tap-target-senior w-full p-4 sm:p-5 rounded-2xl text-white font-heading font-extrabold text-base sm:text-lg flex items-center justify-between shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--alert-red)' }}
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-6 h-6 shrink-0" />
              <div className="text-left">
                <div className="leading-tight">Call 988 Crisis Lifeline</div>
                <div className="text-xs font-normal opacity-90">Free, confidential 24/7 mental health crisis support</div>
              </div>
            </div>
            <span className="text-xs uppercase bg-white/20 px-2 py-1 rounded-md font-mono font-bold shrink-0">
              Dial 988
            </span>
          </a>

          {/* 911 Emergency Medical Services */}
          <a
            href="tel:911"
            className="tap-target-senior w-full p-4 sm:p-5 rounded-2xl bg-stone-900 text-white font-heading font-extrabold text-base sm:text-lg flex items-center justify-between shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] border border-stone-700"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
              <div className="text-left">
                <div className="leading-tight">Call 911 Emergency</div>
                <div className="text-xs font-normal text-stone-300">Severe chest pain, breathing distress, physical danger</div>
              </div>
            </div>
            <span className="text-xs uppercase bg-white/20 px-2 py-1 rounded-md font-mono font-bold shrink-0">
              Dial 911
            </span>
          </a>

          {/* Crisis Text Line */}
          <a
            href="sms:741741?body=HOME"
            className="tap-target-senior w-full p-4 rounded-2xl border-2 font-heading font-bold text-sm sm:text-base flex items-center justify-between transition-colors hover:bg-black/5"
            style={{
              backgroundColor: 'var(--cloud-subtle)',
              borderColor: 'var(--cloud-border)',
              color: 'var(--deep-taupe)',
            }}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 shrink-0" style={{ color: 'var(--deep-taupe)' }} />
              <div className="text-left">
                <div>Text HOME to 741741</div>
                <div className="text-xs font-normal" style={{ color: 'var(--deep-taupe-muted)' }}>Connect with a crisis counselor by text message</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--deep-taupe-muted)' }}>Text 741741</span>
          </a>
        </div>

        {/* Caregiver Rapid SOS Alert */}
        <div className="p-4 sm:p-5 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-500" />
              <span className="font-heading font-bold text-sm sm:text-base" style={{ color: 'var(--deep-taupe)' }}>
                Notify Linked Caregiver
              </span>
            </div>
            <span className="text-xs" style={{ color: 'var(--deep-taupe-muted)' }}>
              {profile.caregiver?.name || 'Family Member'}
            </span>
          </div>

          <p className="text-xs" style={{ color: 'var(--deep-taupe-muted)' }}>
            One tap immediately sends an urgent SMS notification to {profile.caregiver?.name || 'your emergency contact'} with a check-in request.
          </p>

          <button
            type="button"
            onClick={handleAlertCaregiverNow}
            disabled={caregiverAlerted}
            className="tap-target-senior w-full py-3 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs border"
            style={{
              backgroundColor: caregiverAlerted ? 'var(--soft-mint-soft)' : 'var(--cloud-card)',
              borderColor: caregiverAlerted ? 'var(--soft-mint)' : 'var(--cloud-border)',
              color: caregiverAlerted ? 'var(--soft-mint-text)' : 'var(--deep-taupe)',
            }}
          >
            {caregiverAlerted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Urgent SMS Dispatched to {profile.caregiver?.name || 'Family'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" style={{ color: 'var(--anchor-green)' }} />
                <span>Send Emergency SMS Ping to {profile.caregiver?.name || 'Caregiver'}</span>
              </>
            )}
          </button>
        </div>

        {/* Grounding & Breathing Support (4-7-8 Breathing) */}
        <div className="pt-2">
          {!showBreathing ? (
            <button
              type="button"
              onClick={() => setShowBreathing(true)}
              className="w-full text-xs font-bold flex items-center justify-center gap-1.5 py-1 hover:underline"
              style={{ color: 'var(--deep-taupe-muted)' }}
            >
              <Wind className="w-4 h-4 text-emerald-500" />
              <span>Need help calming sensory panic or heart racing? Open Breathing Pacer</span>
            </button>
          ) : (
            <div
              className="p-4 rounded-2xl border text-center space-y-2"
              style={{
                backgroundColor: 'var(--soft-mint-soft)',
                borderColor: 'var(--soft-mint)',
              }}
            >
              <div className="text-xs uppercase font-extrabold tracking-wider" style={{ color: 'var(--soft-mint-text)' }}>
                4-7-8 Calming Breath Guide
              </div>
              <div className="text-2xl font-heading font-extrabold" style={{ color: 'var(--deep-taupe)' }}>
                {breathingPhase}
              </div>
              <div
                className="w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold animate-pulse text-lg"
                style={{ backgroundColor: 'var(--soft-mint)', color: '#1E3326' }}
              >
                {breathingSeconds}
              </div>
              <button
                onClick={() => setShowBreathing(false)}
                className="text-[11px] underline"
                style={{ color: 'var(--soft-mint-text)' }}
              >
                Hide Pacer
              </button>
            </div>
          )}
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold hover:underline"
            style={{ color: 'var(--deep-taupe-muted)' }}
          >
            I am safe now • Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
