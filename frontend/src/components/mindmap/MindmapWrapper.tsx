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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { useMindmapStore } from '@/store/mindMapStore';
import useBrainStormingRewrite from '@/hooks/queries/gpt/useBrainStormingRewrite';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { BrainStormingRewriteReq } from '@/types/api/gpt';
import { Loader2 } from 'lucide-react';
import BrainstormingLogo from '@/assets/sidebar/color-brainstorming.svg';
import usePatchBubble from '@/hooks/queries/brainstorming/usePatchBubble';
import { toast } from 'sonner';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const flowStyles = {
  background: '#E8EFFF',
};

function FlowContent() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const bubbleText = searchParams.get('text') || '';
  const [summary, setSummary] = useState('');

  const navigate = useNavigate();

  const { nodes, edges, onNodesChange, onEdgesChange } = useMindmapStore();

  const { rewriteBrainStormingMutation, isPending } = useBrainStormingRewrite();
  const { patchBrainStormingMutation } = usePatchBubble();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRewriteBrainStorming = () => {
    const emptyNodes = nodes.filter((node) => {
      return !node.data.label || (node.data.label as string).trim() === '';
    });

    if (emptyNodes.length > 0) {
      toast('🚨비어있는 노드 데이터가 있습니다!');
      return;
    }

    const mindmapData = nodes.map((node) => ({
      context: String(node.data.label || ''),
    }));

    const requestData: BrainStormingRewriteReq = {
      existing_chunk: bubbleText,
      mindmap_data: mindmapData,
    };

    rewriteBrainStormingMutation(requestData, {
      onSuccess: (data) => {
        if (data && data.new_chunk) {
          setSummary(data.new_chunk);
        }
        setIsDialogOpen(true);
      },
    });
  };

  const handlePatchBrainStorming = () => {
    if (id) {
      const requestData = {
        title: summary,
      };
      patchBrainStormingMutation(
        {
          id: parseInt(id),
          data: requestData,
        },
        {
          onSuccess: () => {
            navigate('/brainstorming');
          },
        },
      );
    }
  };

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
      deleteKeyCode={null}
    >
      <Controls />

      <Panel position="bottom-center">
        <div className="mb-12 z-10 bg-[rgba(255,255,255,0.6)] rounded-4xl px-6 py-4 w-auto">
          <div className="flex items-center gap-3">
            <Button
              className="w-[139px] h-[48px] text-center rounded-4xl bg-blue-2 text-blue font-semibold"
              disabled={isPending}
              onClick={() => navigate('/brainstorming')}
            >
              취소
            </Button>
            <Button
              onClick={handleRewriteBrainStorming}
              className="w-[139px] h-[48px] text-center rounded-4xl bg-blue text-white font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리중...
                </div>
              ) : (
                '완료'
              )}
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>한 줄 요약</DialogTitle>
                  <DialogDescription>
                    마인드맵으로 정리된 한 줄 요약입니다.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="rounded-[7px] px-6 py-[20px] text-[20px] font-semibold bg-blue-2 flex gap-2 items-start">
                    <img src={BrainstormingLogo} />
                    <p>{summary}</p>
                  </div>
                </div>
                <DialogFooter>
                  <div className="w-full flex items-center justify-end">
                    <DialogClose asChild>
                      <Button
                        onClick={handlePatchBrainStorming}
                        size="sm"
                        className="bg-blue text-white"
                      >
                        적용하기
                      </Button>
                    </DialogClose>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
