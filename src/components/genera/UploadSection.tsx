
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileAudio, FileText, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface UploadSectionProps {
  uploadType: 'recording' | 'transcription';
  onFileSelect: (file: File) => void;
  onUpload: (languageCode?: string) => void;
  onBack: () => void;
  selectedFile: File | null;
  status: 'idle' | 'uploading' | 'processing' | 'completed';
}

export function UploadSection({ 
  uploadType, 
  onFileSelect, 
  onUpload, 
  onBack, 
  selectedFile, 
  status 
}: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('it');

  const isRecording = uploadType === 'recording';
  
  // Define file configurations with AssemblyAI's actual limits
  const fileConfig = {
    recording: {
      audioFormats: '.mp3,.m4a,.wav,.webm,.ogg',
      videoFormats: '.mp4,.mov,.webm',
      allFormats: '.mp3,.m4a,.wav,.webm,.ogg,.mp4,.mov',
      // AssemblyAI supports up to 300MB files
      maxSize: 300, // MB
      error: '❌ Il file supera il limite massimo di 300MB di AssemblyAI. Comprimi o accorcia il file prima di caricarlo.'
    },
    transcription: {
      formats: '.txt,.pdf,.docx,.md',
      maxSize: 10, // MB
      error: '❌ Il documento supera il limite massimo di 10MB. Ti consigliamo di dividere o semplificare il contenuto.'
    }
  };

  const languageOptions = [
    { value: 'it', label: 'Italiano (Predefinito)' },
    { value: 'en', label: 'Inglese' },
    { value: 'es', label: 'Spagnolo' },
    { value: 'de', label: 'Tedesco' },
    { value: 'fr', label: 'Francese' },
    { value: 'pt', label: 'Portoghese' },
    { value: 'ru', label: 'Russo' },
    { value: 'zh', label: 'Cinese' },
    { value: 'ar', label: 'Arabo' }
  ];

  const validateFile = (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (isRecording) {
      if (fileSizeMB > fileConfig.recording.maxSize) {
        return fileConfig.recording.error;
      }
    } else {
      if (fileSizeMB > fileConfig.transcription.maxSize) {
        return fileConfig.transcription.error;
      }
    }
    
    return null;
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        return;
      }
      
      setValidationError('');
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        return;
      }
      
      setValidationError('');
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadClick = () => {
    if (selectedFile && !validationError) {
      // Pass the selected language code for recordings, undefined for transcriptions
      onUpload(isRecording ? selectedLanguage : undefined);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <div>
            <CardTitle className="flex items-center gap-2">
              {isRecording ? <FileAudio className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              {isRecording ? 'Carica Registrazione' : 'Carica Trascrizione'}
            </CardTitle>
            <CardDescription>
              {isRecording 
                ? 'Seleziona un file audio o video per la trascrizione automatica con AssemblyAI'
                : 'Seleziona un documento PDF, TXT, DOCX o MD con la trascrizione'
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {validationError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Trascina e rilascia il file qui
            </p>
            <p className="text-sm text-muted-foreground">
              oppure clicca per selezionare
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={isRecording ? fileConfig.recording.allFormats : fileConfig.transcription.formats}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Language Selection for Recordings */}
        {isRecording && (
          <div className="space-y-2">
            <Label htmlFor="language-select">Lingua della registrazione</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Seleziona la lingua" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* UI Hints */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          {isRecording ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-blue-800">
                <FileAudio className="w-4 h-4" />
                📥 Carica una registrazione
              </div>
              <div className="text-blue-700 space-y-1">
                <p><strong>Formati supportati:</strong> .mp3, .m4a, .wav, .webm, .ogg, .mp4, .mov</p>
                <p><strong>Dimensione massima:</strong> 300MB (AssemblyAI)</p>
                <p><strong>🤖 Trascrizione:</strong> Utilizziamo AssemblyAI per una trascrizione accurata e professionale.</p>
                <p><strong>🌍 Lingua:</strong> Seleziona la lingua principale della registrazione per migliorare la precisione.</p>
                <p><strong>💡 Vantaggi:</strong> File più grandi supportati, migliore qualità e velocità di trascrizione.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-blue-800">
                <FileText className="w-4 h-4" />
                📄 Carica un testo
              </div>
              <div className="text-blue-700 space-y-1">
                <p><strong>Formati supportati:</strong> .txt, .pdf, .docx, .md</p>
                <p><strong>Dimensione massima:</strong> 10MB</p>
                <p><strong>📌 Consiglio:</strong> carica solo il contenuto rilevante per ottenere risultati AI più precisi.</p>
              </div>
            </div>
          )}
        </div>

        {selectedFile && !validationError && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isRecording ? <FileAudio className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                      {isRecording && (
                        <span className="ml-2 text-electric-indigo">
                          • {languageOptions.find(opt => opt.value === selectedLanguage)?.label}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleUploadClick}
                  disabled={status === 'uploading' || status === 'processing'}
                  className="min-w-[120px]"
                >
                  {status === 'uploading' && (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Caricamento...
                    </>
                  )}
                  {status === 'processing' && (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isRecording ? 'Trascrizione...' : 'Elaborazione...'}
                    </>
                  )}
                  {status === 'idle' && 'Carica File'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {status === 'processing' && (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 mx-auto animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">
              {isRecording 
                ? `Trascrizione in corso con AssemblyAI (${languageOptions.find(opt => opt.value === selectedLanguage)?.label}). Questo potrebbe richiedere alcuni minuti...`
                : 'Lettura del documento in corso...'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
