'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  users?: { email: string }
}

interface BoardMember {
  user_id: string
  email: string
  role: string
}

interface CommentSelectorProps {
  cardId: string
  boardId: string
  onUpdate: () => void
}

export default function CommentSelector({ cardId, boardId, onUpdate }: CommentSelectorProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionSearch, setMentionSearch] = useState('')
  const [members, setMembers] = useState<BoardMember[]>([])
  const [mentionPosition, setMentionPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const supabase = createClient() as any

  useEffect(() => {
    fetchComments()
    fetchMembers()
  }, [cardId, boardId])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, users(email)')
      .eq('card_id', cardId)
      .order('created_at', { ascending: false })

    if (data) {
      setComments(data)
    }
  }

  const fetchMembers = async () => {
    // Get board members
    const { data: memberData } = await supabase
      .rpc('get_board_members', { p_board_id: boardId })
    
    // Get board owner
    const { data: board } = await supabase
      .from('boards')
      .select('created_by, users!boards_created_by_fkey(email)')
      .eq('id', boardId)
      .single()

    const allMembers: BoardMember[] = []
    
    if (board?.created_by) {
      allMembers.push({
        user_id: board.created_by,
        email: board.users?.email || 'Owner',
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

  const addComment = async () => {
    if (!newComment.trim()) return

    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setLoading(false)
      return
    }

    // Process mentions - convert @email to @userId
    let processedContent = newComment.trim()
    
    // Find all @mentions and replace with user IDs
    for (const member of members) {
      const mentionRegex = new RegExp(`@${member.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi')
      if (mentionRegex.test(processedContent)) {
        processedContent = processedContent.replace(mentionRegex, `@${member.user_id}`)
      }
    }

    const { error } = await supabase
      .from('comments')
      .insert({
        card_id: cardId,
        user_id: user.id,
        content: processedContent
      })

    if (!error) {
      setNewComment('')
      await fetchComments()
      onUpdate()
    }
    
    setLoading(false)
  }

  const deleteComment = async (commentId: string) => {
    await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    await fetchComments()
    onUpdate()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNewComment(value)
    
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
    const before = newComment.slice(0, mentionPosition)
    const after = newComment.slice(mentionPosition + mentionSearch.length + 1) // +1 for @
    const newValue = `${before}@${member.email} ${after}`
    setNewComment(newValue)
    setShowMentions(false)
    textareaRef.current?.focus()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const filteredMembers = members.filter(m => 
    m.email.toLowerCase().includes(mentionSearch)
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f5f1', fontFamily: 'Geist Sans, sans-serif' }}>Comments</h3>

      {/* Add Comment */}
      <div style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleInputChange}
          placeholder="Write a comment... (@ to mention)"
          rows={2}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#101a1e',
            color: '#c8d5cc',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            resize: 'none',
            outline: 'none',
            fontFamily: 'Geist Sans, sans-serif'
          }}
          onFocus={(e) => e.currentTarget.style.outline = '1px solid #34d399'}
          onBlur={(e) => e.currentTarget.style.outline = 'none'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !showMentions) {
              e.preventDefault()
              addComment()
            }
            if (e.key === 'Escape' && showMentions) {
              setShowMentions(false)
            }
          }}
        />
        
        {/* Mention Dropdown */}
        {showMentions && filteredMembers.length > 0 && (
          <div style={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            marginTop: '0.25rem',
            backgroundColor: '#142024',
            border: '1px solid rgba(52,211,153,0.15)',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            maxHeight: '10rem',
            overflowY: 'auto'
          }}>
            {filteredMembers.map((member) => (
              <button
                key={member.user_id}
                onClick={() => insertMention(member)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#c8d5cc',
                  fontFamily: 'Geist Sans, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#101a1e'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f0f5f1',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {member.email.charAt(0).toUpperCase()}
                </div>
                <span>{member.email}</span>
                <span style={{ fontSize: '0.75rem', color: '#8a9b91', textTransform: 'capitalize' }}>({member.role})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={addComment}
        disabled={loading || !newComment.trim()}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: loading || !newComment.trim() ? 'rgba(16,185,129,0.5)' : '#10b981',
          color: '#f0f5f1',
          borderRadius: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
          border: 'none',
          cursor: loading || !newComment.trim() ? 'not-allowed' : 'pointer',
          fontFamily: 'Geist Sans, sans-serif'
        }}
        onMouseEnter={(e) => {
          if (!loading && newComment.trim()) {
            e.currentTarget.style.backgroundColor = '#34d399'
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && newComment.trim()) {
            e.currentTarget.style.backgroundColor = '#10b981'
          }
        }}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: '#8a9b91', fontStyle: 'italic', fontFamily: 'Geist Sans, sans-serif' }}>No comments yet</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              style={{ 
                display: 'flex', 
                gap: '0.75rem',
                backgroundColor: '#142024',
                padding: '1rem',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#101a1e',
                border: '1px solid rgba(52,211,153,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#34d399', fontFamily: 'Geist Sans, sans-serif' }}>
                  {comment.users?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#f0f5f1', fontFamily: 'Geist Sans, sans-serif' }}>
                    {comment.users?.email?.split('@')[0] || 'User'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#8a9b91', fontFamily: 'Geist Mono, monospace' }}>{formatDate(comment.created_at)}</span>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    style={{
                      fontSize: '0.75rem',
                      color: '#f87171',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      fontFamily: 'Geist Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = '#f87171'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#f87171'
                    }}
                    onFocus={(e) => e.currentTarget.style.opacity = '1'}
                    onBlur={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    Delete
                  </button>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#c8d5cc', whiteSpace: 'pre-wrap', fontFamily: 'Geist Sans, sans-serif' }}>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
