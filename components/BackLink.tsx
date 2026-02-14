'use client'

export default function BackLink() {
  const handleClick = () => {
    window.location.href = '/boards'
  }

  return (
    <button 
      onClick={handleClick}
      className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
    >
      ← Back to Boards
    </button>
  )
}
