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
        type: 'answer',
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
      ? 'border-purple-500 border-2 cursor-pointer'
      : 'border-1 border-[#b3cbfa] cursor-pointer hover:border-purple-300'
    : 'border-1 border-[#b3cbfa]';

  return (
    <div
      className={`w-[538px] px-8 py-[30px] flex items-center ${nodeClass} bg-white rounded-lg relative z-100 group`}
      onClick={handleNodeClick}
    >
      <div className="flex-1">
        <p className="text-[20px] font-semibold">{data.summary}</p>
      </div>

      {isNodeSelectionMode && isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 size={20} className="text-purple-500" />
        </div>
      )}

      <div
        className={`flex items-center gap-4 transition-opacity duration-300 ease-in-out
            ${isNodeSelectionMode ? 'invisible opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <PencilLine
          size={20}
          color="#B9B9B7"
          className="cursor-pointer hover:text-black transition-colors z-20"
          onClick={handleEditClick}
        />
        <CornerDownRight
          size={20}
          color="#B9B9B7"
          className="cursor-pointer hover:text-black transition-colors z-20"
          onClick={handleActiveNodeSelectionMode}
        />

        <div className="dragHandle cursor-grab z-20">
          <GripVertical
            size={20}
            color="#B9B9B7"
            className="cursor-pointer hover:text-black transition-colors"
          />
        </div>
      </div>

      {<NodeHandles type="full" />}
    </div>
  );
}
