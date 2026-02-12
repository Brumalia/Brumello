'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface CreateCardButtonProps {
  listId: string
  cardsCount: number
}

export default function CreateCardButton({ listId, cardsCount }: CreateCardButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from('cards')
        .insert({
          list_id: listId,
          title: title.trim(),
          position: cardsCount,
        })
        .select()

      if (insertError) {
        console.error('Card creation error:', insertError)
        setError(insertError.message)
        setLoading(false)
      } else if (data) {
        setTitle('')
        setIsAdding(false)
        setLoading(false)
        router.refresh()
      } else {
        setError('No data returned from insert')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Card creation exception:', err)
      setError(err?.message || 'Failed to create card')
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAdding(false)
      setTitle('')
      setError(null)
    }
  }

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded p-2 transition-colors"
      >
        + Add a card
      </button>
    )
  }

  return (
    <div className="mt-2">
      <form onSubmit={handleCreate} className="space-y-2">
        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded text-xs">
            {error}
          </div>
        )}
        
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a title for this card..."
          autoFocus
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {loading ? 'Adding...' : 'Add card'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false)
              setTitle('')
              setError(null)
            }}
            className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-gray-500">Press Esc to cancel</p>
      </form>
    </div>
  )
}
