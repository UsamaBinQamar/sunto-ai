
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from "lucide-react"
import { useCreateAzionePersonalizzata } from "@/hooks/useAzioniPersonalizzate"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface CreateActionWizardProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const CreateActionWizard = ({ isOpen, onOpenChange }: CreateActionWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [actionName, setActionName] = useState("")
  const [userDescription, setUserDescription] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
  
  const createMutation = useCreateAzionePersonalizzata()

  const enhancePromptFromDescription = async (description: string): Promise<string> => {
    try {
      setIsEnhancing(true)
      console.log('Calling enhance-prompt function with:', description)
      
      const { data, error } = await supabase.functions.invoke('enhance-prompt', {
        body: { userDescription: description }
      })

      if (error) {
        console.error('Error calling enhance-prompt function:', error)
        throw error
      }

      if (!data?.enhancedPrompt) {
        throw new Error('No enhanced prompt received from API')
      }

      console.log('Enhanced prompt received:', data.enhancedPrompt)
      return data.enhancedPrompt
    } catch (error) {
      console.error('Error enhancing prompt:', error)
      toast.error('Errore nel miglioramento del prompt. Riprova.')
      // Fallback to a basic enhanced prompt
      return `Sei un assistente IA specializzato. ${description}. Analizza il contenuto fornito e fornisci una risposta dettagliata e professionale seguendo queste linee guida: 1) Mantieni un tono professionale e informativo, 2) Struttura la risposta in modo chiaro e logico, 3) Fornisci esempi concreti quando appropriato, 4) Assicurati che la risposta sia completa e utile per l'utente.`
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleNext = async () => {
    if (currentStep === 2 && userDescription.trim()) {
      const enhanced = await enhancePromptFromDescription(userDescription)
      setEnhancedPrompt(enhanced)
    }
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSave = async () => {
    if (!actionName.trim() || !enhancedPrompt.trim()) return

    await createMutation.mutateAsync({
      nome_azione: actionName,
      descrizione_user: userDescription,
      prompt_enhanced: enhancedPrompt,
      prompt_ai: enhancedPrompt
    })

    // Reset form and close dialog
    setCurrentStep(1)
    setActionName("")
    setUserDescription("")
    setEnhancedPrompt("")
    onOpenChange(false)
  }

  const handleClose = () => {
    setCurrentStep(1)
    setActionName("")
    setUserDescription("")
    setEnhancedPrompt("")
    onOpenChange(false)
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Nome dell'Azione"
      case 2: return "Descrivi la tua Azione"
      case 3: return "Anteprima Prompt Migliorato"
      case 4: return "Salva la tua Azione"
      default: return ""
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return actionName.trim().length > 0
      case 2: return userDescription.trim().length > 0
      case 3: return true
      case 4: return true
      default: return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-electric-indigo" />
            Crea Nuova Azione IA - Passo {currentStep} di 4
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-lavender-gray rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-gray mb-2">
              {getStepTitle()}
            </h3>
          </div>

          {/* Step 1: Action Name */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label htmlFor="action-name" className="text-base font-medium">
                    Come vuoi chiamare la tua azione?
                  </Label>
                  <Input
                    id="action-name"
                    value={actionName}
                    onChange={(e) => setActionName(e.target.value)}
                    placeholder="es. Riassunto Tecnico, Analisi Sentimenti, Correzione Grammaticale"
                    className="text-base"
                  />
                  <p className="text-sm text-slate-gray-600">
                    Scegli un nome descrittivo che ti aiuti a identificare facilmente questa azione.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: User Description */}
          {currentStep === 2 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label htmlFor="user-description" className="text-base font-medium">
                    Descrivi cosa dovrebbe fare la tua azione IA
                  </Label>
                  <Textarea
                    id="user-description"
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    placeholder="es. Voglio che analizzi il testo e mi fornisca un riassunto di massimo 200 parole evidenziando i punti chiave e le conclusioni principali"
                    rows={6}
                    className="text-base"
                  />
                  <p className="text-sm text-slate-gray-600">
                    Spiega nel dettaglio cosa vuoi che faccia l'IA. Più dettagli fornisci, migliore sarà il risultato.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Enhanced Prompt Preview */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Ecco il prompt migliorato generato dall'IA:
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEnhancing ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Sto migliorando il tuo prompt con OpenAI...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-lavender-gray/20 p-4 rounded-lg border">
                      <p className="text-sm text-slate-gray-700 whitespace-pre-wrap">
                        {enhancedPrompt}
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 text-sm text-slate-gray-600">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>
                        Il prompt è stato ottimizzato utilizzando OpenAI per ottenere risultati più precisi e coerenti dall'IA.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Final Review */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Riepilogo della tua nuova azione:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Nome Azione:</Label>
                    <p className="text-slate-gray-700 mt-1">{actionName}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Descrizione Originale:</Label>
                    <p className="text-slate-gray-700 mt-1 text-sm">{userDescription}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Prompt Ottimizzato:</Label>
                    <div className="bg-lavender-gray/20 p-3 rounded-lg border mt-1">
                      <p className="text-sm text-slate-gray-700 line-clamp-4">
                        {enhancedPrompt}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Indietro
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Annulla
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!canProceed() || isEnhancing}
                  className="bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700"
                >
                  {isEnhancing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Elaborando...
                    </>
                  ) : (
                    <>
                      Avanti
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleSave}
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Salva Azione
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateActionWizard
