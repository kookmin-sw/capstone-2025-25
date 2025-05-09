import { Skeleton } from '@/components/ui/skeleton';

export function MindmapSkeleton() {
  return (
    <div className="w-full h-[calc(100vh-88px)] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-[#F0F0F5]">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-12 relative overflow-hidden border border-blue-100">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-50 opacity-50"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-blue-50 opacity-50"></div>
        <div className="absolute top-[15%] left-[8%] z-0 transform rotate-1">
          <Skeleton className="w-[130px] h-[35px] bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg" />
        </div>
        <div className="absolute top-[28%] right-[12%] z-0 transform -rotate-1">
          <Skeleton className="w-[180px] h-[40px] bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg" />
        </div>
        <div className="absolute bottom-[28%] left-[15%] z-0 transform rotate-1">
          <Skeleton className="w-[160px] h-[38px] bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg" />
        </div>
        <div className="absolute bottom-[18%] right-[10%] z-0 transform -rotate-1">
          <Skeleton className="w-[140px] h-[36px] bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg" />
        </div>
        <div className="absolute top-[55%] left-[25%] z-0 transform rotate-1">
          <Skeleton className="w-[150px] h-[38px] bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg" />
        </div>
        <div className="absolute top-[45%] right-[28%] z-0 transform -rotate-1">
          <Skeleton className="w-[120px] h-[34px] bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg" />
        </div>
        <div className="absolute top-[75%] right-[25%] z-0 transform rotate-1">
          <Skeleton className="w-[140px] h-[35px] bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg" />
        </div>

        <div className="flex flex-col items-center justify-center z-10 relative py-20">
          <div className="text-xl text-blue-600 font-medium mb-8">
            마인드맵을 생성하는 중...
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: '300ms' }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"
              style={{ animationDelay: '600ms' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
