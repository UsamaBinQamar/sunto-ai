
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

const Condivisi = () => {
  return (
    <div className="p-8 bg-soft-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-gray mb-2">Condivisi con me</h1>
        <p className="text-slate-gray-600">Documenti condivisi da altri utenti</p>
      </div>

      <div className="text-center py-12">
        <Users className="w-16 h-16 text-sky-blue mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-gray mb-2">Nessun documento condiviso</h3>
        <p className="text-slate-gray-600">
          Quando qualcuno condividerà documenti con te, appariranno qui.
        </p>
      </div>
    </div>
  )
}

export default Condivisi
