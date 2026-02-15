'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import LabelBadge from './LabelBadge'

interface Label {
  id: string
  name: string
  color: string
  board_id: string
}

interface LabelSelectorProps {
  cardId: string
  boardId: string
  selectedLabels: Label[]
  onUpdate: () => void
}

const DEFAULT_COLORS = [
  { name: 'Green', color: '#61BD4F' },
  { name: 'Yellow', color: '#F2D600' },
  { name: 'Orange', color: '#FF9F1A' },
  { name: 'Red', color: '#EB5A46' },
  { name: 'Purple', color: '#C377E0' },
  { name: 'Blue', color: '#0079BF' },
  { name: 'Sky', color: '#00C2E0' },
  { name: 'Lime', color: '#51E898' },
]

export default function LabelSelector({ cardId, boardId, selectedLabels, onUpdate }: LabelSelectorProps) {
  const [boardLabels, setBoardLabels] = useState<Label[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState(DEFAULT_COLORS[0].color)
  const [loading, setLoading] = useState(false)
  const supabase = createClient() as any
  const router = useRouter()

  useEffect(() => {
    fetchBoardLabels()
  }, [boardId])

  const fetchBoardLabels = async () => {
    const { data } = await supabase
      .from('labels')
      .select('*')
      .eq('board_id', boardId)
      .order('name')

    if (data) {
      setBoardLabels(data)
    }
  }

  const createLabel = async () => {
    if (!newLabelName.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('labels')
        .insert({
          board_id: boardId,
          name: newLabelName.trim(),
          color: newLabelColor,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating label:', error)
        alert('Failed to create label: ' + error.message)
        setLoading(false)
        return
      }

      if (data) {
        // Add the new label to the card immediately
        await addLabelToCard(data.id)
        setNewLabelName('')
        setShowCreateForm(false)
        await fetchBoardLabels()
      }
    } catch (err) {
      console.error('Error creating label:', err)
      alert('Failed to create label')
    }
    setLoading(false)
  }

  const addLabelToCard = async (labelId: string) => {
    // First, remove all existing labels (one label per card)
    await supabase
      .from('card_labels')
      .delete()
      .eq('card_id', cardId)

    // Then add the new label
    const { error } = await supabase
      .from('card_labels')
      .insert({ card_id: cardId, label_id: labelId })

    if (error) {
      console.error('Error adding label to card:', error)
      alert('Failed to add label: ' + error.message)
      return
    }

    router.refresh()
    onUpdate()
  }

  const removeLabelFromCard = async (labelId: string) => {
    await supabase
      .from('card_labels')
      .delete()
      .eq('card_id', cardId)
      .eq('label_id', labelId)

    router.refresh()
    onUpdate()
  }

  const isSelected = (labelId: string) => {
    return selectedLabels.some((l) => l.id === labelId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f0f5f1' }}>Labels</h3>

      {/* Selected Label (only one) */}
      {selectedLabels.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {selectedLabels.map((label) => (
            <LabelBadge
              key={label.id}
              name={label.name}
              color={label.color}
              onRemove={() => removeLabelFromCard(label.id)}
            />
          ))}
        </div>
      )}

      {/* Available Labels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '12px', color: '#8a9b91' }}>
          {selectedLabels.length > 0 ? 'Change label:' : 'Select label:'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {boardLabels.map((label) => (
            <button
              key={label.id}
              onClick={() =>
                isSelected(label.id)
                  ? removeLabelFromCard(label.id)
                  : addLabelToCard(label.id)
              }
              style={{
                padding: '4px 12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#ffffff',
                backgroundColor: label.color,
                border: 'none',
                cursor: 'pointer',
                opacity: isSelected(label.id) ? 1 : 0.7,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = isSelected(label.id) ? '1' : '0.7'
              }}
            >
              {label.name}
              {isSelected(label.id) && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Create New Label */}
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            fontSize: '14px',
            color: '#10b981',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#34d399'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#10b981'
          }}
        >
          + Create new label
        </button>
      ) : (
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#101a1e',
          }}
        >
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Label name"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '10px',
              fontSize: '14px',
              backgroundColor: '#101a1e',
              color: '#c8d5cc',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1px solid rgba(52,211,153,0.15)'
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.04)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            autoFocus
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}
          >
            {DEFAULT_COLORS.map((colorOption) => (
              <button
                key={colorOption.color}
                onClick={() => setNewLabelColor(colorOption.color)}
                style={{
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: colorOption.color,
                  border: newLabelColor === colorOption.color
                    ? '2px solid #10b981'
                    : 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  outline: newLabelColor === colorOption.color
                    ? '2px solid rgba(16,185,129,0.2)'
                    : 'none',
                  outlineOffset: '2px',
                }}
                title={colorOption.name}
                onMouseEnter={(e) => {
                  if (newLabelColor !== colorOption.color) {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={createLabel}
              disabled={loading || !newLabelName.trim()}
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: loading || !newLabelName.trim() ? '#0d7a5c' : '#10b981',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: loading || !newLabelName.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !newLabelName.trim() ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading && newLabelName.trim()) {
                  e.currentTarget.style.backgroundColor = '#34d399'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && newLabelName.trim()) {
                  e.currentTarget.style.backgroundColor = '#10b981'
                }
              }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false)
                setNewLabelName('')
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: '#142024',
                color: '#c8d5cc',
                borderRadius: '10px',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a2a2f'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#142024'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
