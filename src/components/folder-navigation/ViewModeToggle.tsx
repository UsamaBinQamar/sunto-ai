
import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewModeToggleProps {
  viewMode: 'list' | 'grid'
  onViewModeChange: (mode: 'list' | 'grid') => void
}

const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex items-center space-x-1 border border-lavender-gray rounded-md bg-soft-white">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 px-3 ${viewMode === 'list' ? 'bg-electric-indigo text-white' : 'text-slate-gray hover:bg-lavender-gray'}`}
        onClick={() => onViewModeChange('list')}
      >
        <List className="h-4 w-4 mr-1" />
        <span className="text-xs">Vista elenco</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-electric-indigo text-white' : 'text-slate-gray hover:bg-lavender-gray'}`}
        onClick={() => onViewModeChange('grid')}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        <span className="text-xs">Vista griglia</span>
      </Button>
    </div>
  )
}

export default ViewModeToggle
