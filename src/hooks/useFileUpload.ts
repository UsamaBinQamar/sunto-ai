
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, path?: string): Promise<string | null> => {
    try {
      setUploading(true);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : `${user.user.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      return data.path;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Errore durante il caricamento del file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([path]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Errore durante l\'eliminazione del file');
      return false;
    }
  };

  const getFileUrl = (path: string): string => {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    uploading
  };
};
