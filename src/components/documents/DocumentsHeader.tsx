
import { Button } from "@/components/ui/button"
import { Plus, Upload, RefreshCcw } from "lucide-react"

interface DocumentsHeaderProps {
  onRefresh: () => void
}

const DocumentsHeader = ({ onRefresh }: DocumentsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-gray mb-2">Documenti</h1>
        <p className="text-slate-gray-600">Gestisci e organizza tutti i tuoi documenti e trascrizioni</p>
      </div>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Aggiorna
        </Button>
        <Button 
          variant="outline" 
          className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue"
        >
          <Upload className="w-4 h-4 mr-2" />
          Carica File
        </Button>
        <Button 
          className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Documento
        </Button>
      </div>
    </div>
  )
}

export default DocumentsHeader
