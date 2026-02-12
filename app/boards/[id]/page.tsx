import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'
import CreateListButton from '@/components/CreateListButton'

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch the board
  const { data: board, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', id)
    .eq('created_by', user.id)
    .single()

  if (error || !board) {
    notFound()
  }

  // Fetch lists for this board
  const { data: lists } = await supabase
    .from('lists')
    .select('*, cards(*)')
    .eq('board_id', id)
    .order('position', { ascending: true })

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${board.background_color} 0%, ${adjustColor(board.background_color, -20)} 100%)` 
      }}
    >
      {/* Header */}
      <header className="bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/boards" className="text-white hover:text-gray-200">
                ← Back to Boards
              </Link>
              <h1 className="text-2xl font-bold text-white">
                {board.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white">{user.email}</span>
              <SignOutButton />
            </div>
          </div>
          {board.description && (
            <p className="text-white text-sm mt-2 opacity-90">{board.description}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {lists && lists.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {lists.map((list) => (
              <div
                key={list.id}
                className="bg-gray-100 rounded-lg p-4 min-w-[300px] max-w-[300px]"
              >
                <h3 className="font-bold text-gray-900 mb-3">{list.title}</h3>
                <div className="space-y-2">
                  {list.cards?.map((card: any) => (
                    <div
                      key={card.id}
                      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <p className="text-sm text-gray-900">{card.title}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded p-2 transition-colors">
                  + Add a card
                </button>
              </div>
            ))}
            <CreateListButton boardId={board.id} listsCount={lists.length} />
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-12 text-center flex-1">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No lists yet</h3>
              <p className="text-gray-600 mb-6">Add your first list to start organizing tasks!</p>
            </div>
            <CreateListButton boardId={board.id} listsCount={0} />
          </div>
        )}
      </main>
    </div>
  )
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
