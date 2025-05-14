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
  BRAINSTORMING: {
    DELETE_BUBBLE: (id: number) => `/api/v2/bubble/${id}`,
    GET_BUBBLES: '/api/v2/bubble',
    CREATE_BUBBLE: '/api/v2/bubble/create',
    PATCH_BUBBLE: (id: number) => `/api/v2/bubble/${id}`,
  },

  /* 인증 관련 엔드포인트 */
  AUTH: {
    ACCESS_TOKEN: '/api/auth/token',
    REFRESH_TOKEN: '/api/auth/reissue',
    WITHDRAW: '/api/auth',
  },

  /* 아이젠하워 작업 관련 엔드포인트 */
  EISENHOWER: {
    GET_ALL: '/api/v1/eisenhower', // 아이젠하워 작업 전체 조회
    GET_ONE: (itemId: number) => `/api/v1/eisenhower/${itemId}`, // 아이젠하워 작업 조회
    SEARCH: '/api/v1/eisenhower/search', // 아이젠하워 작업 검색
    CREATE: '/api/v1/eisenhower', // 아이젠하워 작업 생성
    UPDATE: (itemId: number) => `/api/v1/eisenhower/${itemId}`, // 아이젠하워 작업 수정
    DELETE: (itemId: number) => `/api/v1/eisenhower/${itemId}`, // 아이젠하워 작업 삭제
    UPDATE_ORDER: '/api/v1/eisenhower/order', // 아이젠하워 작업들 순서 및 사분면 위치 업데이트
  },

  /* 아이젠하워 카테고리 관련 엔드포인트 */
  EISENHOWER_CATEGORY: {
    GET_ALL: '/api/v1/eisenhower/category', // 카테고리 전체 조회
    CREATE: '/api/v1/eisenhower/category', // 카테고리 생성
    UPDATE: (categoryId: number) => `/api/v1/eisenhower/category/${categoryId}`, // 카테고리 수정
    DELETE: (categoryId: number) => `/api/v1/eisenhower/category/${categoryId}`, // 카테고리 삭제,
  },

  /* 오늘의 할 일 관련 엔드포인트 */
  TODAY: {
    CREATE: (eisenhowerId: number) => `/api/v2/today-task/${eisenhowerId}`,
    LIST: '/api/v2/today-task',
    YESTERDAY_LIST: '/api/v2/today-task/yesterday',
    GET_COUNT: '/api/v2/today-task/count',
    COMPLETE_COUNT: '/api/v2/today-task/completed',
    MOVE_TODAY: (id: number) => `/api/v2/today-task/move-today/${id}`,
    UPDATE_STATUS: (id: number) => `/api/v2/today-task/status/${id}`,
    DELETE: (id: number) => `/api/v2/today-task/${id}`,
  },

  POMODORO: {
    PATCH_POMODORO: '/api/v2/pomodoro',
  },

  /* 카테고리 관련 엔드포인트 */
  CATEGORY: {
    LIST: '/api/v1/eisenhower/category',
  },

  /* GPT API 관련 엔드포인트 */
  GPT: {
    BRAINSTORMING: {
      ANALYZE: '/api/brainstorming/analyze/chunk',
      REWRITE: '/api/brainstorming/rewrite/chunk',
    },
    EISENHOWER: {
      RECOMMEND: '/api/eisenhower/order-recommendation',
    },
  },

  /* 보관홤 관련 API */
  INVENTORY: {
    FOLDER: {
      LIST: '/api/v2/inventory/folder',
      CREATE: '/api/v2/inventory/folder',
      DELETE: (id: number) => `/api/v2/inventory/folder/${id}`,
      DETAIL: (id: number) => `/api/v2/inventory/folder/${id}`,
      UPDATE_NAME: (id: number) => `/api/v2/inventory/folder/${id}`,
    },
    ITEM: {
      LIST: (id: number) => `/api/v2/inventory/${id}`,
      UPDATE_ITEM: (id: number) => `/api/v2/inventory/item/${id}`,
      MOVE_FOLDER: (id: number) => `/api/v2/inventory/move/${id}`,
      DELETE: (id: number) => `/api/v2/inventory/item/${id}`,
      RECENT: '/api/v2/inventory/recent',
      CREATE_ITEM: (id: number) => `/api/v2/bubble/confirm-inventory/${id}`,
    },
  },

  /* 분석 관련 API */
  ANALYSIS: {
    TODAY_TASK: '/api/v2/today-task/analysis',
    POMODORO: '/api/v2/data/pomodoro/week',
  },
};
