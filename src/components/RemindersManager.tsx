import React, { useState } from 'react';
import {
  CalendarCheck,
  Pill,
  Calendar,
  Clock,
  Plus,
  Check,
  Send,
  Bell,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, Reminder } from '../types';

interface RemindersManagerProps {
  profile: UserProfile;
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
  onOpenBooking: () => void;
}

export const RemindersManager: React.FC<RemindersManagerProps> = ({
  profile,
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
  onOpenBooking,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Reminder['type']>('medication');
  const [time, setTime] = useState('09:00 AM');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [notifyCaregiver, setNotifyCaregiver] = useState(profile.caregiver?.notifyOnMeds ?? true);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      title: title.trim(),
      type,
      time,
      dosage: dosage.trim() || undefined,
      frequency,
      status: 'pending',
      notifyCaregiver,
    });

    setTitle('');
    setDosage('');
    setShowAddForm(false);
  };

  const handleNotifyCaregiverDirectly = async (reminder: Reminder) => {
    try {
      const res = await fetch('/api/caregiver/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caregiverName: profile.caregiver?.name || 'Caregiver',
          recipientPhone: profile.caregiver?.phone || 'SMS',
          patientName: profile.name,
          type: 'MEDICATION_ADHERENCE',
          message: `${profile.name} confirmed taking: "${reminder.title}" (${reminder.dosage || 'scheduled dose'}) at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        }),
      });
      const data = await res.json();
      setSmsStatus(`Delivered confirmation SMS to ${profile.caregiver?.name || 'Caregiver'}.`);
      setTimeout(() => setSmsStatus(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const medications = reminders.filter((r) => r.type === 'medication');
  const appointments = reminders.filter((r) => r.type === 'appointment' || r.type === 'checkin');

  return (
    <div id="screen-reminders-manager" className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span
            className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--soft-mint-soft)',
              color: 'var(--soft-mint-text)',
            }}
          >
            Adherence & Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mt-1" style={{ color: 'var(--deep-taupe)' }}>
            Medication & Appointments
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
            Real-time schedule connected to your calendar and caregiver reassurance dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenBooking}
            className="tap-target px-3.5 py-2 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Book Clinic Visit</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="tap-target px-4 py-2 rounded-2xl text-white font-heading font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105"
            style={{ backgroundColor: 'var(--anchor-green)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      {/* SMS Status Banner */}
      {smsStatus && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-md animate-fadeIn"
          style={{
            backgroundColor: 'var(--soft-mint-soft)',
            borderColor: 'var(--soft-mint)',
            color: 'var(--deep-taupe)',
          }}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{smsStatus}</span>
          </div>
          <button
            onClick={() => setSmsStatus(null)}
            className="text-xs font-bold underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Add Reminder Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 animate-fadeIn"
          style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
        >
          <h3 className="font-heading font-bold text-base" style={{ color: 'var(--deep-taupe)' }}>
            Create New Care Reminder
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reminder-title-input" className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                Reminder Title
              </label>
              <input
                id="reminder-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Evening Magnesium or Blood Pressure Check"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
            </div>

            <div>
              <label htmlFor="reminder-dosage-input" className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                Dosage / Notes (Optional)
              </label>
              <input
                id="reminder-dosage-input"
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500mg with meal"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
            </div>

            <div>
              <label htmlFor="reminder-time-input" className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                Scheduled Time
              </label>
              <input
                id="reminder-time-input"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 08:30 AM"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              />
            </div>

            <div>
              <label htmlFor="reminder-type-select" className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                Category
              </label>
              <select
                id="reminder-type-select"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none"
                style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
              >
                <option value="medication">Medication / Prescription</option>
                <option value="appointment">Doctor / Telehealth Visit</option>
                <option value="hydration">Hydration / Rest</option>
                <option value="checkin">Pacing / Self-Care</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={notifyCaregiver}
              onChange={(e) => setNotifyCaregiver(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold" style={{ color: 'var(--deep-taupe)' }}>
              Dispatch automatic confirmation SMS to linked caregiver ({profile.caregiver?.name || 'Family'})
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="tap-target px-4 py-2 rounded-xl border text-xs font-bold"
              style={{ borderColor: 'var(--cloud-border)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tap-target px-5 py-2 rounded-xl text-white font-heading font-bold text-xs sm:text-sm"
              style={{ backgroundColor: 'var(--anchor-green)' }}
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}

      {/* Medications Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-700" />
            <h2 className="font-heading font-bold text-base sm:text-lg" style={{ color: 'var(--deep-taupe)' }}>
              Prescriptions & Daily Medications
            </h2>
          </div>
          <span className="text-xs" style={{ color: 'var(--deep-taupe-muted)' }}>
            One-tap status updates
          </span>
        </div>

        <div className="space-y-3">
          {medications.map((item) => {
            const isTaken = item.status === 'taken';
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  isTaken ? 'opacity-85 bg-stone-50/70' : 'bg-white shadow-xs'
                }`}
                style={{
                  backgroundColor: 'var(--cloud-card)',
                  borderColor: 'var(--cloud-border)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm sm:text-base ${isTaken ? 'line-through text-stone-500' : ''}`} style={{ color: 'var(--deep-taupe)' }}>
                        {item.title}
                      </span>
                      {item.dosage && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 font-mono font-bold text-stone-700">
                          {item.dosage}
                        </span>
                      )}
                    </div>
                    <div className="text-xs flex items-center gap-2 mt-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time} ({item.frequency})</span>
                      {item.notifyCaregiver && (
                        <span className="text-emerald-700 font-bold">• Caregiver copy enabled</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {item.notifyCaregiver && isTaken && (
                    <button
                      type="button"
                      onClick={() => handleNotifyCaregiverDirectly(item)}
                      className="tap-target px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 text-emerald-800 hover:bg-emerald-50"
                      title="Send SMS update to caregiver"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send SMS</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onToggleReminder(item.id)}
                    className={`tap-target-senior px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                      isTaken
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{isTaken ? 'Taken Today' : 'Mark as Taken'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteReminder(item.id)}
                    className="p-2 rounded-xl hover:bg-black/5 text-stone-400 hover:text-stone-700 transition-colors"
                    title="Delete Reminder"
                    aria-label="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Appointments & Check-ins Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <h2 className="font-heading font-bold text-base sm:text-lg" style={{ color: 'var(--deep-taupe)' }}>
              Upcoming Doctor Appointments
            </h2>
          </div>
          <button
            onClick={onOpenBooking}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            + Schedule New Visit
          </button>
        </div>

        <div className="space-y-3">
          {appointments.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-white"
                  style={{ backgroundColor: 'var(--anchor-green)' }}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base" style={{ color: 'var(--deep-taupe)' }}>
                    {item.title}
                  </h4>
                  <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
                    {item.provider || 'Confirmed Care Partner Telehealth Slot'}
                  </div>
                  <div className="text-xs flex items-center gap-2 mt-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time}</span>
                    <span className="text-emerald-700 font-bold">• Synced to calendar</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href="https://telehealth.carepartner.org/room/sathi"
                  target="_blank"
                  rel="noreferrer"
                  className="tap-target px-4 py-2 rounded-xl text-white font-heading font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs"
                  style={{ backgroundColor: 'var(--anchor-green)' }}
                >
                  <span>Join Video Room</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
