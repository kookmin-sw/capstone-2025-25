import CommonPanelWrapper from './CommonPanelWrapper';

export default function PomodoroPanel({ onClose }: { onClose: () => void }) {
  return (
    <CommonPanelWrapper title="뽀모도로" onClose={onClose}>
      <p className="text-sm text-muted-foreground">
        타이머 및 기록 기능이 여기에 표시됩니다.
      </p>
    </CommonPanelWrapper>
  );
}
