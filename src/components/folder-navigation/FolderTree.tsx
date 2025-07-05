import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface FolderTreeItem {
  id: string;
  nome_cartella: string;
  cartella_padre_id: string | null;
  children?: FolderTreeItem[];
}
interface FolderTreeProps {
  folders: FolderTreeItem[];
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  className?: string;
}
const FolderTreeNode = ({
  folder,
  selectedFolderId,
  onFolderSelect,
  level = 0
}: {
  folder: FolderTreeItem;
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  level?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedFolderId === folder.id;
  return <div>
      <Button variant="ghost" size="sm" className={cn("w-full justify-start h-8 px-1 hover:bg-electric-indigo/10 rounded-md", isSelected && "bg-electric-indigo/15 text-electric-indigo font-medium border border-electric-indigo/20", "transition-all duration-200")} style={{
      paddingLeft: `${8 + level * 16}px`
    }} onClick={() => onFolderSelect(folder.id)}>
        <div className="flex items-center space-x-2 flex-1">
          {hasChildren ? <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent" onClick={e => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}>
              {isExpanded ? <ChevronDown className="h-3 w-3 text-slate-gray-400" /> : <ChevronRight className="h-3 w-3 text-slate-gray-400" />}
            </Button> : <div className="w-4" />}
          {isSelected ? <FolderOpen className="h-4 w-4 text-electric-indigo" /> : <Folder className="h-4 w-4 text-slate-gray-500" />}
          <span className="text-sm truncate flex-1 text-left">{folder.nome_cartella}</span>
        </div>
      </Button>
      
      {hasChildren && isExpanded && <div className="animate-in slide-in-from-top-1 duration-200">
          {folder.children?.map(child => <FolderTreeNode key={child.id} folder={child} selectedFolderId={selectedFolderId} onFolderSelect={onFolderSelect} level={level + 1} />)}
        </div>}
    </div>;
};
const FolderTree = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  className
}: FolderTreeProps) => {
  // Build tree structure
  const buildTree = (items: any[]): FolderTreeItem[] => {
    const itemMap = new Map();
    const rootItems: FolderTreeItem[] = [];

    // First pass: create map of all items
    items.forEach(item => {
      itemMap.set(item.id, {
        ...item,
        children: []
      });
    });

    // Second pass: build parent-child relationships
    items.forEach(item => {
      const treeItem = itemMap.get(item.id);
      if (item.cartella_padre_id && itemMap.has(item.cartella_padre_id)) {
        itemMap.get(item.cartella_padre_id).children.push(treeItem);
      } else {
        rootItems.push(treeItem);
      }
    });
    return rootItems;
  };
  const treeData = buildTree(folders);
  return <div className={cn("space-y-1", className)}>
      {/* Root folder option */}
      

      {/* Folder tree */}
      {treeData.map(folder => <FolderTreeNode key={folder.id} folder={folder} selectedFolderId={selectedFolderId} onFolderSelect={onFolderSelect} />)}
    </div>;
};
export default FolderTree;