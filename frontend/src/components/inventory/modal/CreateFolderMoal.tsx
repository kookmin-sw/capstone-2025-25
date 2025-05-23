import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import useCreateInventoryFolder from '@/hooks/queries/inventory/folder/useCreateInventoryFolder';
import { showToast } from '@/components/common/Toast.tsx';

type CreateFolderModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateFolderModal({
  isOpen,
  onOpenChange,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const { createInventoryFolderMutation, isPending } =
    useCreateInventoryFolder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = folderName.trim();
    if (!trimmedName || isPending) {
      return;
    }

    if (trimmedName.length > 10) {
      showToast('error', '폴더 이름은 최대 10글자까지 가능합니다.');
      return;
    }

    // 길이 조건 통과 시 API 호출
    createInventoryFolderMutation(
      { name: trimmedName },
      {
        onSuccess: () => {
          handleOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setFolderName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>폴더 추가</DialogTitle>
          <DialogDescription>새 폴더의 이름을 입력해주세요.</DialogDescription>
        </DialogHeader>
        <div>
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="폴더 이름"
            className="w-full h-auto border  focus:border-blue"
            style={{ fontSize: '16px', padding: '10px 15px' }}
            autoFocus
            disabled={isPending}
          />
        </div>
        <DialogFooter>
          <div className="w-full flex items-center justify-end gap-2">
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              variant="outline"
            >
              취소
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
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
  );
}
