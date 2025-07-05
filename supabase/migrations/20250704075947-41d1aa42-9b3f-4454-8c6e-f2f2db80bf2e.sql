
-- Add RLS policy to allow users to delete their own workflows
CREATE POLICY "Users can delete their own workflows" 
  ON public.workflows 
  FOR DELETE 
  USING (utente_id = auth.uid());
