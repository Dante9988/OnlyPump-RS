-- Add sample presale for Anna Beats
INSERT INTO public.presales (
  talent_id,
  start_ts,
  end_ts,
  soft_cap_lamports,
  hard_cap_lamports,
  raised_lamports,
  min_deposit_lamports,
  max_deposit_lamports,
  whitelist_enabled
)
SELECT 
  id,
  EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 day'))::bigint * 1000, -- Started 1 day ago
  EXTRACT(EPOCH FROM (NOW() + INTERVAL '7 days'))::bigint * 1000, -- Ends in 7 days
  50000000000, -- 50 SOL soft cap
  100000000000, -- 100 SOL hard cap
  25000000000, -- 25 SOL raised
  100000000, -- 0.1 SOL min
  10000000000, -- 10 SOL max
  false
FROM public.talents
WHERE handle = 'anna'
RETURNING id;

-- Link presale to talent
UPDATE public.talents
SET presale_id = (
  SELECT id FROM public.presales WHERE talent_id = (
    SELECT id FROM public.talents WHERE handle = 'anna'
  ) 
  ORDER BY created_at DESC 
  LIMIT 1
)
WHERE handle = 'anna';