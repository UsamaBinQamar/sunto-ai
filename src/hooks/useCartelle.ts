
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Cartella = Tables<'cartelle'>;
type CartellaInsert = TablesInsert<'cartelle'>;
type CartellaUpdate = TablesUpdate<'cartelle'>;

export const useCartelle = () => {
  return useQuery({
    queryKey: ['cartelle'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cartelle')
        .select('*')
        .order('nome_cartella', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useCartelleByParent = (parentId: string | null) => {
  return useQuery({
    queryKey: ['cartelle', 'parent', parentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cartelle')
        .select('*')
        .eq('cartella_padre_id', parentId)
        .order('nome_cartella', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useCartella = (id: string) => {
  return useQuery({
    queryKey: ['cartella', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cartelle')
        .select(`
          *,
          documenti(count)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateCartella = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartella: CartellaInsert) => {
      const { data, error } = await supabase
        .from('cartelle')
        .insert(cartella)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartelle'] });
      toast.success('Cartella creata con successo');
    },
    onError: (error) => {
      console.error('Error creating cartella:', error);
      toast.error('Errore nella creazione della cartella');
    },
  });
};

export const useUpdateCartella = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CartellaUpdate }) => {
      const { data, error } = await supabase
        .from('cartelle')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cartelle'] });
      queryClient.invalidateQueries({ queryKey: ['cartella', data.id] });
      toast.success('Cartella aggiornata con successo');
    },
    onError: (error) => {
      console.error('Error updating cartella:', error);
      toast.error('Errore nell\'aggiornamento della cartella');
    },
  });
};

export const useDeleteCartella = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cartelle')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartelle'] });
      toast.success('Cartella eliminata con successo');
    },
    onError: (error) => {
      console.error('Error deleting cartella:', error);
      toast.error('Errore nell\'eliminazione della cartella');
    },
  });
};
