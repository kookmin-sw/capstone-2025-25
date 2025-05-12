import React, { forwardRef, useState, useEffect, useRef } from 'react';
import BubbleImg from '@/assets/bubble.png';
import BubblePop from '@/assets/bubble_pop.gif';
import clsx from 'clsx';

interface BubbleProps {
  x: number;
  y: number;
  radius: number;
  title: string;
  containerWidth: number;
  containerHeight: number;
  onClick: () => void;
  isDeleting?: boolean | null;
  isNew?: boolean | null;
  className?: string;
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
      isDeleting,
      isNew,
      className,
    }: BubbleProps,
    ref,
  ) => {
    const [position, setPosition] = useState<{ x: number; y: number }>({
      x,
      y,
    });
    const [delay, setDelay] = useState<string>('0s');
    const delayRef = useRef<string>('0s');

    useEffect(() => {
      const calculatePosition = () => {
        const newX = (x / 100) * containerWidth;
        const newY = (y / 100) * containerHeight;
        setPosition({ x: newX, y: newY });
      };

      calculatePosition();
    }, [x, y, containerWidth, containerHeight]);

    useEffect(() => {
      const randomDelay = Math.random() * 2 + 's';
      setDelay(randomDelay);
      delayRef.current = randomDelay;
    }, []);

    const style: React.CSSProperties = {
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      left: `${position.x}px`,
      top: `${position.y}px`,
      fontSize: '14px',
      lineHeight: 1.2,
      cursor: 'pointer',
      animationDelay: isNew ? '0s' : delay,
    };

    const backgroundStyle: React.CSSProperties = {
      backgroundImage: `url(${BubbleImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.5,
    };

    return isDeleting ? (
      <img
        src={BubblePop}
        style={{
          ...style,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
        }}
        className={clsx(
          'absolute rounded-full flex items-center justify-center text-center',
          'focus:outline-none',
        )}
      />
    ) : (
      <button
        ref={ref}
        onClick={onClick}
        className={clsx(
          'absolute rounded-full flex items-center justify-center text-center ',
          'focus:outline-none',
          className,
        )}
        style={{
          ...style,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={backgroundStyle}
        />
        <p className="z-10 p-5">
          {title}
        </p>
      </button>
    );
  },
);

export default Bubble;
