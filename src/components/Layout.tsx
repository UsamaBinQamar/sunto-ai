
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-soft-white">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-40 bg-soft-white border-b border-lavender-gray px-4 py-2">
            <SidebarTrigger className="h-8 w-8 text-slate-gray hover:bg-lavender-gray hover:text-electric-indigo transition-colors rounded-md" />
          </div>
          <div className="p-4 bg-soft-white">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
