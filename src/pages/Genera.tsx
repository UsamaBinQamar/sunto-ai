
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileAudio, FileText, Loader2 } from 'lucide-react';
import { UploadSection } from '@/components/genera/UploadSection';
import { ProcessingView } from '@/components/genera/ProcessingView';
import { toast } from 'sonner';
import { useCreateDocument } from '@/hooks/useDocuments';
import { useCreateVersion } from '@/hooks/useVersions';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useTranscription } from '@/hooks/useTranscription';
import { useAuth } from '@/hooks/useAuth';

type UploadType = 'recording' | 'transcription' | null;
type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed';

export default function Genera() {
  const { user } = useAuth();
  const [uploadType, setUploadType] = useState<UploadType>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  const createDocumentMutation = useCreateDocument();
  const createVersionMutation = useCreateVersion();
  const { uploadFile } = useFileUpload();
  const { transcribeFile } = useTranscription();

  const handleUploadTypeSelect = (type: UploadType) => {
    setUploadType(type);
    setTranscription('');
    setSelectedFile(null);
    setStatus('idle');
    setDocumentId(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const processRecording = async (file: File, languageCode: string = 'it'): Promise<string> => {
    setStatus('processing');
    
    try {
      console.log('Processing recording with AssemblyAI:', file.name, 'Language:', languageCode);
      
      const result = await transcribeFile(file, { 
        fileName: file.name,
        languageCode 
      });
      
      if (!result.success || !result.transcription) {
        throw new Error(result.error || 'Errore durante la trascrizione');
      }
      
      return result.transcription;
    } catch (error) {
      console.error('Error processing recording:', error);
      throw new Error('❌ Si è verificato un errore durante la trascrizione. Riprova oppure verifica il formato del file.');
    }
  };

  const processTranscription = async (file: File) => {
    setStatus('processing');
    
    try {
      const text = await file.text();
      return text;
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error('Errore durante la lettura del file');
    }
  };

  const handleUpload = async (languageCode?: string) => {
    if (!selectedFile || !user) return;
    
    setStatus('uploading');
    
    try {
      // Upload file to storage
      const filePath = await uploadFile(selectedFile);
      if (!filePath) {
        throw new Error('Failed to upload file');
      }

      let processedContent: string;
      
      if (uploadType === 'recording') {
        processedContent = await processRecording(selectedFile, languageCode || 'it');
      } else if (uploadType === 'transcription') {
        processedContent = await processTranscription(selectedFile);
      } else {
        throw new Error('Invalid upload type');
      }

      // Create document
      const document = await createDocumentMutation.mutateAsync({
        titolo: selectedFile.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        contenuto: processedContent,
        tipo_documento: uploadType === 'recording' ? 'video' : 'testo',
        utente_id: user.id,
        stato_ai: 'nessuna'
      });

      setDocumentId(document.id);
      setTranscription(processedContent);
      setStatus('completed');
      toast.success(uploadType === 'recording' ? 'Registrazione trascritta con successo!' : 'Documento importato con successo!');
    } catch (error) {
      console.error('Error processing upload:', error);
      toast.error(error instanceof Error ? error.message : 'Errore durante l\'elaborazione');
      setStatus('idle');
    }
  };

  const resetFlow = () => {
    setUploadType(null);
    setTranscription('');
    setSelectedFile(null);
    setStatus('idle');
    setDocumentId(null);
  };

  if (status === 'completed' && transcription && documentId) {
    return (
      <ProcessingView 
        transcription={transcription}
        documentId={documentId}
        onReset={resetFlow}
      />
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-soft-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-gray">Genera Trascrizione</h1>
        <p className="text-slate-gray-600">
          Carica una registrazione o una trascrizione esistente per iniziare
        </p>
      </div>

      {!uploadType ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-electric-indigo/50 bg-soft-white border-lavender-gray"
            onClick={() => handleUploadTypeSelect('recording')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-electric-indigo/10 rounded-lg flex items-center justify-center mb-4">
                <FileAudio className="w-6 h-6 text-electric-indigo" />
              </div>
              <CardTitle className="text-slate-gray">Carica una registrazione</CardTitle>
              <CardDescription className="text-slate-gray-600">
                Carica un file audio o video della tua riunione. Utilizziamo AssemblyAI per trasformarlo in testo di alta qualità.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-gray-600 space-y-1">
                <p>• Formati supportati: MP3, M4A, WAV, WebM, OGG, MP4, MOV</p>
                <p>• Dimensione massima: 300MB (AssemblyAI)</p>
                <p>• Trascrizione automatica di alta qualità</p>
                <p>• Supporto multilingue con selezione della lingua</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-electric-indigo/50 bg-soft-white border-lavender-gray"
            onClick={() => handleUploadTypeSelect('transcription')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-electric-indigo/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-electric-indigo" />
              </div>
              <CardTitle className="text-slate-gray">Carica una trascrizione</CardTitle>
              <CardDescription className="text-slate-gray-600">
                Carica un documento con la trascrizione già pronta in formato PDF, TXT, DOCX o MD.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-gray-600 space-y-1">
                <p>• Formati supportati: PDF, TXT, DOCX, MD</p>
                <p>• Dimensione massima: 10MB</p>
                <p>• Importazione immediata</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-2xl">
          <UploadSection
            uploadType={uploadType}
            onFileSelect={handleFileSelect}
            onUpload={handleUpload}
            onBack={() => setUploadType(null)}
            selectedFile={selectedFile}
            status={status}
          />
        </div>
      )}
    </div>
  );
}
