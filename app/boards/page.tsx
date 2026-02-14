import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateBoardButton from '@/components/CreateBoardButton'
import NotificationBell from '@/components/NotificationBell'

export default async function BoardsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's boards (created by them)
  const { data: ownedBoards } = await supabase
    .from('boards')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  // Fetch board IDs where user is a member
  const { data: memberShip } = await supabase
    .from('board_members')
    .select('board_id')
    .eq('user_id', user.id)

  let memberBoards: any[] = []
  if (memberShip && memberShip.length > 0) {
    const boardIds = memberShip.map(m => m.board_id)
    const { data: boards } = await supabase
      .from('boards')
      .select('*')
      .in('id', boardIds)
      .neq('created_by', user.id)
    memberBoards = (boards || []).map(b => ({ ...b, member: true }))
  }

  const allBoards = [
    ...(ownedBoards || []).map(b => ({ ...b, owned: true })),
    ...memberBoards
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
              Brumello <span className="text-blue-600">❄️</span>
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <NotificationBell userId={user.id} />
            <Link 
              href="/dashboard"
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Boards</h2>
          <CreateBoardButton />
        </div>

        {allBoards.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No boards yet</h3>
            <p className="text-gray-600 mb-6">Create your first board to get started!</p>
            <CreateBoardButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBoards.map((board: any) => (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer relative"
                style={{ backgroundColor: board.background_color || '#0079bf' }}
              >
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{board.title}</h3>
                  {board.description && (
                    <p className="text-sm opacity-90 line-clamp-2">{board.description}</p>
                  )}
                  {board.member && (
                    <span className="absolute top-2 right-2 bg-white bg-opacity-20 text-xs px-2 py-1 rounded">
                      Shared
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
