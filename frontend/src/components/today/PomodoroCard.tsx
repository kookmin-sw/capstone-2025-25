import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePomodoroStore } from '@/store/pomodoro.ts';
import usePatchPomodoro from '@/hooks/queries/pomodoro/usePatchPomodoro';
import { useRef, useEffect } from 'react';
import { Pause } from 'lucide-react';
import start from '@/assets/pomodoro_start.svg';
import reset from '@/assets/pomodoro_reset.svg';
import x from '@/assets/pomodoro_x.svg';

export function PomodoroCard() {
  const store = usePomodoroStore();
  const {
    title,
    isRunning,
    elapsedTime,
    resetTimer,
    deleteTimer,
    startTimer,
    pauseTimer,
  } = store;
  const { patchPomodoroMutation } = usePatchPomodoro();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CYCLE_TIME = 25 * 60;
  const remaining = Math.max(CYCLE_TIME - elapsedTime, 0);

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const calculateProgress = () => {
    return (elapsedTime / CYCLE_TIME) * 100;
  };

  // 캔버스 진행률 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 212;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size / 2;
    const innerRadius = outerRadius - 20;
    const progress = calculateProgress();

    ctx.clearRect(0, 0, size, size);

    // 바깥 원
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f5f5';
    ctx.fill();

    // 안쪽 원
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    // 진행률 표시
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (progress / 100) * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = '#7098FF';
    ctx.fill();

    // 시작 점 동그라미
    const startX =
      centerX +
      Math.cos(startAngle) * (innerRadius + (outerRadius - innerRadius) / 2);
    const startY =
      centerY +
      Math.sin(startAngle) * (innerRadius + (outerRadius - innerRadius) / 2);
    ctx.beginPath();
    ctx.arc(startX, startY, (outerRadius - innerRadius) / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#7098FF';
    ctx.fill();

    // 끝 점 동그라미
    const endX =
      centerX +
      Math.cos(endAngle) * (innerRadius + (outerRadius - innerRadius) / 2);
    const endY =
      centerY +
      Math.sin(endAngle) * (innerRadius + (outerRadius - innerRadius) / 2);
    ctx.beginPath();
    ctx.arc(endX, endY, (outerRadius - innerRadius) / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#7098FF';
    ctx.fill();
  }, [elapsedTime]);

  const handleReset = () => {
    resetTimer(patchPomodoroMutation, elapsedTime);
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-scale-700 text-[20px] font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-full w-full justify-center items-center flex flex-col gap-2">
          <div className="relative w-[212px] h-[212px]">
            {/* Canvas로 타이머 그리기 */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {/* 타이머 표시 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center g-[5px]">
              <div className="font-semibold text-[28px] text-[#525463]">
                {formatTime(remaining)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-[35px] py-2">
            <button
              className="w-[30px] h-[30px] rounded-full  bg-gray-scale-200 flex items-center justify-center  cursor-pointer"
              onClick={deleteTimer}
            >
              <img src={x} className="w-[10.87px] h-[10.87px]" />
            </button>
            <button
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center bg-[#7098FF] cursor-pointer 
              }`}
              onClick={isRunning ? pauseTimer : startTimer}
            >
              {isRunning ? (
                <Pause className="w-[22.59px] h-[22.59px] text-[#ffffff] fill-white" />
              ) : (
                <img
                  src={start}
                  className="w-[22.59px] h-[22.59px] text-[#ffffff] fill-white"
                />
              )}
            </button>
            <button
              className="w-[30px] h-[30px] rounded-full  bg-gray-scale-200 flex items-center justify-center  cursor-pointer"
              onClick={handleReset}
            >
              <img src={reset} className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
