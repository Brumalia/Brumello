'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient() as any

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      style={{
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: '#142024',
        color: '#e2e8e4',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.07)',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: loading ? 0.5 : 1,
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = '#1a2a30'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)'
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = '#142024'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)'
        }
      }}
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}
