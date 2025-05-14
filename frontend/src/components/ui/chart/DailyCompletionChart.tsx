import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import useGetTodayTaskAnalysis from '@/hooks/queries/analysis/useGetTodayTaskAnalysis';
import { useMemo } from 'react';

const todoChartConfig = {
  completedNum: {
    label: '완료한 일',
    color: '#7098ff',
  },
} satisfies ChartConfig;

type DayOfWeekMap = {
  [key in 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN']: string;
};

const dayOfWeekMapping: DayOfWeekMap = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};

type DailyCompletionChartProps = {
  title: string;
};

export function DailyCompletionChart({ title }: DailyCompletionChartProps) {
  const { todayTaskAnalysisList } = useGetTodayTaskAnalysis();

  const chartData = useMemo(() => {
    const result = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayIndex = date.getDay();
      const dayOfWeekCodes = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const dayOfWeek = dayOfWeekCodes[dayIndex];

      result.push({
        day: dayOfWeekMapping[dayOfWeek as keyof DayOfWeekMap],
        dayOfWeek,
        completedNum: 0,
      });
    }

    if (!todayTaskAnalysisList?.length) {
      return result;
    }

    const dataMap = new Map();
    todayTaskAnalysisList.forEach((item) => {
      dataMap.set(item.dayOfWeek, item.completedNum);
    });

    return result.map((item) => {
      if (dataMap.has(item.dayOfWeek)) {
        return {
          ...item,
          completedNum: dataMap.get(item.dayOfWeek),
        };
      }
      return item;
    });
  }, [todayTaskAnalysisList]);

  return (
    <Card className="h-full w-full border-none shadow-none rounded-2xl px-6 py-4">
      <CardHeader className="pb-2 px-0">
        <CardTitle className="text-[#525463] text-[20px] font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <div className="h-full w-full">
          <ChartContainer config={todoChartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="font-bold text-gray-scale-700"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => {
                    return (
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-blue" />
                        <p>
                          <span className="mr-2 text-gray-700">완료한 일</span>
                          <span className="font-semibold">{value}개</span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="completedNum" fill="#7098ff" radius={8}></Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
