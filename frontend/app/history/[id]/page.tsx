'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Loader2, ArrowLeft, Image as ImageIcon, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Session } from '@/lib/types';
import TopBar from '@/components/layout/TopBar';

export default function HistoryDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    
    // In demo mode, we just show placeholder data.
    if (params.id === 'demo-session') {
       setSession({
         id: 'demo-session',
         client: { name: 'Demo Client', phone: '555-0199', gender: 'men' },
         gender: 'men',
         status: 'completed',
         created_at: new Date().toISOString(),
         photo_url: '', // No photo in demo
         suggestions: []
       } as unknown as Session);
       setLoading(false);
       return;
    }

    api.sessions.get(params.id)
      .then(setSession)
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="spin" color="var(--purple)" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Session not found.</p>
        <button className="btn btn-ghost" onClick={() => router.push('/history')} style={{ marginTop: '12px' }}>
          <ArrowLeft size={16} /> Back to History
        </button>
      </div>
    );
  }

  const selectedSuggestion = session.suggestions?.find(s => s.id === session.selected_suggestion_id) 
    || session.suggestions?.[0];

  return (
    <div className="shell">
      <TopBar title="Consultation Details" showBack backHref="/history" />

      <div className="content">
        <div className="panel fu" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div className="eyebrow-label">Client</div>
              <h2 style={{ fontSize: '24px', margin: '4px 0' }}>{session.client?.name ?? 'Walk-in Client'}</h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'capitalize' }}>
                {session.gender} • {session.client?.phone ?? 'No phone provided'}
              </div>
            </div>
            <span className={`badge ${session.status === 'completed' ? 'badge-green' : 'badge-amber'}`}>
              {session.status}
            </span>
          </div>

          <div className="divider" style={{ margin: '16px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Calendar size={15} color="var(--purple-light)" />
              {new Date(session.created_at).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Clock size={15} color="var(--purple-light)" />
              {new Date(session.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {session.photo_url && (
          <div className="fu1" style={{ marginBottom: '24px' }}>
            <div className="eyebrow-label" style={{ marginBottom: '12px' }}>Customer Photo (Secure)</div>
            <div style={{ 
              width: '100%', aspectRatio: '3/4', borderRadius: 'var(--r-md)', 
              overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)'
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={session.photo_url} alt="Customer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
              This image is securely loaded via a temporary signed URL.
            </p>
          </div>
        )}

        {selectedSuggestion && (
          <div className="fu2" style={{ marginBottom: '24px' }}>
            <div className="eyebrow-label" style={{ marginBottom: '12px' }}>Final Service Delivered</div>
            <div className="panel" style={{ padding: '20px', border: '1px solid var(--border-focus)', background: 'var(--bg-card-hover)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Star size={16} fill="var(--purple-light)" color="var(--purple-light)" />
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{selectedSuggestion.style_name}</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                {selectedSuggestion.description}
              </p>
              
              {selectedSuggestion.image_url && (
                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--r-sm)', overflow: 'hidden', marginBottom: '16px' }}>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={selectedSuggestion.image_url} alt="AI Generation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Barber Notes / Tips</div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{selectedSuggestion.technique_tips}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
