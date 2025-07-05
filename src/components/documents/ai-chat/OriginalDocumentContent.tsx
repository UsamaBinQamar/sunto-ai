
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface OriginalDocumentContentProps {
  document: any
  children: React.ReactNode
}

const OriginalDocumentContent = ({ document, children }: OriginalDocumentContentProps) => {
  return (
    <Card className="bg-soft-white border-lavender-gray">
      <CardHeader>
        <CardTitle className="text-slate-gray flex items-center justify-between">
          📄 Contenuto originale
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
            Sorgente per nuove azioni IA
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none mb-4">
          <pre className="whitespace-pre-wrap font-sans text-slate-gray leading-relaxed text-sm max-h-48 overflow-y-auto">
            {document.contenuto || 'Nessun contenuto disponibile per questo documento.'}
          </pre>
        </div>
        
        <div className="border-t border-lavender-gray pt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-electric-indigo" />
            <h3 className="font-semibold text-slate-gray">Esegui nuova azione IA sul contenuto originale</h3>
          </div>
          
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

export default OriginalDocumentContent
