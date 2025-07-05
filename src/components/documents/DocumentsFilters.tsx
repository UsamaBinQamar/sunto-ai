
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, Folder, Tag } from "lucide-react"
import { Tables } from "@/integrations/supabase/types"

type Cartella = Tables<'cartelle'>
type TagType = Tables<'tag'>

interface DocumentsFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedFolder: string
  setSelectedFolder: (folder: string) => void
  selectedTag: string
  setSelectedTag: (tag: string) => void
  cartelle: Cartella[]
  tags: TagType[]
}

const DocumentsFilters = ({
  searchQuery,
  setSearchQuery,
  selectedFolder,
  setSelectedFolder,
  selectedTag,
  setSelectedTag,
  cartelle,
  tags
}: DocumentsFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray-400 w-4 h-4" />
        <Input
          placeholder="Cerca documenti..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo"
        />
      </div>
      
      <Select value={selectedFolder} onValueChange={setSelectedFolder}>
        <SelectTrigger className="w-48 border-lavender-gray">
          <Folder className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Tutte le cartelle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tutte le cartelle</SelectItem>
          {cartelle.map((cartella) => (
            <SelectItem key={cartella.id} value={cartella.id}>
              {cartella.nome_cartella}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTag} onValueChange={setSelectedTag}>
        <SelectTrigger className="w-48 border-lavender-gray">
          <Tag className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Tutti i tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tutti i tag</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.id} value={tag.nome}>
              {tag.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">
        <Filter className="w-4 h-4 mr-2" />
        Filtri
      </Button>
    </div>
  )
}

export default DocumentsFilters
