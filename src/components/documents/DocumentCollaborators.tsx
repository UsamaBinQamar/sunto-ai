
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface DocumentCollaboratorsProps {
  document: any
}

const DocumentCollaborators = ({ document }: DocumentCollaboratorsProps) => {
  const [newComment, setNewComment] = useState("")

  const addComment = () => {
    if (newComment.trim()) {
      // TODO: Implement comment system with backend
      toast.success("Funzionalità commenti in sviluppo")
      setNewComment("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Collaborators */}
      {document.collaboratori && document.collaboratori.length > 0 && (
        <Card className="bg-soft-white border-lavender-gray">
          <CardHeader>
            <CardTitle className="text-slate-gray">Collaboratori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {document.collaboratori.map((collaboratore: any) => (
                <div key={collaboratore.id} className="flex items-center justify-between p-3 bg-lavender-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-electric-indigo text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {collaboratore.utente_id.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-gray">ID: {collaboratore.utente_id.slice(0, 8)}...</p>
                      <p className="text-sm text-slate-gray-600 capitalize">{collaboratore.ruolo}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={collaboratore.stato_invito === 'attivo' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {collaboratore.stato_invito}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Comment - Placeholder for future implementation */}
      <Card className="bg-soft-white border-lavender-gray">
        <CardHeader>
          <CardTitle className="text-slate-gray">Aggiungi commento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Scrivi un commento..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo"
              rows={3}
            />
            <Button 
              onClick={addComment}
              className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
            >
              Pubblica commento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DocumentCollaborators
