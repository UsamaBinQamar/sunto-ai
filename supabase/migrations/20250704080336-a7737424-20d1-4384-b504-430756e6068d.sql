
-- Create workflows table
CREATE TABLE public.workflows (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titolo TEXT NOT NULL,
    utente_id UUID NOT NULL,
    creato_il TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    modificato_il TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow_steps table
CREATE TABLE public.workflow_steps (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    ordine INTEGER NOT NULL,
    tipo_azione_ai TEXT NOT NULL CHECK (tipo_azione_ai IN ('sommario', 'punti', 'note', 'personalizzato')),
    parametri_custom TEXT,
    UNIQUE(workflow_id, ordine)
);

-- Add workflow_id column to versioni table
ALTER TABLE public.versioni ADD COLUMN workflow_id UUID REFERENCES public.workflows(id);

-- Add update trigger for workflows
CREATE OR REPLACE FUNCTION public.update_workflows_modified_il()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modificato_il = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workflows_modified_il
    BEFORE UPDATE ON public.workflows
    FOR EACH ROW
    EXECUTE FUNCTION public.update_workflows_modified_il();

-- Enable Row Level Security for workflows
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflows
CREATE POLICY "Users can view their own workflows" ON public.workflows
    FOR SELECT USING (utente_id = auth.uid());

CREATE POLICY "Users can create their own workflows" ON public.workflows
    FOR INSERT WITH CHECK (utente_id = auth.uid());

CREATE POLICY "Users can update their own workflows" ON public.workflows
    FOR UPDATE USING (utente_id = auth.uid());

CREATE POLICY "Users can delete their own workflows" ON public.workflows
    FOR DELETE USING (utente_id = auth.uid());

-- Enable Row Level Security for workflow_steps
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflow_steps
CREATE POLICY "Users can view workflow steps for their workflows" ON public.workflow_steps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workflows 
            WHERE workflows.id = workflow_steps.workflow_id 
            AND workflows.utente_id = auth.uid()
        )
    );

CREATE POLICY "Users can create workflow steps for their workflows" ON public.workflow_steps
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workflows 
            WHERE workflows.id = workflow_steps.workflow_id 
            AND workflows.utente_id = auth.uid()
        )
    );

CREATE POLICY "Users can update workflow steps for their workflows" ON public.workflow_steps
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workflows 
            WHERE workflows.id = workflow_steps.workflow_id 
            AND workflows.utente_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete workflow steps for their workflows" ON public.workflow_steps
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workflows 
            WHERE workflows.id = workflow_steps.workflow_id 
            AND workflows.utente_id = auth.uid()
        )
    );

-- Update RLS policy for versioni to include workflow access
DROP POLICY IF EXISTS "Users can view versions for accessible documents" ON public.versioni;

CREATE POLICY "Users can view versions for accessible documents" ON public.versioni
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.documenti 
            WHERE documenti.id = versioni.documento_id 
            AND (
                documenti.utente_id = auth.uid() 
                OR user_has_document_access(documenti.id, auth.uid())
            )
        )
    );
