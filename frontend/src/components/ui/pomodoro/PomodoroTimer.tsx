import { useState, useEffect, useRef } from 'react';
import { X, Play, CirclePause, Coffee, Square, Crosshair } from 'lucide-react';
import { Mode, PomodoroCycle, Eisenhower } from '@/types/pomodoro.ts';
import EndPomodoro from '@/components/ui/Modal/EndPomodoro.tsx';

type PomodoroTimerProps = {
  eisenhower: Eisenhower | null;
  plannedCycles: PomodoroCycle[];
};

export function PomodoroTimer({
  plannedCycles,
  eisenhower,
}: PomodoroTimerProps) {
  // 사이클 = 집중 + 휴식
  const [elapsedTime, setElapsedTime] = useState(0); // 현재 모드의 진행 시간
  const [totalTime, setTotalTime] = useState(0); //전체 진행 시간
  const [isRunning, setIsRunning] = useState(false); // 타이머 실행
  const [cycleMode, setCycleMode] = useState<Mode>('WORK'); //현재 진행 사이클 모드
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0); //현재 사이클 인덱스
  const [pomodoroResult, setPomodoroResult] = useState<PomodoroCycle[]>([]);
  const [previewResult, setPreviewResult] = useState<PomodoroCycle[]>([]); // 임시 결과 (모달)

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const TOTAL_CYCLES = plannedCycles.length;
  const currentCycle = plannedCycles[currentCycleIndex];
  const CYCLE_TIME =
    cycleMode === 'WORK'
      ? currentCycle.workDuration * 60
      : (currentCycle.breakDuration || 0) * 60;

  // 타이머 화면 구성
  const calculateProgress = () => (elapsedTime / CYCLE_TIME) * 100; //원 채우기 비율 계산

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  // 동작 관련
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
        setTotalTime((prevTotal) => prevTotal + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const resetTimer = () => {
    setIsRunning(false);
    setCycleMode('WORK');
    setElapsedTime(0);
    setTotalTime(0);
    setCurrentCycleIndex(0);
    setPomodoroResult([]);
  };

  const startTimer = () => setIsRunning(!isRunning);

  // 모드 변경
  const changeMode = () => {
    saveElapsedTime();
    if (cycleMode === 'WORK') {
      if (!currentCycle.breakDuration) {
        moveToNextCycle();
      } else {
        setCycleMode('BREAK');
        setElapsedTime(0);
      }
    } else {
      moveToNextCycle();
    }
  };

  // 모드 변경 시 현재 진행값 저장
  const saveElapsedTime = () => {
    const minutes = elapsedTime / 60;

    setPomodoroResult((prev) => {
      if (!prev) prev = [];

      const updated = [...prev];

      if (cycleMode === 'WORK') {
        updated.push({
          workDuration: minutes,
          breakDuration: 0,
        });
      } else if (cycleMode === 'BREAK' && updated.length > 0) {
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = {
          ...last,
          breakDuration: minutes,
        };
      }

      return updated;
    });
  };

  const moveToNextCycle = () => {
    if (currentCycleIndex < TOTAL_CYCLES - 1) {
      setCurrentCycleIndex((prev) => prev + 1);
      setCycleMode('WORK');
      setElapsedTime(0);
    } else {
      finishPomodoro();
    }
  };
  // 중지 버튼
  const finishPomodoro = () => {
    const minutes = elapsedTime / 60;
    const tempResult = [...pomodoroResult];

    if (cycleMode === 'WORK') {
      tempResult.push({
        workDuration: minutes,
        breakDuration: 0,
      });
    } else if (cycleMode === 'BREAK' && tempResult.length > 0) {
      const last = tempResult[tempResult.length - 1];
      tempResult[tempResult.length - 1] = {
        ...last,
        breakDuration: minutes,
      };
    }
    setPreviewResult(tempResult);
    setIsRunning(false);
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
              {!isRunning && <CirclePause className="w-[30px] h-[30px]" />}
              {isRunning && cycleMode === 'WORK' && (
                <Crosshair className="w-[30px] h-[30px]" />
              )}
              {isRunning && cycleMode === 'BREAK' && (
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
            className="w-[60px] h-[60px] rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
            onClick={resetTimer}
          >
            <X className="w-[30px] h-[30px]" />
          </button>
          <button
            className={`w-[85px] h-[85px] rounded-full flex items-center justify-center bg-[#9747ff] cursor-pointer hover:bg-[#7e3fd4]
              }`}
            onClick={isRunning ? changeMode : startTimer}
          >
            {!isRunning && (
              <Play className="w-[40px] h-[40px] text-[#ffffff] fill-white" />
            )}
            {isRunning && cycleMode === 'WORK' && (
              <Crosshair className="w-[40px] h-[40px] text-[#ffffff]" />
            )}
            {isRunning && cycleMode === 'BREAK' && (
              <Coffee className="w-[40px] h-[40px] text-[#ffffff]" />
            )}
          </button>
          <EndPomodoro
            trigger={
              <button
                className="w-[60px] h-[60px] rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                onClick={finishPomodoro}
              >
                <Square className="w-[30px] h-[30px]" />
              </button>
            }
            cycles={previewResult}
            eisenhower={eisenhower}
            handleContinue={() => {
              setIsRunning(true);
            }}
          />
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
    </div>
  );
}
