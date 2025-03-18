import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import useStore from '@/store/mindmapStore';
import { MindMapNodeData } from '@/types/mindMap';
import { NodeProps } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AnswerInputNode({
  id,
  data,
}: NodeProps<MindMapNodeData>) {
  const initialAnswer = data.answer || '';

  const [answer, setAnswer] = useState(initialAnswer);
  const [isInputFilled, setIsInputFilled] = useState(
    initialAnswer.trim() !== '',
  );
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const setNode = useStore((state) => state.setNode);
  const nodes = useStore((state) => state.nodes);

  useEffect(() => {
    setIsInputFilled(answer.trim() !== '');
  }, [answer]);

  const handleInputChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async () => {
    if (isInputFilled) {
      setIsSubmitLoading(false);

      const currentNode = nodes.find((node) => node.id === id);

      /* 
      TODO: 추후에 GPT 한줄 요약으로 수정해야함. 지금은 로직의 흐름을 위해 답변을 summary로 처리
      */
      if (currentNode) {
        setNode(id, {
          ...currentNode,
          type: 'summary',
          data: {
            ...currentNode.data,
            summary: answer,
          },
        });
      }

      /* TODO: 추후에 API 연동시 처리하기! */
      // setIsSubmitLoading(true);

      // try {
      //   await onSubmit(answer);
      // } finally {
      //   setIsSubmitLoading(false);
      // }
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
          disabled={!isInputFilled || isSubmitLoading}
        >
          {isSubmitLoading ? (
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
