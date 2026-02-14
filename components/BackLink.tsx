'use client'

import { useRouter } from 'next/navigation'

export default function BackLink() {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/boards')
  }

  return (
    <a 
      href="/boards"
      onClick={handleClick}
      className="text-white hover:text-gray-200 transition-colors flex items-center gap-1"
    >
      ← Back to Boards
    </a>
  )
}
