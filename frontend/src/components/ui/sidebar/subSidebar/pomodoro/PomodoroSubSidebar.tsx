import { LinkIcon, Unlink, Plus } from 'lucide-react';
import { SubSidebarAccordion } from '@/components/ui/SubSidebarAccordion.tsx';
import CommonSubSidebarWrapper from '../CommonSubSidebarWrapper';
import { PomodoroItem } from '@/components/ui/pomodoro/PomodoroItem.tsx';
import AddPomodoro from '@/components/ui/Modal/AddPomodoro.tsx';
import { useParams } from 'react-router';
import { usePomodoros } from '@/store/pomodoro';

export default function PomodoroSubSidebar() {
  const { id } = useParams<{ id: string }>();

  const pomodoros = usePomodoros();

  return (
    <CommonSubSidebarWrapper
      title="뽀모도로"
      addButton={
        <AddPomodoro trigger={<Plus size={22} className="cursor-pointer" />} />
      }
    >
      <div>
        <SubSidebarAccordion
          value="linked"
          icon={<LinkIcon className="w-4 h-4" />}
          title="연결된 뽀모도로"
        >
          {pomodoros.linkedPomodoros?.map((item) => (
            <PomodoroItem
              key={item.pomodoro.id}
              item={item}
              selected={item.pomodoro.id === Number(id)}
            />
          ))}
        </SubSidebarAccordion>
        <SubSidebarAccordion
          value="unlinked"
          icon={<Unlink className="w-4 h-4" />}
          title="자유로운 뽀모도로"
        >
          {pomodoros.unlinkedPomodoros?.map((item) => (
            <PomodoroItem
              key={item.pomodoro.id}
              item={item}
              selected={item.pomodoro.id === Number(id)}
            />
          ))}
        </SubSidebarAccordion>
      </div>
    </CommonSubSidebarWrapper>
  );
}
