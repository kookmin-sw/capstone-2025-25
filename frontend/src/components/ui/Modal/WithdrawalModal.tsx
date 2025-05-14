import { Modal } from '@/components/common/Modal';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import {Loader2, Settings} from 'lucide-react';
import { useWithdrawAuth } from '@/hooks/useWithdrawAuth.ts';
import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog.tsx';

type WithdrawalModalProps = {
  trigger?: ReactNode;
};

export default function WithdrawalModal({ trigger }: WithdrawalModalProps) {
  const { withdraw } = useWithdrawAuth();

  const defaultTrigger = (
    <div className="flex items-center w-full gap-3 text-left transition-all duration-200 rounded-md cursor-pointer relative p-2 hover:bg-gray-50 text-[#CDCED6]">
      <Settings size={24} className="text-gray-400 group-hover:text-blue-500" />
      <span className="whitespace-nowrap">회원탈퇴</span>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger> {trigger || defaultTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>회원 탈퇴</DialogTitle>
          <DialogDescription className="whitespace-pre-line">
            정말 회원 탈퇴를 진행하시겠습니까? <br />이 작업은 되돌릴 수
            없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex items-center justify-end gap-2">
            <Button variant="blue" onClick={withdraw}>
              탈퇴하기
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
