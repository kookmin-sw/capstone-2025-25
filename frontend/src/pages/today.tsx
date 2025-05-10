import TodayMainDashborad from '@/components/today/TodayMainDashborad';

// 리마인더 데이터
const REMIND_DATA = [
  {
    id: 0,
    title: '운동하기',
    content: '등 운동 1시간',
    category: 'category1',
    dueDate: '2022-01-20',
    reminder: true,
    completed: false,
  },
  {
    id: 1,
    title: '축구하기',
    content: '일요일 오후 6시 조기축구',
    category: 'category1',
    dueDate: '2022-01-20',
    reminder: false,
    completed: false,
  },
  {
    id: 2,
    title: '캡스톤 개발',
    content: '오늘의 할 일 페이지 개발하기',
    category: 'category1',
    dueDate: '2022-01-20',
    reminder: false,
    completed: true,
  },
  {
    id: 3,
    title: '도훈 버블팝 춤 연습하기',
    content: '버블팝 연습해서 양정민 앞에...',
    category: 'category1',
    dueDate: '2022-01-20',
    reminder: false,
    completed: false,
  },
];

export default function TodayListPage() {
  return (
    <div className="w-full px-6">
      <h1 className="block lg:hidden text-[28px] text-[#525463] font-semibold mb-6">
        오늘의 할 일
      </h1>

      <div className="w-full bg-white px-6 py-4 rounded-xl text-[20px] text-[#525463] font-semibold">
        조금씩, 하지만 꾸준히! 오늘도 파이팅 ✨
      </div>

      <div className="w-full mt-6 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-[20px] text-[#525463] font-semibold">리마인더</h4>
          <p className="text-blue text-[14px] cursor-pointer">더보기 {'>'} </p>
        </div>

        <div className="w-full overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {REMIND_DATA.map((remind) => (
              <div
                key={remind.id}
                className="bg-white rounded-lg px-6 py-4 cursor-pointer flex-none"
                style={{ width: '16rem' }}
              >
                <h3 className="text-[20px] text-[#525463] font-semibold">
                  {remind.title}
                </h3>
                <p className="text-gray-500">{remind.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 대시보드 레이아웃 */}
      <TodayMainDashborad />
    </div>
  );
}
