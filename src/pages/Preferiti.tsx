
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

const Preferiti = () => {
  return (
    <div className="p-8 bg-soft-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-gray mb-2">Preferiti</h1>
        <p className="text-slate-gray-600">I tuoi documenti preferiti e più importanti</p>
      </div>

      <div className="text-center py-12">
        <Star className="w-16 h-16 text-cool-teal mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-gray mb-2">Nessun documento preferito</h3>
        <p className="text-slate-gray-600">
          Aggiungi documenti ai preferiti cliccando sulla stella nei tuoi documenti.
        </p>
      </div>
    </div>
  )
}

export default Preferiti
