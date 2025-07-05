
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Trash2, 
  FolderTree, 
  Tags, 
  Star, 
  Download,
  X
} from "lucide-react"

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onBulkDelete: () => void
  onBulkMove: () => void
  onBulkTag: () => void
  onBulkFavorite: () => void
  onBulkDownload: () => void
  hasDocuments: boolean
}

const BulkActionsBar = ({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkMove,
  onBulkTag,
  onBulkFavorite,
  onBulkDownload,
  hasDocuments
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center justify-between p-3 bg-electric-indigo-50 border-b border-electric-indigo/20">
      <div className="flex items-center space-x-3">
        <Badge variant="secondary" className="bg-electric-indigo text-white">
          {selectedCount} elemento{selectedCount > 1 ? 'i' : ''} selezionat{selectedCount > 1 ? 'i' : 'o'}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 px-2 text-slate-gray hover:bg-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkMove}
          className="bg-white hover:bg-lavender-gray"
        >
          <FolderTree className="h-4 w-4 mr-1" />
          Sposta
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkTag}
          className="bg-white hover:bg-lavender-gray"
        >
          <Tags className="h-4 w-4 mr-1" />
          Tag
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkFavorite}
          className="bg-white hover:bg-lavender-gray"
        >
          <Star className="h-4 w-4 mr-1" />
          Preferiti
        </Button>
        {hasDocuments && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDownload}
            className="bg-white hover:bg-lavender-gray"
          >
            <Download className="h-4 w-4 mr-1" />
            Scarica
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDelete}
          className="bg-white hover:bg-red-50 text-red-600 border-red-200"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Elimina
        </Button>
      </div>
    </div>
  )
}

export default BulkActionsBar
