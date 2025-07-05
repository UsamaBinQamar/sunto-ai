
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"
import { useVersions, useCreateVersion } from "@/hooks/useVersions"
import { useCustomPrompts } from "@/hooks/useCustomPrompts"
import { useAIProcessing } from "@/hooks/useAIProcessing"
import { toast } from 'sonner'
import AIActionSelector from "./ai-actions/AIActionSelector"
import CustomPromptInput from "./ai-actions/CustomPromptInput"
import AIProcessingButton from "./ai-actions/AIProcessingButton"

interface DocumentAIActionsProps {
  document: any
}

const predefinedPrompts = {
  sommario: "Crea un sommario conciso e ben strutturato del seguente contenuto, evidenziando i punti chiave e le informazioni più importanti:",
  punti: "Estrai e organizza i punti principali dal seguente contenuto in una lista chiara e ordinata:",
  note: "Trasforma il seguente contenuto in note di studio ben organizzate, con sezioni chiare e punti salienti evidenziati:"
};

const DocumentAIActions = ({ document }: DocumentAIActionsProps) => {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  const { data: versions } = useVersions(document.id);
  const createVersionMutation = useCreateVersion();
  const { data: customPrompts } = useCustomPrompts();
  const { processWithAI, isProcessing } = useAIProcessing();

  const handleProcessing = async () => {
    if (!selectedAction && !customPrompt.trim()) {
      toast.error('Seleziona un\'azione o inserisci un prompt personalizzato');
      return;
    }

    if (!document.contenuto?.trim()) {
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
        content: document.contenuto,
        actionType: actionType
      });

      if (result.success && result.content) {
        await createVersionMutation.mutateAsync({
          documento_id: document.id,
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

  const isDisabled = isProcessing || (!selectedAction && !customPrompt.trim()) || !document.contenuto?.trim();

  return (
    <Card className="bg-soft-white border-lavender-gray">
      <CardHeader>
        <CardTitle className="text-slate-gray flex items-center">
          <Brain className="w-5 h-5 mr-2 text-electric-indigo" />
          Azioni IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AIActionSelector 
          selectedAction={selectedAction}
          onActionChange={setSelectedAction}
          customPrompts={customPrompts}
        />

        <CustomPromptInput
          customPrompt={customPrompt}
          onCustomPromptChange={setCustomPrompt}
        />

        <AIProcessingButton
          isProcessing={isProcessing}
          isDisabled={isDisabled}
          onClick={handleProcessing}
        />

        {!document.contenuto?.trim() && (
          <p className="text-sm text-slate-gray-500 text-center">
            Nessun contenuto disponibile per l'elaborazione
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default DocumentAIActions
