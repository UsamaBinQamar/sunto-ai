
import DocumentCard from "./DocumentCard"

interface DocumentsGridProps {
  documents: any[] // Using any for now to match the existing data structure
  onToggleFavorite: (id: string, currentPinned: boolean) => void
  onDelete: (id: string) => void
  onOpen: (id: string) => void
}

const DocumentsGrid = ({ documents, onToggleFavorite, onDelete, onOpen }: DocumentsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}

export default DocumentsGrid
