import { BaseEdge, EdgeProps, getSimpleBezierPath } from '@xyflow/react';

function MindMapEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  ...props
}: EdgeProps) {
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY: sourceY + 36,
    targetX,
    targetY: targetY + 36,
    sourcePosition,
    targetPosition,
  });

  return <BaseEdge path={edgePath} {...props} />;
}

export default MindMapEdge;
