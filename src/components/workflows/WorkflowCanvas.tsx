
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, GripVertical } from "lucide-react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { useState } from "react"

interface WorkflowStep {
  id: string
  nome: string
  tipo_azione: 'sommario' | 'punti' | 'note' | 'personalizzato'
  prompt_template?: string
  ordine: number
}

interface WorkflowCanvasProps {
  workflowName: string
  onWorkflowNameChange: (name: string) => void
  steps: WorkflowStep[]
  onDeleteStep: (stepId: string) => void
  onSaveWorkflow: () => void
  isSaving: boolean
}

const WorkflowCanvas = ({ 
  workflowName, 
  onWorkflowNameChange, 
  steps, 
  onDeleteStep, 
  onSaveWorkflow, 
  isSaving 
}: WorkflowCanvasProps) => {
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [tempPrompt, setTempPrompt] = useState('')

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'sommario':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'punti':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'note':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'personalizzato':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActionTypeText = (type: string) => {
    switch (type) {
      case 'sommario':
        return 'Riassunto'
      case 'punti':
        return 'Punti Chiave'
      case 'note':
        return 'Note Approfondite'
      case 'personalizzato':
        return 'Personalizzato'
      default:
        return type
    }
  }

  return (
    <div className="space-y-4">
      {/* Workflow Title */}
      <Card className="border-lavender-gray">
        <CardHeader>
          <CardTitle className="text-slate-gray">Titolo del Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Inserisci il titolo del tuo workflow..."
            value={workflowName}
            onChange={(e) => onWorkflowNameChange(e.target.value)}
            className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo text-lg font-medium"
          />
        </CardContent>
      </Card>

      {/* Workflow Canvas */}
      <Card className="border-lavender-gray min-h-[400px]">
        <CardHeader>
          <CardTitle className="text-slate-gray">Canvas del Workflow</CardTitle>
          {steps.length === 0 && (
            <p className="text-sm text-slate-gray-600">
              Trascina le azioni dalla palette sulla sinistra per creare il tuo workflow
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Droppable droppableId="workflow-canvas">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`
                  min-h-[300px] p-4 rounded-lg border-2 border-dashed 
                  ${snapshot.isDraggingOver 
                    ? 'border-electric-indigo bg-electric-indigo/5' 
                    : 'border-lavender-gray'
                  } 
                  transition-all duration-200
                `}
              >
                {steps.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-gray-500">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-lavender-gray rounded-full flex items-center justify-center">
                        <GripVertical className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium mb-2">Il tuo workflow è vuoto</p>
                      <p className="text-sm">Aggiungi alcune azioni per iniziare</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {steps.sort((a, b) => a.ordine - b.ordine).map((step, index) => (
                      <Draggable key={step.id} draggableId={step.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`
                              flex items-center space-x-3 p-4 rounded-lg border border-lavender-gray bg-soft-white
                              ${snapshot.isDragging 
                                ? 'shadow-lg rotate-1 scale-105' 
                                : 'hover:shadow-md'
                              }
                              transition-all duration-200
                            `}
                          >
                            <div 
                              {...provided.dragHandleProps}
                              className="flex items-center space-x-2 text-slate-gray-500 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-4 h-4" />
                              <span className="text-sm font-medium bg-electric-indigo text-white rounded-full w-6 h-6 flex items-center justify-center">
                                {index + 1}
                              </span>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-slate-gray">{step.nome}</h4>
                                <Badge className={getActionTypeColor(step.tipo_azione)}>
                                  {getActionTypeText(step.tipo_azione)}
                                </Badge>
                              </div>
                              
                              {step.tipo_azione === 'personalizzato' && (
                                <div className="mt-2">
                                  {editingStep === step.id ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={tempPrompt}
                                        onChange={(e) => setTempPrompt(e.target.value)}
                                        placeholder="Inserisci il tuo prompt personalizzato..."
                                        rows={3}
                                        className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo resize-none"
                                      />
                                      <div className="flex space-x-2">
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            // Logic to save the prompt would go here
                                            setEditingStep(null)
                                          }}
                                          className="bg-electric-indigo hover:bg-electric-indigo-700"
                                        >
                                          Salva
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setEditingStep(null)}
                                        >
                                          Annulla
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p 
                                      className="text-sm text-slate-gray-600 cursor-pointer hover:text-electric-indigo"
                                      onClick={() => {
                                        setEditingStep(step.id)
                                        setTempPrompt(step.prompt_template || '')
                                      }}
                                    >
                                      {step.prompt_template || 'Clicca per aggiungere un prompt personalizzato...'}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDeleteStep(step.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Save Button */}
          {steps.length > 0 && workflowName.trim() && (
            <div className="mt-6 text-center">
              <Button
                onClick={onSaveWorkflow}
                disabled={isSaving}
                className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white px-8 py-2"
              >
                {isSaving ? 'Salvataggio...' : 'Salva Workflow'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkflowCanvas
