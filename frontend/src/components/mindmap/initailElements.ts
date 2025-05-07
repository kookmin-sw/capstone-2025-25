import { Edge, Node } from '@xyflow/react';

/* 추후에 마인드맵 초기 데이터 설정하는 부분이랑 연결할 예정 */

const nodeStyles = {
  transition: 'all 0.5s ease',
};

const position = { x: 0, y: 0 };

export const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'root' },
    position,
    type: 'custom',
    style: nodeStyles,
  },
];

export const initialEdges: Edge[] = [];
