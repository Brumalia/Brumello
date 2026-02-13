'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import LabelSelector from './LabelSelector'

interface Label {
  id: string
  name: string
  color: string
  board_id: string
}

interface Card {
  id: string
  title: string
  description: string | null
  due_date: string | null
  completed: boolean
  background_color: string | null
}

interface CardModalProps {
  card: Card
  listTitle: string
  boardId: string
  onClose: () => void
}

const CARD_COLORS = [
  { name: 'None', color: null },
  { name: 'Green', color: '#D3F8E2' },
  { name: 'Yellow', color: '#FFF4C4' },
  { name: 'Orange', color: '#FFE5C4' },
  { name: 'Red', color: '#FFD5D5' },
  { name: 'Purple', color: '#EDE4FF' },
  { name: 'Blue', color: '#D4E5FF' },
  { name: 'Sky', color: '#C4F0FF' },
  { name: 'Lime', color: '#E4FFD4' },
]

export default function CardModal({ card, listTitle, boardId, onClose }: CardModalProps) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || '')
  const [backgroundColor, setBackgroundColor] = useState(card.background_color)
  const [dueDate, setDueDate] = useState(
    card.due_date ? new Date(card.due_date).toISOString().split('T')[0] : ''
  )
  const [completed, setCompleted] = useState(card.completed)
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchLabels()
  }, [card.id])

  const fetchLabels = async () => {
    const { data } = await supabase
      .from('card_labels')
      .select('label_id, labels(*)')
      .eq('card_id', card.id)

    if (data) {
      setLabels(data.map((cl: any) => cl.labels))
    }
  }

  const handleUpdate = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('cards')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          background_color: backgroundColor,
          due_date: dueDate || null,
          completed: completed,
        })
        .eq('id', card.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
      } else {
        // Refresh the page data
        router.refresh()
        // Small delay to ensure Next.js fetches updated data
        await new Promise(resolve => setTimeout(resolve, 300))
        onClose()
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update card')
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('cards')
        .delete()
        .eq('id', card.id)

      if (deleteError) {
        setError(deleteError.message)
        setLoading(false)
      } else {
        router.refresh()
        onClose()
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to delete card')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 mr-4">
              <div className="text-sm text-gray-500 mb-2">
                in list <span className="font-semibold">{listTitle}</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold text-gray-900 w-full border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none py-1"
              />
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Due Date & Completion */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Completion Checkbox */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mark as completed
                </span>
              </label>
            </div>
          </div>

          {/* Labels */}
          <div className="mb-6">
            <LabelSelector
              cardId={card.id}
              boardId={boardId}
              selectedLabels={labels}
              onUpdate={fetchLabels}
            />
          </div>

          {/* Card Background Color */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Card Color</h3>
            <div className="grid grid-cols-5 gap-2">
              {CARD_COLORS.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => setBackgroundColor(colorOption.color)}
                  className={`h-10 rounded-lg border-2 transition-all flex items-center justify-center text-xs font-medium ${
                    backgroundColor === colorOption.color
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: colorOption.color || '#ffffff',
                    color: colorOption.color ? '#374151' : '#9CA3AF'
                  }}
                  title={colorOption.name}
                >
                  {colorOption.color === null && 'None'}
                  {backgroundColor === colorOption.color && colorOption.color && '✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Delete
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
