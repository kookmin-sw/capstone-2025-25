export type GeneratedScheduleRes = {
  generated_questions: string[];
};

export type GeneratedThoughtRes = {
  generated_questions: string[];
};

export type ConvertedToTaskRes = {
  task: {
    title: string;
  };
};

export type SummarizedNodeRes = {
  summary: string;
};
