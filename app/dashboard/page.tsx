import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/SignOutButton'
import ActionButton from '@/components/ActionButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b1215',
      fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#101a1e',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#f0f5f1',
            margin: 0,
            fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
          }}>
            Brumello <span style={{ color: '#34d399' }}>❄️</span>
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{
              fontSize: '14px',
              color: '#8a9b91',
              fontFamily: 'var(--font-geist-mono), monospace'
            }}>{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div style={{
          backgroundColor: '#142024',
          borderRadius: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
          padding: '48px 32px',
          border: '1px solid rgba(255,255,255,0.04)'
        }}>
          <div style={{
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: 400,
              color: '#f0f5f1',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              letterSpacing: '-0.02em'
            }}>
              Welcome to Brumello! 🎉
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#c8d5cc',
              margin: '0 0 48px 0',
              fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
            }}>
              You're now logged in and ready to manage your tasks.
            </p>
            
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: '#101a1e',
                padding: '24px',
                borderRadius: '14px',
                border: '1px solid rgba(52,211,153,0.15)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{
                  fontWeight: 600,
                  color: '#34d399',
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
                }}>✅ Authentication Working!</h3>
                <p style={{
                  color: '#c8d5cc',
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.6',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
                }}>
                  You've successfully signed up and logged in. Your account is connected to Supabase.
                </p>
              </div>

              <div style={{
                backgroundColor: '#101a1e',
                padding: '24px',
                borderRadius: '14px',
                border: '1px solid rgba(52,211,153,0.15)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{
                  fontWeight: 600,
                  color: '#10b981',
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
                }}>✅ Ready to Use:</h3>
                <ActionButton href="/boards">
                  Go to Your Boards →
                </ActionButton>
              </div>

              <div style={{
                backgroundColor: '#101a1e',
                padding: '24px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{
                  fontWeight: 600,
                  color: '#f0f5f1',
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
                }}>🚀 Coming Soon:</h3>
                <ul style={{
                  fontSize: '14px',
                  color: '#c8d5cc',
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  lineHeight: '1.8',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
                }}>
                  <li>• Add lists and cards</li>
                  <li>• Drag & drop interface</li>
                  <li>• Real-time collaboration</li>
                  <li>• Labels, comments, and more!</li>
                </ul>
              </div>

              <div style={{
                backgroundColor: '#101a1e',
                padding: '24px',
                borderRadius: '14px',
                border: '1px solid rgba(52,211,153,0.15)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{
                  fontWeight: 600,
                  color: '#10b981',
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
                }}>📊 Your Stats:</h3>
                <p style={{
                  color: '#c8d5cc',
                  fontSize: '14px',
                  margin: '0 0 8px 0',
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
                }}>
                  User ID: <code style={{
                    backgroundColor: '#142024',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.15)'
                  }}>{user.id}</code>
                </p>
                <p style={{
                  color: '#c8d5cc',
                  fontSize: '14px',
                  margin: 0,
                  fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
                }}>
                  Email: <code style={{
                    backgroundColor: '#142024',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.15)'
                  }}>{user.email}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#8a9b91',
        fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif'
      }}>
        <p style={{ margin: 0 }}>Built with ❄️ by Brumalia | Phase 1: Authentication Complete ✅</p>
      </footer>
    </div>
  )
}
