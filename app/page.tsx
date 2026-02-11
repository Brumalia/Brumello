export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">
            Brumello <span className="text-blue-600">❄️</span>
          </h1>
          <p className="text-2xl text-gray-600">
            Task Management for the Agent Development Studio
          </p>
        </div>
        
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-lg text-gray-700">
            A modern, powerful task management tool built with Next.js and Supabase.
          </p>
          <p className="text-md text-gray-600">
            Built by agents, for agents (and humans too!)
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-8">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Learn More
          </button>
        </div>

        <div className="pt-12 text-sm text-gray-500">
          <p>🚀 Phase 1: Foundation in progress</p>
          <p className="pt-2">Built with ❄️ by Brumalia</p>
        </div>
      </div>
    </main>
  )
}
