import MindmapWrapper from '@/components/mindmap/MindmapWrapper';
import useBrainStormingAnalyze from '@/hooks/queries/gpt/useBrainStormingAnalyze';
import { BrainStormingAnalyzeReq } from '@/types/api/gpt';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useMindmapStore } from '@/store/mindMapStore';
import { MindmapSkeleton } from '@/components/mindmap/MindmapSkeleton';

export default function MindmapPage() {
  const [searchParams] = useSearchParams();
  const bubbleText = searchParams.get('text') || '';

  const initializeWithQuestions = useMindmapStore(
    (state) => state.initializeWithQuestions,
  );

  const { analzeBrainStormingMutation, isPending } = useBrainStormingAnalyze();

  useEffect(() => {
    if (bubbleText) {
      const requestData: BrainStormingAnalyzeReq = {
        chunk: bubbleText,
      };

      analzeBrainStormingMutation(requestData, {
        onSuccess: (data) => {
          const questions = data.clarifying_questions || [];

          initializeWithQuestions(bubbleText, questions);
        },
        onError: (err) => {
          console.error('API 오류:', err);
        },
      });
    }
  }, [bubbleText, analzeBrainStormingMutation, initializeWithQuestions]);

  if (isPending) {
    return <MindmapSkeleton />;
  }

  return (
    <div className="relative w-full h-[calc(100vh-88px)]">
      <MindmapWrapper />
    </div>
  );
}
