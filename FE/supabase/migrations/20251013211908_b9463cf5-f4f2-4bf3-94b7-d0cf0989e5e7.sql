-- Allow anyone to update talents table (since we don't have auth yet)
-- This will allow the presale creation to link the presale_id to the talent

CREATE POLICY "Anyone can update talents"
ON public.talents
FOR UPDATE
USING (true)
WITH CHECK (true);