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
    sourceY: sourceY + 18,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return <BaseEdge path={edgePath} {...props} />;
}

export default MindMapEdge;
