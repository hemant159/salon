'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { isAuthenticated, getUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { Client } from '@/lib/types';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const user = typeof window !== 'undefined' ? getUser() : null;

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    if (user?.role !== 'admin') { router.replace('/home'); return; }
    fetchClients(1, '');
  }, [router, user?.role]);

  async function fetchClients(p: number, q: string) {
    setLoading(true);
    try {
      const { data, total } = await api.clients.list(p, q);
      setClients(p === 1 ? data : prev => [...prev, ...data]);
      setTotal(total);
      setPage(p);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchClients(1, search);
  }

  return (
    <div className="shell">
      <TopBar title="All Clients" showBack backHref="/admin" />

      <div className="content">
        <div className="fu" style={{ marginBottom: '24px' }}>
          <div className="eyebrow">Admin</div>
          <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Client Directory</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{total} clients on record</p>
        </div>

        <form onSubmit={handleSearch} className="fu1" style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            className="input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
          />
          <button type="submit" className="btn btn-primary" style={{ width: '54px', padding: 0 }} disabled={loading}>
            <Search size={16} />
          </button>
        </form>

        {loading && clients.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Loader2 size={24} className="spin" color="var(--purple)" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {clients.map((client, i) => (
              <div key={client.id} className="panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', animation: `fadeUp 0.3s var(--ease) ${i * 0.05}s both` }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'var(--purple-subtle)', color: 'var(--purple-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 700, flexShrink: 0,
                }}>
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--white)', marginBottom: '2px' }}>{client.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {client.phone}
                    {client.last_visit ? ` · Last visit: ${new Date(client.last_visit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ' · No visits yet'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--purple-light)', lineHeight: 1 }}>{client.visit_count ?? 0}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>visits</div>
                </div>
              </div>
            ))}

            {clients.length < total && (
              <button className="btn btn-ghost" onClick={() => fetchClients(page + 1, search)} disabled={loading} style={{ marginTop: '8px' }}>
                {loading ? <Loader2 size={14} className="spin" /> : 'Load More'}
              </button>
            )}

            {!loading && clients.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                No clients found.
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav active="admin" />
    </div>
  );
}
