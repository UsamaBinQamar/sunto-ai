
-- First, let's modify the existing versioni table to add the refinement chain functionality
ALTER TABLE public.versioni 
ADD COLUMN refined_from_version_id UUID REFERENCES public.versioni(id) ON DELETE SET NULL;

-- Create CustomPrompts table for user-defined reusable prompts  
CREATE TABLE public.custom_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    titolo TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    creato_il TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index for better query performance
CREATE INDEX idx_custom_prompts_utente_id ON public.custom_prompts(utente_id);
CREATE INDEX idx_versioni_refined_from ON public.versioni(refined_from_version_id);
CREATE INDEX idx_versioni_documento_id_created ON public.versioni(documento_id, creato_il);

-- Enable RLS on custom_prompts table
ALTER TABLE public.custom_prompts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_prompts
CREATE POLICY "Users can view their own custom prompts" ON public.custom_prompts
    FOR SELECT USING (utente_id = auth.uid());

CREATE POLICY "Users can insert their own custom prompts" ON public.custom_prompts
    FOR INSERT WITH CHECK (utente_id = auth.uid());

CREATE POLICY "Users can update their own custom prompts" ON public.custom_prompts
    FOR UPDATE USING (utente_id = auth.uid());

CREATE POLICY "Users can delete their own custom prompts" ON public.custom_prompts
    FOR DELETE USING (utente_id = auth.uid());

-- Create a storage bucket for uploaded files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false);

-- Create storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" ON storage.objects
    FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
