'use client'

import Link from 'next/link'

interface BoardCardProps {
  board: {
    id: string
    title: string
    description?: string
    member?: boolean
    owned?: boolean
  }
}

export default function BoardCard({ board }: BoardCardProps) {
  return (
    <Link
      href={`/boards/${board.id}`}
      style={{
        backgroundColor: '#142024',
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
  )
}
