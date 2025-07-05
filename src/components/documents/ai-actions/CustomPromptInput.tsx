
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import CustomPromptCreator from "./CustomPromptCreator"

interface CustomPromptInputProps {
  customPrompt: string
  onCustomPromptChange: (prompt: string) => void
}

const CustomPromptInput = ({ customPrompt, onCustomPromptChange }: CustomPromptInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="custom-prompt" className="text-slate-gray">Oppure usa un prompt personalizzato</Label>
        <CustomPromptCreator />
      </div>
      <Textarea
        id="custom-prompt"
        value={customPrompt}
        onChange={(e) => onCustomPromptChange(e.target.value)}
        placeholder="Descrivi cosa vuoi ottenere dal contenuto..."
        rows={4}
        className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo text-slate-gray bg-soft-white placeholder:text-slate-gray-400"
      />
    </div>
  )
}

export default CustomPromptInput
