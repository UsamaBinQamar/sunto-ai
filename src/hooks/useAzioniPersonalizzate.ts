
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type AzionePersonalizzata = Tables<'azioni_personalizzate'>;
type AzionePersonalizzataInsert = TablesInsert<'azioni_personalizzate'>;
type AzionePersonalizzataUpdate = TablesUpdate<'azioni_personalizzate'>;

export const useAzioniPersonalizzate = () => {
  return useQuery({
    queryKey: ['azioni_personalizzate'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('azioni_personalizzate')
        .select('*')
        .order('creato_il', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateAzionePersonalizzata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (azione: Omit<AzionePersonalizzataInsert, 'utente_id'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('azioni_personalizzate')
        .insert({ ...azione, utente_id: user.user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['azioni_personalizzate'] });
      toast.success('Azione personalizzata creata con successo');
    },
    onError: (error) => {
      console.error('Error creating custom action:', error);
      toast.error('Errore nella creazione dell\'azione personalizzata');
    },
  });
};

export const useUpdateAzionePersonalizzata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AzionePersonalizzataUpdate }) => {
      const { data, error } = await supabase
        .from('azioni_personalizzate')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['azioni_personalizzate'] });
      toast.success('Azione personalizzata aggiornata con successo');
    },
    onError: (error) => {
      console.error('Error updating custom action:', error);
      toast.error('Errore nell\'aggiornamento dell\'azione personalizzata');
    },
  });
};

export const useDeleteAzionePersonalizzata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('azioni_personalizzate')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['azioni_personalizzate'] });
      toast.success('Azione personalizzata eliminata con successo');
    },
    onError: (error) => {
      console.error('Error deleting custom action:', error);
      toast.error('Errore nell\'eliminazione dell\'azione personalizzata');
    },
  });
};
