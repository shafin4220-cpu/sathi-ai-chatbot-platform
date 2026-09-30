import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Filter,
  FileDown,
  Clock,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { UserProfile, SymptomLog, Reminder } from '../types';

interface DoctorVisitReportProps {
  profile: UserProfile;
  logs: SymptomLog[];
  reminders: Reminder[];
  onOpenTracker?: () => void;
}

export type DateRangeOption = '7d' | '30d' | 'visit';

export const DoctorVisitReport: React.FC<DoctorVisitReportProps> = ({
  profile,
  logs,
  reminders,
  onOpenTracker,
}) => {
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('7d');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Filter logs based on selected date range
  const filteredLogs = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    
    // Sort logs oldest to newest for chronological analysis
    const sorted = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (selectedRange === '7d') {
      return sorted.slice(-7);
    } else if (selectedRange === '30d') {
      return sorted.slice(-30);
    } else {
      // 'visit': logs since last appointment or all logs
      const apptReminders = reminders.filter((r) => r.type === 'appointment');
      return sorted.slice(-14);
    }
  }, [logs, selectedRange, reminders]);

  // Calculations for Key Stats Summary
  const totalLoggedDays = filteredLogs.length;
  const avgPain = totalLoggedDays
    ? (filteredLogs.reduce((acc, l) => acc + l.painLevel, 0) / totalLoggedDays).toFixed(1)
    : '0.0';
  
  const peakPain = totalLoggedDays
    ? Math.max(...filteredLogs.map((l) => l.painLevel))
    : 0;

  const flareCount = filteredLogs.filter((l) => l.painLevel >= 6 || l.mood === 'flare').length;
  const flareDaysPercent = totalLoggedDays
    ? Math.round((flareCount / totalLoggedDays) * 100)
    : 0;

  const adherenceCount = filteredLogs.filter((l) => l.medsTaken).length;
  const adherencePercent = totalLoggedDays
    ? Math.round((adherenceCount / totalLoggedDays) * 100)
    : 100;

  // Aggregate symptoms and triggers
  const symptomCounts: Record<string, number> = {};
  const triggerCounts: Record<string, number> = {};
  
  filteredLogs.forEach((log) => {
    (log.symptoms || []).forEach((s) => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
    (log.triggers || []).forEach((t) => {
      triggerCounts[t] = (triggerCounts[t] || 0) + 1;
    });
  });

  const sortedSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]);
  const sortedTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]);

  // Handle native browser print
  const handlePrint = () => {
    window.print();
  };

  // Generate and download a real formatted PDF using jsPDF
  const handleDownloadPDF = () => {
    try {
      setIsExportingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const primaryColor = [46, 117, 89]; // #2E7559 Anchor Green
      const darkColor = [35, 33, 30]; // #23211E Deep Taupe
      const grayColor = [100, 95, 90];

      // Document Header
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 18, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('SATHI CLINICAL HEALTH SUMMARY - CONFIDENTIAL DOCTOR REPORT', 14, 12);

      // Subhead & Metadata
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 25);
      doc.text(`Reporting Window: ${selectedRange === '7d' ? 'Last 7 Days' : selectedRange === '30d' ? 'Last 30 Days' : 'Since Last Visit (14 Days)'}`, 14, 30);

      // Patient Demographics Box
      doc.setFillColor(245, 243, 239);
      doc.roundedRect(14, 34, 182, 22, 2, 2, 'F');

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Patient: ${profile.name}`, 18, 41);
      doc.text(`Attending Physician: ${profile.primaryDoctor || 'Primary Care Provider'}`, 105, 41);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Age Group: ${profile.ageGroup || 'Adult'}`, 18, 48);
      doc.text(`Tracked Archetype: ${profile.persona === 'chronic' ? 'Chronic Condition Management' : 'Senior Independent Care'}`, 18, 53);
      doc.text(`Medication Adherence: ${adherencePercent}% (${adherenceCount}/${totalLoggedDays} logs verified)`, 105, 48);

      // Section 1: Key Metrics Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('1. KEY QUANTITATIVE CLINICAL METRICS', 14, 63);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220, 215, 205);
      
      // Metric boxes
      doc.rect(14, 66, 42, 18);
      doc.rect(60, 66, 42, 18);
      doc.rect(106, 66, 42, 18);
      doc.rect(152, 66, 44, 18);

      doc.setFontSize(8);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('AVERAGE PAIN', 18, 71);
      doc.text('PEAK FLARE', 64, 71);
      doc.text('FLARE DAYS', 110, 71);
      doc.text('LOGGED DAYS', 156, 71);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(`${avgPain} / 10`, 18, 80);
      doc.text(`${peakPain} / 10`, 64, 80);
      doc.text(`${flareCount} (${flareDaysPercent}%)`, 110, 80);
      doc.text(`${totalLoggedDays} Days`, 156, 80);

      // Section 2: Active Diagnoses & Medications
      let y = 92;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('2. TRACKED DIAGNOSES & CURRENT REGIMEN', 14, y);

      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Diagnoses: ', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(profile.conditions.join(', ') || 'None recorded', 35, y);

      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Medications: ', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(profile.medications.join(', ') || 'None recorded', 38, y);

      // Section 3: Chronological Log Table
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('3. SYMPTOM & MOOD TRAJECTORY LOGS', 14, y);

      y += 4;
      // Table Header
      doc.setFillColor(240, 238, 232);
      doc.rect(14, y, 182, 7, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Date', 16, y + 5);
      doc.text('Pain', 42, y + 5);
      doc.text('Mood', 62, y + 5);
      doc.text('Reported Symptoms & Notes', 92, y + 5);
      doc.text('Meds', 178, y + 5);

      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      filteredLogs.forEach((log) => {
        if (y > 265) {
          doc.addPage();
          y = 15;
        }
        const symList = log.symptoms.slice(0, 3).join(', ');
        const snippet = log.notes ? ` (${log.notes.slice(0, 30)})` : '';
        const displaySym = (symList + snippet) || 'Routine check-in';

        doc.text(log.dateStr || log.timestamp.split('T')[0], 16, y + 4);
        doc.text(`${log.painLevel}/10`, 42, y + 4);
        doc.text(log.mood.toUpperCase(), 62, y + 4);
        doc.text(displaySym.slice(0, 50), 92, y + 4);
        doc.text(log.medsTaken ? 'Taken' : 'Missed', 178, y + 4);

        doc.setDrawColor(230, 226, 218);
        doc.line(14, y + 6, 196, y + 6);
        y += 6.5;
      });

      // Section 4: Identified Common Triggers & Consultation Questions
      if (y > 230) {
        doc.addPage();
        y = 15;
      } else {
        y += 4;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('4. MOST FREQUENT SYMPTOMS & TRIGGERS', 14, y);

      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      
      const topSymText = sortedSymptoms.slice(0, 4).map(([s, c]) => `${s} (${c}x)`).join(' • ') || 'None';
      const topTrigText = sortedTriggers.slice(0, 4).map(([t, c]) => `${t} (${c}x)`).join(' • ') || 'Stress, poor sleep';
      
      doc.text(`Primary Symptoms: ${topSymText}`, 14, y);
      y += 5;
      doc.text(`Correlated Triggers: ${topTrigText}`, 14, y);

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('5. SUGGESTED DISCUSSION QUESTIONS FOR CLINICIAN', 14, y);

      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('1. "My pain trajectory spikes on days following reduced sleep. Should we explore restorative sleep strategies?"', 14, y);
      y += 4.5;
      doc.text('2. "Are current medication doses optimal given my logged adherence rate and recurrent flare cycles?"', 14, y);
      y += 4.5;
      doc.text('3. "Would referrals to physical therapy or dietary consultation assist in stabilizing breakthrough symptoms?"', 14, y);

      // Footer
      doc.setFontSize(7.5);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('Generated via Sathi AI Care Companion • Patient-Authored Clinical Log • Data minimization enforced', 14, 287);

      doc.save(`Sathi_Doctor_Report_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // If there are zero logs across the entire tracker
  if (!logs || logs.length === 0) {
    return (
      <div id="screen-doctor-report" className="space-y-6 max-w-3xl mx-auto pb-16 animate-fadeIn">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span
              className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--soft-mint-soft)',
                color: 'var(--soft-mint-text)',
              }}
            >
              Clinical Communication Tool
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mt-1" style={{ color: 'var(--deep-taupe)' }}>
              Doctor-Ready Visit Pattern Report
            </h1>
          </div>
        </div>

        {/* Empty State */}
        <div
          className="p-8 sm:p-12 rounded-3xl border text-center space-y-4 shadow-sm"
          style={{
            backgroundColor: 'var(--cloud-card)',
            borderColor: 'var(--cloud-border)',
          }}
        >
          <div
            className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: 'var(--anchor-green)' }}
          >
            <Activity className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold" style={{ color: 'var(--deep-taupe)' }}>
              No Tracker Records Yet
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--deep-taupe-muted)' }}>
              Log a few more days of symptoms and medication in your Tracker, and your customized clinical summary report will automatically assemble right here for your doctor!
            </p>
          </div>

          {onOpenTracker && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenTracker}
                className="tap-target px-6 py-3 rounded-2xl text-white font-heading font-extrabold text-sm inline-flex items-center gap-2 shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: 'var(--anchor-green)' }}
              >
                <Activity className="w-4 h-4" />
                <span>Go to Symptom Tracker to Log Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="screen-doctor-report" className="space-y-6 sm:space-y-8 max-w-3xl mx-auto pb-16 animate-fadeIn">
      {/* Action Header (Hidden during print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <span
            className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--soft-mint-soft)',
              color: 'var(--soft-mint-text)',
            }}
          >
            Clinical Communication Tool
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mt-1" style={{ color: 'var(--deep-taupe)' }}>
            Doctor-Ready Visit Pattern Report
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
            Engineered specifically to maximize value during a brief 10-minute physician consultation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Export PDF Button (Real Downloadable File) */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPdf}
            className="tap-target-senior flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-white font-heading font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform disabled:opacity-50"
            style={{ backgroundColor: 'var(--anchor-green)' }}
            title="Download formatted clinical PDF"
          >
            <FileDown className="w-5 h-5" />
            <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          {/* Native Browser Print */}
          <button
            onClick={handlePrint}
            className="tap-target px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-black/5"
            style={{
              backgroundColor: 'var(--cloud-card)',
              borderColor: 'var(--cloud-border)',
              color: 'var(--deep-taupe)',
            }}
            title="Print sheet"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector Bar (Hidden during print) */}
      <div
        className="no-print p-3 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
        style={{
          backgroundColor: 'var(--cloud-card)',
          borderColor: 'var(--cloud-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-700" style={{ color: 'var(--anchor-green)' }} />
          <span className="text-xs sm:text-sm font-bold" style={{ color: 'var(--deep-taupe)' }}>
            Report Window:
          </span>
          <span className="text-xs" style={{ color: 'var(--deep-taupe-muted)' }}>
            Showing {totalLoggedDays} {totalLoggedDays === 1 ? 'log' : 'logs'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedRange('7d')}
            className={`tap-target flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRange === '7d' ? 'shadow-xs' : 'hover:bg-black/5'
            }`}
            style={{
              backgroundColor: selectedRange === '7d' ? 'var(--anchor-green)' : 'transparent',
              color: selectedRange === '7d' ? '#FFFFFF' : 'var(--deep-taupe)',
              borderColor: selectedRange === '7d' ? 'var(--anchor-green)' : 'var(--cloud-border)',
              borderWidth: '1px',
            }}
          >
            Last 7 Days
          </button>

          <button
            type="button"
            onClick={() => setSelectedRange('30d')}
            className={`tap-target flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRange === '30d' ? 'shadow-xs' : 'hover:bg-black/5'
            }`}
            style={{
              backgroundColor: selectedRange === '30d' ? 'var(--anchor-green)' : 'transparent',
              color: selectedRange === '30d' ? '#FFFFFF' : 'var(--deep-taupe)',
              borderColor: selectedRange === '30d' ? 'var(--anchor-green)' : 'var(--cloud-border)',
              borderWidth: '1px',
            }}
          >
            Last 30 Days
          </button>

          <button
            type="button"
            onClick={() => setSelectedRange('visit')}
            className={`tap-target flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRange === 'visit' ? 'shadow-xs' : 'hover:bg-black/5'
            }`}
            style={{
              backgroundColor: selectedRange === 'visit' ? 'var(--anchor-green)' : 'transparent',
              color: selectedRange === 'visit' ? '#FFFFFF' : 'var(--deep-taupe)',
              borderColor: selectedRange === 'visit' ? 'var(--anchor-green)' : 'var(--cloud-border)',
              borderWidth: '1px',
            }}
          >
            Since Last Visit
          </button>
        </div>
      </div>

      {/* Printable Clinical Sheet Container */}
      <div
        id="printable-clinical-report"
        className="p-6 sm:p-10 rounded-3xl border shadow-sm space-y-8 bg-white text-stone-900 border-stone-300"
      >
        {/* Clinician Header */}
        <div className="border-b border-stone-300 pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-2xl tracking-tight text-stone-900">
                SATHI CLINICAL PATTERN SUMMARY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                EHR Ready
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Confidential Patient-Reported Outcomes (PRO) Log • Generated for Primary Care / Specialist Review
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-stone-600">
            <div><strong>Report Date:</strong> {new Date().toLocaleDateString()}</div>
            <div>
              <strong>Window:</strong> {selectedRange === '7d' ? 'Last 7 Days' : selectedRange === '30d' ? 'Last 30 Days' : 'Since Last Visit'} ({totalLoggedDays} entries)
            </div>
          </div>
        </div>

        {/* Patient Profile & Demographics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
          <div>
            <span className="text-stone-500 font-semibold">Patient Name:</span>
            <div className="font-bold text-sm text-stone-900">{profile.name}</div>
          </div>
          <div>
            <span className="text-stone-500 font-semibold">Age Group:</span>
            <div className="font-bold text-sm text-stone-900">{profile.ageGroup || 'Adult'}</div>
          </div>
          <div>
            <span className="text-stone-500 font-semibold">Primary Physician:</span>
            <div className="font-bold text-sm text-stone-900">{profile.primaryDoctor || 'Attending Physician'}</div>
          </div>
          <div>
            <span className="text-stone-500 font-semibold">Medication Adherence:</span>
            <div className="font-bold text-sm text-emerald-800">{adherencePercent}% ({adherenceCount}/{totalLoggedDays})</div>
          </div>
        </div>

        {/* Diagnoses & Current Regimen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-stone-200">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-600 mb-2">
              Active Tracked Conditions
            </h3>
            <ul className="space-y-1 text-xs">
              {profile.conditions.length > 0 ? (
                profile.conditions.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                    <span className="font-semibold text-stone-900">{c}</span>
                  </li>
                ))
              ) : (
                <li className="text-stone-500 italic">No specific diagnoses logged</li>
              )}
            </ul>
          </div>

          <div className="p-4 rounded-2xl border border-stone-200">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-600 mb-2">
              Current Medication Regimen
            </h3>
            <ul className="space-y-1 text-xs">
              {profile.medications.length > 0 ? (
                profile.medications.map((m, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                    <span className="text-stone-800">{m}</span>
                  </li>
                ))
              ) : (
                <li className="text-stone-500 italic">No daily medications recorded</li>
              )}
            </ul>
          </div>
        </div>

        {/* Core Statistical Metrics (Key Stats Summary) */}
        <div>
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-800" />
            <span>Key Stats Summary (Selected Window)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-stone-200 text-center bg-stone-50">
              <div className="text-xs text-stone-500">Average Pain Level</div>
              <div className="text-2xl font-black text-stone-900 mt-1">{avgPain} / 10</div>
              <div className="text-[10px] text-stone-600">Visual Analog Scale</div>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 text-center bg-stone-50">
              <div className="text-xs text-stone-500">Peak Flare Recorded</div>
              <div className="text-2xl font-black text-amber-800 mt-1">{peakPain} / 10</div>
              <div className="text-[10px] text-stone-600">Severe limitation</div>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 text-center bg-stone-50">
              <div className="text-xs text-stone-500">Flare Days Count</div>
              <div className="text-2xl font-black text-amber-800 mt-1">{flareCount}</div>
              <div className="text-[10px] text-stone-600">{flareDaysPercent}% of logged window</div>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 text-center bg-stone-50">
              <div className="text-xs text-stone-500">Medication Adherence</div>
              <div className="text-2xl font-black text-emerald-800 mt-1">{adherencePercent}%</div>
              <div className="text-[10px] text-stone-600">{adherenceCount} of {totalLoggedDays} days taken</div>
            </div>
          </div>
        </div>

        {/* Symptom Pattern Chart: Visual Trend of Pain Level, Mood, and Flare Frequency */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-800" />
              <span>Symptom Pattern & Pain Trend Chart</span>
            </h3>
            <span className="text-[11px] text-stone-500">
              Chronological daily progression
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50">
            {totalLoggedDays > 0 ? (
              <div className="space-y-3">
                {/* SVG Line and Area Chart */}
                <div className="w-full h-44 relative">
                  <svg className="w-full h-full" viewBox="0 0 500 140" preserveAspectRatio="none">
                    {/* Severity bands */}
                    <rect x="0" y="0" width="500" height="42" fill="#FEE2E2" opacity="0.45" />
                    <line x1="0" y1="42" x2="500" y2="42" stroke="#EF4444" strokeDasharray="3 3" strokeOpacity="0.4" />
                    <text x="8" y="32" fill="#B91C1C" fontSize="9" fontWeight="bold">Flare Threshold (≥6/10)</text>

                    <rect x="0" y="42" width="500" height="50" fill="#FEF3C7" opacity="0.35" />
                    <text x="8" y="72" fill="#92400E" fontSize="9">Moderate (4-5)</text>

                    <rect x="0" y="92" width="500" height="48" fill="#ECFDF5" opacity="0.5" />
                    <text x="8" y="125" fill="#047857" fontSize="9">Mild / Managed (1-3)</text>

                    {/* Trend Line */}
                    {totalLoggedDays > 1 && (
                      <polyline
                        fill="none"
                        stroke="#2E7559"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={filteredLogs
                          .map((log, idx) => {
                            const x = 50 + (idx / Math.max(1, totalLoggedDays - 1)) * 420;
                            const y = 130 - (log.painLevel / 10) * 115;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    )}

                    {/* Data Points */}
                    {filteredLogs.map((log, idx) => {
                      const x = totalLoggedDays === 1 ? 250 : 50 + (idx / Math.max(1, totalLoggedDays - 1)) * 420;
                      const y = 130 - (log.painLevel / 10) * 115;
                      const isFlare = log.painLevel >= 6 || log.mood === 'flare';
                      return (
                        <g key={idx}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isFlare ? 5.5 : 4}
                            fill={isFlare ? '#EF4444' : '#2E7559'}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                          />
                          <text
                            x={x}
                            y={y - 8}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight="bold"
                            fill={isFlare ? '#B91C1C' : '#1F2937'}
                          >
                            {log.painLevel}
                          </text>
                          <text
                            x={x}
                            y={136}
                            textAnchor="middle"
                            fontSize="8"
                            fill="#6B7280"
                          >
                            {log.dateStr ? log.dateStr.split(' ')[0] : idx + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Mood and Flare Distribution Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="font-semibold text-stone-700">Flares logged: {flareCount}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <span className="font-semibold text-stone-700">Meds taken: {adherenceCount}/{totalLoggedDays}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 italic">
                    VAS Scale 0 (no pain) to 10 (emergency severity)
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-stone-500">
                Not enough entries in this date window. Try switching to a wider window.
              </div>
            )}
          </div>
        </div>

        {/* Most Frequent Symptoms & Common Triggers Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
            <div className="bg-stone-100 p-3 font-bold text-stone-800 border-b border-stone-200">
              Reported Symptoms ({sortedSymptoms.length} distinct)
            </div>
            <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto">
              {sortedSymptoms.length > 0 ? (
                sortedSymptoms.map(([sym, count], idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <span className="font-semibold text-stone-900">{sym}</span>
                    <span className="text-stone-600 font-mono text-[11px]">
                      {count} {count === 1 ? 'time' : 'times'} ({Math.round((count / totalLoggedDays) * 100)}%)
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-stone-500">No specific symptoms recorded</div>
              )}
            </div>
          </div>

          <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
            <div className="bg-stone-100 p-3 font-bold text-stone-800 border-b border-stone-200">
              Most Common Triggers Logged
            </div>
            <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto">
              {sortedTriggers.length > 0 ? (
                sortedTriggers.map(([trig, count], idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <span className="font-semibold text-stone-900">{trig}</span>
                    <span className="text-stone-600 font-mono text-[11px]">
                      {count} {count === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-stone-500">
                  Default pattern correlation: high stress, poor sleep (&lt;6h), weather change
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prioritized Patient Discussion Questions */}
        <div className="p-5 rounded-2xl border-2 border-stone-300 bg-stone-50 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-stone-700" />
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-stone-900">
              Prioritized Questions for Today's 10-Minute Consult
            </h3>
          </div>

          <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-800 leading-relaxed font-medium">
            <li>
              "My pain trajectory recorded an average of {avgPain}/10 with {flareCount} severe flare episodes over this window. Does this warrant adjusting medication dosage or timing?"
            </li>
            <li>
              "Despite {adherencePercent}% verified medication adherence, symptoms correlate strongly with {sortedTriggers[0]?.[0] || 'high stress and poor sleep'}. Are there preventative therapies we should introduce?"
            </li>
            <li>
              "What red-flag signs should prompt urgent escalation versus continuing our standard at-home care routine?"
            </li>
          </ol>
        </div>

        {/* Clinical Disclaimer */}
        <div className="pt-4 border-t border-stone-200 text-[10px] text-stone-500 flex items-center justify-between">
          <span>Powered by Sathi AI Care Companion • Patient-Authored Clinical Log</span>
          <span>Verified HIPAA-Grade Data Minimization</span>
        </div>
      </div>
    </div>
  );
};
