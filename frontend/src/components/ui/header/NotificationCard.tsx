import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import useGetNotification from '@/hooks/queries/eisenhower/useGetNotification';

function formatDateToEnglish(dateString: string | null): string {
  if (!dateString) return '날짜 없음';

  if (typeof dateString === 'string') {
    const [yearStr, monthStr, dayStr] = dateString.split('-');

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      return '날짜 없음';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return '날짜 없음';
}

function isToday(dateString: string): boolean {
  if (!dateString) return false;

  const today = new Date();
  const [year, month, day] = dateString.split('-').map(Number);

  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  );
}

export default function NotificationCard() {
  const { notifications } = useGetNotification();
  return (
    <div>
      <h3 className="text-[20px] font-semibold text-blue border-b border-gray-scale-200 pb-4">
        알림
      </h3>

      {notifications && notifications.length === 0 ? (
        <div className="py-4 text-center text-gray-500">알림이 없습니다</div>
      ) : (
        notifications &&
        notifications.map((notification) => {
          const isDueToday = isToday(notification.dueDate);

          return (
            <div className="flex gap-2 py-4">
              <div
                className={cn(
                  'w-[10px] h-[10px] mt-2 rounded-full flex-shrink-0',
                  isDueToday ? 'bg-blue' : 'bg-gray-scale-600',
                )}
              />
              <div className="flex flex-col gap-2">
                <h4
                  className={cn(
                    'font-semibold',
                    isDueToday ? 'text-gray-scale-900' : 'text-gray-scale-600',
                  )}
                >
                  {notification.title}
                </h4>
                <p className="text-[14px] text-gray-500">
                  일정이 하루 남았습니다. 우선순위를 높여 기간 내에 실행하세요
                </p>
                <div className="flex items-center gap-2">
                  <Calendar
                    size={16}
                    className="text-[
#525463]"
                  />
                  <p
                    className="text-[14px] text-[
#525463]"
                  >
                    {formatDateToEnglish(notification.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
