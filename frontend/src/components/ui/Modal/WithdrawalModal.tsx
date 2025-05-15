// WithdrawalModal.tsx
import { ReactNode } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { useWithdrawAuth } from '@/hooks/useWithdrawAuth';

type WithdrawalModalProps = {
  trigger: ReactNode;
};

export const WithdrawalModal = ({ trigger }: WithdrawalModalProps) => {
  const { withdraw } = useWithdrawAuth();

  return (
    <Modal
      trigger={trigger}
      title="회원탈퇴"
      children={
        <div className="rounded-[16px] px-6 py-[20px] text-[20px] bg-blue-2 flex gap-2 items-start text-gray-scale-700">
          정말 회원 탈퇴를 진행하시겠습니까? <br />이 작업은 되돌릴 수 없습니다.
        </div>
      }
      footer={
        <div className="flex justify-end">
          <Button variant="blue" onClick={withdraw}>
            탈퇴하기
          </Button>
        </div>
      }
    />
  );
};
