
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Play, 
  Pause,
  Clock,
  Calendar,
  MoreVertical,
  Upload,
  Mic
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Trascrizioni = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const transcriptions = [
    {
      id: 1,
      title: "Meeting Team Marketing Q4",
      date: "2024-01-15",
      duration: "45:23",
      status: "Completata",
      participants: ["Marco Rossi", "Laura Bianchi", "Giuseppe Verde"],
      fileSize: "12.5 MB",
      language: "Italiano"
    },
    {
      id: 2,
      title: "Call Cliente ABC Corporation",
      date: "2024-01-14",
      duration: "32:17",
      status: "In elaborazione",
      participants: ["Maria Neri", "Cliente ABC"],
      fileSize: "8.2 MB",
      language: "Italiano"
    },
    {
      id: 3,
      title: "Brainstorming Nuovo Prodotto",
      date: "2024-01-13",
      duration: "1:15:42",
      status: "Completata",
      participants: ["Team Prodotto"],
      fileSize: "25.8 MB",
      language: "Italiano"
    },
    {
      id: 4,
      title: "Review Trimestrale",
      date: "2024-01-12",
      duration: "58:30",
      status: "Completata",
      participants: ["Direzione", "Team Lead"],
      fileSize: "18.9 MB",
      language: "Italiano"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completata":
        return "bg-cool-teal-100 text-cool-teal-800 border-cool-teal-200"
      case "In elaborazione":
        return "bg-sky-blue-100 text-sky-blue-800 border-sky-blue-200"
      case "Fallita":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-lavender-gray-100 text-slate-gray-800 border-lavender-gray-200"
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-gray mb-2">Trascrizioni</h1>
          <p className="text-slate-gray-600">Gestisci e visualizza tutte le tue trascrizioni</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">
            <Upload className="w-4 h-4" />
            <span>Carica File</span>
          </Button>
          <Button className="bg-electric-indigo hover:bg-electric-indigo-600 text-white flex items-center space-x-2">
            <Mic className="w-4 h-4" />
            <span>Nuova Registrazione</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6 bg-soft-white border-lavender-gray">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray-400 w-4 h-4" />
              <Input
                placeholder="Cerca trascrizioni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-lavender-gray focus:border-sky-blue"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2 border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">
              <Filter className="w-4 h-4" />
              <span>Filtri</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-soft-white border-lavender-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-gray-600 mb-1">Totale</p>
                <p className="text-2xl font-bold text-slate-gray">47</p>
              </div>
              <FileText className="w-8 h-8 text-electric-indigo" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-soft-white border-lavender-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-gray-600 mb-1">Questo Mese</p>
                <p className="text-2xl font-bold text-slate-gray">12</p>
              </div>
              <Calendar className="w-8 h-8 text-cool-teal" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-soft-white border-lavender-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-gray-600 mb-1">Ore Totali</p>
                <p className="text-2xl font-bold text-slate-gray">32.5h</p>
              </div>
              <Clock className="w-8 h-8 text-sky-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-soft-white border-lavender-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-gray-600 mb-1">In Elaborazione</p>
                <p className="text-2xl font-bold text-slate-gray">1</p>
              </div>
              <div className="w-8 h-8 bg-sky-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-sky-blue rounded-full animate-pulse-soft"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transcriptions List */}
      <Card className="bg-soft-white border-lavender-gray">
        <CardHeader>
          <CardTitle className="text-slate-gray">Le Tue Trascrizioni</CardTitle>
          <CardDescription className="text-slate-gray-600">Clicca su una trascrizione per visualizzarla</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transcriptions.map((transcription) => (
              <div key={transcription.id} className="border border-lavender-gray rounded-lg p-4 hover:shadow-md hover:border-sky-blue transition-all cursor-pointer bg-soft-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-gray">{transcription.title}</h3>
                      <Badge className={getStatusColor(transcription.status)}>
                        {transcription.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(transcription.date).toLocaleDateString('it-IT')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{transcription.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{transcription.fileSize}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{transcription.language}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-slate-gray-600">
                        Partecipanti: {transcription.participants.join(", ")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {transcription.status === "Completata" && (
                      <>
                        <Button variant="outline" size="sm" className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">
                          <Play className="w-4 h-4 mr-1" />
                          Riproduci
                        </Button>
                        <Button variant="outline" size="sm" className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">
                          <Download className="w-4 h-4 mr-1" />
                          Scarica
                        </Button>
                      </>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-gray hover:bg-sky-blue hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-soft-white border-lavender-gray">
                        <DropdownMenuItem className="text-slate-gray hover:bg-sky-blue hover:text-white">Visualizza</DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-gray hover:bg-sky-blue hover:text-white">Modifica</DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-gray hover:bg-sky-blue hover:text-white">Condividi</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-red-100 hover:text-red-800">Elimina</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Trascrizioni
