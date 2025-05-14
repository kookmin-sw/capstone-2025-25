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

const BASE_NODE_WIDTH = 172;
const MIN_NODE_HEIGHT = 60;
const ROOT_NODE_ID = '1';

const nodeHeightMap = new Map<string, number>();
const nodeWidthMap = new Map<string, number>();

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
  nodeWidthMap.set(node.id, BASE_NODE_WIDTH);
});

const calculateNodeWidth = (text: string): number => {
  const avgCharWidth = 9;

  const maxLines = 4;

  const charsPerLine = Math.floor((BASE_NODE_WIDTH - 40) / avgCharWidth);

  const estimatedLines = Math.min(
    maxLines,
    Math.ceil(text.length / charsPerLine),
  );

  if (estimatedLines <= 1) {
    return Math.max(BASE_NODE_WIDTH, text.length * avgCharWidth + 40);
  } else {
    return BASE_NODE_WIDTH;
  }
};

const calculateNodeHeight = (text: string, width: number): number => {
  const avgCharWidth = 9;
  const lineHeight = 20;

  const charsPerLine = Math.floor((width - 40) / avgCharWidth);

  const estimatedLines = Math.max(1, Math.ceil(text.length / charsPerLine));

  return Math.max(MIN_NODE_HEIGHT, 30 + estimatedLines * lineHeight);
};

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
    nodesep: isHorizontal ? 80 : 50,
    ranksep: isHorizontal ? 120 : 160,
    edgesep: 30,
    marginx: 30,
    marginy: 50,
  });

  nodes.forEach((node) => {
    const nodeText = (node.data.label as string) || '';
    const nodeWidth = nodeWidthMap.get(node.id) || calculateNodeWidth(nodeText);
    nodeWidthMap.set(node.id, nodeWidth);

    const nodeHeight =
      nodeHeightMap.get(node.id) || calculateNodeHeight(nodeText, nodeWidth);
    nodeHeightMap.set(node.id, nodeHeight);

    dagreGraph.setNode(node.id, {
      width: nodeWidth,
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

  const rootWidth = nodeWidthMap.get(ROOT_NODE_ID) || BASE_NODE_WIDTH;
  const rootHeight = nodeHeightMap.get(ROOT_NODE_ID) || MIN_NODE_HEIGHT;

  const diffX = rootPosition.x - (dagreeRootPos.x - rootWidth / 2);
  const diffY = rootPosition.y - (dagreeRootPos.y - rootHeight / 2);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) {
      return node;
    }

    const nodeWidth = nodeWidthMap.get(node.id) || BASE_NODE_WIDTH;
    const nodeHeight = nodeHeightMap.get(node.id) || MIN_NODE_HEIGHT;

    const position = {
      x: nodeWithPosition.x - nodeWidth / 2 + diffX,
      y: nodeWithPosition.y - nodeHeight / 2 + diffY,
    };

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position,
      style: {
        ...nodeStyles,
        width: nodeWidth,
        height: nodeHeight,
      },
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
  updateNodeWidth: (nodeId: string, width: number) => void;
  setDirection: (direction: 'TB' | 'LR') => void;
  addChildNode: (parentNodeId: string) => void;
  deleteNode: (nodeId: string) => void;
  initializeWithQuestions: (rootText: string, questions: string[]) => void;
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
    set((state) => {
      const newWidth = calculateNodeWidth(newLabel);
      const newHeight = calculateNodeHeight(newLabel, newWidth);

      nodeWidthMap.set(nodeId, newWidth);
      nodeHeightMap.set(nodeId, newHeight);

      const updatedNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
            },
            style: {
              ...node.style,
              width: newWidth,
              height: newHeight,
            },
          };
        }
        return node;
      });

      const { nodes, edges } = getLayoutedElements(
        updatedNodes,
        state.edges,
        state.direction,
      );

      return { nodes, edges };
    });
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

  updateNodeWidth: (nodeId, width) => {
    const actualWidth = Math.max(width, BASE_NODE_WIDTH);

    if (nodeWidthMap.get(nodeId) !== actualWidth) {
      nodeWidthMap.set(nodeId, actualWidth);

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
      nodeWidthMap.set(newNodeId, BASE_NODE_WIDTH);

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
        style: {
          ...nodeStyles,
          width: BASE_NODE_WIDTH,
          height: MIN_NODE_HEIGHT,
        },
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

  deleteNode: (nodeId) => {
    if (nodeId === ROOT_NODE_ID) return;

    set((state) => {
      const nodesToDelete = new Set<string>();

      const findDescendants = (id: string) => {
        nodesToDelete.add(id);

        state.edges.forEach((edge) => {
          if (edge.source === id) {
            findDescendants(edge.target);
          }
        });
      };

      findDescendants(nodeId);

      const newEdges = state.edges.filter(
        (edge) =>
          !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target),
      );

      const newNodes = state.nodes.filter(
        (node) => !nodesToDelete.has(node.id),
      );

      nodesToDelete.forEach((id) => {
        nodeHeightMap.delete(id);
        nodeWidthMap.delete(id);
      });

      const { nodes, edges } = getLayoutedElements(
        newNodes,
        newEdges,
        state.direction,
      );

      return { nodes, edges };
    });
  },

  initializeWithQuestions: (rootText: string, questions: string[]) => {
    set((state) => {
      const rootWidth = calculateNodeWidth(rootText);
      const rootHeight = calculateNodeHeight(rootText, rootWidth);

      nodeWidthMap.set(ROOT_NODE_ID, rootWidth);
      nodeHeightMap.set(ROOT_NODE_ID, rootHeight);

      const rootNode: Node = {
        id: ROOT_NODE_ID,
        type: 'custom',
        data: {
          label: rootText,
          layoutDirection: state.direction,
        },
        position: { x: 0, y: 0 },
        targetPosition: state.direction === 'LR' ? Position.Left : Position.Top,
        sourcePosition:
          state.direction === 'LR' ? Position.Right : Position.Bottom,
        style: {
          ...nodeStyles,
          width: rootWidth,
          height: rootHeight,
        },
      };

      const newNodes: Node[] = [rootNode];
      const newEdges: Edge[] = [];

      nodeHeightMap.clear();
      nodeWidthMap.clear();
      nodeHeightMap.set(ROOT_NODE_ID, rootHeight);
      nodeWidthMap.set(ROOT_NODE_ID, rootWidth);

      questions.forEach((question, index) => {
        const nodeId = `node-${index + 1}`;

        const nodeWidth = calculateNodeWidth(question);
        const nodeHeight = calculateNodeHeight(question, nodeWidth);

        nodeWidthMap.set(nodeId, nodeWidth);
        nodeHeightMap.set(nodeId, nodeHeight);

        const childNode: Node = {
          id: nodeId,
          type: 'custom',
          data: {
            label: question,
            layoutDirection: state.direction,
          },
          position: { x: 100, y: 100 * (index + 1) },
          targetPosition:
            state.direction === 'LR' ? Position.Left : Position.Top,
          sourcePosition:
            state.direction === 'LR' ? Position.Right : Position.Bottom,
          style: {
            ...nodeStyles,
            width: nodeWidth,
            height: nodeHeight,
          },
        };

        const edge: Edge = {
          id: `edge-${ROOT_NODE_ID}-${nodeId}`,
          source: ROOT_NODE_ID,
          target: nodeId,
          type: ConnectionLineType.Bezier,
          animated: true,
          style: edgeStyles,
        };

        newNodes.push(childNode);
        newEdges.push(edge);
      });

      const { nodes, edges } = getLayoutedElements(
        newNodes,
        newEdges,
        state.direction,
      );

      return { nodes, edges };
    });
  },
}));
