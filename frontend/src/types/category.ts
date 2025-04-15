export interface Category {
  id: number;
  title: string;
  color: string; // 배경색
  textColor?: string; // 선택적: 없으면 fallback 처리 가능
}
