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
  useEdgesChange,
  useAddChildNode,
  useNodesChange,
  useUpdateNodeQuestions,
} from '@/store/mindMapStore';
import MindMapEdge from '@/components/reactFlow/edges';
import SummaryNode from '@/components/reactFlow/nodes/ui/SummaryNode';
import RootNode from '@/components/reactFlow/nodes/ui/RootNode';
import AnswerInputNode from '@/components/reactFlow/nodes/ui/AnswerInputNode';
import QuestionListNode from '@/components/reactFlow/nodes/ui/QuestionListNode';
import { GeneratedScheduleReq } from '@/types/api/mindmap';
import useGenerateSchedule from '@/hooks/queries/mindmap/useGenerateSchedule';

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
  const updateNodeQuestions = useUpdateNodeQuestions();

  const { generateScheduleMutation } = useGenerateSchedule();

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
        const mainNode = nodes.find((node) => node.type === 'root');
        const selectedNode = nodes.find(
          (node) => node.id === connectingNodeId.current,
        );
        const parentNode = nodes.find(
          (node) => node.id === selectedNode?.parentId,
        );

        if (selectedNode) {
          /*
          루트 노드일때는, mainNode만 보내기
          parentNode가 rootNode일때는 mainNode + selectedNode만 보내기
          -> null로 처리
          */
          const requestData: GeneratedScheduleReq = {
            mainNode: mainNode?.data?.label
              ? { summary: mainNode.data.label }
              : null,
            parentNode:
              parentNode?.id !== mainNode?.id && parentNode?.data?.summary
                ? { summary: parentNode.data.summary }
                : null,
            selectedNode: selectedNode?.data?.summary
              ? { summary: selectedNode.data.summary }
              : null,
          };

          const newNodeId = addChildNode(
            [],
            selectedNode,
            childNodePosition,
            true,
          );

          generateScheduleMutation(requestData, {
            onSuccess: (data) => {
              updateNodeQuestions(newNodeId, data.generated_questions, false);
            },
            onError: (error) => {
              console.error('요약 생성 중 오류가 발생했습니다:', error);
            },
          });
        }
      }
    },
    [
      nodes,
      getChildNodePosition,
      addChildNode,
      generateScheduleMutation,
      updateNodeQuestions,
    ],
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
