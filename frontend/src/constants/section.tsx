import { Quadrant } from '@/types/commonTypes';
import { ReactNode } from 'react';

export const quadrantTitles: Record<Quadrant, string> = {
  Q1: '긴급하고 중요한 일',
  Q2: '긴급하지 않지만 중요한 일',
  Q3: '긴급하지만 중요하지 않은 일',
  Q4: '긴급하지도 중요하지도 않은 일',
};

export const boardQuadrantTitles: Record<Quadrant, ReactNode> = {
  Q1: (
    <>
      긴급하고
    <br />
    중요한 일
    </>
),
Q2: (
  <>
    긴급하지 않지만
<br />
중요한 일
</>
),
Q3: (
  <>
    긴급하지만
  <br />
  중요하지 않은 일
</>
),
Q4: (
  <>
    긴급하지도
  <br />
  중요하지도 않은 일
</>
),
};