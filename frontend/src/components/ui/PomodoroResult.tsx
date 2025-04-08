import { Pomodoro } from '@/types/pomodoro';
import { Button } from '@/components/ui/button.tsx';

export default function PomodoroResult({ pomodoro }: { pomodoro: Pomodoro }) {
  const plannedFocus = pomodoro.plannedCycles.map((c) => c.workDuration); //예상 집중 배열
  const plannedBreak = pomodoro.plannedCycles // 예상 휴식 배열
    .map((c) => c.breakDuration)
    .filter((b): b is number => b !== null);

  const actualFocus = pomodoro.executedCycles.map((c) => c.workDuration); //실제 집중 배열
  const actualBreak = pomodoro.executedCycles //실제 휴식 배열
    .map((c) => c.breakDuration)
    .filter((b): b is number => b !== null);

  const totalPlannedTime =
    plannedFocus.reduce((a, b) => a + b, 0) +
    plannedBreak.reduce((a, b) => a + b, 0);

  const totalActualTime =
    actualFocus.reduce((a, b) => a + b, 0) +
    actualBreak.reduce((a, b) => a + b, 0);

  const maxTime = Math.max(totalPlannedTime, totalActualTime);
  const plannedTimeRatio = totalPlannedTime / maxTime;
  const actualTimeRatio = totalActualTime / maxTime;

  const formatTime = (minutes: number) => `${minutes}min`;

  const createTimelineBlocks = (
    focusArray: number[],
    breakArray: number[],
    totalTime: number,
  ) => {
    const timelineBlocks = [];
    for (let i = 0; i < focusArray.length; i++) {
      timelineBlocks.push({
        type: 'focus',
        time: focusArray[i],
        width: (focusArray[i] / totalTime) * 100,
      });

      if (i < breakArray.length) {
        timelineBlocks.push({
          type: 'break',
          time: breakArray[i],
          width: (breakArray[i] / totalTime) * 100,
        });
      }
    }
    return timelineBlocks;
  };

  const plannedTimeline = createTimelineBlocks(
    plannedFocus,
    plannedBreak,
    totalPlannedTime,
  );

  const actualTimeline = createTimelineBlocks(
    actualFocus,
    actualBreak,
    totalActualTime,
  );

  const formatTimeDisplay = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  return (
    <div className="w-full flex flex-col gap-[30px]">
      <div className="flex flex-col gap-7.5">
        <div className="flex flex-col gap-2.5">
          <h2 className="font-semibold text-[18px]">계획 실행 시간</h2>
          <div className="px-[17px] py-[20px] bg-[#F2F2F2] rounded-[10px] w-full">
            <div
              className="flex gap-1.25 "
              style={{ width: `${plannedTimeRatio * 100}%` }}
            >
              {plannedTimeline.map((segment, index) => (
                <div
                  key={`planned-${index}`}
                  className={`
              text-center py-3 border-[#B9B9B7] border-[1px]
              ${segment.type === 'focus' ? 'bg-[#decfff]' : 'bg-white '}
              ${index === 0 ? 'rounded-l-md' : ''}
              ${index === plannedTimeline.length - 1 ? 'rounded-r-md' : ''}
            `}
                  style={{ width: `${segment.width}%` }}
                >
                  <span className="font-normal text-[18px]">
                    {formatTime(segment.time)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="font-semibold text-[18px]">실제 실행 시간</h2>
          <div className="px-[17px] py-[20px] bg-[#F2F2F2] rounded-[10px] w-full">
            <div
              className="flex gap-1.25 "
              style={{ width: `${actualTimeRatio * 100}%` }}
            >
              {actualTimeline.map((block, index) => (
                <div
                  key={`actual-${index}`}
                  className={`
              text-center py-3 border-[#B9B9B7] border-[1px]
              ${block.type === 'focus' ? 'bg-[#8d5cf6] text-white' : 'bg-white '}
              ${index === 0 ? 'rounded-l-md' : ''}
              ${index === actualTimeline.length - 1 ? 'rounded-r-md' : ''}
            `}
                  style={{ width: `${block.width}%` }}
                >
                  <span className="font-normal text-[18px]">
                    {formatTime(block.time)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4 ">
          <div className="border rounded-[7px] px-[20px] py-[30px] gap-[20px] flex flex-col">
            <h3 className="font-semibold text-[18px] leading-[100%]">계획</h3>
            <div className="text-sm flex flex-col gap-[15px] text-[16px] font-normal">
              <div className="flex justify-between ">
                <span>총 시간 :</span>
                <span>{formatTimeDisplay(totalPlannedTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>집중 시간 :</span>
                <span>{plannedFocus.reduce((a, b) => a + b, 0)}분</span>
              </div>
              <div className="flex justify-between">
                <span>휴식 시간 :</span>
                <span>{plannedBreak.reduce((a, b) => a + b, 0)}분</span>
              </div>
            </div>
          </div>

          <div className="border rounded-[7px] px-[20px] py-[30px] gap-[20px] flex flex-col">
            <h3 className="font-semibold text-[18px] leading-[100%] mr-auto">
              실제
            </h3>
            <div className="text-sm flex flex-col gap-[15px] text-[16px] font-normal">
              <div className="flex justify-between ">
                <span>총 시간 :</span>
                <span>{formatTimeDisplay(totalActualTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>집중 시간 :</span>
                <span>{actualFocus.reduce((a, b) => a + b, 0)}분</span>
              </div>
              <div className="flex justify-between">
                <span>휴식 시간 :</span>
                <span>{actualBreak.reduce((a, b) => a + b, 0)}분</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full justify-end'>
        <Button  className="w-[180px] h-[48px] text-[16px] black">
          삭제하기
        </Button>
      </div>
    </div>
  );
}
