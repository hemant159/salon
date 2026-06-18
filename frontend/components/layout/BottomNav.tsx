'use client';

import Link from 'next/link';
import { getUser } from '@/lib/auth';

const ITEMS = [
  {
    id: 'home', href: '/home', label: 'Consult',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20V10M18 20V4M6 20v-4" />
      </svg>
    )
  },
  {
    id: 'history', href: '/history', label: 'History',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    )
  },
];

export default function BottomNav({ active }: { active: string }) {
  const user = typeof window !== 'undefined' ? getUser() : null;
  const navItems = [...ITEMS];

  if (user?.role === 'admin') {
    navItems.push({
      id: 'admin', href: '/admin', label: 'Admin',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
      )
    });
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#000000', borderTop: '1px solid var(--border)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        maxWidth: '600px', margin: '0 auto', padding: '12px 24px',
      }}>
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                color: isActive ? 'var(--border-focus)' : 'var(--text-muted)',
                textDecoration: 'none', transition: 'color 0.2s ease',
              }}
            >
              <div style={{
                transition: 'all 0.3s ease',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '10px', letterSpacing: '0.05em', fontWeight: isActive ? 600 : 400, textTransform: 'uppercase' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
