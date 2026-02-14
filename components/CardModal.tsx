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
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        )
      case 'saved':
        return (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </span>
        )
      case 'error':
        return (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>in list</span>
                <span className="font-medium text-gray-700">{listTitle}</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold text-gray-900 border-none focus:ring-2 focus:ring-blue-500 rounded px-0"
                placeholder="Card title"
              />
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold ml-4"
            >
              ×
            </button>
          </div>

          {/* Save Status */}
          <div className="mb-4 flex justify-end">
            {getSaveStatusDisplay()}
          </div>

          {/* Description with @mentions */}
          <div className="mb-6 relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <div className="relative">
              <textarea
                ref={descriptionRef}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Add a more detailed description... (@ to mention)"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
          </div>

          {/* Due Date & Completion */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Completion */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-semibold text-gray-700">
                  Mark as completed
                </span>
              </label>
            </div>
          </div>

          {/* Labels */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Labels</h3>
            <LabelSelector cardId={card.id} boardId={boardId} selectedLabels={labels} onUpdate={() => {}} />
          </div>

          {/* Card Color */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Color</h3>
            <div className="flex flex-wrap gap-2">
              {CARD_COLORS.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => setBackgroundColor(colorOption.color)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    backgroundColor === colorOption.color
                      ? 'ring-2 ring-offset-2 ring-gray-900'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: colorOption.color || '#e5e7eb',
                    color: colorOption.color ? '#374151' : '#6b7280'
                  }}
                >
                  {colorOption.name}
                </button>
              ))}
            </div>
          </div>

          {/* Checklists */}
          <div className="mb-6">
            <ChecklistSelector
              cardId={card.id}
              onUpdate={() => {}}
            />
          </div>

          {/* Comments */}
          <div className="mb-6">
            <CommentSelector
              cardId={card.id}
              boardId={boardId}
              onUpdate={() => {}}
            />
          </div>

          {/* Delete Button Only */}
          <div className="flex justify-end">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Delete Card
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
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
