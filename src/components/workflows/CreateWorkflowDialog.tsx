
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateWorkflow } from "@/hooks/useWorkflows"

interface CreateWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkflowCreated: (workflowId: string) => void
}

const CreateWorkflowDialog = ({ open, onOpenChange, onWorkflowCreated }: CreateWorkflowDialogProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    descrizione: '',
    stato: 'bozza' as 'attivo' | 'bozza' | 'archiviato'
  })

  const createWorkflowMutation = useCreateWorkflow()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim()) return

    try {
      const workflow = await createWorkflowMutation.mutateAsync(formData)
      onWorkflowCreated(workflow.id)
      onOpenChange(false)
      setFormData({ nome: '', descrizione: '', stato: 'bozza' })
    } catch (error) {
      console.error('Error creating workflow:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-soft-white border-lavender-gray">
        <DialogHeader>
          <DialogTitle className="text-slate-gray">Crea Nuovo Workflow</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-gray mb-1">
              Nome Workflow *
            </label>
            <Input
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Es. Analisi Documenti Legali"
              className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-gray mb-1">
              Descrizione
            </label>
            <Textarea
              value={formData.descrizione}
              onChange={(e) => setFormData(prev => ({ ...prev, descrizione: e.target.value }))}
              placeholder="Descrizione del workflow e del suo scopo..."
              rows={3}
              className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-gray mb-1">
              Stato
            </label>
            <Select 
              value={formData.stato} 
              onValueChange={(value: 'attivo' | 'bozza' | 'archiviato') => 
                setFormData(prev => ({ ...prev, stato: value }))
              }
            >
              <SelectTrigger className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bozza">Bozza</SelectItem>
                <SelectItem value="attivo">Attivo</SelectItem>
                <SelectItem value="archiviato">Archiviato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-lavender-gray text-slate-gray hover:bg-lavender-gray"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={!formData.nome.trim() || createWorkflowMutation.isPending}
              className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
            >
              {createWorkflowMutation.isPending ? 'Creazione...' : 'Crea Workflow'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkflowDialog
