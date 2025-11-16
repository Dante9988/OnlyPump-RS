-- Fix: Remove the problematic trigger and function that's causing form submission to fail
-- The http_post function requires pg_net extension which isn't available

-- Drop the function with CASCADE to also drop dependent triggers
DROP FUNCTION IF EXISTS public.notify_new_waitlist() CASCADE;