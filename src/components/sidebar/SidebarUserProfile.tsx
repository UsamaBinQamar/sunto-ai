
import { LogOut, User, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

interface SidebarUserProfileProps {
  collapsed: boolean
}

export function SidebarUserProfile({ collapsed }: SidebarUserProfileProps) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="mt-auto p-4 border-t border-white/20" style={{ backgroundColor: '#6366F1' }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={`w-full ${collapsed ? 'p-2' : 'justify-start'} text-white hover:text-electric-indigo hover:bg-lavender-gray transition-all duration-200`}
          >
            <User className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && (
              <span className="truncate text-white">
                {user?.email || 'User'}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white">
          <DropdownMenuItem onClick={() => navigate('/impostazioni')} className="text-slate-gray hover:bg-lavender-gray">
            <Settings className="w-4 h-4 mr-2" />
            Impostazioni
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnetti
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
