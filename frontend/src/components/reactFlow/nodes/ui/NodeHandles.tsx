import { Handle, Position } from '@xyflow/react';
import { useIsNodeSelectionMode } from '@/store/nodeSelection';

const SimpleHandles = () => (
  <>
    <Handle type="target" position={Position.Top} className="opacity-0" />
    <Handle type="source" position={Position.Top} className="opacity-0" />
  </>
);

const FullNodeHandles = () => {
  const isNodeSelectionMode = useIsNodeSelectionMode();

  if (isNodeSelectionMode) {
    return (
      <>
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle type="source" position={Position.Top} className="opacity-0" />
      </>
    );
  }

  return (
    <>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle
        type="source"
        position={Position.Top}
        className="opacity-0"
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
    </>
  );
};

type NodeHandlesProps = {
  type?: 'simple' | 'full';
};

export default function NodeHandles({ type = 'simple' }: NodeHandlesProps) {
  return <>{type === 'simple' ? <SimpleHandles /> : <FullNodeHandles />}</>;
}
