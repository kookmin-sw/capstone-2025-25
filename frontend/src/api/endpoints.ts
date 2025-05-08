export const ENDPOINTS = {
  /* 마인드맵 관련 엔드포인트 */
  MINDMAP: {
    GENERATE_TODO: '/api/gpt/generate/todo-questions',
    GENERATE_THOUGHT: '/api/gpt/generate/thinking-questions',
    CONVERT_TO_TASK: '/api/gpt/convert-to-task',
    SUMMARIZE_NODE: '/api/gpt/summarize-node',

    CREATE_ROOT_NODE: '/api/mindmap/root',
    GET_LIST: '/api/mindmap/list',
    DETAIL: (id: number) => `/api/mindmap/${id}`,
  },

  /* 인증 관련 엔드포인트 */
  AUTH: {
    ACCESS_TOKEN: '/api/auth/token',
    REFRESH_TOKEN: '/api/auth/reissue',
  },

  /* 오늘의 할 일 관련 엔드포인트 */
  TODAY: {
    LIST: '/api/v2/today-task',
    YESTERDAY_LIST: '/api/v2/today-task/yesterday',
    GET_COUNT: '/api/v2/today-task/count',
  },
};
