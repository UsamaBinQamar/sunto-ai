
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Brain, ArrowRight, Settings2, Workflow } from "lucide-react"
import { useWorkflows } from "@/hooks/useWorkflows"
import WorkflowBuilder from "@/components/workflows/WorkflowBuilder"
import WorkflowList from "@/components/workflows/WorkflowList"
import CreateWorkflowDialog from "@/components/workflows/CreateWorkflowDialog"

// Define the interface for workflow data that matches our component expectations
interface WorkflowData {
  id: string
  nome: string
  descrizione: string | null
  stato: 'attivo' | 'bozza' | 'archiviato'
  creato_il: string
  modificato_il: string
  workflow_steps?: Array<any>
}

const AzioniIA = () => {
  const [activeView, setActiveView] = useState<'list' | 'builder'>('list')
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  const { data: rawWorkflows, isLoading } = useWorkflows()

  // Transform the database workflows to match our expected types
  const workflows: WorkflowData[] = (rawWorkflows || []).map(workflow => ({
    id: workflow.id,
    nome: workflow.nome,
    descrizione: workflow.descrizione,
    stato: workflow.stato as 'attivo' | 'bozza' | 'archiviato',
    creato_il: workflow.creato_il,
    modificato_il: workflow.modificato_il,
    workflow_steps: workflow.workflow_steps
  }))

  const handleEditWorkflow = (workflowId: string) => {
    setSelectedWorkflowId(workflowId)
    setActiveView('builder')
  }

  const handleCreateNew = () => {
    setIsCreateDialogOpen(true)
  }

  const handleWorkflowCreated = (workflowId: string) => {
    setSelectedWorkflowId(workflowId)
    setActiveView('builder')
  }

  const handleBackToList = () => {
    setActiveView('list')
    setSelectedWorkflowId(null)
  }

  return (
    <div className="min-h-screen bg-soft-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-gray mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-electric-indigo" />
              Workflow IA
            </h1>
            <p className="text-slate-gray-600">
              Crea e gestisci workflow IA personalizzati per automatizzare l'elaborazione dei tuoi documenti
            </p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Workflow
          </Button>
        </div>

        {/* Main Content */}
        {activeView === 'list' ? (
          <div className="space-y-8">
            {/* Quick Access Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-electric-indigo/5 to-sky-blue/5 border-electric-indigo/20">
                <CardHeader>
                  <CardTitle className="text-slate-gray flex items-center">
                    <Settings2 className="w-5 h-5 mr-2 text-electric-indigo" />
                    Azioni IA Personalizzate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-gray-600 mb-4">
                    Crea e gestisci azioni IA personalizzate con prompt specifici per le tue esigenze
                  </p>
                  <Button
                    onClick={() => window.location.href = '/azioni-ia-personalizzate'}
                    variant="outline"
                    className="border-electric-indigo text-electric-indigo hover:bg-electric-indigo hover:text-white"
                  >
                    Gestisci Azioni <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-sky-blue/5 to-electric-indigo/5 border-sky-blue/20">
                <CardHeader>
                  <CardTitle className="text-slate-gray flex items-center">
                    <Workflow className="w-5 h-5 mr-2 text-sky-blue" />
                    Workflows AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-gray-600 mb-4">
                    Combina più azioni IA in sequenze automatizzate per processi complessi
                  </p>
                  <Button
                    onClick={() => window.location.href = '/workflows-ai'}
                    variant="outline"
                    className="border-sky-blue text-sky-blue hover:bg-sky-blue hover:text-white"
                  >
                    Gestisci Workflows <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Section */}
            <Card className="bg-gradient-to-r from-electric-indigo/5 to-sky-blue/5 border-electric-indigo/20">
              <CardHeader>
                <CardTitle className="text-slate-gray flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-electric-indigo" />
                  Inizia Subito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-gray-600 mb-4">
                      Crea il tuo primo workflow personalizzato per automatizzare l'elaborazione dei documenti con l'IA
                    </p>
                    <Button
                      onClick={handleCreateNew}
                      className="bg-electric-indigo hover:bg-electric-indigo-700 text-white"
                    >
                      Crea Workflow <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* I tuoi Workflow Salvati Section */}
            <Card className="bg-soft-white border-lavender-gray shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-gray text-xl">I tuoi Workflow Salvati</CardTitle>
                <p className="text-slate-gray-600">
                  {workflows?.length ? 
                    `Hai ${workflows.length} workflow${workflows.length > 1 ? 's' : ''} salvat${workflows.length > 1 ? 'i' : 'o'}` :
                    'Non hai ancora creato nessun workflow'
                  }
                </p>
              </CardHeader>
              <CardContent>
                <WorkflowList
                  workflows={workflows}
                  isLoading={isLoading}
                  onEditWorkflow={handleEditWorkflow}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Workflow Builder Section */
          <Card className="bg-soft-white border-lavender-gray shadow-lg">
            <CardContent className="p-6">
              <WorkflowBuilder
                workflowId={selectedWorkflowId}
                onBackToList={handleBackToList}
              />
            </CardContent>
          </Card>
        )}

        <CreateWorkflowDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onWorkflowCreated={handleWorkflowCreated}
        />
      </div>
    </div>
  )
}

export default AzioniIA
