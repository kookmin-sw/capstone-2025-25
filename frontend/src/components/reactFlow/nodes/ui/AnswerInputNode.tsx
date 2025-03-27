import { Modal } from '@/components/common/Modal';
import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import useSummarizeNode from '@/hooks/queries/mindmap/useSummarizeNode';
import { useNodes, useSetNode, useUpdateNode } from '@/store/mindMapStore';
import { SummarizedNodeReq } from '@/types/api/mindmap';
import { AnswerNodeType } from '@/types/mindMap';
import { DialogClose } from '@radix-ui/react-dialog';
import { NodeProps } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, ChangeEvent } from 'react';

export default function AnswerInputNode({
  id,
  data,
}: NodeProps<AnswerNodeType>) {
  const initialAnswer = data.answer || '';
  const isEditing = data.isEditing || false;

  const [answer, setAnswer] = useState(initialAnswer);
  const [isInputFilled, setIsInputFilled] = useState(
    initialAnswer.trim() !== '',
  );

  const setNode = useSetNode();
  const nodes = useNodes();
  const updateNode = useUpdateNode();

  const { summarizeNodeMutation, isPending } = useSummarizeNode();

  useEffect(() => {
    setIsInputFilled(answer.trim() !== '');
  }, [answer]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async () => {
    if (isInputFilled) {
      const currentNode = nodes.find((node) => node.id === id);
      if (currentNode) {
        const requestData: SummarizedNodeReq = {
          question: data.label,
          answer,
        };
        summarizeNodeMutation(requestData, {
          onSuccess: (data) => {
            setNode(id, {
              ...currentNode,
              type: 'summary',
              data: {
                ...currentNode.data,
                summary: data.summary,
              },
            });
          },
          onError: (error) => {
            console.error('요약 생성 중 오류가 발생했습니다:', error);
          },
        });
      }
    }
  };

  const handleEdit = () => {
    if (isInputFilled) {
      const currentNode = nodes.find((node) => node.id === id);
      if (currentNode) {
        const requestData: SummarizedNodeReq = {
          question: data.label,
          answer,
        };
        summarizeNodeMutation(requestData, {
          onSuccess: (data) => {
            updateNode(id, answer, data.summary);
          },
          onError: (error) => {
            console.error('요약 생성 중 오류가 발생했습니다:', error);
          },
        });
      }
    }
  };

  return (
    <div className="w-[538px] bg-white px-8 py-[30px] border-4 border-[#b3cbfa] rounded-lg">
      <p className="text-[20px] font-semibold mb-[26px]">{data.label}</p>

      <div className="mb-6">
        <Input
          placeholder="답변을 적어주세요"
          className="h-[48px]"
          value={answer}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end space-x-3">
        {isEditing ? (
          <Modal
            trigger={
              <Button
                variant={isInputFilled ? 'black' : 'disabled'}
                className="w-[180px] h-12"
                disabled={!isInputFilled || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    수정 중...
                  </>
                ) : (
                  '수정하기'
                )}
              </Button>
            }
            title="이 답변을 수정할까요?"
            description="답변 수정 시, 해당 노드와 모든 하위노드가 함께 삭제돼요"
            footer={
              <div className="w-full flex items-center justify-between">
                <DialogClose asChild>
                  <Button className="px-8" variant="white">
                    취소하기
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button className="px-8" onClick={handleEdit}>
                    수정하기
                  </Button>
                </DialogClose>
              </div>
            }
          >
            <div className="rounded-xl px-6 py-4  border-2 border-border-gray">
              <p className="font-bold mb-4">{data.label}</p>
              <p>{answer}</p>
            </div>
          </Modal>
        ) : (
          <Button
            variant={isInputFilled ? 'black' : 'disabled'}
            onClick={handleSubmit}
            className="w-[180px] h-12"
            disabled={!isInputFilled || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                생성 중...
              </>
            ) : (
              '입력하기'
            )}
          </Button>
        )}
      </div>

      <NodeHandles />
    </div>
  );
}
