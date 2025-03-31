export default function DragOverlayCard({ title }: { title: string }) {
  return (
    <div className="bg-white border shadow-lg px-4 py-2 rounded-md">
      <span className="font-medium text-sm">{title}</span>
    </div>
  )
}