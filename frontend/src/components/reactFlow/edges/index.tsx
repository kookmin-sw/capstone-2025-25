import {
  BaseEdge,
  getSimpleBezierPath,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';

type MindMapEdgeType = Edge<Record<string, never>, 'mindmapEdge'>;

function MindMapEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps<MindMapEdgeType>) {
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY: sourceY + 36,
    targetX,
    targetY: targetY + 36,
    sourcePosition,
    targetPosition,
  });

  return <BaseEdge id={id} path={edgePath} />;
}

export default MindMapEdge;
