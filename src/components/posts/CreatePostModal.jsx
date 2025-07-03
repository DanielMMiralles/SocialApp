import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import LoadingScreen from '../ui/LoadingScreen'

function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user, userProfile } = useAuth()
  const [postData, setPostData] = useState({
    content: '',
    image: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Función para comprimir imágenes
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleContentChange = (e) => {
    const content = e.target.value
    if (content.length <= 500) {
      setPostData(prev => ({ ...prev, content }))
      setError('')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const compressedImage = await compressImage(file, 800, 0.8)
        setPostData(prev => ({ ...prev, image: compressedImage }))
      } catch (error) {
        setError('Error procesando la imagen')
      }
    }
  }

  const handleRemoveImage = () => {
    setPostData(prev => ({ ...prev, image: null }))
  }

  const handleSubmit = async () => {
    if (!postData.content.trim() && !postData.image) {
      setError('Agrega contenido o una imagen para publicar')
      return
    }

    setIsLoading(true)
    
    try {
      const newPost = {
        id: Date.now().toString(),
        userId: user.uid,
        userDisplayName: userProfile?.displayName || user.email,
        userAvatar: userProfile?.profilePicture || '',
        content: postData.content.trim(),
        image: postData.image,
        timestamp: new Date().toISOString(),
        likes: [],
        comments: []
      }

      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]')
      const updatedPosts = [newPost, ...existingPosts]
      localStorage.setItem('posts', JSON.stringify(updatedPosts))

      setTimeout(() => {
        onPostCreated(newPost)
        onClose()
        setPostData({ content: '', image: null })
        setShowPreview(false)
        setIsLoading(false)
      }, 1500)

    } catch (error) {
      setError('Error al crear la publicación')
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {showPreview ? 'Vista Previa' : 'Crear Publicación'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {!showPreview ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                  {userProfile?.profilePicture ? (
                    <img 
                      src={userProfile.profilePicture} 
                      alt="Avatar" 
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    userProfile?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {userProfile?.displayName || user?.email}
                  </div>
                  <div className="text-sm text-gray-500">Publicando ahora</div>
                </div>
              </div>

              <div className="space-y-2">
                <textarea
                  value={postData.content}
                  onChange={handleContentChange}
                  placeholder="¿Qué está pasando?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {postData.content.length}/500 caracteres
                  </div>
                  <div className={`text-sm ${postData.content.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                    {500 - postData.content.length} restantes
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {!postData.image ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-sm text-gray-500">Agregar imagen (opcional)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={postData.image}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPreview(true)}
                  disabled={!postData.content.trim() && !postData.image}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Vista Previa
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!postData.content.trim() && !postData.image}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publicar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {userProfile?.profilePicture ? (
                        <img 
                          src={userProfile.profilePicture} 
                          alt="Avatar" 
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        userProfile?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {userProfile?.displayName || user?.email}
                      </div>
                      <div className="text-xs text-gray-500">Ahora</div>
                    </div>
                  </div>

                  {postData.content && (
                    <p className="text-gray-800 mb-4 leading-relaxed">
                      {postData.content}
                    </p>
                  )}

                  {postData.image && (
                    <img
                      src={postData.image}
                      alt="Post content"
                      className="w-full rounded-lg object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
                >
                  ← Editar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Confirmar y Publicar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreatePostModal