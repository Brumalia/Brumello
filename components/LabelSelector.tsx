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
  const supabase = createClient()
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
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Labels</h3>

      {/* Selected Label (only one) */}
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
      <div className="space-y-2">
        <div className="text-xs text-gray-500">
          {selectedLabels.length > 0 ? 'Change label:' : 'Select label:'}
        </div>
        <div className="flex flex-wrap gap-2">
          {boardLabels.map((label) => (
            <button
              key={label.id}
              onClick={() =>
                isSelected(label.id)
                  ? removeLabelFromCard(label.id)
                  : addLabelToCard(label.id)
              }
              className={`px-3 py-1 rounded text-sm font-medium text-white transition-opacity ${
                isSelected(label.id) ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: label.color }}
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
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Create new label
        </button>
      ) : (
        <div className="border border-gray-200 rounded-lg p-3 space-y-3">
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Label name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            autoFocus
          />

          <div className="grid grid-cols-4 gap-2">
            {DEFAULT_COLORS.map((colorOption) => (
              <button
                key={colorOption.color}
                onClick={() => setNewLabelColor(colorOption.color)}
                className={`h-8 rounded transition-all ${
                  newLabelColor === colorOption.color
                    ? 'ring-2 ring-offset-2 ring-gray-900'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: colorOption.color }}
                title={colorOption.name}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={createLabel}
              disabled={loading || !newLabelName.trim()}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false)
                setNewLabelName('')
              }}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
