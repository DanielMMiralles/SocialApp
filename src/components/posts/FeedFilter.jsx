import { useState } from 'react'
import { useFeedFilter } from '../../context/FeedContext'

function FeedFilter() {
  const { showFollowingOnly, setShowFollowingOnly, selectedHashtag, setSelectedHashtag } = useFeedFilter()
  const [isChanging, setIsChanging] = useState(false)

  const handleToggle = () => {
    setIsChanging(true)
    setShowFollowingOnly(!showFollowingOnly)
    setTimeout(() => setIsChanging(false), 400)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Filtrar Feed</h3>
          <p className="text-xs text-gray-600 mt-1">
            {selectedHashtag ? `Hashtag: #${selectedHashtag}` : 
             showFollowingOnly ? 'Solo usuarios seguidos' : 'Todas las publicaciones'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedHashtag && (
            <button
              onClick={() => setSelectedHashtag(null)}
              className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200 transition-colors"
              title="Limpiar filtro"
            >
              ✕
            </button>
          )}
        </div>
          <button
            onClick={handleToggle}
            disabled={isChanging || selectedHashtag}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showFollowingOnly ? 'bg-blue-600' : 'bg-gray-300'
            } ${isChanging ? 'scale-110 shadow-lg' : ''} ${selectedHashtag ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${
              showFollowingOnly ? 'translate-x-6' : 'translate-x-1'
            } ${isChanging ? 'scale-90' : ''}`}
          />
          {isChanging && (
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
          )}
        </button>
      </div>
      
      <div className="flex items-center space-x-4 mt-3 text-xs">
        <div className={`flex items-center space-x-1 ${!showFollowingOnly ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
          <span>Explorar</span>
        </div>
        
        <div className={`flex items-center space-x-1 ${showFollowingOnly ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <span>Siguiendo</span>
        </div>
      </div>
    </div>
  )
}

export default FeedFilter