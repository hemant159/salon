import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface CreateClientDto {
  name: string;
  phone: string;
  gender: string;
  age?: number;
  notes?: string;
}

@Injectable()
export class ClientsService {
  constructor(private readonly supabase: SupabaseService) {}

  async lookupByPhone(phone: string) {
    const { data } = await this.supabase.db
      .from('clients')
      .select('*, sessions(count)')
      .eq('phone', phone)
      .maybeSingle();

    if (!data) return null;

    return {
      ...data,
      visit_count: data.sessions?.[0]?.count ?? 0,
    };
  }

  async create(dto: CreateClientDto) {
    const { data, error } = await this.supabase.db
      .from('clients')
      .insert({ name: dto.name, phone: dto.phone, gender: dto.gender, age: dto.age, notes: dto.notes })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(page = 1, search = '', limit = 20) {
    let query = this.supabase.db
      .from('clients')
      .select('*', { count: 'exact' })
      .order('last_visit', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);
    return { data: data ?? [], total: count ?? 0 };
  }

  async findById(id: string) {
    const { data } = await this.supabase.db
      .from('clients')
      .select('*, sessions(id, created_at, gender, service_ids, status)')
      .eq('id', id)
      .single();
    return data;
  }

  async updateLastVisit(clientId: string) {
    await this.supabase.db
      .from('clients')
      .update({ last_visit: new Date().toISOString() })
      .eq('id', clientId);
  }
}
