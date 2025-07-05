
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Trash2, Send, Loader2 } from "lucide-react"

interface AIMessageBubbleProps {
  version: any
  onSetRefinementVersion: (versionId: string) => void
  onQuickNewAction: (actionType: string) => void
  onSaveVersion: (versionId: string) => void
  onDeleteVersion: (versionId: string) => void
  isRefinementActive: boolean
  refinementPrompt: string
  onRefinementPromptChange: (prompt: string) => void
  onRefinement: (versionId: string, prompt: string) => void
  onCancelRefinement: () => void
  isProcessing: boolean
}

const AIMessageBubble = ({
  version,
  onSetRefinementVersion,
  onQuickNewAction,
  onSaveVersion,
  onDeleteVersion,
  isRefinementActive,
  refinementPrompt,
  onRefinementPromptChange,
  onRefinement,
  onCancelRefinement,
  isProcessing
}: AIMessageBubbleProps) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActionTypeLabel = (tipo: string) => {
    const labels = {
      'sommario': '📋 Sommario',
      'punti': '📝 Punti Chiave',
      'note': '📚 Note di Studio',
      'personalizzato': '🎯 Personalizzato'
    }
    return labels[tipo as keyof typeof labels] || `🤖 ${tipo}`
  }

  return (
    <div className="bg-electric-indigo-50 border-l-4 border-electric-indigo rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs border-electric-indigo text-electric-indigo">
            {getActionTypeLabel(version.tipo_output)}
          </Badge>
          {version.refined_from_version_id && (
            <Badge variant="secondary" className="text-xs bg-cool-teal text-white">
              🔁 Raffinamento
            </Badge>
          )}
          {!version.refined_from_version_id && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              ✨ Contenuto originale
            </Badge>
          )}
        </div>
        <span className="text-xs text-slate-gray-400">
          {formatTimestamp(version.creato_il)}
        </span>
      </div>
      
      <div className="text-sm text-slate-gray leading-relaxed">
        <pre className="whitespace-pre-wrap font-sans">
          {version.contenuto_output}
        </pre>
      </div>

      {/* Message Actions */}
      <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-electric-indigo-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSetRefinementVersion(version.id)}
          className="text-xs text-electric-indigo hover:text-electric-indigo-700 hover:bg-electric-indigo-50"
        >
          💬 Rifinisci
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onQuickNewAction('sommario')}
          className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          ✨ Nuovo Sommario
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSaveVersion(version.id)}
          className="text-xs text-cool-teal hover:text-cool-teal-700 hover:bg-cool-teal-50"
        >
          <Star className="w-3 h-3 mr-1" />
          Salva
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteVersion(version.id)}
          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Elimina
        </Button>
      </div>

      {/* Refinement Input */}
      {isRefinementActive && (
        <div className="mt-3 pt-2 border-t border-electric-indigo-100 space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
              🔄 Raffinamento di questo risultato
            </Badge>
          </div>
          <Textarea
            value={refinementPrompt}
            onChange={(e) => onRefinementPromptChange(e.target.value)}
            placeholder="Come vuoi raffinare questo contenuto?"
            rows={2}
            className="text-sm border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo text-slate-gray bg-soft-white placeholder:text-slate-gray-400"
          />
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => onRefinement(version.id, refinementPrompt)}
              disabled={isProcessing || !refinementPrompt.trim()}
              className="bg-electric-indigo text-white hover:bg-electric-indigo-600"
            >
              {isProcessing ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Send className="w-3 h-3 mr-1" />
              )}
              Raffina
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelRefinement}
              className="text-slate-gray border-lavender-gray hover:bg-lavender-gray-50"
            >
              Annulla
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIMessageBubble
