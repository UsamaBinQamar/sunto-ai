
import { Fragment } from "react"
import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbItem {
  id: string | null
  nome: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  onNavigate: (folderId: string | null) => void
}

const BreadcrumbNav = ({ items, onNavigate }: BreadcrumbNavProps) => {
  return (
    <div className="flex items-center space-x-1 text-sm text-slate-gray-600 bg-soft-white border-b border-lavender-gray px-4 py-3">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-3 hover:bg-electric-indigo/10 text-slate-gray hover:text-electric-indigo transition-colors"
        onClick={() => onNavigate(null)}
      >
        <Home className="h-4 w-4 mr-2" />
        <span>Le mie cartelle</span>
      </Button>
      
      {items.map((item, index) => (
        <Fragment key={item.id || 'root'}>
          <ChevronRight className="h-4 w-4 text-slate-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            className={`
              h-7 px-3 hover:bg-electric-indigo/10 transition-colors
              ${index === items.length - 1 
                ? 'text-electric-indigo font-medium' 
                : 'text-slate-gray hover:text-electric-indigo'
              }
            `}
            onClick={() => onNavigate(item.id)}
            disabled={index === items.length - 1}
          >
            <span className="truncate max-w-32">{item.nome}</span>
          </Button>
        </Fragment>
      ))}
    </div>
  )
}

export default BreadcrumbNav
