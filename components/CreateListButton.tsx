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
  const supabase = createClient() as any

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from('lists')
        .insert({
          board_id: boardId,
          title: title.trim(),
          position: listsCount,
        })
        .select()

      if (insertError) {
        console.error('List creation error:', insertError)
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
      console.error('List creation exception:', err)
      setError(err?.message || 'Failed to create list')
      setLoading(false)
    }
  }

  if (!isAdding) {
    return (
      <div 
        style={{
          backgroundColor: 'rgba(20, 32, 36, 0.5)',
          borderRadius: '14px',
          padding: '16px',
          minWidth: '300px',
          maxWidth: '300px',
          border: '1px solid rgba(255,255,255,0.04)'
        }}
      >
        <button
          onClick={() => setIsAdding(true)}
          type="button"
          style={{
            width: '100%',
            textAlign: 'left',
            color: '#e2e8e4',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            padding: '8px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          + Add a list
        </button>
      </div>
    )
  }

  return (
    <div 
      style={{
        backgroundColor: '#142024',
        borderRadius: '14px',
        padding: '16px',
        minWidth: '300px',
        maxWidth: '300px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.07)'
      }}
    >
      <form 
        onSubmit={handleCreate} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {error && (
          <div 
            style={{
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              color: '#f87171',
              padding: '8px',
              borderRadius: '6px',
              fontSize: '14px',
              border: '1px solid rgba(248, 113, 113, 0.2)'
            }}
          >
            {error}
          </div>
        )}
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          autoFocus
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: '#101a1e',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '6px',
            color: '#e2e8e4',
            fontSize: '14px',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '1px solid #34d399'
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
          }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#34d399',
              color: '#0b1215',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: (loading || !title.trim()) ? 'not-allowed' : 'pointer',
              opacity: (loading || !title.trim()) ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading && title.trim()) {
                e.currentTarget.style.backgroundColor = '#10b981'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && title.trim()) {
                e.currentTarget.style.backgroundColor = '#34d399'
              }
            }}
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
            style={{
              padding: '8px 16px',
              color: '#e2e8e4',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
