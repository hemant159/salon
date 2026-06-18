import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as WebSocket from 'ws';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(private config: ConfigService) {
    this.client = createClient(
      this.config.get<string>('SUPABASE_URL') ?? 'https://placeholder.supabase.co',
      this.config.get<string>('SUPABASE_SERVICE_KEY') ?? 'placeholder-service-key',
      {
        realtime: {
          transport: WebSocket as any,
        },
      }
    );
  }

  get db(): SupabaseClient {
    return this.client;
  }
}
