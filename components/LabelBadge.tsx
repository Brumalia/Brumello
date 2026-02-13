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
      className={`inline-flex items-center gap-1 rounded ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } font-medium text-white`}
      style={{ backgroundColor: color }}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="hover:bg-black hover:bg-opacity-20 rounded-full p-0.5"
        >
          ×
        </button>
      )}
    </span>
  )
}
