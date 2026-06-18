import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ServicesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findByGender(gender: string) {
    const { data, error } = await this.supabase.db
      .from('services')
      .select('*')
      .eq('gender', gender)
      .order('name');
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async findById(id: string) {
    const { data } = await this.supabase.db
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  }

  async findByIds(ids: string[]) {
    const { data } = await this.supabase.db
      .from('services')
      .select('*')
      .in('id', ids);
    return data ?? [];
  }
}
