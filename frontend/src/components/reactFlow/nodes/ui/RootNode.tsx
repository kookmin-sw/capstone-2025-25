import { NodeProps } from '@xyflow/react';
import { GripVertical, ListCheck } from 'lucide-react';
import { RootNodeType } from '@/types/mindMap';
import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';

export default function RootNode({ data, selected }: NodeProps<RootNodeType>) {
  return (
    <div
      className={`w-[267px] h-[146px] border border-black bg-white flex flex-col justify-center items-center rounded-lg relative group ${
        selected ? 'selected' : ''
      }`}
    >
      <div className="dragHandle absolute top-2 left-2 z-20 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <GripVertical size={20} color="#B9B9B7" />
      </div>

      <div className="z-10 absolute -top-[25px] left-1/2 transform -translate-x-1/2 w-[50px] h-[50px] bg-root-icon rounded-full border border-black flex items-center justify-center" />

      <ListCheck size={25} color="#D8D8D8" className="absolute top-4 right-4" />

      <p className="text-[30px] font-semibold">{data.label}</p>

      <NodeHandles type="full" />
    </div>
  );
}
