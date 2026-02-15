'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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

interface BoardMember {
  user_id: string
  email: string
  role: string
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
  
  // @ mentions state
  const [members, setMembers] = useState<BoardMember[]>([])
  const [showMentions, setShowMentions] = useState(false)
  const [mentionSearch, setMentionSearch] = useState('')
  const [mentionPosition, setMentionPosition] = useState(0)
  const [prevDescription, setPrevDescription] = useState(card.description || '')
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  
  const router = useRouter()
  const supabase: ReturnType<typeof createClient> = createClient()

  // Fetch board members for @mentions
  useEffect(() => {
    const fetchMembers = async () => {
      const { data: memberData } = await supabase
        .rpc('get_board_members', { p_board_id: boardId })
      
      const { data: board } = await supabase
        .from('boards')
        .select('created_by')
        .eq('id', boardId)
        .single()
      
      // Get owner email from auth.users
      let ownerEmail = 'Owner'
      if (board?.created_by) {
        const { data: ownerUser } = await supabase
          .from('users')
          .select('email')
          .eq('id', board.created_by)
          .single()
        ownerEmail = ownerUser?.email || 'Owner'
      }

      const allMembers: BoardMember[] = []
      
      if (board?.created_by) {
        allMembers.push({
          user_id: board.created_by,
          email: ownerEmail,
          role: 'owner'
        })
      }
      
      if (memberData) {
        memberData.forEach((m: any) => {
          if (!allMembers.find(am => am.user_id === m.user_id)) {
            allMembers.push(m)
          }
        })
      }
      
      setMembers(allMembers)
    }
    
    fetchMembers()
  }, [boardId, supabase])

  // Create notifications when @mentioned in description
  const notifyMentions = useCallback(async (newDescription: string, oldDescription: string) => {
    if (newDescription === oldDescription) return
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) return
    
    // Find new @mentions
    const mentionRegex = /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    const newMentions = newDescription.match(mentionRegex) as string[] || []
    const oldMentions = oldDescription.match(mentionRegex) as string[] || []
    
    const addedMentions = newMentions.filter(m => !oldMentions.includes(m))
    
    for (const mention of addedMentions) {
      const email = mention.substring(1) // Remove @
      const member = members.find(m => m.email.toLowerCase() === email.toLowerCase())
      
      if (member && member.user_id !== user.id) {
        // Create notification
        await supabase.from('notifications').insert({
          user_id: member.user_id,
          type: 'mention',
          title: 'You were mentioned',
          message: `${user.email} mentioned you in a card description`,
          link: `/boards/${boardId}?card=${card.id}`
        })
      }
    }
  }, [supabase, members, boardId, card.id])

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
      // Check for new @mentions
      notifyMentions(description, prevDescription)
      setPrevDescription(description)
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }, [title, description, backgroundColor, dueDate, completed, card.id, supabase, router, notifyMentions, prevDescription])

  // Auto-save when any field changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only save if there are actual changes
      if (
        title !== card.title ||
        description !== (card.description || '') ||
        backgroundColor !== card.background_color ||
        dueDate !== (card.due_date ? new Date(card.due_date).toISOString().split('T')[0] : '') ||
        completed !== card.completed
      ) {
        autoSave()
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [title, description, backgroundColor, dueDate, completed, card, autoSave])

  // Load labels
  useEffect(() => {
    const fetchLabels = async () => {
      const { data } = await supabase
        .from('card_labels')
        .select('labels(*)')
        .eq('card_id', card.id)
      
      if (data) {
        setLabels(data.map((d: any) => d.labels).filter(Boolean))
      }
    }
    fetchLabels()
  }, [card.id, supabase])

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

  // Handle @ in description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setDescription(value)
    
    // Check for @ trigger
    const cursorPos = e.target.selectionStart
    const textBeforeCursor = value.slice(0, cursorPos)
    const lastAtPos = textBeforeCursor.lastIndexOf('@')
    
    if (lastAtPos !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtPos + 1)
      // Only show if no space after @ and we're typing a name
      if (!textAfterAt.includes(' ') && textAfterAt.length > 0) {
        setShowMentions(true)
        setMentionSearch(textAfterAt.toLowerCase())
        setMentionPosition(lastAtPos)
      } else if (textAfterAt.length === 0) {
        setShowMentions(true)
        setMentionSearch('')
        setMentionPosition(lastAtPos)
      } else {
        setShowMentions(false)
      }
    } else {
      setShowMentions(false)
    }
  }

  const insertMention = (member: BoardMember) => {
    const before = description.slice(0, mentionPosition)
    const after = description.slice(mentionPosition + mentionSearch.length + 1)
    const newValue = `${before}@${member.email} ${after}`
    setDescription(newValue)
    setShowMentions(false)
    descriptionRef.current?.focus()
  }

  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span 
            style={{
              fontSize: '14px',
              color: '#8a9b91',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <svg 
              style={{ 
                width: '16px', 
                height: '16px',
                animation: 'spin 1s linear infinite'
              }} 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        )
      case 'saved':
        return (
          <span 
            style={{
              fontSize: '14px',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </span>
        )
      case 'error':
        return (
          <span 
            style={{
              fontSize: '14px',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error saving
          </span>
        )
      default:
        return null
    }
  }

  const filteredMembers = members.filter(m => 
    m.email.toLowerCase().includes(mentionSearch)
  )

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      <div 
        style={{
          backgroundColor: '#142024',
          borderRadius: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
          maxWidth: '672px',
          width: '100%',
          marginTop: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.07)'
        }}
      >
        {/* Inject keyframe animation for spinner */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        <div style={{ padding: '24px' }}>
          {/* Header */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}
          >
            <div style={{ flex: 1 }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#8a9b91',
                  marginBottom: '8px'
                }}
              >
                <span>in list</span>
                <span style={{ fontWeight: 500, color: '#e2e8e4' }}>{listTitle}</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Card title"
                style={{
                  width: '100%',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#f0f5f1',
                  border: 'none',
                  backgroundColor: 'transparent',
                  padding: 0,
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'
                  e.currentTarget.style.padding = '4px 8px'
                  e.currentTarget.style.borderRadius = '6px'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.padding = '0'
                }}
              />
            </div>
            <button
              onClick={onClose}
              style={{
                color: '#8a9b91',
                fontSize: '28px',
                fontWeight: 700,
                marginLeft: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                lineHeight: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f0f5f1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8a9b91'
              }}
            >
              ×
            </button>
          </div>

          {/* Save Status */}
          <div 
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            {getSaveStatusDisplay()}
          </div>

          {/* Description with @mentions */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <h3 
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#f0f5f1',
                marginBottom: '8px',
                marginTop: 0
              }}
            >
              Description
            </h3>
            <div style={{ position: 'relative' }}>
              <textarea
                ref={descriptionRef}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Add a more detailed description... (@ to mention)"
                rows={6}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#101a1e',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  color: '#e2e8e4',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: 1.5
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                }}
              />
              
              {/* Mention Dropdown */}
              {showMentions && filteredMembers.length > 0 && (
                <div 
                  style={{
                    position: 'absolute',
                    zIndex: 10,
                    width: '100%',
                    marginTop: '4px',
                    backgroundColor: '#142024',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
                    maxHeight: '160px',
                    overflowY: 'auto'
                  }}
                >
                  {filteredMembers.map((member) => (
                    <button
                      key={member.user_id}
                      onClick={() => insertMention(member)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#e2e8e4'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <div 
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#34d399',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0b1215',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        {member.email.charAt(0).toUpperCase()}
                      </div>
                      <span>{member.email}</span>
                      <span 
                        style={{
                          fontSize: '12px',
                          color: '#4d5f56',
                          textTransform: 'capitalize'
                        }}
                      >
                        ({member.role})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Due Date & Completion */}
          <div 
            style={{
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}
          >
            {/* Due Date */}
            <div>
              <label 
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#f0f5f1',
                  marginBottom: '8px'
                }}
              >
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#101a1e',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  color: '#e2e8e4',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                }}
              />
            </div>

            {/* Completion */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: '#34d399',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <span 
                  style={{
                    marginLeft: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#e2e8e4'
                  }}
                >
                  Mark as completed
                </span>
              </label>
            </div>
          </div>

          {/* Labels */}
          <div style={{ marginBottom: '24px' }}>
            <h3 
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#f0f5f1',
                marginBottom: '8px',
                marginTop: 0
              }}
            >
              Labels
            </h3>
            <LabelSelector cardId={card.id} boardId={boardId} selectedLabels={labels} onUpdate={() => {}} />
          </div>

          {/* Card Color */}
          <div style={{ marginBottom: '24px' }}>
            <h3 
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#f0f5f1',
                marginBottom: '8px',
                marginTop: 0
              }}
            >
              Card Color
            </h3>
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              {CARD_COLORS.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => setBackgroundColor(colorOption.color)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    backgroundColor: colorOption.color || '#101a1e',
                    color: colorOption.color ? '#374151' : '#8a9b91',
                    border: backgroundColor === colorOption.color ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                    boxShadow: backgroundColor === colorOption.color ? '0 0 0 2px #0b1215, 0 0 0 4px #34d399' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (backgroundColor !== colorOption.color) {
                      e.currentTarget.style.opacity = '0.8'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                >
                  {colorOption.name}
                </button>
              ))}
            </div>
          </div>

          {/* Checklists */}
          <div style={{ marginBottom: '24px' }}>
            <ChecklistSelector
              cardId={card.id}
              onUpdate={() => {}}
            />
          </div>

          {/* Comments */}
          <div style={{ marginBottom: '24px' }}>
            <CommentSelector
              cardId={card.id}
              boardId={boardId}
              onUpdate={() => {}}
            />
          </div>

          {/* Delete Button Only */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f87171',
                  color: '#fff',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f87171'
                }}
              >
                Delete Card
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f87171',
                    color: '#fff',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ef4444'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f87171'
                  }}
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#101a1e',
                    color: '#e2e8e4',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
