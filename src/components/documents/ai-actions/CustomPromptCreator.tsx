
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCreateCustomPrompt } from "@/hooks/useCustomPrompts"
import { toast } from 'sonner'

const CustomPromptCreator = () => {
  const [newPromptTitle, setNewPromptTitle] = useState('')
  const [newPromptText, setNewPromptText] = useState('')
  const createCustomPromptMutation = useCreateCustomPrompt()

  const handleCreateCustomPrompt = async () => {
    if (!newPromptTitle.trim() || !newPromptText.trim()) {
      toast.error('Inserisci titolo e testo del prompt')
      return
    }

    try {
      await createCustomPromptMutation.mutateAsync({
        titolo: newPromptTitle,
        prompt_text: newPromptText
      })
      
      setNewPromptTitle('')
      setNewPromptText('')
      toast.success('Prompt personalizzato salvato!')
    } catch (error) {
      console.error('Error creating custom prompt:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Salva Prompt
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea Prompt Personalizzato</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt-title">Titolo</Label>
            <Input
              id="prompt-title"
              value={newPromptTitle}
              onChange={(e) => setNewPromptTitle(e.target.value)}
              placeholder="Nome del prompt..."
            />
          </div>
          <div>
            <Label htmlFor="prompt-text">Prompt</Label>
            <Textarea
              id="prompt-text"
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              placeholder="Inserisci il testo del prompt..."
              rows={4}
            />
          </div>
          <Button onClick={handleCreateCustomPrompt} className="w-full">
            Salva Prompt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomPromptCreator
