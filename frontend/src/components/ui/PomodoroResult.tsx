import { Pomodoro } from '@/types/pomodoro';
import { Button } from '@/components/ui/button.tsx';
import { MultiSlider } from '@/components/ui/MultiSlider.tsx';

export default function PomodoroResult({ pomodoro }: { pomodoro: Pomodoro }) {
  const totalPlannedTime = pomodoro.plannedCycles.reduce(
    (sum, cycle) => sum + cycle.workDuration + (cycle.breakDuration ?? 0),
    0,
  );
  const totalExecutedTime = pomodoro.executedCycles.reduce(
    (sum, cycle) => sum + cycle.workDuration + (cycle.breakDuration ?? 0),
    0,
  );

  const maxTime = Math.max(totalPlannedTime, totalExecutedTime);

  const plannedTimeRatio = totalPlannedTime / maxTime;
  const excutedTimeRatio = totalExecutedTime / maxTime;

  const plannedFocus = pomodoro.executedCycles.map((c) => c.workDuration); //실제 집중 배열
  const plannedBreak = pomodoro.executedCycles //실제 휴식 배열
    .map((c) => c.breakDuration)
    .filter((b): b is number => b !== null);

  const excutedFocus = pomodoro.executedCycles.map((c) => c.workDuration); //실제 집중 배열
  const excutedBreaak = pomodoro.executedCycles //실제 휴식 배열
    .map((c) => c.breakDuration)
    .filter((b): b is number => b !== null);

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
              className="flex gap-1.25 h-[66px]"
              style={{ width: `${plannedTimeRatio * 100}%` }}
            >
              <MultiSlider
                min={0}
                max={totalPlannedTime}
                step={1}
                cycles={pomodoro.plannedCycles}
                readonly={true}
                onValueChange={() => {}}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="font-semibold text-[18px]">실제 실행 시간</h2>
          <div className="px-[17px] py-[20px] bg-[#F2F2F2] rounded-[10px] w-full">
            <div
              className="flex gap-1.25 h-[66px]"
              style={{ width: `${excutedTimeRatio * 100}%` }}
            >
              <MultiSlider
                min={0}
                max={totalExecutedTime}
                step={1}
                cycles={pomodoro.executedCycles}
                readonly={true}
                onValueChange={() => {}}
                style={{
                  bgColor: '#8D5CF6', // 원하는 배경색
                  fontColor: '#ffffff', // 원하는 글씨 색 (optional)
                }}
              />
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
                <span>{formatTimeDisplay(totalExecutedTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>집중 시간 :</span>
                <span>
                  {formatTimeDisplay(excutedFocus.reduce((a, b) => a + b, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>휴식 시간 :</span>
                <span>
                  {formatTimeDisplay(excutedBreaak.reduce((a, b) => a + b, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button className="w-[180px] h-[48px] text-[16px] black">
          삭제하기
        </Button>
      </div>
    </div>
  );
}
