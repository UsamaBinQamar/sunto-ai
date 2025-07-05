
const DocumentLoading = () => {
  return (
    <div className="p-8 bg-soft-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-indigo mx-auto mb-4"></div>
        <p className="text-slate-gray">Caricamento documento...</p>
      </div>
    </div>
  )
}

export default DocumentLoading
