
import { 
  Home, 
  FileText, 
  Settings, 
  Star,
  Users,
  Folder,
  Tag,
  Settings2,
  Workflow
} from "lucide-react"

export const documentiItems = [
  { title: "Tutti i documenti", url: "/documenti", icon: FileText },
  { title: "Le mie cartelle", url: "/cartelle", icon: Folder },
  { title: "Tag", url: "/tag", icon: Tag },
  { title: "Preferiti", url: "/preferiti", icon: Star },
  { title: "Condivisi con me", url: "/condivisi", icon: Users },
]

export const iaItems = [
  { title: "Azioni IA", url: "/azioni-ia-personalizzate", icon: Settings2 },
  { title: "Workflows IA", url: "/workflows-ai", icon: Workflow },
]

export const otherItems = [
  { title: "Trascrizioni", url: "/trascrizioni", icon: FileText },
  { title: "Team", url: "/team", icon: Users },
  { title: "Impostazioni", url: "/impostazioni", icon: Settings },
]

export const dashboardItem = { title: "Dashboard", url: "/", icon: Home }
