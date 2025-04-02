import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';
import { useNodes, useSetNode } from '@/store/mindMapStore';
import { SummaryNodeType } from '@/types/mindMap';
import { NodeProps } from '@xyflow/react';
import { CornerDownRight, GripVertical, PencilLine } from 'lucide-react';

export default function SummaryNode({ id, data }: NodeProps<SummaryNodeType>) {
  const nodes = useNodes();
  const setNode = useSetNode();

  const handleEditClick = () => {
    const currentNode = nodes.find((node) => node.id === id);

    if (currentNode) {
      setNode(id, {
        ...currentNode,
        type: 'answer',
        data: {
          ...currentNode.data,
          isEditing: true,
        },
      });
    }
  };

  return (
    <div className="w-[538px] px-8 py-[30px] flex items-center border-1 border-[#b3cbfa] bg-white rounded-lg relative z-100 group">
      <div className="flex-1">
        <p className="text-[20px] font-semibold">{data.summary}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-4 transition-opacity duration-300 ease-in-out">
        <PencilLine
          size={20}
          color="#B9B9B7"
          className="cursor-pointer hover:text-black transition-colors z-20"
          onClick={handleEditClick}
        />
        <CornerDownRight size={20} color="#B9B9B7" />

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
