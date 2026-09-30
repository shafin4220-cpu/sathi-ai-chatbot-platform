import React, { useState } from 'react';
import {
  Heart,
  User,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { UserProfile, PersonaType } from '../types';
import { CHRONIC_PROFILE, ELDERLY_PROFILE } from '../services/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('chronic');
  const [name, setName] = useState('Maya');
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [caregiverNotifyMeds, setCaregiverNotifyMeds] = useState(true);
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [voiceAssisted, setVoiceAssisted] = useState(false);

  if (!isOpen) return null;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && voiceAssisted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
      speakText('Step 2 of 3: You can link a trusted family member or caregiver. They only see adherence summaries, never private conversations.');
    } else if (step === 2) {
      setStep(3);
      speakText('Step 3 of 3: Plain language privacy consent. Your data is encrypted and never sold.');
    } else if (step === 3) {
      const base = selectedPersona === 'elderly' ? ELDERLY_PROFILE : CHRONIC_PROFILE;
      const completedProfile: UserProfile = {
        ...base,
        name: name.trim() || base.name,
        persona: selectedPersona,
        simplifiedMode: selectedPersona === 'elderly',
        fontScale: selectedPersona === 'elderly' ? 125 : 100,
        caregiver: {
          ...base.caregiver,
          name: caregiverName.trim() || base.caregiver.name,
          phone: caregiverPhone.trim() || base.caregiver.phone,
          notifyOnMeds: caregiverNotifyMeds,
          summaryOnly: true, // STRICT REGULATORY AND ARCHITECTURAL RULE
        },
        plainLanguageConsentAccepted: true,
        onboardingCompleted: true,
      };
      onComplete(completedProfile);
    }
  };

  return (
    <div
      id="onboarding-overlay-modal"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 bg-black/65 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        className="w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all relative my-auto ring-1 ring-black/5"
        style={{
          backgroundColor: 'var(--cloud-card)',
          borderColor: 'var(--cloud-border)',
          color: 'var(--deep-taupe)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Step Indicator & Voice Guide Option */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: 'var(--anchor-green)' }}
            >
              {step}/3
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--deep-taupe-muted)' }}>
              {step === 1 ? 'Select Your Companion Mode' : step === 2 ? 'Optional Caregiver Link' : 'Plain-Language Consent'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !voiceAssisted;
              setVoiceAssisted(next);
              if (next) speakText('Voice guide activated. Sathi will read key setup steps aloud.');
            }}
            className={`tap-target px-3 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              voiceAssisted ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-transparent border-stone-200'
            }`}
            title="Toggle Voice Guidance"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{voiceAssisted ? 'Voice Guide On' : 'Listen Aloud'}</span>
          </button>
        </div>

        {/* STEP 1: Persona Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 id="onboarding-title" className="text-2xl sm:text-3xl font-heading font-extrabold mb-2" style={{ color: 'var(--deep-taupe)' }}>
                Welcome to Sathi ("সাথী")
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--deep-taupe-muted)' }}>
                A respectful, regulation-aware companion that truly remembers your health journey. Please choose who this companion is tailored for:
              </p>
            </div>

            <div className="space-y-4">
              <label
                onClick={() => {
                  setSelectedPersona('chronic');
                  setName('Maya');
                }}
                className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPersona === 'chronic'
                    ? 'shadow-xs'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: selectedPersona === 'chronic' ? 'var(--soft-mint-soft)' : 'var(--cloud-subtle)',
                  borderColor: selectedPersona === 'chronic' ? 'var(--anchor-green)' : 'var(--cloud-border)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: 'var(--anchor-green)' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-base sm:text-lg">Managing Chronic Condition</span>
                      {selectedPersona === 'chronic' && <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--anchor-green)' }} />}
                    </div>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                      For PCOS, endometriosis, fibromyalgia, long COVID, or autoimmune pain. Effortless daily symptom logging, cycle tracking, and auto-generated doctor reports.
                    </p>
                  </div>
                </div>
              </label>

              <label
                onClick={() => {
                  setSelectedPersona('elderly');
                  setName('Robert');
                }}
                className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPersona === 'elderly'
                    ? 'shadow-xs'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: selectedPersona === 'elderly' ? 'var(--bloom-coral-soft)' : 'var(--cloud-subtle)',
                  borderColor: selectedPersona === 'elderly' ? 'var(--bloom-coral)' : 'var(--cloud-border)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-white"
                    style={{ backgroundColor: 'var(--bloom-coral)' }}
                  >
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-base sm:text-lg">Senior Living Independently</span>
                      {selectedPersona === 'elderly' && <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--terracotta)' }} />}
                    </div>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                      Warm, unhurried daily check-ins, medication pill reminders with family confirmation, simplified large-text mode, and direct one-tap emergency safety.
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label htmlFor="preferred-name-input" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                What would you like Sathi to call you?
              </label>
              <input
                id="preferred-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                className="w-full px-4 py-3 rounded-xl border text-base font-semibold focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Caregiver Link */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold mb-2" style={{ color: 'var(--deep-taupe)' }}>
                Optional Caregiver Link
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--deep-taupe-muted)' }}>
                Keep your family or care partner reassured without invasive surveillance.
              </p>
            </div>

            <div
              className="p-4 rounded-2xl border flex items-start gap-3"
              style={{ backgroundColor: 'var(--soft-mint-soft)', borderColor: 'var(--soft-mint)' }}
            >
              <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm" style={{ color: 'var(--deep-taupe)' }}>
                <strong>Strict Privacy Guarantee:</strong> Linked caregivers can ONLY see summary check-ins and medication adherence. Your private conversations with Sathi remain completely confidential.
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="caregiver-name-input" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                  Caregiver or Family Member Name
                </label>
                <input
                  id="caregiver-name-input"
                  type="text"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder={selectedPersona === 'elderly' ? 'e.g. Sarah Miller (Daughter)' : 'e.g. David Chen (Partner)'}
                  className="w-full px-4 py-3 rounded-xl border text-sm sm:text-base focus:outline-none"
                  style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
                />
              </div>

              <div>
                <label htmlFor="caregiver-phone-input" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                  Mobile Phone for Adherence SMS Updates
                </label>
                <input
                  id="caregiver-phone-input"
                  type="tel"
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl border text-sm sm:text-base focus:outline-none"
                  style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={caregiverNotifyMeds}
                  onChange={(e) => setCaregiverNotifyMeds(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--deep-taupe)' }}>
                  Send reassuring SMS when daily medication is marked taken
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Plain-Language Consent */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold mb-2" style={{ color: 'var(--deep-taupe)' }}>
                Plain-Language Consent
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--deep-taupe-muted)' }}>
                We believe in total transparency. Here is exactly how your health data is handled:
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm" style={{ color: 'var(--deep-taupe)' }}>
              <div className="p-3.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>What we collect:</strong> Only the symptoms, mood ratings, and medications you choose to log, plus your conversation history to provide contextual care.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Who sees it:</strong> You and any physician you hand your exported report to. We never sell your health data to advertisers or third parties.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Your right to delete:</strong> You can export or permanently delete your complete health history at any time with a single tap in Settings.
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border text-xs"
                style={{
                  backgroundColor: 'var(--bloom-coral-soft)',
                  borderColor: 'var(--bloom-coral)',
                  color: 'var(--terracotta-text)',
                }}
              >
                <strong>Medical Notice:</strong> Sathi is an AI care companion designed to support tracking and comfort. Sathi is not a doctor and does not diagnose conditions or prescribe medications. In an acute emergency, always dial 911 or visit an urgent care center.
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs sm:text-sm font-bold" style={{ color: 'var(--deep-taupe)' }}>
                I understand and agree to these health data protections.
              </span>
            </label>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between gap-3 mt-8 pt-4 border-t" style={{ borderColor: 'var(--cloud-border)' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="tap-target px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors hover:bg-black/5"
              style={{ borderColor: 'var(--cloud-border)', color: 'var(--deep-taupe)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            id="onboarding-next-btn"
            disabled={step === 3 && !consentAcknowledged}
            onClick={handleNextStep}
            className="tap-target-senior px-6 py-3 rounded-2xl text-white font-heading font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
            style={{ backgroundColor: 'var(--anchor-green)' }}
          >
            <span>{step === 3 ? 'Start With Sathi' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
