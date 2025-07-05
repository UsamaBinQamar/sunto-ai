
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Star, 
  Share2, 
  Edit,
  Download,
  MoreVertical,
  RefreshCcw
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DocumentHeaderProps {
  document: any
  onToggleFavorite: () => void
  onRefresh: () => void
  onTitleUpdate: (newTitle: string) => void
}

const DocumentHeader = ({ document, onToggleFavorite, onRefresh, onTitleUpdate }: DocumentHeaderProps) => {
  const navigate = useNavigate()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(document.titolo)

  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      onTitleUpdate(editedTitle.trim())
      setIsEditingTitle(false)
    }
  }

  const handleTitleCancel = () => {
    setIsEditingTitle(false)
    setEditedTitle(document.titolo)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/documenti')}
            className="text-slate-gray hover:text-electric-indigo"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Torna ai documenti
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
          
          <Button
            variant="ghost"
            onClick={onToggleFavorite}
            className={`${document.pinned ? 'text-yellow-500' : 'text-slate-gray-400'} hover:text-yellow-500`}
          >
            <Star className={`w-5 h-5 ${document.pinned ? 'fill-current' : ''}`} />
          </Button>
          
          <Button variant="outline" className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">
            <Share2 className="w-4 h-4 mr-2" />
            Condividi
          </Button>
          
          <Button variant="outline" className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Modifica titolo
              </DropdownMenuItem>
              <DropdownMenuItem>Duplica documento</DropdownMenuItem>
              <DropdownMenuItem>Sposta in cartella</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Elimina</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-6">
        {isEditingTitle ? (
          <div className="flex items-center space-x-2 mb-3">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-3xl font-bold border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave()
                if (e.key === 'Escape') handleTitleCancel()
              }}
            />
            <Button onClick={handleTitleSave} size="sm">Salva</Button>
            <Button variant="outline" size="sm" onClick={handleTitleCancel}>
              Annulla
            </Button>
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-slate-gray mb-3">{document.titolo}</h1>
        )}
        <div className="flex items-center flex-wrap gap-4 text-sm text-slate-gray-600 mb-4">
          <span>Cartella: {document.cartelle?.nome_cartella || 'Senza cartella'}</span>
          <span>•</span>
          <span>Tipo: {document.tipo_documento}</span>
          <span>•</span>
          <span>Creato: {new Date(document.creato_il).toLocaleDateString('it-IT')}</span>
          <span>•</span>
          <span>Modificato: {new Date(document.modificato_il).toLocaleDateString('it-IT')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {document.documenti_tag?.map((dt: any) => (
            <Badge 
              key={dt.id} 
              variant="secondary" 
              className="bg-electric-indigo-50 text-electric-indigo"
            >
              {dt.tag?.nome}
            </Badge>
          ))}
          {document.stato_ai !== 'nessuna' && (
            <Badge variant="outline" className="border-cool-teal text-cool-teal">
              IA: {document.stato_ai}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentHeader
