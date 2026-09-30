import React, { useState } from 'react';
import {
  Activity,
  PlusCircle,
  Calendar,
  Moon,
  Pill,
  Sparkles,
  Flame,
  CheckCircle2,
  FileText,
  BarChart3,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { UserProfile, SymptomLog } from '../types';

interface SymptomTrackerProps {
  profile: UserProfile;
  logs: SymptomLog[];
  onAddLog: (log: Omit<SymptomLog, 'id' | 'timestamp' | 'dateStr'>) => void;
  onOpenDoctorReport: () => void;
}

export const SymptomTracker: React.FC<SymptomTrackerProps> = ({
  profile,
  logs,
  onAddLog,
  onOpenDoctorReport,
}) => {
  const isElderly = profile.persona === 'elderly';

  // Form states
  const [painLevel, setPainLevel] = useState<number>(3);
  const [mood, setMood] = useState<SymptomLog['mood']>('steady');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [medsTaken, setMedsTaken] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const symptomList = isElderly
    ? [
        'Knee / Joint stiffness',
        'Lower back ache',
        'Dizziness when standing',
        'Mild fatigue',
        'Restless legs',
        'Shortness of breath',
        'Poor appetite',
      ]
    : [
        'Pelvic stabbing / cramps',
        'Lower back throbbing',
        'Severe abdominal bloating',
        'Exhaustion / Fatigue',
        'Brain fog / Trouble focusing',
        'Nausea',
        'Migraine / Tension headache',
        'Insomnia',
      ];

  const triggerList = isElderly
    ? [
        'Cold / damp weather',
        'Climbing stairs',
        'Missed morning water',
        'Poor night sleep',
        'Prolonged sitting',
      ]
    : [
        'Pre-menstrual luteal spike',
        'High work stress',
        'Dairy or sugar intake',
        'Poor sleep (<6 hrs)',
        'Prolonged desk sitting',
        'Intense physical exertion',
      ];

  const handleToggleSymptom = (item: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleToggleTrigger = (item: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog({
      painLevel,
      mood,
      symptoms: selectedSymptoms,
      triggers: selectedTriggers,
      sleepHours,
      medsTaken,
      notes,
    });

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    // Reset form
    setSelectedSymptoms([]);
    setSelectedTriggers([]);
    setNotes('');
  };

  // Calculate statistics
  const avgPain = logs.length
    ? (logs.reduce((acc, l) => acc + l.painLevel, 0) / logs.length).toFixed(1)
    : '0';
  const flareCount = logs.filter((l) => l.painLevel >= 6 || l.mood === 'flare').length;
  const adherenceCount = logs.filter((l) => l.medsTaken).length;
  const adherenceRate = logs.length ? Math.round((adherenceCount / logs.length) * 100) : 100;

  return (
    <div id="screen-symptom-tracker" className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span
            className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--soft-mint-soft)',
              color: 'var(--soft-mint-text)',
            }}
          >
            Structured Pattern Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mt-1" style={{ color: 'var(--deep-taupe)' }}>
            Symptom & Pain Tracker
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
            Every log builds your doctor-ready pattern report to validate your clinical reality.
          </p>
        </div>

        <button
          onClick={onOpenDoctorReport}
          className="tap-target px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-heading font-bold flex items-center gap-2 shadow-xs transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--cloud-card)',
            borderColor: 'var(--cloud-border)',
            color: 'var(--deep-taupe)',
          }}
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>Doctor Report Preview</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-xs"
          style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
        >
          <div className="text-xs font-semibold" style={{ color: 'var(--deep-taupe-muted)' }}>
            7-Day Avg Pain
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black mt-1" style={{ color: 'var(--deep-taupe)' }}>
            {avgPain}<span className="text-xs font-normal opacity-60">/10</span>
          </div>
          <div className="text-[11px] font-bold mt-1 flex items-center gap-1" style={{ color: 'var(--anchor-green)' }}>
            <TrendingDown className="w-3 h-3" />
            <span>Moderate baseline</span>
          </div>
        </div>

        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-xs"
          style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
        >
          <div className="text-xs font-semibold" style={{ color: 'var(--deep-taupe-muted)' }}>
            Flares Logged
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black mt-1" style={{ color: 'var(--terracotta)' }}>
            {flareCount}
          </div>
          <div className="text-[11px] font-bold mt-1" style={{ color: 'var(--deep-taupe-muted)' }}>
            In past 7 days
          </div>
        </div>

        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-xs"
          style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
        >
          <div className="text-xs font-semibold" style={{ color: 'var(--deep-taupe-muted)' }}>
            Med Adherence
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black mt-1" style={{ color: 'var(--anchor-green)' }}>
            {adherenceRate}%
          </div>
          <div className="text-[11px] font-bold mt-1" style={{ color: 'var(--anchor-green)' }}>
            Verified taken
          </div>
        </div>
      </div>

      {/* 7-Day Trend Chart (Clean Accessible SVG) */}
      <section
        className="p-5 sm:p-6 rounded-3xl border shadow-xs"
        style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <h2 className="font-heading font-bold text-base sm:text-lg" style={{ color: 'var(--deep-taupe)' }}>
              Pain Trajectory (7-Day Trend)
            </h2>
          </div>
          <span className="text-xs" style={{ color: 'var(--deep-taupe-muted)' }}>
            Green ≤3 (Mild) • Orange ≥6 (Flare)
          </span>
        </div>

        {/* SVG Chart */}
        <div className="w-full h-48 sm:h-52 relative">
          <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
            {/* Background threshold bands */}
            <rect x="0" y="0" width="500" height="48" fill="#FBEAEA" opacity="0.4" />
            <line x1="0" y1="48" x2="500" y2="48" stroke="#D64545" strokeDasharray="3 3" strokeOpacity="0.3" />
            <text x="8" y="40" fill="#9C3A3A" fontSize="10" fontWeight="bold">Flare Zone (7-10)</text>

            <rect x="0" y="48" width="500" height="56" fill="#FFF9F2" opacity="0.4" />
            <text x="8" y="80" fill="#B47846" fontSize="10">Moderate (4-6)</text>

            <rect x="0" y="104" width="500" height="56" fill="#F2F9F4" opacity="0.4" />
            <text x="8" y="140" fill="#3D7B58" fontSize="10">Mild / Managed (1-3)</text>

            {/* Connecting line */}
            {logs.length > 1 && (
              <polyline
                fill="none"
                stroke="var(--anchor-green)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={logs
                  .map((log, idx) => {
                    const x = 50 + (idx / Math.max(1, logs.length - 1)) * 400;
                    const y = 145 - (log.painLevel / 10) * 125;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Data points */}
            {logs.map((log, idx) => {
              const x = 50 + (idx / Math.max(1, logs.length - 1)) * 400;
              const y = 145 - (log.painLevel / 10) * 125;
              const isHigh = log.painLevel >= 6;
              return (
                <g key={log.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHigh ? '7' : '5'}
                    fill={isHigh ? '#C06B3E' : 'var(--anchor-green)'}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill="var(--deep-taupe)"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {log.painLevel}
                  </text>
                  <text
                    x={x}
                    y="155"
                    textAnchor="middle"
                    fill="var(--deep-taupe-muted)"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {log.dateStr}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* Form: Log New Symptom / Flare */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6"
        style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            <h2 className="font-heading font-extrabold text-lg sm:text-xl" style={{ color: 'var(--deep-taupe)' }}>
              Record New Health Observation
            </h2>
          </div>
          {isSuccess && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved to Doctor Report
            </span>
          )}
        </div>

        {/* Pain Severity Slider (0 - 10) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="pain-level-slider" className="text-sm font-bold" style={{ color: 'var(--deep-taupe)' }}>
              Pain & Discomfort Severity: <span className="text-lg font-heading font-extrabold">{painLevel}/10</span>
            </label>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor: painLevel <= 3 ? 'var(--soft-mint-soft)' : painLevel <= 6 ? 'var(--bloom-coral-soft)' : 'var(--alert-red-soft)',
                color: painLevel <= 3 ? 'var(--soft-mint-text)' : painLevel <= 6 ? 'var(--terracotta-text)' : 'var(--alert-red-text)',
              }}
            >
              {painLevel === 0
                ? 'No Pain'
                : painLevel <= 3
                ? 'Mild (Noticeable, manageable)'
                : painLevel <= 6
                ? 'Moderate (Interferes with tasks)'
                : 'Severe (Disabling flare)'}
            </span>
          </div>

          <input
            id="pain-level-slider"
            type="range"
            min="0"
            max="10"
            step="1"
            value={painLevel}
            onChange={(e) => setPainLevel(parseInt(e.target.value, 10))}
            className="w-full h-3 rounded-lg cursor-pointer accent-emerald-700"
          />
          <div className="flex justify-between text-[11px] mt-1 font-semibold" style={{ color: 'var(--deep-taupe-muted)' }}>
            <span>0: None</span>
            <span>3: Mild</span>
            <span>6: Moderate</span>
            <span>10: Extreme</span>
          </div>
        </div>

        {/* Symptoms Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--deep-taupe-muted)' }}>
            Select Symptoms Present
          </label>
          <div className="flex flex-wrap gap-2">
            {symptomList.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => handleToggleSymptom(symptom)}
                  className={`tap-target px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'hover:bg-black/5'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--anchor-green)' : 'transparent',
                    borderColor: isSelected ? 'var(--anchor-green)' : 'var(--cloud-border)',
                    color: isSelected ? '#FFFFFF' : 'var(--deep-taupe)',
                  }}
                >
                  {symptom}
                </button>
              );
            })}
          </div>
        </div>

        {/* Triggers Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--deep-taupe-muted)' }}>
            Suspected Correlated Triggers
          </label>
          <div className="flex flex-wrap gap-2">
            {triggerList.map((trigger) => {
              const isSelected = selectedTriggers.includes(trigger);
              return (
                <button
                  key={trigger}
                  type="button"
                  onClick={() => handleToggleTrigger(trigger)}
                  className={`tap-target px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'hover:bg-black/5'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--bloom-coral)' : 'transparent',
                    borderColor: isSelected ? 'var(--bloom-coral)' : 'var(--cloud-border)',
                    color: isSelected ? '#FFFFFF' : 'var(--deep-taupe)',
                  }}
                >
                  {trigger}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sleep and Meds row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sleep-hours-input" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
              Last Night Sleep (Hours)
            </label>
            <input
              id="sleep-hours-input"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none"
              style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={medsTaken}
                onChange={(e) => setMedsTaken(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-bold" style={{ color: 'var(--deep-taupe)' }}>
                Prescribed medications taken on time
              </span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes-input" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--deep-taupe-muted)' }}>
            Notes for Doctor (Functional Impact)
          </label>
          <textarea
            id="notes-input"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Flare made it difficult to sit for afternoon work; heat pad provided 40% relief."
            className="w-full p-3 rounded-xl border text-sm focus:outline-none"
            style={{ backgroundColor: 'var(--cloud-base)', borderColor: 'var(--cloud-border)' }}
          />
        </div>

        <button
          type="submit"
          id="submit-symptom-log-btn"
          className="tap-target-senior w-full py-3.5 rounded-2xl text-white font-heading font-extrabold text-base flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
          style={{ backgroundColor: 'var(--anchor-green)' }}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Save Log & Update Trend Chart</span>
        </button>
      </form>
    </div>
  );
};
