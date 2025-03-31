import {
  ReactFlow,
  ReactFlowProvider,
  ConnectionLineType,
  useReactFlow,
  Controls,
  OnConnectStart,
  OnConnectEnd,
  NodeOrigin,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useCallback, useRef, useState } from 'react';

import {
  useNodes,
  useEdges,
  useEdgesChange,
  useAddChildNode,
  useNodesChange,
  useUpdateNodeQuestions,
  useUpdateNodePending,
} from '@/store/mindMapStore';
import MindMapEdge from '@/components/reactFlow/edges';
import SummaryNode from '@/components/reactFlow/nodes/ui/SummaryNode';
import RootNode from '@/components/reactFlow/nodes/ui/RootNode';
import AnswerInputNode from '@/components/reactFlow/nodes/ui/AnswerInputNode';
import QuestionListNode from '@/components/reactFlow/nodes/ui/QuestionListNode';
import { GeneratedScheduleReq } from '@/types/api/mindmap';
import useGenerateSchedule from '@/hooks/queries/mindmap/useGenerateSchedule';
import { findParentNode } from '@/lib/mindMap';
import { Modal } from '@/components/common/Modal';
import { Plus } from 'lucide-react';
import { DialogClose } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

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
  const updateNodePending = useUpdateNodePending();

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
    (event, connectionState) => {
      if (connectionState.isValid) {
        return;
      }
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
        const parentNode = selectedNode
          ? findParentNode(nodes, edges, selectedNode.id)
          : undefined;

        if (!selectedNode) {
          return;
        }

        if (
          selectedNode?.data.recommendedQuestions &&
          selectedNode.data.recommendedQuestions.length > 0
        ) {
          addChildNode(selectedNode, childNodePosition, false);
        }

        if (
          !selectedNode?.data.recommendedQuestions ||
          selectedNode.data.recommendedQuestions.length === 0
        ) {
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

          const newNodeId = addChildNode(selectedNode, childNodePosition, true);

          generateScheduleMutation(requestData, {
            onSuccess: (data) => {
              updateNodeQuestions(selectedNode.id, data.generated_questions);

              updateNodePending(newNodeId, false);
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
      edges,
      getChildNodePosition,
      addChildNode,
      generateScheduleMutation,
      updateNodeQuestions,
      updateNodePending,
    ],
  );

  /* 
  임시로 마인드맵 생성하는 버튼을 생성해놓음
  추후에 사이드바 디자인 나오면 해당 로직 옮길 예정임
   */

  const AddButton = () => {
    const [selectedType, setSelectedType] = useState('');
    const [subject, setSubject] = useState('');

    const handleCreateClick = () => {
      console.log('생성', selectedType, subject);
    };

    const handleInputChange = (e) => {
      setSubject(e.target.value);
    };

    return (
      <Modal
        trigger={<Plus size={20} />}
        title="마인드맵 생성하기"
        description={`해야 할 일이나 생각이 떠올랐다면 여기 적어보세요! 
        질문을 통해 더 깊이 고민할 수 있도록 도와줄게요`}
        footer={
          <DialogClose asChild>
            <Button className="px-8" onClick={handleCreateClick}>
              생성하기
            </Button>
          </DialogClose>
        }
      >
        <div
          className="flex flex-col space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <label className="text-[14px] block mb-2">마인드맵 주제</label>
            <Input
              placeholder="주제를 입력하세요"
              value={subject}
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()}
              className="h-12"
            />
          </div>

          <div>
            <label className="text-[14px] block mb-2">마인드맵 타입</label>
            <div
              className="w-full flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="white"
                className={cn(
                  'flex-1 border-1 font-normal',
                  selectedType === 'Todo'
                    ? 'border-[#8D5CF6]'
                    : 'border-gray-200',
                )}
                onClick={() => setSelectedType('Todo')}
              >
                Todo
              </Button>

              <Button
                variant="white"
                className={cn(
                  'flex-1 border-1 font-normal',
                  selectedType === 'Thinking'
                    ? 'border-[#8D5CF6]'
                    : 'border-gray-200',
                )}
                onClick={() => setSelectedType('Thinking')}
              >
                Thinking
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

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
        <Panel>
          <AddButton />
        </Panel>
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
