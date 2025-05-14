import MindmapWrapper from '@/components/mindmap/MindmapWrapper';
import useBrainStormingAnalyze from '@/hooks/queries/gpt/useBrainStormingAnalyze';
import { BrainStormingAnalyzeReq } from '@/types/api/gpt';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useBlocker } from 'react-router';
import { useMindmapStore } from '@/store/mindMapStore';
import { MindmapSkeleton } from '@/components/mindmap/MindmapSkeleton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';

type Blocker = {
  state: 'unblocked' | 'blocked' | 'proceeding';
  proceed: () => void;
  reset: () => void;
};

interface EnhancedBeforeUnloadEvent extends BeforeUnloadEvent {
  returnValue: string;
}

export default function MindmapPage() {
  const [searchParams] = useSearchParams();
  const bubbleText = searchParams.get('text') || '';
  const [isInitialized, setIsInitialized] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCompletedSuccessfully, setIsCompletedSuccessfully] = useState(false);

  const initializeWithQuestions = useMindmapStore(
    (state) => state.initializeWithQuestions,
  );

  const { analzeBrainStormingMutation, isPending } = useBrainStormingAnalyze();

  const shouldBlock = useCallback(() => {
    return isInitialized && !isCompletedSuccessfully;
  }, [isInitialized, isCompletedSuccessfully]);

  const blocker = useBlocker(shouldBlock) as Blocker | undefined;

  useEffect(() => {
    if (blocker?.state === 'blocked') {
      console.log('Navigation blocked, showing dialog');
      setShowExitDialog(true);
    }
  }, [blocker]);

  const handleProceed = useCallback(() => {
    console.log('Proceeding with navigation');
    setShowExitDialog(false);
    blocker?.proceed();
  }, [blocker]);

  const handleCancel = useCallback(() => {
    console.log('Canceling navigation');
    setShowExitDialog(false);
    blocker?.reset();
  }, [blocker]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isInitialized && !isCompletedSuccessfully) {
        e.preventDefault();

        const message = '현재 페이지를 벗어나면 마인드맵은 저장되지 않습니다.';

        (e as EnhancedBeforeUnloadEvent).returnValue = message;

        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isInitialized, isCompletedSuccessfully]);

  useEffect(() => {
    if (bubbleText) {
      const requestData: BrainStormingAnalyzeReq = {
        chunk: bubbleText,
      };

      analzeBrainStormingMutation(requestData, {
        onSuccess: (data) => {
          const questions = data.clarifying_questions || [];
          initializeWithQuestions(bubbleText, questions);
          setIsInitialized(true);
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
    <div className="w-full h-full">
      <div
        className="absolute left-0 top-0 w-screen h-screen
      bg-blue-2"
      ></div>

      <MindmapWrapper
        onCompletedSuccessfully={() => setIsCompletedSuccessfully(true)}
      />

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>마인드맵 작성을 취소하시겠습니까?</DialogTitle>
          </DialogHeader>
          <div>
            <div className="rounded-[16px] px-6 py-[20px] text-[20px] font-semibold bg-blue-2 text-gray-scale-700">
              마인드맵 내용은 저장되지 않으며, 다시 확인할 수 없습니다.
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex items-center justify-end gap-3">
              <Button variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button onClick={handleProceed} variant="blue">
                확인
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
