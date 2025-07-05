
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Brain, 
  Clock, 
  TrendingUp, 
  Mic, 
  Upload,
  Play,
  Pause
} from "lucide-react"

const Dashboard = () => {
  const stats = [
    {
      title: "Trascrizioni Totali",
      value: "47",
      change: "+12%",
      icon: FileText,
      color: "text-sky-blue"
    },
    {
      title: "Azioni IA Eseguite",
      value: "124",
      change: "+8%",
      icon: Brain,
      color: "text-electric-indigo"
    },
    {
      title: "Ore Trascritte",
      value: "32.5h",
      change: "+15%",
      icon: Clock,
      color: "text-cool-teal"
    },
    {
      title: "Tempo Risparmiato",
      value: "18.2h",
      change: "+22%",
      icon: TrendingUp,
      color: "text-electric-indigo-600"
    }
  ]

  const recentTranscriptions = [
    { id: 1, title: "Meeting Team Marketing", date: "2 ore fa", duration: "45 min", status: "Completata" },
    { id: 2, title: "Call Cliente ABC", date: "5 ore fa", duration: "32 min", status: "In elaborazione" },
    { id: 3, title: "Brainstorming Prodotto", date: "1 giorno fa", duration: "1h 15min", status: "Completata" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-gray mb-2">Dashboard</h1>
        <p className="text-slate-gray-600">Benvenuto su Sunto.ai - Il tuo assistente per trascrizioni intelligenti</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-dashed border-electric-indigo-200 hover:border-electric-indigo-300 transition-colors cursor-pointer bg-soft-white">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Mic className="w-12 h-12 text-electric-indigo mb-4" />
            <h3 className="text-lg font-semibold text-slate-gray mb-2">Registra Audio</h3>
            <p className="text-slate-gray-600 text-sm">Inizia una nuova registrazione</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-electric-indigo-200 hover:border-electric-indigo-300 transition-colors cursor-pointer bg-soft-white">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Upload className="w-12 h-12 text-electric-indigo mb-4" />
            <h3 className="text-lg font-semibold text-slate-gray mb-2">Carica File</h3>
            <p className="text-slate-gray-600 text-sm">Trascrivere file audio esistenti</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-electric-indigo-200 hover:border-electric-indigo-300 transition-colors cursor-pointer bg-soft-white">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Brain className="w-12 h-12 text-electric-indigo mb-4" />
            <h3 className="text-lg font-semibold text-slate-gray mb-2">Azioni IA</h3>
            <p className="text-slate-gray-600 text-sm">Esegui azioni personalizzate</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow bg-soft-white border-lavender-gray">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-gray">{stat.value}</p>
                  <p className="text-sm text-cool-teal mt-1">{stat.change} questo mese</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-soft-white border-lavender-gray">
          <CardHeader>
            <CardTitle className="text-slate-gray">Trascrizioni Recenti</CardTitle>
            <CardDescription className="text-slate-gray-600">Le tue ultime attività di trascrizione</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTranscriptions.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-lavender-gray-50 rounded-lg hover:bg-sky-blue-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-electric-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-electric-indigo" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-gray">{item.title}</h4>
                      <p className="text-sm text-slate-gray-600">{item.date} • {item.duration}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Completata' 
                      ? 'bg-cool-teal-100 text-cool-teal-800' 
                      : 'bg-sky-blue-100 text-sky-blue-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-soft-white border-lavender-gray">
          <CardHeader>
            <CardTitle className="text-slate-gray">Azioni IA Popolari</CardTitle>
            <CardDescription className="text-slate-gray-600">Le azioni più utilizzate questo mese</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-lavender-gray-50 rounded-lg hover:bg-sky-blue-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-electric-indigo-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-electric-indigo" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-gray">Riassunto Riunione</h4>
                    <p className="text-sm text-slate-gray-600">Utilizzata 23 volte</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">Usa</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-lavender-gray-50 rounded-lg hover:bg-sky-blue-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-electric-indigo-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-electric-indigo" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-gray">Lista Task</h4>
                    <p className="text-sm text-slate-gray-600">Utilizzata 18 volte</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">Usa</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-lavender-gray-50 rounded-lg hover:bg-sky-blue-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-electric-indigo-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-electric-indigo" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-gray">Email Follow-up</h4>
                    <p className="text-sm text-slate-gray-600">Utilizzata 12 volte</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">Usa</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
