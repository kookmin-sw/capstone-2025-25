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

type DeleteFolderModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isPending: boolean;
  folderName: string | undefined;
};

export default function DeleteFolderModal({
  isOpen,
  onOpenChange,
  onDelete,
  isPending,
  folderName,
}: DeleteFolderModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>폴더 삭제</DialogTitle>
          <DialogDescription>
            정말 이 폴더를 삭제하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <div className="rounded-[16px] px-6 py-[20px] text-[16px] font-medium bg-blue-2 text-gray-scale-700">
            <p>"{folderName}" 폴더와 그 안의 모든 내용이 삭제됩니다.</p>
            <p>이 작업은 되돌릴 수 없습니다.</p>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex items-center justify-end gap-2">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              취소
            </Button>
            <Button
              onClick={onDelete}
              disabled={isPending}
              className="bg-blue text-white"
            >
              {isPending ? (
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
  );
}
