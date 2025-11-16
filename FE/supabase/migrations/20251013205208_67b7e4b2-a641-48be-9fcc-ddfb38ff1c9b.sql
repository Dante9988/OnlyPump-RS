-- Add wallet_address to talents table
ALTER TABLE public.talents 
ADD COLUMN wallet_address text;

-- Add index for wallet lookups
CREATE INDEX idx_talents_wallet_address ON public.talents(wallet_address);

-- Create policy for talent self-creation
CREATE POLICY "Anyone can create their own talent profile" 
ON public.talents 
FOR INSERT 
WITH CHECK (true);

-- Update policy for talent updates (only their own profile)
CREATE POLICY "Talents can update their own profile" 
ON public.talents 
FOR UPDATE 
USING (wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));