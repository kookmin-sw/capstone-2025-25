import { Bell, Search, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="px-10 py-5 h-[84px] flex items-center justify-between border-b">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full bg-[#f2f2f2] rounded-full py-[10px] pl-10 pr-4 text-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-[30px]">
        <button className="cursor-pointer">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
        <button className="cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <div className="h-5 border-l border-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className="text-xs">
            <div>Anima Agrawal</div>
            <div className="text-gray-500">user@naver.com</div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer">
            <img
              src="https://placehold.co/400"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
