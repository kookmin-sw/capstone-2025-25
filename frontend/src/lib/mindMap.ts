import { MindMapNode, MindMapEdge } from '@/types/mindMap';

/**
 * 특정 노드의 하위 노드 ID들을 재귀적으로 찾습니다.
 * @param nodes 노드 배열
 * @param rootId 탐색을 시작할 루트 노드 ID
 * @param includeRoot 결과에 루트 노드 ID를 포함할지 여부
 * @returns 하위 노드 ID Set (선택적으로 루트 노드 포함)
 */
export const findChildNodes = (
  nodes: MindMapNode[],
  rootId: string,
  includeRoot: boolean = true,
): Set<string> => {
  const nodesToProcess = new Set<string>(includeRoot ? [rootId] : []);

  const findChildrenRecursively = (id: string) => {
    const childNodes = nodes.filter((node) => node.parentId === id);

    childNodes.forEach((child) => {
      nodesToProcess.add(child.id);
      findChildrenRecursively(child.id);
    });
  };

  findChildrenRecursively(rootId);

  return nodesToProcess;
};

/**
 * 노드 ID 목록을 기반으로 노드와 엣지를 필터링합니다.
 * @param nodes 노드 배열
 * @param edges 엣지 배열
 * @param nodesToRemove 삭제할 노드 ID Set
 * @returns 필터링된 노드와 엣지
 */
export const filterNodesAndEdges = (
  nodes: MindMapNode[],
  edges: MindMapEdge[],
  nodesToRemove: Set<string>,
) => {
  const filteredNodes = nodes.filter((node) => !nodesToRemove.has(node.id));
  const filteredEdges = edges.filter(
    (edge) =>
      !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target),
  );

  return { filteredNodes, filteredEdges };
};
