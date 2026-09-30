export type PersonaType = 'chronic' | 'elderly';

export interface UserProfile {
  id: string;
  name: string;
  persona: PersonaType;
  ageGroup: string;
  conditions: string[];
  medications: string[];
  primaryDoctor?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  caregiver: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    notifyOnMeds: boolean;
    notifyOnCheckin: boolean;
    summaryOnly: boolean;
  };
  plainLanguageConsentAccepted: boolean;
  onboardingCompleted: boolean;
  pinCode?: string;
  isPinLocked?: boolean;
  simplifiedMode: boolean;
  fontScale: number; // 100 - 160
  theme: 'light' | 'dark';
  voiceEnabled: boolean;
  language: 'en' | 'bn';
}

export interface SymptomLog {
  id: string;
  timestamp: string;
  dateStr: string;
  painLevel: number; // 0 - 10
  mood: 'good' | 'steady' | 'tired' | 'flare' | 'unsettled';
  symptoms: string[];
  triggers: string[];
  sleepHours: number;
  medsTaken: boolean;
  notes?: string;
}

export interface Reminder {
  id: string;
  title: string;
  type: 'medication' | 'appointment' | 'hydration' | 'checkin';
  time: string; // "08:30 AM"
  frequency: string;
  dosage?: string;
  status: 'pending' | 'taken' | 'skipped';
  notifyCaregiver: boolean;
  provider?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isCrisis?: boolean;
  crisisData?: {
    helpline: string;
    emergency: string;
    textLine?: string;
    message?: string;
  };
  suggestedAction?: {
    type: 'log_symptom' | 'book_visit' | 'notify_caregiver' | 'doctor_report' | 'human_handoff' | 'crisis_intervention' | 'confirm_med' | 'caregiver_note' | string;
    title: string;
    detail?: string;
    data?: any;
  } | null;
  triageLevel?: 'routine' | 'moderate' | 'urgent_clinical' | 'emergency';
}

export interface TelehealthBooking {
  bookingId: string;
  patientName: string;
  providerName: string;
  providerTitle: string;
  specialty: string;
  dateTime: string;
  telehealthLink: string;
  confirmationCode: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED';
  reason?: string;
  symptomsSummary?: string;
}

export interface CaregiverNotification {
  id: string;
  timestamp: string;
  recipient: string;
  type: string;
  message: string;
  status: 'DELIVERED' | 'QUEUED';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: string;
  actorRole: string;
  patientId: string;
  summary: string;
  hash: string;
}

export interface ResourceArticle {
  id: string;
  title: string;
  category: 'PCOS & Endo' | 'Pain Pacing' | 'Senior Wellness' | 'Doctor Communication';
  readTime: string;
  verifiedBy: string;
  summary: string;
  keyPoints: string[];
}
