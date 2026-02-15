'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password')
  const router = useRouter()
  const supabase = createClient() as any

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://brumello.vercel.app/auth/callback',
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Check your email for the magic link!')
    }
    setLoading(false)
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
            Sign in to your account
          </p>
        </div>

        {/* Login Method Toggle */}
        <div style={{
          display: 'flex',
          marginBottom: '24px',
          backgroundColor: '#101a1e',
          borderRadius: '10px',
          padding: '4px',
          border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <button
            type="button"
            onClick={() => setLoginMethod('password')}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: loginMethod === 'password' ? '#142024' : 'transparent',
              color: loginMethod === 'password' ? '#f0f5f1' : '#8a9b91',
              boxShadow: loginMethod === 'password' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
              fontFamily: 'var(--font-geist-sans)',
            }}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('magic')}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: loginMethod === 'magic' ? '#142024' : 'transparent',
              color: loginMethod === 'magic' ? '#f0f5f1' : '#8a9b91',
              boxShadow: loginMethod === 'magic' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
              fontFamily: 'var(--font-geist-sans)',
            }}
          >
            Magic Link
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '14px',
            marginBottom: '16px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontFamily: 'var(--font-geist-sans)',
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            color: '#34d399',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '14px',
            marginBottom: '16px',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            fontFamily: 'var(--font-geist-sans)',
          }}>
            {success}
          </div>
        )}

        {loginMethod === 'password' ? (
          <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="magic-email" style={{
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
                id="magic-email"
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
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>

            <p style={{
              fontSize: '12px',
              color: '#8a9b91',
              textAlign: 'center',
              margin: 0,
              fontFamily: 'var(--font-geist-sans)',
            }}>
              We'll email you a secure link to sign in
            </p>
          </form>
        )}

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#8a9b91',
          fontFamily: 'var(--font-geist-sans)',
        }}>
          Don't have an account?{' '}
          <Link href="/auth/signup" style={{
            color: '#10b981',
            fontWeight: '600',
            textDecoration: 'none',
          }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
