import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function PostCard({ post, onLike, onDelete }) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  
  // Función para calcular tiempo transcurrido
  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const isLiked = post.likes.includes(user?.uid)
  const isOwner = post.userId === user?.uid

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header del post */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold overflow-hidden">
              {post.userAvatar ? (
                <img 
                  src={post.userAvatar} 
                  alt={post.userDisplayName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                post.userDisplayName?.charAt(0)?.toUpperCase() || '?'
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                {post.userDisplayName}
              </div>
              <div className="text-sm text-gray-500">
                {getTimeAgo(post.timestamp)}
              </div>
            </div>
          </div>
          
          {/* Menú de opciones */}
          <div className="relative">
            {isOwner && (
              <button
                onClick={() => onDelete(post.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar publicación"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del post */}
      <div className="px-4 pb-3">
        {post.content && (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        )}
      </div>

      {/* Imagen del post */}
      {post.image && (
        <div className="px-4 pb-3">
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-xl object-cover max-h-96"
          />
        </div>
      )}

      {/* Botones de interacción */}
      <div className="px-4 py-3 border-t border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Botón de like */}
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                isLiked 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <svg 
                className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} 
                fill={isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">
                {post.likes.length > 0 ? post.likes.length : 'Me gusta'}
              </span>
            </button>

            {/* Botón de comentarios */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">
                {post.comments.length > 0 ? post.comments.length : 'Comentar'}
              </span>
            </button>
          </div>

          {/* Botón compartir */}
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sección de comentarios (expandible) */}
      {showComments && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="space-y-3">
            {post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                    {comment.userDisplayName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg px-3 py-2">
                      <div className="font-medium text-sm text-gray-900">
                        {comment.userDisplayName}
                      </div>
                      <div className="text-sm text-gray-700">
                        {comment.content}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-3">
                      {getTimeAgo(comment.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </div>
            )}
            
            {/* Campo para agregar comentario */}
            <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                {user?.email?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard