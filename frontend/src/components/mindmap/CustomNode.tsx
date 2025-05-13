import { useMindmapStore } from '@/store/mindMapStore';
import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { CirclePlus } from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';

type CustomNodeData = {
  label: string;
  layoutDirection: string;
};

export default function CustomNode({
  data,
  id,
  isConnectable,
}: NodeProps<Node<CustomNodeData>>) {
  const isHorizontal = data.layoutDirection === 'LR';
  const [labelText, setLabelText] = useState(data.label || '');
  const nodeRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isRootNode = id === '1';

  const updateNodeLabel = useMindmapStore((state) => state.updateNodeLabel);
  const updateNodeHeight = useMindmapStore((state) => state.updateNodeHeight);
  const addChildNode = useMindmapStore((state) => state.addChildNode);

  useEffect(() => {
    setLabelText(data.label || '');
  }, [data.label]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      if (nodeRef.current) {
        const totalHeight = nodeRef.current.offsetHeight;
        updateNodeHeight(id, totalHeight);
      }
    }
  }, [labelText, id, updateNodeHeight]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isRootNode) return;

      const newValue = e.target.value;
      setLabelText(newValue);

      updateNodeLabel(id, newValue);
    },
    [id, updateNodeLabel, isRootNode],
  );

  const handlePlusClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      addChildNode(id);
    },
    [id, addChildNode],
  );

  return (
    <div
      ref={nodeRef}
      className={`px-6 py-4 bg-white border border-[#CDCED6] rounded-md w-[172px] relative ${
        isRootNode ? 'bg-blue-50' : ''
      }`}
    >
      {isRootNode ? (
        <div className="text-[14px] text-center font-semibold w-full min-h-[20px]">
          {labelText}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={labelText}
          onChange={handleChange}
          placeholder="텍스트를 입력하세요"
          className="text-[14px] text-center font-semibold w-full outline-none bg-transparent resize-none overflow-hidden min-h-[20px]"
          rows={1}
        />
      )}

      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-10"
        onClick={handlePlusClick}
      >
        <CirclePlus
          className="plus-btn cursor-pointer text-blue bg-white rounded-full"
          size={16}
        />
      </div>

      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        id="source"
        className="opacity-0"
        style={{ width: '1px', height: '1px' }}
        isConnectable={isConnectable}
      />

      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        id="target"
        className="opacity-0"
        style={{ width: '1px', height: '1px' }}
        isConnectable={isConnectable}
      />
    </div>
  );
}
