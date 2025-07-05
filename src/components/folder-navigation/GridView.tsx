
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Folder, 
  FileText,
  Calendar,
  MoreVertical,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FolderItem {
  id: string
  nome_cartella: string
  creata_il: string
  type: 'folder'
}

interface DocumentItem {
  id: string
  titolo: string
  anteprima_ai?: string | null
  creato_il: string
  tipo_documento: string
  type: 'document'
}

type GridItem = FolderItem | DocumentItem

interface GridViewProps {
  items: GridItem[]
  selectedItems: Set<string>
  onItemSelect: (itemId: string, selected: boolean) => void
  onFolderSelect: (folderId: string) => void
  onDocumentSelect: (documentId: string) => void
  onDeleteFolder: (id: string) => void
  onDeleteDocument: (id: string) => void
  multiSelectMode: boolean
}

const GridView = ({
  items,
  selectedItems,
  onItemSelect,
  onFolderSelect,
  onDocumentSelect,
  onDeleteFolder,
  onDeleteDocument,
  multiSelectMode
}: GridViewProps) => {
  const handleItemClick = (item: GridItem) => {
    if (multiSelectMode) {
      const isSelected = selectedItems.has(item.id)
      onItemSelect(item.id, !isSelected)
    } else {
      if (item.type === 'folder') {
        onFolderSelect(item.id)
      } else {
        onDocumentSelect(item.id)
      }
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {items.map((item) => {
        const isSelected = selectedItems.has(item.id)
        
        return (
          <Card
            key={item.id}
            className={`
              bg-soft-white border-lavender-gray hover:shadow-md hover:border-electric-indigo/30 
              transition-all duration-200 cursor-pointer relative
              ${isSelected ? 'ring-2 ring-electric-indigo bg-electric-indigo/5' : ''}
            `}
            onClick={() => handleItemClick(item)}
          >
            <CardContent className="p-4">
              {/* Multi-select checkbox */}
              {multiSelectMode && (
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={isSelected}
                    onChange={(checked) => onItemSelect(item.id, !!checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Item icon and content */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`
                  w-16 h-16 rounded-lg flex items-center justify-center
                  ${item.type === 'folder' ? 'bg-electric-indigo-50' : 'bg-sky-blue-50'}
                `}>
                  {item.type === 'folder' ? (
                    <Folder className="w-8 h-8 text-electric-indigo" />
                  ) : (
                    <FileText className="w-8 h-8 text-sky-blue" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-gray text-sm truncate mb-1">
                    {item.type === 'folder' ? item.nome_cartella : item.titolo}
                  </h4>
                  
                  {item.type === 'document' && item.anteprima_ai && (
                    <p className="text-xs text-slate-gray-400 line-clamp-2 mb-2">
                      {item.anteprima_ai.substring(0, 80)}...
                    </p>
                  )}

                  <div className="flex flex-col items-center space-y-1">
                    {item.type === 'document' && (
                      <Badge variant="secondary" className="text-xs">
                        {item.tipo_documento}
                      </Badge>
                    )}
                    <div className="flex items-center text-xs text-slate-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        {new Date(item.type === 'folder' ? item.creata_il : item.creato_il).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Context menu */}
                {!multiSelectMode && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (item.type === 'folder') {
                            onDeleteFolder(item.id)
                          } else {
                            onDeleteDocument(item.id)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Elimina
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default GridView
