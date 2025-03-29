import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';
import { Skeleton } from '@/components/ui/skeleton';
import { findParentNode } from '@/lib/mindMap';
import { useEdges, useNodes, useSetNode } from '@/store/mindMapStore';
import { QuestionNodeType } from '@/types/mindMap';
import { NodeProps } from '@xyflow/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function QuestionListNode({
  id,
  data,
}: NodeProps<QuestionNodeType>) {
  const nodes = useNodes();
  const edges = useEdges();
  const setNode = useSetNode();

  const parentNode = findParentNode(nodes, edges, id);
  const questions = parentNode?.data.recommendedQuestions;
  const isPending = data.isPending;

  const [displayedQuestions, setDisplayedQuestions] = useState<
    Array<{
      id: number;
      text: string;
      animating: boolean;
    }>
  >([]);
  const [questionQueue, setQuestionQueue] = useState<string[]>([]);

  const handleQuestionClick = (selectedQuestion: string) => {
    const currentNode = nodes.find((node) => node.id === id);

    if (currentNode) {
      setNode(id, {
        ...currentNode,
        type: 'answer',
        data: {
          ...currentNode.data,
          label: selectedQuestion,
        },
      });
    }
  };

  useEffect(() => {
    if (questions && questions.length > 0) {
      const initial = questions.slice(0, 3).map((text, index) => ({
        id: index,
        text,
        animating: false,
      }));
      setDisplayedQuestions(initial);
      setQuestionQueue(questions.slice(3));
    }
  }, [questions]);

  const handleRemoveQuestion = (id: number) => {
    console.log('handleRemove');
    setDisplayedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, animating: true } : q)),
    );

    setTimeout(() => {
      setDisplayedQuestions((prev) => {
        const updatedQuestions = [...prev];
        const questionIndex = updatedQuestions.findIndex((q) => q.id === id);

        if (questionIndex !== -1) {
          const nextQuestion = questionQueue[0];

          const newQueue = [
            ...questionQueue.slice(1),
            updatedQuestions[questionIndex].text,
          ];
          setQuestionQueue(newQueue);

          updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            text: nextQuestion,
            animating: false,
          };
        }

        return updatedQuestions;
      });
    }, 300);
  };

  const activateDirectInputMode = () => {
    const currentNode = nodes.find((node) => node.id === id);

    if (currentNode) {
      setNode(id, {
        ...currentNode,
        type: 'answer',
        data: {
          ...currentNode.data,
          label: '질문을 직접 입력해주세요',
        },
      });
    }
  };

  if (isPending) {
    return (
      <div className="bg-white px-8 py-[30px] border border-border-gray rounded-lg">
        <h3 className="text-[20px] font-semibold mb-5">질문 생성 중...</h3>
        <ul className="flex flex-col gap-[10px]">
          {[1, 2, 3].map((index) => (
            <li
              key={index}
              className="w-[576px] p-4 border border-border-gray rounded-lg flex justify-between items-center"
            >
              <Skeleton className="w-full h-6" />
            </li>
          ))}
          <li className="p-4 border border-border-gray rounded-lg flex justify-between items-center opacity-50">
            <span>직접 입력하기</span>
          </li>
        </ul>

        <NodeHandles />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white px-8 py-[30px] border border-border-gray rounded-lg">
        <h3 className="text-[20px] font-semibold mb-5">
          다음 질문을 선택해주세요
        </h3>
        <ul className="flex flex-col gap-[10px]">
          {displayedQuestions.map((question) => (
            <li
              key={question.id}
              className={`w-[576px] p-4 border border-border-gray rounded-lg flex justify-between items-center transition-all duration-300 hover:bg-question-input-hover active:bg-question-input-active ${
                question.animating
                  ? 'opacity-0 transform -translate-x-2'
                  : 'opacity-100'
              }`}
              onClick={() => handleQuestionClick(question.text)}
            >
              <span>{question.text}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveQuestion(question.id);
                }}
                className="cursor-pointer"
                disabled={question.animating}
              >
                <X size={24} color="#B9B9B7" />
              </button>
            </li>
          ))}
          <li
            onClick={activateDirectInputMode}
            className="p-4 border border-border-gray rounded-lg flex justify-between items-center"
          >
            <span>직접 입력하기</span>
          </li>
        </ul>

        <NodeHandles />
      </div>
    </>
  );
}
