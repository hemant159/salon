-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'barber' check (role in ('admin', 'barber')),
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- Clients (customers — never log in)
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text unique,
  gender text check (gender in ('men', 'women')),
  notes text,
  created_at timestamptz not null default now(),
  last_visit timestamptz
);

-- Services catalogue
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  gender text not null check (gender in ('men', 'women')),
  name text not null,
  icon text,
  description text,
  ai_prompt_template text,
  requires_photo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Consultation sessions
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete set null,
  barber_id uuid not null references public.profiles(id) on delete cascade,
  gender text not null check (gender in ('men', 'women')),
  service_ids uuid[] not null default '{}',
  photo_url text,
  description text,
  ai_raw_response jsonb,
  selected_suggestion_id uuid,
  status text not null default 'pending' check (status in ('pending', 'ai_complete', 'completed')),
  ar_preview_url text,
  ar_ready boolean not null default false,
  created_at timestamptz not null default now()
);

-- AI suggestions (3 per service per session)
create table if not exists public.suggestions (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  service_name text not null,
  rank int not null check (rank between 1 and 3),
  style_name text not null,
  description text,
  compatibility_note text,
  technique_tips text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_sessions_barber on public.sessions(barber_id);
create index if not exists idx_sessions_client on public.sessions(client_id);
create index if not exists idx_sessions_created on public.sessions(created_at desc);
create index if not exists idx_suggestions_session on public.suggestions(session_id);
create index if not exists idx_clients_phone on public.clients(phone);
create index if not exists idx_clients_last_visit on public.clients(last_visit desc);

-- RLS
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.sessions enable row level security;
alter table public.suggestions enable row level security;
alter table public.services enable row level security;

-- Profiles RLS
create policy "profiles_self_read" on public.profiles for select using (auth.uid() = id);
create policy "profiles_admin_all" on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Sessions RLS (barbers see own, admins see all)
create policy "sessions_barber_own" on public.sessions for all using (
  barber_id = auth.uid() or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Suggestions RLS (accessible if you can access the session)
create policy "suggestions_via_session" on public.suggestions for all using (
  exists (
    select 1 from public.sessions s
    where s.id = session_id
    and (s.barber_id = auth.uid() or
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  )
);

-- Clients RLS (any authenticated user)
create policy "clients_authenticated" on public.clients for all using (auth.role() = 'authenticated');

-- Services RLS (read only for all authenticated)
create policy "services_read" on public.services for select using (auth.role() = 'authenticated');

-- Helper function for analytics
create or replace function get_returning_clients_count()
returns bigint
language sql
security definer
as $$
  select count(distinct client_id)
  from public.sessions
  where client_id is not null
  group by client_id
  having count(*) > 1;
$$;

-- =============================================
-- SEED DATA: Services Catalogue
-- =============================================

-- Men's services
insert into public.services (gender, name, icon, description, ai_prompt_template) values
('men', 'Haircut', 'scissors', 'Professional haircut and styling', 'Analyse face shape, hair texture, and density. Recommend 3 specific haircut styles suitable for this male client. Focus on fade types, top length, and texture techniques popular in Indian barbershops.'),
('men', 'Beard Styling', 'beard', 'Beard shaping, trimming and grooming', 'Analyse the jawline, face shape, and existing beard growth in the photo. Recommend 3 beard styles with specific neckline, cheekline, and length guidance.'),
('men', 'Hair Color', 'palette', 'Hair coloring, highlights and treatments', 'Analyse existing hair color, skin tone, and hair texture. Recommend 3 hair color options suitable for Indian male clients, including global color, highlights, or streaks.'),
('men', 'Facial & Skin Treatment', 'sparkles', 'Skin analysis and facial treatments', 'Analyse visible skin tone, texture, and condition. Recommend 3 facial or skin treatment options suitable for this client including cleanup, de-tan, or glow treatments.'),
('men', 'Eyebrow Shaping', 'eye', 'Eyebrow grooming and threading', 'Analyse eyebrow shape and face structure. Recommend 3 eyebrow grooming approaches including arch shape, thickness, and cleanup technique.'),
('men', 'Scalp Treatment', 'droplet', 'Scalp health and hair treatment', 'Analyse visible scalp and hair condition. Recommend 3 scalp care treatments including oil types, massage techniques, or medicated treatments appropriate for this client.'),
('men', 'Mustache Styling', 'scissors', 'Mustache shaping and grooming', 'Analyse upper lip area and face shape. Recommend 3 mustache styles with specific shaping, length, and grooming instructions.'),
('men', 'Hair Texture Treatment', 'wind', 'Smoothening, keratin and texture services', 'Analyse hair texture, frizz level, and condition visible in the photo. Recommend 3 texture treatment options such as smoothening, keratin, or protein treatment.');

-- Women's services
insert into public.services (gender, name, icon, description, ai_prompt_template) values
('women', 'Hairstyle & Haircut', 'scissors', 'Haircut and styling recommendations', 'Analyse face shape, hair texture, length, and density. Recommend 3 hairstyle or haircut options for this female client, including layers, bangs, face-framing, or length suggestions.'),
('women', 'Makeup', 'sparkles', 'Makeup look recommendations', 'Analyse skin tone, face shape, and features. Recommend 3 makeup looks (specify look type, foundation tone range, eye shadow palette direction, lip color family, and finish).'),
('women', 'Hair Color', 'palette', 'Coloring, highlights and balayage', 'Analyse existing hair color, skin tone, and hair condition. Recommend 3 hair color options for Indian women including balayage, ombre, highlights, or full color with specific tone guidance.'),
('women', 'Facial & Skin Treatment', 'sparkles', 'Skin care and facial treatments', 'Analyse visible skin tone, texture, and condition. Recommend 3 facial treatments including glow facial, de-tan, hydration treatment, or cleanup tailored to this client.'),
('women', 'Eyebrow & Threading', 'eye', 'Eyebrow shaping and threading', 'Analyse eyebrow shape, face structure, and natural brow. Recommend 3 eyebrow grooming approaches including arch type, threading pattern, and filling technique.'),
('women', 'Hair Treatment', 'wind', 'Keratin, smoothening and protein treatments', 'Analyse hair frizz, texture, damage level, and thickness visible in the photo. Recommend 3 hair treatment options such as keratin, smoothening, protein, or deep conditioning.'),
('women', 'Bridal Makeup', 'heart', 'Complete bridal makeup consultation', 'This is a bridal makeup consultation. Analyse skin tone and face shape. Recommend 3 complete bridal makeup looks including base coverage, eye look style, lip shade, and finishing touches appropriate for Indian weddings.'),
('women', 'Mehndi & Henna', 'hand', 'Henna design recommendations', 'Based on the hand photo provided, recommend 3 mehndi design styles with specific pattern type (traditional, Arabic, contemporary), coverage density, and signature motifs.'),
('women', 'Hair Styling', 'wind', 'Blowdry, updo and occasion styling', 'Analyse hair length, texture, and volume. Recommend 3 styling options for an occasion including blowdry direction, updo styles, or open hairstyle approaches with finishing product suggestions.'),
('women', 'Nail Art', 'hand', 'Nail design and color recommendations', 'Based on the hand and nail photo, recommend 3 nail art designs with color palette, pattern style, finish type (matte/glossy/chrome), and length/shape suggestion.');
