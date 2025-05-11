import { useNavigate } from 'react-router';
import FolderIcon from '@/assets/folder.png';
import { ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import useGetInventoryFolderList from '@/hooks/queries/inventory/useGetInventoryFolderList';
import useCreateInventoryFolder from '@/hooks/queries/inventory/useCreateInventoryFolder';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function StorePage() {
  const navigate = useNavigate();
  const { inventoryFolderList } = useGetInventoryFolderList();
  const { createInventoryFolderMutation, isPending } =
    useCreateInventoryFolder();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setFolderName('');
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
            setIsDialogOpen(false);
            setFolderName('');
          },
        },
      );
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
          onClick={() => handleDialogChange(true)}
        >
          <Plus size={18} />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
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
              placeholder="보관함 이름"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <div className="w-full flex items-center justify-end gap-2">
              <Button
                onClick={() => handleDialogChange(false)}
                variant="outline"
              >
                취소
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={isPending || !folderName.trim()}
                className="bg-blue text-white"
              >
                {isPending ? (
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
              <ChevronRight className="text-[#A9ABB8]" />
            </li>
          ))}
      </ul>
    </div>
  );
}
