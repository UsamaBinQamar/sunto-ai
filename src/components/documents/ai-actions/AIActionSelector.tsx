
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AIActionSelectorProps {
  selectedAction: string
  onActionChange: (action: string) => void
  customPrompts?: Array<{ id: string; titolo: string }>
}

const AIActionSelector = ({ selectedAction, onActionChange, customPrompts }: AIActionSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="action-select" className="text-slate-gray">Seleziona un'azione predefinita</Label>
      <Select value={selectedAction} onValueChange={onActionChange}>
        <SelectTrigger className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo text-slate-gray bg-soft-white">
          <SelectValue placeholder="Scegli un'azione..." className="text-slate-gray-400" />
        </SelectTrigger>
        <SelectContent className="bg-soft-white border-lavender-gray">
          <SelectItem value="sommario" className="text-slate-gray hover:bg-electric-indigo-50 focus:bg-electric-indigo-50">📋 Crea Sommario</SelectItem>
          <SelectItem value="punti" className="text-slate-gray hover:bg-electric-indigo-50 focus:bg-electric-indigo-50">📝 Estrai Punti Chiave</SelectItem>
          <SelectItem value="note" className="text-slate-gray hover:bg-electric-indigo-50 focus:bg-electric-indigo-50">📚 Crea Note di Studio</SelectItem>
          {customPrompts && customPrompts.length > 0 && (
            <>
              <SelectItem value="" disabled className="text-slate-gray-400 font-medium">
                ── Prompt Personalizzati ──
              </SelectItem>
              {customPrompts.map((prompt) => (
                <SelectItem key={prompt.id} value={`custom-${prompt.id}`} className="text-slate-gray hover:bg-electric-indigo-50 focus:bg-electric-indigo-50">
                  🎯 {prompt.titolo}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export default AIActionSelector
