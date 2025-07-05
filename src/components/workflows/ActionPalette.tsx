
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, List, BookOpen, Zap } from "lucide-react"
import { Draggable, Droppable } from "@hello-pangea/dnd"

interface ActionType {
  id: string
  name: string
  type: 'sommario' | 'punti' | 'note' | 'personalizzato'
  icon: React.ComponentType<any>
  description: string
  color: string
}

const availableActions: ActionType[] = [
  {
    id: 'sommario',
    name: 'Riassunto',
    type: 'sommario',
    icon: FileText,
    description: 'Crea un riassunto conciso del contenuto',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'punti',
    name: 'Punti Chiave',
    type: 'punti',
    icon: List,
    description: 'Estrae i punti principali in formato lista',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 'note',
    name: 'Note Approfondite',
    type: 'note',
    icon: BookOpen,
    description: 'Genera note dettagliate e approfondite',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'personalizzato',
    name: 'Azione Personalizzata',
    type: 'personalizzato',
    icon: Zap,
    description: 'Crea un\'azione con prompt personalizzato',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  }
]

interface ActionPaletteProps {
  onActionSelect: (action: ActionType) => void
}

const ActionPalette = ({ onActionSelect }: ActionPaletteProps) => {
  return (
    <Card className="h-fit border-lavender-gray">
      <CardHeader>
        <CardTitle className="text-slate-gray text-lg">Azioni Disponibili</CardTitle>
        <p className="text-sm text-slate-gray-600">
          Trascina le azioni nel workflow per creare la tua sequenza personalizzata
        </p>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="action-palette" isDropDisabled={true}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {availableActions.map((action, index) => (
                <Draggable key={action.id} draggableId={`palette-${action.id}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`
                        p-4 rounded-lg border-2 border-dashed border-lavender-gray 
                        hover:border-electric-indigo hover:bg-electric-indigo/5 
                        transition-all duration-200 cursor-move
                        ${snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : ''}
                      `}
                      onClick={() => onActionSelect(action)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <action.icon className="w-5 h-5 text-electric-indigo" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-slate-gray text-sm">{action.name}</h4>
                            <Badge className={`${action.color} text-xs`}>
                              {action.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-gray-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}

export default ActionPalette
