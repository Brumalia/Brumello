'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface CreateListButtonProps {
  boardId: string
  listsCount: number
}

export default function CreateListButton({ boardId, listsCount }: CreateListButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: insertError } = await supabase
      .from('lists')
      .insert({
        board_id: boardId,
        title,
        position: listsCount,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      setTitle('')
      setIsAdding(false)
      router.refresh()
    }
  }

  if (!isAdding) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 min-w-[300px] max-w-[300px]">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full text-left text-white hover:bg-white hover:bg-opacity-20 rounded p-2 transition-colors font-semibold"
        >
          + Add a list
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 min-w-[300px] max-w-[300px]">
      <form onSubmit={handleCreate} className="space-y-3">
        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded text-sm">
            {error}
          </div>
        )}
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {loading ? 'Adding...' : 'Add list'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false)
              setTitle('')
              setError(null)
            }}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
