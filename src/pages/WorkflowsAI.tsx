
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Workflow, Edit, Trash2, Play, ArrowRight } from "lucide-react"
import { useWorkflowsAI, useCreateWorkflowAI, useUpdateWorkflowAI, useDeleteWorkflowAI } from "@/hooks/useWorkflowsAI"
import { useAzioniPersonalizzate } from "@/hooks/useAzioniPersonalizzate"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from "date-fns"
import { it } from "date-fns/locale"

const WorkflowsAI = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null)
  const [newWorkflowName, setNewWorkflowName] = useState("")

  const { data: workflows, isLoading } = useWorkflowsAI()
  const { data: azioni } = useAzioniPersonalizzate()
  const createMutation = useCreateWorkflowAI()
  const updateMutation = useUpdateWorkflowAI()
  const deleteMutation = useDeleteWorkflowAI()

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) {
      return
    }

    await createMutation.mutateAsync({
      nome_workflow: newWorkflowName
    })

    setNewWorkflowName("")
    setIsCreateDialogOpen(false)
  }

  const handleUpdateWorkflow = async () => {
    if (!editingWorkflow || !newWorkflowName.trim()) {
      return
    }

    await updateMutation.mutateAsync({
      id: editingWorkflow.id,
      updates: {
        nome_workflow: newWorkflowName
      }
    })

    setEditingWorkflow(null)
    setNewWorkflowName("")
  }

  const handleEdit = (workflow: any) => {
    setEditingWorkflow(workflow)
    setNewWorkflowName(workflow.nome_workflow)
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
              <Workflow className="w-8 h-8 mr-3 text-electric-indigo" />
              Workflows AI
            </h1>
            <p className="text-slate-gray-600">
              Crea e gestisci workflow automatizzati combinando più azioni IA personalizzate
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nuovo Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Crea Nuovo Workflow AI</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workflow-name">Nome Workflow</Label>
                  <Input
                    id="workflow-name"
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                    placeholder="es. Analisi Completa Documento"
                  />
                </div>
                <Button
                  onClick={handleCreateWorkflow}
                  disabled={createMutation.isPending || !newWorkflowName.trim()}
                  className="w-full"
                >
                  Crea Workflow
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Start Section */}
        {(!workflows?.length && !azioni?.length) && (
          <Card className="bg-gradient-to-r from-electric-indigo/5 to-sky-blue/5 border-electric-indigo/20 mb-8">
            <CardHeader>
              <CardTitle className="text-slate-gray flex items-center">
                <Workflow className="w-5 h-5 mr-2 text-electric-indigo" />
                Inizia con i Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-gray-600 mb-4">
                    Per creare workflow, hai bisogno prima di creare alcune azioni IA personalizzate
                  </p>
                  <Button
                    onClick={() => window.location.href = "/azioni-ia-personalizzate"}
                    className="bg-electric-indigo hover:bg-electric-indigo-700 text-white"
                  >
                    Crea Azioni IA <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workflows Grid */}
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
          ) : !workflows?.length ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-4 bg-lavender-gray rounded-full flex items-center justify-center">
                  <Workflow className="w-12 h-12 text-slate-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-gray mb-2">
                  Nessun workflow creato
                </h3>
                <p className="text-slate-gray-600 mb-4">
                  Inizia creando il tuo primo workflow AI automatizzato
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} disabled={!azioni?.length}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crea Primo Workflow
                </Button>
                {!azioni?.length && (
                  <p className="text-sm text-slate-gray-500 mt-2">
                    Crea prima alcune azioni IA personalizzate
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="border-lavender-gray hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-slate-gray text-lg flex items-center">
                      <Workflow className="w-5 h-5 mr-2 text-electric-indigo" />
                      {workflow.nome_workflow}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-slate-gray-600">
                        <span className="w-2 h-2 rounded-full bg-electric-indigo mr-2"></span>
                        {workflow.workflow_azioni?.length || 0} azioni
                      </div>
                      <p className="text-xs text-slate-gray-500">
                        Creato {formatDistanceToNow(new Date(workflow.creato_il), { 
                          addSuffix: true, 
                          locale: it 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-electric-indigo border-electric-indigo hover:bg-electric-indigo hover:text-white"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Esegui
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(workflow)}
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
                              <AlertDialogTitle>Elimina Workflow</AlertDialogTitle>
                              <AlertDialogDescription>
                                Sei sicuro di voler eliminare il workflow "{workflow.nome_workflow}"? 
                                Questa azione non può essere annullata.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(workflow.id)}
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

        {/* Edit Dialog */}
        <Dialog open={!!editingWorkflow} onOpenChange={(open) => !open && setEditingWorkflow(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Modifica Workflow AI</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-workflow-name">Nome Workflow</Label>
                <Input
                  id="edit-workflow-name"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="es. Analisi Completa Documento"
                />
              </div>
              <Button
                onClick={handleUpdateWorkflow}
                disabled={updateMutation.isPending || !newWorkflowName.trim()}
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

export default WorkflowsAI
