
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Tag = Tables<'tag'>;
type TagInsert = TablesInsert<'tag'>;
type TagUpdate = TablesUpdate<'tag'>;

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tag')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useTag = (id: string) => {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tag')
        .select(`
          *,
          documenti_tag(
            documenti(
              id,
              titolo,
              tipo_documento,
              modificato_il
            )
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

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: TagInsert) => {
      const { data, error } = await supabase
        .from('tag')
        .insert(tag)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag creato con successo');
    },
    onError: (error) => {
      console.error('Error creating tag:', error);
      toast.error('Errore nella creazione del tag');
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TagUpdate }) => {
      const { data, error } = await supabase
        .from('tag')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tag', data.id] });
      toast.success('Tag aggiornato con successo');
    },
    onError: (error) => {
      console.error('Error updating tag:', error);
      toast.error('Errore nell\'aggiornamento del tag');
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tag')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag eliminato con successo');
    },
    onError: (error) => {
      console.error('Error deleting tag:', error);
      toast.error('Errore nell\'eliminazione del tag');
    },
  });
};

export const useAddTagToDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documento_id, tag_id }: { documento_id: string; tag_id: string }) => {
      const { data, error } = await supabase
        .from('documenti_tag')
        .insert({ documento_id, tag_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag aggiunto al documento');
    },
    onError: (error) => {
      console.error('Error adding tag to document:', error);
      toast.error('Errore nell\'aggiunta del tag');
    },
  });
};

export const useRemoveTagFromDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documento_id, tag_id }: { documento_id: string; tag_id: string }) => {
      const { error } = await supabase
        .from('documenti_tag')
        .delete()
        .eq('documento_id', documento_id)
        .eq('tag_id', tag_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag rimosso dal documento');
    },
    onError: (error) => {
      console.error('Error removing tag from document:', error);
      toast.error('Errore nella rimozione del tag');
    },
  });
};
