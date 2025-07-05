
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { History, Eye } from "lucide-react"
import { useVersions } from "@/hooks/useVersions"

interface DocumentVersionsProps {
  document: any
}

const DocumentVersions = ({ document }: DocumentVersionsProps) => {
  const { data: versions } = useVersions(document.id);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);

  return (
    <Card className="bg-soft-white border-lavender-gray">
      <CardHeader>
        <CardTitle className="text-slate-gray">Cronologia versioni</CardTitle>
      </CardHeader>
      <CardContent>
        {versions && versions.length > 0 ? (
          <div className="space-y-4">
            {versions.map((versione: any, index: number) => (
              <div key={versione.id} className="flex items-center justify-between p-4 bg-lavender-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="font-medium text-slate-gray">
                      Versione {versions.length - index}
                    </span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {versione.tipo_output}
                    </Badge>
                    {versione.refined_from_version_id && (
                      <Badge variant="secondary" className="text-xs">
                        Raffinamento
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-gray-600">
                    Elaborazione {versione.tipo_output}
                  </p>
                  <p className="text-xs text-slate-gray-400 mt-1">
                    {new Date(versione.creato_il).toLocaleDateString('it-IT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue"
                      onClick={() => setSelectedVersion(versione)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizza
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {versione.tipo_output}
                        </Badge>
                        Versione {versions.length - index}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-gray leading-relaxed">
                        {versione.contenuto_output}
                      </pre>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-slate-gray-300 mx-auto mb-4" />
            <p className="text-slate-gray-600">Nessuna versione disponibile</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DocumentVersions
