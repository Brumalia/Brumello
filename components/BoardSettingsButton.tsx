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
      <button 
        onClick={() => setIsOpen(true)} 
        style={{
          padding: '8px',
          color: '#e2e8e4',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '10px',
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
        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && createPortal(
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div 
            style={{
              backgroundColor: '#142024',
              borderRadius: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '450px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid rgba(255,255,255,0.07)'
            }}
          >
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)'
              }}
            >
              <h2 
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#f0f5f1',
                  margin: 0
                }}
              >
                Board Settings
              </h2>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{
                  fontSize: '28px',
                  color: '#8a9b91',
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
                &times;
              </button>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <button 
                onClick={() => setTab('settings')} 
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: tab === 'settings' ? '#34d399' : '#8a9b91',
                  borderBottom: tab === 'settings' ? '2px solid #34d399' : 'none'
                }}
              >
                Settings
              </button>
              <button 
                onClick={() => setTab('members')} 
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: tab === 'members' ? '#34d399' : '#8a9b91',
                  borderBottom: tab === 'members' ? '2px solid #34d399' : 'none'
                }}
              >
                Members
              </button>
            </div>
            <div 
              style={{
                padding: '16px',
                maxHeight: 'calc(90vh - 140px)',
                overflowY: 'auto'
              }}
            >
              {tab === 'settings' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label 
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        marginBottom: '4px',
                        color: '#e2e8e4'
                      }}
                    >
                      Board Name
                    </label>
                    <input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#101a1e',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '10px',
                        color: '#e2e8e4',
                        fontSize: '14px'
                      }} 
                    />
                  </div>
                  <div>
                    <label 
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        marginBottom: '4px',
                        color: '#e2e8e4'
                      }}
                    >
                      Description
                    </label>
                    <textarea 
                      value={desc} 
                      onChange={(e) => setDesc(e.target.value)} 
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#101a1e',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '10px',
                        color: '#e2e8e4',
                        fontSize: '14px',
                        resize: 'vertical'
                      }} 
                    />
                  </div>
                  <div>
                    <label 
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        marginBottom: '8px',
                        color: '#e2e8e4'
                      }}
                    >
                      Background Color
                    </label>
                    <div 
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '8px'
                      }}
                    >
                      {COLORS.map((c) => (
                        <button 
                          key={c.color} 
                          onClick={() => setBg(c.color)} 
                          style={{
                            height: '40px',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 500,
                            backgroundColor: c.color,
                            border: bg === c.color ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            boxShadow: bg === c.color ? '0 0 0 2px #0b1215, 0 0 0 4px #34d399' : 'none'
                          }}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={save} 
                    disabled={saving} 
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#34d399',
                      color: '#0b1215',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '14px',
                      border: 'none',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.5 : 1,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!saving) e.currentTarget.style.backgroundColor = '#10b981'
                    }}
                    onMouseLeave={(e) => {
                      if (!saving) e.currentTarget.style.backgroundColor = '#34d399'
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label 
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
            color: '#e2e8e4'
          }}
        >
          Add Members
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              searchUsers(e.target.value)
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#101a1e',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px',
              color: '#e2e8e4',
              fontSize: '14px'
            }}
          />
          {searchResults.length > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: '#142024',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
                zIndex: 10,
                maxHeight: '160px',
                overflowY: 'auto'
              }}
            >
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => inviteMember(user.id)}
                  disabled={inviting}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    fontSize: '14px',
                    color: '#e2e8e4',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: inviting ? 'not-allowed' : 'pointer',
                    opacity: inviting ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!inviting) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {user.email}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label 
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '8px',
            color: '#e2e8e4'
          }}
        >
          Board Members
        </label>
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '192px',
            overflowY: 'auto'
          }}
        >
          {loading ? (
            <p style={{ fontSize: '14px', color: '#8a9b91' }}>Loading...</p>
          ) : members.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#8a9b91' }}>No members yet</p>
          ) : (
            members.map((member) => (
              <div 
                key={member.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px',
                  backgroundColor: '#101a1e',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <span style={{ color: '#e2e8e4' }}>{member.email}</span>
                <button
                  onClick={() => removeMember(member.id)}
                  style={{
                    color: '#f87171',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#f87171'
                  }}
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
