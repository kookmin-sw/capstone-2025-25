import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCardType } from './data'

interface Props {
  task: TaskCardType
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white p-3 rounded-md shadow-sm border cursor-grab flex justify-between items-center"
    >
      <div>
        <div className="text-sm font-semibold">{task.title}</div>
        {task.memo && <div className="text-xs text-gray-500">{task.memo}</div>}
      </div>
      <button onClick={() => onDelete(task.id)} className="text-red-500 text-xs">삭제</button>
    </div>
  )
}