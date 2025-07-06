import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export const useComments = (postId, initialComments = []) => {
  const { user, userProfile } = useAuth()
  const [comments, setComments] = useState(() => {
    // Cargar reacciones guardadas
    const savedReactions = JSON.parse(localStorage.getItem('commentReactions') || '{}')
    return initialComments.map(comment => ({
      ...comment,
      reactions: savedReactions[comment.id] || comment.reactions || []
    }))
  })
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addComment = async () => {
    if (!newComment.trim() || newComment.length > 200) return

    setIsSubmitting(true)

    const comment = {
      id: Date.now().toString(),
      postId,
      userId: user.uid,
      userDisplayName: userProfile?.displayName || user.email,
      userAvatar: userProfile?.profilePicture || '',
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      reactions: []
    }

    // Simular delay de red
    setTimeout(() => {
      setComments(prev => [...prev, comment])
      setNewComment('')
      setIsSubmitting(false)
      
      // Guardar en localStorage
      const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}')
      savedComments[postId] = [...(savedComments[postId] || []), comment]
      localStorage.setItem('postComments', JSON.stringify(savedComments))
    }, 500)
  }

  const deleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId))
    
    // Actualizar localStorage
    const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}')
    if (savedComments[postId]) {
      savedComments[postId] = savedComments[postId].filter(comment => comment.id !== commentId)
      localStorage.setItem('postComments', JSON.stringify(savedComments))
    }
  }

  const canDeleteComment = (comment) => {
    return comment.userId === user.uid // Solo el autor puede eliminar su comentario
  }

  const toggleCommentReaction = (commentId) => {
    const savedReactions = JSON.parse(localStorage.getItem('commentReactions') || '{}')
    const commentReactions = savedReactions[commentId] || []
    const hasReacted = commentReactions.includes(user.uid)
    
    const updatedReactions = hasReacted 
      ? commentReactions.filter(id => id !== user.uid)
      : [...commentReactions, user.uid]
    
    savedReactions[commentId] = updatedReactions
    localStorage.setItem('commentReactions', JSON.stringify(savedReactions))
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, reactions: updatedReactions }
        : comment
    ))
  }

  return {
    comments,
    newComment,
    setNewComment,
    isSubmitting,
    addComment,
    deleteComment,
    canDeleteComment,
    toggleCommentReaction
  }
}