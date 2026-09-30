import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Heart,
  MessageCircle,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { VETTED_RESOURCES } from '../services/storage';
import { ResourceArticle } from '../types';

interface CommunityResourcesProps {
  simplifiedMode?: boolean;
}

export const CommunityResources: React.FC<CommunityResourcesProps> = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'circles'>('resources');
  const [selectedArticle, setSelectedArticle] = useState<ResourceArticle | null>(null);
  const [joinedCircles, setJoinedCircles] = useState<string[]>([]);

  const moderatedCircles = [
    {
      id: 'circ-1',
      title: 'PCOS & Endometriosis Flare Management',
      members: '1,420 members',
      clinicalModerator: 'Dr. Aliyah Sen, MD & Nurse Sarah Lin, RN',
      description: 'A quiet, supportive space focused on evidence-based comfort measures, cycle tracking tips, and doctor appointment preparation.',
      rules: 'Strictly zero unverified detox supplements. Compassion and lived experience validation.',
    },
    {
      id: 'circ-2',
      title: 'Senior Living Independently: Daily Routines & Safety',
      members: '980 members',
      clinicalModerator: 'Dr. Marcus Reed, MD & Geriatric PT Team',
      description: 'Sharing daily habits, gentle chair yoga routines, memory prompts, and encouragement for living confidently on your own.',
      rules: 'Friendly, respectful, and zero spam or solicitation.',
    },
    {
      id: 'circ-3',
      title: 'Autoimmune Fatigue & Chronic Pain Pacing',
      members: '2,150 members',
      clinicalModerator: 'Clinical Occupational Therapy Review Board',
      description: 'Practical strategies for the "energy envelope", avoiding boom-and-bust flare cycles, and workplace accommodations.',
      rules: 'Moderated to prevent toxic positivity and preserve genuine peer solidarity.',
    },
  ];

  return (
    <div id="screen-community-resources" className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div>
        <span
          className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
          style={{
            backgroundColor: 'var(--soft-mint-soft)',
            color: 'var(--soft-mint-text)',
          }}
        >
          Clinician-Vetted • Moderated
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mt-1" style={{ color: 'var(--deep-taupe)' }}>
          Community & Clinical Resources
        </h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--deep-taupe-muted)' }}>
          Grounded medical information and moderated peer circles — never an unmoderated open forum.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl p-1 border text-xs sm:text-sm font-bold" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'resources' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'resources' ? 'var(--cloud-card)' : 'transparent',
            color: activeTab === 'resources' ? 'var(--anchor-green)' : 'var(--deep-taupe)',
          }}
        >
          Vetted Clinical Guides
        </button>
        <button
          onClick={() => setActiveTab('circles')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'circles' ? 'shadow-xs font-bold' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'circles' ? 'var(--cloud-card)' : 'transparent',
            color: activeTab === 'circles' ? 'var(--anchor-green)' : 'var(--deep-taupe)',
          }}
        >
          Moderated Peer Circles
        </button>
      </div>

      {/* Content: Vetted Clinical Guides */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          {VETTED_RESOURCES.map((art) => (
            <div
              key={art.id}
              className="p-5 sm:p-6 rounded-3xl border shadow-xs space-y-3 transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--soft-mint-soft)', color: 'var(--soft-mint-text)' }}
                >
                  {art.category}
                </span>
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--deep-taupe-muted)' }}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{art.readTime}</span>
                </span>
              </div>

              <h3 className="font-heading font-bold text-base sm:text-lg leading-snug" style={{ color: 'var(--deep-taupe)' }}>
                {art.title}
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--deep-taupe-muted)' }}>
                {art.summary}
              </p>

              <div className="p-3.5 rounded-2xl border text-xs space-y-1.5" style={{ backgroundColor: 'var(--cloud-subtle)', borderColor: 'var(--cloud-border)' }}>
                <span className="font-bold text-stone-800 uppercase text-[10px] tracking-wider">
                  Key Clinical Takeaways:
                </span>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  {art.keyPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs" style={{ color: 'var(--deep-taupe-muted)' }}>
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Verified by: {art.verifiedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content: Moderated Circles */}
      {activeTab === 'circles' && (
        <div className="space-y-4">
          <div
            className="p-4 rounded-2xl border flex items-start gap-3"
            style={{ backgroundColor: 'var(--soft-mint-soft)', borderColor: 'var(--soft-mint)' }}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed" style={{ color: 'var(--deep-taupe)' }}>
              <strong>Clinical Moderation Policy:</strong> Every circle is overseen by licensed healthcare professionals. Unverified cure claims, unauthorized supplement links, and medical prescribing are automatically removed to protect vulnerable participants.
            </div>
          </div>

          {moderatedCircles.map((circle) => (
            <div
              key={circle.id}
              className="p-5 sm:p-6 rounded-3xl border shadow-xs space-y-3"
              style={{ backgroundColor: 'var(--cloud-card)', borderColor: 'var(--cloud-border)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-bold text-base sm:text-lg" style={{ color: 'var(--deep-taupe)' }}>
                  {circle.title}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full border bg-stone-100 font-semibold">
                  {circle.members}
                </span>
              </div>

              <p className="text-xs sm:text-sm" style={{ color: 'var(--deep-taupe-muted)' }}>
                {circle.description}
              </p>

              <div className="text-xs space-y-1 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <strong className="text-stone-800">Clinical Moderator:</strong> {circle.clinicalModerator}
                </div>
                <div className="text-stone-600">
                  <strong>Community Guideline:</strong> {circle.rules}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (joinedCircles.includes(circle.id)) {
                      setJoinedCircles(joinedCircles.filter((id) => id !== circle.id));
                    } else {
                      setJoinedCircles([...joinedCircles, circle.id]);
                    }
                  }}
                  className="tap-target px-4 py-2 rounded-xl font-heading font-bold text-xs sm:text-sm shadow-xs hover:scale-105 transition-all flex items-center gap-1.5"
                  style={{
                    backgroundColor: joinedCircles.includes(circle.id) ? 'var(--soft-mint-soft)' : 'var(--anchor-green)',
                    color: joinedCircles.includes(circle.id) ? 'var(--soft-mint-text)' : '#FFFFFF',
                    border: joinedCircles.includes(circle.id) ? '1px solid var(--soft-mint)' : 'none',
                  }}
                >
                  {joinedCircles.includes(circle.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Joined • Guidelines Accepted</span>
                    </>
                  ) : (
                    <span>Join Moderated Circle</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
