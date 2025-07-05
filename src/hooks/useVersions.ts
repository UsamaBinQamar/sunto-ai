
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Versione = Tables<'versioni'>;
type VersioneInsert = TablesInsert<'versioni'>;

export const useVersions = (documentId: string) => {
  return useQuery({
    queryKey: ['versions', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('versioni')
        .select('*')
        .eq('documento_id', documentId)
        .order('creato_il', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!documentId,
  });
};

export const useCreateVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (version: Omit<VersioneInsert, 'creato_da'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('versioni')
        .insert({ ...version, creato_da: user.user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['versions', data.documento_id] });
      queryClient.invalidateQueries({ queryKey: ['document', data.documento_id] });
      toast.success('Versione creata con successo');
    },
    onError: (error) => {
      console.error('Error creating version:', error);
      toast.error('Errore nella creazione della versione');
    },
  });
};
