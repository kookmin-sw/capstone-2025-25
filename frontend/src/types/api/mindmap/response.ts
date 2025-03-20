export type GeneratedScheduleRes = {
  generated_questions: string[];
};

export type GeneratedThoughtRes = {
  generated_questions: string[];
};

export type ConvertedScheduleTodoRes = {
  todo_list: string[];
};

export type ConvertedThoughtListRes = {
  thought_list: {
    summary: string;
    description: string;
  }[];
};

export type SummarizedNodeRes = {
  summary: string;
};
