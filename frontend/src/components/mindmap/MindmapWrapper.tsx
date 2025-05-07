import {
  ReactFlow,
  ConnectionLineType,
  Panel,
  ReactFlowProvider,
  Controls,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '@/components/mindmap/CustomNode';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { Modal } from '@/components/common/Modal';
import { useMindmapStore } from '@/store/mindMapStore';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const flowStyles = {
  background: '#E8EFFF',
};

function FlowContent() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useMindmapStore();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      connectionLineType={ConnectionLineType.Bezier}
      fitView
      style={flowStyles}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      nodesDraggable={false}
    >
      <Controls />

      <Panel position="bottom-center">
        <div className="mb-12 z-10 bg-[rgba(255,255,255,0.6)] rounded-4xl px-6 py-4 w-auto">
          <div className="flex items-center gap-3">
            <Modal
              trigger={
                <Button className="w-[139px] h-[48px] text-center rounded-4xl bg-blue-2 text-blue font-semibold">
                  취소
                </Button>
              }
              title="취소"
              description="마인드맵 작성을 취소하시겠습니까?"
              footer={
                <div className="w-full flex items-center justify-end">
                  <DialogClose asChild>
                    <Button size="sm" className="bg-blue text-white">
                      적용하기
                    </Button>
                  </DialogClose>
                </div>
              }
            >
              <div className="rounded-[7px] px-6 py-[20px] text-[20px] font-semibold bg-blue-2">
                마인드맵 내용은 저장되지 않으며, 다시 확인할 수 없습니다.
              </div>
            </Modal>

            <Modal
              trigger={
                <Button className="w-[139px] h-[48px] text-center rounded-4xl bg-blue text-white font-semibold">
                  완료
                </Button>
              }
              title="한 줄 요약"
              description="마인드맵으로 정리된 한 줄 요약입니다."
              footer={
                <div className="w-full flex items-center justify-end">
                  <DialogClose asChild>
                    <Button size="sm" className="bg-blue text-white">
                      적용하기
                    </Button>
                  </DialogClose>
                </div>
              }
            >
              <div className="rounded-[7px] px-6 py-[20px] text-[20px] font-semibold bg-blue-2">
                마인드맵 개발을 위해 React Flow 라이브러리 공부하기
              </div>
            </Modal>
          </div>
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
