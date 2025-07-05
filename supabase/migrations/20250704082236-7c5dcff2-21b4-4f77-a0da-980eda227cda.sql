
-- Add parent-child relationship support to cartelle table
ALTER TABLE public.cartelle 
ADD COLUMN cartella_padre_id UUID REFERENCES public.cartelle(id) ON DELETE CASCADE;

-- Create index for better performance on parent-child queries
CREATE INDEX idx_cartelle_padre ON public.cartelle(cartella_padre_id);

-- Update the RLS policies to handle nested folder access
DROP POLICY IF EXISTS "Users can view their own cartelle" ON public.cartelle;
CREATE POLICY "Users can view their own cartelle and nested folders" 
  ON public.cartelle 
  FOR SELECT 
  USING (utente_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own cartelle" ON public.cartelle;
CREATE POLICY "Users can insert their own cartelle and nested folders" 
  ON public.cartelle 
  FOR INSERT 
  WITH CHECK (
    utente_id = auth.uid() AND 
    (cartella_padre_id IS NULL OR 
     EXISTS (
       SELECT 1 FROM public.cartelle parent 
       WHERE parent.id = cartella_padre_id AND parent.utente_id = auth.uid()
     ))
  );

DROP POLICY IF EXISTS "Users can update their own cartelle" ON public.cartelle;
CREATE POLICY "Users can update their own cartelle and nested folders" 
  ON public.cartelle 
  FOR UPDATE 
  USING (utente_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own cartelle" ON public.cartelle;
CREATE POLICY "Users can delete their own cartelle and nested folders" 
  ON public.cartelle 
  FOR DELETE 
  USING (utente_id = auth.uid());
