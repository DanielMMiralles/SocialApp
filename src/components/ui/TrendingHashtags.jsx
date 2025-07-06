import { useHashtags } from '../../hooks/useHashtags'
import { useEffect, useState } from 'react'

function TrendingHashtags() {
  const { trends, loadTrends } = useHashtags()
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  // Detectar cuando la página está completamente cargada
  useEffect(() => {
    const handlePageLoad = () => {
      setIsPageLoaded(true)
      loadTrends() // Cargar tendencias solo después del renderizado completo
    }

    if (document.readyState === 'complete') {
      handlePageLoad()
    } else {
      window.addEventListener('load', handlePageLoad)
      return () => window.removeEventListener('load', handlePageLoad)
    }
  }, [loadTrends])

  // Solo actualizar tendencias si la página ya está cargada
  useEffect(() => {
    if (!isPageLoaded) return

    const handleStorageChange = (e) => {
      // Escuchar cambios en posts, comentarios y perfiles
      if (e.key === 'posts' || e.key === 'postComments' || e.key?.startsWith('profile_')) {
        // Debounce para evitar actualizaciones excesivas
        setTimeout(() => loadTrends(), 100)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [loadTrends, isPageLoaded])

  // Actualizar tendencias cada 60 segundos (reducido para mejor performance)
  useEffect(() => {
    if (!isPageLoaded) return

    const interval = setInterval(() => {
      loadTrends()
    }, 60000)

    return () => clearInterval(interval)
  }, [loadTrends, isPageLoaded])

  if (trends.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Tendencias</h3>
        <div className="text-center py-4 text-gray-500 text-xs">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <p>No hay tendencias aún</p>
          <p className="mt-1">¡Usa hashtags en tus publicaciones!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center">
        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        Tendencias
      </h3>
      <div className="space-y-2">
        {trends.map((trend, index) => (
          <div 
            key={trend.tag} 
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                index === 0 ? 'bg-yellow-400' : 
                index === 1 ? 'bg-gray-400' : 
                index === 2 ? 'bg-orange-400' : 'bg-blue-400'
              }`}></div>
              <div>
                <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                  #{trend.tag}
                </div>
                <div className="text-xs text-gray-500">
                  {trend.count} {trend.count === 1 ? 'publicación' : 'publicaciones'}
                </div>
              </div>
            </div>
            {index < 3 && (
              <div className="text-xs font-bold text-gray-400">
                #{index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendingHashtags