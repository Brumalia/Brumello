'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <button 
      onClick={() => router.push('/boards')}
      className="text-white hover:text-gray-200 flex items-center gap-1 transition-colors"
    >
      ← Back to Boards
    </button>
  )
}
