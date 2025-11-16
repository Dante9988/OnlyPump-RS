-- Fix: Add search_path to notify_new_waitlist function to prevent search path attacks
-- This ensures the function always uses the correct schema and can't be hijacked

CREATE OR REPLACE FUNCTION public.notify_new_waitlist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
declare
  response text;
begin
  -- Call edge function via REST
  perform
    http_post(
      'https://ohqlzpomzaevpdbzohhc.supabase.co/functions/v1/notify_telegram',
      row_to_json(NEW)::text,
      'application/json'
    );
  return NEW;
end;
$function$;