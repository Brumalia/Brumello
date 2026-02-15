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
  const supabase = createClient() as any

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
      <div style={{ marginBottom: '12px' }}>
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
          style={{
            width: '100%',
            padding: '6px 8px',
            fontWeight: 600,
            color: '#f0f5f1',
            backgroundColor: '#101a1e',
            border: '2px solid #34d399',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
    )
  }

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        position: 'relative'
      }}
    >
      <h3
        onClick={() => setIsEditing(true)}
        style={{
          fontWeight: 600,
          color: '#f0f5f1',
          cursor: 'pointer',
          padding: '6px 8px',
          borderRadius: '6px',
          flex: 1,
          margin: 0,
          fontSize: '14px',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {title}
      </h3>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            opacity: 0,
            color: '#8a9b91',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 8px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
          }}
          onMouseLeave={(e) => {
            if (!showMenu) {
              e.currentTarget.style.opacity = '0'
            }
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          ⋯
        </button>
        
        {showMenu && (
          <div 
            style={{
              position: 'absolute',
              right: 0,
              marginTop: '4px',
              width: '192px',
              backgroundColor: '#142024',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.07)',
              zIndex: 10,
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => {
                setIsEditing(true)
                setShowMenu(false)
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#e2e8e4',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Edit List
            </button>
            
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 16px',
                  color: '#f87171',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Delete List
              </button>
            ) : (
              <div style={{ padding: '8px' }}>
                <p 
                  style={{
                    fontSize: '12px',
                    color: '#8a9b91',
                    marginBottom: '8px',
                    marginTop: 0
                  }}
                >
                  Delete list and {cardsCount} cards?
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      backgroundColor: '#f87171',
                      color: '#fff',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.backgroundColor = '#ef4444'
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.currentTarget.style.backgroundColor = '#f87171'
                    }}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirm(false)
                      setShowMenu(false)
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      backgroundColor: '#101a1e',
                      color: '#e2e8e4',
                      borderRadius: '6px',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1a2a30'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#101a1e'
                    }}
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
