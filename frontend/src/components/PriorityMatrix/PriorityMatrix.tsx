import { useEffect, useState } from 'react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  Bell,
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  Settings,
} from 'lucide-react';

import { TaskDetailSidebar } from '@/components/PriorityMatrix/TaskDetailSidebar';
import { DragOverlayCard } from '@/components/PriorityMatrix/card/DragOverlayCard';
import { MobileMenu } from '@/components/PriorityMatrix/MobileMenu';
import { completedTasks, initialTasks } from '@/components/PriorityMatrix/data';
import { AllScheduleView } from '@/components/PriorityMatrix/AllScheduleView';
import { CompletedScheduleView } from '@/components/PriorityMatrix/CompletedScheduleView';
import { isWithinRange } from '@/utils/date';
import type { Task } from '@/types/task';

export default function PriorityMatrix() {
  const [tasks, setTasks] = useState(initialTasks);
  const [startDate, setStartDate] = useState(new Date());
  const [view, setView] = useState<'matrix' | 'board'>('matrix');
  const [selectedType, setSelectedType] = useState<'all' | 'Todo' | 'Thinking'>(
    'Thinking',
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('category');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('matrix');
  const [scheduleType, setScheduleType] = useState<'all' | 'completed'>('all');
  const [completedSelectedType, setCompletedSelectedType] = useState<
    'all' | 'Todo' | 'Thinking'
  >('Thinking');

  // 오늘 날짜부터 10 일 뒤까지 캘린더 범위 설정
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    return date;
  });

  const [completedSelectedCategory, setCompletedSelectedCategory] =
    useState<string>('category');

  // 로컬 스토리지에서 카테고리 불러오기
  useEffect(() => {
    const savedCategories = localStorage.getItem('taskCategories');
    if (savedCategories) {
      // FilterBar 컴포넌트에서 로컬 스토리지를 사용하도록 구현함
      console.log('카테고리', JSON.parse(savedCategories));
    }
  }, []);

  // 드래그 센서 설정하는 부분 5px 이상 움직여야 드래그로 인식
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const handleAddTask = (sectionId: string, newTask: Task) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [sectionId]: [...prevTasks[sectionId as keyof typeof prevTasks], newTask],
    }));
  };

  const getTaskSectionId = (taskId: string): string | undefined => {
    return Object.keys(tasks).find((sectionId) =>
      tasks[sectionId as keyof typeof tasks].some((task) => task.id === taskId),
    );
  };

  // 드래그 시작 지점에 어떤 작업을 현재 끌고 있는지 기록
  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event;
    const sectionId = getTaskSectionId(active.id.toString());
    if (sectionId) {
      const task = tasks[sectionId as keyof typeof tasks].find(
        (task) => task.id === active.id,
      );
      if (task) setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // 섹션 ID 확인
    const sourceSectionId = getTaskSectionId(activeId);

    // 드롭 대상이 섹션인지 아이템인지 확인
    const isOverSection = Object.keys(tasks).includes(overId);
    const targetSectionId = isOverSection ? overId : getTaskSectionId(overId);

    if (!sourceSectionId || !targetSectionId) return;

    // 같은 섹션 내에서의 순서 변경
    if (sourceSectionId === targetSectionId) {
      const sectionTasks = [...tasks[sourceSectionId as keyof typeof tasks]];
      const activeIndex = sectionTasks.findIndex(
        (task) => task.id === activeId,
      );

      if (activeIndex === -1) return;

      // 같은 아이템 위에 드롭한 경우 변경 없음
      if (activeId === overId) return;

      // 섹션 위에 드롭한 경우 맨 뒤로 이동
      if (isOverSection) {
        const newTasks = {
          ...tasks,
          [sourceSectionId]: [
            ...sectionTasks.filter((task) => task.id !== activeId),
            sectionTasks[activeIndex],
          ],
        };
        setTasks(newTasks);
        return;
      }

      // 다른 아이템 위에 드롭한 경우 해당 위치로 이동
      const overIndex = sectionTasks.findIndex((task) => task.id === overId);
      if (overIndex === -1) return;

      // 드래그한 아이템을 제거하고 새 위치에 삽입
      const newTasks = [...sectionTasks];
      const [movedItem] = newTasks.splice(activeIndex, 1);
      newTasks.splice(overIndex, 0, movedItem);

      setTasks({
        ...tasks,
        [sourceSectionId]: newTasks,
      });
    }

    // 다른 섹션으로 이동
    else {
      const sourceSection = [...tasks[sourceSectionId as keyof typeof tasks]];
      const targetSection = [...tasks[targetSectionId as keyof typeof tasks]];

      const taskIndex = sourceSection.findIndex((task) => task.id === activeId);
      if (taskIndex === -1) return;

      const draggedTask = sourceSection[taskIndex];

      // 원본 섹션에서 제거
      const newSourceSection = sourceSection.filter(
        (task) => task.id !== activeId,
      );

      // 타겟 섹션에 추가
      let newTargetSection;

      if (isOverSection) {
        // 섹션 자체에 드롭한 경우 맨 뒤에 추가
        newTargetSection = [...targetSection, draggedTask];
      } else {
        // 특정 아이템 위에 드롭한 경우
        const overIndex = targetSection.findIndex((task) => task.id === overId);
        if (overIndex === -1) {
          // 찾지 못한 경우 맨 뒤에 추가
          newTargetSection = [...targetSection, draggedTask];
        } else {
          // 찾은 경우 해당 위치에 삽입
          newTargetSection = [...targetSection];
          newTargetSection.splice(overIndex, 0, draggedTask);
        }
      }

      setTasks({
        ...tasks,
        [sourceSectionId]: newSourceSection,
        [targetSectionId]: newTargetSection,
      });
    }
  };

  // typescript 가 date 가 옵셔널인데도 date:string 으로 고정된 타입만 허용하는 union 타입으로 추론해서 에러 나는 상황
  // 즉 task 타입은 optional 로 처리되어 있지만 filtered 의 타입이 typeof tasks 여서 초기값 안의 일부 요소가 date 없이 구성되어 있는 걸 문제 삼고 있음
  const getFilteredTasks = () => {
    const filtered = {
      section1: [] as Task[], // 명시적 타입 캐스팅으로 일단 해결
      section2: [] as Task[],
      section3: [] as Task[],
      section4: [] as Task[],
    };

    Object.keys(tasks).forEach((sectionKey) => {
      const sectionTasks = tasks[sectionKey as keyof typeof tasks];
      filtered[sectionKey as keyof typeof tasks] = sectionTasks.filter(
        (task) => {
          const typeMatch =
            selectedType === 'all' || task.tags.type === selectedType;
          const categoryMatch =
            selectedCategory === 'all' ||
            task.tags.category === selectedCategory;
          const dateMatch = task.date
            ? isWithinRange(task.date, startDate, endDate)
            : true;
          return typeMatch && categoryMatch && dateMatch;
        },
      ) as Task[];
    });

    return filtered;
  };

  const getFilteredCompletedTasks = () => {
    return completedTasks.filter((task) => {
      const typeMatch =
        completedSelectedType === 'all' ||
        task.tags.type === completedSelectedType;
      const categoryMatch =
        completedSelectedCategory === 'all' ||
        task.tags.category === completedSelectedCategory;
      const dateMatch = task.date
        ? isWithinRange(task.date, startDate, endDate)
        : true;
      return typeMatch && categoryMatch && dateMatch;
    });
  };

  const filteredTasks = getFilteredTasks();
  const filteredCompletedTasks = getFilteredCompletedTasks();

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);
    setScheduleType(menu === 'completed' ? 'completed' : 'all');
  };

  const handleSaveTask = (updatedTask: Task) => {
    const sectionId = getTaskSectionId(updatedTask.id);
    // TODO : 코드 개선 필요 (타입에러)
    if (sectionId) {
      setTasks((prevTasks) => {
        const sectionTasks = [
          ...prevTasks[sectionId as keyof typeof prevTasks],
        ];
        const taskIndex = sectionTasks.findIndex(
          (task) => task.id === updatedTask.id,
        );

        if (taskIndex !== -1) {
          sectionTasks[taskIndex] = {
            ...updatedTask,
            tags: {
              type: updatedTask.tags.type,
              category: updatedTask.tags.category ?? '',
            },
          } as (typeof sectionTasks)[number];

          return {
            ...prevTasks,
            [sectionId]: sectionTasks,
          };
        }

        return prevTasks;
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    // 삭제할 작업이 어느 섹션에 있는지 찾기
    const sectionId = getTaskSectionId(taskId);

    if (sectionId) {
      // 해당 섹션에서 작업 제거
      setTasks((prevTasks) => {
        const sectionTasks = prevTasks[
          sectionId as keyof typeof prevTasks
        ].filter((task) => task.id !== taskId);

        return {
          ...prevTasks,
          [sectionId]: sectionTasks,
        };
      });

      // 사이드바 닫기 및 선택된 작업 초기화
      setIsSidebarOpen(false);
      setSelectedTask(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={(args) => {
        // 충돌 감지 추가
        const pointerCollisions = pointerWithin(args);
        const rectCollisions = rectIntersection(args);
        const allCollisions = [...pointerCollisions, ...rectCollisions];

        // 중복 제거
        return allCollisions.filter(
          (collision, index, self) =>
            self.findIndex((c) => c.id === collision.id) === index,
        );
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-[#e5e5e5] flex items-center px-4 justify-between">
            <div className="flex items-center">
              {/*모바일일 때만 나타남*/}
              <MobileMenu
                activeMenu={activeMenu}
                onMenuChange={handleMenuChange}
              />

              <div className="w-[200px] md:w-[400px] ml-6 hidden md:block">
                <div className="bg-[#f2f2f2] rounded-full px-4 py-2 flex items-center">
                  <Search className="w-4 h-4 text-[#6e726e] mr-2" />
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="bg-transparent border-none outline-none text-sm w-full"
                  />
                </div>
              </div>
            </div>
            {/*임시 헤더 */}
            <div className="flex items-center">
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#f2f2f2]">
                <Settings className="w-5 h-5 text-[#6e726e]" />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#f2f2f2]">
                <Bell className="w-5 h-5 text-[#6e726e]" />
              </button>
              <div className="ml-2 flex items-center">
                <div className="text-xs text-right mr-2 hidden md:block">
                  <div>Anima Agrawal</div>
                  <div className="text-[#6e726e]">user@naver.com</div>
                </div>
                {/*프로필 사진 영역*/}
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="relative">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsHeaderDropdownOpen(!isHeaderDropdownOpen)}
              >
                <h1 className="text-xl md:text-2xl font-bold">
                  {scheduleType === 'all' ? '모든 일정' : '완료된 일정'}
                </h1>
                <ChevronDown className="ml-2 w-5 h-5" />
              </div>
              {isHeaderDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#e5e5e5] rounded-md shadow-md z-10">
                  <div
                    className="px-4 py-2 text-sm hover:bg-[#f5f1ff] cursor-pointer flex items-center"
                    onClick={() => {
                      setScheduleType('all');
                      setIsHeaderDropdownOpen(false);
                    }}
                  >
                    {scheduleType === 'all' && (
                      <div className="w-1 h-4 mr-2 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                    <span>모든 일정</span>
                  </div>
                  <div
                    className="px-4 py-2 text-sm hover:bg-[#f5f1ff] cursor-pointer flex items-center"
                    onClick={() => {
                      setScheduleType('completed');
                      setIsHeaderDropdownOpen(false);
                    }}
                  >
                    {scheduleType === 'completed' && (
                      <div className="w-1 h-4 mr-2 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                    <span>완료된 일정</span>
                  </div>
                </div>
              )}
              <p className="text-xs md:text-sm text-[#6e726e] mt-1">
                {scheduleType === 'all'
                  ? '중요도와 긴급도에 따라 정리하고, 우선순위를 정해 실행해보세요!'
                  : '완료된 일정을 확인하고, 필요하면 다시 실행할 수 있어요!'}
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <button
                  className={`cursor-pointer flex items-center justify-center border border-[#e5e5e5] rounded-l-md px-2 md:px-3 py-1.5 ${view === 'matrix' ? 'bg-[#8d5cf6] text-white' : 'bg-white'}`}
                  onClick={() => setView('matrix')}
                >
                  <LayoutGrid className="w-4 h-4 mr-0 md:mr-1" />
                  <span className="hidden md:inline text-sm">매트릭스</span>
                </button>
                <button
                  className={`cursor-pointer flex items-center justify-center border border-[#e5e5e5] rounded-r-md px-2 md:px-3 py-1.5 ${view === 'board' ? 'bg-[#8d5cf6] text-white' : 'bg-white'}`}
                  onClick={() => setView('board')}
                >
                  <List className="w-4 h-4 mr-0 md:mr-1" />
                  <span className="hidden md:inline text-sm">보드</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1  px-3 md:px-6 pb-6 overflow-auto">
            {scheduleType === 'all' ? (
              <AllScheduleView
                tasks={filteredTasks}
                view={view}
                selectedType={selectedType}
                selectedCategory={selectedCategory}
                startDate={startDate}
                endDate={endDate}
                onTypeChange={setSelectedType}
                onCategoryChange={setSelectedCategory}
                onDateChange={handleDateChange}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
              />
            ) : (
              <CompletedScheduleView
                tasks={filteredCompletedTasks}
                selectedType={completedSelectedType}
                selectedCategory={completedSelectedCategory}
                startDate={startDate}
                endDate={endDate}
                onTypeChange={setCompletedSelectedType}
                onCategoryChange={setCompletedSelectedCategory}
                onDateChange={handleDateChange}
                onTaskClick={handleTaskClick}
              />
            )}
          </div>
        </div>

        <TaskDetailSidebar
          task={selectedTask}
          onClose={handleCloseSidebar}
          isOpen={isSidebarOpen}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />

        <DragOverlay>
          {activeTask ? (
            <DragOverlayCard
              title={activeTask.title}
              memo={activeTask.memo || ''}
              date={activeTask.date}
              tags={activeTask.tags}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
