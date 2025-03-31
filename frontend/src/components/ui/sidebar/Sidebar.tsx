'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Network,
  ListTodo,
  LayoutDashboard,
  Timer,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Link2,
  Shuffle
} from 'lucide-react'

import MindmapCard from '@/components/ui/sidebar/MindmapCard.tsx';

// 좌측 메뉴
const navItems = [
  { id: 'today-list', icon: <LayoutDashboard size={18} />, label: '오늘의 할 일' },
  { id: 'matrix', icon: <ListTodo size={18} />, label: '매트릭스' },
  { id: 'mindmap', icon: <Network size={18} />, label: '마인드맵' },
  { id: 'pomodoro', icon: <Timer size={18} />, label: '뽀모도로' }
]

export default function MainLayout() {
  const [activeId, setActiveId] = useState<string | null>('mindmap')
  const [accordionOpen, setAccordionOpen] = useState({
    connected: false,
    free: true
  })
  const [panelVisible, setPanelVisible] = useState(true)


  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const handleCardSelect = (id: string) => {
    setSelectedCardId(prev => (prev === id ? null : id))
  }

  const handleNavClick = (id: string) => {
    if (activeId === id) {
      setActiveId(null)
      setPanelVisible(false)
    } else {
      setActiveId(id)
      setPanelVisible(true)
    }
  }

  const renderPanel = () => {
    if (!panelVisible || !activeId) return null

    const commonWrapper = (children: React.ReactNode) => (
      <div className="relative w-[300px] border-r p-4 bg-white h-full overflow-y-auto">
        {/* 접기 버튼 */}
        {children}
      </div>
    )

    switch (activeId) {
      case 'mindmap':
        return commonWrapper(
          <>
            <div className="flex justify-between">
              <h2 className="font-bold text-lg mb-4">마인드맵</h2>
              <button
                onClick={() => setPanelVisible(false)}
                className="top-4 z-10 w-8 h-8 flex items-center justify-center"
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            {/* 연결된 마인드맵 */}
            <div>
              <button
                className="flex items-center w-full justify-between text-left font-semibold mb-2"
                onClick={() =>
                  setAccordionOpen(prev => ({ ...prev, connected: !prev.connected }))
                }
              >
                <span className="flex items-center gap-2">
                  <Link2 size={16} /> 연결된 마인드맵
                </span>
                {accordionOpen.connected ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {accordionOpen.connected && (

                <div className="space-y-4">
                  <MindmapCard
                    title="개인 계획"
                    selected={selectedCardId === 'card-1'}
                    onClick={() => handleCardSelect('card-1')}
                  />

                  <MindmapCard
                    title="정리하기"
                    selected={selectedCardId === 'card-2'}
                    onClick={() => handleCardSelect('card-2')}
                  />
                </div>

              )}
            </div>

            {/* 자유로운 마인드맵 */}
            <div className="mt-6">
              <button
                className="flex items-center w-full justify-between text-left font-semibold mb-2"
                onClick={() =>
                  setAccordionOpen(prev => ({ ...prev, free: !prev.free }))
                }
              >
                <span className="flex items-center gap-2">
                  <Shuffle size={16} /> 자유로운 마인드맵
                </span>
                {accordionOpen.free ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {accordionOpen.free && (
                <div className="space-y-4">
                  <MindmapCard
                    title="개인 계획"
                    selected={selectedCardId === '3'}
                    onClick={() => handleCardSelect('3')}
                  />
                  <MindmapCard
                    title="정리하기"
                    selected={selectedCardId === '4'}
                    onClick={() => handleCardSelect('4')}
                  />
                  <MindmapCard
                    title="생각입니다"
                    status="Thinking"
                    selected={selectedCardId === '5'}
                    onClick={() => handleCardSelect('5')}
                  />
                </div>
              )}
            </div>
          </>
        )

      case 'today-list':
        return commonWrapper(
          <>
            <div className="flex justify-between">
              <h2 className="font-bold text-lg mb-4">오늘의 할 일</h2>
              <button
                onClick={() => setPanelVisible(false)}
                className="top-4 z-10 w-8 h-8 flex items-center justify-center"
              >
                <ChevronLeft size={16} />
              </button>

            </div>
            <p className="text-sm text-muted-foreground">할 일 항목이 여기에 표시됩니다.</p>

          </>
        )

      case 'matrix':
        return commonWrapper(
          <>
            <div className="flex justify-between">
              <h2 className="font-bold text-lg mb-4">매트릭스</h2>
              <button
                onClick={() => setPanelVisible(false)}
                className="top-4 z-10 w-8 h-8 flex items-center justify-center"
              >
                <ChevronLeft size={16} />
              </button>

            </div>
            <p className="text-sm text-muted-foreground">매트릭스 항목이 여기에 표시됩니다.</p>
          </>
        );

      case 'pomodoro':
        return commonWrapper(
          <>
            <div className="flex justify-between">
              <h2 className="font-bold text-lg mb-4">뽀모도로</h2>
              <button
                onClick={() => setPanelVisible(false)}
                className="top-4 z-10 w-8 h-8 flex items-center justify-center"
              >
                <ChevronLeft size={16} />
              </button>

            </div>
            <p className="text-sm text-muted-foreground">타이머 및 기록 기능이 여기에 표시됩니다.</p>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <aside className="w-[250px] bg-white border-r px-4 py-6">
        {/* 로고 */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">★</span>
          </div>
          <span className="text-lg font-semibold">Flowin</span>
        </div>

        {/* 메뉴 */}
        <div className="overflow-hidden">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'flex items-center w-full px-4 py-3 text-sm gap-2 text-left transition rounded-md',
                activeId === item.id
                  ? 'bg-[#8F5AFF] text-white font-semibold'
                  : 'text-black hover:bg-gray-50',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* 우측 메뉴 패널 */}
      {renderPanel()}

      {/* 콘텐츠 영역 */}
      <div className="flex-1 bg-gray-50 p-8">

      </div>
    </div>
  )
}

