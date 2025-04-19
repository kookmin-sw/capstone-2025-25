/* API 엔드포인트 상수 관리 */

export const ENDPOINTS = {
  /* 마인드맵 관련 엔드포인트 */
  MINDMAP: {
    GENERATE_SCHEDULE: '/api/gpt/generate_schedule',
    GENERATE_THOUGHT: '/api/gpt/generate_thought',
    CONVERT_TO_TASK: '/api/gpt/convert_to_task',
    SUMMARIZE_NODE: '/api/gpt/summarize_node',

    CREATE_ROOT_NODE: '/api/mindmap/root',
  },
  AUTH: {
    ACCESS_TOKEN: '/api/auth/token',
    REFRESH_TOKEN: '/api/auth/reissue',
  },
};
