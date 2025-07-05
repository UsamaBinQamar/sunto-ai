
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type CustomPrompt = Tables<'custom_prompts'>;
type CustomPromptInsert = TablesInsert<'custom_prompts'>;
type CustomPromptUpdate = TablesUpdate<'custom_prompts'>;

export const useCustomPrompts = () => {
  return useQuery({
    queryKey: ['custom_prompts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_prompts')
        .select('*')
        .order('creato_il', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateCustomPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prompt: Omit<CustomPromptInsert, 'utente_id'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('custom_prompts')
        .insert({ ...prompt, utente_id: user.user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_prompts'] });
      toast.success('Prompt personalizzato creato con successo');
    },
    onError: (error) => {
      console.error('Error creating custom prompt:', error);
      toast.error('Errore nella creazione del prompt');
    },
  });
};

export const useDeleteCustomPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_prompts'] });
      toast.success('Prompt eliminato con successo');
    },
    onError: (error) => {
      console.error('Error deleting custom prompt:', error);
      toast.error('Errore nell\'eliminazione del prompt');
    },
  });
};
