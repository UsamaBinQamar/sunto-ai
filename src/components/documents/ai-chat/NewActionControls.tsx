
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"
import AIActionSelector from "../ai-actions/AIActionSelector"

interface NewActionControlsProps {
  newAction: string
  newPrompt: string
  onActionChange: (action: string) => void
  onPromptChange: (prompt: string) => void
  onExecuteAction: () => void
  isProcessing: boolean
  customPrompts?: Array<{ id: string; titolo: string }>
  hasContent: boolean
}

const NewActionControls = ({
  newAction,
  newPrompt,
  onActionChange,
  onPromptChange,
  onExecuteAction,
  isProcessing,
  customPrompts,
  hasContent
}: NewActionControlsProps) => {
  return (
    <div className="space-y-3">
      <AIActionSelector 
        selectedAction={newAction}
        onActionChange={onActionChange}
        customPrompts={customPrompts}
      />

      <div className="space-y-2">
        <label className="text-sm text-slate-gray">Oppure usa un prompt personalizzato</label>
        <Textarea
          value={newPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Descrivi cosa vuoi ottenere dal contenuto originale..."
          rows={3}
          className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo text-slate-gray bg-soft-white placeholder:text-slate-gray-400"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onExecuteAction}
          disabled={isProcessing || (!newAction && !newPrompt.trim()) || !hasContent}
          className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Elaborazione...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Esegui Nuova Azione
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default NewActionControls
