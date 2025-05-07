import { useCallback, useState } from 'react';
import {
  ReactFlow,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Node,
  Edge,
  NodeMouseHandler,
  Position,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';

import '@xyflow/react/dist/style.css';
import {
  initialEdges,
  initialNodes,
} from '@/components/mindmap/initailElements';

const flowStyles = {
  background: '#E8EFFF',
};

const nodeStyles = {
  transition: 'all 0.5s ease',
};

const edgeStyles = {
  transition: 'all 0.5s ease',
  strokeWidth: 1.5,
  stroke: '#0080ff',
};

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

// 루트 노드 ID - 추후 삭제
const ROOT_NODE_ID = '4';

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB',
) => {
  const isHorizontal = direction === 'LR';

  // 루트 노드의 현재 위치 저장
  const rootNode = nodes.find((node) => node.id === ROOT_NODE_ID);
  const rootPosition = rootNode ? { ...rootNode.position } : { x: 0, y: 0 };

  // Dagre를 사용하여 전체 그래프 레이아웃 계산
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // 루트 노드의 Dagre 계산 위치 가져오기
  const dagreeRootPos = dagreGraph.node(ROOT_NODE_ID);
  if (!dagreeRootPos) {
    return { nodes, edges };
  }

  // Dagre가 계산한 루트 위치와 실제 루트 위치 간의 차이 계산
  const diffX = rootPosition.x - (dagreeRootPos.x - nodeWidth / 2);
  const diffY = rootPosition.y - (dagreeRootPos.y - nodeHeight / 2);

  // 모든 노드에 대해 위치 조정 (트리 구조는 유지하면서 전체를 이동)
  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) {
      return node;
    }

    // Dagre 계산 위치에 차이값을 더해 조정
    const position = {
      x: nodeWithPosition.x - nodeWidth / 2 + diffX,
      y: nodeWithPosition.y - nodeHeight / 2 + diffY,
    };

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position,
    };
  });

  return { nodes: newNodes, edges };
};

// 초기 레이아웃 계산
const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges.map((edge) => ({
    ...edge,
    animated: true,
    style: edgeStyles,
  })),
);

function FlowContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [currentDirection, setCurrentDirection] = useState<'TB' | 'LR'>('TB');

  // 레이아웃 변경 시 부드러운 애니메이션 적용
  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      setCurrentDirection(direction);
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    },
    [nodes, edges, setNodes, setEdges],
  );

  // 노드 클릭 핸들러 추가
  const onNodeClick: NodeMouseHandler = useCallback(
    (event, clickedNode) => {
      // 랜덤 ID 생성
      const randomId = Math.random().toString(36).substring(2, 10);
      const newNodeId = `node-${randomId}`;

      // 새 하위 노드 생성
      const newChildNode: Node = {
        id: newNodeId,
        data: { label: `Child of ${clickedNode.id}` },
        // 초기 위치는 클릭된 노드 아래에 배치 (정확한 위치는 어차피 재배치됨!)
        position: {
          x: clickedNode.position.x + 100,
          y: clickedNode.position.y + 100,
        },
        targetPosition:
          currentDirection === 'LR' ? Position.Left : Position.Top,
        sourcePosition:
          currentDirection === 'LR' ? Position.Right : Position.Bottom,
        style: nodeStyles,
      };

      // 상위 노드와 하위 노드를 연결하는 새 엣지 생성
      const newEdge: Edge = {
        id: `edge-${clickedNode.id}-${newNodeId}`,
        source: clickedNode.id,
        target: newNodeId,
        type: ConnectionLineType.SmoothStep,
        animated: true,
        style: edgeStyles,
      };

      // 새 노드와 엣지 추가 후 레이아웃 재계산
      const updatedNodes = [...nodes, newChildNode];
      const updatedEdges = [...edges, newEdge];

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(updatedNodes, updatedEdges, currentDirection);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    },
    [nodes, edges, currentDirection, setNodes, setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      style={flowStyles}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      nodesDraggable={false}
    >
      <Panel position="top-right">
        <div className="flex gap-2">
          <button
            onClick={() => onLayout('TB')}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            vertical layout
          </button>
          <button
            onClick={() => onLayout('LR')}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            horizontal layout
          </button>
        </div>
      </Panel>
    </ReactFlow>
  );
}

function MindmapWrapper() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}

export default MindmapWrapper;
