'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut } from 'lucide-react';
import { clearAuth } from '@/lib/auth';
import { Profile } from '@/lib/types';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  user?: Profile | null;
}

export default function TopBar({ title, showBack, backHref, user }: TopBarProps) {
  const router = useRouter();

  function handleLogout() {
    clearAuth();
    router.replace('/login');
  }

  function handleBack() {
    if (backHref) router.push(backHref);
    else router.back();
  }

  return (
    <div style={{
      padding: '20px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(5, 5, 5, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {showBack && (
          <button
            onClick={handleBack}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--white)', cursor: 'pointer', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <h1 style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--white)', margin: 0 }}>
          {title}
        </h1>
      </div>

      {user && (
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent', border: 'none', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px',
            textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <LogOut size={14} /> Exit
        </button>
      )}
    </div>
  );
}
