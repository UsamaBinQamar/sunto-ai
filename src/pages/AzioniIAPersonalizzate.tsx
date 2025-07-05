
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Settings2, Edit, Trash2, Zap, Sparkles } from "lucide-react"
import { useAzioniPersonalizzate, useUpdateAzionePersonalizzata, useDeleteAzionePersonalizzata } from "@/hooks/useAzioniPersonalizzate"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from "date-fns"
import { it } from "date-fns/locale"
import CreateActionWizard from "@/components/azioni-ia/CreateActionWizard"

const AzioniIAPersonalizzate = () => {
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false)
  const [editingAction, setEditingAction] = useState<any>(null)
  const [newActionName, setNewActionName] = useState("")
  const [newActionPrompt, setNewActionPrompt] = useState("")

  const { data: azioni, isLoading } = useAzioniPersonalizzate()
  const updateMutation = useUpdateAzionePersonalizzata()
  const deleteMutation = useDeleteAzionePersonalizzata()

  const handleUpdateAction = async () => {
    if (!editingAction || !newActionName.trim() || !newActionPrompt.trim()) {
      return
    }

    await updateMutation.mutateAsync({
      id: editingAction.id,
      updates: {
        nome_azione: newActionName,
        prompt_ai: newActionPrompt
      }
    })

    setEditingAction(null)
    setNewActionName("")
    setNewActionPrompt("")
  }

  const handleEdit = (action: any) => {
    setEditingAction(action)
    setNewActionName(action.nome_azione)
    setNewActionPrompt(action.prompt_ai || action.prompt_enhanced || "")
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  return (
    <div className="min-h-screen bg-soft-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-gray mb-2 flex items-center">
              <Settings2 className="w-8 h-8 mr-3 text-electric-indigo" />
              Azioni IA Personalizzate
            </h1>
            <p className="text-slate-gray-600">
              Crea e gestisci le tue azioni IA personalizzate con il nostro wizard guidato
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateWizardOpen(true)}
            className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Crea con Wizard
          </Button>
        </div>

        {/* Actions Grid */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-lavender-gray rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-lavender-gray rounded w-full"></div>
                      <div className="h-3 bg-lavender-gray rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !azioni?.length ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-4 bg-lavender-gray rounded-full flex items-center justify-center">
                  <Zap className="w-12 h-12 text-slate-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-gray mb-2">
                  Nessuna azione personalizzata
                </h3>
                <p className="text-slate-gray-600 mb-4">
                  Inizia creando la tua prima azione IA con il nostro wizard guidato
                </p>
                <Button onClick={() => setIsCreateWizardOpen(true)}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Crea Prima Azione
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {azioni.map((azione) => (
                <Card key={azione.id} className="border-lavender-gray hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-slate-gray text-lg flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-electric-indigo" />
                      {azione.nome_azione}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {azione.descrizione_user && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-gray-500 font-medium mb-1">Descrizione originale:</p>
                        <p className="text-xs text-slate-gray-600 line-clamp-2">
                          {azione.descrizione_user}
                        </p>
                      </div>
                    )}
                    <p className="text-slate-gray-600 text-sm mb-4 line-clamp-3">
                      {azione.prompt_enhanced || azione.prompt_ai}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-gray-500">
                        Creata {formatDistanceToNow(new Date(azione.creato_il), { 
                          addSuffix: true, 
                          locale: it 
                        })}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(azione)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Elimina Azione</AlertDialogTitle>
                              <AlertDialogDescription>
                                Sei sicuro di voler eliminare l'azione "{azione.nome_azione}"? 
                                Questa azione non potrà essere recuperata.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(azione.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Elimina
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Create Action Wizard */}
        <CreateActionWizard 
          isOpen={isCreateWizardOpen}
          onOpenChange={setIsCreateWizardOpen}
        />

        {/* Edit Dialog */}
        <Dialog open={!!editingAction} onOpenChange={(open) => !open && setEditingAction(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifica Azione IA</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-action-name">Nome Azione</Label>
                <Input
                  id="edit-action-name"
                  value={newActionName}
                  onChange={(e) => setNewActionName(e.target.value)}
                  placeholder="es. Riassunto Tecnico"
                />
              </div>
              <div>
                <Label htmlFor="edit-action-prompt">Prompt AI</Label>
                <Textarea
                  id="edit-action-prompt"
                  value={newActionPrompt}
                  onChange={(e) => setNewActionPrompt(e.target.value)}
                  placeholder="Descrivi l'azione che l'IA deve eseguire..."
                  rows={4}
                />
              </div>
              <Button
                onClick={handleUpdateAction}
                disabled={updateMutation.isPending || !newActionName.trim() || !newActionPrompt.trim()}
                className="w-full"
              >
                Salva Modifiche
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AzioniIAPersonalizzate
