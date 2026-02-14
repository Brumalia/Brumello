'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import LabelSelector from './LabelSelector'
import ChecklistSelector from './ChecklistSelector'
import CommentSelector from './CommentSelector'

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const router = useRouter()
  const supabase: ReturnType<typeof createClient> = createClient()

  // Debounced auto-save function
  const autoSave = useCallback(async () => {
    if (!title.trim()) return
    
    setSaveStatus('saving')
    
    const { error } = await supabase
      .from('cards')
      .update({
        title: title.trim(),
        description: description.trim() || null,
        background_color: backgroundColor,
        due_date: dueDate || null,
        completed: completed,
      })
      .eq('id', card.id)

    if (error) {
      console.error('Auto-save error:', error)
      setSaveStatus('error')
    } else {
      setSaveStatus('saved')
      router.refresh()
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }, [title, description, backgroundColor, dueDate, completed, card.id, supabase, router])

  // Auto-save when any field changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== card.title || 
          description !== (card.description || '') || 
          backgroundColor !== card.background_color ||
          dueDate !== (card.due_date ? new Date(card.due_date).toISOString().split('T')[0] : '') ||
          completed !== card.completed) {
        autoSave()
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [title, description, backgroundColor, dueDate, completed, card, autoSave])

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

  const handleDelete = async () => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', card.id)

    if (!error) {
      router.refresh()
      onClose()
    }
  }

  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        )
      case 'saved':
        return (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </span>
        )
      case 'error':
        return (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error saving
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 mr-4">
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                in list <span className="font-semibold">{listTitle}</span>
                {getSaveStatusDisplay()}
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

          {/* Checklists */}
          <div className="mb-6">
            <ChecklistSelector
              cardId={card.id}
              onUpdate={() => {}}
            />
          </div>

          {/* Comments */}
          <div className="mb-6">
            <CommentSelector
              cardId={card.id}
              boardId={boardId}
              onUpdate={() => {}}
            />
          </div>

          {/* Delete Button Only */}
          <div className="flex justify-end">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Delete Card
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
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
