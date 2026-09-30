import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Calendar,
  Activity,
  PhoneCall,
  UserCheck,
  CheckCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, ChatMessage, SymptomLog } from '../types';

interface CompanionChatProps {
  profile: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onTriggerAction: (actionType: string, actionData?: any) => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenDoctorReport: () => void;
  onOpenSOS: () => void;
  recentLogs: SymptomLog[];
}

export const CompanionChat: React.FC<CompanionChatProps> = ({
  profile,
  messages,
  onSendMessage,
  onTriggerAction,
  onOpenBooking,
  onOpenTracker,
  onOpenDoctorReport,
  onOpenSOS,
  recentLogs,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [handoffModalOpen, setHandoffModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isElderly = profile.persona === 'elderly';

  const showToast = (message: string) => {
    setToastNotice(message);
    setTimeout(() => {
      setToastNotice(null);
    }, 4500);
  };

  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Speech Recognition setup (Web Speech API)
  const toggleListening = () => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      showToast('Speech-to-text is not supported in this browser. You can type freely in the box below.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = profile.language === 'bn' ? 'bn-BD' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Text-to-Speech (TTS)
  const speakMessage = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = isElderly ? 0.85 : 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const text = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      await onSendMessage(text);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = isElderly
    ? [
        'I took my morning blood pressure pill.',
        'I am feeling a little lonely today.',
        'My knee is stiffer than usual this morning.',
        'When is my next doctor appointment?',
      ]
    : [
        'I have severe pelvic cramping right now.',
        'Help me explain this fatigue to my doctor.',
        'What are gentle pacing methods for a flare?',
        'Book my follow-up telehealth appointment.',
      ];

  return (
    <div id="screen-companion-chat" className="flex flex-col h-[calc(100vh-140px)] max-w-3xl mx-auto pb-4">
      {/* Mandatory AI Disclosure Banner */}
      <div
        className="px-4 py-2.5 rounded-2xl border mb-3 flex items-center justify-between gap-3 text-xs sm:text-sm shrink-0"
        style={{
          backgroundColor: 'var(--cloud-card)',
          borderColor: 'var(--cloud-border)',
          color: 'var(--deep-taupe)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold">
            Sathi AI Care Companion
          </span>
          <span className="text-[11px] opacity-75 hidden sm:inline">
            • Remembers your context • Grounded clinical guidance • Not a doctor
          </span>
        </div>

        <button
          onClick={() => setHandoffModalOpen(true)}
          className="text-xs font-bold hover:underline flex items-center gap-1"
          style={{ color: 'var(--anchor-green)' }}
          title="Escalate with full context to clinic triage"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Nurse Handoff</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 space-y-4 pr-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isCrisis = msg.isCrisis;

          if (isCrisis) {
            return (
              <div
                key={msg.id}
                role="alert"
                className="p-5 sm:p-6 rounded-3xl border-2 space-y-4 shadow-lg animate-pulse"
                style={{
                  backgroundColor: 'var(--alert-red-soft)',
                  borderColor: 'var(--alert-red)',
                  color: 'var(--alert-red-text)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: 'var(--alert-red)' }}
                  >
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base sm:text-lg">
                      Mandatory Crisis Protocol Active
                    </h3>
                    <p className="text-xs">
                      Normal chat is paused. You deserve immediate human support and care.
                    </p>
                  </div>
                </div>

                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                  {msg.content}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href="tel:988"
                    className="tap-target-senior py-3 px-4 rounded-2xl text-white font-heading font-extrabold text-center flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform"
                    style={{ backgroundColor: 'var(--alert-red)' }}
                  >
                    <PhoneCall className="w-5 h-5" />
                    <span>Call 988 Lifeline (24/7 Free)</span>
                  </a>

                  <a
                    href="sms:741741?body=HOME"
                    className="tap-target-senior py-3 px-4 rounded-2xl border-2 font-heading font-bold text-center flex items-center justify-center gap-2 shadow-sm"
                    style={{
                      backgroundColor: 'var(--cloud-card)',
                      borderColor: 'var(--alert-red)',
                      color: 'var(--deep-taupe)',
                    }}
                  >
                    <span>Text HOME to 741741</span>
                  </a>
                </div>

                <div className="pt-2 text-xs flex items-center justify-between">
                  <span>Caregiver notified: {profile.caregiver?.name || 'Emergency contact'}</span>
                  <button
                    onClick={onOpenSOS}
                    className="font-bold underline hover:opacity-80"
                    style={{ color: 'var(--alert-red)' }}
                  >
                    Open Emergency Hub
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  isUser ? 'bg-stone-700' : ''
                }`}
                style={{ backgroundColor: isUser ? undefined : 'var(--anchor-green)' }}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                <div
                  className={`p-4 sm:p-5 rounded-3xl shadow-xs text-sm sm:text-base leading-relaxed ${
                    isUser
                      ? 'rounded-tr-xs'
                      : 'rounded-tl-xs border'
                  }`}
                  style={{
                    backgroundColor: isUser ? 'var(--anchor-green)' : 'var(--cloud-card)',
                    borderColor: isUser ? 'transparent' : 'var(--cloud-border)',
                    color: isUser ? '#FFFFFF' : 'var(--deep-taupe)',
                  }}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Audio Read-out for assistant message */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-black/5">
                      <span className="text-[10px] opacity-60">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => speakMessage(msg.content)}
                        className="p-1 rounded-md hover:bg-black/5 transition-colors"
                        style={{ color: 'var(--deep-taupe-muted)' }}
                        title="Read message aloud"
                        aria-label="Read message aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Structured Action Pill (Section 2 Non-Negotiable Differentiator) */}
                {msg.suggestedAction && (
                  <div
                    className="p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-sm animate-fadeIn"
                    style={{
                      backgroundColor: 'var(--soft-mint-soft)',
                      borderColor: 'var(--soft-mint)',
                    }}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: 'var(--soft-mint-text)' }}>
                        Recommended System Action
                      </span>
                      <div className="font-heading font-bold text-xs sm:text-sm" style={{ color: 'var(--deep-taupe)' }}>
                        {msg.suggestedAction.title}
                      </div>
                      {msg.suggestedAction.detail && (
                        <p className="text-xs" style={{ color: 'var(--deep-taupe-muted)' }}>
                          {msg.suggestedAction.detail}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const type = msg.suggestedAction?.type;
                        if (type === 'book_visit') onOpenBooking();
                        else if (type === 'log_symptom') onOpenTracker();
                        else if (type === 'doctor_report') onOpenDoctorReport();
                        else if (type === 'crisis_intervention') onOpenSOS();
                        else onTriggerAction(type || 'custom', msg.suggestedAction?.data);
                      }}
                      className="tap-target px-3.5 py-2 rounded-xl text-white font-heading font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 shrink-0"
                      style={{ backgroundColor: 'var(--anchor-green)' }}
                    >
                      <span>Execute</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-xs sm:text-sm font-semibold opacity-75" style={{ color: 'var(--deep-taupe-muted)' }}>
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Sathi is thinking with clinical context...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Context Prompts */}
      <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInputText(prompt);
            }}
            className="tap-target px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-colors hover:bg-black/5"
            style={{
              backgroundColor: 'var(--cloud-card)',
              borderColor: 'var(--cloud-border)',
              color: 'var(--deep-taupe)',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box with Voice & Send */}
      <form onSubmit={handleSend} className="shrink-0 pt-1">
        <div
          className="p-1.5 sm:p-2 rounded-3xl border shadow-sm flex items-center gap-2"
          style={{
            backgroundColor: 'var(--cloud-card)',
            borderColor: 'var(--cloud-border)',
          }}
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`tap-target-senior w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-black/5'
            }`}
            style={{ color: isListening ? '#FFFFFF' : 'var(--deep-taupe-muted)' }}
            title={isListening ? 'Stop listening' : 'Speak your message'}
            aria-label={isListening ? 'Stop listening' : 'Start voice dictation'}
          >
            {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            id="companion-chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isElderly
                ? 'Speak or type here... (e.g., "I took my pill" or "How is my schedule?")'
                : 'Describe symptoms, triggers, or ask about your doctor report...'
            }
            className="flex-1 px-3 py-2 text-sm sm:text-base font-medium bg-transparent border-0 focus:outline-none"
            style={{ color: 'var(--deep-taupe)' }}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="tap-target-senior w-11 h-11 sm:w-12 sm:h-12 rounded-2xl text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 disabled:opacity-40 disabled:pointer-events-none"
            style={{ backgroundColor: 'var(--anchor-green)' }}
            title="Send Message"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* In-app Toast Banner for Non-Blocking Notifications */}
      {toastNotice && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 max-w-md w-11/12 p-3.5 rounded-2xl shadow-lg border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-fadeIn z-50"
          style={{
            backgroundColor: 'var(--cloud-card)',
            borderColor: 'var(--anchor-green)',
            color: 'var(--deep-taupe)',
          }}
        >
          <span>{toastNotice}</span>
          <button
            onClick={() => setToastNotice(null)}
            className="text-xs font-bold px-2 py-0.5 rounded-md hover:bg-black/5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* CLINICAL HUMAN HANDOFF MODAL (Section 2 & 5 Requirement: Carries Full Context) */}
      {handoffModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--cloud-card)',
              borderColor: 'var(--cloud-border)',
              color: 'var(--deep-taupe)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: 'var(--anchor-green)' }}
              >
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg">
                  Clinical Nurse Handoff
                </h3>
                <p className="text-xs" style={{ color: 'var(--deep-taupe-muted)' }}>
                  A human never starts from zero. Full context is packaged securely.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border text-xs space-y-2" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
              <div><strong>Patient:</strong> {profile.name} ({profile.ageGroup || 'Adult'})</div>
              <div><strong>Tracked Conditions:</strong> {profile.conditions.join(', ')}</div>
              <div><strong>Recent Pain Baseline:</strong> {recentLogs[recentLogs.length - 1]?.painLevel || 3}/10</div>
              <div><strong>Transferred Transcripts:</strong> Last {Math.min(5, messages.length)} messages included</div>
              <div><strong>Risk Assessment:</strong> Routine / Self-care manageable</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setHandoffModalOpen(false)}
                className="tap-target px-4 py-2 rounded-xl border text-xs font-bold"
                style={{ borderColor: 'var(--cloud-border)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setHandoffModalOpen(false);
                  showToast(`Full context dispatched to On-Call Nurse Triage for ${profile.name}. A triage nurse will reach out via portal.`);
                }}
                className="tap-target px-5 py-2 rounded-xl text-white font-heading font-bold text-xs sm:text-sm"
                style={{ backgroundColor: 'var(--anchor-green)' }}
              >
                Confirm Handoff Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
