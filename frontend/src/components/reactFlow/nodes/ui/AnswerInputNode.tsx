import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnswerInputProps {
  title: string;
  initialAnswer?: string;
  onSubmit: (answer: string) => void;
  onCancel?: () => void;
}

export default function AnswerInputNode({
  title,
  initialAnswer = '',
  onSubmit,
}: AnswerInputProps) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [isInputFilled, setIsInputFilled] = useState(
    initialAnswer.trim() !== '',
  );
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    setIsInputFilled(answer.trim() !== '');
  }, [answer]);

  const handleInputChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async () => {
    if (isInputFilled) {
      setIsSubmitLoading(true);
      try {
        await onSubmit(answer);
      } finally {
        setIsSubmitLoading(false);
      }
    }
  };

  return (
    <div className="px-8 py-[30px] border-4 border-[#b3cbfa] rounded-lg">
      <p className="text-[20px] font-semibold mb-[26px]">{title}</p>

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
    </div>
  );
}
