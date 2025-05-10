import { useEffect, useRef } from 'react';
import { X, Play, CirclePause } from 'lucide-react';
import { usePomodoroStore } from '@/store/pomodoro';
export function PomodoroTimer() {
  const {
    title,
    isRunning,
    startTimestamp,
    elapsedTime,
    setIsRunning,
    setStartTimestamp,
    setElapsedTime,
    reset,
    deleteState,
  } = usePomodoroStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const CYCLE_TIME = 25 * 60;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => (elapsedTime / CYCLE_TIME) * 100;

  // 백그라운드 시간 보정용 인터벌
  useEffect(() => {
    if (isRunning && startTimestamp !== null) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - startTimestamp) / 1000);
        setElapsedTime(delta);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, startTimestamp]);

  // 캔버스 진행률 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 180;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size / 2 - 14;
    const innerRadius = outerRadius - 28;
    const progress = Math.min(calculateProgress(), 100);

    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f5f5';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (progress / 100) * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = '#8d5cf6';
    ctx.fill();

    const endX = centerX + Math.cos(endAngle) * (innerRadius + (outerRadius - innerRadius) / 2);
    const endY = centerY + Math.sin(endAngle) * (innerRadius + (outerRadius - innerRadius) / 2);
    ctx.beginPath();
    ctx.arc(endX, endY, (outerRadius - innerRadius) / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#8d5cf6';
    ctx.fill();
  }, [elapsedTime]);

  // 상태 저장
  useEffect(() => {
    localStorage.setItem(
        'pomodoro-state',
        JSON.stringify({ isRunning, startTimestamp })
    );
  }, [isRunning, startTimestamp]);

  // 초기 상태 로드
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.startTimestamp) {
        const now = Date.now();
        const delta = Math.floor((now - parsed.startTimestamp) / 1000);
        setElapsedTime(delta);
        setStartTimestamp(parsed.startTimestamp);
        setIsRunning(parsed.isRunning);
      }
    }
  }, []);

  const startTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      const now = Date.now();
      setStartTimestamp(now - elapsedTime * 1000); // resume
      setIsRunning(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <>
        <div className="relative w-[320px] h-[320px] mb-8">
          {/* Canvas로 타이머 그리기 */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* 타이머 표시 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center g-[5px]">
            <div className="bg-white rounded-full p-2">
              <CirclePause className="w-[30px] h-[30px]" />
            </div>

            <div className="font-semibold text-[60px]">
              {formatTime(elapsedTime)}
            </div>
            <div className="font-regular text-gray-500 text-[22px]">
              {formatTime(totalTime)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mb-8">
          <button
            className="w-[60px] h-[60px] rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
            onClick={deleteTimer}
          >
            <X className="w-[30px] h-[30px]" />
          </button>
          <button
            className={`w-[85px] h-[85px] rounded-full flex items-center justify-center bg-[#9747ff] cursor-pointer hover:bg-[#7e3fd4]
              }`}
            onClick={startTimer}
          >
            {!isRunning && (
              <Play className="w-[40px] h-[40px] text-[#ffffff] fill-white" />
            )}
          </button>
        </div>
      </>
    </div>
  );
}
