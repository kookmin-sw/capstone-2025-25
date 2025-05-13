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
import useGetPomodoroAnalysis from '@/hooks/queries/analysis/useGetPomodoroAnalysis';

const pomodoroChartConfig = {
  totalTime: {
    label: '집중한 시간',
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

type PomodoroCompletionChartProps = {
  title: string;
};

export function PomodoroCompletionChart({
  title,
}: PomodoroCompletionChartProps) {
  const { pomodoroAnalysisList } = useGetPomodoroAnalysis();

  const generateLastSevenDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][
        date.getDay()
      ];
      const formattedDate = date.toISOString().split('T')[0];

      days.push({
        date: formattedDate,
        day: dayOfWeekMapping[dayOfWeek as keyof DayOfWeekMap],
        dayOfWeek: dayOfWeek,
        totalTime: '0',
      });
    }
    return days;
  };

  const defaultChartData = generateLastSevenDays();

  const chartData = pomodoroAnalysisList?.length
    ? defaultChartData.map((defaultDay) => {
        const matchingData = pomodoroAnalysisList.find(
          (item) => item.createdAt === defaultDay.date,
        );

        return {
          ...defaultDay,
          totalTime: matchingData ? matchingData.totalTime : '0',
        };
      })
    : defaultChartData;

  return (
    <Card className="h-full w-full border-none shadow-none rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-scale-700 text-[20px] font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <div className="h-full w-full">
          <ChartContainer
            config={pomodoroChartConfig}
            className="h-full w-full"
          >
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
                  dataKey="totalTime"
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
