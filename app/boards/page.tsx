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
              gap: '6px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#34d399'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#f0f5f1'}
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
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8e4'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#8a9b91'}
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
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                style={{
                  backgroundColor: board.background_color || '#142024',
                  borderRadius: '14px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  padding: '24px',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  display: 'block',
                  minHeight: '140px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#ffffff',
                    margin: '0 0 8px 0',
                    lineHeight: 1.3
                  }}>
                    {board.title}
                  </h3>
                  {board.description && (
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.85)',
                      margin: 0,
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {board.description}
                    </p>
                  )}
                  {board.member && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}>
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
