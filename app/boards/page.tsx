import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateBoardButton from '@/components/CreateBoardButton'
import NotificationBell from '@/components/NotificationBell'
import BoardCard from '@/components/BoardCard'

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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0b1215',
      fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#101a1e',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link 
            href="/dashboard"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#f0f5f1',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Brumello <span style={{ fontSize: '16px' }}>❄️</span>
          </Link>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{
              fontSize: '14px',
              color: '#8a9b91'
            }}>
              {user.email}
            </span>
            <NotificationBell userId={user.id} />
            <Link 
              href="/dashboard"
              style={{
                fontSize: '14px',
                color: '#8a9b91',
                textDecoration: 'none'
              }}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 600,
            color: '#f0f5f1',
            margin: 0
          }}>
            Your Boards
          </h2>
          <CreateBoardButton />
        </div>

        {allBoards.length === 0 ? (
          <div style={{
            backgroundColor: '#142024',
            borderRadius: '14px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
            padding: '64px 48px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '24px'
            }}>
              📋
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#f0f5f1',
              margin: '0 0 12px 0'
            }}>
              No boards yet
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#8a9b91',
              margin: '0 0 32px 0'
            }}>
              Create your first board to get started!
            </p>
            <CreateBoardButton />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {allBoards.map((board: any) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
