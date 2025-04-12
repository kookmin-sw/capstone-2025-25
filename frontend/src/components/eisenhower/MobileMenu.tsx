"use client"

import { useState } from "react"
import { Menu, X, Grid2x2, LayoutGrid, BrainCircuit, Clock, CheckCircle } from "lucide-react"

type MobileMenuProps = {
  activeMenu: string
  onMenuChange: (menu: string) => void
}

export function MobileMenu({ activeMenu, onMenuChange }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleMenuClick = (menu: string) => {
    onMenuChange(menu)
    setIsOpen(false)
  }

  return (
    <div className="md:hidden">
      <button className="p-2 rounded-md hover:bg-[#f5f1ff]" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="p-4 flex justify-between items-center border-b border-[#e5e5e5]">
              <div className="flex items-center">
                <div className="bg-black rounded-md p-1 mr-2">
                  <div className="w-5 h-5 bg-white rounded-sm"></div>
                </div>
                <span className="font-semibold">Flowin</span>
              </div>
              <button className="p-2 rounded-md hover:bg-[#f5f1ff]" onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <div
                className={`px-4 py-4 flex items-center text-sm ${activeMenu === "today" ? "bg-[#8d5cf6] text-white" : "hover:bg-[#f2f2f2]"} cursor-pointer`}
                onClick={() => handleMenuClick("today")}
              >
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <Grid2x2 className="w-4 h-4" />
                </div>
                <span>오늘의 할 일</span>
              </div>

              <div
                className={`px-4 py-4 flex items-center text-sm ${activeMenu === "matrix" ? "bg-[#8d5cf6] text-white" : "hover:bg-[#f2f2f2]"} cursor-pointer`}
                onClick={() => handleMenuClick("matrix")}
              >
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <span>매트릭스</span>
              </div>

              <div
                className={`px-4 py-4 flex items-center text-sm ${activeMenu === "mindmap" ? "bg-[#8d5cf6] text-white" : "hover:bg-[#f2f2f2]"} cursor-pointer`}
                onClick={() => handleMenuClick("mindmap")}
              >
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <span>마인드맵</span>
              </div>

              <div
                className={`px-4 py-4 flex items-center text-sm ${activeMenu === "pomodoro" ? "bg-[#8d5cf6] text-white" : "hover:bg-[#f2f2f2]"} cursor-pointer`}
                onClick={() => handleMenuClick("pomodoro")}
              >
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span>뽀모도로</span>
              </div>

              <div
                className={`px-4 py-4 flex items-center text-sm ${activeMenu === "completed" ? "bg-[#8d5cf6] text-white" : "hover:bg-[#f2f2f2]"} cursor-pointer`}
                onClick={() => handleMenuClick("completed")}
              >
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span>완료된 일정</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
