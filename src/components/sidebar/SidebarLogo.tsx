
import { Sparkles } from "lucide-react"

interface SidebarLogoProps {
  collapsed: boolean
}

export function SidebarLogo({ collapsed }: SidebarLogoProps) {
  return (
    <div className="flex items-center justify-center p-4 border-b border-white/20" style={{ backgroundColor: '#6366F1' }}>
      {!collapsed && (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-white to-soft-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-electric-indigo" />
          </div>
          <span className="text-xl font-bold text-white font-inter">Sunto.ai</span>
        </div>
      )}
      {collapsed && (
        <div className="w-8 h-8 bg-gradient-to-br from-white to-soft-white rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-electric-indigo" />
        </div>
      )}
    </div>
  )
}
