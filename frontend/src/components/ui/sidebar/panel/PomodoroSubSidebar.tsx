import { LinkIcon, Unlink, Plus } from 'lucide-react';
import { SubSidebarAccordion } from '@/components/ui/SubSidebarAccordion.tsx';
import CommonSubSidebarWrapper from './CommonSubSidebarWrapper';
import { PomodoroItem } from '@/components/ui/pomodoro/PomodoroItem.tsx';
import type { PomodoroList } from '@/types/pomodoro';
import AddPomodoro from '@/components/ui/Modal/AddPomodoro.tsx';
import { useNavigate, useParams } from 'react-router';

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

export default function PomodoroSubSidebar() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const pomodoroClick = (id: number) => {
    navigate(`/pomodoro/${id}`);
  };

  return (
    <CommonSubSidebarWrapper
      title="뽀모도로"
      addButton={
        <AddPomodoro trigger={<Plus size={24} className="cursor-pointer" />} />
      }
    >
      <div>
        <SubSidebarAccordion
          value="linked"
          icon={<LinkIcon className="w-4 h-4" />}
          title="연결된 뽀모도로"
        >
          {response.linkedPomodoros?.map((item) => (
            <PomodoroItem
              key={item.pomodoro.id}
              item={item}
              selected={item.pomodoro.id === Number(id)}
              onClick={() => pomodoroClick(item.pomodoro.id)}
            />
          ))}
        </SubSidebarAccordion>
        <SubSidebarAccordion
          value="unlinked"
          icon={<Unlink className="w-4 h-4" />}
          title="자유로운 뽀모도로"
        >
          {response.unlinkedPomodoros?.map((item) => (
            <PomodoroItem
              key={item.pomodoro.id}
              item={item}
              selected={item.pomodoro.id === Number(id)}
              onClick={() => pomodoroClick(item.pomodoro.id)}
            />
          ))}
        </SubSidebarAccordion>
      </div>
    </CommonSubSidebarWrapper>
  );
}
