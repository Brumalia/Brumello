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
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Comments</h3>

      {/* Add Comment */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleInputChange}
          placeholder="Write a comment... (@ to mention)"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {filteredMembers.map((member) => (
              <button
                key={member.user_id}
                onClick={() => insertMention(member)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                  {member.email.charAt(0).toUpperCase()}
                </div>
                <span>{member.email}</span>
                <span className="text-xs text-gray-400 capitalize">({member.role})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={addComment}
        disabled={loading || !newComment.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send'}
      </button>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No comments yet</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-blue-600">
                  {comment.users?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.users?.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
