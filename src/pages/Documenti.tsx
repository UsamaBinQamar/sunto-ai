
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDocuments, usePinDocument, useDeleteDocument } from "@/hooks/useDocuments"
import { useCartelle, useCreateCartella, useUpdateCartella, useDeleteCartella } from "@/hooks/useCartelle"
import { useTags } from "@/hooks/useTags"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import FolderTree from "@/components/folder-navigation/FolderTree"
import BreadcrumbNav from "@/components/folder-navigation/BreadcrumbNav"
import FolderListView from "@/components/folder-navigation/FolderListView"
import DocumentsFilters from "@/components/documents/DocumentsFilters"
import EmptyState from "@/components/documents/EmptyState"

const Documenti = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Fetch data
  const { data: documents = [], isLoading: documentsLoading, refetch: refetchDocuments } = useDocuments()
  const { data: cartelle = [], isLoading: cartelleLoading, refetch: refetchCartelle } = useCartelle()
  const { data: tags = [], isLoading: tagsLoading } = useTags()
  
  // Mutations
  const pinDocumentMutation = usePinDocument()
  const deleteDocumentMutation = useDeleteDocument()
  const createCartellaMutation = useCreateCartella()
  const updateCartellaMutation = useUpdateCartella()
  const deleteCartellaMutation = useDeleteCartella()

  const toggleFavorite = async (id: string, currentPinned: boolean) => {
    try {
      await pinDocumentMutation.mutateAsync({ id, pinned: !currentPinned })
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo documento?")) {
      try {
        await deleteDocumentMutation.mutateAsync(id)
      } catch (error) {
        console.error("Error deleting document:", error)
      }
    }
  }

  const handleCreateFolder = async (name: string, parentId: string | null) => {
    if (!user) return
    
    try {
      await createCartellaMutation.mutateAsync({
        nome_cartella: name,
        utente_id: user.id,
        cartella_padre_id: parentId
      })
      refetchCartelle()
    } catch (error) {
      console.error("Error creating folder:", error)
    }
  }

  const handleRenameFolder = async (id: string, newName: string) => {
    try {
      await updateCartellaMutation.mutateAsync({
        id,
        updates: { nome_cartella: newName }
      })
      refetchCartelle()
    } catch (error) {
      console.error("Error renaming folder:", error)
    }
  }

  const handleDeleteFolder = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questa cartella e tutto il suo contenuto?")) {
      try {
        await deleteCartellaMutation.mutateAsync(id)
        if (selectedFolderId === id) {
          setSelectedFolderId(null)
        }
        refetchCartelle()
      } catch (error) {
        console.error("Error deleting folder:", error)
      }
    }
  }

  const openDocument = (id: string) => {
    navigate(`/documenti/${id}`)
  }

  const refreshData = () => {
    refetchDocuments()
    refetchCartelle()
    toast.success("Dati aggiornati")
  }

  // Build breadcrumb path
  const buildBreadcrumbPath = (folderId: string | null): Array<{id: string | null, nome: string}> => {
    if (!folderId) return []
    
    const path: Array<{id: string | null, nome: string}> = []
    let currentFolder = cartelle.find(f => f.id === folderId)
    
    while (currentFolder) {
      path.unshift({ id: currentFolder.id, nome: currentFolder.nome_cartella })
      currentFolder = currentFolder.cartella_padre_id 
        ? cartelle.find(f => f.id === currentFolder.cartella_padre_id)
        : null
    }
    
    return path
  }

  // Filter documents and folders for current view
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.titolo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.anteprima_ai || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = doc.cartella_id === selectedFolderId
    const matchesTag = selectedTag === "all" || 
                      (doc.documenti_tag && doc.documenti_tag.some(dt => dt.tag?.nome === selectedTag))
    
    return matchesSearch && matchesFolder && matchesTag
  })

  const currentFolderChildren = cartelle.filter(folder => 
    folder.cartella_padre_id === selectedFolderId
  )

  // Prepare list items for FolderListView
  const folderItems = currentFolderChildren.map(folder => ({
    id: folder.id,
    nome_cartella: folder.nome_cartella,
    creata_il: folder.creata_il,
    type: 'folder' as const
  }))

  const documentItems = filteredDocuments.map(doc => ({
    id: doc.id,
    titolo: doc.titolo,
    anteprima_ai: doc.anteprima_ai,
    creato_il: doc.creato_il,
    tipo_documento: doc.tipo_documento,
    type: 'document' as const
  }))

  const listItems = [...folderItems, ...documentItems]

  if (documentsLoading || cartelleLoading || tagsLoading) {
    return (
      <div className="p-8 bg-soft-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-indigo mx-auto mb-4"></div>
          <p className="text-slate-gray">Caricamento documenti...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-soft-white flex flex-col">
      {/* Header */}
      <div className="border-b border-lavender-gray p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-gray mb-2">Documenti</h1>
            <p className="text-slate-gray-600">Gestisci i tuoi documenti e cartelle</p>
          </div>
          <Button
            variant="outline"
            onClick={refreshData}
            className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
        </div>
        
        <DocumentsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFolder="all"
          setSelectedFolder={() => {}}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          cartelle={[]}
          tags={tags}
        />
      </div>
      
      {/* Main content with two-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Folder tree */}
        <div className="w-64 bg-soft-white border-r border-lavender-gray overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-gray mb-3 uppercase tracking-wide">
              Cartelle
            </h2>
            <FolderTree
              folders={cartelle}
              selectedFolderId={selectedFolderId}
              onFolderSelect={setSelectedFolderId}
            />
          </div>
        </div>
        
        {/* Right side - Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb navigation */}
          <BreadcrumbNav
            items={buildBreadcrumbPath(selectedFolderId)}
            onNavigate={setSelectedFolderId}
          />
          
          {/* Folder and document list */}
          <div className="flex-1 overflow-y-auto">
            <FolderListView
              items={listItems}
              currentFolderId={selectedFolderId}
              onFolderSelect={setSelectedFolderId}
              onDocumentSelect={openDocument}
              onCreateFolder={handleCreateFolder}
              onRenameFolder={handleRenameFolder}
              onDeleteFolder={handleDeleteFolder}
              onDeleteDocument={handleDeleteDocument}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Documenti
