
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Brain, MessageSquare, History } from "lucide-react"
import DocumentContent from "./DocumentContent"
import DocumentAIChat from "./DocumentAIChat"
import DocumentCollaborators from "./DocumentCollaborators"
import DocumentVersions from "./DocumentVersions"

interface DocumentTabsProps {
  document: any
  activeTab: string
  onTabChange: (tab: string) => void
}

const DocumentTabs = ({ document, activeTab, onTabChange }: DocumentTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 bg-soft-white border border-lavender-gray">
        <TabsTrigger 
          value="trascrizione" 
          className="text-slate-gray data-[state=active]:bg-electric-indigo data-[state=active]:text-white data-[state=active]:border-electric-indigo hover:bg-electric-indigo-50 hover:text-electric-indigo transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          Contenuto
        </TabsTrigger>
        <TabsTrigger 
          value="ai-chat" 
          className="text-slate-gray data-[state=active]:bg-electric-indigo data-[state=active]:text-white data-[state=active]:border-electric-indigo hover:bg-electric-indigo-50 hover:text-electric-indigo transition-colors"
        >
          <Brain className="w-4 h-4 mr-2" />
          Chat IA
        </TabsTrigger>
        <TabsTrigger 
          value="commenti" 
          className="text-slate-gray data-[state=active]:bg-electric-indigo data-[state=active]:text-white data-[state=active]:border-electric-indigo hover:bg-electric-indigo-50 hover:text-electric-indigo transition-colors"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Collaboratori
        </TabsTrigger>
        <TabsTrigger 
          value="versioni" 
          className="text-slate-gray data-[state=active]:bg-electric-indigo data-[state=active]:text-white data-[state=active]:border-electric-indigo hover:bg-electric-indigo-50 hover:text-electric-indigo transition-colors"
        >
          <History className="w-4 h-4 mr-2" />
          Versioni
        </TabsTrigger>
      </TabsList>

      <TabsContent value="trascrizione">
        <DocumentContent document={document} />
      </TabsContent>

      <TabsContent value="ai-chat">
        <DocumentAIChat document={document} />
      </TabsContent>

      <TabsContent value="commenti">
        <DocumentCollaborators document={document} />
      </TabsContent>

      <TabsContent value="versioni">
        <DocumentVersions document={document} />
      </TabsContent>
    </Tabs>
  )
}

export default DocumentTabs
