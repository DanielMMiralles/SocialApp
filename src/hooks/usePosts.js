import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useFeedFilter } from '../context/FeedContext'

export const usePosts = () => {
  const { user } = useAuth()
  const { showFollowingOnly, selectedHashtag } = useFeedFilter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo
  const samplePosts = [
    {
      id: '1',
      userId: 'user1',
      userDisplayName: 'Ana García',
      userAvatar: '',
      content: '¡Qué hermoso día para salir a caminar! 🌞 El sol está perfecto y la brisa es increíble. A veces las cosas simples son las que más felicidad nos dan. #naturaleza #bienestar',
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
      content: 'Trabajando en un nuevo proyecto de #React. La #programación nunca deja de sorprenderme con sus posibilidades infinitas 💻✨ #JavaScript #desarrollo',
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
      content: 'Mi café de la mañana ☕ Momento perfecto para reflexionar sobre los objetivos del día. ¿Cuál es su ritual matutino favorito? #café #mañana #productividad',
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
      
      const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}')
      const allPosts = [...savedPosts, ...samplePosts].map(post => ({
        ...post,
        likes: savedLikes[post.id] || post.likes || [],
        comments: savedComments[post.id] || post.comments || []
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

  const deletePost = (postId, onConfirm) => {
    onConfirm(() => {
      setPosts(prev => prev.filter(post => post.id !== postId))
      
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]')
      const updatedSavedPosts = savedPosts.filter(post => post.id !== postId)
      localStorage.setItem('posts', JSON.stringify(updatedSavedPosts))
      
      // Eliminar comentarios asociados
      const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}')
      delete savedComments[postId]
      localStorage.setItem('postComments', JSON.stringify(savedComments))
    })
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const getFilteredPosts = () => {
    let filteredPosts = posts
    
    // Filtrar por hashtag si está seleccionado
    if (selectedHashtag) {
      filteredPosts = filteredPosts.filter(post => {
        const content = post.content || ''
        const hashtagRegex = /#[\w\u00C0-\u017F]+/g
        const hashtags = content.match(hashtagRegex) || []
        return hashtags.some(tag => tag.toLowerCase().includes(selectedHashtag.toLowerCase()))
      })
    }
    
    // Filtrar por usuarios seguidos si está activado y no hay hashtag seleccionado
    if (showFollowingOnly && !selectedHashtag) {
      const following = JSON.parse(localStorage.getItem(`following_${user?.uid}`) || '[]')
      filteredPosts = filteredPosts.filter(post => 
        post.userId === user?.uid || following.includes(post.userId)
      )
    }
    
    return filteredPosts
  }

  return {
    posts: getFilteredPosts(),
    allPosts: posts,
    loading,
    addPost,
    toggleLike,
    deletePost
  }
}