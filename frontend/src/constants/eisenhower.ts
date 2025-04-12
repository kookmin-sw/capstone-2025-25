export const SECTION_IDS = [
  'section1',
  'section2',
  'section3',
  'section4',
] as const;

export const SECTION_TITLES: Record<(typeof SECTION_IDS)[number], string> = {
  section1: '긴급하고 중요한 일',
  section2: '긴급하지 않지만 중요한 일',
  section3: '긴급하지만 중요하지 않은 일',
  section4: '긴급하지도 중요하지도 않은 일',
};
