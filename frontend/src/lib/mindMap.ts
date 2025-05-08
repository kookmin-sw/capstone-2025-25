import { MindMapNode, MindMapEdge } from '@/types/mindMap';

/**
 * 특정 노드의 하위 노드 ID들을 재귀적으로 찾습니다.
 * @param nodes 노드 배열
 * @param rootId 탐색을 시작할 루트 노드 ID
 * @param includeRoot 결과에 루트 노드 ID를 포함할지 여부
 * @returns 하위 노드 ID Set (선택적으로 루트 노드 포함)
 */
export const findChildNodes = (
  edges: MindMapEdge[],
  rootId: string,
  includeRoot: boolean = true,
): Set<string> => {
  const nodesToProcess = new Set<string>(includeRoot ? [rootId] : []);

  const findChildrenRecursively = (id: string) => {
    const childEdges = edges.filter((edge) => edge.source === id);

    childEdges.forEach((edge) => {
      const childId = edge.target;
      nodesToProcess.add(childId);
      findChildrenRecursively(childId);
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

export const findParentNode = (
  nodes: MindMapNode[],
  edges: MindMapEdge[],
  childId: string,
): MindMapNode | undefined => {
  // 자식 노드를 타겟으로 하는 엣지 찾기
  const parentEdge = edges.find((edge) => edge.target === childId);

  if (!parentEdge) return undefined;

  // 부모 노드 ID로 노드 찾기
  return nodes.find((node) => node.id === parentEdge.source);
};
