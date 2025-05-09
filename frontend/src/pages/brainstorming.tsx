import { useState, useRef, useEffect } from 'react';
import BubbleImg from '../assets/bubble.png';
import Arrow from '@/assets/arrow_top.svg';
import { BubbleType, BubbleNodeType } from '@/types/brainstorming';
import { useIsMobile } from '@/hooks/use-mobile.ts';
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

export default function Brainstorming() {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const { bubbleList } = useGetBubbles();
  const { deleteBrainstormingMutation } = useDeleteBubble();
  const { createBubbleMutation, isPending } = useCreateBubble();
  const [bubbles, setBubbles] = useState<BubbleNodeType[]>([]);
  const [inputText, setInputText] = useState('');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const bubblesRef = useRef<BubbleNodeType[]>([]);

  const navigate = useNavigate();

  // bubbleList가 변경되면 bubbles 상태를 업데이트
  useEffect(() => {
    if (bubbleList && Array.isArray(bubbleList) && bubbleList.length > 0) {
      console.log(bubbleList);
      placeBubbles(bubbleList);
    }
  }, [bubbleList]);

  useEffect(() => {
    bubblesRef.current = bubbles;
  }, [bubbles]);

  // textarea 높이
  const textareaRef = useRef(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputText, isMobile]);

  // 버블 배치
  const placeBubbles = (data) => {
    const defaultBubbles: BubbleNodeType[] = [];

    for (const item of data) {
      const radius = getRadiusForText(item.title);
      const position = getPosition(radius, defaultBubbles);

      defaultBubbles.push({
        id: item.bubbleId,
        title: item.title,
        radius: radius,
        x: (position.x / containerRef.current.offsetWidth) * 100,
        y: (position.y / containerRef.current.offsetHeight) * 100,
      });
    }

    setBubbles(defaultBubbles);
  };

  // 기존 데이터로 화면에 버블 배치
  useEffect(() => {
    placeBubbles(bubbles);
  }, []);

  // 화면 리사이즈 시 버블 위치 재계산
  useEffect(() => {
    const handleResize = () => {
      placeBubbles(bubblesRef.current); // 최신 버블 배열로 재배치
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRadiusForText = (title: string) => {
    const length = title.length;
    if (length <= 10) return 60;
    if (length <= 20) return 80;
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

    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const centerX = containerWidth / 2;

    // x좌표 후보
    const candidateX = [];
    for (let offset = 0; offset + diameter <= centerX; offset += step) {
      if (centerX + offset + diameter <= containerWidth)
        candidateX.push(centerX + offset);
      if (centerX - offset - diameter >= 0)
        candidateX.push(centerX - offset - diameter);
    }

    // 각 x 좌표에 대해 가능한 y 위치 계산
    for (const x of candidateX) {
      let y = 0;

      for (const bubble of currentBubbles) {
        const dx = x - (bubble.x * containerWidth) / 100;
        const distanceX = Math.abs(dx);

        if (distanceX < radius + bubble.radius) {
          const bottomY =
            (bubble.y * containerHeight) / 100 + bubble.radius * 2 + 5;
          if (bottomY > y) y = bottomY;
        }
      }

      if (y + diameter <= containerHeight - 50) {
        const randomOffset = Math.floor(Math.random() * jitter) - jitter / 2;
        candidates.push({ x: x + randomOffset, y });
      }
    }

    // 후보가 없으면 아래로 쌓기
    if (candidates.length === 0) {
      const maxBottom = currentBubbles.reduce((max, b) => {
        const bottom = (b.y * container.offsetHeight) / 100 + b.radius * 2;
        return Math.max(max, bottom);
      }, 0);
      return {
        x: Math.random() * (containerWidth - radius * 2),
        y: maxBottom,
      };
    }

    // 가장 위에 붙일 수 있는 후보 위치들 중 하나 선택
    const minY = Math.min(...candidates.map((c) => c.y));
    const filtered = candidates.filter((c) => c.y === minY);
    const chosen = filtered[Math.floor(Math.random() * filtered.length)];

    return chosen;
  };

  // 버블 추가
  const addBubble = () => {
    if (!inputText.trim()) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    createBubbleMutation(
      { text: inputText },
      {
        onSuccess: (data) => {
          const newBubbles: BubbleNodeType[] = [];

          for (const bubble of data.content) {
            const radius = getRadiusForText(bubble.title);

            // 기존 + 지금 추가 중인 버블 포함해서 자리 찾기
            let position = getPosition(radius, [...bubbles, ...newBubbles]);

            // 자리 못 찾으면 아래로 이어 붙이기
            if (!position) {
              const maxBottom = [...bubbles, ...newBubbles].reduce((max, b) => {
                const bottom = (b.y * containerHeight) / 100 + b.radius * 2;
                return Math.max(max, bottom);
              }, 0);

              position = {
                x: Math.random() * (containerWidth - radius * 2),
                y: maxBottom + 10, // 10px 정도 여백
              };
            }

            newBubbles.push({
              id: bubble.bubbleId,
              title: bubble.title,
              x: (position.x / containerWidth) * 100,
              y: (position.y / containerHeight) * 100,
              radius,
            });
          }

          setBubbles((prev) => [...prev, ...newBubbles]);
          setInputText('');
        },

        onError: (error) => {
          console.error('마인드맵 생성 중 오류가 발생했습니다: ', error);
        },
      },
    );
  };

  const deleteBubble = (id: number) => {
    console.log(id);
    deleteBrainstormingMutation(id, {
      onSuccess: () => {
        setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
      },

      onError: (error) => {
        console.error('마인드맵 삭제 중 오류가 발생했습니다: ', error);
      },
    });
  };

  const moveToMindmap = (id: number, title: string) => {
    const encodedBubbleText = encodeURIComponent(title);
    navigate(`/mindmap/${id}?text=${encodedBubbleText}`);
  };

  const createMatrix = () => {};
  const saveBubble = () => {};

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-blue-2 py-[50px] h-[708px]"
    >
      <div
        ref={scrollRef}
        className="absolute top-0 left-0 w-full h-full overflow-auto"
      >
        {bubbles.map((bubble, index) => (
          <Popover key={index}>
            <PopoverTrigger asChild>
              <Bubble
                x={bubble.x}
                y={bubble.y}
                radius={bubble.radius}
                title={bubble.title}
                containerWidth={containerRef.current?.offsetWidth || 0}
                containerHeight={containerRef.current?.offsetHeight || 0}
                onClick={() => console.log('버블 클릭됨')} // 클릭 시 Popover 트리거
              />
            </PopoverTrigger>
            <PopoverContent className="w-[112px] h-[180px] z-50 p-0">
              <div className="w-[112px] h-[180px] flex flex-col gap-[3px] justify-center items-center">
                <button
                  onClick={() => {
                    deleteBubble(bubble.id);
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
                    moveToMindmap(bubble.id, bubble.title);
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
                  onClick={createMatrix}
                >
                  매트릭스
                </button>
                <div className="w-[80px] h-[1px] bg-gray-200"></div>
                <button
                  className={clsx(
                    'w-[89px] h-[33px] pl-[9px] rounded-[8px] text-[16px] text-start text-gray-900 hover:bg-gray-200 py-2 cursor-pointer',
                    isMobile ? 'text-[14px]' : 'text-[16px]',
                  )}
                  onClick={saveBubble}
                >
                  보관
                </button>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      <div
        className={clsx(
          'absolute bottom-[74px] left-1/2 transform -translate-x-1/2 bg-white/60 rounded-[48px] flex w-10/12 max-w-[704px] justify-center h-fit items-center',
          isMobile ? 'gap-2 px-4 py-3' : 'gap-4 px-3 py-3',
        )}
      >
        <textarea
          ref={textareaRef}
          value={inputText}
          rows={1}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="버블에 넣을 텍스트를 입력하세요"
          className={clsx(
            'border py-[7px] overflow-hidden resize-none border-blue rounded-[48px] px-6 font-semibold font-pretendard flex-1 outline-none placeholder:text-gray-400 break-words whitespace-pre-wrap h-auto',
            isMobile ? 'text-[12px] ' : 'text-[16px] ',
          )}
        />
        {isMobile ? (
          <button
            disabled={isPending}
            onClick={addBubble}
            className="rounded-[48px] w-[30px] h-[30px] bg-blue text-white font-semibold text-[16px] font-pretendard flex justify-center items-center cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className=" animate-spin" />
              </>
            ) : (
              <img src={Arrow} />
            )}
          </button>
        ) : (
          <button
            disabled={isPending}
            onClick={addBubble}
            className="rounded-[48px] p-2 h-[40px] bg-blue text-white font-semibold text-[16px] font-pretendard w-[140px] cursor-pointer items-center justify-center"
          >
            {isPending ? (
              <Loader2 className="animate-spin mx-12" />
            ) : (
              '버블 생성하기'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
