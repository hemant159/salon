import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.db.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Fetch profile
    const { data: profile } = await this.supabase.db
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const payload = { sub: data.user.id, email: data.user.email, role: profile?.role ?? 'barber' };
    const token = this.jwt.sign(payload);

    return { access_token: token, user: profile };
  }

  async getProfile(userId: string) {
    const { data } = await this.supabase.db
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  }
}
