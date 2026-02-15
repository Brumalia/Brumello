'use client'

interface LabelBadgeProps {
  name: string
  color: string
  onRemove?: () => void
  compact?: boolean
}

export default function LabelBadge({ name, color, onRemove, compact = false }: LabelBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: '6px',
        padding: compact ? '2px 8px' : '4px 12px',
        fontSize: compact ? '12px' : '14px',
        fontWeight: 500,
        color: '#ffffff',
        backgroundColor: color,
      }}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            padding: '2px',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: '16px',
            lineHeight: 1,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          ×
        </button>
      )}
    </span>
  )
}
