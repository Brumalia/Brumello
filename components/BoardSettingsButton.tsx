'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { BoardMember } from '@/types'

interface Board {
  id: string
  title: string
  description: string | null
  background_color: string
  created_by: string
}

const BOARD_COLORS = [
  { name: 'Blue', color: '#0079bf' },
  { name: 'Green', color: '#519839' },
  { name: 'Yellow', color: '#d9b51c' },
  { name: 'Orange', color: '#e67e22' },
  { name: 'Red', color: '#eb5a46' },
  { name: 'Purple', color: '#c377e0' },
  { name: 'Pink', color: '#f24e4e' },
  { name: 'Teal', color: '#00c2e0' },
]

interface BoardSettingsButtonProps {
  board: Board
  currentUserId: string
}

type Tab = 'settings' | 'members'

export default function BoardSettingsButton({ board, currentUserId }: BoardSettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('settings')
  const [title, setTitle] = useState(board.title)
  const [description, setDescription] = useState(board.description || '')
  const [backgroundColor, setBackgroundColor] = useState(board.background_color)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Members state
  const [members, setMembers] = useState<BoardMember[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [searchResults, setSearchResults] = useState<{id: string, email: string}[]>([])
  const [searching, setSearching] = useState(false)
  const [inviting, setInviting] = useState(false)
  
  const router = useRouter()
  const supabase = createClient() as any

  const isOwner = board.created_by === currentUserId

  useEffect(() => {
    if (isOpen && activeTab === 'members') {
      fetchMembers()
    }
  }, [isOpen, activeTab])

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .rpc('get_board_members', { p_board_id: board.id })
    
    if (!error && data) {
      // Add owner as first member
      const { data: ownerData } = await supabase
        .from('users')
        .select('email')
        .eq('id', board.created_by)
        .single()
      
      const ownerMember: BoardMember = {
        id: 'owner',
        user_id: board.created_by,
        email: ownerData?.email || 'Owner',
        role: 'owner',
        created_at: ''
      }
      
      setMembers([ownerMember, ...data.filter((m: BoardMember) => m.user_id !== board.created_by)])
    }
  }

  const searchUsers = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([])
      return
    }
    
    setSearching(true)
    const { data, error } = await supabase
      .rpc('search_users', { p_query: query })
    
    if (!error && data) {
      // Filter out existing members
      const existingIds = members.map(m => m.user_id)
      setSearchResults(data.filter((u: {id: string}) => !existingIds.includes(u.id)))
    }
    setSearching(false)
  }

  const inviteUser = async (userId: string, userEmail: string) => {
    setInviting(true)
    setError(null)
    
    const { error: insertError } = await supabase
      .from('board_members')
      .insert({
        board_id: board.id,
        user_id: userId,
        role: 'member'
      })
    
    if (insertError) {
      setError(insertError.message)
    } else {
      setEmailInput('')
      setSearchResults([])
      fetchMembers()
      
      // Create notification for invited user
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'board_invite',
        title: 'Board Invitation',
        message: `You have been invited to "${board.title}"`,
        link: `/boards/${board.id}`
      })
    }
    setInviting(false)
  }

  const removeMember = async (memberUserId: string) => {
    if (memberUserId === board.created_by) return // Can't remove owner
    
    const { error } = await supabase
      .from('board_members')
      .delete()
      .eq('board_id', board.id)
      .eq('user_id', memberUserId)
    
    if (!error) {
      fetchMembers()
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('boards')
      .update({
        title: title.trim(),
        description: description.trim() || null,
        background_color: backgroundColor,
      })
      .eq('id', board.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      router.refresh()
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
        title="Board settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
        title="Board settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Board Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'members'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Members
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {activeTab === 'settings' && (
              <>
                {/* Board Name */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Board Name
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Board name"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Add a description..."
                  />
                </div>

                {/* Background Color */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {BOARD_COLORS.map((colorOption) => (
                      <button
                        key={colorOption.color}
                        onClick={() => setBackgroundColor(colorOption.color)}
                        className={`h-10 rounded-lg border-2 transition-all flex items-center justify-center text-xs font-medium text-white ${
                          backgroundColor === colorOption.color
                            ? 'border-gray-900 ring-2 ring-gray-400'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: colorOption.color }}
                      >
                        {colorOption.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {activeTab === 'members' && (
              <>
                {/* Invite User */}
                {isOwner && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Invite Member
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value)
                          searchUsers(e.target.value)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search by email..."
                        disabled={inviting}
                      />
                      {searching && (
                        <div className="absolute right-3 top-2 text-gray-400">
                          ...
                        </div>
                      )}
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {searchResults.map((user) => (
                            <button
                              key={user.id}
                              onClick={() => inviteUser(user.id, user.email)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between"
                              disabled={inviting}
                            >
                              <span>{user.email}</span>
                              <span className="text-blue-600 text-xs">Invite</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Members List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Board Members ({members.length})
                  </h3>
                  {members.map((member) => (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {member.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {member.email}
                            {member.user_id === currentUserId && (
                              <span className="text-gray-400 text-xs ml-1">(you)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                        </div>
                      </div>
                      {member.role !== 'owner' && (isOwner || member.user_id !== currentUserId) && (
                        <button
                          onClick={() => removeMember(member.user_id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
