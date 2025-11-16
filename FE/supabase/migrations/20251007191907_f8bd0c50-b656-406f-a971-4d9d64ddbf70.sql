-- Create waitlist_creators table
CREATE TABLE public.waitlist_creators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  socials JSONB,
  has_phantom_wallet BOOLEAN,
  solana_experience TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist_creators ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist_creators 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow service role to read all
CREATE POLICY "Service role can read all waitlist entries" 
ON public.waitlist_creators 
FOR SELECT 
USING (true);

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_creators_email ON public.waitlist_creators(email);

-- Create index on created_at for sorting
CREATE INDEX idx_waitlist_creators_created_at ON public.waitlist_creators(created_at DESC);