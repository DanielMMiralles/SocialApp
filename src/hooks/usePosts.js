import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export const usePosts = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo
  const samplePosts = [
    {
      id: '1',
      userId: 'user1',
      userDisplayName: 'Ana García',
      userAvatar: '',
      content: '¡Qué hermoso día para salir a caminar! 🌞 El sol está perfecto y la brisa es increíble. A veces las cosas simples son las que más felicidad nos dan.',
      image: null,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      likes: ['user2', 'user3'],
      comments: [
        {
          userDisplayName: 'Miguel Torres',
          content: '¡Totalmente de acuerdo! Yo también salí a caminar hoy.',
          timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      userDisplayName: 'Miguel Torres',
      userAvatar: '',
      content: 'Trabajando en un nuevo proyecto de React. La programación nunca deja de sorprenderme con sus posibilidades infinitas 💻✨',
      image: null,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      likes: ['user1'],
      comments: []
    },
    {
      id: '3',
      userId: 'user3',
      userDisplayName: 'Laura Martín',
      userAvatar: '',
      content: 'Mi café de la mañana ☕ Momento perfecto para reflexionar sobre los objetivos del día. ¿Cuál es su ritual matutino favorito?',
      image: null,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      likes: ['user1', 'user2', 'user4'],
      comments: [
        {
          userDisplayName: 'Ana García',
          content: 'Yo también soy team café ☕ No puedo empezar el día sin él',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
        }
      ]
    }
  ]

  const loadPosts = () => {
    setTimeout(() => {
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]')
      const savedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}')
      
      const allPosts = [...savedPosts, ...samplePosts].map(post => ({
        ...post,
        likes: savedLikes[post.id] || post.likes || []
      }))
      
      const sortedPosts = allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      setPosts(sortedPosts)
      setLoading(false)
    }, 1000)
  }

  const addPost = (newPost) => {
    setPosts(prev => [newPost, ...prev].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
  }

  const toggleLike = (postId) => {
    const currentLikes = JSON.parse(localStorage.getItem('postLikes') || '{}')
    const postLikes = currentLikes[postId] || []
    const isLiked = postLikes.includes(user.uid)
    
    const updatedPostLikes = isLiked 
      ? postLikes.filter(id => id !== user.uid)
      : [...postLikes, user.uid]
    
    currentLikes[postId] = updatedPostLikes
    localStorage.setItem('postLikes', JSON.stringify(currentLikes))
    
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: updatedPostLikes } : post
    ))
  }

  const deletePost = (postId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      setPosts(prev => prev.filter(post => post.id !== postId))
      
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]')
      const updatedSavedPosts = savedPosts.filter(post => post.id !== postId)
      localStorage.setItem('posts', JSON.stringify(updatedSavedPosts))
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return {
    posts,
    loading,
    addPost,
    toggleLike,
    deletePost
  }
}