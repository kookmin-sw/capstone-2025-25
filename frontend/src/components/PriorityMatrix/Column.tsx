import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import { TaskCardType } from './data'

interface Props {
  id: string
  tasks: TaskCardType[]
  onDelete: (id: string) => void
  onAdd: (columnId: string) => void
}

export default function Column({ id, tasks, onDelete, onAdd }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`bg-violet-50 p-4 rounded-lg shadow-md min-h-[300px] transition ${
        isOver ? 'bg-violet-100' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">{id}</h3>
        <button onClick={() => onAdd(id)} className="text-xs text-violet-600 font-medium">+ 추가</button>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}