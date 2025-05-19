export type BrainStormingAnalyzeReq = {
  chunk: string;
};

type MindmapDataItem = {
  context: string;
};

export type BrainStormingRewriteReq = {
  existing_chunk: string;
  mindmap_data: MindmapDataItem[];
};

export type MergeBubbleReq = {
  chunks: string[];
};

