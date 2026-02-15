import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import SignOutButton from '@/components/SignOutButton'
import CreateListButton from '@/components/CreateListButton'
import BoardContent from '@/components/BoardContent'
import BoardSettingsButton from '@/components/BoardSettingsButton'
import NotificationBell from '@/components/NotificationBell'
import BackLink from '@/components/BackLink'

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
      style={{ 
        minHeight: '100vh',
        backgroundColor: '#0b1215',
        fontFamily: 'Geist Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      {/* Header - Status Bar Style */}
      <header 
        style={{
          backgroundColor: '#101a1e',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div 
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <BackLink />
            <h1 
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#f0f5f1',
                margin: 0,
                letterSpacing: '-0.01em'
              }}
            >
              {board.title}
            </h1>
          </div>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <span 
              style={{
                fontSize: '14px',
                color: '#8a9b91'
              }}
            >
              {user.email}
            </span>
            <NotificationBell userId={user.id} />
            <BoardSettingsButton board={board} currentUserId={user.id} />
            <SignOutButton />
          </div>
        </div>
        {board.description && (
          <div 
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingBottom: '16px'
            }}
          >
            <p 
              style={{
                color: '#8a9b91',
                fontSize: '14px',
                margin: 0,
                lineHeight: '1.5'
              }}
            >
              {board.description}
            </p>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '24px'
        }}
      >
        {lists && lists.length > 0 ? (
          <BoardContent lists={lists} boardId={board.id} />
        ) : (
          <div 
            style={{
              display: 'flex',
              gap: '16px'
            }}
          >
            <div 
              style={{
                backgroundColor: '#142024',
                borderRadius: '14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                padding: '48px',
                textAlign: 'center',
                flex: 1,
                border: '1px solid rgba(255,255,255,0.04)'
              }}
            >
              <div 
                style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}
              >
                📝
              </div>
              <h3 
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#f0f5f1',
                  marginBottom: '8px',
                  marginTop: 0
                }}
              >
                No lists yet
              </h3>
              <p 
                style={{
                  color: '#8a9b91',
                  fontSize: '14px',
                  margin: '0 0 24px 0'
                }}
              >
                Add your first list to start organizing tasks!
              </p>
            </div>
            <CreateListButton boardId={board.id} listsCount={0} />
          </div>
        )}
      </main>
    </div>
  )
}
