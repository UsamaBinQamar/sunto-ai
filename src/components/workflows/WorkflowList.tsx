
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Play, Calendar, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { it } from "date-fns/locale"
import { useDeleteWorkflow } from "@/hooks/useWorkflows"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface WorkflowListProps {
  workflows: Array<{
    id: string
    nome: string
    descrizione: string | null
    stato: 'attivo' | 'bozza' | 'archiviato'
    creato_il: string
    modificato_il: string
    workflow_steps?: Array<any>
  }>
  isLoading: boolean
  onEditWorkflow: (id: string) => void
}

const WorkflowList = ({ workflows, isLoading, onEditWorkflow }: WorkflowListProps) => {
  const deleteWorkflowMutation = useDeleteWorkflow()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attivo':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'bozza':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'archiviato':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'attivo':
        return 'Attivo'
      case 'bozza':
        return 'Bozza'
      case 'archiviato':
        return 'Archiviato'
      default:
        return 'Sconosciuto'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-lavender-gray rounded w-1/3"></div>
              <div className="h-3 bg-lavender-gray rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-lavender-gray rounded w-full mb-2"></div>
              <div className="h-3 bg-lavender-gray rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!workflows.length) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-lavender-gray rounded-full flex items-center justify-center">
          <Play className="w-12 h-12 text-slate-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-gray mb-2">
          Nessun workflow creato
        </h3>
        <p className="text-slate-gray-600 mb-4">
          Inizia creando il tuo primo workflow IA per automatizzare l'elaborazione dei documenti
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="border-lavender-gray hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-slate-gray text-lg mb-1">
                  {workflow.nome}
                </CardTitle>
                {workflow.descrizione && (
                  <p className="text-slate-gray-600 text-sm">
                    {workflow.descrizione}
                  </p>
                )}
              </div>
              <Badge className={getStatusColor(workflow.stato)}>
                {getStatusText(workflow.stato)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-slate-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Creato {formatDistanceToNow(new Date(workflow.creato_il), { 
                    addSuffix: true, 
                    locale: it 
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Modificato {formatDistanceToNow(new Date(workflow.modificato_il), { 
                    addSuffix: true, 
                    locale: it 
                  })}
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-electric-indigo mr-1"></span>
                  {workflow.workflow_steps?.length || 0} step
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditWorkflow(workflow.id)}
                  className="border-lavender-gray text-slate-gray hover:bg-lavender-gray"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifica
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Elimina
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Elimina Workflow</AlertDialogTitle>
                      <AlertDialogDescription>
                        Sei sicuro di voler eliminare il workflow "{workflow.nome}"? 
                        Questa azione non può essere annullata e tutti gli step associati verranno eliminati.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annulla</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteWorkflowMutation.mutate(workflow.id)}
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
  )
}

export default WorkflowList
