'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ListHeaderProps {
  listId: string
  title: string
  cardsCount: number
}

export default function ListHeader({ listId, title, cardsCount }: ListHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(title)
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async () => {
    if (!newTitle.trim()) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('lists')
        .update({ title: newTitle.trim() })
        .eq('id', listId)

      if (!error) {
        setIsEditing(false)
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to update list:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', listId)

      if (!error) {
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to delete list:', err)
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <div className="mb-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUpdate()
            if (e.key === 'Escape') {
              setIsEditing(false)
              setNewTitle(title)
            }
          }}
          onBlur={handleUpdate}
          autoFocus
          disabled={loading}
          className="w-full px-2 py-1 font-bold text-gray-900 border-2 border-blue-500 rounded focus:outline-none"
        />
      </div>
    )
  }

  return (
    <div className="flex justify-between items-start mb-3 group">
      <h3
        onClick={() => setIsEditing(true)}
        className="font-bold text-gray-900 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded flex-1"
      >
        {title}
      </h3>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:bg-gray-200 rounded px-2 py-1 transition-opacity"
        >
          ⋯
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <button
              onClick={() => {
                setIsEditing(true)
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Edit List
            </button>
            
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
              >
                Delete List
              </button>
            ) : (
              <div className="p-2">
                <p className="text-xs text-gray-600 mb-2">
                  Delete list and {cardsCount} cards?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirm(false)
                      setShowMenu(false)
                    }}
                    className="flex-1 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
