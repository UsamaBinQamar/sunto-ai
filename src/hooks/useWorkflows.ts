
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Workflow = Tables<'workflows'>;
type WorkflowInsert = TablesInsert<'workflows'>;
type WorkflowUpdate = TablesUpdate<'workflows'>;
type WorkflowStep = Tables<'workflow_steps'>;
type WorkflowStepInsert = TablesInsert<'workflow_steps'>;

export const useWorkflows = () => {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select(`
          *,
          workflow_steps(*)
        `)
        .order('creato_il', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useWorkflow = (id: string) => {
  return useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select(`
          *,
          workflow_steps(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflow: Omit<WorkflowInsert, 'utente_id'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workflows')
        .insert({ ...workflow, utente_id: user.user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow creato con successo');
    },
    onError: (error) => {
      console.error('Error creating workflow:', error);
      toast.error('Errore nella creazione del workflow');
    },
  });
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: WorkflowUpdate }) => {
      const { data, error } = await supabase
        .from('workflows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', data.id] });
      toast.success('Workflow aggiornato con successo');
    },
    onError: (error) => {
      console.error('Error updating workflow:', error);
      toast.error('Errore nell\'aggiornamento del workflow');
    },
  });
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow eliminato con successo');
    },
    onError: (error) => {
      console.error('Error deleting workflow:', error);
      toast.error('Errore nell\'eliminazione del workflow');
    },
  });
};

export const useCreateWorkflowStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (step: WorkflowStepInsert) => {
      const { data, error } = await supabase
        .from('workflow_steps')
        .insert(step)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflow', data.workflow_id] });
    },
    onError: (error) => {
      console.error('Error creating workflow step:', error);
      toast.error('Errore nella creazione dello step');
    },
  });
};

export const useDeleteWorkflowStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workflow_steps')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (error) => {
      console.error('Error deleting workflow step:', error);
      toast.error('Errore nell\'eliminazione dello step');
    },
  });
};

export const useUpdateWorkflowStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<WorkflowStep> }) => {
      const { data, error } = await supabase
        .from('workflow_steps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflow', data.workflow_id] });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (error) => {
      console.error('Error updating workflow step:', error);
      toast.error('Errore nell\'aggiornamento dello step');
    },
  });
};
