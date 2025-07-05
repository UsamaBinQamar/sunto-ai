
import { useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, MessageSquare, Loader2 } from "lucide-react"
import AIMessageBubble from "./AIMessageBubble"

interface AIResultsSectionProps {
  versions: any[]
  refinementVersionId: string | null
  refinementPrompt: string
  onSetRefinementVersion: (versionId: string | null) => void
  onRefinementPromptChange: (prompt: string) => void
  onRefinement: (versionId: string, prompt: string) => void
  onQuickNewAction: (actionType: string) => void
  onSaveVersion: (versionId: string) => void
  onDeleteVersion: (versionId: string) => void
  isProcessing: boolean
}

const AIResultsSection = ({
  versions,
  refinementVersionId,
  refinementPrompt,
  onSetRefinementVersion,
  onRefinementPromptChange,
  onRefinement,
  onQuickNewAction,
  onSaveVersion,
  onDeleteVersion,
  isProcessing
}: AIResultsSectionProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [versions])

  return (
    <Card className="bg-soft-white border-lavender-gray">
      <CardHeader>
        <CardTitle className="text-slate-gray flex items-center">
          <Brain className="w-5 h-5 mr-2 text-electric-indigo" />
          Risultati AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-gray-300 mx-auto mb-4" />
              <p className="text-slate-gray-600">Nessun risultato AI ancora. Esegui una nuova azione sopra!</p>
            </div>
          ) : (
            versions.map((version: any) => (
              <div key={version.id} className="flex flex-col space-y-2">
                <AIMessageBubble
                  version={version}
                  onSetRefinementVersion={onSetRefinementVersion}
                  onQuickNewAction={onQuickNewAction}
                  onSaveVersion={onSaveVersion}
                  onDeleteVersion={onDeleteVersion}
                  isRefinementActive={refinementVersionId === version.id}
                  refinementPrompt={refinementPrompt}
                  onRefinementPromptChange={onRefinementPromptChange}
                  onRefinement={onRefinement}
                  onCancelRefinement={() => {
                    onSetRefinementVersion(null)
                    onRefinementPromptChange('')
                  }}
                  isProcessing={isProcessing}
                />
              </div>
            ))
          )}
          
          {/* Processing Indicator */}
          {isProcessing && (
            <div className="bg-lavender-gray-50 border border-lavender-gray rounded-lg p-4">
              <div className="flex items-center space-x-2 text-slate-gray">
                <Loader2 className="w-4 h-4 animate-spin text-electric-indigo" />
                <span className="text-sm">⏳ L'IA sta elaborando...</span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </CardContent>
    </Card>
  )
}

export default AIResultsSection
