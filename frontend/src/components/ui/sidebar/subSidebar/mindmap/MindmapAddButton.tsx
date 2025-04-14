import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { useCreateMindMap } from '@/store/mindmapListStore';
import { TodoType } from '@/types/mindMap';
import { DialogClose } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router';

export default function MindmapAddButton() {
  const [selectedType, setSelectedType] = useState<TodoType>('TODO');
  const [subject, setSubject] = useState('');
  const createMindmap = useCreateMindMap();
  const navigate = useNavigate();

  const handleCreateClick = () => {
    const newMindmapId = createMindmap(subject, selectedType);
    navigate(`/mindmap/${newMindmapId}`);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  return (
    <Modal
      trigger={<Plus size={22} className="cursor-pointer" />}
      title="마인드맵 생성하기"
      description={`해야 할 일이나 생각이 떠올랐다면 여기 적어보세요! 
        질문을 통해 더 깊이 고민할 수 있도록 도와줄게요`}
      footer={
        <DialogClose asChild>
          <Button size="sm" onClick={handleCreateClick} variant={selectedType && subject ? 'black': 'disabled'}  >
            생성하기
          </Button>
        </DialogClose>
      }
    >
      <div
        className="flex flex-col gap-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <label className="text-[14px] block mb-2">마인드맵 주제</label>
          <Input
            placeholder="주제를 입력하세요"
            value={subject}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()}
            className="h-12"
          />
        </div>

        <div>
          <label className="text-[14px] block mb-2">마인드맵 타입</label>
          <div
            className="w-full flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="white"
              size="sm"
              className={cn(
                'flex-1 border-1',
                selectedType === 'TODO'
                  ? 'border-[#8D5CF6] text-[#8D5CF6]'
                  : 'border-gray-200',
              )}
              onClick={() => setSelectedType('TODO')}
            >
              Todo
            </Button>

            <Button
              variant="white"
              size="sm"
              className={cn(
                'flex-1 border-1',
                selectedType === 'THINKING'
                  ? 'border-[#8D5CF6] text-[#8D5CF6]'
                  : 'border-gray-200',
              )}
              onClick={() => setSelectedType('THINKING')}
            >
              Thinking
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
