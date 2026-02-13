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
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow relative group"
    >
      {/* Drag Handle - only this part triggers dragging */}
      <button
        {...listeners}
        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        aria-label="Drag card"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="4" cy="3" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="4" cy="13" r="1.5" />
          <circle cx="12" cy="3" r="1.5" />
          <circle cx="12" cy="8" r="1.5" />
          <circle cx="12" cy="13" r="1.5" />
        </svg>
      </button>

      {/* Card Content - clickable to open modal */}
      <div
        onClick={onClick}
        className="p-3 pr-8 cursor-pointer"
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
    </div>
  )
}
