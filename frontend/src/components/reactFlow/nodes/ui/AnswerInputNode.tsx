import { Modal } from '@/components/common/Modal';
import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import useSummarizeNode from '@/hooks/queries/mindmap/useSummarizeNode';
import { findParentNode } from '@/lib/mindMap';
import { cn } from '@/lib/utils';
import {
  useDeleteNode,
  useEdges,
  useNodes,
  useSetNode,
  useUpdateNode,
  useUpdateNodeQuestions,
} from '@/store/mindMapStore_deprecated';
import { SummarizedNodeReq } from '@/types/api/mindmap';
import { AnswerNodeType } from '@/types/mindMap';
import { DialogClose } from '@radix-ui/react-dialog';
import { NodeProps } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';

export default function AnswerInputNode({
  id,
  data,
}: NodeProps<AnswerNodeType>) {
  const initialAnswer = data.answer || '';
  const isEditing = data.isEditing || false;
  const isDirectQuestion = data.question === '직접 입력하기';

  const [answer, setAnswer] = useState(initialAnswer);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isInputFilled, setIsInputFilled] = useState(
    initialAnswer.trim() !== '',
  );
  const [isQuestionFilled, setIsQuestionFilled] = useState(false);

  const setNode = useSetNode();
  const nodes = useNodes();
  const edges = useEdges();
  const updateNode = useUpdateNode();
  const deleteNode = useDeleteNode();

  const { summarizeNodeMutation, isPending } = useSummarizeNode();
  const updateNodeQuestions = useUpdateNodeQuestions();

  useEffect(() => {
    setIsInputFilled(answer.trim() !== '');
  }, [answer]);

  useEffect(() => {
    setIsQuestionFilled(customQuestion.trim() !== '');
  }, [customQuestion]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomQuestion(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isButtonDisabled) {
      if (isEditing) {
        handleEdit();
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (isInputFilled && (!isDirectQuestion || isQuestionFilled)) {
      const currentNode = nodes.find((node) => node.id === id);
      if (currentNode) {
        // 직접 입력 모드일 때는 사용자가 입력한 질문을, 아닐 때는 원래 레이블을 사용
        const questionText = isDirectQuestion ? customQuestion : data.question;

        const requestData: SummarizedNodeReq = {
          question: questionText || '',
          answer,
        };

        summarizeNodeMutation(requestData, {
          onSuccess: (data) => {
            setNode(id, {
              ...currentNode,
              type: 'SUMMARY',
              data: {
                ...currentNode.data,
                question: questionText,
                answer,
                summary: data.summary,
              },
            });

            const parentNode = findParentNode(nodes, edges, id);

            if (parentNode) {
              const filteredQuestions = parentNode.data.recommendedQuestions
                ? parentNode.data.recommendedQuestions.filter(
                    (q) => q !== currentNode.data.question,
                  )
                : [];

              updateNodeQuestions(parentNode.id, filteredQuestions);
            }
          },
          onError: (error) => {
            console.error('요약 생성 중 오류가 발생했습니다:', error);
          },
        });
      }
    }
  };

  const handleEdit = () => {
    if (isInputFilled && (!isDirectQuestion || isQuestionFilled)) {
      const currentNode = nodes.find((node) => node.id === id);
      if (currentNode) {
        // 직접 입력 모드일 때는 사용자가 입력한 질문을, 아닐 때는 원래 레이블을 사용
        const questionText = isDirectQuestion ? customQuestion : data.question;

        const requestData: SummarizedNodeReq = {
          question: questionText || '',
          answer,
        };

        summarizeNodeMutation(requestData, {
          onSuccess: (data) => {
            if (isDirectQuestion) {
              setNode(id, {
                ...currentNode,
                data: {
                  ...currentNode.data,
                  question: questionText,
                  answer,
                  summary: data.summary,
                },
              });
            } else {
              updateNode(id, answer, data.summary);
            }
          },
          onError: (error) => {
            console.error('요약 생성 중 오류가 발생했습니다:', error);
          },
        });
      }
    }
  };

  // 버튼 활성화 조건: 직접 입력 모드면 질문과 답변 모두 있어야 함, 아니면 답변만 있으면 됨
  const isButtonDisabled =
    isPending || !isInputFilled || (isDirectQuestion && !isQuestionFilled);

  return (
    <div className="w-[538px] bg-white px-8 py-[30px] border-3 border-[#8D5CF6] rounded-lg">
      {isDirectQuestion ? (
        <div className="mb-[15px]">
          <Input
            placeholder="질문을 직접 입력해주세요..."
            className="!text-[20px] font-semibold h-[48px] border-none px-0 shadow-none focus:border-none focus:border-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={customQuestion}
            onChange={handleQuestionChange}
          />
        </div>
      ) : (
        <p className="text-[20px] font-semibold mb-[15px]">{data.question}</p>
      )}

      <div className="mb-[20px]">
        <Input
          placeholder="답변을 적어주세요"
          className="h-[48px]"
          value={answer}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>

      <div
        className={cn(
          'flex space-x-3',
          isEditing ? 'justify-between' : 'justify-end',
        )}
      >
        {' '}
        {isEditing ? (
          <>
            <Modal
              trigger={
                <Button size="sm" variant="white" className="flex-1">
                  삭제하기
                </Button>
              }
              title="이 노드를 삭제할까요?"
              description="해당 노드와 모든 하위노드가 함께 삭제돼요"
              footer={
                <div className="w-full flex items-center justify-between gap-4">
                  <DialogClose asChild>
                    <Button size="sm" variant="white" className="flex-1">
                      취소하기
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        deleteNode(id);
                      }}
                    >
                      삭제하기
                    </Button>
                  </DialogClose>
                </div>
              }
            >
              <div className="rounded-[7px] px-6 py-4 font-semibold border-1 border-[#AAAAAA]">
                {data.summary}
              </div>
            </Modal>
            <Modal
              trigger={
                <Button
                  size="sm"
                  className="flex-1"
                  variant={isButtonDisabled ? 'disabled' : 'black'}
                  disabled={isButtonDisabled}
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
                <div className="w-full flex items-center justify-between gap-4">
                  <DialogClose asChild>
                    <Button size="sm" className="flex-1" variant="white">
                      취소하기
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button size="sm" className="flex-1" onClick={handleEdit}>
                      수정하기
                    </Button>
                  </DialogClose>
                </div>
              }
            >
              <div className="rounded-[7px] px-6 py-4 border-1 border-[#AAAAAA]">
                <p className="font-semibold text-[18px] mb-1">
                  {isDirectQuestion ? customQuestion : data.question}
                </p>
                <p className="font-normal text-[16px]">{answer}</p>
              </div>
            </Modal>
          </>
        ) : (
          <Button
            variant={isButtonDisabled ? 'disabled' : 'black'}
            onClick={handleSubmit}
            className="w-[180px] h-12"
            disabled={isButtonDisabled}
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
