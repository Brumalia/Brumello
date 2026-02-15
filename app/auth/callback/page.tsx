'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient() as any
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error.message)
        } else {
          // Success - redirect to dashboard
          router.push('/dashboard')
          router.refresh()
        }
      } catch (err: any) {
        setError(err.message || 'Authentication failed')
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [router, supabase])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b1215',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid transparent',
              borderTopColor: '#10b981',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ color: '#10b981', fontSize: '16px' }}>Signing you in...</p>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b1215',
          padding: '16px',
        }}
      >
        <div
          style={{
            maxWidth: '448px',
            width: '100%',
            backgroundColor: '#142024',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#f0f5f1',
              marginBottom: '8px',
            }}
          >
            Authentication Failed
          </h2>
          <p
            style={{
              color: '#f87171',
              marginBottom: '24px',
              fontSize: '14px',
            }}
          >
            {error}
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '8px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#34d399'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981'
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return null
}
