'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const BOARD_COLORS = [
  '#0079bf', // Blue
  '#d29034', // Orange
  '#519839', // Green
  '#b04632', // Red
  '#89609e', // Purple
  '#cd5a91', // Pink
  '#4bbf6b', // Light Green
  '#00aecc', // Cyan
]

export default function CreateBoardButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [backgroundColor, setBackgroundColor] = useState(BOARD_COLORS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient() as any

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to create a board')
      setLoading(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from('boards')
      .insert({
        title,
        description,
        background_color: backgroundColor,
        created_by: user.id,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      setIsOpen(false)
      setTitle('')
      setDescription('')
      setBackgroundColor(BOARD_COLORS[0])
      router.refresh()
      // Optionally redirect to the new board
      if (data) {
        router.push(`/boards/${data.id}`)
      }
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#34d399',
          color: '#0b1215',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2bc586'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#34d399'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        + Create Board
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px',
          fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          <div style={{
            backgroundColor: '#142024',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
            maxWidth: '500px',
            width: '100%',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.07)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#f0f5f1',
                margin: 0
              }}>
                Create Board
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8a9b91',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
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
                ×
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="title" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#e2e8e4',
                  marginBottom: '8px'
                }}>
                  Board Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Website Redesign"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#101a1e',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#e2e8e4',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#34d399'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 211, 153, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div>
                <label htmlFor="description" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#e2e8e4',
                  marginBottom: '8px'
                }}>
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What's this board about?"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#101a1e',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#e2e8e4',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#34d399'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 211, 153, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#e2e8e4',
                  marginBottom: '12px'
                }}>
                  Background Color
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px'
                }}>
                  {BOARD_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBackgroundColor(color)}
                      style={{
                        height: '56px',
                        borderRadius: '8px',
                        border: backgroundColor === color 
                          ? '3px solid #34d399' 
                          : '2px solid rgba(255,255,255,0.1)',
                        backgroundColor: color,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        boxShadow: backgroundColor === color 
                          ? '0 0 0 4px rgba(52, 211, 153, 0.15)' 
                          : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (backgroundColor !== color) {
                          e.currentTarget.style.opacity = '0.85'
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '8px'
              }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: '#8a9b91',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = '#e2e8e4'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#8a9b91'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  style={{
                    flex: 1,
                    padding: '10px 20px',
                    backgroundColor: loading || !title.trim() ? '#2a6d59' : '#34d399',
                    color: '#0b1215',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    opacity: loading || !title.trim() ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && title.trim()) {
                      e.currentTarget.style.backgroundColor = '#2bc586'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && title.trim()) {
                      e.currentTarget.style.backgroundColor = '#34d399'
                    }
                  }}
                >
                  {loading ? 'Creating...' : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
