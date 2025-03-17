import useStore from '@/store/mindmapStore';
import { MindMapNodeData } from '@/types/mindMap';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { Pencil, X } from 'lucide-react';

export default function SummaryNode({ id, data }: NodeProps<MindMapNodeData>) {
  const setNode = useStore((state) => state.setNode);
  const nodes = useStore((state) => state.nodes);

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
      {/* <div className="dragHandle z-20">
        <DragIcon />
      </div> */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-8 transition-opacity duration-300 ease-in-out">
        <Pencil
          size={20}
          color="#B9B9B7"
          className="cursor-pointer hover:text-black transition-colors z-20"
          onClick={handleEditClick}
        />

        <X
          size={20}
          color="#B9B9B7"
          className="cursor-pointer hover:text-black transition-colors"
        />
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle
        type="source"
        position={Position.Top}
        className="source"
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
          border: 'none',
          borderRadius: 0,
          transform: 'none',
          zIndex: 10,
        }}
      />
    </div>
  );
}
