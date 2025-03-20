import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import {
  GeneratedScheduleReq,
  GeneratedThoughtReq,
  ConvertedScheduleTodoReq,
  ConvertedThoughtListReq,
  SummarizedNodeReq,
} from '../../types/api/mindmap';

export const useGenerateSchedule = () => {
  return useMutation({
    mutationFn: (data: GeneratedScheduleReq) =>
      mindmapService.generateSchedule(data),
  });
};

export const useGenerateThought = () => {
  return useMutation({
    mutationFn: (data: GeneratedThoughtReq) =>
      mindmapService.generateThought(data),
  });
};

export const useConvertScheduleToTodo = () => {
  return useMutation({
    mutationFn: (data: ConvertedScheduleTodoReq) =>
      mindmapService.convertScheduleToTodo(data),
  });
};

export const useConvertThoughtToList = () => {
  return useMutation({
    mutationFn: (data: ConvertedThoughtListReq) =>
      mindmapService.convertThoughtToList(data),
  });
};

export const useSummarizeNode = () => {
  return useMutation({
    mutationFn: (data: SummarizedNodeReq) => mindmapService.summarizeNode(data),
  });
};
