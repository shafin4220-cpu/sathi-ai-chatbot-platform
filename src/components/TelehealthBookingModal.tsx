import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  X,
  ShieldCheck,
  Download,
  Video,
  FileText,
} from 'lucide-react';
import { UserProfile, TelehealthBooking } from '../types';

interface TelehealthBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onBookingConfirmed: (booking: TelehealthBooking) => void;
}

export const TelehealthBookingModal: React.FC<TelehealthBookingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onBookingConfirmed,
}) => {
  const isElderly = profile.persona === 'elderly';

  const [providerType, setProviderType] = useState<string>(isElderly ? 'elderly' : 'chronic');
  const [preferredDate, setPreferredDate] = useState<string>('Tomorrow, 10:30 AM');
  const [reason, setReason] = useState<string>(
    isElderly
      ? 'Routine blood pressure review and mobility check'
      : 'Endometriosis / PCOS flare pattern and symptom correlation'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TelehealthBooking | null>(null);

  if (!isOpen) return null;

  const availableSlots = [
    'Tomorrow, 10:30 AM',
    'Tomorrow, 02:15 PM',
    'Thursday, 09:00 AM',
    'Thursday, 03:45 PM',
    'Friday, 11:30 AM',
  ];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/telehealth/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: profile.name,
          preferredDate,
          providerType,
          reason,
          symptomsSummary: `Active conditions: ${profile.conditions.join(', ')}`,
        }),
      });

      const data = await response.json();
      if (data.booking) {
        setConfirmedBooking(data.booking);
        onBookingConfirmed(data.booking);
      }
    } catch (err) {
      console.error('Booking failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadICS = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sathi AI Care Companion//Telehealth Booking//EN
BEGIN:VEVENT
SUMMARY:Telehealth Visit: ${confirmedBooking.providerName}
DESCRIPTION:Confirmation Code: ${confirmedBooking.confirmationCode}\\nReason: ${confirmedBooking.reason}\\nTelehealth Room: ${confirmedBooking.telehealthLink}
LOCATION:${confirmedBooking.telehealthLink}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `telehealth-visit-${confirmedBooking.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="telehealth-booking-modal"
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
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl leading-tight truncate">
                {confirmedBooking ? 'Appointment Confirmed' : 'Book Verified Telehealth Visit'}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                {confirmedBooking
                  ? 'Reserved directly in clinical scheduling system'
                  : 'Direct scheduling desk with licensed clinical specialists'}
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
            aria-label="Close booking modal"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed State */}
        {confirmedBooking ? (
          <div className="space-y-6 animate-fadeIn">
            <div
              className="p-5 rounded-3xl border space-y-3"
              style={{
                backgroundColor: 'var(--soft-mint-soft)',
                borderColor: 'var(--soft-mint)',
              }}
            >
              <div className="flex items-center gap-2 font-heading font-bold text-base" style={{ color: 'var(--soft-mint-text)' }}>
                <CheckCircle2 className="w-5 h-5" />
                <span>Verified Clinical Slot Reserved</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="opacity-70" style={{ color: 'var(--deep-taupe-muted)' }}>Confirmation Code:</span>
                  <div className="font-mono font-bold text-base" style={{ color: 'var(--deep-taupe)' }}>
                    {confirmedBooking.confirmationCode}
                  </div>
                </div>
                <div>
                  <span className="opacity-70" style={{ color: 'var(--deep-taupe-muted)' }}>Scheduled Slot:</span>
                  <div className="font-bold" style={{ color: 'var(--deep-taupe)' }}>
                    {confirmedBooking.dateTime}
                  </div>
                </div>
                <div>
                  <span className="opacity-70" style={{ color: 'var(--deep-taupe-muted)' }}>Provider:</span>
                  <div className="font-bold" style={{ color: 'var(--deep-taupe)' }}>
                    {confirmedBooking.providerName}
                  </div>
                  <div className="text-[11px] opacity-80" style={{ color: 'var(--deep-taupe-muted)' }}>{confirmedBooking.providerTitle}</div>
                </div>
                <div>
                  <span className="opacity-70" style={{ color: 'var(--deep-taupe-muted)' }}>Status:</span>
                  <div className="font-bold" style={{ color: 'var(--anchor-green)' }}>CONFIRMED (EHR Synced)</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadICS}
                className="tap-target w-full sm:flex-1 py-3 px-4 rounded-xl border text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-2 hover:bg-black/5"
                style={{ borderColor: 'var(--cloud-border)' }}
              >
                <Download className="w-4 h-4" />
                <span>Add to Apple / Google Calendar (.ics)</span>
              </button>

              <a
                href={confirmedBooking.telehealthLink}
                target="_blank"
                rel="noreferrer"
                className="tap-target w-full sm:flex-1 py-3 px-4 rounded-xl text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
                style={{ backgroundColor: 'var(--anchor-green)' }}
              >
                <Video className="w-4 h-4" />
                <span>Test Telehealth Room</span>
              </a>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold hover:underline"
                style={{ color: 'var(--anchor-green)' }}
              >
                Return to Sathi Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label htmlFor="clinician-specialty-select" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                Clinician & Specialty
              </label>
              <select
                id="clinician-specialty-select"
                value={providerType}
                onChange={(e) => setProviderType(e.target.value)}
                className="w-full p-3 rounded-xl border text-sm font-semibold focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)', color: 'var(--deep-taupe)' }}
              >
                <option value="chronic" style={{ backgroundColor: 'var(--cloud-card)', color: 'var(--deep-taupe)' }}>
                  Dr. Aliyah Sen, MD — Endocrine & Chronic Pain Specialist
                </option>
                <option value="elderly" style={{ backgroundColor: 'var(--cloud-card)', color: 'var(--deep-taupe)' }}>
                  Dr. Marcus Reed, MD — Geriatric Medicine & Independence Care
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                Available Verified Telehealth Slots
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = preferredDate === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPreferredDate(slot)}
                      className={`tap-target p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'shadow-xs'
                          : 'hover:bg-black/5'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--soft-mint-soft)' : 'transparent',
                        borderColor: isSelected ? 'var(--anchor-green)' : 'var(--cloud-border)',
                        color: isSelected ? 'var(--soft-mint-text)' : 'var(--deep-taupe)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--anchor-green)' }} />
                        <span>{slot}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--anchor-green)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="consult-reason-input" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                Clinical Reason for Visit
              </label>
              <textarea
                id="consult-reason-input"
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 rounded-xl border text-sm font-medium focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
            </div>

            <div
              className="p-3.5 rounded-2xl border text-xs flex items-start gap-2.5"
              style={{
                backgroundColor: 'var(--cloud-subtle)',
                borderColor: 'var(--cloud-border)',
                color: 'var(--deep-taupe-muted)',
              }}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Automatic Pattern Handoff:</strong> When confirmed, Sathi compiles your recent 7-day pain logs, sleep correlation, and medication records into a confidential packet for the clinician.
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
                id="confirm-telehealth-btn"
                disabled={isSubmitting}
                className="tap-target-senior px-6 py-3 rounded-2xl text-white font-heading font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-transform hover:scale-105 disabled:opacity-50"
                style={{ backgroundColor: 'var(--anchor-green)' }}
              >
                {isSubmitting ? (
                  <span>Reserving Slot in EHR...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Live Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
