import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4 bg-[#E8EFFF] rounded-md p-2',
        caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants(),
          'size-7 bg-transparent p-0 opacity-100 text-blue hover:cursor-pointer hover:bg-transparent hover:opacity-100 hover:text-blue',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-x-1',
        head_row: 'flex',
        head_cell: ' rounded-md w-8 font-normal text-[0.8rem] text-blue',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm text-blue focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'w-8 h-6 p-0 font-normal aria-selected:opacity-100 text-blue ',
        ),
        day_range_start:
          'day-range-start aria-selected:bg-neon-green aria-selected:text-blue hover:cursor-pointer hover:bg-transparent hover:opacity-100 hover:text-blue',
        day_range_end:
          'day-range-end aria-selected:bg-neon-green aria-selected:text-blue hover:cursor-pointer hover:bg-transparent hover:opacity-100 hover:text-blue',
        day_selected: 'bg-neon-green text-blue hover:text-blue focus:text-blue',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-[#CDCED6] aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-blue',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('size-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('size-4', className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
