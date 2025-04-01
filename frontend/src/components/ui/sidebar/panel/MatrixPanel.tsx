import CommonPanelWrapper from './CommonPanelWrapper';
export default function MatrixPanel({ onClose }: { onClose: () => void }) {
  return (
    <CommonPanelWrapper title="매트릭스" onClose={onClose}>
      <p className="text-sm text-muted-foreground">
        매트릭스 항목이 여기에 표시됩니다.
      </p>
    </CommonPanelWrapper>
  );
}
