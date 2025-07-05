
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TranscriptionOptions {
  fileName: string;
  languageCode?: string;
}

interface TranscriptionResult {
  success: boolean;
  transcription?: string;
  fileName?: string;
  error?: string;
}

export const useTranscription = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const transcribeFile = async (file: File, options: TranscriptionOptions): Promise<TranscriptionResult> => {
    setIsProcessing(true);
    
    try {
      console.log('Starting transcription for file:', file.name, 'Language:', options.languageCode || 'it');
      
      // Check file size before sending (300MB limit for AssemblyAI)
      const maxSize = 300 * 1024 * 1024; // 300MB
      if (file.size > maxSize) {
        const errorMessage = 'Il file è troppo grande per AssemblyAI (max 300MB). Comprimi o accorcia il file.';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      // Prepare form data for the edge function
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', options.fileName);
      formData.append('languageCode', options.languageCode || 'it');

      const { data, error } = await supabase.functions.invoke('ai-process', {
        body: formData,
      });

      if (error) {
        console.error('Supabase function error:', error);
        const errorMessage = error.message || 'Si è verificato un errore durante la trascrizione.';
        toast.error(`❌ ${errorMessage}`);
        return { success: false, error: errorMessage };
      }

      if (!data.success) {
        console.error('Transcription failed:', data.error);
        const errorMessage = data.error || 'Errore durante la trascrizione';
        toast.error(`❌ ${errorMessage}`);
        return { success: false, error: errorMessage };
      }

      console.log('Transcription completed successfully');
      toast.success('✅ Trascrizione completata con successo usando AssemblyAI!');
      
      return {
        success: true,
        transcription: data.transcription,
        fileName: data.fileName
      };

    } catch (error) {
      console.error('Error in transcription hook:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore interno';
      toast.error(`❌ ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    transcribeFile,
    isProcessing
  };
};
