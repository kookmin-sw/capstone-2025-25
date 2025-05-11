import { useNavigate } from 'react-router';
import FolderIcon from '@/assets/folder.png';
import { ChevronRight, Plus, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import useGetInventoryFolderList from '@/hooks/queries/inventory/useGetInventoryFolderList';
import useCreateInventoryFolder from '@/hooks/queries/inventory/useCreateInventoryFolder';
import useDeleteInventoryFolder from '@/hooks/queries/inventory/useDeleteInventoryFolder';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

export default function StorePage() {
  const navigate = useNavigate();
  const { inventoryFolderList } = useGetInventoryFolderList();
  const { createInventoryFolderMutation, isPending: isCreating } =
    useCreateInventoryFolder();
  const { deleteInventoryFolderMutation, isPending: isDeleting } =
    useDeleteInventoryFolder();

  // 생성 모달 상태
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  // 삭제 모달 상태
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleCreateDialogChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setFolderName('');
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setFolderToDelete(null);
    }
  };

  const handleRouteToStoreDetail = (id: number) => {
    navigate(`/store/${id}`);
  };

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      createInventoryFolderMutation(
        { name: folderName },
        {
          onSuccess: () => {
            setIsCreateDialogOpen(false);
            setFolderName('');
          },
        },
      );
    }
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    store: { id: number; name: string },
  ) => {
    e.stopPropagation();

    setFolderToDelete(store);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteFolder = () => {
    if (folderToDelete) {
      deleteInventoryFolderMutation(folderToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setFolderToDelete(null);
        },
      });
    }
  };

  // 엔터 키로 폼 제출 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && folderName.trim() && !isCreating) {
      e.preventDefault();
      handleCreateFolder();
    }
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-4 mb-8">
          <h1 className="text-[28px] text-[#525463] font-semibold">
            나의 보관함
          </h1>
          <p className="text-[#525463]">나의 생각을 보관해보세요</p>
        </div>
        <div
          className="bg-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
          onClick={() => handleCreateDialogChange(true)}
        >
          <Plus size={18} />
        </div>
      </div>

      {/* 보관함 생성 모달 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>보관함 추가</DialogTitle>
            <DialogDescription>
              새 보관함의 이름을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="보관함 이름"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <div className="w-full flex items-center justify-end gap-2">
              <Button
                onClick={() => handleCreateDialogChange(false)}
                variant="outline"
              >
                취소
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={isCreating || !folderName.trim()}
                className="bg-blue text-white"
              >
                {isCreating ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    생성 중...
                  </div>
                ) : (
                  '생성하기'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 보관함 삭제 모달 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>보관함 삭제</DialogTitle>
            <DialogDescription>
              정말 이 보관함을 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-[7px] px-6 py-[20px] text-[16px] font-medium bg-red-50 text-red-600">
              <p>
                "{folderToDelete?.name}" 보관함과 그 안의 모든 내용이
                삭제됩니다.
              </p>
              <p className="mt-2">이 작업은 되돌릴 수 없습니다.</p>
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex items-center justify-end gap-2">
              <Button
                onClick={() => handleDeleteDialogChange(false)}
                variant="white"
              >
                취소
              </Button>
              <Button
                onClick={handleDeleteFolder}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    삭제 중...
                  </div>
                ) : (
                  '삭제하기'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ul className="bg-gray-scale-200 rounded-lg flex flex-col gap-4">
        {inventoryFolderList &&
          inventoryFolderList.map((store) => (
            <li
              key={store.id}
              className="flex items-center justify-between px-8 py-4 bg-white rounded-xl cursor-pointer"
              onClick={() => handleRouteToStoreDetail(store.id)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={FolderIcon}
                  className="w-[37.5px] h-[30px]"
                  alt="폴더"
                />
                <p className="text-[20px] text-[#15161A] font-semibold">
                  {store.name}
                </p>
                <p className="text-[#A9ABB8] font-semibold">
                  {store.itemCount}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={(e) =>
                    handleDeleteClick(e, { id: store.id, name: store.name })
                  }
                >
                  <Trash2
                    className="text-[#A9ABB8] hover:text-red-500"
                    size={18}
                  />
                </div>
                <ChevronRight className="text-[#A9ABB8]" />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
