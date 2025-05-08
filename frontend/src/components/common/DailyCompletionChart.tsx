import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// 일별 데이터 (일요일부터 토요일까지)
const todoChartData = [
  { day: 'SUN', completed: 5 },
  { day: 'MON', completed: 1 },
  { day: 'TUE', completed: 2 },
  { day: 'WED', completed: 3 },
  { day: 'THU', completed: 4 },
  { day: 'FRI', completed: 5 },
  { day: 'SAT', completed: 6 },
];

const todoChartConfig = {
  completed: {
    label: '완료된 할 일',
    color: '#7098ff',
  },
} satisfies ChartConfig;

type DailyCompletionChartProps = {
  title: string;
};

export function DailyCompletionChart({ title }: DailyCompletionChartProps) {
  return (
    <Card className="h-full w-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>요일별 완료된 작업 통계</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <div className="h-full w-full">
          <ChartContainer config={todoChartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={todoChartData}
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
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="completed"
                  fill="var(--color-completed)"
                  radius={8}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
