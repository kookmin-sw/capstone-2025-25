import { Modal } from '@/components/common/Modal';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

import { useWithdrawAuth } from '@/hooks/useWithdrawAuth.ts';

export default function WithdrawalModal() {
  const { withdraw } = useWithdrawAuth();

  return (
    <Modal
      trigger={
        <div className="flex items-center w-full gap-3 text-left transition-all duration-200 rounded-md cursor-pointer relative p-2 hover:bg-gray-50 text-[#CDCED6]">
          <Settings
            size={24}
            className="text-gray-400 group-hover:text-blue-500"
          />
          <span className="whitespace-nowrap">회원탈퇴</span>
        </div>
      }
      children={
        <div className="text-sm text-gray-700">
          정말 회원 탈퇴를 진행하시겠습니까? <br />이 작업은 되돌릴 수 없습니다.
        </div>
      }
      footer={
        <DialogClose asChild>
          <Button variant="destructive" onClick={withdraw}>
            탈퇴하기
          </Button>
        </DialogClose>
      }
    />
  );
}
