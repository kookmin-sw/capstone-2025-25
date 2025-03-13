import { MindMapNode as MindMapNodeType } from '@/types/mindMap';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { ListCheck } from 'lucide-react';

export default function rootNode({ data }: NodeProps<MindMapNodeType>) {
  return (
    <div className="w-[267px] h-[146px] border border-black flex flex-col justify-center items-center rounded-lg relative">
      <div className="z-10 absolute -top-[25px] left-1/2 transform -translate-x-1/2 w-[50px] h-[50px] bg-root-icon rounded-full border border-black flex items-center justify-center">
        <span className="text-lg">✅</span>
      </div>

      <ListCheck size={25} color="#D8D8D8" className="absolute top-4 right-4" />
      {/* <ListRestart
        size={25}
        color="#FF696C"
        className="absolute top-4 right-4"
      /> */}

      <p className="text-[30px] font-semibold">{data.label}</p>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
