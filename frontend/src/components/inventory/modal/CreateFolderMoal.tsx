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

type CreateFolderModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
  isPending: boolean;
};

export default function CreateFolderModal({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      onSubmit(folderName);
      setFolderName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && folderName.trim() && !isPending) {
      e.preventDefault();
      handleCreateFolder();
    }
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
            <Button onClick={() => handleOpenChange(false)} variant="outline">
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
  );
}
