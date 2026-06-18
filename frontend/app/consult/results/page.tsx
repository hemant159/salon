'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Star, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { getConsultState } from '@/lib/store';
import { isAuthenticated } from '@/lib/auth';
import { Session, Suggestion } from '@/lib/types';
import TopBar from '@/components/layout/TopBar';

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [grouped, setGrouped] = useState<{ serviceName: string; suggestions: Suggestion[] }[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    const state = getConsultState();
    if (!state.sessionId && state.selectedServiceIds.length === 0) { router.replace('/home'); return; }

    const isDemoMode = state.sessionId === 'demo-session' || !state.sessionId;
    if (isDemoMode) {
      try {
        const raw = sessionStorage.getItem('demo_suggestions');
        const suggestions: Suggestion[] = raw ? JSON.parse(raw) : [];
        const groups: Record<string, Suggestion[]> = {};
        suggestions.forEach(sg => {
          if (!groups[sg.service_name]) groups[sg.service_name] = [];
          groups[sg.service_name].push(sg);
        });
        const groupedArray = Object.entries(groups).map(([serviceName, suggestions]) => ({ serviceName, suggestions }));
        setGrouped(groupedArray);
        if (groupedArray[0]) setActiveTab(groupedArray[0].serviceName);
        setSession({ id: 'demo-session', suggestions } as unknown as Session);
      } catch { /* ignore */ }
      setLoading(false);
      return;
    }

    api.sessions.get(state.sessionId!).then(s => {
      setSession(s);
      const groups: Record<string, Suggestion[]> = {};
      s.suggestions?.forEach(sg => {
        if (!groups[sg.service_name]) groups[sg.service_name] = [];
        groups[sg.service_name].push(sg);
      });
      const groupedArray = Object.entries(groups).map(([serviceName, suggestions]) => ({ serviceName, suggestions }));
      setGrouped(groupedArray);
      if (groupedArray.length > 0) setActiveTab(groupedArray[0].serviceName);
    }).finally(() => setLoading(false));
  }, [router]);

  async function handleSelect(suggestionId: string) {
    if (!session || session.id === 'demo-session') {
      router.push('/history');
      return;
    }
    setSelecting(suggestionId);
    try {
      await api.sessions.selectSuggestion(session.id, suggestionId);
      router.push('/history');
    } catch {
      setSelecting(null);
    }
  }

  if (loading) {
    return (
      <div className="shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="spin" color="var(--purple)" />
      </div>
    );
  }

  const activeGroup = grouped.find(g => g.serviceName === activeTab);

  return (
    <div className="shell">
      <TopBar title="Recommendations" showBack backHref="/home" />

      {grouped.length > 1 && (
        <div style={{ position: 'sticky', top: 'var(--top)', zIndex: 40, background: 'rgba(9,9,14,0.95)', borderBottom: '1px solid var(--border)', padding: '12px 22px' }}>
          <div className="tabs">
            {grouped.map(g => (
              <button key={g.serviceName} className={`tab ${activeTab === g.serviceName ? 'active' : ''}`} onClick={() => setActiveTab(g.serviceName)}>
                {g.serviceName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="content">
        <div className="fu" style={{ marginBottom: '24px' }}>
          <div className="eyebrow">Results</div>
          <h2 style={{ fontSize: '26px' }}>AI Suggestions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            Review the tailored options for {activeTab}.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeGroup?.suggestions.sort((a,b) => a.rank - b.rank).map((sg, i) => (
            <div key={sg.id} className={`panel ${i === 0 ? 'panel-selected' : ''}`} style={{ padding: '24px', animation: `fadeUp 0.35s var(--ease) ${i * 0.1}s both` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {i === 0 ? <span className="badge badge-amber"><Star size={10} fill="currentColor" /> Top Pick</span> : <span className="badge badge-outline">Option {sg.rank}</span>}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: i === 0 ? 'var(--white)' : 'var(--text-primary)' }}>{sg.style_name}</h3>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                {sg.description}
              </p>

              <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--r-md)', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--purple-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    <CheckCircle2 size={13} /> Why it works
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sg.compatibility_note}</div>
                </div>
                <div className="divider" style={{ margin: '0' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--purple-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    <Check size={13} /> Barber tips
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sg.technique_tips}</div>
                </div>
              </div>

              <button
                className={`btn ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleSelect(sg.id)}
                disabled={selecting !== null}
              >
                {selecting === sg.id ? <Loader2 size={15} className="spin" /> : null}
                {selecting === sg.id ? 'Saving...' : 'Select This Style'}
                {!selecting && <ChevronRight size={15} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
