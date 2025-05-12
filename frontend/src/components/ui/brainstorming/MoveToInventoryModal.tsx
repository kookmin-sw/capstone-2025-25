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
import { toast } from 'sonner';
import useCreateInventoryItem from '@/hooks/queries/inventory/item/useCreateInventoryItem';

type MoveToInventoryModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: number;
    title: string;
  };
  onSuccess?: () => void;
};

export default function MoveToInventoryModal({
  isOpen,
  onOpenChange,
  item,
  onSuccess,
}: MoveToInventoryModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const { inventoryFolderList, isLoading } = useGetInventoryFolderList();

  const { createInventoryItemMutation, isPending } = useCreateInventoryItem();

  const handleFolderSelect = (folderId: number) => {
    setSelectedFolderId(folderId);
  };

  const handleMove = () => {
    if (!selectedFolderId) return;

    createInventoryItemMutation(
      {
        folderId: selectedFolderId,
        title: item.title,
        memo: '',
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedFolderId(null);
          toast.success(`"${item.title}" 항목이 성공적으로 이동되었습니다.`);
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>버블 보관하기</DialogTitle>
          <DialogDescription>
            "{item.title}" 버블을 저장할 보관함 폴더를 선택해주세요.
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
                  `}
                >
                  <Folder size={20} />
                  <div>
                    <p className="font-medium">{folder.name}</p>
                    <p className="text-xs text-gray-500">
                      항목 {folder.itemCount}개
                    </p>
                  </div>
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
              disabled={isPending || !selectedFolderId}
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
