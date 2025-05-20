import { useState, useRef, useEffect } from 'react';
import Arrow from '@/assets/arrow_top.svg';
import { BubbleNodeType } from '@/types/brainstorming';
import { useResponsive } from '@/hooks/use-mobile.ts';
import clsx from 'clsx';
import Bubble from '@/components/ui/brainstorming/Bubble';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button.tsx';
import { ArrowRight,X } from 'lucide-react';
import useGetBubbles from '@/hooks/queries/brainstorming/useGetBubbles.ts';
import useDeleteBubble from '@/hooks/queries/brainstorming/useDeleteBubble.ts';
import useCreateBubble from '@/hooks/queries/brainstorming/useCreateBubble.ts';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import MoveToInventoryModal from '@/components/ui/brainstorming/MoveToInventoryModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog.tsx';
import { NodeToTaskModal } from '@/components/ui/Modal/NodeTaskModal.tsx';
import { showToast } from '@/components/common/Toast.tsx';
import bubble from '@/components/ui/brainstorming/Bubble';
import { MergeBubbleDialog } from '@/components/brainstorming/MergeBubbleDialog.tsx';
import useMergeBubble from '@/hooks/queries/gpt/useMergeBubble.ts';

export default function Brainstorming() {
  const isMobile = useResponsive();
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const { bubbleList } = useGetBubbles();
  const { deleteBrainstormingMutation } = useDeleteBubble();
  const { createBubbleMutation, isPending } = useCreateBubble();
  const [bubbles, setBubbles] = useState<BubbleNodeType[]>([]);
  const [inputText, setInputText] = useState('');
  const bubblesRef = useRef<BubbleNodeType[]>([]);
  const textareaRef = useRef(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const [isBubbleDialogOpen, setIsBubbleDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBubble, setSelectedBubble] = useState({
    bubbleId: null,
    title: '',
  });
  const [toBeSavedBubbleId, setToBeSavedBubbleId] = useState<number | null>(
    null,
  );
  const [mergeTargetBubbles, setMergeTargetBubbles] = useState<
    BubbleNodeType[]
  >([]);
  const [mergeMode, setMergeMode] = useState(false);
  const [isMoveToInventoryDialogOpen, setIsMoveToInventoryDialogOpen] =
    useState(false);

  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskData, setTaskData] = useState({ id: null, title: '' });
  const { mergeBubbleMutation, isPending: isMerging } = useMergeBubble();
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);
  const [mergedText, setMergedText] = useState('');

  useEffect(() => {
    if (bubbleList && Array.isArray(bubbleList) && bubbleList.length > 0) {
      placeBubbles(bubbleList);
    }
  }, [bubbleList]);

  useEffect(() => {
    bubblesRef.current = bubbles;
  }, [bubbles]);

  // 버블 배치
  const placeBubbles = (data) => {
    const defaultBubbles: BubbleNodeType[] = [];

    for (const item of data) {
      const radius = getRadiusForText(item.title);
      const position = getPosition(radius, defaultBubbles);
      defaultBubbles.push({
        bubbleId: item.bubbleId,
        title: item.title,
        radius: radius,
        x: (position.x / scrollRef.current.offsetWidth) * 100,
        y: (position.y / scrollRef.current.offsetHeight) * 100,
      });
    }

    setBubbles(defaultBubbles);
  };

  // textarea 높이
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputText, isMobile]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isPending && !isSubmitting) {
        addBubble();
      }
    }
  };

  // 화면 리사이즈 시 버블 위치 재계산
  useEffect(() => {
    const handleResize = () => {
      placeBubbles(bubblesRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRadiusForText = (title: string) => {
    const length = title.length;
    if (length <= 10) return 60;
    if (length <= 20) return 90;
    if (length <= 40) return 100;
    return 120;
  };

  const getPosition = (
    radius: number,
    currentBubbles: BubbleNodeType[] = [],
  ) => {
    const step = 15;
    const jitter = 10;
    const diameter = radius * 2;
    const candidates = [];

    const scroll = scrollRef.current;
    if (!scroll) return { x: 0, y: 0 };

    const scrollWidth = scroll.offsetWidth;
    const scrollHeight = scroll.offsetHeight;

    const centerX = scrollWidth / 2;

    // x좌표 후보
    const candidateX = [];
    for (let offset = 0; offset + diameter <= centerX; offset += step) {
      if (centerX + offset + diameter <= scrollWidth)
        candidateX.push(centerX + offset);
      if (centerX - offset - diameter >= 0)
        candidateX.push(centerX - offset - diameter);
    }
    if (candidates.length == 0) {
      candidateX.push(centerX - radius);
    }
    // 각 x 좌표에 대해 가능한 y 위치 계산
    for (const x of candidateX) {
      let y = 20;

      for (const bubble of currentBubbles) {
        const dx = x - (bubble.x * scrollWidth) / 100;
        const distanceX = Math.abs(dx);

        if (distanceX < radius + bubble.radius) {
          const bottomY =
            (bubble.y * scrollHeight) / 100 + bubble.radius * 2 + 5;
          if (bottomY > y) y = bottomY;
        }
      }
      const randomOffset = Math.floor(Math.random() * jitter) - jitter / 2;
      candidates.push({ x: x + randomOffset, y });
      // }
    }

    // 가장 위에 붙일 수 있는 후보 위치들 중 하나 선택
    if (candidates.length > 0) {
      const minY = Math.min(...candidates.map((c) => c.y));
      const filtered = candidates.filter((c) => c.y === minY);
      const chosen = filtered[Math.floor(Math.random() * filtered.length)];
      return chosen;
    } else {
      return { x: 0, y: 0 };
    }
  };

  // 버블 추가
  const addBubble = () => {
    if (!inputText.trim()) return;
    if (bubblesRef.current.length >= 20) {
      showToast('error', '버블이 너무 많습니다! 생각을 먼저 정리해보세요.');
      return;
    }
    const scroll = scrollRef.current;
    const scrollWidth = scroll.offsetWidth;
    let scrollHeight = scroll.offsetHeight;
    setIsSubmitting(true);

    createBubbleMutation(
      { text: inputText },
      {
        onSuccess: (data) => {
          const newBubbles: BubbleNodeType[] = [];

          for (const bubble of data.content) {
            const radius = getRadiusForText(bubble.title);

            // 기존 + 지금 추가 중인 버블 포함해서 자리 찾기
            const position = getPosition(radius, [...bubbles, ...newBubbles]);

            newBubbles.push({
              bubbleId: bubble.bubbleId,
              title: bubble.title,
              x: (position.x / scrollWidth) * 100,
              y: (position.y / scrollHeight) * 100,
              radius,
              isNew: true,
            });
          }

          scrollHeight = scroll.offsetHeight;

          setBubbles((prev) => [...prev, ...newBubbles]);
          setInputText('');
          setTimeout(() => {
            setBubbles((prev) =>
              prev.map((b) =>
                newBubbles.some(
                  (newBubble) => newBubble.bubbleId === b.bubbleId,
                )
                  ? { ...b, isNew: false }
                  : b,
              ),
            );
          }, 600); // scaleIn 애니메이션 시간
        },

        onError: (error) => {
          showToast('error', '의미 있는 텍스트가 없어 버블을 생성할 수 없어요')
          console.error('버블 생성 중 오류가 발생했습니다: ', error);
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  const deleteBubble = (id: number) => {
    setBubbles((prev) =>
      prev.map((bubble) =>
        bubble.bubbleId === id ? { ...bubble, isDeleting: true } : bubble,
      ),
    );

    setTimeout(() => {
      deleteBrainstormingMutation(id, {
        onSuccess: () => {
          const updated = bubbles.filter((bubble) => bubble.bubbleId !== id);
          bubblesRef.current = updated;
          setBubbles(updated);
          if (bubblesRef.current.length == 0) {
            setIsBubbleDialogOpen(true);
          }
        },
        onError: (error) => {
          console.error('버블 삭제 중 오류가 발생했습니다: ', error);
        },
      });
    }, 250);
  };

  const moveToMindmap = (id: number, title: string) => {
    const encodedBubbleText = encodeURIComponent(title);
    navigate(`/mindmap/${id}?text=${encodedBubbleText}`);
  };

  const createMatrix = (bubble: BubbleNodeType) => {
    setTaskData({
      bubbleId: bubble.bubbleId,
      title: bubble.title,
    });
    setIsDialogOpen(true);
    setOpenPopoverId(null);
  };

  const handleSaveBubble = (bubble) => {
    setSelectedBubble({
      bubbleId: bubble.bubbleId,
      title: bubble.title,
    });
    setOpenPopoverId(null);
    setToBeSavedBubbleId(bubble.bubbleId); // 보관할 버블 ID 저장
    setIsMoveToInventoryDialogOpen(true);
  };

  const handleMergeMode = (bubble: BubbleNodeType) => {
    setMergeMode(true);
    setMergeTargetBubbles([bubble]);
    setOpenPopoverId(null);
  };
  const handleMergeBubble = (bubble: BubbleNodeType) => {
    if (!isMerging) {
      const exist = mergeTargetBubbles?.some(
        (b) => b.bubbleId === bubble.bubbleId,
      );
      if (exist) {
        setMergeTargetBubbles((prev) => {
          const next = prev.filter((b) => b.bubbleId !== bubble.bubbleId);

          // if (next.length === 0) {
          //   setMergeMode(false);
          // }

          return next;
        });
      } else {
        setMergeTargetBubbles((prev) => [...prev, bubble]);
      }
    }
  };

  const mergeBubble = () => {
    const chunks = mergeTargetBubbles.map((bubble) => bubble.title);
    const payload = {
      chunks,
    };
    mergeBubbleMutation(payload, {
      onSuccess: (data) => {
        setIsMergeDialogOpen(true);
        setMergedText(data.merged_chunk);
      },
    });
  };

  const applyMergedBubble = () => {
    const [targetBubble, ...bubblesToDelete] = mergeTargetBubbles;

    setBubbles((prev) =>
      prev
        .filter((bubble) => {
          return !mergeTargetBubbles.some(
            (b) =>
              b.bubbleId === bubble.bubbleId &&
              b.bubbleId !== targetBubble.bubbleId,
          );
        })
        .map((bubble) => {
          if (bubble.bubbleId === targetBubble.bubbleId) {
            return { ...bubble, title: mergedText };
          }
          return bubble;
        }),
    );
    setIsMergeDialogOpen(false)
setMergeMode(false);
  };

  // 보관 성공 시 실행할 함수
  const handleSaveSuccess = () => {
    if (toBeSavedBubbleId) {
      // 애니메이션을 위해 isDeleting 상태 설정
      setBubbles((prev) =>
        prev.map((bubble) =>
          bubble.bubbleId === toBeSavedBubbleId
            ? { ...bubble, isDeleting: true }
            : bubble,
        ),
      );

      setTimeout(() => {
        setBubbles((prev) => {
          const updated = prev.filter(
            (bubble) => bubble.bubbleId !== toBeSavedBubbleId,
          );

          if (updated.length === 0) {
            setIsBubbleDialogOpen(true);
          }

          return updated;
        });

        setToBeSavedBubbleId(null);
      }, 250);
    }
  };

  const checkCleanBubble = () => {

    setBubbles((prev) =>
      prev.map((bubble) =>
        bubble.bubbleId === taskData.bubbleId
          ? { ...bubble, isDeleting: true }
          : bubble,
      ),
    );

    setTimeout(() => {
      setBubbles((prev) => {
        const updated = prev.filter(
          (bubble) => bubble.bubbleId !== taskData.bubbleId,
        );
        if (updated.length === 0) {
          setIsBubbleDialogOpen(true);
        }

        return updated;
      });

      setToBeSavedBubbleId(null);
    }, 250);
  };

  return (
    <div ref={containerRef} className={clsx('w-full h-full ')}>
      <div
        className="absolute left-0 top-0 w-screen h-screen
    bg-blue-2"
      ></div>
      <Dialog open={isBubbleDialogOpen} onOpenChange={setIsBubbleDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>버블 정리 완료!</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <div className="rounded-[16px] px-6 py-[20px] text-[20px] font-semibold bg-blue-2 flex gap-2 items-start text-gray-scale-700">
              <p>복잡했던 생각들이 말끔하게 정리됐어요 🎉</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="relative w-full h-full overflow-y-auto overflow-x-hidden pb-[50px]">
        <div
          ref={scrollRef}
          className="relative w-full h-full overflow-y-auto overflow-x-hidden "
        >
          {bubbles.map((bubble) => (
            <Popover
              key={bubble.bubbleId}
              open={openPopoverId === bubble.bubbleId}
              onOpenChange={(open) => {
                if (mergeMode) {
                  handleMergeBubble(bubble);
                } else {
                  setOpenPopoverId(open ? bubble.bubbleId : null);
                }
              }}
            >
              <PopoverTrigger asChild>
                <Bubble
                  isSelected={
                    mergeTargetBubbles?.some(
                      (b) => b.bubbleId === bubble.bubbleId,
                    ) && mergeMode
                  }
                  x={bubble.x}
                  y={bubble.y}
                  radius={bubble.radius}
                  title={bubble.title}
                  containerWidth={scrollRef.current?.offsetWidth || 0}
                  containerHeight={scrollRef.current?.offsetHeight || 0}
                  onClick={() => {}} // 클릭 시 Popover 트리거
                  isDeleting={bubble.isDeleting}
                  isNew={bubble.isNew}
                  className={clsx(
                    {
                      'scale-in': bubble.isNew,
                    },
                    {
                      float: !bubble.isNew && openPopoverId !== bubble.bubbleId,
                    },
                  )}
                />
              </PopoverTrigger>
              <PopoverContent className="w-[112px] h-[224px] z-50 p-0">
                <div className="w-[112px] h-[224px] flex flex-col gap-[3px] justify-center items-center">
                  <button
                    onClick={() => {
                      deleteBubble(bubble.bubbleId);
                      setOpenPopoverId(null);
                    }}
                    className={clsx(
                      'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200  cursor-pointer',
                      isMobile ? 'text-[14px]' : 'text-[16px]',
                    )}
                  >
                    삭제
                  </button>
                  <div className="w-[80px] h-[1px] bg-gray-200"></div>
                  <button
                    className={clsx(
                      'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200 cursor-pointer',
                      isMobile ? 'text-[14px]' : 'text-[16px]',
                    )}
                    onClick={() => {
                      moveToMindmap(bubble.bubbleId, bubble.title);
                      setOpenPopoverId(null);
                    }}
                  >
                    마인드맵
                  </button>
                  <div className="w-[80px] h-[1px] bg-gray-200"></div>
                  <button
                    className={clsx(
                      'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200 cursor-pointer',
                      isMobile ? 'text-[14px]' : 'text-[16px]',
                    )}
                    onClick={() => {
                      createMatrix(bubble);
                      setOpenPopoverId(null);
                    }}
                  >
                    아이젠하워
                  </button>
                  <div className="w-[80px] h-[1px] bg-gray-200"></div>
                  <button
                    className={clsx(
                      'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200 cursor-pointer',
                      isMobile ? 'text-[14px]' : 'text-[16px]',
                    )}
                    onClick={() => {
                      handleSaveBubble(bubble);
                    }}
                  >
                    보관
                  </button>
                  <div className="w-[80px] h-[1px] bg-gray-200"></div>
                  <button
                    className={clsx(
                      'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200 cursor-pointer',
                      isMobile ? 'text-[14px]' : 'text-[16px]',
                    )}
                    onClick={() => {
                      handleMergeMode(bubble);
                    }}
                  >
                    버블 합치기
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
        <div
          className={clsx(
            'absolute bottom-[0px] left-1/2 transform -translate-x-1/2 bg-white/60 rounded-[48px] flex w-10/12 max-w-[704px] justify-center h-fit items-center gap-4 px-3 py-3  ',
            mergeMode && 'grayscale opacity-60',
          )}
        >
          <textarea
            disabled={mergeMode}
            ref={textareaRef}
            value={inputText}
            rows={1}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="지금 머릿속에 떠오르는 생각을 적어보세요!"
            className={clsx(
              'md:text-[16px] border py-[8px] overflow-hidden resize-none border-blue rounded-[48px] px-6 font-semibold font-pretendard flex-1 outline-none placeholder:text-gray-400 break-words whitespace-pre-wrap h-auto w-full truncate placeholder:whitespace-nowrap placeholder:overflow-hidden placeholder:text-ellipsis',
            )}
          />
          {/*<Toast message="안녕" type="success" />*/}
          {/*<Toast message='안녕' type='error'/>*/}
          <button
            disabled={isPending || mergeMode}
            onClick={addBubble}
            className="md:hidden rounded-[48px] w-[30px] h-[30px] bg-blue text-white font-semibold text-[16px] font-pretendard flex justify-center items-center cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className=" animate-spin" />
              </>
            ) : (
              <img src={Arrow} />
            )}
          </button>

          <button
            disabled={isPending || mergeMode}
            onClick={addBubble}
            className="hidden md:block rounded-[48px] p-2 h-[40px] bg-blue text-white font-semibold text-[16px] font-pretendard w-[140px] cursor-pointer items-center justify-center"
          >
            {isPending ? (
              <Loader2 className="animate-spin mx-12" />
            ) : (
              '버블 생성하기'
            )}
          </button>
        </div>

        <div
          className={clsx(
            'absolute top-0 right-0 hidden flex gap-1',
            mergeMode && 'inline-flex',
          )}
        >
          <Button
            variant="outline"
            className="w-10 h-10"
            onClick={() => {
              setMergeMode(false);
            }}
          >
            <X/>
          </Button>
          <Button
            variant="blue"
            disabled={isMerging || mergeTargetBubbles.length <= 1}
            onClick={mergeBubble}
          >
            {isMerging ? (
              <>
                <Loader2 className=" animate-spin" />
              </>
            ) : (
              <>
                버블 합치기
                <ArrowRight
                  className="w-5 h-5"
                  size={20}
                  style={{ width: '20px', height: '20px' }}
                />
              </>
            )}
          </Button>
        </div>
      </div>
      <MergeBubbleDialog
        isOpen={isMergeDialogOpen}
        text={mergedText}
        onOpenChange={setIsMergeDialogOpen}
        applyMergedBubble={applyMergedBubble}
      />

      {selectedBubble.bubbleId && (
        <MoveToInventoryModal
          isOpen={isMoveToInventoryDialogOpen}
          onOpenChange={(open) => {
            setIsMoveToInventoryDialogOpen(open);
            if (!open) {
              if (!toBeSavedBubbleId) {
                setSelectedBubble({ bubbleId: null, title: '' });
                setToBeSavedBubbleId(null);
              }
            }
          }}
          item={{
            id: selectedBubble.bubbleId,
            title: selectedBubble.title,
          }}
          onSuccess={handleSaveSuccess}
        />
      )}
      <NodeToTaskModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        taskData={taskData}
        onSuccess={checkCleanBubble}
      />
    </div>
  );
}
