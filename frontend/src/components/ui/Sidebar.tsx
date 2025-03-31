'use client'

import { useState } from "react"
import MindMapIcon  from "../../assets/sidebar/mindmap.svg"
import CheckListIcon from '../../assets/sidebar/mindmap.svg'
import DashboardIcon from '../../assets/sidebar/mindmap.svg'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from 'lucide-react';

const items = [
  { id: "mindmap", icon: <MindMapIcon />, label: "마인드맵" },
  { id: "check-list", icon: <CheckListIcon  />, label: "투두리스트" },
  { id: "dashboard", icon: <DashboardIcon  />, label: "ㄷㅐ시보드" },
  // { id: "grid", icon: <Grid3X3 size={20} />, label: "그리드" },
]

export default function Sidebar() {
  const [activeId, setActiveId] = useState<string | null>("calendar")
  const [isExpanded, setIsExpanded] = useState(true)

  const handleToggle = () => {
    setIsExpanded(prev => !prev)
  }

  const handleItemClick = (id: string) => {
    if (activeId === id) {
      // 같은 아이콘 누르면 닫기
      setActiveId(null)
    } else {
      // 다른 아이콘 누르면 열기 + 확장도 켜기
      setActiveId(id)
      setIsExpanded(true)
    }
  }

  return (
    <div className="flex h-screen">
      {/* 왼쪽 아이콘 사이드바 */}
      <aside className="w-16 border-r bg-white flex flex-col items-center py-4 justify-between">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 bg-black rounded-full mb-4" />
          {items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-md w-10 h-10",
                activeId === item.id && "bg-muted"
              )}
              onClick={() => handleItemClick(item.id)}
            >
              {item.icon}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-md w-10 h-10 mt-4"
          onClick={handleToggle}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </aside>

      {activeId && isExpanded && (
        <aside className="w-64 bg-muted/40 border-r p-4 transition-all">
          <h2 className="font-semibold mb-4">
            📂 {items.find(i => i.id === activeId)?.label}
          </h2>
          <ul className="space-y-2">
            <li>세부 항목 1</li>
            <li>세부 항목 2</li>
            <li>세부 항목 3</li>
          </ul>
        </aside>
      )}
    </div>
  )
}