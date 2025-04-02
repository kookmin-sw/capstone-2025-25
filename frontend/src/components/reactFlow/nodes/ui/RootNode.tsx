import { NodeProps } from '@xyflow/react';
import { GripVertical } from 'lucide-react';
import { RootNodeType } from '@/types/mindMap';
import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';

export default function RootNode({ data, selected }: NodeProps<RootNodeType>) {
  return (
    <div
      className={`min-w-[250px] p-9 border border-black bg-white flex flex-col justify-center items-center rounded-lg relative group ${
        selected ? 'selected' : ''
      }`}
    >
      <div className="dragHandle absolute top-2 left-2 z-20 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <GripVertical size={20} color="#B9B9B7" />
      </div>

      <p className="text-[30px] font-semibold">{data.label}</p>

      <NodeHandles type="full" />
    </div>
  );
}
