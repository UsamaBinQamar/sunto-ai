import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useCartelle, useCreateCartella, useUpdateCartella, useDeleteCartella } from "@/hooks/useCartelle";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import FolderTree from "@/components/folder-navigation/FolderTree";
import BreadcrumbNav from "@/components/folder-navigation/BreadcrumbNav";
import FolderListView from "@/components/folder-navigation/FolderListView";
const Cartelle = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const {
    user
  } = useAuth();
  const {
    data: cartelle = [],
    isLoading,
    refetch
  } = useCartelle();
  const createCartellaMutation = useCreateCartella();
  const updateCartellaMutation = useUpdateCartella();
  const deleteCartellaMutation = useDeleteCartella();
  const handleCreateFolder = async (name: string, parentId: string | null) => {
    if (!user) return;
    try {
      await createCartellaMutation.mutateAsync({
        nome_cartella: name,
        utente_id: user.id,
        cartella_padre_id: parentId
      });
      refetch();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };
  const handleRenameFolder = async (id: string, newName: string) => {
    try {
      await updateCartellaMutation.mutateAsync({
        id,
        updates: {
          nome_cartella: newName
        }
      });
      refetch();
    } catch (error) {
      console.error("Error renaming folder:", error);
    }
  };
  const handleDeleteFolder = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questa cartella e tutto il suo contenuto?")) {
      try {
        await deleteCartellaMutation.mutateAsync(id);
        if (selectedFolderId === id) {
          setSelectedFolderId(null);
        }
        refetch();
      } catch (error) {
        console.error("Error deleting folder:", error);
      }
    }
  };
  const refreshData = () => {
    refetch();
    toast.success("Cartelle aggiornate");
  };

  // Build breadcrumb path
  const buildBreadcrumbPath = (folderId: string | null): Array<{
    id: string | null;
    nome: string;
  }> => {
    if (!folderId) return [];
    const path: Array<{
      id: string | null;
      nome: string;
    }> = [];
    let currentFolder = cartelle.find(f => f.id === folderId);
    while (currentFolder) {
      path.unshift({
        id: currentFolder.id,
        nome: currentFolder.nome_cartella
      });
      currentFolder = currentFolder.cartella_padre_id ? cartelle.find(f => f.id === currentFolder.cartella_padre_id) : null;
    }
    return path;
  };

  // Get children of current folder
  const currentFolderChildren = cartelle.filter(folder => folder.cartella_padre_id === selectedFolderId);

  // Prepare list items for FolderListView (only folders, no documents)
  const folderItems = currentFolderChildren.map(folder => ({
    id: folder.id,
    nome_cartella: folder.nome_cartella,
    creata_il: folder.creata_il,
    type: 'folder' as const
  }));
  if (isLoading) {
    return <div className="p-8 bg-soft-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-indigo mx-auto mb-4"></div>
          <p className="text-slate-gray">Caricamento cartelle...</p>
        </div>
      </div>;
  }
  return <div className="h-screen bg-soft-white flex flex-col">
      {/* Header */}
      <div className="border-b border-lavender-gray p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-gray mb-2">Cartelle</h1>
            <p className="text-slate-gray-600">Organizza i tuoi documenti in cartelle</p>
          </div>
          <Button variant="outline" onClick={refreshData} className="border-lavender-gray text-slate-gray hover:bg-sky-blue hover:text-white hover:border-sky-blue">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      </div>
      
      {/* Main content with two-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Folder tree */}
        <div className="w-64 bg-soft-white border-r border-lavender-gray overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-gray mb-3 uppercase tracking-wide">LE MIE CARTELLE</h2>
            <FolderTree folders={cartelle} selectedFolderId={selectedFolderId} onFolderSelect={setSelectedFolderId} />
          </div>
        </div>
        
        {/* Right side - Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb navigation */}
          <BreadcrumbNav items={buildBreadcrumbPath(selectedFolderId)} onNavigate={setSelectedFolderId} />
          
          {/* Folder list */}
          <div className="flex-1 overflow-y-auto">
            <FolderListView items={folderItems} currentFolderId={selectedFolderId} onFolderSelect={setSelectedFolderId} onDocumentSelect={() => {}} // Not used in cartelle page
          onCreateFolder={handleCreateFolder} onRenameFolder={handleRenameFolder} onDeleteFolder={handleDeleteFolder} onDeleteDocument={() => {}} // Not used in cartelle page
          />
          </div>
        </div>
      </div>
    </div>;
};
export default Cartelle;