import { NavLink } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarMenuGroupProps {
  title: string;
  items: MenuItem[];
  collapsed: boolean;
}

export function SidebarMenuGroup({
  title,
  items,
  collapsed,
}: SidebarMenuGroupProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white font-bold text-xs uppercase tracking-wide px-4 py-2 font-inter">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end>
                  {!collapsed && (
                    <>
                      <item.icon className="w-4 h-4 mr-3 flex-shrink-0 text-white" />
                      <span className="text-white">{item.title}</span>
                    </>
                  )}
                  {collapsed && <item.icon className="w-4 h-4 text-white" />}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
