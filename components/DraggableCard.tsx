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
        backgroundColor: '#142024',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.04)',
        transition: 'all 0.2s ease'
      }}
      {...attributes}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)'
        }
      }}
    >
      {/* Color bar on left edge if card has a label */}
      {labelColor && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            backgroundColor: labelColor
          }}
        />
      )}

      {/* Drag Handle - only this part triggers dragging */}
      <button
        {...listeners}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '4px',
          opacity: 0,
          cursor: 'grab',
          color: '#4d5f56',
          backgroundColor: 'transparent',
          border: 'none',
          transition: 'opacity 0.2s ease'
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.cursor = 'grabbing'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.cursor = 'grab'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#8a9b91'
          e.currentTarget.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#4d5f56'
          e.currentTarget.style.opacity = '0'
        }}
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
        style={{
          padding: '12px',
          paddingRight: '32px',
          paddingLeft: labelColor ? '16px' : '12px',
          cursor: 'pointer'
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}
        >
          {card.completed && (
            <span 
              style={{
                color: '#34d399',
                flexShrink: 0,
                marginTop: '2px',
                fontSize: '14px'
              }}
            >
              ✓
            </span>
          )}
          <p 
            style={{
              fontSize: '14px',
              flex: 1,
              color: card.completed ? '#8a9b91' : '#e2e8e4',
              textDecoration: card.completed ? 'line-through' : 'none',
              margin: 0,
              lineHeight: 1.4
            }}
          >
            {card.title}
          </p>
        </div>
        
        {card.description && (
          <p 
            style={{
              fontSize: '12px',
              color: '#8a9b91',
              marginTop: '4px',
              marginBottom: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4
            }}
          >
            {card.description}
          </p>
        )}
        
        {/* Due Date Badge */}
        {card.due_date && !card.completed && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '8px'
            }}
          >
            <svg 
              style={{ 
                width: '12px', 
                height: '12px',
                color: isOverdue ? '#f87171' : '#8a9b91'
              }} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span 
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: isOverdue ? '#f87171' : '#8a9b91'
              }}
            >
              {formatDueDate(card.due_date)}
            </span>
          </div>
        )}
        
        {/* Completed Badge */}
        {card.completed && card.due_date && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '8px'
            }}
          >
            <span 
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#34d399'
              }}
            >
              Completed
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
