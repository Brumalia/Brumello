'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Label {
  id: string
  name: string
  color: string
}

interface Card {
  id: string
  title: string
  description: string | null
  background_color: string | null
  due_date: string | null
  completed: boolean
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

  const labelColor = card.card_labels?.[0]?.labels?.color
  const cardBgColor = card.background_color || '#ffffff'
  
  // Check if card is overdue
  const isOverdue = card.due_date && !card.completed && new Date(card.due_date) < new Date()
  
  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(date)
    dueDate.setHours(0, 0, 0, 0)
    
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    if (diffDays < 7) return `${diffDays} days`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: cardBgColor,
      }}
      {...attributes}
      className="rounded-lg shadow-sm hover:shadow-md transition-shadow relative group overflow-hidden"
    >
      {/* Color bar on left edge if card has a label */}
      {labelColor && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: labelColor }}
        />
      )}

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
        style={{ paddingLeft: labelColor ? '16px' : '12px' }}
      >
        <div className="flex items-start gap-2">
          {card.completed && (
            <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
          )}
          <p className={`text-sm flex-1 ${card.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {card.title}
          </p>
        </div>
        
        {card.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {card.description}
          </p>
        )}
        
        {/* Due Date Badge */}
        {card.due_date && !card.completed && (
          <div className="flex items-center gap-1 mt-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
              {formatDueDate(card.due_date)}
            </span>
          </div>
        )}
        
        {/* Completed Badge */}
        {card.completed && card.due_date && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs font-medium text-green-600">
              Completed
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
