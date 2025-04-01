import CommonPanelWrapper from './CommonPanelWrapper';
export default function TodayListPanel({ onClose }: { onClose: () => void }) {
  return (
    <CommonPanelWrapper title="오늘의 할 일" onClose={onClose}>
      <p className="text-sm text-muted-foreground">
        할 일 항목이 여기에 표시됩니다.
      </p>
    </CommonPanelWrapper>
  );
}
