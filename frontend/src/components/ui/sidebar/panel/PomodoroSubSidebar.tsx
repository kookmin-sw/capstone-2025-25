import { LinkIcon, Unlink, Plus } from 'lucide-react';
import { SubSidebarAccordion } from '@/components/ui/SubSidebarAccordion.tsx';
import CommonPanelWrapper from './CommonPanelWrapper';
import { PomodoroItem } from '@/components/ui/PomodoroItem';
import type { PomodoroResponse } from '@/types/pomodoro';
import AddFreePomodoro from '@/components/ui/Modal/AddFreePomodoro.tsx';

// 예시 데이터
const response: PomodoroResponse = {
  statusCode: 200,
  error: null,
  content: {
    unlinkedPomodoros: [
      {
        pomodoro: {
          id: 1,
          title: '개발하기',
          createdAt: '2025-04-04T19:43:39.359437',
          completedAt: '2025-04-04T19:46:58.644763',
          totalPlannedTime: '00:40:00',
          totalExecutedTime: '01:30:00',
          totalWorkingTime: '01:20:00',
          totalBreakTime: '00:10:00',
          plannedCycles: [
            {
              workDuration: 25,
              breakDuration: 5,
            },
            {
              workDuration: 25,
              breakDuration: 5,
            },
            {
              workDuration: 25,
              breakDuration: 5,
            },
            {
              workDuration: 25,
              breakDuration: null,
            },
          ],
          executedCycles: [
            {
              workDuration: 30,
              breakDuration: 5,
            },
            {
              workDuration: 25,
              breakDuration: 5,
            },
            {
              workDuration: 25,
              breakDuration: null,
            },
          ],
        },
        eisenhower: null,
      },
    ],
    linkedPomodoros: [
      {
        pomodoro: {
          id: 2,
          title: '링크 뽀모도로',
          createdAt: '2025-04-04T19:43:41.849539',
          completedAt: null,
          totalPlannedTime: '00:50:00',
          totalExecutedTime: null,
          totalWorkingTime: null,
          totalBreakTime: null,
          plannedCycles: [
            {
              workDuration: 25,
              breakDuration: 5,
            },
            {
              workDuration: 25,
              breakDuration: 5,
            },
            {
              workDuration: 25,
              breakDuration: 5,
            },
            {
              workDuration: 25,
              breakDuration: null,
            },
          ],
          executedCycles: null,
        },
        eisenhower: {
          id: 1,
          title: '링크된 투두',
        },
      },
    ],
  },
};

export default function PomodoroSubSidebar({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <CommonPanelWrapper
      title="뽀모도로"
      onClose={onClose}
      addButton={<AddFreePomodoro />}
    >
      <div>
        <SubSidebarAccordion
          value="linked"
          icon={<LinkIcon className="w-4 h-4" />}
          title="연결된 뽀모도로"
        >
          {response.content.linkedPomodoros.map((item) => (
            <PomodoroItem
              key={item.pomodoro.id}
              title={item.pomodoro.title}
              time={item.pomodoro.totalExecutedTime ?? '00:00:00'}
              selected={true}
              eisenhower={item.eisenhower}
            />
          ))}
        </SubSidebarAccordion>

        <SubSidebarAccordion
          value="unlinked"
          icon={<Unlink className="w-4 h-4" />}
          title="자유로운 뽀모도로"
        >
          {response.content.unlinkedPomodoros.map((item) => (
            <PomodoroItem
              key={item.pomodoro.id}
              title={item.pomodoro.title}
              time={item.pomodoro.totalExecutedTime ?? '00:00:00'}
              eisenhower={item.eisenhower}
            />
          ))}
        </SubSidebarAccordion>
      </div>
    </CommonPanelWrapper>
  );
}
