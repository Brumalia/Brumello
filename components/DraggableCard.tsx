'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import LabelBadge from './LabelBadge'

interface Label {
  id: string
  name: string
  color: string
}

interface Card {
  id: string
  title: string
  description: string | null
  card_labels?: Array<{ labels: Label }>
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
      {/* Labels */}
      {card.card_labels && card.card_labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.card_labels.map((cl) => (
            <LabelBadge
              key={cl.labels.id}
              name={cl.labels.name}
              color={cl.labels.color}
              compact
            />
          ))}
        </div>
      )}
      
      <p className="text-sm text-gray-900">{card.title}</p>
      {card.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {card.description}
        </p>
      )}
    </div>
  )
}
