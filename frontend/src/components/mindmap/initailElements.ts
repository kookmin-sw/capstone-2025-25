import { Edge, Node } from '@xyflow/react';

const nodeStyles = {
  transition: 'all 0.5s ease',
};

const edgeStyles = {
  transition: 'all 0.5s ease',
  strokeWidth: 1.5,
  stroke: '#0080ff',
};

const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

export const initialNodes: Node[] = [
  {
    id: '4',
    data: { label: 'node 4' },
    position,
    style: nodeStyles,
  },
  {
    id: '5',
    data: { label: 'node 5' },
    position,
    style: nodeStyles,
  },
  {
    id: '6',
    data: { label: 'node 6' },
    position,
    style: nodeStyles,
  },
  {
    id: '7',
    data: { label: 'node 7' },
    position,
    style: nodeStyles,
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e45',
    source: '4',
    target: '5',
    type: edgeType,
    animated: true,
    style: edgeStyles,
  },
  {
    id: 'e56',
    source: '5',
    target: '6',
    type: edgeType,
    animated: true,
    style: edgeStyles,
  },
  {
    id: 'e57',
    source: '5',
    target: '7',
    type: edgeType,
    animated: true,
    style: edgeStyles,
  },
];
