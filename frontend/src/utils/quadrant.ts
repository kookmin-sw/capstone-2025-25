import { Quadrant } from '@/types/task.ts';

export function getQuadrantId(quadrant: Quadrant): number {
  switch (quadrant) {
    case 'Q1':
      return -1;
    case 'Q2':
      return -2;
    case 'Q3':
      return -3;
    case 'Q4':
      return -4;
    default:
      return -999;
  }
}
