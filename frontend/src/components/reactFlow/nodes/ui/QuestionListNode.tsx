import AnswerInputNode from '@/components/reactFlow/nodes/ui/AnswerInputNode';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

type QuestionListNodeProps = {
  questions: string[];
};

export default function QuestionListNode({ questions }: QuestionListNodeProps) {
  const [displayedQuestions, setDisplayedQuestions] = useState<
    Array<{
      id: number;
      text: string;
      animating: boolean;
    }>
  >([]);
  const [questionQueue, setQuestionQueue] = useState<string[]>([]);
  const [isDirectInputMode, setIsDirectInputMode] = useState(false);

  useEffect(() => {
    if (questions.length > 0) {
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
    setIsDirectInputMode(true);
  };

  const handleSubmitDirectAnswer = async () => {
    setIsDirectInputMode(false);
  };

  return (
    <>
      {isDirectInputMode ? (
        <AnswerInputNode
          title="질문을 직접 입력해주세요"
          initialAnswer=""
          onSubmit={handleSubmitDirectAnswer}
        />
      ) : (
        <div className="px-8 py-[30px] border border-border-gray rounded-lg">
          <h3 className="text-[20px] font-semibold mb-5">
            다음 질문을 선택해주세요
          </h3>
          <ul className="flex flex-col gap-[10px]">
            {displayedQuestions.map((question) => (
              <li
                key={question.id}
                className={`p-4 border border-border-gray rounded-lg flex justify-between items-center transition-all duration-300 hover:bg-question-input-hover active:bg-question-input-active ${
                  question.animating
                    ? 'opacity-0 transform -translate-x-2'
                    : 'opacity-100'
                }`}
              >
                <span>{question.text}</span>
                <button
                  onClick={() => handleRemoveQuestion(question.id)}
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
        </div>
      )}
    </>
  );
}
