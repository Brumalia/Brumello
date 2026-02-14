'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'

interface Board {
  id: string
  title: string
  description: string | null
  background_color: string
  created_by: string
}

const COLORS = [
  { name: 'Blue', color: '#0079bf' },
  { name: 'Green', color: '#519839' },
  { name: 'Yellow', color: '#d9b51c' },
  { name: 'Orange', color: '#e67e22' },
  { name: 'Red', color: '#eb5a46' },
  { name: 'Purple', color: '#c377e0' },
  { name: 'Pink', color: '#f24e4e' },
  { name: 'Teal', color: '#00c2e0' },
]

export default function BoardSettingsButton({ board, currentUserId }: { board: Board; currentUserId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<'settings' | 'members'>('settings')
  const [title, setTitle] = useState(board.title)
  const [desc, setDesc] = useState(board.description || '')
  const [bg, setBg] = useState(board.background_color)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const save = async () => {
    setSaving(true)
    await supabase.from('boards').update({ title, description: desc || null, background_color: bg }).eq('id', board.id)
    router.refresh()
    setIsOpen(false)
    setSaving(false)
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 text-white hover:bg-white/20 rounded-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Board Settings</h2>
              <button onClick={() => setIsOpen(false)} className="text-2xl text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="flex border-b">
              <button onClick={() => setTab('settings')} className={`flex-1 py-3 text-sm font-medium ${tab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Settings</button>
              <button onClick={() => setTab('members')} className={`flex-1 py-3 text-sm font-medium ${tab === 'members' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Members</button>
            </div>
            <div className="p-4 max-h-[calc(90vh-140px)] overflow-y-auto">
              {tab === 'settings' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Board Name</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Background Color</label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLORS.map((c) => (
                        <button key={c.color} onClick={() => setBg(c.color)} className={`h-10 rounded-lg text-white text-xs font-medium ${bg === c.color ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`} style={{ backgroundColor: c.color }}>{c.name}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={save} disabled={saving} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <MembersTab boardId={board.id} />
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

function MembersTab({ boardId }: { boardId: string }) {
  const [members, setMembers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [inviting, setInviting] = useState(false)
  const supabase = createClient() as any

  // Load members on mount
  useEffect(() => {
    loadMembers()
  }, [boardId])

  const loadMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase.rpc('get_board_members', { p_board_id: boardId })
    if (!error && data) {
      setMembers(data)
    }
    setLoading(false)
  }

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    const { data, error } = await supabase.rpc('search_users', { p_query: query })
    if (!error && data) {
      // Filter out already-added members
      const filtered = data.filter((user: any) => !members.some(m => m.user_id === user.id))
      setSearchResults(filtered)
    }
  }

  const inviteMember = async (userId: string) => {
    setInviting(true)
    const { error } = await supabase
      .from('board_members')
      .insert({ board_id: boardId, user_id: userId, role: 'member' })
    
    if (!error) {
      setSearchQuery('')
      setSearchResults([])
      await loadMembers()
    }
    setInviting(false)
  }

  const removeMember = async (memberId: string) => {
    const { error } = await supabase
      .from('board_members')
      .delete()
      .eq('id', memberId)
    
    if (!error) {
      await loadMembers()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Add Members</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              searchUsers(e.target.value)
            }}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => inviteMember(user.id)}
                  disabled={inviting}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b text-sm last:border-b-0 disabled:opacity-50"
                >
                  {user.email}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Board Members</label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-gray-500">No members yet</p>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                <span>{member.email}</span>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
