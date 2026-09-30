import React, { useState } from 'react';
import {
  User,
  Shield,
  Heart,
  Pill,
  Lock,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSwitchPersona: (persona: 'chronic' | 'elderly') => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onSwitchPersona,
}) => {
  const [name, setName] = useState(profile.name);
  const [primaryDoctor, setPrimaryDoctor] = useState(profile.primaryDoctor || '');
  const [caregiverName, setCaregiverName] = useState(profile.caregiver?.name || '');
  const [caregiverPhone, setCaregiverPhone] = useState(profile.caregiver?.phone || '');
  const [caregiverRelation, setCaregiverRelation] = useState(profile.caregiver?.relationship || '');
  const [pinCode, setPinCode] = useState(profile.pinCode || '1234');
  const [conditions, setConditions] = useState<string[]>(profile.conditions);
  const [newCondition, setNewCondition] = useState('');
  const [medications, setMedications] = useState<string[]>(profile.medications);
  const [newMedication, setNewMedication] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddCondition = () => {
    if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleAddMed = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const handleRemoveMed = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      primaryDoctor,
      pinCode,
      conditions,
      medications,
      caregiver: {
        name: caregiverName,
        phone: caregiverPhone,
        relationship: caregiverRelation,
        notifyOnMeds: profile.caregiver?.notifyOnMeds ?? true,
        notifyOnCheckin: profile.caregiver?.notifyOnCheckin ?? true,
        summaryOnly: true,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="profile-security-modal"
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
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl leading-tight truncate">
                Patient Clinical Profile & Security
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                Your baseline medical details that inform Sathi's clinical recommendations.
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
            aria-label="Close profile modal"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Switcher for Evaluation/Demonstration */}
        <div className="p-3.5 rounded-2xl border flex items-center justify-between gap-3" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
          <div className="text-xs">
            <div className="font-bold">Test Archetype / Target Persona:</div>
            <div style={{ color: 'var(--deep-taupe-muted)' }}>Instant toggle between both required user segments</div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSwitchPersona('chronic')}
              className={`tap-target px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                profile.persona === 'chronic' ? 'shadow-xs' : 'border hover:bg-black/5'
              }`}
              style={{
                backgroundColor: profile.persona === 'chronic' ? 'var(--anchor-green)' : 'transparent',
                borderColor: profile.persona === 'chronic' ? 'var(--anchor-green)' : 'var(--cloud-border)',
                color: profile.persona === 'chronic' ? '#FFFFFF' : 'var(--deep-taupe)',
              }}
            >
              Chronic Patient
            </button>
            <button
              type="button"
              onClick={() => onSwitchPersona('elderly')}
              className={`tap-target px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                profile.persona === 'elderly' ? 'shadow-xs' : 'border hover:bg-black/5'
              }`}
              style={{
                backgroundColor: profile.persona === 'elderly' ? 'var(--anchor-green)' : 'transparent',
                borderColor: profile.persona === 'elderly' ? 'var(--anchor-green)' : 'var(--cloud-border)',
                color: profile.persona === 'elderly' ? '#FFFFFF' : 'var(--deep-taupe)',
              }}
            >
              Elderly Living Alone
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patient-name-input" className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                Patient Preferred Name
              </label>
              <input
                id="patient-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
            </div>

            <div>
              <label htmlFor="primary-doctor-input" className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                Primary Attending Physician
              </label>
              <input
                id="primary-doctor-input"
                type="text"
                value={primaryDoctor}
                onChange={(e) => setPrimaryDoctor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
            </div>
          </div>

          {/* Chronic Diagnoses */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
              Active Tracked Conditions / Diagnoses
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {conditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}
                >
                  <span>{cond}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(idx)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add condition (e.g. Fibromyalgia)"
                className="flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
              <button
                type="button"
                onClick={handleAddCondition}
                className="px-3 py-1.5 rounded-xl text-white text-xs font-bold"
                style={{ backgroundColor: 'var(--anchor-green)' }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Daily Medications */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
              Prescribed Medications
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {medications.map((med, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}
                >
                  <span>{med}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMed(idx)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Add medication (e.g. Lisinopril 10mg)"
                className="flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
              <button
                type="button"
                onClick={handleAddMed}
                className="px-3 py-1.5 rounded-xl text-white text-xs font-bold"
                style={{ backgroundColor: 'var(--anchor-green)' }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Caregiver Contact & PIN */}
          <div className="p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
            <div className="font-heading font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--deep-taupe)' }}>
              Emergency Caregiver & Portal Access
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                placeholder="Caregiver Name"
                className="px-3 py-2 rounded-xl border text-xs font-semibold"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
              <input
                type="text"
                value={caregiverRelation}
                onChange={(e) => setCaregiverRelation(e.target.value)}
                placeholder="Relationship (e.g. Daughter)"
                className="px-3 py-2 rounded-xl border text-xs font-semibold"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
              <input
                type="tel"
                value={caregiverPhone}
                onChange={(e) => setCaregiverPhone(e.target.value)}
                placeholder="Caregiver Phone (SMS)"
                className="px-3 py-2 rounded-xl border text-xs font-semibold"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
            </div>

            <div>
              <label htmlFor="portal-pin-input" className="block text-[11px] font-bold text-stone-600 mb-1">
                Caregiver Portal Access PIN (4 digits)
              </label>
              <input
                id="portal-pin-input"
                type="password"
                maxLength={4}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-32 px-3 py-1.5 rounded-xl border text-sm font-mono font-bold text-center"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="tap-target px-4 py-2.5 rounded-xl border text-xs font-bold"
              style={{ borderColor: 'var(--cloud-border)' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="tap-target px-6 py-2.5 rounded-xl text-white font-heading font-extrabold text-sm flex items-center gap-2 shadow-xs"
              style={{ backgroundColor: 'var(--anchor-green)' }}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Clinical Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
