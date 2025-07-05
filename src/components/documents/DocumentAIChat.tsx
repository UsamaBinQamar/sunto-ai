
import { useState } from "react"
import { useVersions, useCreateVersion } from "@/hooks/useVersions"
import { useAIProcessing } from "@/hooks/useAIProcessing"
import { useCustomPrompts } from "@/hooks/useCustomPrompts"
import { toast } from 'sonner'
import OriginalDocumentContent from "./ai-chat/OriginalDocumentContent"
import NewActionControls from "./ai-chat/NewActionControls"
import AIResultsSection from "./ai-chat/AIResultsSection"

interface DocumentAIChatProps {
  document: any
}

const predefinedPrompts = {
  sommario: "Crea un sommario conciso e ben strutturato del seguente contenuto, evidenziando i punti chiave e le informazioni più importanti:",
  punti: "Estrai e organizza i punti principali dal seguente contenuto in una lista chiara e ordinata:",
  note: "Trasforma il seguente contenuto in note di studio ben organizzate, con sezioni chiare e punti salienti evidenziati:"
};

const DocumentAIChat = ({ document }: DocumentAIChatProps) => {
  const [newAction, setNewAction] = useState('')
  const [newPrompt, setNewPrompt] = useState('')
  const [refinementPrompt, setRefinementPrompt] = useState('')
  const [refinementVersionId, setRefinementVersionId] = useState<string | null>(null)
  
  const { data: versions = [], refetch: refetchVersions } = useVersions(document.id)
  const createVersionMutation = useCreateVersion()
  const { processWithAI, isProcessing } = useAIProcessing()
  const { data: customPrompts } = useCustomPrompts()

  // Handle new AI actions based on original document content
  const handleNewAIAction = async () => {
    if (!newAction && !newPrompt.trim()) {
      toast.error('Seleziona un\'azione o inserisci un prompt personalizzato')
      return
    }

    if (!document.contenuto?.trim()) {
      toast.error('Nessun contenuto disponibile per l\'elaborazione')
      return
    }

    try {
      let promptText = '';
      let actionType: 'sommario' | 'punti' | 'note' | 'personalizzato' = 'personalizzato';

      if (newAction && newAction in predefinedPrompts) {
        promptText = predefinedPrompts[newAction as keyof typeof predefinedPrompts];
        actionType = newAction as 'sommario' | 'punti' | 'note';
      } else if (newAction && newAction.startsWith('custom-')) {
        const customPromptId = newAction.replace('custom-', '');
        const prompt = customPrompts?.find(p => p.id === customPromptId);
        if (prompt) {
          promptText = prompt.prompt_text;
          actionType = 'personalizzato';
        }
      } else {
        promptText = newPrompt;
        actionType = 'personalizzato';
      }

      const result = await processWithAI({
        prompt: promptText,
        content: document.contenuto, // Always use original document content
        actionType: actionType
      })

      if (result.success && result.content) {
        await createVersionMutation.mutateAsync({
          documento_id: document.id,
          tipo_output: actionType,
          contenuto_output: result.content,
          refined_from_version_id: null // New actions are never refinements
        })

        setNewAction('')
        setNewPrompt('')
        refetchVersions()
      }
    } catch (error) {
      console.error('Error processing new AI action:', error)
      toast.error('Errore durante l\'elaborazione dell\'azione IA')
    }
  }

  const handleRefinement = async (versionId: string, prompt: string) => {
    if (!prompt.trim()) {
      toast.error('Inserisci un prompt di raffinamento')
      return
    }

    // Find the version being refined
    const versionToRefine = versions.find(v => v.id === versionId)
    if (!versionToRefine) {
      toast.error('Versione da raffinare non trovata')
      return
    }

    try {
      const fullPrompt = `Raffina il seguente contenuto secondo questa richiesta: "${prompt.trim()}"\n\nContenuto da raffinare:`
      
      const result = await processWithAI({
        prompt: fullPrompt,
        content: versionToRefine.contenuto_output, // Use the specific version output for refinement
        actionType: 'personalizzato'
      })

      if (result.success && result.content) {
        await createVersionMutation.mutateAsync({
          documento_id: document.id,
          tipo_output: 'personalizzato',
          contenuto_output: result.content,
          refined_from_version_id: versionId // Mark as refinement
        })

        setRefinementPrompt('')
        setRefinementVersionId(null)
        refetchVersions()
        toast.success('Raffinamento completato!')
      }
    } catch (error) {
      console.error('Error processing refinement:', error)
      toast.error('Errore durante il raffinamento')
    }
  }

  const handleDeleteVersion = async (versionId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo messaggio?')) {
      // TODO: Implement delete version functionality
      toast.info('Funzionalità di eliminazione non ancora implementata')
    }
  }

  const handleSaveVersion = async (versionId: string) => {
    // TODO: Implement save/favorite version functionality
    toast.info('Funzionalità di salvataggio non ancora implementata')
  }

  const handleQuickNewAction = (actionType: string) => {
    setNewAction(actionType)
    handleNewAIAction()
  }

  return (
    <div className="space-y-6">
      <OriginalDocumentContent document={document}>
        <NewActionControls
          newAction={newAction}
          newPrompt={newPrompt}
          onActionChange={setNewAction}
          onPromptChange={setNewPrompt}
          onExecuteAction={handleNewAIAction}
          isProcessing={isProcessing}
          customPrompts={customPrompts}
          hasContent={!!document.contenuto?.trim()}
        />
      </OriginalDocumentContent>

      <AIResultsSection
        versions={versions}
        refinementVersionId={refinementVersionId}
        refinementPrompt={refinementPrompt}
        onSetRefinementVersion={setRefinementVersionId}
        onRefinementPromptChange={setRefinementPrompt}
        onRefinement={handleRefinement}
        onQuickNewAction={handleQuickNewAction}
        onSaveVersion={handleSaveVersion}
        onDeleteVersion={handleDeleteVersion}
        isProcessing={isProcessing}
      />
    </div>
  )
}

export default DocumentAIChat
