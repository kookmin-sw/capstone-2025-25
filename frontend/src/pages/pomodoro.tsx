import { PomodoroTimer } from '@/components/ui/pomodoro/PomodoroTimer.tsx';
import PomodoroResult from '@/components/ui/pomodoro/PomodoroResult.tsx';
import { LinkedUnlinkedPomodoro } from '@/types/pomodoro';
import { useParams, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { usePomodoros } from '@/store/pomodoro';
import { TaskCard } from '@/components/eisenhower/card/TaskCard.tsx';

export default function Pomodoro() {
  const { id } = useParams();
  const navigate = useNavigate();

  const pomodoros = usePomodoros();
  const { linkedPomodoros, unlinkedPomodoros } = pomodoros;

  // 예시 데이터 선택. api 연결 후 수정
  const allPomodoros: LinkedUnlinkedPomodoro[] = [
    ...(linkedPomodoros ?? []),
    ...(unlinkedPomodoros ?? []),
  ];
  // id에 따른 예시 데이터
  const data = id
    ? (allPomodoros.find((item) => item.pomodoro.id === Number(id)) ?? null)
    : null;

  useEffect(() => {
    if (!data) {
      const pomodoroIdToShow =
        linkedPomodoros?.[0]?.pomodoro.id ||
        unlinkedPomodoros?.[0]?.pomodoro.id;
      if (pomodoroIdToShow) {
        navigate(`/pomodoro/${pomodoroIdToShow}`);
        return;
      }
      // 아무것도 없을 때 화면 필요
      console.log('표시할 뽀모도로가 없습니다.');
    }
  }, [id, data, linkedPomodoros, unlinkedPomodoros, navigate]);
  return (
    <div className="flex min-h-screen bg-white p-[30px]">
      <div className="flex-1">
        <main className="flex flex-col gap-[30px]">
          <div className="flex-1 flex-col gap-[30px]">
            <h1 className="text-[32px] font-semibold">뽀모도로 실행</h1>
            <p className="text-[16px] font-normal">
              성장한 뽀모도로 시간에 맞춰 집중과 휴식을 진행해보세요!
              <br />
              집중 또는 휴식이 끝나면 종지 버튼을 눌러 주세요
            </p>
          </div>

          <div className="flex flex-col items-center gap-[30px]">
            {data?.eisenhower ? (
                <TaskCard task={data?.eisenhower} className='hover:shadow-none cursor-default'/>
            ) : null}
            {data?.pomodoro?.executedCycles?.length ? (
              <PomodoroResult linkedUnlinkedPomodoro={data} />
            ) : data?.pomodoro?.plannedCycles?.length ? (
              <PomodoroTimer
                eisenhower={data?.eisenhower}
                plannedCycles={data.pomodoro.plannedCycles}
              />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
