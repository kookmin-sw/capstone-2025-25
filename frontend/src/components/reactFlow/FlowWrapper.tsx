import {
  ReactFlow,
  ReactFlowProvider,
  ConnectionLineType,
  useReactFlow,
  Controls,
  OnConnectStart,
  OnConnectEnd,
  NodeOrigin,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useRef } from 'react';

import {
  useNodes,
  useEdges,
  useEdgesChange,
  useAddChildNode,
  useNodesChange,
  useUpdateNodeQuestions,
  useUpdateNodePending,
  useSetInitialData,
  useActiveState,
  useRestoreActiveState,
} from '@/store/mindMapStore';
import {
  useLoadMindMapData,
  useSaveMindMapData,
} from '@/store/mindmapListStore';
import { useIsNodeSelectionMode } from '@/store/nodeSelection';

import MindMapEdge from '@/components/reactFlow/edges';
import SummaryNode from '@/components/reactFlow/nodes/ui/SummaryNode';
import RootNode from '@/components/reactFlow/nodes/ui/RootNode';
import AnswerInputNode from '@/components/reactFlow/nodes/ui/AnswerInputNode';
import QuestionListNode from '@/components/reactFlow/nodes/ui/QuestionListNode';
import { GenerateReq } from '@/types/api/mindmap';
import useGenerateSchedule from '@/hooks/queries/mindmap/useGenerateSchedule';
import { findParentNode } from '@/lib/mindMap';

import useGenerateThought from '@/hooks/queries/mindmap/useGenerateThought';

import { NodeSelectionPanel } from '@/components/reactFlow/ui/NodeSelectionPanel';

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

type FlowContentProps = {
  mindmapId?: number | null;
};

function FlowContent({ mindmapId }: FlowContentProps) {
  const nodes = useNodes();
  const edges = useEdges();
  const onNodesChange = useNodesChange();
  const onEdgesChange = useEdgesChange();
  const addChildNode = useAddChildNode();
  const updateNodeQuestions = useUpdateNodeQuestions();
  const updateNodePending = useUpdateNodePending();
  const setInitialData = useSetInitialData();
  const activeState = useActiveState();
  const restoreActiveState = useRestoreActiveState();

  const loadMindMapData = useLoadMindMapData();
  const saveMindMapData = useSaveMindMapData();

  const { generateScheduleMutation } = useGenerateSchedule();
  const { generateThoughtMutation } = useGenerateThought();

  const { screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);
  const ignoreNextPaneClick = useRef(false);

  useEffect(() => {
    if (mindmapId) {
      const mindMapData = loadMindMapData(mindmapId);
      if (mindMapData) {
        if (mindMapData.nodes && mindMapData.edges) {
          setInitialData(mindMapData.nodes, mindMapData.edges);
        }
      }

      if (!mindMapData) {
        console.error(
          `마인드맵 ID ${mindmapId}에 해당하는 데이터를 찾을 수 없습니다.`,
        );
      }
    }
  }, [mindmapId, loadMindMapData, setInitialData]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes, saveMindMapData, mindmapId);
    },
    [onNodesChange, saveMindMapData, mindmapId],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes, saveMindMapData, mindmapId);
    },
    [onEdgesChange, saveMindMapData, mindmapId],
  );

  const getChildNodePosition = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event;

      return screenToFlowPosition({
        x: clientX,
        y: clientY,
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
          const requestData: GenerateReq = {
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

          if (mindmapId) {
            const mindMapData = loadMindMapData(mindmapId);

            if (mindMapData?.type === 'TODO') {
              generateScheduleMutation(requestData, {
                onSuccess: (data) => {
                  updateNodeQuestions(
                    selectedNode.id,
                    data.generated_questions,
                  );

                  updateNodePending(newNodeId, false);
                },
                onError: (error) => {
                  console.error('요약 생성 중 오류가 발생했습니다:', error);
                },
              });
            }

            if (mindMapData?.type === 'THINKING') {
              generateThoughtMutation(requestData, {
                onSuccess: (data) => {
                  updateNodeQuestions(
                    selectedNode.id,
                    data.generated_questions,
                  );

                  updateNodePending(newNodeId, false);
                },
                onError: (error) => {
                  console.error('요약 생성 중 오류가 발생했습니다:', error);
                },
              });
            }
          }
        }
      }
      ignoreNextPaneClick.current = true;

      setTimeout(() => {
        ignoreNextPaneClick.current = false;
      }, 100);
    },
    [
      nodes,
      edges,
      mindmapId,
      getChildNodePosition,
      addChildNode,
      loadMindMapData,
      generateScheduleMutation,
      generateThoughtMutation,
      updateNodeQuestions,
      updateNodePending,
    ],
  );

  const onPaneClick = useCallback(() => {
    if (ignoreNextPaneClick.current) {
      ignoreNextPaneClick.current = false;
      return;
    }

    if (activeState) {
      const node = nodes.find((n) => n.id === activeState.nodeId);
      if (node && (node.type === 'question' || node.type === 'answer')) {
        restoreActiveState();
      }
    }
  }, [activeState, nodes, restoreActiveState]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onPaneClick={onPaneClick}
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

type FlowWrapperProps = {
  mindmapId?: number | null;
};

function FlowWrapper({ mindmapId }: FlowWrapperProps) {
  const isNodeSelectionMode = useIsNodeSelectionMode();

  return (
    <div className="relative w-full h-full">
      {isNodeSelectionMode && <NodeSelectionPanel />}

      <ReactFlowProvider>
        <FlowContent mindmapId={mindmapId} />
      </ReactFlowProvider>
    </div>
  );
}

export default FlowWrapper;
