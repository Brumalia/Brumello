'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Card {
  id: string
  title: string
  description: string | null
}

interface DraggableCardProps {
  card: Card
  onClick: () => void
}

export default function DraggableCard({ card, onClick }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Only trigger onClick if not dragging
        if (!isDragging) {
          onClick()
        }
      }}
      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing touch-none"
    >
      <p className="text-sm text-gray-900">{card.title}</p>
      {card.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {card.description}
        </p>
      )}
    </div>
  )
}
