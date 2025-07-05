
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface AIProcessingButtonProps {
  isProcessing: boolean
  isDisabled: boolean
  onClick: () => void
}

const AIProcessingButton = ({ isProcessing, isDisabled, onClick }: AIProcessingButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={isDisabled}
      className="w-full bg-gradient-to-r from-electric-indigo to-electric-indigo-600 hover:from-electric-indigo-700 hover:to-electric-indigo-700 text-white"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Elaborazione in corso...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Elabora con IA
        </>
      )}
    </Button>
  )
}

export default AIProcessingButton
