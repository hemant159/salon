'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, UserPlus, TrendingUp, CalendarDays, Loader2 } from 'lucide-react';
import { isAuthenticated, getUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { AnalyticsOverview } from '@/lib/types';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const user = typeof window !== 'undefined' ? getUser() : null;

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    if (user?.role !== 'admin') { router.replace('/home'); return; }

    Promise.all([
      api.analytics.overview(),
      api.analytics.services(),
    ]).then(([overview, services]) => {
      setData(overview);
      setChartData(services.slice(0, 5)); // Top 5
    }).finally(() => setLoading(false));
  }, [router, user?.role]);

  if (loading || !data) {
    return (
      <div className="shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="spin" color="var(--purple)" />
      </div>
    );
  }

  const statCards = [
    { label: "Today's Consults", value: data.sessions_today, icon: CalendarDays },
    { label: 'This Week', value: data.sessions_this_week, icon: TrendingUp },
    { label: 'Total Clients', value: data.total_clients, icon: Users },
    { label: 'Returning %', value: data.total_clients ? Math.round((data.returning_clients / data.total_clients) * 100) + '%' : '0%', icon: UserPlus },
  ];

  return (
    <div className="shell">
      <TopBar title="Admin Dashboard" />

      <div className="content">
        <div className="fu" style={{ marginBottom: '24px' }}>
          <div className="eyebrow">Overview</div>
          <h2 style={{ fontSize: '26px' }}>Salon Performance</h2>
        </div>

        <div className="fu1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: 'var(--r-sm)', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-light)' }}>
                    <Icon size={14} />
                  </div>
                </div>
                <div className="stat-num">{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="panel fu2" style={{ padding: '20px', marginBottom: '24px' }}>
          <p className="eyebrow-label">Top Services</p>
          <div style={{ height: '200px', marginTop: '16px', marginLeft: '-16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `${v}`} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--purple)' : 'var(--purple-subtle)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="fu3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p className="eyebrow-label">Management Actions</p>
          <Link href="/admin/clients" className="panel panel-interactive" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}><Users size={15} /></div>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>Client Directory</span>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </Link>
          <Link href="/admin/users" className="panel panel-interactive" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}><UserPlus size={15} /></div>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>Manage Staff</span>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </Link>
        </div>
      </div>

      <BottomNav active="admin" />
    </div>
  );
}

function ChevronRight({ size, color }: { size: number, color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
