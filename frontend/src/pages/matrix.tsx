import PriorityMatrix from '@/components/PriorityMatrix/PriorityMatrix.tsx';
import DefaultPriorityMatrix from '@/components/PriorityMatrix/DefaultPriorityMatrix.tsx';
export default function MatrixPage() {
  return (
    <div>
      <PriorityMatrix />
      <DefaultPriorityMatrix />
    </div>
  );
}
