'use client'

export default function BackLink() {
  const handleClick = () => {
    window.location.href = '/boards'
  }

  return (
    <button 
      onClick={handleClick}
      style={{
        color: '#e2e8e4',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '14px',
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: '6px',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#f0f5f1'
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#e2e8e4'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      ← Back to Boards
    </button>
  )
}
