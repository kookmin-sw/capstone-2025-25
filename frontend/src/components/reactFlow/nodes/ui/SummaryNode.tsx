import NodeHandles from '@/components/reactFlow/nodes/ui/NodeHandles';
import {
  useToggleNodeSelectionMode,
  useIsNodeSelectionMode,
  useAddSelectedNode,
  useRemoveSelectedNode,
  useSelectedNodes,
} from '@/store/nodeSelection';
import { useNodes, useSetNode } from '@/store/mindMapStore';
import { SummaryNodeType } from '@/types/mindMap';
import { NodeProps } from '@xyflow/react';
import {
  CornerDownRight,
  GripVertical,
  PencilLine,
  CheckCircle2,
} from 'lucide-react';

export default function SummaryNode({ id, data }: NodeProps<SummaryNodeType>) {
  const nodes = useNodes();
  const setNode = useSetNode();
  const toggleNodeSelectionMode = useToggleNodeSelectionMode();
  const isNodeSelectionMode = useIsNodeSelectionMode();
  const addSelectedNode = useAddSelectedNode();
  const removeSelectedNode = useRemoveSelectedNode();

  const selectedNodes = useSelectedNodes();
  const isSelected = selectedNodes.some((node) => node.id === id);

  const handleEditClick = () => {
    const currentNode = nodes.find((node) => node.id === id);

    if (currentNode) {
      setNode(id, {
        ...currentNode,
        type: 'ANSWER',
        data: {
          ...currentNode.data,
          isEditing: true,
        },
      });
    }
  };

  const handleActiveNodeSelectionMode = () => {
    const currentNode = nodes.find((node) => node.id === id);
    if (!currentNode) return;
    addSelectedNode(currentNode);

    toggleNodeSelectionMode();
  };

  const handleNodeClick = () => {
    if (!isNodeSelectionMode) return;

    const currentNode = nodes.find((node) => node.id === id);
    if (!currentNode) return;

    if (isSelected) {
      removeSelectedNode(id);
    } else {
      addSelectedNode(currentNode);
    }
  };

  const nodeClass = isNodeSelectionMode
    ? isSelected
      ? 'border-[#8D5CF6] border-2 cursor-pointer'
      : 'border-1 border-[#414141] cursor-pointer hover:border-[#BDB3F6]'
    : 'border-1 border-[#414141]';

  return (
    <div
      className={`w-auto flex items-center relative z-100 group gap-[10px] `}
    >
      <div
        className={`flex items-center  justify-end gap-4 transition-opacity duration-300 ease-in-out shrink-0
            ${isNodeSelectionMode ? 'invisible opacity-0' : ' invisible opacity-0 group-hover:visible opacity-100'}`}
      >
        <PencilLine
          size={30}
          color="#414141"
          className="cursor-pointer hover:text-black transition-colors z-20"
          onClick={handleEditClick}
        />
        <CornerDownRight
          size={30}
          color="#414141"
          className="cursor-pointer hover:text-black transition-colors z-20"
          onClick={handleActiveNodeSelectionMode}
        />

        <div className="dragHandle cursor-grab z-20">
          <GripVertical
            size={30}
            color="#414141"
            className="cursor-pointer hover:text-black transition-colors"
          />
        </div>
      </div>
      <div
        className={`w-auto px-8 py-[30px] flex items-start ${nodeClass} bg-white rounded-lg group flex-col gap-[10px]`}
        onClick={handleNodeClick}
      >
        <div className="flex-1">
          <p className="text-[24px] font-semibold">{data.summary}</p>
        </div>

        {isNodeSelectionMode && isSelected && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 size={30} className="text-[#8D5CF6]" />
          </div>
        )}
      </div>

      {<NodeHandles type="full" />}
    </div>
  );
}
