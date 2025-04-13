import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import { PomodoroCycle } from '@/types/pomodoro';

type MultiSliderProps = {
  cycles: PomodoroCycle[];
  onValueChange?: (values: PomodoroCycle[]) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
  readonly?: boolean;
  style?: {
    fontColor?: string;
    bgColor?: string;
  };
} & Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  'onValueChange'
>;

const MultiSlider = React.forwardRef<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  MultiSliderProps
>(
  (
    {
      cycles,
      onValueChange,
      min,
      max,
      step = 1,
      readonly,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    // 슬라이더용 형태로 변경 함수
    const cycleToSliderValues = React.useCallback(
      (cycles: PomodoroCycle[]): number[] => {
        const values: number[] = [min];
        let currentTime = min;

        cycles.forEach((cycle) => {
          currentTime += cycle.workDuration;
          values.push(currentTime);

          if (cycle.breakDuration !== 0) {
            currentTime += cycle.breakDuration;
            values.push(currentTime);
          }
        });
        return values;
      },
      [min],
    );

    //  slider를 위한 [0,25,30,55,60] 형태
    const sliderValues = React.useMemo(
      () => cycleToSliderValues(cycles),
      [cycles, cycleToSliderValues],
    );

    // 원래 형태로 변경 함수
    const sliderToCycleValues = React.useCallback(
      (sliderValues: number[]): PomodoroCycle[] => {
        const cycles: PomodoroCycle[] = [];

        for (let i = 0; i < sliderValues.length - 1; i += 2) {
          if (i + 2 < sliderValues.length) {
            const workDurationValue = sliderValues[i + 1] - sliderValues[i];
            const breakDurationValue =
              sliderValues[i + 2] - sliderValues[i + 1];
            cycles.push({
              workDuration: workDurationValue,
              breakDuration: breakDurationValue,
            });
          } else {
            const workDurationValue = sliderValues[i + 1] - sliderValues[i];
            cycles.push({ workDuration: workDurationValue, breakDuration: 0 });
          }
        }
        return cycles;
      },
      [],
    );

    //데이터 변경 시 부모에게 전달
    const handleValueChange = (newSliderValues: number[]) => {
      const sortedValues = [...newSliderValues].sort((a, b) => a - b);

      sortedValues[0] = min;
      sortedValues[sortedValues.length - 1] = max;

      // 최소 1분 간격으로 보정
      for (let i = 1; i < sortedValues.length; i++) {
        if (sortedValues[i] - sortedValues[i - 1] < 1) {
          sortedValues[i] = sortedValues[i - 1] + 1;
        }
      }

      const newCycles = sliderToCycleValues(sortedValues);

      onValueChange?.(newCycles);
    };

    // 슬라이더 블럭형태의 정보
    const intervals = React.useMemo(() => {
      if (sliderValues.length < 2) return [];

      const margin = 0.3; // 간격을 두기 위한 여백 값

      return sliderValues.slice(0, -1).map((value, index) => {
        const nextValue = sliderValues[index + 1];
        const duration = nextValue - value;
        const type = index % 2 === 0 ? 'focus' : 'break';

        const leftPercent = ((value - min) / (max - min)) * 100 + margin;
        const widthPercent =
          ((nextValue - value) / (max - min)) * 100 - 2 * margin;

        return {
          type,
          duration,
          start: value,
          end: nextValue,
          leftPercent,
          widthPercent,
        };
      });
    }, [sliderValues, min, max]);

    return (
      <div className={cn('relative w-full h-full', className)}>
        <div className="w-full h-full rounded-md relative">
          {intervals.map((interval, index) => (
            <div
              key={index}
              className={cn(
                'absolute h-full flex items-center justify-center  font-normal text-black border-[1px] border-[#AAAAAA]',
                interval.type === 'focus' ? 'bg-[#DECFFF]' : 'bg-white',
                index === 0 ? 'rounded-tl-[10px] rounded-bl-[10px]' : '',
                index === intervals.length - 1
                  ? 'rounded-tr-[10px] rounded-br-[10px]'
                  : '',
              )}
              style={{
                left: `${interval.leftPercent}%`,
                width: `${interval.widthPercent}%`,
                backgroundColor:
                  interval.type === 'focus'
                    ? style?.bgColor || '#DECFFF'
                    : 'white',
                fontSize: 'clamp(10px, 2vh, 16px)',
              }}
            >
              {/*  칸의 시간 글씨 보이는 기준*/}
              {(intervals.length <= 1 || interval.duration >= 5) && (
                <span
                  style={{
                    color:
                      interval.type === 'focus'
                        ? style?.fontColor || 'black'
                        : 'black',
                  }}
                >
                  {interval.type === 'focus' ? '집중' : '휴식'}{' '}
                  {interval.duration}분
                </span>
              )}
            </div>
          ))}
          <SliderPrimitive.Root
            ref={ref}
            className={cn(
              'relative flex w-full h-full touch-none select-none items-center',
              className,
            )}
            min={min}
            max={max}
            step={step}
            value={sliderValues}
            onValueChange={readonly ? undefined : handleValueChange}
            disabled={readonly}
            {...props}
          >
            <SliderPrimitive.Track className="relative h-full w-full grow overflow-hidden rounded-md bg-transparent">
              <SliderPrimitive.Range className="absolute h-full bg-transparent" />
            </SliderPrimitive.Track>

            {sliderValues.map((_, index) => (
              <SliderPrimitive.Thumb
                key={index}
                className={cn(
                  'block w-2 h-[50px] bg-transparent border-gray-300 z-10',
                  index === 0 || index === sliderValues.length - 1 || readonly
                    ? 'opacity-0 pointer-events-none'
                    : '',
                  readonly ? 'cursor-not-allowed' : 'cursor-ew-resize',
                )}
              />
            ))}
          </SliderPrimitive.Root>
        </div>
      </div>
    );
  },
);

MultiSlider.displayName = 'MultiSlider';

export { MultiSlider };
