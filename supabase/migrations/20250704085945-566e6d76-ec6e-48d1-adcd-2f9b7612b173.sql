
-- Create the AzioniPersonalizzate table for custom AI actions
CREATE TABLE public.azioni_personalizzate (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_azione TEXT NOT NULL,
  prompt_ai TEXT NOT NULL,
  utente_id UUID NOT NULL,
  creato_il TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for AzioniPersonalizzate
ALTER TABLE public.azioni_personalizzate ENABLE ROW LEVEL SECURITY;

-- Create policies for AzioniPersonalizzate
CREATE POLICY "Users can view their own custom actions" 
  ON public.azioni_personalizzate 
  FOR SELECT 
  USING (utente_id = auth.uid());

CREATE POLICY "Users can create their own custom actions" 
  ON public.azioni_personalizzate 
  FOR INSERT 
  WITH CHECK (utente_id = auth.uid());

CREATE POLICY "Users can update their own custom actions" 
  ON public.azioni_personalizzate 
  FOR UPDATE 
  USING (utente_id = auth.uid());

CREATE POLICY "Users can delete their own custom actions" 
  ON public.azioni_personalizzate 
  FOR DELETE 
  USING (utente_id = auth.uid());

-- Create the WorkflowsAI table
CREATE TABLE public.workflows_ai (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_workflow TEXT NOT NULL,
  utente_id UUID NOT NULL,
  creato_il TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for WorkflowsAI
ALTER TABLE public.workflows_ai ENABLE ROW LEVEL SECURITY;

-- Create policies for WorkflowsAI
CREATE POLICY "Users can view their own workflows" 
  ON public.workflows_ai 
  FOR SELECT 
  USING (utente_id = auth.uid());

CREATE POLICY "Users can create their own workflows" 
  ON public.workflows_ai 
  FOR INSERT 
  WITH CHECK (utente_id = auth.uid());

CREATE POLICY "Users can update their own workflows" 
  ON public.workflows_ai 
  FOR UPDATE 
  USING (utente_id = auth.uid());

CREATE POLICY "Users can delete their own workflows" 
  ON public.workflows_ai 
  FOR DELETE 
  USING (utente_id = auth.uid());

-- Create the WorkflowAzioni linking table
CREATE TABLE public.workflow_azioni (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflows_ai(id) ON DELETE CASCADE,
  azione_id UUID NOT NULL REFERENCES public.azioni_personalizzate(id) ON DELETE CASCADE,
  ordine INTEGER NOT NULL
);

-- Enable RLS for WorkflowAzioni
ALTER TABLE public.workflow_azioni ENABLE ROW LEVEL SECURITY;

-- Create policies for WorkflowAzioni
CREATE POLICY "Users can view workflow actions for their workflows" 
  ON public.workflow_azioni 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.workflows_ai 
    WHERE id = workflow_azioni.workflow_id AND utente_id = auth.uid()
  ));

CREATE POLICY "Users can create workflow actions for their workflows" 
  ON public.workflow_azioni 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.workflows_ai 
    WHERE id = workflow_azioni.workflow_id AND utente_id = auth.uid()
  ));

CREATE POLICY "Users can update workflow actions for their workflows" 
  ON public.workflow_azioni 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.workflows_ai 
    WHERE id = workflow_azioni.workflow_id AND utente_id = auth.uid()
  ));

CREATE POLICY "Users can delete workflow actions for their workflows" 
  ON public.workflow_azioni 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.workflows_ai 
    WHERE id = workflow_azioni.workflow_id AND utente_id = auth.uid()
  ));
