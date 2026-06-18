import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getOverview() {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [{ count: totalClients }, { count: sessionsToday }, { count: sessionsWeek }, { count: sessionsMonth }] =
      await Promise.all([
        this.supabase.db.from('clients').select('id', { count: 'exact', head: true }),
        this.supabase.db.from('sessions').select('id', { count: 'exact', head: true }).gte('created_at', today),
        this.supabase.db.from('sessions').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
        this.supabase.db.from('sessions').select('id', { count: 'exact', head: true }).gte('created_at', monthAgo),
      ]);

    // Returning clients: clients with more than 1 session
    const { data: returningData } = await this.supabase.db
      .rpc('get_returning_clients_count');

    return {
      total_clients: totalClients ?? 0,
      sessions_today: sessionsToday ?? 0,
      sessions_this_week: sessionsWeek ?? 0,
      sessions_this_month: sessionsMonth ?? 0,
      returning_clients: returningData ?? 0,
      new_clients: (totalClients ?? 0) - (returningData ?? 0),
    };
  }

  async getRetention(period: 'week' | 'month') {
    const days = period === 'week' ? 7 : 30;
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data } = await this.supabase.db
      .from('sessions')
      .select('created_at, client_id')
      .gte('created_at', from)
      .order('created_at');

    // Aggregate by date
    const map: Record<string, { new: number; returning: number }> = {};
    const seen = new Set<string>();
    for (const row of data ?? []) {
      const date = row.created_at.split('T')[0] as string;
      if (!map[date]) map[date] = { new: 0, returning: 0 };
      if (row.client_id) {
        if (seen.has(row.client_id)) map[date].returning++;
        else { map[date].new++; seen.add(row.client_id); }
      } else {
        map[date].new++;
      }
    }

    return Object.entries(map).map(([date, counts]) => ({ date, ...counts }));
  }

  async getServicePopularity() {
    const { data } = await this.supabase.db
      .from('suggestions')
      .select('service_name');

    const map: Record<string, number> = {};
    for (const row of data ?? []) {
      map[row.service_name] = (map[row.service_name] ?? 0) + 1;
    }

    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getTopClients() {
    const { data } = await this.supabase.db
      .from('clients')
      .select('*, sessions(count)')
      .order('last_visit', { ascending: false })
      .limit(10);

    return (data ?? []).map(c => ({ ...c, visit_count: c.sessions?.[0]?.count ?? 0 }));
  }
}
