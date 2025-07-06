import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTimeAgo } from '../../hooks/useTimeAgo'
import { useComments } from '../../hooks/useComments'
import ConfirmModal from '../ui/ConfirmModal'
import FollowButton from '../ui/FollowButton'
import HashtagText from '../ui/HashtagText'

function PostCard({ post, onLike, onDelete }) {
  const { user } = useAuth()
  const { getTimeAgo } = useTimeAgo()
  const [showComments, setShowComments] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const {
    comments,
    newComment,
    setNewComment,
    isSubmitting,
    addComment,
    deleteComment,
    canDeleteComment,
    toggleCommentReaction
  } = useComments(post.id, post.comments)

  const isLiked = post.likes.includes(user?.uid)
  const isOwner = post.userId === user?.uid

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
      {/* Gradiente decorativo superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {/* Header del post */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-semibold overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative z-10">
                {post.userAvatar ? (
                  <img 
                    src={post.userAvatar} 
                    alt={post.userDisplayName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    {post.userDisplayName?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="font-bold text-gray-900 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text cursor-pointer transition-all duration-200">
                  {post.userDisplayName}
                </div>
                <FollowButton targetUserId={post.userId} size="small" />
              </div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>{getTimeAgo(post.timestamp)}</span>
              </div>
            </div>
          </div>
          
          {/* Menú de opciones */}
          <div className="relative">
            {isOwner && (
              <button
                onClick={() => setShowDeleteModal(true)}
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
      <div className="px-6 pb-4">
        {post.content && (
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            <HashtagText text={post.content} />
          </div>
        )}
      </div>

      {/* Imagen del post */}
      {post.image && (
        <div className="px-6 pb-4">
          <div className="relative overflow-hidden rounded-2xl group-hover:rounded-3xl transition-all duration-300">
            <img
              src={post.image}
              alt="Post content"
              className="w-full object-cover max-h-96 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      )}

      {/* Botones de interacción */}
      <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Botón de like */}
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-200 transform hover:scale-105 ${
                isLiked 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100 shadow-md' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50 hover:shadow-md'
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
              className="flex items-center space-x-2 px-4 py-2 rounded-2xl text-gray-500 hover:text-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">
                {comments.length > 0 ? comments.length : 'Comentar'}
              </span>
            </button>
          </div>

          {/* Botón compartir */}
          <button className="flex items-center space-x-2 px-4 py-2 rounded-2xl text-gray-500 hover:text-green-500 hover:bg-green-50 hover:shadow-md transition-all duration-200 transform hover:scale-105">
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
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                    {comment.userAvatar ? (
                      <img 
                        src={comment.userAvatar} 
                        alt={comment.userDisplayName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      comment.userDisplayName?.charAt(0)?.toUpperCase() || '?'
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg px-3 py-2 relative group">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm text-gray-900">
                          {comment.userDisplayName}
                        </div>
                        {canDeleteComment(comment) && (
                          <button
                            onClick={() => setCommentToDelete(comment.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all"
                            title="Eliminar comentario"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        <HashtagText text={comment.content} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1 ml-3">
                      <div className="text-xs text-gray-500">
                        {getTimeAgo(comment.timestamp)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleCommentReaction(comment.id)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-all ${
                            comment.reactions?.includes(user.uid)
                              ? 'text-red-500 bg-red-50 hover:bg-red-100'
                              : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <svg className="w-3 h-3" fill={comment.reactions?.includes(user.uid) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {comment.reactions?.length > 0 && (
                            <span>{comment.reactions.length}</span>
                          )}
                        </button>
                      </div>
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
            <div className="flex items-start space-x-3 pt-3 border-t border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                {user?.email?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  rows={2}
                  maxLength={200}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {newComment.length}/200 caracteres
                  </div>
                  <button 
                    onClick={addComment}
                    disabled={!newComment.trim() || isSubmitting || newComment.length > 200}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(post.id, (callback) => {
            callback()
            setShowDeleteModal(false)
          })
        }}
        title="Eliminar publicación"
        message="¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
      
      {/* Modal de confirmación para eliminar comentario */}
      <ConfirmModal
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        onConfirm={() => {
          deleteComment(commentToDelete)
          setCommentToDelete(null)
        }}
        title="Eliminar comentario"
        message="¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default PostCard