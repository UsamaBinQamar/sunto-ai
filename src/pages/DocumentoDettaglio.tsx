
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useDocument, usePinDocument, useUpdateDocument } from "@/hooks/useDocuments"
import { toast } from "sonner"
import DocumentHeader from "@/components/documents/DocumentHeader"
import DocumentTabs from "@/components/documents/DocumentTabs"
import DocumentNotFound from "@/components/documents/DocumentNotFound"
import DocumentLoading from "@/components/documents/DocumentLoading"

const DocumentoDettaglio = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("ai-chat") // Default to chat interface

  const { data: document, isLoading, refetch } = useDocument(id || "")
  const pinDocumentMutation = usePinDocument()
  const updateDocumentMutation = useUpdateDocument()

  const toggleFavorite = async () => {
    if (!document) return
    try {
      await pinDocumentMutation.mutateAsync({ id: document.id, pinned: !document.pinned })
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleTitleUpdate = async (newTitle: string) => {
    if (!document) return
    try {
      await updateDocumentMutation.mutateAsync({
        id: document.id,
        updates: { titolo: newTitle }
      })
    } catch (error) {
      console.error("Error updating title:", error)
    }
  }

  const refreshData = () => {
    refetch()
    toast.success("Documento aggiornato")
  }

  if (isLoading) {
    return <DocumentLoading />
  }

  if (!document) {
    return <DocumentNotFound />
  }

  return (
    <div className="p-8 bg-soft-white min-h-screen">
      <DocumentHeader 
        document={document}
        onToggleFavorite={toggleFavorite}
        onRefresh={refreshData}
        onTitleUpdate={handleTitleUpdate}
      />
      
      <DocumentTabs 
        document={document}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  )
}

export default DocumentoDettaglio
