'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Loader2, User } from 'lucide-react';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Session } from '@/lib/types';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    loadHistory(1);
  }, [router]);

  async function loadHistory(p: number) {
    setLoading(true);
    try {
      const { data, total } = await api.sessions.list(p);
      setSessions(p === 1 ? data : prev => [...prev, ...data]);
      setTotal(total);
      setPage(p);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  return (
    <div className="shell">
      <TopBar title="Consultation History" />

      <div className="content">
        <div className="fu" style={{ marginBottom: '24px' }}>
          <div className="eyebrow">Records</div>
          <h2 style={{ fontSize: '26px' }}>Past Sessions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            {total} total consultations found
          </p>
        </div>

        {loading && sessions.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Loader2 size={24} className="spin" color="var(--purple)" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map((s, i) => (
              <div key={s.id} className="panel panel-interactive" style={{ padding: '20px', animation: `fadeUp 0.3s var(--ease) ${i * 0.05}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--white)' }}>{s.client?.name ?? 'Walk-in Client'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{s.gender}</div>
                    </div>
                  </div>
                  <span className={`badge ${s.status === 'completed' ? 'badge-green' : 'badge-amber'}`}>
                    {s.status}
                  </span>
                </div>

                <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Calendar size={13} color="var(--text-muted)" />
                    {new Date(s.created_at).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Clock size={13} color="var(--text-muted)" />
                    {new Date(s.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <button className="btn btn-secondary" onClick={() => router.push(`/history/${s.id}`)}>
                  View Details
                </button>
              </div>
            ))}

            {sessions.length < total && (
              <button className="btn btn-ghost" onClick={() => loadHistory(page + 1)} disabled={loading} style={{ marginTop: '8px' }}>
                {loading ? <Loader2 size={15} className="spin" /> : 'Load More'}
              </button>
            )}

            {!loading && sessions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                No past sessions found.
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav active="history" />
    </div>
  );
}
