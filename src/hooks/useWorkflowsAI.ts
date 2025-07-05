
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type WorkflowAI = Tables<'workflows_ai'>;
type WorkflowAIInsert = TablesInsert<'workflows_ai'>;
type WorkflowAIUpdate = TablesUpdate<'workflows_ai'>;
type WorkflowAzione = Tables<'workflow_azioni'>;
type WorkflowAzioneInsert = TablesInsert<'workflow_azioni'>;

export const useWorkflowsAI = () => {
  return useQuery({
    queryKey: ['workflows_ai'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows_ai')
        .select(`
          *,
          workflow_azioni(
            *,
            azioni_personalizzate(*)
          )
        `)
        .order('creato_il', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useWorkflowAI = (id: string) => {
  return useQuery({
    queryKey: ['workflow_ai', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows_ai')
        .select(`
          *,
          workflow_azioni(
            *,
            azioni_personalizzate(*)
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

export const useCreateWorkflowAI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflow: Omit<WorkflowAIInsert, 'utente_id'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workflows_ai')
        .insert({ ...workflow, utente_id: user.user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows_ai'] });
      toast.success('Workflow AI creato con successo');
    },
    onError: (error) => {
      console.error('Error creating AI workflow:', error);
      toast.error('Errore nella creazione del workflow AI');
    },
  });
};

export const useUpdateWorkflowAI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: WorkflowAIUpdate }) => {
      const { data, error } = await supabase
        .from('workflows_ai')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows_ai'] });
      queryClient.invalidateQueries({ queryKey: ['workflow_ai', data.id] });
      toast.success('Workflow AI aggiornato con successo');
    },
    onError: (error) => {
      console.error('Error updating AI workflow:', error);
      toast.error('Errore nell\'aggiornamento del workflow AI');
    },
  });
};

export const useDeleteWorkflowAI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workflows_ai')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows_ai'] });
      toast.success('Workflow AI eliminato con successo');
    },
    onError: (error) => {
      console.error('Error deleting AI workflow:', error);
      toast.error('Errore nell\'eliminazione del workflow AI');
    },
  });
};

export const useAddActionToWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflowAction: WorkflowAzioneInsert) => {
      const { data, error } = await supabase
        .from('workflow_azioni')
        .insert(workflowAction)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows_ai'] });
      queryClient.invalidateQueries({ queryKey: ['workflow_ai', data.workflow_id] });
    },
    onError: (error) => {
      console.error('Error adding action to workflow:', error);
      toast.error('Errore nell\'aggiunta dell\'azione al workflow');
    },
  });
};

export const useRemoveActionFromWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workflow_azioni')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows_ai'] });
    },
    onError: (error) => {
      console.error('Error removing action from workflow:', error);
      toast.error('Errore nella rimozione dell\'azione dal workflow');
    },
  });
};
