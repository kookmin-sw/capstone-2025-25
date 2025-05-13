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

  const defaultChartData = [
    { day: '일', dayOfWeek: 'SUN', completedNum: 0 },
    { day: '월', dayOfWeek: 'MON', completedNum: 0 },
    { day: '화', dayOfWeek: 'TUE', completedNum: 0 },
    { day: '수', dayOfWeek: 'WED', completedNum: 0 },
    { day: '목', dayOfWeek: 'THU', completedNum: 0 },
    { day: '금', dayOfWeek: 'FRI', completedNum: 0 },
    { day: '토', dayOfWeek: 'SAT', completedNum: 0 },
  ];

  const chartData = todayTaskAnalysisList?.length
    ? todayTaskAnalysisList.map((item) => ({
        day:
          dayOfWeekMapping[item.dayOfWeek as keyof DayOfWeekMap] ||
          item.dayOfWeek,
        dayOfWeek: item.dayOfWeek,
        completedNum: item.completedNum,
        taskDate: item.taskDate,
      }))
    : defaultChartData;

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
                />
                <Bar
                  dataKey="completedNum"
                  fill="var(--color-completed)"
                  radius={8}
                ></Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
