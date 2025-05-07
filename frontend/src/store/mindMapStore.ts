import { create } from 'zustand';
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Position,
  ConnectionLineType,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import {
  initialNodes,
  initialEdges,
} from '@/components/mindmap/initailElements';

const NODE_WIDTH = 172;
const MIN_NODE_HEIGHT = 60;
const ROOT_NODE_ID = '4';

const nodeHeightMap = new Map<string, number>();

const nodeStyles = {
  transition: 'all 0.5s ease',
};

const edgeStyles = {
  transition: 'all 0.5s ease',
  strokeWidth: 1.5,
  stroke: '#0080ff',
};

initialNodes.forEach((node) => {
  nodeHeightMap.set(node.id, MIN_NODE_HEIGHT);
});

/* 레이아웃 계산 함수 */
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB',
) => {
  const isHorizontal = direction === 'LR';
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const rootNode = nodes.find((node) => node.id === ROOT_NODE_ID);
  const rootPosition = rootNode ? { ...rootNode.position } : { x: 0, y: 0 };

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: isHorizontal ? 60 : 30,
    ranksep: isHorizontal ? 80 : 120,
    edgesep: 20,
    marginx: 20,
    marginy: 40,
  });

  nodes.forEach((node) => {
    const nodeHeight = nodeHeightMap.get(node.id) || MIN_NODE_HEIGHT;
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const dagreeRootPos = dagreGraph.node(ROOT_NODE_ID);
  if (!dagreeRootPos) {
    return { nodes, edges };
  }

  const diffX = rootPosition.x - (dagreeRootPos.x - NODE_WIDTH / 2);
  const diffY =
    rootPosition.y -
    (dagreeRootPos.y -
      (nodeHeightMap.get(ROOT_NODE_ID) || MIN_NODE_HEIGHT) / 2);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) {
      return node;
    }

    const nodeHeight = nodeHeightMap.get(node.id) || MIN_NODE_HEIGHT;
    const position = {
      x: nodeWithPosition.x - NODE_WIDTH / 2 + diffX,
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

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes.map((node) => ({
    ...node,
    type: 'custom',
    data: {
      ...node.data,
      layoutDirection: 'TB',
    },
    style: nodeStyles,
  })),
  initialEdges.map((edge) => ({
    ...edge,
    animated: true,
    style: edgeStyles,
  })),
  'TB',
);

type MindmapState = {
  nodes: Node[];
  edges: Edge[];
  direction: 'TB' | 'LR';

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  updateNodeLabel: (nodeId: string, newLabel: string) => void;
  updateNodeHeight: (nodeId: string, height: number) => void;
  setDirection: (direction: 'TB' | 'LR') => void;
  addChildNode: (parentNodeId: string) => void;
};

export const useMindmapStore = create<MindmapState>((set, get) => ({
  nodes: layoutedNodes,
  edges: layoutedEdges,
  direction: 'TB',

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  updateNodeLabel: (nodeId, newLabel) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
            },
          };
        }
        return node;
      }),
    }));
  },

  updateNodeHeight: (nodeId, height) => {
    const actualHeight = Math.max(height, MIN_NODE_HEIGHT);

    if (nodeHeightMap.get(nodeId) !== actualHeight) {
      nodeHeightMap.set(nodeId, actualHeight);

      const { nodes, edges } = getLayoutedElements(
        get().nodes,
        get().edges,
        get().direction,
      );

      set({ nodes, edges });
    }
  },

  setDirection: (direction) => {
    set((state) => {
      const nodesWithDirection = state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          layoutDirection: direction,
        },
      }));

      const { nodes, edges } = getLayoutedElements(
        nodesWithDirection,
        state.edges,
        direction,
      );

      return { nodes, edges, direction };
    });
  },

  addChildNode: (parentNodeId) => {
    set((state) => {
      const randomId = Math.random().toString(36).substring(2, 10);
      const newNodeId = `node-${randomId}`;

      nodeHeightMap.set(newNodeId, MIN_NODE_HEIGHT);

      const parentNode = state.nodes.find((node) => node.id === parentNodeId);
      if (!parentNode) return state;

      const newNode: Node = {
        id: newNodeId,
        type: 'custom',
        data: {
          label: '',
          layoutDirection: state.direction,
        },
        position: {
          x: parentNode.position.x + 100,
          y: parentNode.position.y + 100,
        },
        targetPosition: state.direction === 'LR' ? Position.Left : Position.Top,
        sourcePosition:
          state.direction === 'LR' ? Position.Right : Position.Bottom,
        style: nodeStyles,
      };

      const newEdge: Edge = {
        id: `edge-${parentNodeId}-${newNodeId}`,
        source: parentNodeId,
        target: newNodeId,
        type: ConnectionLineType.Bezier,
        animated: true,
        style: edgeStyles,
      };

      const updatedNodes = [...state.nodes, newNode];
      const updatedEdges = [...state.edges, newEdge];

      const { nodes, edges } = getLayoutedElements(
        updatedNodes,
        updatedEdges,
        state.direction,
      );

      return { nodes, edges };
    });
  },
}));
