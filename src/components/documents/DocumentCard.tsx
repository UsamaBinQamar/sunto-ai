
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Share2, 
  Calendar,
  Folder,
  MoreVertical
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DocumentCardProps {
  document: any // Using any for now to match the existing data structure
  onToggleFavorite: (id: string, currentPinned: boolean) => void
  onDelete: (id: string) => void
  onOpen: (id: string) => void
}

const DocumentCard = ({ document: doc, onToggleFavorite, onDelete, onOpen }: DocumentCardProps) => {
  return (
    <Card 
      className="bg-soft-white border-lavender-gray hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onOpen(doc.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-gray mb-2 group-hover:text-electric-indigo transition-colors">
              {doc.titolo}
            </CardTitle>
            <div className="flex items-center text-sm text-slate-gray-600 mb-3">
              <Folder className="w-4 h-4 mr-1" />
              <span className="mr-4">
                {doc.cartelle?.nome_cartella || 'Senza cartella'}
              </span>
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(doc.modificato_il).toLocaleDateString('it-IT')}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Modifica</DropdownMenuItem>
              <DropdownMenuItem>Duplica</DropdownMenuItem>
              <DropdownMenuItem>Condividi</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(doc.id)
                }}
              >
                Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-slate-gray-600 mb-4 line-clamp-2">
          {doc.anteprima_ai || 'Nessuna anteprima disponibile'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {doc.documenti_tag?.map((dt: any) => (
            <Badge 
              key={dt.id} 
              variant="secondary" 
              className="bg-electric-indigo-50 text-electric-indigo hover:bg-electric-indigo hover:text-white transition-colors"
            >
              {dt.tag?.nome}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(doc.id, doc.pinned)
              }}
              className={`h-8 w-8 p-0 ${doc.pinned ? 'text-cool-teal' : 'text-slate-gray-400'} hover:text-cool-teal`}
            >
              <Star className={`w-4 h-4 ${doc.pinned ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-8 p-0 text-slate-gray-400 hover:text-sky-blue"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            {doc.stato_ai !== 'nessuna' && (
              <Badge variant="outline" className="text-xs border-cool-teal text-cool-teal">
                IA
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-xs text-slate-gray-400">
            <span className="capitalize">{doc.tipo_documento}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DocumentCard
