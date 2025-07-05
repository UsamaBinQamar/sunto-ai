
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DocumentContentProps {
  document: any
}

const DocumentContent = ({ document }: DocumentContentProps) => {
  return (
    <Card className="bg-soft-white border-lavender-gray">
      <CardHeader>
        <CardTitle className="text-slate-gray">Contenuto del documento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-slate-gray leading-relaxed">
            {document.contenuto || 'Nessun contenuto disponibile per questo documento.'}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}

export default DocumentContent
