import { useCallback, useRef, useEffect } from 'react';
import useUpdateMindmap from '@/hooks/queries/mindmap/useUpdateMindmap';
import { MindMapNode, MindMapEdge } from '@/types/mindMap';
import { UpdateMindmapReq } from '@/types/api/mindmap';

export const useDebounceMindmapUpdate = (
  mindmapId: number | undefined,
  debounceTime = 5000,
) => {
  const { updateMindmapMutation } = useUpdateMindmap();
  const debounceSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceSaveTimerRef.current) {
        clearTimeout(debounceSaveTimerRef.current);
      }
    };
  }, []);

  const debounceSave = useCallback(
    (nodes: MindMapNode[], edges: MindMapEdge[]) => {
      if (debounceSaveTimerRef.current) {
        clearTimeout(debounceSaveTimerRef.current);
      }

      if (!mindmapId) return;

      debounceSaveTimerRef.current = setTimeout(() => {
        const updateData: UpdateMindmapReq = {
          nodes,
          edges,
        };

        updateMindmapMutation(
          {
            id: mindmapId,
            data: updateData,
          },
          {
            onSuccess: () => {},
            onError: (error) => {
              console.error('error', error);
            },
          },
        );

        debounceSaveTimerRef.current = null;
      }, debounceTime);
    },
    [mindmapId, updateMindmapMutation, debounceTime],
  );

  const forceSave = useCallback(
    (nodes: MindMapNode[], edges: MindMapEdge[]) => {
      if (debounceSaveTimerRef.current) {
        clearTimeout(debounceSaveTimerRef.current);
        debounceSaveTimerRef.current = null;
      }

      if (!mindmapId) return;

      const updateData: UpdateMindmapReq = {
        nodes,
        edges,
      };

      updateMindmapMutation(
        {
          id: mindmapId,
          data: updateData,
        },
        {
          onSuccess: () => {},
          onError: (error) => {
            console.error('error', error);
          },
        },
      );

      console.log('마인드맵이 강제 저장되었습니다.');
    },
    [mindmapId, updateMindmapMutation],
  );

  return { debounceSave, forceSave };
};
