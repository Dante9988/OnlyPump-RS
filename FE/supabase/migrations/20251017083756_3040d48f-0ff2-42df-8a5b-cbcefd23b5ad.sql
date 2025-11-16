-- Create profiles table for authenticated users
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'talent', 'fan');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  talent_id uuid REFERENCES public.talents(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role, talent_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Add user_id to talents table
ALTER TABLE public.talents ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Update talents RLS policies
DROP POLICY IF EXISTS "Anyone can update talents" ON public.talents;
DROP POLICY IF EXISTS "Anyone can create their own talent profile" ON public.talents;

CREATE POLICY "Authenticated users can create talents"
ON public.talents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their talents"
ON public.talents FOR UPDATE
USING (auth.uid() = user_id);

-- Update presales RLS policies
DROP POLICY IF EXISTS "Anyone can create a presale" ON public.presales;
DROP POLICY IF EXISTS "Anyone can delete presales" ON public.presales;
DROP POLICY IF EXISTS "Anyone can update presales" ON public.presales;

CREATE POLICY "Talent owners can create presales"
ON public.presales FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.talents
    WHERE talents.id = presales.talent_id
    AND talents.user_id = auth.uid()
  )
);

CREATE POLICY "Talent owners can update presales"
ON public.presales FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.talents
    WHERE talents.id = presales.talent_id
    AND talents.user_id = auth.uid()
  )
);

CREATE POLICY "Talent owners can delete presales"
ON public.presales FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.talents
    WHERE talents.id = presales.talent_id
    AND talents.user_id = auth.uid()
  )
);

-- Create processed_transactions table for deduplication
CREATE TABLE public.processed_transactions (
  signature text PRIMARY KEY,
  presale_id uuid REFERENCES public.presales(id) NOT NULL,
  wallet_address text NOT NULL,
  amount_lamports bigint NOT NULL,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.processed_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view processed transactions"
ON public.processed_transactions FOR SELECT
USING (true);

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, wallet_address)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'wallet_address'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();