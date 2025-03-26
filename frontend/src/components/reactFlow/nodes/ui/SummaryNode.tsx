import { Modal } from '@/components/common/Modal';
import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/Dialog';
import { useDeleteNode, useNodes, useSetNode } from '@/store/mindMapStore';
import { SummaryNodeType } from '@/types/mindMap';
import { NodeProps } from '@xyflow/react';
import { GripVertical, Pencil, X } from 'lucide-react';

export default function SummaryNode({ id, data }: NodeProps<SummaryNodeType>) {
  const nodes = useNodes();
  const setNode = useSetNode();
  const deleteNode = useDeleteNode();

  const handleEditClick = () => {
    const currentNode = nodes.find((node) => node.id === id);

    if (currentNode) {
      setNode(id, {
        ...currentNode,
        type: 'answer',
      });
    }
  };

  return (
    <div className="w-[538px] px-8 py-[30px] flex items-center border-1 border-[#b3cbfa] bg-white rounded-lg relative z-100 group">
      <div className="flex-1">
        <p className="text-[20px] font-semibold">{data.summary}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-4 transition-opacity duration-300 ease-in-out">
        <Pencil
          size={20}
          color="#B9B9B7"
          className="cursor-pointer hover:text-black transition-colors z-20"
          onClick={handleEditClick}
        />

        <Modal
          trigger={
            <X
              size={20}
              color="#B9B9B7"
              className="cursor-pointer hover:text-black transition-colors z-20"
            />
          }
          title="이 노드를 삭제할까요?"
          description="해당 노드와 모든 하위노드가 함께 삭제돼요"
          footer={
            <div className="w-full flex items-center justify-between">
              <DialogClose asChild>
                <Button className="px-8" variant="white">
                  취소하기
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  className="px-8"
                  onClick={() => {
                    deleteNode(id);
                  }}
                >
                  삭제하기
                </Button>
              </DialogClose>
            </div>
          }
        >
          <div className="rounded-xl px-6 py-4 font-bold border-2 border-border-gray">
            {data.summary}
          </div>
        </Modal>
        <div className="dragHandle cursor-grab z-20">
          <GripVertical
            size={20}
            color="#B9B9B7"
            className="cursor-pointer hover:text-black transition-colors"
          />
        </div>
      </div>
      <NodeHandles type="full" />
    </div>
  );
}
