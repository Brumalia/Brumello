'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CTAButtons() {
  const [hoveredPrimary, setHoveredPrimary] = useState(false)
  const [hoveredGhost, setHoveredGhost] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
      <Link 
        href="/auth/signup"
        onMouseEnter={() => setHoveredPrimary(true)}
        onMouseLeave={() => setHoveredPrimary(false)}
        style={{
          padding: '14px 32px',
          backgroundColor: hoveredPrimary ? '#34d399' : '#10b981',
          color: '#0b1215',
          borderRadius: '10px',
          fontWeight: '600',
          fontSize: '16px',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          border: 'none',
          boxShadow: hoveredPrimary ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 1px 2px rgba(0,0,0,0.3)',
          transform: hoveredPrimary ? 'translateY(-1px)' : 'translateY(0)',
        }}
      >
        Get Started
      </Link>
      <Link 
        href="/auth/login"
        onMouseEnter={() => setHoveredGhost(true)}
        onMouseLeave={() => setHoveredGhost(false)}
        style={{
          padding: '14px 32px',
          backgroundColor: hoveredGhost ? 'rgba(255,255,255,0.06)' : 'transparent',
          color: '#c8d5cc',
          borderRadius: '10px',
          fontWeight: '600',
          fontSize: '16px',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        Sign In
      </Link>
    </div>
  )
}
