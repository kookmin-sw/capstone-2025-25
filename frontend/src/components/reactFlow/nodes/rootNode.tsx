import { Handle, NodeProps, Position } from '@xyflow/react';
import { ListCheck } from 'lucide-react';
import DragIcon from '@/components/reactFlow/nodes/ui/DragIcon';
import { MindMapNodeData } from '@/types/mindMap';

export default function RootNode({
  data,
  selected,
}: NodeProps<MindMapNodeData>) {
  return (
    <div
      className={`w-[267px] h-[146px] border border-black bg-white flex flex-col justify-center items-center rounded-lg relative group ${
        selected ? 'selected' : ''
      }`}
    >
      <div className="dragHandle absolute top-2 left-2 z-20 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DragIcon />
      </div>

      <div className="z-10 absolute -top-[25px] left-1/2 transform -translate-x-1/2 w-[50px] h-[50px] bg-root-icon rounded-full border border-black flex items-center justify-center">
        <span className="text-lg">✅</span>
      </div>

      <ListCheck size={25} color="#D8D8D8" className="absolute top-4 right-4" />

      <p className="text-[30px] font-semibold">{data.label}</p>

      <Handle
        type="target"
        position={Position.Top}
        className="target"
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
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
