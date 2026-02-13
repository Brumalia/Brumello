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
        checklistData.map(async (checklist) => {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Checklists</h3>
        {!showAddChecklist ? (
          <button
            onClick={() => setShowAddChecklist(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add checklist
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newChecklistName}
              onChange={(e) => setNewChecklistName(e.target.value)}
              placeholder="Checklist name..."
              className="px-2 py-1 text-sm border border-gray-300 rounded"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && addChecklist()}
            />
            <button
              onClick={addChecklist}
              className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddChecklist(false)
                setNewChecklistName('')
              }}
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {checklists.length === 0 && !showAddChecklist ? (
        <p className="text-sm text-gray-500 italic">No checklists yet</p>
      ) : (
        checklists.map((checklist) => (
          <div key={checklist.id} className="border border-gray-200 rounded-lg p-3">
            {/* Checklist Header */}
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={checklist.title}
                onChange={(e) => updateChecklistTitle(checklist.id, e.target.value)}
                className="font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 -ml-1"
              />
              <button
                onClick={() => deleteChecklist(checklist.id)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{checklist.items.filter(i => i.completed).length}/{checklist.items.length}</span>
                <span>{getProgress(checklist.items)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${getProgress(checklist.items)}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-1">
              {checklist.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 group"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItem(item.id, item.completed)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Item */}
            {showAddItem === checklist.id ? (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add an item..."
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && addItem(checklist.id)}
                />
                <button
                  onClick={() => addItem(checklist.id)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddItem(null)
                    setNewItemText('')
                  }}
                  className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddItem(checklist.id)}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700"
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
