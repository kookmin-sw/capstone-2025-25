import { Cell, Pie, PieChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useRef } from 'react';

type TodayCompleteChartProps = {
  totalCount: number;
  completedCount: number;
};

export function TodayCompleteChart({
  totalCount,
  completedCount,
}: TodayCompleteChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const completionPercentage =
    totalCount > 0 && completedCount > 0
      ? totalCount === completedCount
        ? 100
        : Math.round((completedCount / totalCount) * 100)
      : 0;

  const remainingPercentage = 100 - completionPercentage;

  const chartData = [
    {
      name: '남은 할 일',
      value: remainingPercentage,
      fill: '#D9D9D9',
    },
    {
      name: '완료한 할 일',
      value: completionPercentage,
      fill: '#7098ff',
    },
  ];

  const chartConfig = {
    value: {
      label: 'Percentage',
    },
  } satisfies ChartConfig;

  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <Card className="flex flex-col bg-blue-2 border-0 p-0">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 md:gap-7 items-center justify-center">
        <div ref={chartRef} className="w-full max-w-[280px] md:w-1/2 lg:w-1/2">
          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-[250px] md:max-h-[280px] lg:max-h-[320px]"
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                startAngle={90}
                endAngle={-270}
                cx="50%"
                cy="50%"
                outerRadius="80%"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number, name: string) => {
                  return (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-blue" />
                      <p>
                        <span className="mr-2 text-gray-700">{name}</span>
                        <span className="font-semibold">{value}%</span>
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2 text-center md:text-left">
          <p className="text-[14px] text-gray-scale-900 font-semibold mb-4 md:mb-3 break-keep">
            오늘의 할 일의 <br />
            <span className="text-[32px] bg-neon-green text-blue rounded-full px-2 py-1">
              {completionPercentage}%
            </span>
            <span className="break-keep">를 완료했어요!</span>
          </p>
          <p className="text-[14px] text-gray-scale-700 break-keep">
            {isAllCompleted ? (
              <>
                할 일을 모두 완료했어요! <br className="hidden lg:block" />
                오늘 하루도 수고하셨습니다!
              </>
            ) : (
              <>
                조금만 더 힘내서 <br className="hidden lg:block" />할 일을 모두
                달성해봐요!
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
