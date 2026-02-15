'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient() as any

  const inviteToken = searchParams.get('invite')
  const inviteEmail = searchParams.get('email')

  useEffect(() => {
    if (inviteEmail) {
      setEmail(decodeURIComponent(inviteEmail))
    }
  }, [inviteEmail])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      
      // If there's an invite token, accept the invite after signup
      if (inviteToken) {
        // Wait a bit for auth to settle, then redirect to accept invite
        setTimeout(() => {
          window.location.href = `/api/invite/accept?token=${inviteToken}`
        }, 1500)
      } else {
        // Redirect to dashboard after signup
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1500)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0b1215',
      padding: '16px',
    }}>
      <div style={{
        maxWidth: '448px',
        width: '100%',
        backgroundColor: '#142024',
        borderRadius: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
        padding: '32px',
        border: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#f0f5f1',
            fontFamily: 'var(--font-geist-sans)',
            margin: 0,
          }}>
            Brumello ❄️
          </h1>
          <p style={{
            color: '#8a9b91',
            marginTop: '8px',
            fontSize: '14px',
            fontFamily: 'var(--font-geist-sans)',
          }}>
            Create your account
          </p>
        </div>

        {success ? (
          <div style={{
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            color: '#34d399',
            padding: '16px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            fontFamily: 'var(--font-geist-sans)',
          }}>
            <p style={{ fontWeight: '600', margin: 0 }}>Account created successfully!</p>
            <p style={{ fontSize: '14px', marginTop: '4px', margin: 0 }}>
              {inviteToken ? 'Accepting invite...' : 'Redirecting to dashboard...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontFamily: 'var(--font-geist-sans)',
              }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#c8d5cc',
                marginBottom: '4px',
                fontFamily: 'var(--font-geist-sans)',
              }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '10px',
                  backgroundColor: '#101a1e',
                  color: '#f0f5f1',
                  fontSize: '14px',
                  fontFamily: 'var(--font-geist-sans)',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(52,211,153,0.15)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.04)'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#c8d5cc',
                marginBottom: '4px',
                fontFamily: 'var(--font-geist-sans)',
              }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '10px',
                  backgroundColor: '#101a1e',
                  color: '#f0f5f1',
                  fontSize: '14px',
                  fontFamily: 'var(--font-geist-sans)',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(52,211,153,0.15)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.04)'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="••••••••"
              />
              <p style={{
                fontSize: '12px',
                color: '#8a9b91',
                marginTop: '4px',
                margin: 0,
                fontFamily: 'var(--font-geist-sans)',
              }}>
                At least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#0f9a70' : '#10b981',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                fontSize: '14px',
                fontFamily: 'var(--font-geist-sans)',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#34d399'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#10b981'
              }}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#8a9b91',
          fontFamily: 'var(--font-geist-sans)',
        }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{
            color: '#10b981',
            fontWeight: '600',
            textDecoration: 'none',
          }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
