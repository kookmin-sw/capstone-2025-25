import { LabelList, Pie, PieChart } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

const chartData = [
  { browser: 'safari', visitors: 33, fill: 'var(--color-safari)' },
  { browser: 'completionRate', visitors: 67, fill: 'hsl(var(--chart-1))' },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  completionRate: {
    label: '67%',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: '',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function TodayCompleteChart() {
  return (
    <Card className="flex flex-col bg-blue-2">
      <CardContent className="flex justify-center items-center">
        <ChartContainer
          config={chartConfig}
          className=" aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="visitors"
              startAngle={90}
              endAngle={-270}
            >
              <LabelList
                dataKey="browser"
                stroke="none"
                fontSize={24}
                fill="#CEFF73"
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div>
          <p className="text-[14px] text-gray-scale-900 mb-6">
            오늘의 할 일의 <br />
            <span className="text-[32px] bg-[#CEFF73] text-blue rounded-full p-1">
              67%
            </span>
            를 완료했어요!
          </p>
          <p className="text-[14px] text-gray-scale-700">
            조금만 더 힘내서 <br /> 할 일을 모두 달성해봐요!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
