import {Pomodoro, TotalTime} from '@/types/pomodoro';
import {Button} from '@/components/ui/button.tsx';
import {MultiSlider} from '@/components/ui/MultiSlider.tsx';

export default function PomodoroResult({pomodoro}: { pomodoro: Pomodoro }) {
    const convertToTotalMinutes = (time: TotalTime): number => {
        const totalMinutes = time.hour * 60 + time.minute;
        return totalMinutes;
    };

    // 슬라이더 전체 길이 비율 계산
    const maxTime = Math.max(
        convertToTotalMinutes(pomodoro.totalPlannedTime),
        convertToTotalMinutes(pomodoro.totalExecutedTime),
    );

    const plannedTimeRatio =
        convertToTotalMinutes(pomodoro.totalPlannedTime) / maxTime;
    const executedTimeRatio =
        convertToTotalMinutes(pomodoro.totalExecutedTime) / maxTime;

    const formatTimeDisplay = (totalTime: TotalTime) => {
        return totalTime.hour > 0
            ? `${totalTime.hour}시간 ${totalTime.minute}분`
            : `${totalTime.minute}분`;
    };

    return (
        <div className="w-full flex flex-col gap-[30px]">
            <div className="flex flex-col gap-7.5">
                <div className="flex flex-col gap-2.5">
                    <h2 className="font-semibold text-[18px]">계획 실행 시간</h2>
                    <div className="px-[17px] py-[20px] bg-[#F2F2F2] rounded-[10px] w-full">
                        <div
                            className="flex gap-1.25 h-[66px]"
                            style={{width: `${plannedTimeRatio * 100}%`}}
                        >
                            <MultiSlider
                                min={0}
                                max={convertToTotalMinutes(pomodoro.totalPlannedTime)}
                                step={1}
                                cycles={pomodoro.plannedCycles}
                                readonly={true}
                                onValueChange={() => {
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2.5">
                    <h2 className="font-semibold text-[18px]">실제 실행 시간</h2>
                    <div className="px-[17px] py-[20px] bg-[#F2F2F2] rounded-[10px] w-full">
                        <div
                            className="flex gap-1.25 h-[66px]"
                            style={{width: `${executedTimeRatio * 100}%`}}
                        >
                            <MultiSlider
                                min={0}
                                max={convertToTotalMinutes(pomodoro.totalExecutedTime)}
                                step={1}
                                cycles={pomodoro.executedCycles}
                                readonly={true}
                                onValueChange={() => {
                                }}
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
                                <span>{formatTimeDisplay(pomodoro.totalPlannedTime)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>집중 시간 :</span>
                                {/*이 부분 백엔드 바뀌면 수정*/}
                                {/*<span>{formatTimeDisplay(pomodoro.totalPlannedTime)}</span>*/}
                            </div>
                            <div className="flex justify-between">
                                <span>휴식 시간 :</span>
                                {/*<span>{formatTimeDisplay(pomodoro.totalPlannedTime)}</span>*/}
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
                                <span>{formatTimeDisplay(pomodoro.totalExecutedTime)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>집중 시간 :</span>
                                <span>{formatTimeDisplay(pomodoro.totalWorkingTime)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>휴식 시간 :</span>
                                <span>{formatTimeDisplay(pomodoro.totalBreakTime)}</span>
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
