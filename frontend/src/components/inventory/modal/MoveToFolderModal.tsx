import { useState } from 'react';
import { Folder, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import useGetInventoryFolderList from '@/hooks/queries/inventory/folder/useGetInventoryFolderList';
import useMoveInventoryItem from '@/hooks/queries/inventory/item/useMoveInventoryItem';
import { toast } from 'sonner';

type MoveToFolderModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: number;
    title: string;
    folderId: number;
  };
};

export default function MoveToFolderModal({
  isOpen,
  onOpenChange,
  item,
}: MoveToFolderModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const { inventoryFolderList, isLoading } = useGetInventoryFolderList();

  const { moveInventoryItemMutation, isPending } = useMoveInventoryItem(
    item.folderId,
  );

  const handleFolderSelect = (folderId: number) => {
    setSelectedFolderId(folderId);
  };

  const handleMove = () => {
    if (!selectedFolderId) return;

    moveInventoryItemMutation(
      {
        id: item.id,
        data: {
          folderId: selectedFolderId,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedFolderId(null);
          toast.success(`"${item.title}" 항목이 성공적으로 이동되었습니다.`);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>다른 폴더로 이동</DialogTitle>
          <DialogDescription>
            "{item.title}" 항목을 이동할 폴더를 선택해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-blue" />
            </div>
          ) : inventoryFolderList && inventoryFolderList.length > 0 ? (
            <ul className="space-y-2">
              {inventoryFolderList.map((folder) => (
                <li
                  key={folder.id}
                  onClick={() => handleFolderSelect(folder.id)}
                  className={`
                    p-4 rounded-lg cursor-pointer flex items-center gap-3
                    ${selectedFolderId === folder.id ? 'bg-blue-2 text-blue' : 'bg-gray-scale-200 hover:bg-gray-scale-300'}
                    ${folder.id === item.folderId ? 'border border-blue relative' : ''}
                  `}
                >
                  <Folder size={20} />
                  <div>
                    <p className="font-medium">{folder.name}</p>
                    <p className="text-xs text-gray-500">
                      항목 {folder.itemCount}개
                    </p>
                  </div>
                  {folder.id === item.folderId && (
                    <span className="absolute top-2 right-2 text-xs text-blue font-medium bg-blue-2 px-2 py-1 rounded-full">
                      현재 폴더
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-500">
              이동 가능한 폴더가 없습니다.
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="w-full flex items-center justify-end gap-2">
            <Button
              onClick={() => {
                onOpenChange(false);
                setSelectedFolderId(null);
              }}
              variant="outline"
            >
              취소
            </Button>
            <Button
              onClick={handleMove}
              disabled={
                isPending ||
                !selectedFolderId ||
                selectedFolderId === item.folderId
              }
              className="bg-blue text-white"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  이동 중...
                </div>
              ) : (
                '이동하기'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
