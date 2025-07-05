
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

const DocumentNotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="p-8 bg-soft-white min-h-screen">
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-gray mb-2">Documento non trovato</h3>
        <p className="text-slate-gray-600">Il documento richiesto non esiste o non hai i permessi per visualizzarlo.</p>
        <Button 
          onClick={() => navigate('/documenti')}
          className="mt-4 bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
        >
          Torna ai documenti
        </Button>
      </div>
    </div>
  )
}

export default DocumentNotFound
