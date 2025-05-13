import { useState, useRef, useEffect } from 'react';
import Arrow from '@/assets/arrow_top.svg';
import { BubbleType, BubbleNodeType } from '@/types/brainstorming';
import { useResponsive } from '@/hooks/use-mobile.ts';
import clsx from 'clsx';
import Bubble from '@/components/ui/brainstorming/Bubble';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import BrainstormingLogo from '@/assets/sidebar/color-brainstorming.svg';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button.tsx';
import { NodeToTaskModal } from '@/components/ui/Modal/NodeTaskModal.tsx';

export default function Brainstorming() {
  const isMobile = useResponsive();
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const { bubbleList } = useGetBubbles();
  const { deleteBrainstormingMutation } = useDeleteBubble();
  const { createBubbleMutation, isPending } = useCreateBubble();
  const [bubbles, setBubbles] = useState<BubbleNodeType[]>([]);
  const [inputText, setInputText] = useState('');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const bubblesRef = useRef<BubbleNodeType[]>([]);
  const textareaRef = useRef(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const [isBubbleDialogOpen, setIsBubbleDialogOpen] = useState(false);
  const [selectedBubble, setSelectedBubble] = useState({
    bubbleId: null,
    title: '',
  });
  const [toBeSavedBubbleId, setToBeSavedBubbleId] = useState<number | null>(
    null,
  );

  const [isMoveToInventoryDialogOpen, setIsMoveToInventoryDialogOpen] =
    useState(false);

  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskData, setTaskData] = useState({ id: null, title: '' });

  // bubbleList가 변경되면 bubbles 상태를 업데이트
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
      addBubble();
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

    // 각 x 좌표에 대해 가능한 y 위치 계산
    for (const x of candidateX) {
      let y = 10;

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
    const minY = Math.min(...candidates.map((c) => c.y));
    const filtered = candidates.filter((c) => c.y === minY);
    const chosen = filtered[Math.floor(Math.random() * filtered.length)];
    //
    // if (chosen.y + diameter > containerHeight) {
    //   setContainerSize((prev) => ({
    //     ...prev,
    //     height: chosen.y + diameter , // +100은 여유
    //   }));
    // }

    return chosen;
  };

  // 버블 추가
  const addBubble = () => {
    if (!inputText.trim()) return;
    if (bubblesRef.current.length >= 20) {
      alert('버블이 너무 많습니다! 생각을 먼저 정리해보세요.');
      return;
    }
    const scroll = scrollRef.current;
    const scrollWidth = scroll.offsetWidth;
    let scrollHeight = scroll.offsetHeight;

    createBubbleMutation(
      { text: inputText },
      {
        onSuccess: (data) => {
          const newBubbles: BubbleNodeType[] = [];

          for (const bubble of data.content) {
            const radius = getRadiusForText(bubble.title);

            // 기존 + 지금 추가 중인 버블 포함해서 자리 찾기
            const position = getPosition(radius, [...bubbles, ...newBubbles]);
            console.log(position);

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
          console.error('버블 생성 중 오류가 발생했습니다: ', error);
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
      id: bubble.bubbleId,
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

      // 애니메이션이 끝난 후 버블 제거
      setTimeout(() => {
        setBubbles((prev) =>
          prev.filter((bubble) => bubble.bubbleId !== toBeSavedBubbleId),
        );
        setToBeSavedBubbleId(null); // 상태 초기화
      }, 250);
    }
  };

  return (
    <div
      ref={containerRef}
      className={clsx('w-full h-full lg:pb-[0px]', isMobile && 'pb-[50px]')}
    >
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
                setOpenPopoverId(open ? bubble.bubbleId : null);
              }}
            >
              <PopoverTrigger asChild>
                <Bubble
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
              <PopoverContent className="w-[112px] h-[180px] z-50 p-0">
                <div className="w-[112px] h-[180px] flex flex-col gap-[3px] justify-center items-center">
                  <button
                    onClick={() => {
                      deleteBubble(bubble.bubbleId);
                      setOpenPopoverId(null);
                    }}
                    className={clsx(
                      'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200 py-2 cursor-pointer',
                      isMobile ? 'text-[14px]' : 'text-[16px]',
                    )}
                  >
                    삭제
                  </button>
                  <div className="w-[80px] h-[1px] bg-gray-200"></div>
                  <button
                    className={clsx(
                      'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200 py-2 cursor-pointer',
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
                      'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200 py-2 cursor-pointer',
                      isMobile ? 'text-[14px]' : 'text-[16px]',
                    )}
                    onClick={() => {
                      createMatrix(bubble);
                      setOpenPopoverId(null);
                    }}
                  >
                    매트릭스
                  </button>
                  <div className="w-[80px] h-[1px] bg-gray-200"></div>
                  <button
                    className={clsx(
                      'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200 py-2 cursor-pointer',
                      isMobile ? 'text-[14px]' : 'text-[16px]',
                    )}
                    onClick={() => {
                      handleSaveBubble(bubble);
                    }}
                  >
                    보관
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ))}
          <div
            className="absolute bottom-0 left-0 w-full h-[50px] opacity-0"
            style={{ position: 'absolute', bottom: '0', left: '0' }}
          />
        </div>
        <div
          className={clsx(
            'absolute bottom-[35px] left-1/2 transform -translate-x-1/2 bg-white/60 rounded-[48px] flex w-10/12 max-w-[704px] justify-center h-fit items-center gap-4 px-3 py-3 sm:gap-2 sm:px-4 sm:py-3 ',
          )}
        >
          <textarea
            ref={textareaRef}
            value={inputText}
            rows={1}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="버블에 넣을 텍스트를 입력하세요"
            className={clsx(
              'md:text-[16px] border py-[8px] overflow-hidden resize-none border-blue rounded-[48px] px-6 font-semibold font-pretendard flex-1 outline-none placeholder:text-gray-400 break-words whitespace-pre-wrap h-auto',
            )}
          />

          <button
            disabled={isPending}
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
            disabled={isPending}
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
      </div>

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
      />
    </div>
  );
}
