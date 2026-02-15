'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  position: number
}

interface Checklist {
  id: string
  title: string
  items: ChecklistItem[]
}

interface ChecklistSelectorProps {
  cardId: string
  onUpdate: () => void
}

export default function ChecklistSelector({ cardId, onUpdate }: ChecklistSelectorProps) {
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [newItemText, setNewItemText] = useState('')
  const [showAddItem, setShowAddItem] = useState<string | null>(null)
  const [showAddChecklist, setShowAddChecklist] = useState(false)
  const [newChecklistName, setNewChecklistName] = useState('')
  const router = useRouter()
  const supabase = createClient() as any

  useEffect(() => {
    fetchChecklists()
  }, [cardId])

  const fetchChecklists = async () => {
    const { data: checklistData } = await supabase
      .from('checklists')
      .select('*')
      .eq('card_id', cardId)
      .order('position', { ascending: true })

    if (checklistData) {
      const checklistsWithItems = await Promise.all(
        checklistData.map(async (checklist: any) => {
          const { data: items } = await supabase
            .from('checklist_items')
            .select('*')
            .eq('checklist_id', checklist.id)
            .order('position', { ascending: true })
          
          return {
            ...checklist,
            items: items || []
          }
        })
      )
      setChecklists(checklistsWithItems)
    }
  }

  const addChecklist = async () => {
    const title = newChecklistName.trim() || 'Checklist'
    const { data, error } = await supabase
      .from('checklists')
      .insert({
        card_id: cardId,
        title: title,
        position: checklists.length
      })
      .select()
      .single()

    if (!error && data) {
      setNewChecklistName('')
      setShowAddChecklist(false)
      await fetchChecklists()
      onUpdate()
    }
  }

  const updateChecklistTitle = async (checklistId: string, newTitle: string) => {
    await supabase
      .from('checklists')
      .update({ title: newTitle })
      .eq('id', checklistId)
    
    await fetchChecklists()
    onUpdate()
  }

  const addItem = async (checklistId: string) => {
    if (!newItemText.trim()) return

    const checklist = checklists.find(c => c.id === checklistId)
    if (!checklist) return

    const { error } = await supabase
      .from('checklist_items')
      .insert({
        checklist_id: checklistId,
        text: newItemText.trim(),
        position: checklist.items.length
      })

    if (!error) {
      setNewItemText('')
      setShowAddItem(null)
      await fetchChecklists()
      onUpdate()
    }
  }

  const toggleItem = async (itemId: string, completed: boolean) => {
    await supabase
      .from('checklist_items')
      .update({ completed: !completed })
      .eq('id', itemId)

    await fetchChecklists()
    onUpdate()
  }

  const deleteChecklist = async (checklistId: string) => {
    await supabase
      .from('checklists')
      .delete()
      .eq('id', checklistId)

    await fetchChecklists()
    onUpdate()
  }

  const deleteItem = async (itemId: string) => {
    await supabase
      .from('checklist_items')
      .delete()
      .eq('id', itemId)

    await fetchChecklists()
    onUpdate()
  }

  const getProgress = (items: ChecklistItem[]) => {
    if (items.length === 0) return 0
    const completed = items.filter(i => i.completed).length
    return Math.round((completed / items.length) * 100)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f5f1', fontFamily: 'Geist Sans, sans-serif' }}>Checklists</h3>
        {!showAddChecklist ? (
          <button
            onClick={() => setShowAddChecklist(true)}
            style={{
              fontSize: '0.875rem',
              color: '#34d399',
              fontWeight: 500,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Geist Sans, sans-serif'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#34d399'}
          >
            + Add checklist
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={newChecklistName}
              onChange={(e) => setNewChecklistName(e.target.value)}
              placeholder="Checklist name..."
              style={{
                padding: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: '#101a1e',
                color: '#c8d5cc',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '10px',
                outline: 'none',
                fontFamily: 'Geist Sans, sans-serif'
              }}
              onFocus={(e) => e.currentTarget.style.outline = '1px solid #34d399'}
              onBlur={(e) => e.currentTarget.style.outline = 'none'}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && addChecklist()}
            />
            <button
              onClick={addChecklist}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                backgroundColor: '#10b981',
                color: '#f0f5f1',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                fontFamily: 'Geist Sans, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddChecklist(false)
                setNewChecklistName('')
              }}
              style={{
                padding: '0.5rem',
                fontSize: '0.875rem',
                color: '#8a9b91',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Geist Sans, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#c8d5cc'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#8a9b91'}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {checklists.length === 0 && !showAddChecklist ? (
        <p style={{ fontSize: '0.875rem', color: '#8a9b91', fontStyle: 'italic', fontFamily: 'Geist Sans, sans-serif' }}>No checklists yet</p>
      ) : (
        checklists.map((checklist) => (
          <div key={checklist.id} style={{ 
            backgroundColor: '#142024', 
            border: '1px solid rgba(255,255,255,0.04)', 
            borderRadius: '14px', 
            padding: '1rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            {/* Checklist Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={checklist.title}
                onChange={(e) => updateChecklistTitle(checklist.id, e.target.value)}
                style={{
                  fontWeight: 500,
                  color: '#f0f5f1',
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid transparent',
                  outline: 'none',
                  padding: '0.25rem',
                  marginLeft: '-0.25rem',
                  fontFamily: 'Geist Sans, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderBottom = '1px solid rgba(255,255,255,0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
                onFocus={(e) => e.currentTarget.style.borderBottom = '1px solid #34d399'}
                onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
              />
              <button
                onClick={() => deleteChecklist(checklist.id)}
                style={{
                  fontSize: '0.75rem',
                  color: '#f87171',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Geist Sans, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Delete
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8a9b91', marginBottom: '0.25rem', fontFamily: 'Geist Mono, monospace' }}>
                <span>{checklist.items.filter(i => i.completed).length}/{checklist.items.length}</span>
                <span>{getProgress(checklist.items)}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#101a1e', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div
                  style={{ 
                    height: '100%', 
                    backgroundColor: '#10b981', 
                    width: `${getProgress(checklist.items)}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {checklist.items.map((item) => (
                <div
                  key={item.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItem(item.id, item.completed)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#10b981',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    flex: 1, 
                    fontSize: '0.875rem', 
                    color: item.completed ? '#8a9b91' : '#c8d5cc',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    fontFamily: 'Geist Sans, sans-serif'
                  }}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    style={{
                      color: '#8a9b91',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      fontFamily: 'Geist Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#f87171'
                      e.currentTarget.style.opacity = '1'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#8a9b91'
                    }}
                    onFocus={(e) => e.currentTarget.style.opacity = '1'}
                    onBlur={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Item */}
            {showAddItem === checklist.id ? (
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add an item..."
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: '#101a1e',
                    color: '#c8d5cc',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '10px',
                    outline: 'none',
                    fontFamily: 'Geist Sans, sans-serif'
                  }}
                  onFocus={(e) => e.currentTarget.style.outline = '1px solid #34d399'}
                  onBlur={(e) => e.currentTarget.style.outline = 'none'}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && addItem(checklist.id)}
                />
                <button
                  onClick={() => addItem(checklist.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    backgroundColor: '#10b981',
                    color: '#f0f5f1',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: 'Geist Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddItem(null)
                    setNewItemText('')
                  }}
                  style={{
                    padding: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#8a9b91',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Geist Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#c8d5cc'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8a9b91'}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddItem(checklist.id)}
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#8a9b91',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Geist Sans, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c8d5cc'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8a9b91'}
              >
                + Add an item
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )
}
