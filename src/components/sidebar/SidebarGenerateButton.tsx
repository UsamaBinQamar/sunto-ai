
import { Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface SidebarGenerateButtonProps {
  collapsed: boolean
}

export function SidebarGenerateButton({ collapsed }: SidebarGenerateButtonProps) {
  const navigate = useNavigate()

  const handleGeneraClick = () => {
    navigate('/genera')
  }

  return (
    <div className="p-4" style={{ backgroundColor: '#6366F1' }}>
      <Button 
        onClick={handleGeneraClick}
        className="w-full bg-white text-electric-indigo font-semibold py-3 rounded-lg shadow-lg hover:bg-lavender-gray hover:shadow-xl transition-all duration-300 border-2 border-white"
        size={collapsed ? "icon" : "default"}
      >
        {collapsed ? <Sparkles className="w-5 h-5" /> : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            GENERA
          </>
        )}
      </Button>
    </div>
  )
}
