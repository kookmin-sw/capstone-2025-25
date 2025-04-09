import { Search, Settings, Bell } from 'lucide-react';
import { PomodoroTimer } from '@/components/ui/PomodoroTimer';
import PomodoroResult from '@/components/ui/PomodoroResult';
import { LinkedUnlinkedPomodoro, PomodoroList } from '@/types/pomodoro';
import { useParams, useNavigate } from 'react-router';
import { useEffect } from 'react';

// 예시 데이터
const response: PomodoroList = {
  linkedPomodoros: [
    {
      pomodoro: {
        id: 1,
        title: '개발하기',
        createdAt: '2025-04-04T19:43:39.359437',
        completedAt: '2025-04-04T19:46:58.644763',
        totalPlannedTime: {
          hour: 1,
          minute: 55,
          second: 0,
          nano: 0,
        },
        totalExecutedTime: {
          hour: 1,
          minute: 30,
          second: 0,
          nano: 0,
        },
        totalWorkingTime: {
          hour: 0,
          minute: 0,
          second: 0,
          nano: 0,
        },
        totalBreakTime: {
          hour: 0,
          minute: 0,
          second: 0,
          nano: 0,
        },
        plannedCycles: [
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 0 },
        ],
        executedCycles: [
          { workDuration: 30, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 0 },
        ],
      },
      eisenhower: {
        id: 1,
        title: '개발 프로젝트',
        memo: '깃헙에 푸시해야 함',
        dueDate: '2025-04-10',
        quadrant: 'Q1',
        type: 'TODO',
        order: 1,
        isCompleted: false,
        createdAt: '2025-04-04T19:40:00',
      },
    },
  ],

  unlinkedPomodoros: [
    {
      pomodoro: {
        id: 2,
        title: '자유',
        createdAt: '2025-04-04T19:43:41.849539',
        completedAt: '2025-04-05T09:00:00',
        totalPlannedTime: {
          hour: 1,
          minute: 55,
          second: 0,
          nano: 0,
        },
        totalExecutedTime: {
          hour: 0,
          minute: 0,
          second: 0,
          nano: 0,
        },
        totalWorkingTime: {
          hour: 0,
          minute: 0,
          second: 0,
          nano: 0,
        },
        totalBreakTime: {
          hour: 0,
          minute: 0,
          second: 0,
          nano: 0,
        },
        plannedCycles: [
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 0 },
        ],
        executedCycles: [],
      },
      eisenhower: null,
    },
  ],
};

export default function Pomodoro() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 예시 데이터 선택. api 연결 후 수정
  const allPomodoros: LinkedUnlinkedPomodoro[] = [
    ...(response.linkedPomodoros ?? []),
    ...(response.unlinkedPomodoros ?? []),
  ];

  const data = id
    ? (allPomodoros.find((item) => item.pomodoro.id === Number(id)) ?? null)
    : null;

  // 존재하지 않는 id로 접근했거나, id 없이 접근했을 경우 → 리다이렉트
  useEffect(() => {
    if (!id || !data) {
      if (allPomodoros.length > 0) {
        navigate(`/pomodoro/${allPomodoros[0].pomodoro.id}`, { replace: true });
      }
    }
  }, [id, data, allPomodoros, navigate]);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        {/*헤더 컴포넌트로 교체하기*/}
        <header className="p-4 flex items-center justify-between border-b">
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="w-full bg-[#f2f2f2] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="text-right text-xs">
                <div>Anima Agrawal</div>
                <div className="text-gray-500">user@naver.com</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#8d5cf6] flex items-center justify-center text-white">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2025__EC_BA_A1_EC_8A_A4_ED_86_A4-lGSmjOdO4oCUnJig32lAVPeWcCJRl8.png"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="px-[40px] py-[50px] flex flex-col gap-[50px]">
          <div className="flex-1 flex-col gap-[25px]">
            <h1 className="text-[40px] font-semibold">뽀모도로 실행</h1>
            <p className="text-[16px] font-normal">
              성장한 뽀모도로 시간에 맞춰 집중과 휴식을 진행해보세요!
              <br />
              집중 또는 휴식이 끝나면 종지 버튼을 눌러 주세요
            </p>
          </div>

          <div className="flex flex-col items-center gap-[30px]">
            {/*컴포넌트로 교체*/}
            {data?.eisenhower ? (
              <div className="h-[153px] w-full border"></div>
            ) : null}
            {data?.pomodoro?.executedCycles?.length ? (
              <PomodoroResult linkedUnlinkedPomodoro={data} />
            ) : data?.pomodoro?.plannedCycles?.length ? (
              <PomodoroTimer eisenhower={data?.eisenhower} plannedCycles={data.pomodoro.plannedCycles} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
