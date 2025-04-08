import { useState, useEffect, useRef } from 'react';
import { X, Play, CirclePause, Coffee, Square, Crosshair } from 'lucide-react';
import { PomodoroTimerProps, cycleType } from '@/types/pomodoro';

export function PomodoroTimer({ plannedCycles }: PomodoroTimerProps) {
  // 1 사이클 = 집중 + 휴식
  const [elapsedTime, setElapsedTime] = useState(0); // 진행 시간
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false); // 타이머 실행
  const [cycleType, setCycleType] = useState<cycleType>('focus'); //현재 진행 사이클 타입
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0); //현재 사이클 인덱스
  const [showResults, setShowResults] = useState(false); //결과 노출
  const [isOvertime, setIsOvertime] = useState(false); //초과 시간

  const TOTAL_CYCLES = plannedCycles.length;
  const currentCycle = plannedCycles[currentCycleIndex];
  const CYCLE_TIME =
    cycleType === 'focus'
      ? currentCycle.workDuration * 60
      : (currentCycle.breakDuration || 0) * 60;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateProgress = () => (elapsedTime / CYCLE_TIME) * 100; //원 채우기 비율 계산

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setCycleType('focus');
    setElapsedTime(0);
    setCurrentCycleIndex(0);
    setShowResults(false);
    setIsOvertime(false);
  };

  const switchPhaseOrCycle = () => {
    if (cycleType === 'focus') {
      // focus 끝 → break 또는 다음 cycle
      if (!currentCycle.breakDuration) {
        moveToNextCycle();
      } else {
        setCycleType('break');
        setElapsedTime(0);
        setIsOvertime(false);
      }
    } else {
      // break 끝 → 다음 cycle
      moveToNextCycle();
    }
  };

  const moveToNextCycle = () => {
    if (currentCycleIndex < TOTAL_CYCLES - 1) {
      setCurrentCycleIndex((prev) => prev + 1);
      setCycleType('focus');
      setElapsedTime(0);
      setIsOvertime(false);
    } else {
      setIsRunning(false);
      setShowResults(true);
    }
  };
  //타이머
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          return newTime;
        });
      }, 1000);
      timerRef.current = setInterval(() => {
        setTotalTime((prevTime) => {
          const newTime = prevTime + 1;
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, CYCLE_TIME]);

  //원
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 340;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size / 2 - 14;
    const innerRadius = outerRadius - 28;

    const progress = calculateProgress();
    const normalizedProgress = Math.min(progress, 100);
    const overtimeProgress = Math.max(0, progress - 100);

    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f5f5';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    // 첫 번째 바퀴 그리기 (흰색 -> 보라색 그라데이션)
    if (normalizedProgress > 0) {
      const startAngle = -Math.PI / 2; // 12시 방향에서 시작
      const endAngle = startAngle + (normalizedProgress / 100) * Math.PI * 2;

      // 원호 그리기 (그라데이션 효과를 위해 여러 개의 작은 호로 나누어 그림)
      const segments = 100; // 세그먼트 수
      const angleStep = (endAngle - startAngle) / segments;

      for (let i = 0; i < segments; i++) {
        const segmentStartAngle = startAngle + i * angleStep;
        const segmentEndAngle = segmentStartAngle + angleStep;

        // 색상 계산 (흰색 -> 보라색 그라데이션)
        const ratio = i / segments;
        const r = Math.round(255 - ratio * (255 - 151));
        const g = Math.round(255 - ratio * (255 - 71));
        const b = Math.round(255 - ratio * (255 - 255));

        const color = `rgb(${r}, ${g}, ${b})`;

        // 호 그리기
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          outerRadius,
          segmentStartAngle,
          segmentEndAngle,
        );
        ctx.arc(
          centerX,
          centerY,
          innerRadius,
          segmentEndAngle,
          segmentStartAngle,
          true,
        );
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }

      // 둥근 끝 그리기
      const endX =
        centerX +
        Math.cos(endAngle) * (innerRadius + (outerRadius - innerRadius) / 2);
      const endY =
        centerY +
        Math.sin(endAngle) * (innerRadius + (outerRadius - innerRadius) / 2);

      ctx.beginPath();
      ctx.arc(endX, endY, (outerRadius - innerRadius) / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#8d5cf6';
      ctx.fill();
    }

    // 두 번째 바퀴 그리기 (보라색 -> 진한 보라색 그라데이션)
    if (overtimeProgress > 0) {
      const startAngle = -Math.PI / 2; // 12시 방향에서 시작
      const endAngle = startAngle + (overtimeProgress / 100) * Math.PI * 2;

      const segments = 100; // 세그먼트 수
      const angleStep = (endAngle - startAngle) / segments;

      for (let i = 0; i < segments; i++) {
        const segmentStartAngle = startAngle + i * angleStep;
        const segmentEndAngle = segmentStartAngle + angleStep;

        const ratio = i / segments;
        const r = Math.round(141 - ratio * (141 - 107));
        const g = Math.round(92 - ratio * (92 - 36));
        const b = Math.round(246 - ratio * (246 - 214));

        const color = `rgb(${r}, ${g}, ${b})`;

        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          outerRadius,
          segmentStartAngle,
          segmentEndAngle,
        );
        ctx.arc(
          centerX,
          centerY,
          innerRadius,
          segmentEndAngle,
          segmentStartAngle,
          true,
        );
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }

      const endX =
        centerX +
        Math.cos(endAngle) * (innerRadius + (outerRadius - innerRadius) / 2);
      const endY =
        centerY +
        Math.sin(endAngle) * (innerRadius + (outerRadius - innerRadius) / 2);

      ctx.beginPath();
      ctx.arc(endX, endY, (outerRadius - innerRadius) / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#6b24d6';
      ctx.fill();
    }
  }, [elapsedTime, CYCLE_TIME]);

  return (
    <div className="flex flex-col items-center">
      {showResults ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">모든 사이클 완료!</h2>
          <p className="mb-4">총 {TOTAL_CYCLES}개의 사이클을 완료했습니다.</p>
          <button
            onClick={resetTimer}
            className="px-6 py-2 bg-[#8d5cf6] text-white rounded-md hover:bg-[#7b68ee] transition-colors"
          >
            다시 시작하기
          </button>
        </div>
      ) : (
        <>
          <div className="relative w-[340px] h-[340px] mb-8">
            {/* Canvas로 타이머 그리기 */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {/* 타이머 표시 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center g-[5px]">
              <div className="bg-white rounded-full p-2">
                {!isRunning && <CirclePause className="w-[30px] h-[30px]" />}
                {isRunning && cycleType === 'focus' && (
                  <Crosshair className="w-[30px] h-[30px]" />
                )}
                {isRunning && cycleType === 'break' && (
                  <Coffee className="w-[30px] h-[30px]" />
                )}
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
              className="w-[60px] h-[60px] rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50"
              onClick={resetTimer}
            >
              <X className="w-[30px] h-[30px]" />
            </button>
            <button
              className={`w-[85px] h-[85px] rounded-full flex items-center justify-center bg-[#9747ff]
              }`}
              onClick={isRunning ? switchPhaseOrCycle : toggleTimer}
            >
              {!isRunning && (
                <Play className="w-[40px] h-[40px] text-[#ffffff] fill-white" />
              )}
              {isRunning && cycleType === 'focus' && (
                <Crosshair className="w-[40px] h-[40px] text-[#ffffff]" />
              )}
              {isRunning && cycleType === 'break' && (
                <Coffee className="w-[40px] h-[40px] text-[#ffffff]" />
              )}
            </button>
            <button
              className="w-[60px] h-[60px] rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50"
              onClick={resetTimer}
            >
              <Square className="w-[30px] h-[30px]" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {plannedCycles.map((_, i) => (
              <div key={i} className="relative w-4 h-4">
                <div
                  className={`absolute inset-0 rounded-full border-2 ${
                    i <= currentCycleIndex
                      ? 'border-[#9747ff]'
                      : 'border-gray-200'
                  }`}
                ></div>
                {i < currentCycleIndex && (
                  <div className="absolute inset-0 rounded-full bg-[#9747ff] transform scale-75"></div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
