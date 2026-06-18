'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, UserPlus, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { getConsultState, setConsultState } from '@/lib/store';
import { Client } from '@/lib/types';
import TopBar from '@/components/layout/TopBar';

export default function ClientPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState('');

  const [showRegister, setShowRegister] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    const state = getConsultState();
    if (!state.gender) { router.replace('/home'); return; }
  }, [router]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() || phone.length < 10) return;
    setLoading(true);
    setError('');
    setShowRegister(false);
    try {
      const result = await api.clients.lookup(phone);
      if (result) {
        setClient(result);
      } else {
        setClient(null);
        setShowRegister(true);
      }
    } catch {
      setClient(null);
      setShowRegister(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setRegisterLoading(true);
    setError('');
    try {
      const state = getConsultState();
      const newClient = await api.clients.create({
        name: newName,
        phone: phone,
        gender: state.gender || 'men',
        age: newAge ? parseInt(newAge) : undefined
      });
      
      handleContinue(newClient as any);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to register: ${err.message}`);
    } finally {
      setRegisterLoading(false);
    }
  }

  function handleContinue(selectedClient: Client | null) {
    setConsultState({ client: selectedClient });
    router.push('/consult/capture');
  }

  return (
    <div className="shell">
      <TopBar title="Client Lookup" showBack backHref="/home" />

      <div className="content">
        <div className="fu" style={{ marginBottom: '28px' }}>
          <div className="eyebrow">Step 1 of 4</div>
          <h2 style={{ fontSize: '24px' }}>Who is in the chair?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
            Enter a phone number to fetch history, or proceed as a walk-in.
          </p>
        </div>

        <div className="panel fu1" style={{ padding: '24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label">Phone Number</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="tel"
                  className="input"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary" disabled={loading || phone.length < 10} style={{ width: '54px', padding: 0 }}>
                  {loading ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="error-box fu" style={{ marginTop: '16px' }}>
              {error}
            </div>
          )}

          {client && (
            <div className="fu" style={{ marginTop: '24px' }}>
              <div className="eyebrow-label">Client Found</div>
              <div style={{
                padding: '16px', background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--r-md)',
                display: 'flex', alignItems: 'center', gap: '14px',
              }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: '#10B981', color: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '16px',
                }}>
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--white)' }}>{client.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Visits: {client.visit_count ?? 0}</div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => handleContinue(client)}
                style={{ marginTop: '16px', width: '100%' }}
              >
                Continue with {client.name.split(' ')[0]} <ArrowRight size={15} />
              </button>
            </div>
          )}

          {showRegister && !client && (
            <div className="fu" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <div className="eyebrow-label" style={{ marginBottom: '16px', color: 'var(--purple-light)' }}>New Client Detected</div>
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. John Doe"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Age</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g. 28"
                      value={newAge}
                      onChange={e => setNewAge(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={registerLoading || !newName.trim()} style={{ width: '100%' }}>
                  {registerLoading ? <Loader2 size={18} className="spin" /> : 'Register & Continue'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="divider fu2" />

        <button
          className="btn btn-secondary fu2"
          onClick={() => handleContinue(null)}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <UserPlus size={15} /> Continue as Walk-in
        </button>
      </div>
    </div>
  );
}
