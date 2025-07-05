
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data integrity
CREATE TYPE documento_tipo AS ENUM ('trascrizione', 'testo', 'video');
CREATE TYPE documento_stato_ai AS ENUM ('nessuna', 'sommario', 'punti', 'note', 'personalizzato');
CREATE TYPE collaboratore_ruolo AS ENUM ('editor', 'visualizzatore');
CREATE TYPE invito_stato AS ENUM ('attivo', 'in_sospeso');
CREATE TYPE versione_tipo AS ENUM ('sommario', 'punti', 'note', 'personalizzato');

-- Create Cartelle table
CREATE TABLE public.cartelle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_cartella TEXT NOT NULL,
    utente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    creata_il TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create Tag table
CREATE TABLE public.tag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    utente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(nome, utente_id) -- Prevent duplicate tags per user
);

-- Create main Documenti table
CREATE TABLE public.documenti (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titolo TEXT NOT NULL,
    contenuto TEXT,
    tipo_documento documento_tipo NOT NULL,
    stato_ai documento_stato_ai DEFAULT 'nessuna' NOT NULL,
    anteprima_ai TEXT,
    creato_il TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    modificato_il TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    utente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    cartella_id UUID REFERENCES public.cartelle(id) ON DELETE SET NULL,
    pinned BOOLEAN DEFAULT false NOT NULL
);

-- Create Documenti_Tag join table
CREATE TABLE public.documenti_tag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_id UUID REFERENCES public.documenti(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES public.tag(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(documento_id, tag_id) -- Prevent duplicate tag assignments
);

-- Create Collaboratori table
CREATE TABLE public.collaboratori (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_id UUID REFERENCES public.documenti(id) ON DELETE CASCADE NOT NULL,
    utente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    ruolo collaboratore_ruolo NOT NULL,
    stato_invito invito_stato DEFAULT 'in_sospeso' NOT NULL,
    invitato_il TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(documento_id, utente_id) -- Prevent duplicate collaborations
);

-- Create Versioni table
CREATE TABLE public.versioni (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_id UUID REFERENCES public.documenti(id) ON DELETE CASCADE NOT NULL,
    tipo_output versione_tipo NOT NULL,
    contenuto_output TEXT NOT NULL,
    creato_il TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    creato_da UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_documenti_utente_id ON public.documenti(utente_id);
CREATE INDEX idx_documenti_cartella_id ON public.documenti(cartella_id);
CREATE INDEX idx_documenti_tipo ON public.documenti(tipo_documento);
CREATE INDEX idx_documenti_stato_ai ON public.documenti(stato_ai);
CREATE INDEX idx_documenti_creato_il ON public.documenti(creato_il);
CREATE INDEX idx_documenti_modificato_il ON public.documenti(modificato_il);
CREATE INDEX idx_documenti_titolo ON public.documenti USING gin(to_tsvector('italian', titolo));
CREATE INDEX idx_cartelle_utente_id ON public.cartelle(utente_id);
CREATE INDEX idx_tag_utente_id ON public.tag(utente_id);
CREATE INDEX idx_collaboratori_documento_id ON public.collaboratori(documento_id);
CREATE INDEX idx_collaboratori_utente_id ON public.collaboratori(utente_id);
CREATE INDEX idx_versioni_documento_id ON public.versioni(documento_id);

-- Function to update modified_il timestamp
CREATE OR REPLACE FUNCTION update_modified_il()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modificato_il = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update modificato_il on document updates
CREATE TRIGGER trigger_update_documenti_modified_il
    BEFORE UPDATE ON public.documenti
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_il();

-- Enable Row Level Security on all tables
ALTER TABLE public.cartelle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documenti_tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboratori ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.versioni ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Cartelle
CREATE POLICY "Users can view their own cartelle" ON public.cartelle
    FOR SELECT USING (utente_id = auth.uid());

CREATE POLICY "Users can insert their own cartelle" ON public.cartelle
    FOR INSERT WITH CHECK (utente_id = auth.uid());

CREATE POLICY "Users can update their own cartelle" ON public.cartelle
    FOR UPDATE USING (utente_id = auth.uid());

CREATE POLICY "Users can delete their own cartelle" ON public.cartelle
    FOR DELETE USING (utente_id = auth.uid());

-- RLS Policies for Tag
CREATE POLICY "Users can view their own tag" ON public.tag
    FOR SELECT USING (utente_id = auth.uid());

CREATE POLICY "Users can insert their own tag" ON public.tag
    FOR INSERT WITH CHECK (utente_id = auth.uid());

CREATE POLICY "Users can update their own tag" ON public.tag
    FOR UPDATE USING (utente_id = auth.uid());

CREATE POLICY "Users can delete their own tag" ON public.tag
    FOR DELETE USING (utente_id = auth.uid());

-- Security definer function to check document access
CREATE OR REPLACE FUNCTION public.user_has_document_access(doc_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.documenti 
        WHERE id = doc_id AND utente_id = user_id
    ) OR EXISTS (
        SELECT 1 FROM public.collaboratori 
        WHERE documento_id = doc_id AND utente_id = user_id AND stato_invito = 'attivo'
    );
$$;

-- RLS Policies for Documenti
CREATE POLICY "Users can view their own documents and shared documents" ON public.documenti
    FOR SELECT USING (
        utente_id = auth.uid() OR 
        public.user_has_document_access(id, auth.uid())
    );

CREATE POLICY "Users can insert their own documents" ON public.documenti
    FOR INSERT WITH CHECK (utente_id = auth.uid());

CREATE POLICY "Users can update documents they own or have editor access" ON public.documenti
    FOR UPDATE USING (
        utente_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.collaboratori 
            WHERE documento_id = id AND utente_id = auth.uid() 
            AND ruolo = 'editor' AND stato_invito = 'attivo'
        )
    );

CREATE POLICY "Users can delete their own documents" ON public.documenti
    FOR DELETE USING (utente_id = auth.uid());

-- RLS Policies for Documenti_Tag
CREATE POLICY "Users can view tags for accessible documents" ON public.documenti_tag
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.documenti 
            WHERE id = documento_id AND (
                utente_id = auth.uid() OR 
                public.user_has_document_access(id, auth.uid())
            )
        )
    );

CREATE POLICY "Users can manage tags for their own documents" ON public.documenti_tag
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.documenti 
            WHERE id = documento_id AND utente_id = auth.uid()
        )
    );

-- RLS Policies for Collaboratori
CREATE POLICY "Users can view collaborators for their documents and documents shared with them" ON public.collaboratori
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.documenti 
            WHERE id = documento_id AND utente_id = auth.uid()
        ) OR utente_id = auth.uid()
    );

CREATE POLICY "Document owners can manage collaborators" ON public.collaboratori
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.documenti 
            WHERE id = documento_id AND utente_id = auth.uid()
        )
    );

-- RLS Policies for Versioni
CREATE POLICY "Users can view versions for accessible documents" ON public.versioni
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.documenti 
            WHERE id = documento_id AND (
                utente_id = auth.uid() OR 
                public.user_has_document_access(id, auth.uid())
            )
        )
    );

CREATE POLICY "Users can create versions for accessible documents" ON public.versioni
    FOR INSERT WITH CHECK (
        creato_da = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.documenti 
            WHERE id = documento_id AND (
                utente_id = auth.uid() OR 
                public.user_has_document_access(id, auth.uid())
            )
        )
    );

CREATE POLICY "Users can update their own versions" ON public.versioni
    FOR UPDATE USING (creato_da = auth.uid());

CREATE POLICY "Users can delete their own versions" ON public.versioni
    FOR DELETE USING (creato_da = auth.uid());
