import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useHashtags } from './useHashtags'

export const useCreatePost = (onPostCreated) => {
  const { user, userProfile } = useAuth()
  const { extractHashtags, updateHashtagCounts } = useHashtags()
  const [postData, setPostData] = useState({
    content: '',
    image: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

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
      const hashtags = extractHashtags(postData.content)
      
      const newPost = {
        id: Date.now().toString(),
        userId: user.uid,
        userDisplayName: userProfile?.displayName || user.email,
        userAvatar: userProfile?.profilePicture || '',
        content: postData.content.trim(),
        hashtags: hashtags,
        image: postData.image,
        timestamp: new Date().toISOString(),
        likes: [],
        comments: []
      }
      
      // Actualizar contadores de hashtags
      if (hashtags.length > 0) {
        updateHashtagCounts(hashtags)
      }

      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]')
      const updatedPosts = [newPost, ...existingPosts]
      localStorage.setItem('posts', JSON.stringify(updatedPosts))

      setTimeout(() => {
        onPostCreated(newPost)
        resetForm()
        setIsLoading(false)
      }, 1500)

    } catch (error) {
      setError('Error al crear la publicación')
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setPostData({ content: '', image: null })
    setShowPreview(false)
    setError('')
  }

  return {
    postData,
    isLoading,
    error,
    showPreview,
    setShowPreview,
    handleContentChange,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    resetForm,
    userProfile,
    user
  }
}