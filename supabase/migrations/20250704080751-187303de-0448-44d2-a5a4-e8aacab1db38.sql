
-- Update workflows table structure to match the frontend code
ALTER TABLE public.workflows 
RENAME COLUMN titolo TO nome;

ALTER TABLE public.workflows 
ADD COLUMN descrizione TEXT,
ADD COLUMN stato TEXT NOT NULL DEFAULT 'bozza' 
CHECK (stato IN ('attivo', 'bozza', 'archiviato'));

-- Update workflow_steps table structure to match frontend code
ALTER TABLE public.workflow_steps 
RENAME COLUMN tipo_azione_ai TO tipo_azione;

ALTER TABLE public.workflow_steps 
ADD COLUMN nome TEXT NOT NULL DEFAULT 'Step senza nome',
ADD COLUMN prompt_template TEXT;

-- Remove the old parametri_custom column and rename to match frontend
ALTER TABLE public.workflow_steps 
DROP COLUMN parametri_custom;

-- Update the check constraint for tipo_azione
ALTER TABLE public.workflow_steps 
DROP CONSTRAINT workflow_steps_tipo_azione_ai_check;

ALTER TABLE public.workflow_steps 
ADD CONSTRAINT workflow_steps_tipo_azione_check 
CHECK (tipo_azione IN ('sommario', 'punti', 'note', 'personalizzato'));
