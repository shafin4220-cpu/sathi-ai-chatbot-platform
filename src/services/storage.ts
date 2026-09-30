import {
  UserProfile,
  SymptomLog,
  Reminder,
  ChatMessage,
  TelehealthBooking,
  CaregiverNotification,
  AuditLogEntry,
  ResourceArticle,
} from '../types';

export const CHRONIC_PROFILE: UserProfile = {
  id: 'usr-chronic-01',
  name: 'Maya Chen',
  persona: 'chronic',
  ageGroup: '25-34',
  conditions: ['Endometriosis Stage II', 'PCOS (Polycystic Ovary Syndrome)', 'Chronic Pelvic Pain'],
  medications: ['Metformin 500mg (Daily with food)', 'Progesterone 200mg (Luteal phase)', 'Magnesium Glycinate 300mg (Bedtime)'],
  primaryDoctor: 'Dr. Aliyah Sen, MD (Endocrinology & Women\'s Health)',
  emergencyContact: {
    name: 'David Chen',
    relationship: 'Partner',
    phone: '(555) 234-5678',
  },
  caregiver: {
    name: 'David Chen',
    relationship: 'Partner / Care Partner',
    phone: '(555) 234-5678',
    email: 'david.chen@example.com',
    notifyOnMeds: false,
    notifyOnCheckin: true,
    summaryOnly: true,
  },
  plainLanguageConsentAccepted: true,
  onboardingCompleted: true,
  pinCode: '1234',
  simplifiedMode: false,
  fontScale: 100,
  theme: 'light',
  voiceEnabled: true,
  language: 'en',
};

export const ELDERLY_PROFILE: UserProfile = {
  id: 'usr-elderly-01',
  name: 'Robert "Bob" Miller',
  persona: 'elderly',
  ageGroup: '70-79',
  conditions: ['Hypertension (Managed)', 'Knee Osteoarthritis', 'Mild Sleep Disturbance'],
  medications: ['Lisinopril 10mg (Morning with water)', 'Glucosamine & Chondroitin (Morning)', 'CoQ10 100mg (Lunch)'],
  primaryDoctor: 'Dr. Marcus Reed, MD (Geriatric & Family Medicine)',
  emergencyContact: {
    name: 'Sarah Miller',
    relationship: 'Daughter',
    phone: '(555) 876-5432',
  },
  caregiver: {
    name: 'Sarah Miller',
    relationship: 'Daughter',
    phone: '(555) 876-5432',
    email: 'sarah.miller@example.com',
    notifyOnMeds: true,
    notifyOnCheckin: true,
    summaryOnly: true,
  },
  plainLanguageConsentAccepted: true,
  onboardingCompleted: true,
  pinCode: '2580',
  simplifiedMode: true,
  fontScale: 125, // Generous default for senior eyes
  theme: 'light',
  voiceEnabled: true,
  language: 'en',
};

// 7-day realistic pre-seeded symptom history for chronic patient
export const SAMPLE_CHRONIC_LOGS: SymptomLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
    dateStr: 'Mon',
    painLevel: 4,
    mood: 'steady',
    symptoms: ['Lower back ache', 'Mild bloating'],
    triggers: ['High work stress', 'Missed lunch'],
    sleepHours: 7,
    medsTaken: true,
    notes: 'Mild dull ache in pelvic area after 4 hours of desk work. Warm tea helped.',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    dateStr: 'Tue',
    painLevel: 3,
    mood: 'good',
    symptoms: ['Mild fatigue'],
    triggers: ['Poor posture'],
    sleepHours: 7.5,
    medsTaken: true,
    notes: 'Gentle 20-min walking pace felt good on lower back.',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    dateStr: 'Wed',
    painLevel: 6,
    mood: 'flare',
    symptoms: ['Pelvic stabbing pain', 'Severe bloating', 'Brain fog'],
    triggers: ['Pre-menstrual luteal spike', 'Dairy consumption'],
    sleepHours: 5,
    medsTaken: true,
    notes: 'Significant pelvic flare around 3 PM. Used heating pad for 45 minutes.',
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    dateStr: 'Thu',
    painLevel: 7,
    mood: 'flare',
    symptoms: ['Sharp pelvic cramps', 'Exhaustion', 'Nausea'],
    triggers: ['Hormonal fluctuation'],
    sleepHours: 5.5,
    medsTaken: true,
    notes: 'Took prescribed relief. Had to reschedule afternoon meetings. Doctor needs to review this pattern.',
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    dateStr: 'Fri',
    painLevel: 5,
    mood: 'tired',
    symptoms: ['Residual lower abdominal soreness', 'Brain fog'],
    triggers: ['Sleep deprivation'],
    sleepHours: 6.5,
    medsTaken: true,
    notes: 'Flare subsiding slowly. Magnesium taken at 9:30 PM.',
  },
  {
    id: 'log-6',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    dateStr: 'Sat',
    painLevel: 3,
    mood: 'steady',
    symptoms: ['Mild stiffness'],
    triggers: ['Weather dampness'],
    sleepHours: 8,
    medsTaken: true,
    notes: 'Restful weekend morning. Pelvic tension minimal.',
  },
  {
    id: 'log-7',
    timestamp: new Date().toISOString(),
    dateStr: 'Today',
    painLevel: 3,
    mood: 'good',
    symptoms: ['Mild afternoon fatigue'],
    triggers: ['Screen time'],
    sleepHours: 7.5,
    medsTaken: true,
    notes: 'Feeling relatively stable. Hydrating well with electrolyte water.',
  },
];

// Pre-seeded logs for elderly user
export const SAMPLE_ELDERLY_LOGS: SymptomLog[] = [
  {
    id: 'log-e1',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    dateStr: 'Thu',
    painLevel: 3,
    mood: 'steady',
    symptoms: ['Right knee morning stiffness'],
    triggers: ['Cold morning weather'],
    sleepHours: 7,
    medsTaken: true,
    notes: 'Knee loosened up nicely after a warm shower and cup of oatmeal.',
  },
  {
    id: 'log-e2',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    dateStr: 'Fri',
    painLevel: 2,
    mood: 'good',
    symptoms: ['Mild tired feeling in afternoon'],
    triggers: ['Walked garden stairs twice'],
    sleepHours: 7.5,
    medsTaken: true,
    notes: 'Sarah called during lunch. Mind felt very bright today.',
  },
  {
    id: 'log-e3',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    dateStr: 'Sat',
    painLevel: 4,
    mood: 'steady',
    symptoms: ['Knee ache', 'Lower back tightness'],
    triggers: ['Sitting in armchair too long'],
    sleepHours: 6.5,
    medsTaken: true,
    notes: 'Did 10 minutes of gentle chair stretches. Took morning blood pressure pills.',
  },
  {
    id: 'log-e4',
    timestamp: new Date().toISOString(),
    dateStr: 'Today',
    painLevel: 2,
    mood: 'good',
    symptoms: ['None notable'],
    triggers: [],
    sleepHours: 8,
    medsTaken: true,
    notes: 'Slept soundly. Blood pressure check was 124/82. Feeling cheerful.',
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Morning Blood Pressure & Heart Health Pill',
    type: 'medication',
    time: '08:30 AM',
    frequency: 'Daily with full glass of water',
    dosage: '10mg Lisinopril',
    status: 'taken',
    notifyCaregiver: true,
  },
  {
    id: 'rem-2',
    title: 'Midday Mobility & Joint Vitamin',
    type: 'medication',
    time: '01:00 PM',
    frequency: 'Daily with meal',
    dosage: 'Glucosamine + CoQ10',
    status: 'pending',
    notifyCaregiver: false,
  },
  {
    id: 'rem-3',
    title: 'Hydration & Gentle Standing Stretch',
    type: 'hydration',
    time: '03:30 PM',
    frequency: 'Daily',
    status: 'pending',
    notifyCaregiver: false,
  },
  {
    id: 'rem-4',
    title: 'Dr. Marcus Reed — Telehealth Check-in',
    type: 'appointment',
    time: 'Tomorrow, 10:30 AM',
    frequency: 'Virtual Clinic Visit',
    status: 'pending',
    notifyCaregiver: true,
    provider: 'Dr. Marcus Reed, MD (CarePartner Telehealth)',
  },
];

export const INITIAL_CHRONIC_REMINDERS: Reminder[] = [
  {
    id: 'rem-c1',
    title: 'Metformin & Insulin Sensitivity Support',
    type: 'medication',
    time: '08:30 AM',
    frequency: 'Daily with breakfast',
    dosage: '500mg Extended Release',
    status: 'taken',
    notifyCaregiver: false,
  },
  {
    id: 'rem-c2',
    title: 'Pelvic Heat Therapy & 10-Min Pacing Rest',
    type: 'checkin',
    time: '02:00 PM',
    frequency: 'Flare prevention protocol',
    status: 'pending',
    notifyCaregiver: false,
  },
  {
    id: 'rem-c3',
    title: 'Dr. Aliyah Sen — Endocrine & Pain Review',
    type: 'appointment',
    time: 'Friday, 02:00 PM',
    frequency: 'Telehealth Consult',
    status: 'pending',
    notifyCaregiver: true,
    provider: 'Dr. Aliyah Sen, MD',
  },
  {
    id: 'rem-c4',
    title: 'Magnesium Glycinate & Sleep Preparation',
    type: 'medication',
    time: '09:30 PM',
    frequency: 'Nightly',
    dosage: '300mg',
    status: 'pending',
    notifyCaregiver: false,
  },
];

export const VETTED_RESOURCES: ResourceArticle[] = [
  {
    id: 'art-1',
    title: 'Preparing for a 10-Minute Doctor Appointment: How to Present Symptom Patterns Without Being Dismissed',
    category: 'Doctor Communication',
    readTime: '4 min read',
    verifiedBy: 'American College of Obstetricians & Gynecologists (ACOG) & Chronic Care Coalition',
    summary: 'Clinical research confirms doctors respond best to quantified frequency and functional impact data rather than general descriptions.',
    keyPoints: [
      'Lead with functional impairment: "This flare prevented me from working on Thursday" rather than "It hurts often."',
      'Bring printed, objective charts showing 30-day symptom cycles and sleep correlation.',
      'Request specific diagnostic next steps in writing if a test is declined.',
      'Keep your top 3 questions written down at the top of your Sathi report.',
    ],
  },
  {
    id: 'art-2',
    title: 'Pacing vs Pushing: The Energy Envelope Method for Chronic Fatigue & Fibromyalgia',
    category: 'Pain Pacing',
    readTime: '5 min read',
    verifiedBy: 'National Fibromyalgia Association & Clinical Physical Therapy Board',
    summary: 'Prevent the "boom-and-bust" cycle by halting activity at 70% of your maximum capacity before a flare triggers.',
    keyPoints: [
      'Stop physical tasks when you still feel like you have 20-30% left in reserve.',
      'Schedule 15 minutes of horizontal non-screen rest between active intervals.',
      'Log low-grade triggers early to catch a flare before it cascades.',
    ],
  },
  {
    id: 'art-3',
    title: 'Senior Independence & Daily Routine Safety for Living Comfortably Alone',
    category: 'Senior Wellness',
    readTime: '3 min read',
    verifiedBy: 'National Council on Aging (NCOA)',
    summary: 'Simple, unhurried routines that maintain cardiovascular stability, joint flexibility, and reassurance for distant family.',
    keyPoints: [
      'Pair morning pills with an anchor habit (e.g. morning tea or making the bed).',
      'Hydrate before standing up quickly to prevent postural dizziness.',
      'Check in with Sathi or family at a predictable hour every morning for peace of mind.',
    ],
  },
  {
    id: 'art-4',
    title: 'Understanding PCOS & Endometriosis Co-Occurrence: Inflammation & Hormonal Baselines',
    category: 'PCOS & Endo',
    readTime: '6 min read',
    verifiedBy: 'Endometriosis Foundation of America & PCOS Challenge Society',
    summary: 'Why simultaneous ovarian insulin resistance and inflammatory pelvic implants require combined tracking of metabolic markers and cycle timing.',
    keyPoints: [
      'Insulin surges can worsen prostaglandin inflammation.',
      'Tracking digestive symptoms alongside cycle days isolates endometriosis bowel adhesions.',
      'Balanced protein intake with complex carbohydrates stabilizes cortisol.',
    ],
  },
];

export const SEED_CHRONIC_PROFILE = CHRONIC_PROFILE;
export const SEED_ELDERLY_PROFILE = ELDERLY_PROFILE;
export const SEED_CHRONIC_REMINDERS = INITIAL_CHRONIC_REMINDERS;
export const SEED_ELDERLY_REMINDERS = INITIAL_REMINDERS;
export const SEED_CHRONIC_LOGS = SAMPLE_CHRONIC_LOGS;
export const SEED_ELDERLY_LOGS = SAMPLE_ELDERLY_LOGS;

// Memory cache fallback for sandboxed iframe environments
const memoryCache: Record<string, string> = {};

function safeStorageGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
  } catch {
    // Graceful in-memory fallback
  }
  return memoryCache[key] ?? null;
}

function safeStorageSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch {
    // Graceful in-memory fallback
  }
  memoryCache[key] = value;
}

// Helper to get local data safely
export function getSavedProfile(): UserProfile {
  try {
    const raw = safeStorageGet('sathi_user_profile');
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback to initial
  }
  return CHRONIC_PROFILE;
}

export function loadProfile(): UserProfile {
  return getSavedProfile();
}

export function saveProfile(profile: UserProfile): void {
  try {
    safeStorageSet('sathi_user_profile', JSON.stringify(profile));
  } catch {
    // Handled
  }
}

export function getSavedLogs(persona: 'chronic' | 'elderly'): SymptomLog[] {
  try {
    const raw = safeStorageGet(`sathi_logs_${persona}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return persona === 'elderly' ? SAMPLE_ELDERLY_LOGS : SAMPLE_CHRONIC_LOGS;
}

export function loadSymptomLogs(persona: 'chronic' | 'elderly' = 'chronic'): SymptomLog[] {
  return getSavedLogs(persona);
}

export function saveLogs(persona: 'chronic' | 'elderly', logs: SymptomLog[]): void {
  try {
    safeStorageSet(`sathi_logs_${persona}`, JSON.stringify(logs));
  } catch {
    // Handled
  }
}

export function saveSymptomLogs(logs: SymptomLog[]): void {
  const profile = getSavedProfile();
  saveLogs(profile.persona, logs);
}

export function getSavedReminders(persona: 'chronic' | 'elderly'): Reminder[] {
  try {
    const raw = safeStorageGet(`sathi_reminders_${persona}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return persona === 'elderly' ? INITIAL_REMINDERS : INITIAL_CHRONIC_REMINDERS;
}

export function loadReminders(persona: 'chronic' | 'elderly' = 'chronic'): Reminder[] {
  return getSavedReminders(persona);
}

export function saveReminders(arg1: 'chronic' | 'elderly' | Reminder[], arg2?: Reminder[]): void {
  try {
    if (Array.isArray(arg1)) {
      const profile = getSavedProfile();
      safeStorageSet(`sathi_reminders_${profile.persona}`, JSON.stringify(arg1));
    } else {
      safeStorageSet(`sathi_reminders_${arg1}`, JSON.stringify(arg2 || []));
    }
  } catch {
    // Handled
  }
}

export function loadChatMessages(): ChatMessage[] {
  try {
    const raw = safeStorageGet('sathi_chat_messages');
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return [
    {
      id: 'init-msg-1',
      role: 'assistant',
      content:
        "Hello Maya. I'm Sathi, your care companion. I'm here to support your daily comfort, monitor pain patterns, and ensure your doctor sees your true clinical picture. How are you feeling right now?",
      timestamp: new Date().toISOString(),
      suggestedAction: {
        title: 'Log Today’s Symptom & Pain Level',
        type: 'log_symptom',
        detail: 'Updates your 7-day trajectory chart and physician summary',
      },
    },
  ];
}

export function saveChatMessages(messages: ChatMessage[]): void {
  try {
    safeStorageSet('sathi_chat_messages', JSON.stringify(messages));
  } catch {
    // Handled
  }
}

export function exportAllHealthData(): void {
  const profile = getSavedProfile();
  const logs = getSavedLogs(profile.persona);
  const reminders = getSavedReminders(profile.persona);
  const messages = loadChatMessages();

  const exportPayload = {
    exportDate: new Date().toISOString(),
    standard: 'SATHI-HIPAA-GDPR-PATIENT-EXPORT-V1',
    profile,
    logs,
    reminders,
    chatMessagesCount: messages.length,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `sathi-health-data-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function clearAllHealthData(): void {
  try {
    localStorage.removeItem('sathi_user_profile');
    localStorage.removeItem('sathi_logs_chronic');
    localStorage.removeItem('sathi_logs_elderly');
    localStorage.removeItem('sathi_reminders_chronic');
    localStorage.removeItem('sathi_reminders_elderly');
    localStorage.removeItem('sathi_chat_messages');
  } catch (e) {
    console.error('Error clearing data:', e);
  }
}
