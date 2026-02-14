'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Board Settings</h2>
              <button onClick={() => setIsOpen(false)} className="text-2xl text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="flex border-b">
              <button onClick={() => setTab('settings')} className={`flex-1 py-3 text-sm font-medium ${tab === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Settings</button>
              <button onClick={() => setTab('members')} className={`flex-1 py-3 text-sm font-medium ${tab === 'members' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Members</button>
            </div>
            <div className="p-4">
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
                <div className="py-8 text-center text-gray-500">
                  <p>Member management coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
