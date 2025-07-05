
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder, FileText, MoreVertical, Calendar, Edit2, Trash2, FolderPlus, Plus, Check, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ViewModeToggle from "./ViewModeToggle";
import BulkActionsBar from "./BulkActionsBar";
import GridView from "./GridView";

interface FolderItem {
  id: string;
  nome_cartella: string;
  creata_il: string;
  type: 'folder';
}

interface DocumentItem {
  id: string;
  titolo: string;
  anteprima_ai?: string | null;
  creato_il: string;
  tipo_documento: string;
  type: 'document';
}

type ListItem = FolderItem | DocumentItem;

interface FolderListViewProps {
  items: ListItem[];
  currentFolderId: string | null;
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  onCreateFolder: (name: string, parentId: string | null) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onDeleteFolder: (id: string) => void;
  onDeleteDocument: (id: string) => void;
}

const FolderListView = ({
  items,
  currentFolderId,
  onFolderSelect,
  onDocumentSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onDeleteDocument
}: FolderListViewProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleRename = (id: string) => {
    if (editedName.trim()) {
      onRenameFolder(id, editedName.trim());
      setEditingItem(null);
      setEditedName("");
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditedName("");
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingItem(id);
    setEditedName(currentName);
  };

  const handleItemSelect = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(new Set(items.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const toggleMultiSelect = () => {
    setMultiSelectMode(!multiSelectMode);
    setSelectedItems(new Set());
  };

  const handleBulkActions = {
    delete: () => {
      if (window.confirm(`Sei sicuro di voler eliminare ${selectedItems.size} elementi?`)) {
        selectedItems.forEach(id => {
          const item = items.find(i => i.id === id);
          if (item?.type === 'folder') {
            onDeleteFolder(id);
          } else {
            onDeleteDocument(id);
          }
        });
        setSelectedItems(new Set());
      }
    },
    move: () => console.log('Bulk move not implemented'),
    tag: () => console.log('Bulk tag not implemented'),
    favorite: () => console.log('Bulk favorite not implemented'),
    download: () => console.log('Bulk download not implemented')
  };

  const folders = items.filter(item => item.type === 'folder') as FolderItem[];
  const documents = items.filter(item => item.type === 'document') as DocumentItem[];
  const hasDocuments = documents.length > 0;

  return (
    <div className="flex-1 bg-soft-white">
      {/* Header with actions */}
      <div className="flex items-center justify-between p-4 border-b border-lavender-gray">
        <div className="flex items-center space-x-4">
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={toggleMultiSelect}
            className={`
              ${multiSelectMode 
                ? "bg-electric-indigo text-white border-electric-indigo hover:bg-electric-indigo-600" 
                : "text-slate-gray border-lavender-gray hover:bg-lavender-gray"
              }
            `}
          >
            Selezione multipla
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-electric-indigo hover:bg-electric-indigo-700 text-white"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            {currentFolderId ? 'Nuova sottocartella' : 'Nuova cartella'}
          </Button>
        </div>
      </div>

      {/* Bulk actions bar */}
      <BulkActionsBar
        selectedCount={selectedItems.size}
        onClearSelection={() => setSelectedItems(new Set())}
        onBulkDelete={handleBulkActions.delete}
        onBulkMove={handleBulkActions.move}
        onBulkTag={handleBulkActions.tag}
        onBulkFavorite={handleBulkActions.favorite}
        onBulkDownload={handleBulkActions.download}
        hasDocuments={hasDocuments}
      />

      {/* Content based on view mode */}
      {viewMode === 'grid' ? (
        <GridView
          items={items}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
          onFolderSelect={onFolderSelect}
          onDocumentSelect={onDocumentSelect}
          onDeleteFolder={onDeleteFolder}
          onDeleteDocument={onDeleteDocument}
          multiSelectMode={multiSelectMode}
        />
      ) : (
        <div className="p-4">
          {/* List view table */}
          {items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {multiSelectMode && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.size === items.length && items.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  <TableHead className="text-slate-gray-600 font-medium">Nome</TableHead>
                  <TableHead className="text-slate-gray-600 font-medium">Tipo</TableHead>
                  <TableHead className="text-slate-gray-600 font-medium">Creato il</TableHead>
                  <TableHead className="text-slate-gray-600 font-medium">Anteprima</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow
                    key={item.id}
                    className={`
                      cursor-pointer hover:bg-lavender-gray/50
                      ${selectedItems.has(item.id) ? 'bg-electric-indigo/10' : ''}
                    `}
                    onClick={() => {
                      if (multiSelectMode) {
                        handleItemSelect(item.id, !selectedItems.has(item.id));
                      } else if (item.type === 'folder') {
                        onFolderSelect(item.id);
                      } else {
                        onDocumentSelect(item.id);
                      }
                    }}
                  >
                    {multiSelectMode && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={(checked) => handleItemSelect(item.id, !!checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-8 h-8 rounded flex items-center justify-center
                          ${item.type === 'folder' ? 'bg-electric-indigo-50' : 'bg-sky-blue-50'}
                        `}>
                          {item.type === 'folder' ? (
                            <Folder className="w-4 h-4 text-electric-indigo" />
                          ) : (
                            <FileText className="w-4 h-4 text-sky-blue" />
                          )}
                        </div>
                        {editingItem === item.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename(item.id);
                                if (e.key === 'Escape') cancelEditing();
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="h-8 text-sm"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(item.id);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelEditing();
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <span className="font-medium text-slate-gray">
                            {item.type === 'folder' ? item.nome_cartella : item.titolo}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.type === 'folder' ? (
                        <Badge variant="outline">Cartella</Badge>
                      ) : (
                        <Badge variant="secondary">{item.tipo_documento}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-gray-600">
                      {new Date(item.type === 'folder' ? item.creata_il : item.creato_il).toLocaleDateString('it-IT')}
                    </TableCell>
                    <TableCell className="text-slate-gray-400 text-sm max-w-64 truncate">
                      {item.type === 'document' && item.anteprima_ai 
                        ? item.anteprima_ai.substring(0, 100) + '...' 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {!multiSelectMode && editingItem !== item.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {item.type === 'folder' && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditing(item.id, item.nome_cartella);
                                }}
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Rinomina
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.type === 'folder') {
                                  onDeleteFolder(item.id);
                                } else {
                                  onDeleteDocument(item.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Elimina
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-slate-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-gray mb-2">Cartella vuota</h3>
              <p className="text-slate-gray-600 mb-4">
                Questa cartella non contiene ancora documenti o sottocartelle.
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-electric-indigo hover:bg-electric-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crea Cartella
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create folder dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentFolderId ? 'Crea nuova sottocartella' : 'Crea nuova cartella'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome cartella"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
              }}
              className="border-lavender-gray focus:border-electric-indigo focus:ring-electric-indigo"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setNewFolderName("");
                }}
              >
                Annulla
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="bg-electric-indigo hover:bg-electric-indigo-700 text-white"
              >
                Crea
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderListView;
