import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        /* 커스텀 variants */
        // black: 'bg-black text-white hover:bg-black/90',
        // white: 'bg-white text-black border hover:bg-gray-100',
        // primary: 'bg-button-primary text-white hover:bg-primary-100',
        // disabled: 'bg-button-disabled text-white hover:bg-[#CECFCD]',
        blue: 'bg-blue text-white',
        disabled: 'bg-blue-2 text-gray-scale-400',
        outline: 'border border-blue text-blue bg-white'

        // neon: 'bg-neon-green hover:bg-accent hover:text-accent-foreground',

        // /* shadcn/ui 기본 variants */
        // destructive:
        //   'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        // outline:
        //   'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        // secondary:
        //   'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        // ghost: 'hover:bg-accent hover:text-accent-foreground',
        // link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 rounded-md w-[148px] text-[20px] ',
        // sm: 'h-[42px] rounded-md gap-1.5 w-[160px] ',
        // lg: 'h-12 rounded-md w-[180px] ',
        // icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'black',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
