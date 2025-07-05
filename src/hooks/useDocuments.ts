
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Documento = Tables<'documenti'>;
type DocumentoInsert = TablesInsert<'documenti'>;
type DocumentoUpdate = TablesUpdate<'documenti'>;

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documenti')
        .select(`
          *,
          cartelle(nome_cartella),
          documenti_tag(
            id,
            tag(id, nome)
          )
        `)
        .order('modificato_il', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useDocument = (id: string) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documenti')
        .select(`
          *,
          cartelle(nome_cartella),
          documenti_tag(
            id,
            tag(id, nome)
          ),
          collaboratori(
            id,
            utente_id,
            ruolo,
            stato_invito
          ),
          versioni(
            id,
            tipo_output,
            contenuto_output,
            creato_il,
            creato_da
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documento: DocumentoInsert) => {
      const { data, error } = await supabase
        .from('documenti')
        .insert(documento)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Documento creato con successo');
    },
    onError: (error) => {
      console.error('Error creating document:', error);
      toast.error('Errore nella creazione del documento');
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DocumentoUpdate }) => {
      const { data, error } = await supabase
        .from('documenti')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', data.id] });
      toast.success('Documento aggiornato con successo');
    },
    onError: (error) => {
      console.error('Error updating document:', error);
      toast.error('Errore nell\'aggiornamento del documento');
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documenti')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Documento eliminato con successo');
    },
    onError: (error) => {
      console.error('Error deleting document:', error);
      toast.error('Errore nell\'eliminazione del documento');
    },
  });
};

export const usePinDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      const { data, error } = await supabase
        .from('documenti')
        .update({ pinned })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', data.id] });
      toast.success(data.pinned ? 'Documento aggiunto ai preferiti' : 'Documento rimosso dai preferiti');
    },
    onError: (error) => {
      console.error('Error pinning document:', error);
      toast.error('Errore nell\'aggiornamento del documento');
    },
  });
};
