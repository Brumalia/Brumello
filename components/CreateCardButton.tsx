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
  const supabase = createClient() as any

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
        style={{
          width: '100%',
          textAlign: 'left',
          fontSize: '14px',
          color: '#8a9b91',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '6px',
          padding: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginTop: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#e2e8e4'
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#8a9b91'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        + Add a card
      </button>
    )
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <form 
        onSubmit={handleCreate} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {error && (
          <div 
            style={{
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              color: '#f87171',
              padding: '8px',
              borderRadius: '6px',
              fontSize: '12px',
              border: '1px solid rgba(248, 113, 113, 0.2)'
            }}
          >
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
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: '#101a1e',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '6px',
            color: '#e2e8e4',
            fontSize: '14px',
            resize: 'none',
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
              padding: '6px 12px',
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
            {loading ? 'Adding...' : 'Add card'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false)
              setTitle('')
              setError(null)
            }}
            style={{
              padding: '6px 12px',
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
        <p 
          style={{
            fontSize: '11px',
            color: '#4d5f56',
            margin: 0
          }}
        >
          Press Esc to cancel
        </p>
      </form>
    </div>
  )
}
