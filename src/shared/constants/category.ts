// IA의 카테고리 필터와 exhibition.json의 Work.category 표기 매핑.
// category는 "웹/앱, VR"처럼 복수일 수 있으므로 필터는 category.includes(value)로 판단한다.
export type WorkCategory = '웹/앱' | '게임' | 'VR';

export const WORK_CATEGORY_FILTERS: { label: string; value: WorkCategory | null }[] = [
  { label: '전체', value: null },
  { label: '웹/앱', value: '웹/앱' },
  { label: '게임', value: '게임' },
  { label: 'VR', value: 'VR' },
];
