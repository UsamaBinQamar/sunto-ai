
import { FileText } from "lucide-react"

interface EmptyStateProps {
  type: 'no-documents' | 'no-results'
}

const EmptyState = ({ type }: EmptyStateProps) => {
  if (type === 'no-results') {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-gray mb-2">Nessun documento trovato</h3>
        <p className="text-slate-gray-600">Prova a modificare i filtri di ricerca.</p>
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <FileText className="w-16 h-16 text-slate-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-gray mb-2">Nessun documento disponibile</h3>
      <p className="text-slate-gray-600">Carica il tuo primo documento per iniziare.</p>
    </div>
  )
}

export default EmptyState
