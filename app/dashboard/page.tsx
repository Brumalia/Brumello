import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/SignOutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Brumello <span className="text-blue-600">❄️</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome to Brumello! 🎉
            </h2>
            <p className="text-lg text-gray-600">
              You're now logged in and ready to manage your tasks.
            </p>
            
            <div className="pt-8 space-y-4 max-w-2xl mx-auto text-left">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">✅ Authentication Working!</h3>
                <p className="text-blue-700 text-sm">
                  You've successfully signed up and logged in. Your account is connected to Supabase.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">🚀 Coming Soon:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Create and manage boards</li>
                  <li>• Add lists and cards</li>
                  <li>• Drag & drop interface</li>
                  <li>• Real-time collaboration</li>
                  <li>• Labels, comments, and more!</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">📊 Your Stats:</h3>
                <p className="text-green-700 text-sm">
                  User ID: <code className="bg-green-100 px-2 py-1 rounded text-xs">{user.id}</code>
                </p>
                <p className="text-green-700 text-sm mt-2">
                  Email: <code className="bg-green-100 px-2 py-1 rounded text-xs">{user.email}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-600">
        <p>Built with ❄️ by Brumalia | Phase 1: Authentication Complete ✅</p>
      </footer>
    </div>
  )
}
