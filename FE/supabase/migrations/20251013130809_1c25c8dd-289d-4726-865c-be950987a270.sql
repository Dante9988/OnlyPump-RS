-- Fix 1: Drop the insecure SELECT policy that exposes waitlist data publicly
-- This prevents anyone with the anon key from reading sensitive waitlist data
DROP POLICY IF EXISTS "Service role can read all waitlist entries" ON public.waitlist_creators;

-- Fix 2: Add server-side validation constraints
-- Add unique constraint on email to prevent duplicate submissions
ALTER TABLE public.waitlist_creators 
ADD CONSTRAINT waitlist_creators_email_unique UNIQUE (email);

-- Add email format validation at database level
-- This ensures valid email format even if client validation is bypassed
ALTER TABLE public.waitlist_creators
ADD CONSTRAINT waitlist_creators_email_format_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add length constraints to prevent abuse
ALTER TABLE public.waitlist_creators
ADD CONSTRAINT waitlist_creators_email_length_check 
CHECK (length(email) <= 255);

-- Validate role field if present
ALTER TABLE public.waitlist_creators
ADD CONSTRAINT waitlist_creators_role_check 
CHECK (role IS NULL OR role IN ('creator', 'fan', 'investor', 'other'));

-- Validate solana_experience field if present
ALTER TABLE public.waitlist_creators
ADD CONSTRAINT waitlist_creators_solana_exp_check 
CHECK (solana_experience IS NULL OR solana_experience IN ('none', 'beginner', 'intermediate', 'advanced', 'expert', 'done'));