
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Tag, 
  Plus, 
  MoreVertical,
  FileText,
  RefreshCcw
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/hooks/useTags"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const TagPage = () => {
  const [newTagName, setNewTagName] = useState("")
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editedName, setEditedName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const { user } = useAuth()
  const { data: tags = [], isLoading, refetch } = useTags()
  const createTagMutation = useCreateTag()
  const updateTagMutation = useUpdateTag()
  const deleteTagMutation = useDeleteTag()
  const navigate = useNavigate()

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !user) return
    
    try {
      await createTagMutation.mutateAsync({
        nome: newTagName.trim(),
        utente_id: user.id
      })
      setNewTagName("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating tag:", error)
    }
  }

  const handleUpdateTag = async (id: string) => {
    if (!editedName.trim()) return
    
    try {
      await updateTagMutation.mutateAsync({
        id,
        updates: { nome: editedName.trim() }
      })
      setEditingTag(null)
      setEditedName("")
    } catch (error) {
      console.error("Error updating tag:", error)
    }
  }

  const handleDeleteTag = async (id: string, name: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare il tag "${name}"?`)) {
      try {
        await deleteTagMutation.mutateAsync(id)
      } catch (error) {
        console.error("Error deleting tag:", error)
      }
    }
  }

  const startEditing = (id: string, currentName: string) => {
    setEditingTag(id)
    setEditedName(currentName)
  }

  const cancelEditing = () => {
    setEditingTag(null)
    setEditedName("")
  }

  const refreshData = () => {
    refetch()
    toast.success("Tag aggiornati")
  }

  if (isLoading) {
    return (
      <div className="p-8 bg-soft-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-indigo mx-auto mb-4"></div>
          <p className="text-slate-gray">Caricamento tag...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-soft-white min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-gray mb-2">Tag</h1>
            <p className="text-slate-gray-600">Gestisci i tag per organizzare i tuoi documenti</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={refreshData}
              className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Aggiorna
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuovo Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crea nuovo tag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome tag"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateTag()
                    }}
                    className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setNewTagName("")
                      }}
                    >
                      Annulla
                    </Button>
                    <Button
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim() || createTagMutation.isPending}
                      className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
                    >
                      {createTagMutation.isPending ? "Creazione..." : "Crea"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {tags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tags.map((tag) => (
            <Card key={tag.id} className="bg-soft-white border-lavender-gray hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 bg-cool-teal-50 rounded-lg flex items-center justify-center">
                      <Tag className="w-6 h-6 text-cool-teal" />
                    </div>
                    <div className="flex-1">
                      {editingTag === tag.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateTag(tag.id)
                              if (e.key === 'Escape') cancelEditing()
                            }}
                            className="text-lg font-semibold border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo"
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTag(tag.id)}
                              disabled={!editedName.trim() || updateTagMutation.isPending}
                            >
                              Salva
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                            >
                              Annulla
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <CardTitle className="text-lg font-semibold text-slate-gray">
                          {tag.nome}
                        </CardTitle>
                      )}
                    </div>
                  </div>
                  {editingTag !== tag.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => startEditing(tag.id, tag.nome)}
                        >
                          Rinomina
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/documenti?tag=${tag.nome}`)}
                        >
                          Visualizza documenti
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteTag(tag.id, tag.nome)}
                        >
                          Elimina
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-slate-gray-400">
                    <FileText className="w-4 h-4 mr-1" />
                    <span>Documenti collegati</span>
                  </div>
                  <Badge variant="secondary" className="bg-cool-teal-50 text-cool-teal">
                    #{tag.nome}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-slate-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-gray mb-2">Nessun tag disponibile</h3>
          <p className="text-slate-gray-600 mb-4">
            Crea tag per organizzare e categorizzare i tuoi documenti.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crea il tuo primo tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crea nuovo tag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome tag"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateTag()
                  }}
                  className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      setNewTagName("")
                    }}
                  >
                    Annulla
                  </Button>
                  <Button
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim() || createTagMutation.isPending}
                    className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
                  >
                    {createTagMutation.isPending ? "Creazione..." : "Crea"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

export default TagPage
