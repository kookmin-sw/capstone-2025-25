export type BrainStormingAnalyzeRes = {
  clarifying_questions: string[];
};

export type BrainStormingRewriteRes = {
  new_chunk: string;
};

export type MergeBubbleRes = {
  merged_chunk: string
}