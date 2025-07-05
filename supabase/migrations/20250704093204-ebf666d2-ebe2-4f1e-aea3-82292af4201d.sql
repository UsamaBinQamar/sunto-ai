
-- Add new columns to the azioni_personalizzate table for the wizard functionality
ALTER TABLE public.azioni_personalizzate 
ADD COLUMN descrizione_user TEXT,
ADD COLUMN prompt_enhanced TEXT;

-- Update the prompt_ai column to be nullable since we'll now have prompt_enhanced
ALTER TABLE public.azioni_personalizzate 
ALTER COLUMN prompt_ai DROP NOT NULL;
