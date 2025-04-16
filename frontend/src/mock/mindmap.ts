import { MindMap } from '@/types/mindMap';

export const mockMindMaps: MindMap[] = [
  {
    id: 23123123,
    title: '운동하기',
    type: 'TODO',
    lastModifiedAt: '2025-04-12T04:16:18.018Z',
    nodes: [
      {
        id: '1',
        type: 'root',
        data: {
          label: '운동하기',
          depth: 0,
          recommendedQuestions: [
            '운동하는 시간을 선호하는 시간대는 언제인가요?',
            '운동 목표에 대한 구체적인 계획은 무엇인가요?',
            '운동 후 회복을 위한 활동은 어떻게 계획하고 있나요?',
          ],
        },
        position: {
          x: 0,
          y: 0,
        },
        measured: {
          width: 250,
          height: 119,
        },
      },
      {
        id: 'uxlQN81Ebq0PlGHsrKdze',
        type: 'summary',
        data: {
          label: '운동을 위해 원하는 운동 종류는 무엇인가요?',
          depth: 1,
          recommendedQuestions: [
            '운동을 위해 축구와 기능성 운동을 하기 위한 구체적인 일정은 어떻게 구성할 수 있을까요?',
            '주차별 운동 목표를 어떻게 설정할 수 있을까요?',
            '축구 연습과 기능성 운동을 어떤 요일에 분배하면 좋을까요?',
            '운동을 진행할 장소는 어디로 정할 수 있을까요?',
            '운동 외에 필요한 준비물이나 장비는 무엇이 있을까요?',
          ],
          isPending: false,
          answer: '축구와 기능성 운동!',
          summary: '운동을 위해 축구와 기능성 운동을 원한다.',
        },
        position: {
          x: 518.6945846041378,
          y: 42.71848801718424,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'B2VExZjto9WGhC-mbXOKx',
        type: 'summary',
        data: {
          label: '운동을 시작하기 위한 최적의 시간을 언제로 정할 수 있을까요?',
          depth: 2,
          recommendedQuestions: [],
          isPending: false,
          answer: '저녁 시간에 할거야',
          summary: '운동을 시작하기 위한 최적의 시간은 저녁이다.',
        },
        position: {
          x: 692.4383699010125,
          y: 335.1272731534903,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'Nnl3RXHcCgf-EW2xAhLr5',
        type: 'summary',
        data: {
          label: '주당 몇 번 운동할 계획인가요?',
          depth: 1,
          recommendedQuestions: [
            '운동할 요일과 시간을 어떻게 정할 계획인가요?',
            '운동 종류나 목표를 어떤 것들로 설정하고 있나요?',
            '운동 후 회복을 위해 어떤 루틴을 계획하고 있나요?',
            '운동을 위한 필요한 장비나 시설은 무엇이 있을까요?',
            '운동을 지속하기 위해 어떤 동기 부여 방법을 사용할 건가요?',
          ],
          isPending: false,
          answer: '5번 정도 할 계획이야',
          summary: '주당 5번 정도 운동할 계획이다.',
        },
        position: {
          x: -361.5384366327005,
          y: 286.15500441199447,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
        dragging: false,
      },
      {
        id: 'TKs3tPQueLJx-3Tqha_Lm',
        type: 'summary',
        data: {
          label: '운동을 혼자 할 것인가, 친구나 그룹과 함께 할 것인가요?',
          depth: 2,
          recommendedQuestions: [],
          isPending: false,
          answer: '혼자도 하고 친구들과도 할 것 같아',
          summary: '혼자서도 운동하고 친구들과도 함께 운동할 것 같다.',
        },
        position: {
          x: -375.38838889260126,
          y: 564.2661428176442,
        },
        measured: {
          width: 538,
          height: 122,
        },
        selected: false,
      },
      {
        id: '53so4XZQyzfUDm-8hwnMp',
        type: 'summary',
        data: {
          label: '운동을 할 수 있는 장소는 어디인가요?',
          depth: 1,
          recommendedQuestions: [],
          isPending: false,
          answer: '학교 운동장!',
          summary: '운동을 할 수 있는 장소는 학교 운동장입니다.',
        },
        position: {
          x: -569.5289010603132,
          y: -45.38338131513228,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: true,
      },
    ],
    edges: [
      {
        id: 'e1-uxlQN81Ebq0PlGHsrKdze',
        source: '1',
        target: 'uxlQN81Ebq0PlGHsrKdze',
        type: 'mindmapEdge',
      },
      {
        id: 'euxlQN81Ebq0PlGHsrKdze-B2VExZjto9WGhC-mbXOKx',
        source: 'uxlQN81Ebq0PlGHsrKdze',
        target: 'B2VExZjto9WGhC-mbXOKx',
        type: 'mindmapEdge',
      },
      {
        id: 'e1-Nnl3RXHcCgf-EW2xAhLr5',
        source: '1',
        target: 'Nnl3RXHcCgf-EW2xAhLr5',
        type: 'mindmapEdge',
      },
      {
        id: 'eNnl3RXHcCgf-EW2xAhLr5-TKs3tPQueLJx-3Tqha_Lm',
        source: 'Nnl3RXHcCgf-EW2xAhLr5',
        target: 'TKs3tPQueLJx-3Tqha_Lm',
        type: 'mindmapEdge',
      },
      {
        id: 'e1-53so4XZQyzfUDm-8hwnMp',
        source: '1',
        target: '53so4XZQyzfUDm-8hwnMp',
        type: 'mindmapEdge',
      },
    ],
    linked: true,
    eisenhowerItemDTO: {
      id: 1,
      title: '운동하기',
      memo: '축구에 관한 운동',
      dueDate: '2025-03-01',
      type: 'TODO',
      quadrant: 'Q1',
      order: 0,
      isCompleted: false,
      createdAt: '2025-03-02',
    },
  },

  {
    id: 1045253,
    title: '여행 계획',
    type: 'TODO',
    lastModifiedAt: '2025-04-12T04:16:18.018Z',
    nodes: [
      {
        id: '1',
        type: 'root',
        data: {
          label: '여행 계획',
          depth: 0,
          recommendedQuestions: [
            '어떤 지역으로 여행을 가고 싶으신가요?',
            '여행 기간은 얼마나 생각하고 계신가요?',
            '여행 예산은 어느 정도로 계획하고 계신가요?',
          ],
        },
        position: {
          x: 0,
          y: 0,
        },
        measured: {
          width: 250,
          height: 119,
        },
      },
      {
        id: 'destinationNode',
        type: 'summary',
        data: {
          label: '어떤 나라나 도시로 여행을 가고 싶으신가요?',
          depth: 1,
          recommendedQuestions: [
            '일본 여행에서 꼭 방문하고 싶은 도시는 어디인가요?',
            '일본 여행에서 어떤 경험을 해보고 싶으신가요?',
            '일본 여행 시 현지 음식 중 먹어보고 싶은 것은 무엇인가요?',
            '일본의 어떤 문화적 체험에 관심이 있으신가요?',
            '일본 여행에서 쇼핑 계획은 어떻게 되나요?',
          ],
          isPending: false,
          answer: '일본으로 가고 싶어!',
          summary: '일본으로 여행을 가고 싶다.',
        },
        position: {
          x: 450,
          y: 50,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'tripDurationNode',
        type: 'summary',
        data: {
          label: '여행 기간은 얼마나 계획하고 계신가요?',
          depth: 1,
          recommendedQuestions: [
            '5일 동안의 일정을 어떻게 구성할 계획인가요?',
            '숙소는 어떤 형태로 예약할 계획인가요?',
            '현지 교통은 어떻게 이용할 계획인가요?',
            '여행 중 시간 관리는 어떻게 할 계획인가요?',
          ],
          isPending: false,
          answer: '5일 정도 갈 계획이야',
          summary: '5일 동안 여행할 계획이다.',
        },
        position: {
          x: -350,
          y: 280,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'transportationNode',
        type: 'summary',
        data: {
          label: '교통수단은 어떻게 계획하고 계신가요?',
          depth: 2,
          recommendedQuestions: [],
          isPending: false,
          answer: '비행기로 가고 현지에서는 대중교통 이용할 거야',
          summary: '비행기로 이동하고 현지에서는 대중교통을 이용할 계획이다.',
        },
        position: {
          x: -370,
          y: 550,
        },
        measured: {
          width: 538,
          height: 122,
        },
        selected: false,
      },
      {
        id: 'budgetNode',
        type: 'summary',
        data: {
          label: '여행 예산은 어느 정도로 생각하고 계신가요?',
          depth: 1,
          recommendedQuestions: [],
          isPending: false,
          answer: '150만원 정도로 생각 중이야',
          summary: '여행 예산은 150만원 정도로 계획하고 있다.',
        },
        position: {
          x: -550,
          y: -50,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
    ],
    edges: [
      {
        id: 'e1-destinationNode',
        source: '1',
        target: 'destinationNode',
        type: 'mindmapEdge',
      },
      {
        id: 'e1-tripDurationNode',
        source: '1',
        target: 'tripDurationNode',
        type: 'mindmapEdge',
      },
      {
        id: 'etripDurationNode-transportationNode',
        source: 'tripDurationNode',
        target: 'transportationNode',
        type: 'mindmapEdge',
      },
      {
        id: 'e1-budgetNode',
        source: '1',
        target: 'budgetNode',
        type: 'mindmapEdge',
      },
    ],
    linked: false,
  },

  {
    id: 4920304,
    title: '학습 계획',
    type: 'TODO',
    lastModifiedAt: '2025-04-12T04:16:18.018Z',
    nodes: [
      {
        id: '1',
        type: 'root',
        data: {
          label: '학습 계획',
          depth: 0,
          recommendedQuestions: [
            '어떤 과목을 공부하고 싶으신가요?',
            '학습 목표는 무엇인가요?',
            '하루에 얼마나 공부할 계획인가요?',
          ],
        },
        position: {
          x: 0,
          y: 0,
        },
        measured: {
          width: 250,
          height: 119,
        },
      },
      {
        id: 'subjectNode',
        type: 'summary',
        data: {
          label: '어떤 과목이나 분야를 공부하고 싶으신가요?',
          depth: 1,
          recommendedQuestions: [
            '프로그래밍 중에서도 어떤 언어나 프레임워크에 관심이 있으신가요?',
            '프로그래밍 학습에 있어서 목표 수준은 어느 정도인가요?',
            '프로그래밍 실력을 어떤 방식으로 활용하고 싶으신가요?',
            '프로그래밍 학습에 활용할 자료나 강의는 어떤 것들이 있나요?',
            '프로그래밍 학습을 위한 커뮤니티나 스터디 그룹을 활용할 계획이 있으신가요?',
          ],
          isPending: false,
          answer: '프로그래밍을 배우고 싶어!',
          summary: '프로그래밍을 배우고 싶다.',
        },
        position: {
          x: 500,
          y: 45,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'programmingLanguageNode',
        type: 'summary',
        data: {
          label: '어떤 프로그래밍 언어에 관심이 있으신가요?',
          depth: 2,
          recommendedQuestions: [],
          isPending: false,
          answer: '파이썬과 자바스크립트를 배우고 싶어',
          summary: '파이썬과 자바스크립트를 배우고 싶다.',
        },
        position: {
          x: 680,
          y: 330,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'studyTimeNode',
        type: 'summary',
        data: {
          label: '하루에 얼마나 공부할 계획인가요?',
          depth: 1,
          recommendedQuestions: [
            '2시간 학습 시간을 언제로 배정할 계획인가요?',
            '학습 시간을 효율적으로 활용하기 위한 방법은 무엇인가요?',
            '휴식은 어떻게 취할 계획인가요?',
            '학습 진도를 어떻게 관리할 계획인가요?',
            '집중력을 유지하기 위한 방법은 무엇인가요?',
          ],
          isPending: false,
          answer: '하루 2시간 정도 공부할 거야',
          summary: '하루 2시간 정도 공부할 계획이다.',
        },
        position: {
          x: -350,
          y: 290,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'studyMethodNode',
        type: 'summary',
        data: {
          label: '어떤 방식으로 공부할 계획인가요?',
          depth: 1,
          recommendedQuestions: [],
          isPending: false,
          answer: '온라인 강의와 책으로 공부할 계획이야',
          summary: '온라인 강의와 책을 통해 공부할 계획이다.',
        },
        position: {
          x: -540,
          y: -50,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
    ],
    edges: [
      {
        id: 'e1-subjectNode',
        source: '1',
        target: 'subjectNode',
        type: 'mindmapEdge',
      },
      {
        id: 'esubjectNode-programmingLanguageNode',
        source: 'subjectNode',
        target: 'programmingLanguageNode',
        type: 'mindmapEdge',
      },
      {
        id: 'e1-studyTimeNode',
        source: '1',
        target: 'studyTimeNode',
        type: 'mindmapEdge',
      },
      {
        id: 'e1-studyMethodNode',
        source: '1',
        target: 'studyMethodNode',
        type: 'mindmapEdge',
      },
    ],
    linked: true,
    eisenhowerItemDTO: {
      id: 5,
      title: '학습 계획',
      memo: '프로그래밍 관련 학습 계획',
      dueDate: '2025-03-13',
      quadrant: 'Q3',
      type: 'THINKING',
      order: 0,
      isCompleted: false,
      createdAt: '2025-03-02',
    },
  },

  {
    id: 126433,
    title: '취미 생활',
    type: 'THINKING',
    lastModifiedAt: '2025-04-12T04:16:18.018Z',
    nodes: [
      {
        id: '1',
        type: 'root',
        data: {
          label: '취미 생활',
          depth: 0,
          recommendedQuestions: [
            '어떤 취미에 관심이 있으신가요?',
            '취미 활동에 투자할 수 있는 시간은 얼마나 되나요?',
            '취미 활동을 통해 얻고 싶은 것은 무엇인가요?',
          ],
        },
        position: {
          x: 0,
          y: 0,
        },
        measured: {
          width: 250,
          height: 119,
        },
      },
      {
        id: 'hobbyTypeNode',
        type: 'summary',
        data: {
          label: '어떤 취미에 관심이 있으신가요?',
          depth: 1,
          recommendedQuestions: [
            '그림 그리기에서 어떤 화풍이나 매체에 관심이 있으신가요?',
            '그림 실력을 향상시키기 위한 구체적인 계획이 있으신가요?',
            '그림 그리기를 배우기 위해 어떤 자료나 강의를 활용할 계획인가요?',
            '그림 그리기를 위한 도구나 재료는 어떤 것들을 준비하고 계신가요?',
            '그림을 그리면서 만들고 싶은 작품 유형은 무엇인가요?',
          ],
          isPending: false,
          answer: '그림 그리기에 관심이 있어!',
          summary: '그림 그리기에 관심이 있다.',
        },
        position: {
          x: 470,
          y: 40,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'artStyleNode',
        type: 'summary',
        data: {
          label: '어떤 그림 스타일에 관심이 있으신가요?',
          depth: 2,
          recommendedQuestions: [],
          isPending: false,
          answer: '수채화와 디지털 아트에 관심이 있어',
          summary: '수채화와 디지털 아트에 관심이 있다.',
        },
        position: {
          x: 650,
          y: 320,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'hobbyTimeNode',
        type: 'summary',
        data: {
          label: '취미 활동에 투자할 수 있는 시간은 얼마나 되나요?',
          depth: 1,
          recommendedQuestions: [
            '주말에 취미 활동을 할 때 어떤 시간대에 하면 좋을까요?',
            '주변에 그림 그리기를 같이 할 수 있는 모임이나 클래스가 있나요?',
            '취미 활동을 꾸준히 하기 위한 동기부여 방법은 무엇이 있을까요?',
            '취미 활동 중간에 휴식을 어떻게 취할 계획인가요?',
          ],
          isPending: false,
          answer: '주로 주말에 시간을 낼 수 있어',
          summary: '주로 주말에 취미 활동 시간을 낼 수 있다.',
        },
        position: {
          x: -380,
          y: 270,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
      {
        id: 'hobbyGoalNode',
        type: 'summary',
        data: {
          label: '취미 활동을 통해 얻고 싶은 것은 무엇인가요?',
          depth: 1,
          recommendedQuestions: [],
          isPending: false,
          answer: '스트레스 해소와 창의력 향상',
          summary: '취미 활동을 통해 스트레스 해소와 창의력 향상을 원한다.',
        },
        position: {
          x: -520,
          y: -60,
        },
        measured: {
          width: 538,
          height: 92,
        },
        selected: false,
      },
    ],
    edges: [
      {
        id: 'e1-hobbyTypeNode',
        source: '1',
        target: 'hobbyTypeNode',
        type: 'mindmapEdge',
      },
      {
        id: 'ehobbyTypeNode-artStyleNode',
        source: 'hobbyTypeNode',
        target: 'artStyleNode',
        type: 'mindmapEdge',
      },
      {
        id: 'e1-hobbyTimeNode',
        source: '1',
        target: 'hobbyTimeNode',
        type: 'mindmapEdge',
      },
      {
        id: 'e1-hobbyGoalNode',
        source: '1',
        target: 'hobbyGoalNode',
        type: 'mindmapEdge',
      },
    ],
    linked: false,
  },
];
