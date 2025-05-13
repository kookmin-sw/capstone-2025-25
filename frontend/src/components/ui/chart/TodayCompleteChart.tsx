import { LabelList, Pie, PieChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useState, useEffect, useRef } from 'react';

type TodayCompleteChartProps = {
  totalCount: number;
  completedCount: number;
};

export function TodayCompleteChart({
  totalCount,
  completedCount,
}: TodayCompleteChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(24);

  // 컨테이너 크기에 따라 폰트 크기 조정
  useEffect(() => {
    const updateFontSize = () => {
      if (chartRef.current) {
        const containerWidth = chartRef.current.offsetWidth;
        // 컨테이너 너비에 따라 폰트 크기 계산
        const newSize = Math.max(14, Math.min(24, containerWidth * 0.09));
        setFontSize(newSize);
      }
    };

    // 초기 로드 시 폰트 크기 설정
    updateFontSize();

    // 창 크기 변경 시 폰트 크기 업데이트
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

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
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 md:gap-7 items-center justify-center">
        <div ref={chartRef} className="w-full max-w-[280px] md:w-1/2 lg:w-1/2">
          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-[250px] md:max-h-[280px] lg:max-h-[320px]"
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
                  fill="#CEFF73"
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label
                  }
                  style={{ fontSize: `${fontSize}px` }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2 text-center md:text-left">
          <p className="text-[14px] text-gray-scale-900 font-semibold mb-4 md:mb-6 break-keep">
            오늘의 할 일의 <br />
            <span className="text-[32px] bg-neon-green text-blue rounded-full px-2 py-1">
              {completionPercentage}%
            </span>
            <span className="break-keep">를 완료했어요!</span>
          </p>
          <p className="text-[14px] text-gray-scale-700 break-keep">
            조금만 더 힘내서 <br className="hidden lg:block" />할 일을 모두
            달성해봐요!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
