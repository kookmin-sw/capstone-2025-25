import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';

type NodeToTaskModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  text: string;
  applyMergedBubble: (open: boolean) => void;
};

export function MergeBubbleDialog({
  isOpen,
  onOpenChange,
  text,
  applyMergedBubble,
}: NodeToTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>정리된 버블 요약</DialogTitle>
        </DialogHeader>
        <div>
          <div className="rounded-[16px] px-6 py-[20px] text-[20px] font-semibold bg-blue-2 text-gray-scale-700">
            {text}
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex items-center justify-end gap-3">
            <Button variant="blue" onClick={applyMergedBubble}>
              적용하기
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
