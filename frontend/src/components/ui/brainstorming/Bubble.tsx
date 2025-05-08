import React, { forwardRef } from 'react';
import BubbleImg from '@/assets/bubble.png';
import clsx from 'clsx';

interface BubbleProps {
  x: number;
  y: number;
  radius: number;
  title: string;
  containerWidth: number;
  containerHeight: number;
  onClick: () => void;
}

const Bubble = forwardRef<HTMLButtonElement, BubbleProps>(
  (
    {
      x,
      y,
      radius,
      title,
      containerWidth,
      containerHeight,
      onClick,
    }: BubbleProps,
    ref,
  ) => {
    const style: React.CSSProperties = {
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      left: `${(x / 100) * containerWidth}px`,
      top: `${(y / 100) * containerHeight}px`,
      backgroundImage: `url(${BubbleImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontSize: '14px',
      padding: '30px',
      lineHeight: 1.2,
      cursor: 'pointer',
    };

    return (
      <button
        ref={ref}
        onClick={onClick}
        className={clsx(
          'absolute rounded-full flex items-center justify-center text-center ',
          'focus:outline-none float ',
        )}
        style={style}
      >
        <p>{title}</p>
      </button>
    );
  },
);

export default Bubble;
