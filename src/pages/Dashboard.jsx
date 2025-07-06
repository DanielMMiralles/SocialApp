import { useAuth } from '../context/AuthContext'
import { logout } from '../services/authService'
import { useState } from 'react'
import LoadingScreen from '../components/ui/LoadingScreen'
import Profile from './Profile'
import CreatePostModal from '../components/posts/CreatePostModal'
import Feed from '../components/posts/Feed'
import FeedFilter from '../components/posts/FeedFilter'
import TrendingHashtags from '../components/ui/TrendingHashtags'
import { FeedProvider } from '../context/FeedContext'

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
    <FeedProvider>
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
          {/* Header del feed mejorado */}
          <div className="text-center mb-12">
            <div className="relative">
              <h1 className="text-5xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Tu Feed
                </span>
              </h1>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute -top-1 -right-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
              <div className="absolute -bottom-1 left-8 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
            </div>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              🌟 Descubre, conecta y comparte momentos increíbles con tu comunidad
            </p>
            
            {/* Botón flotante mejorado */}
            <div className="relative inline-block">
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-3xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <div className="p-1 bg-white/20 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span>Crear Publicación</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </button>
              
              {/* Partículas decorativas */}
              <div className="absolute -top-3 -right-3 w-6 h-6 border-2 border-purple-300 rounded-full animate-spin opacity-60"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-2 border-blue-300 rounded-full animate-bounce opacity-40"></div>
            </div>
          </div>
          
          {/* Layout del feed con filtro lateral */}
          <div className="max-w-6xl mx-auto relative">
            <div className="flex gap-6">
              {/* Feed principal */}
              <div className="flex-1 max-w-2xl mx-auto relative">
                {/* Decoración de fondo */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-30 blur-2xl"></div>
                
                <Feed newPosts={posts} />
              </div>
              
              {/* Sidebar con filtro */}
              <div className="hidden lg:block w-80 space-y-6">
                <FeedFilter />
                
                {/* Sugerencias de usuarios (placeholder) */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Sugerencias para ti</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Ana García</div>
                        <div className="text-xs text-gray-500">Sugerido para ti</div>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                        Seguir
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                        M
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Miguel Torres</div>
                        <div className="text-xs text-gray-500">Sugerido para ti</div>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                        Seguir
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Tendencias dinámicas */}
                <TrendingHashtags />
              </div>
            </div>
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
    </FeedProvider>
  )
}

export default Dashboard