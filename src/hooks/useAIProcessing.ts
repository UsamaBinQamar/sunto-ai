
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIProcessingOptions {
  prompt: string;
  content: string;
  actionType: 'sommario' | 'punti' | 'note' | 'personalizzato';
}

interface AIProcessingResult {
  success: boolean;
  content?: string;
  actionType?: string;
  error?: string;
}

export const useAIProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processWithAI = async (options: AIProcessingOptions): Promise<AIProcessingResult> => {
    setIsProcessing(true);
    
    try {
      console.log('Starting AI processing:', options.actionType);
      
      const { data, error } = await supabase.functions.invoke('ai-process', {
        body: {
          prompt: options.prompt,
          content: options.content,
          actionType: options.actionType
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast.error('Errore nella chiamata al servizio IA');
        return { success: false, error: error.message };
      }

      if (!data.success) {
        console.error('AI processing failed:', data.error);
        toast.error(data.error || 'Errore nell\'elaborazione IA');
        return { success: false, error: data.error };
      }

      console.log('AI processing completed successfully');
      toast.success('Elaborazione IA completata con successo!');
      
      return {
        success: true,
        content: data.content,
        actionType: data.actionType
      };

    } catch (error) {
      console.error('Error in AI processing hook:', error);
      toast.error('Errore durante l\'elaborazione IA');
      return { success: false, error: 'Errore interno' };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processWithAI,
    isProcessing
  };
};
