import { LabelList, Pie, PieChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

type TodayCompleteChartProps = {
  totalCount: number;
  completedCount: number;
};

export function TodayCompleteChart({
  totalCount,
  completedCount,
}: TodayCompleteChartProps) {
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const remainingPercentage = 100 - completionPercentage;

  const chartData = [
    {
      type: 'remainRate',
      visitors: remainingPercentage,
      fill: '#D9D9D9',
    },
    {
      type: 'completionRate',
      visitors: completionPercentage,
      fill: '#7098ff',
    },
  ];

  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    completionRate: {
      label: `${completionPercentage}%`,
      color: 'hsl(var(--chart-1))',
    },
    remainRate: {
      label: '',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col bg-blue-2 border-0 p-0">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-12 items-center md:justify-start lg:justify-center">
        <div className="w-full max-w-[200px] md:w-5/12 lg:w-1/3">
          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-[180px] md:max-h-[200px] lg:max-h-[250px]"
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="visitors"
                startAngle={90}
                endAngle={-270}
              >
                <LabelList
                  dataKey="type"
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
        </div>
        <div className="w-full md:w-7/12 lg:w-1/3 md:pl-2">
          <p className="text-[14px] text-gray-scale-900 font-semibold mb-4 md:mb-6">
            오늘의 할 일의 <br />
            <span className="text-[32px] bg-neon-green text-blue rounded-full px-2 py-1">
              {completionPercentage}%
            </span>
            를 완료했어요!
          </p>
          <p className="text-[14px] text-gray-scale-700">
            조금만 더 힘내서 <br className="hidden lg:block" /> 할 일을 모두
            달성해봐요!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
