
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, MessageSquare, FileText, Settings, Plus, Loader2, Sparkles } from 'lucide-react';
import { useCreateVersion } from '@/hooks/useVersions';
import { useCustomPrompts, useCreateCustomPrompt } from '@/hooks/useCustomPrompts';
import { useAIProcessing } from '@/hooks/useAIProcessing';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProcessingViewProps {
  transcription: string;
  documentId: string;
  onReset: () => void;
}

const predefinedPrompts = {
  sommario: "Crea un sommario conciso e ben strutturato del seguente contenuto, evidenziando i punti chiave e le informazioni più importanti:",
  punti: "Estrai e organizza i punti principali dal seguente contenuto in una lista chiara e ordinata:",
  note: "Trasforma il seguente contenuto in note di studio ben organizzate, con sezioni chiare e punti salienti evidenziati:"
};

export function ProcessingView({ transcription, documentId, onReset }: ProcessingViewProps) {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  
  const createVersionMutation = useCreateVersion();
  const { data: customPrompts } = useCustomPrompts();
  const createCustomPromptMutation = useCreateCustomPrompt();
  const { processWithAI, isProcessing } = useAIProcessing();

  const handleProcessing = async () => {
    if (!selectedAction && !customPrompt.trim()) {
      toast.error('Seleziona un\'azione o inserisci un prompt personalizzato');
      return;
    }

    if (!transcription?.trim()) {
      toast.error('Nessun contenuto disponibile per l\'elaborazione');
      return;
    }
    
    try {
      let promptText = '';
      let actionType: 'sommario' | 'punti' | 'note' | 'personalizzato' = 'personalizzato';

      if (selectedAction && selectedAction in predefinedPrompts) {
        promptText = predefinedPrompts[selectedAction as keyof typeof predefinedPrompts];
        actionType = selectedAction as 'sommario' | 'punti' | 'note';
      } else if (selectedAction && selectedAction.startsWith('custom-')) {
        const customPromptId = selectedAction.replace('custom-', '');
        const prompt = customPrompts?.find(p => p.id === customPromptId);
        if (prompt) {
          promptText = prompt.prompt_text;
          actionType = 'personalizzato';
        }
      } else {
        promptText = customPrompt;
        actionType = 'personalizzato';
      }

      const result = await processWithAI({
        prompt: promptText,
        content: transcription,
        actionType: actionType
      });

      if (result.success && result.content) {
        await createVersionMutation.mutateAsync({
          documento_id: documentId,
          tipo_output: actionType,
          contenuto_output: result.content
        });

        setSelectedAction('');
        setCustomPrompt('');
      }
    } catch (error) {
      console.error('Error processing content:', error);
      toast.error('Errore durante l\'elaborazione del contenuto');
    }
  };

  const handleCreateCustomPrompt = async () => {
    if (!newPromptTitle.trim() || !newPromptText.trim()) {
      toast.error('Inserisci titolo e testo del prompt');
      return;
    }

    try {
      await createCustomPromptMutation.mutateAsync({
        titolo: newPromptTitle,
        prompt_text: newPromptText
      });
      
      setNewPromptTitle('');
      setNewPromptText('');
      toast.success('Prompt personalizzato salvato!');
    } catch (error) {
      console.error('Error creating custom prompt:', error);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-soft-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-gray">Elaborazione Contenuto</h1>
          <p className="text-slate-gray-600">
            Seleziona un'azione per elaborare il contenuto con l'IA
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onReset} 
          className="border-lavender-gray text-slate-gray hover:bg-lavender-gray"
        >
          Nuova Elaborazione
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Content Preview */}
        <Card className="bg-soft-white border-lavender-gray">
          <CardHeader>
            <CardTitle className="text-slate-gray flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Contenuto Originale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-gray leading-relaxed">
                {transcription}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Processing Options */}
        <div className="space-y-6">
          <Card className="bg-soft-white border-lavender-gray">
            <CardHeader>
              <CardTitle className="text-slate-gray flex items-center">
                <Brain className="w-5 h-5 mr-2 text-electric-indigo" />
                Azioni IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="action-select">Seleziona un'azione predefinita</Label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Scegli un'azione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sommario">📋 Crea Sommario</SelectItem>
                    <SelectItem value="punti">📝 Estrai Punti Chiave</SelectItem>
                    <SelectItem value="note">📚 Crea Note di Studio</SelectItem>
                    {customPrompts?.map((prompt) => (
                      <SelectItem key={prompt.id} value={`custom-${prompt.id}`}>
                        🎯 {prompt.titolo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom-prompt">Oppure usa un prompt personalizzato</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Salva Prompt
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crea Prompt Personalizzato</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="prompt-title">Titolo</Label>
                          <Input
                            id="prompt-title"
                            value={newPromptTitle}
                            onChange={(e) => setNewPromptTitle(e.target.value)}
                            placeholder="Nome del prompt..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="prompt-text">Prompt</Label>
                          <Textarea
                            id="prompt-text"
                            value={newPromptText}
                            onChange={(e) => setNewPromptText(e.target.value)}
                            placeholder="Inserisci il testo del prompt..."
                            rows={4}
                          />
                        </div>
                        <Button onClick={handleCreateCustomPrompt} className="w-full">
                          Salva Prompt
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Descrivi cosa vuoi ottenere dal contenuto..."
                  rows={4}
                  className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo"
                />
              </div>

              <Button 
                onClick={handleProcessing}
                disabled={isProcessing || (!selectedAction && !customPrompt.trim()) || !transcription?.trim()}
                className="w-full bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Elaborazione in corso...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Elabora con IA
                  </>
                )}
              </Button>

              {!transcription?.trim() && (
                <p className="text-sm text-slate-gray-500 text-center">
                  Nessun contenuto disponibile per l'elaborazione
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
