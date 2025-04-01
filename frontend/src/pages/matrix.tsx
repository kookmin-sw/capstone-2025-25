import PriorityMatrix from '@/components/PriorityMatrix/PriorityMatrix.tsx';
import DefaultPriorityMatrix from '@/components/PriorityMatrix/DefaultPriorityMatrix.tsx';
export default function MatrixPage() {
  return (
    <div className="flex flex-col gap-10">
      <PriorityMatrix />
      <DefaultPriorityMatrix />
    </div>
  );
}
