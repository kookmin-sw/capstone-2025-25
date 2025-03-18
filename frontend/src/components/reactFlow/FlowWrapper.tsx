import {
  ReactFlow,
  ReactFlowProvider,
  ConnectionLineType,
  useReactFlow,
  Controls,
  OnConnectStart,
  OnConnectEnd,
  NodeOrigin,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useCallback, useRef } from 'react';

import {
  useNodes,
  useEdges,
  useNodesChange,
  useEdgesChange,
  useAddChildNode,
} from '@/store/mindmapStore';
import MindMapEdge from '@/components/reactFlow/edges';
import SummaryNode from '@/components/reactFlow/nodes/ui/SummaryNode';
import RootNode from '@/components/reactFlow/nodes/ui/RootNode';
import AnswerInputNode from '@/components/reactFlow/nodes/ui/AnswerInputNode';
import QuestionListNode from '@/components/reactFlow/nodes/ui/QuestionListNode';

const nodeTypes = {
  root: RootNode,
  summary: SummaryNode,
  answer: AnswerInputNode,
  question: QuestionListNode,
};

const edgeTypes = {
  mindmapEdge: MindMapEdge,
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];

function FlowContent() {
  const nodes = useNodes();
  const edges = useEdges();
  const onNodesChange = useNodesChange();
  const onEdgesChange = useEdgesChange();
  const addChildNode = useAddChildNode();

  const { screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);

  const getChildNodePosition = useCallback(
    (event: MouseEvent) => {
      const rect = (event.target as Element)
        .closest('.react-flow')
        ?.getBoundingClientRect();

      if (!rect) return;

      return screenToFlowPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [screenToFlowPosition],
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const targetIsPane = (event.target as Element).classList.contains(
        'react-flow__pane',
      );

      if (!targetIsPane) {
        return;
      }

      const childNodePosition = getChildNodePosition(event as MouseEvent);

      if (childNodePosition && connectingNodeId.current) {
        const parentNode = nodes.find(
          (node) => node.id === connectingNodeId.current,
        );
        if (parentNode) {
          addChildNode(parentNode, childNodePosition);
        }
      }
    },
    [nodes, getChildNodePosition, addChildNode],
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={nodeOrigin}
        connectionLineType={ConnectionLineType.Straight}
        fitView
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

function FlowWrapper() {
  return (
    <div className="h-screen">
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  );
}

export default FlowWrapper;
