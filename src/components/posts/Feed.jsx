import { useEffect, useState } from 'react'
import { usePosts } from '../../hooks/usePosts'
import { useFeedFilter } from '../../context/FeedContext'
import PostCard from './PostCard'

function Feed({ newPosts = [] }) {
  const { posts, loading, addPost, toggleLike, deletePost } = usePosts()
  const { showFollowingOnly, selectedHashtag } = useFeedFilter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayPosts, setDisplayPosts] = useState(posts)

  // Manejar transiciones suaves al cambiar filtro
  useEffect(() => {
    if (displayPosts.length > 0 && posts.length !== displayPosts.length) {
      setIsTransitioning(true)
      
      // Fade out
      setTimeout(() => {
        setDisplayPosts(posts)
        setIsTransitioning(false)
      }, 200)
    } else {
      setDisplayPosts(posts)
    }
  }, [posts])

  useEffect(() => {
    if (newPosts.length > 0) {
      newPosts.forEach(post => addPost(post))
    }
  }, [newPosts])

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {selectedHashtag ? `No hay publicaciones con #${selectedHashtag}` :
           showFollowingOnly ? 'No hay publicaciones de usuarios seguidos' : 'No hay publicaciones aún'}
        </h3>
        <p className="text-gray-600 mb-6">
          {selectedHashtag ? '¡Prueba con otro hashtag o crea una publicación con esta etiqueta!' :
           showFollowingOnly ? '¡Sigue a otros usuarios para ver sus publicaciones aquí!' : 
           '¡Sé el primero en compartir algo increíble!'}
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {isTransitioning && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse rounded-3xl z-10 pointer-events-none"></div>
      )}
      <div className={`space-y-8 transition-all duration-300 ${isTransitioning ? 'opacity-60 scale-98' : 'opacity-100 scale-100'}`}>
        {displayPosts.map((post, index) => (
          <div 
            key={`${post.id}-${showFollowingOnly}`}
            className={`transition-all duration-300 ${isTransitioning ? '' : 'animate-fade-in-up'}`}
            style={{ animationDelay: isTransitioning ? '0ms' : `${index * 50}ms` }}
          >
            <PostCard
              post={post}
              onLike={toggleLike}
              onDelete={deletePost}
            />
          </div>
        ))}
      </div>
      
      {/* Indicador de final del feed mejorado */}
      <div className="text-center py-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full blur opacity-50"></div>
          <div className="relative inline-flex items-center px-6 py-3 bg-white border-2 border-gray-100 rounded-full text-gray-600 text-sm font-medium shadow-lg">
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-3 animate-pulse"></div>
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            ¡Estás al día con todas las publicaciones!
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed