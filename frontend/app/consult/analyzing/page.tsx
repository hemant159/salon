'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ScanFace, FileText, Database, Wand2 } from 'lucide-react';
import { api } from '@/lib/api';
import { getConsultState, setConsultState } from '@/lib/store';
import { isAuthenticated } from '@/lib/auth';

const STEPS = [
  { label: 'Analyzing facial structure...', icon: ScanFace },
  { label: 'Processing client history...', icon: FileText },
  { label: 'Querying style database...', icon: Database },
  { label: 'Generating recommendations...', icon: Wand2 },
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    const state = getConsultState();
    if (!state.sessionId && state.selectedServiceIds.length === 0) { router.replace('/home'); return; }

    const interval = setInterval(() => {
      setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
    }, 1500);

    const isDemoMode = !state.sessionId || state.sessionId === 'demo-session';

    if (isDemoMode) {
      const mockSuggestions = (state.selectedServiceIds.length > 0 ? state.selectedServiceIds : ['haircut']).flatMap((serviceId, si) => {
        const serviceName = serviceId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return [1, 2, 3].map(rank => ({
          id: `mock-${si}-${rank}`,
          session_id: 'demo-session',
          service_name: serviceName,
          rank,
          style_name: ['Classic Taper', 'Modern Fade', 'Textured Crop', 'Side Part', 'Undercut', 'French Crop'][Math.floor(Math.random() * 6) + rank - 1] ?? `Style ${rank}`,
          description: `A professionally curated ${serviceName.toLowerCase()} recommendation tailored to this customer's facial structure and personal style preferences. This option delivers a clean, modern finish.`,
          compatibility_note: `Highly compatible with the detected face shape and hair texture. This style has a 9${rank}% satisfaction rate for similar profiles.`,
          technique_tips: `Begin with a ${rank === 1 ? 'scissor over comb' : rank === 2 ? 'clipper fade starting at a #2' : 'textured finish using point-cutting'} technique. Work in sections for a precise, clean result. Finish with a light matte product for hold.`,
        }));
      });
      setConsultState({ sessionId: 'demo-session' });
      sessionStorage.setItem('demo_suggestions', JSON.stringify(mockSuggestions));
      setTimeout(() => { clearInterval(interval); router.push('/consult/results'); }, 4000);
      return () => clearInterval(interval);
    }

    api.ai.suggest(state.sessionId!)
      .then(() => {
        clearInterval(interval);
        router.push('/consult/results');
      })
      .catch((err: Error) => {
        clearInterval(interval);
        setError(err.message ?? 'AI generation failed. Please try again.');
      });

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>

      {error ? (
        <div className="panel fu" style={{ padding: '32px 24px', textAlign: 'center', maxWidth: '320px', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Generation Failed</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px', lineHeight: 1.5 }}>{error}</p>
          <button className="btn btn-primary" onClick={() => router.back()}>Go Back</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '280px', width: '100%' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 40px' }}>
            {/* Pulsing ring outer */}
            <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '2px solid var(--purple)', animation: 'pulseRing 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite' }} />
            {/* Inner circle */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 40px rgba(139,92,246,0.5)' }}>
              <Sparkles size={40} className="spin" />
            </div>
          </div>

          <h2 className="fu" style={{ fontSize: '24px', marginBottom: '12px' }}>AI is working...</h2>

          <div style={{ height: '40px', position: 'relative' }}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500,
                    opacity: i === stepIndex ? 1 : 0,
                    transform: i === stepIndex ? 'translateY(0)' : i < stepIndex ? 'translateY(-10px)' : 'translateY(10px)',
                    transition: 'all 0.4s var(--ease)',
                  }}
                >
                  <Icon size={16} />
                  {step.label}
                </div>
              );
            })}
          </div>

          <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden', marginTop: '24px' }}>
            <div style={{
              height: '100%', background: 'var(--purple)', borderRadius: '2px',
              width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
              transition: 'width 1.5s linear',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
