import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import useSummarizeNode from '@/hooks/queries/mindmap/useSummarizeNode';
import useStore from '@/store/mindMapStore';
import { SummarizedNodeReq } from '@/types/api/mindmap';
import { AnswerNodeType } from '@/types/mindMap';
import { NodeProps } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, ChangeEvent } from 'react';

export default function AnswerInputNode({
  id,
  data,
}: NodeProps<AnswerNodeType>) {
  const initialAnswer = data.answer || '';

  const [answer, setAnswer] = useState(initialAnswer);
  const [isInputFilled, setIsInputFilled] = useState(
    initialAnswer.trim() !== '',
  );

  const setNode = useStore((state) => state.setNode);
  const nodes = useStore((state) => state.nodes);

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
      </div>

      <NodeHandles />
    </div>
  );
}
