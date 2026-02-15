'use client'

import Link from 'next/link'

interface ActionButtonProps {
  href: string
  children: React.ReactNode
}

export default function ActionButton({ href, children }: ActionButtonProps) {
  return (
    <Link 
      href={href}
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#10b981',
        color: '#f0f5f1',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '15px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        border: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#34d399'
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#10b981'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)'
      }}
    >
      {children}
    </Link>
  )
}
