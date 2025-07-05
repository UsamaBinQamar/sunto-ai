
-- Fix the RLS policy for inserting nested folders
-- The current policy has a bug where it references the wrong column
DROP POLICY IF EXISTS "Users can insert their own cartelle and nested folders" ON public.cartelle;

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
