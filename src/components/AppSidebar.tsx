
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SidebarLogo } from "@/components/sidebar/SidebarLogo"
import { SidebarGenerateButton } from "@/components/sidebar/SidebarGenerateButton"
import { SidebarMenuGroup } from "@/components/sidebar/SidebarMenuGroup"
import { SidebarUserProfile } from "@/components/sidebar/SidebarUserProfile"
import { 
  documentiItems, 
  iaItems, 
  otherItems, 
  dashboardItem 
} from "@/components/sidebar/sidebarConfig"

export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar 
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300`}
      style={{ backgroundColor: '#6366F1' }}
    >
      <SidebarLogo collapsed={collapsed} />

      <SidebarGenerateButton collapsed={collapsed} />

      <SidebarContent className="px-2" style={{ backgroundColor: '#6366F1' }}>
        {/* Dashboard - separate item */}
        <SidebarGroup className="mb-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={dashboardItem.url} 
                    end
                    className={({ isActive }) => 
                      `flex items-center w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? "bg-soft-white text-electric-indigo font-semibold border-l-4 border-electric-indigo" 
                          : "text-white hover:text-electric-indigo hover:bg-lavender-gray"
                      }`
                    }
                  >
                    {!collapsed && (
                      <>
                        <dashboardItem.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>{dashboardItem.title}</span>
                      </>
                    )}
                    {collapsed && <dashboardItem.icon className="w-4 h-4" />}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <>
            {/* Documenti Section */}
            <div className="mb-6">
              <SidebarMenuGroup title="📁 Documenti" items={documentiItems} collapsed={collapsed} />
            </div>

            {/* IA Section */}
            <div className="mb-6">
              <SidebarMenuGroup title="🤖 IA" items={iaItems} collapsed={collapsed} />
            </div>

            {/* Other items */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {otherItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          end
                          className={({ isActive }) => 
                            `flex items-center w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive 
                                ? "bg-soft-white text-electric-indigo font-semibold border-l-4 border-electric-indigo" 
                                : "text-white hover:text-electric-indigo hover:bg-lavender-gray"
                            }`
                          }
                        >
                          <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {collapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {[...documentiItems, ...iaItems, ...otherItems].map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end
                        className={({ isActive }) => 
                          `flex items-center justify-center w-full p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive 
                              ? "bg-soft-white text-electric-indigo font-semibold border-l-4 border-electric-indigo" 
                              : "text-white hover:text-electric-indigo hover:bg-lavender-gray"
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarUserProfile collapsed={collapsed} />
    </Sidebar>
  )
}
