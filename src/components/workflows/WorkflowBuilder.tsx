
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useWorkflow, useUpdateWorkflow, useCreateWorkflowStep, useDeleteWorkflowStep, useUpdateWorkflowStep } from "@/hooks/useWorkflows"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import ActionPalette from "./ActionPalette"
import WorkflowCanvas from "./WorkflowCanvas"
import { Tables } from "@/integrations/supabase/types"

interface WorkflowBuilderProps {
  workflowId: string | null
  onBackToList: () => void
}

interface ActionType {
  id: string
  name: string
  type: 'sommario' | 'punti' | 'note' | 'personalizzato'
  description: string
}

// Define the proper types for workflow steps that match our expectations
interface WorkflowStep {
  id: string
  nome: string
  tipo_azione: 'sommario' | 'punti' | 'note' | 'personalizzato'
  prompt_template?: string | null
  ordine: number
}

const WorkflowBuilder = ({ workflowId, onBackToList }: WorkflowBuilderProps) => {
  const { data: workflow, isLoading } = useWorkflow(workflowId || '')
  const updateWorkflowMutation = useUpdateWorkflow()
  const createStepMutation = useCreateWorkflowStep()
  const deleteStepMutation = useDeleteWorkflowStep()
  const updateStepMutation = useUpdateWorkflowStep()
  
  const [workflowName, setWorkflowName] = useState('')

  useEffect(() => {
    if (workflow) {
      setWorkflowName(workflow.nome)
    }
  }, [workflow])

  const handleActionSelect = async (action: ActionType) => {
    if (!workflowId) return

    const maxOrder = Math.max(0, ...(workflow?.workflow_steps?.map(s => s.ordine) || []))
    
    await createStepMutation.mutateAsync({
      workflow_id: workflowId,
      nome: action.name,
      tipo_azione: action.type,
      prompt_template: action.type === 'personalizzato' ? '' : null,
      ordine: maxOrder + 1
    })
  }

  const handleSaveWorkflow = async () => {
    if (!workflowId) return
    
    await updateWorkflowMutation.mutateAsync({
      id: workflowId,
      updates: { nome: workflowName }
    })
  }

  const handleDeleteStep = async (stepId: string) => {
    await deleteStepMutation.mutate(stepId)
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // Handle dropping from palette to canvas
    if (source.droppableId === 'action-palette' && destination?.droppableId === 'workflow-canvas') {
      const actionId = draggableId.replace('palette-', '')
      const actionMap: Record<string, ActionType> = {
        'sommario': { id: 'sommario', name: 'Riassunto', type: 'sommario', description: 'Crea un riassunto conciso' },
        'punti': { id: 'punti', name: 'Punti Chiave', type: 'punti', description: 'Estrae i punti principali' },
        'note': { id: 'note', name: 'Note Approfondite', type: 'note', description: 'Genera note dettagliate' },
        'personalizzato': { id: 'personalizzato', name: 'Azione Personalizzata', type: 'personalizzato', description: 'Azione con prompt personalizzato' }
      }
      
      const action = actionMap[actionId]
      if (action) {
        await handleActionSelect(action)
      }
      return
    }

    // Handle reordering within canvas
    if (source.droppableId === 'workflow-canvas' && destination?.droppableId === 'workflow-canvas') {
      if (!workflow || destination.index === source.index) return

      const items = Array.from(workflow.workflow_steps || [])
      const [reorderedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, reorderedItem)

      // Update the order for all affected items
      const promises = items.map((item, index) => 
        updateStepMutation.mutateAsync({
          id: item.id,
          updates: { ordine: index + 1 }
        })
      )

      await Promise.all(promises)
    }
  }

  if (!workflowId) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-slate-gray mb-2">
          Seleziona un workflow per iniziare
        </h3>
        <p className="text-slate-gray-600">
          Scegli un workflow dalla lista o creane uno nuovo per iniziare a costruire
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-lavender-gray rounded w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="h-96 bg-lavender-gray rounded"></div>
          <div className="lg:col-span-3 h-96 bg-lavender-gray rounded"></div>
        </div>
      </div>
    )
  }

  // Transform the database workflow steps to match our expected types
  const transformedSteps: WorkflowStep[] = (workflow?.workflow_steps || []).map(step => ({
    id: step.id,
    nome: step.nome,
    tipo_azione: step.tipo_azione as 'sommario' | 'punti' | 'note' | 'personalizzato',
    prompt_template: step.prompt_template,
    ordine: step.ordine
  }))

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToList}
              className="border-lavender-gray text-slate-gray hover:bg-lavender-gray"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Torna alla Lista
            </Button>
            <h2 className="text-xl font-semibold text-slate-gray">
              Crea un nuovo Workflow
            </h2>
          </div>
        </div>

        {/* Main Builder Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Action Palette */}
          <div className="lg:col-span-1">
            <ActionPalette onActionSelect={handleActionSelect} />
          </div>

          {/* Right Side - Workflow Canvas */}
          <div className="lg:col-span-3">
            <WorkflowCanvas
              workflowName={workflowName}
              onWorkflowNameChange={setWorkflowName}
              steps={transformedSteps}
              onDeleteStep={handleDeleteStep}
              onSaveWorkflow={handleSaveWorkflow}
              isSaving={updateWorkflowMutation.isPending}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}

export default WorkflowBuilder
