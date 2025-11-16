-- Phase 1: Core tables for OnlyPump talent presale platform

-- Talent status enum
CREATE TYPE talent_status AS ENUM ('Rising', 'Breakout', 'A-List');

-- Talents table
CREATE TABLE public.talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  logline TEXT,
  tags TEXT[] DEFAULT '{}',
  socials JSONB DEFAULT '{}',
  progress JSONB DEFAULT '{"auditions": 0, "roles": 0, "majorCredits": [], "awards": [], "milestonePct": 0}',
  status talent_status DEFAULT 'Rising',
  presale_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Presales table
CREATE TABLE public.presales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID REFERENCES public.talents(id) ON DELETE CASCADE NOT NULL,
  mint TEXT,
  start_ts BIGINT NOT NULL,
  end_ts BIGINT NOT NULL,
  soft_cap_lamports BIGINT NOT NULL,
  hard_cap_lamports BIGINT NOT NULL,
  raised_lamports BIGINT DEFAULT 0,
  min_deposit_lamports BIGINT NOT NULL,
  max_deposit_lamports BIGINT NOT NULL,
  is_finalized BOOLEAN DEFAULT false,
  token_acquired TEXT DEFAULT '0',
  vesting JSONB DEFAULT '{"cliffTs": 0, "endTs": 0}',
  whitelist_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User positions table (for tracking user deposits and claims)
CREATE TABLE public.user_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presale_id UUID REFERENCES public.presales(id) ON DELETE CASCADE NOT NULL,
  wallet_address TEXT NOT NULL,
  deposited_lamports BIGINT DEFAULT 0,
  pro_rata_share TEXT DEFAULT '0',
  unlocked_tokens TEXT DEFAULT '0',
  claimed_tokens TEXT DEFAULT '0',
  referral_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(presale_id, wallet_address)
);

-- Update foreign key on talents
ALTER TABLE public.talents 
ADD CONSTRAINT fk_presale 
FOREIGN KEY (presale_id) 
REFERENCES public.presales(id) 
ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_positions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for talents (publicly readable)
CREATE POLICY "Talents are viewable by everyone"
ON public.talents FOR SELECT
USING (true);

-- RLS Policies for presales (publicly readable)
CREATE POLICY "Presales are viewable by everyone"
ON public.presales FOR SELECT
USING (true);

-- RLS Policies for user_positions (users can view their own)
CREATE POLICY "Users can view their own positions"
ON public.user_positions FOR SELECT
USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true);

CREATE POLICY "Users can insert their own positions"
ON public.user_positions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own positions"
ON public.user_positions FOR UPDATE
USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER talents_updated_at
BEFORE UPDATE ON public.talents
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER presales_updated_at
BEFORE UPDATE ON public.presales
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER user_positions_updated_at
BEFORE UPDATE ON public.user_positions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data
INSERT INTO public.talents (handle, name, avatar_url, banner_url, logline, tags, status, progress) VALUES
('bohdan', 'Bohdan', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200', 'From 🇺🇦 to Hollywood dreams', ARRAY['Actor', 'Director', 'Music'], 'Rising', '{"auditions": 12, "roles": 3, "majorCredits": ["Netflix cameo", "140M music video"], "awards": [], "milestonePct": 35}'),
('anna', 'Anna Beats', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200', 'Electronic music producer & visual artist', ARRAY['Music', 'Producer', 'Visual Artist'], 'Breakout', '{"auditions": 8, "roles": 5, "majorCredits": ["Spotify Editorial", "Festival headliner"], "awards": ["Best Electronic Album 2024"], "milestonePct": 60}'),
('cryptoartist', 'CryptoArtist', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200', 'NFT artist bridging Web3 & traditional art', ARRAY['Digital Art', 'NFT', 'Crypto'], 'Rising', '{"auditions": 5, "roles": 2, "majorCredits": ["Gallery exhibition NYC"], "awards": [], "milestonePct": 25}');