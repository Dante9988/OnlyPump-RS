-- Add RLS policies for presales table to allow creation and updates

-- Allow anyone to create a presale (since we don't have auth yet)
CREATE POLICY "Anyone can create a presale"
ON public.presales
FOR INSERT
WITH CHECK (true);

-- Allow updates to presales (for finalizing, updating raised amounts, etc.)
CREATE POLICY "Anyone can update presales"
ON public.presales
FOR UPDATE
USING (true);

-- Allow deletion of presales
CREATE POLICY "Anyone can delete presales"
ON public.presales
FOR DELETE
USING (true);