import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'
import CreateListButton from '@/components/CreateListButton'
import BoardContent from '@/components/BoardContent'
import BoardSettingsButton from '@/components/BoardSettingsButton'
import NotificationBell from '@/components/NotificationBell'

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch the board - check if user is owner OR member
  const { data: board, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !board) {
    notFound()
  }

  // Check access: owner or member
  const isOwner = board.created_by === user.id
  const { data: membership } = await supabase
    .from('board_members')
    .select('*')
    .eq('board_id', id)
    .eq('user_id', user.id)
    .single()

  if (!isOwner && !membership) {
    notFound()
  }

  // Fetch lists for this board with labels
  const { data: lists } = await supabase
    .from('lists')
    .select(`
      *,
      cards(
        *,
        card_labels(
          labels(*)
        )
      )
    `)
    .eq('board_id', id)
    .order('position', { ascending: true })
  
  // Sort cards within each list by position
  if (lists) {
    lists.forEach(list => {
      if (list.cards) {
        list.cards.sort((a: any, b: any) => a.position - b.position)
      }
    })
  }

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
              <Link 
                href="/boards"
                className="text-white hover:text-gray-200 transition-colors flex items-center gap-1"
              >
                ← Back to Boards
              </Link>
              <h1 className="text-2xl font-bold text-white">
                {board.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white">{user.email}</span>
              <NotificationBell userId={user.id} />
              <BoardSettingsButton board={board} currentUserId={user.id} />
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
          <BoardContent lists={lists} boardId={board.id} />
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
