import { Modal } from '@/components/common/Modal';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { useWithdrawAuth } from '@/hooks/useWithdrawAuth';

interface WithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WithdrawalModal({
  open,
  onOpenChange,
}: WithdrawalModalProps) {
  const { withdraw } = useWithdrawAuth();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="회원 탈퇴"
      children={
        <div className="text-sm text-gray-700">
          정말 회원 탈퇴를 진행하시겠습니까? <br />이 작업은 되돌릴 수 없습니다.
        </div>
      }
      footer={
        <DialogClose asChild>
          <Button variant="blue" onClick={withdraw}>
            탈퇴하기
          </Button>
        </DialogClose>
      }
    />
  );
}
