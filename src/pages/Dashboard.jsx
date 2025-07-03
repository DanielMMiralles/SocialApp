import { useAuth } from '../context/AuthContext'
import { logout } from '../services/authService'
import { useState } from 'react'
import LoadingScreen from '../components/ui/LoadingScreen'
import Profile from './Profile'
import CreatePostModal from '../components/posts/CreatePostModal'
import Feed from '../components/posts/Feed'

function Dashboard() {
  const { user, userProfile } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [posts, setPosts] = useState([])

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    // AuthContext maneja el delay automáticamente
  }

  if (isLoggingOut) {
    return <LoadingScreen />
  }

  if (currentView === 'profile') {
    return <Profile onBack={() => setCurrentView('dashboard')} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <span className="text-sm font-bold text-white">CL</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">CrossLine</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Botón de perfil minimalista */}
              <button 
                onClick={() => setCurrentView('profile')}
                className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl p-2 transition-all duration-200 hover:shadow-md hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {userProfile?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {userProfile?.displayName || user?.email}
                  </div>
                </div>
              </button>
              
              {/* Botón de cerrar sesión más discreto */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                title="Cerrar Sesión"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header del feed */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Tu Feed
              </h2>
              <p className="text-gray-600">
                Descubre lo que está pasando en tu comunidad
              </p>
            </div>
            
            {/* Botón para crear publicación */}
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nueva Publicación</span>
            </button>
          </div>
          
          {/* Feed de publicaciones */}
          <div className="max-w-2xl mx-auto">
            <Feed newPosts={posts} />
          </div>
        </div>
      </main>

      {/* Modal de crear publicación */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}

export default Dashboard