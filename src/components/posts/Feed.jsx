import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import PostCard from './PostCard'

function Feed({ newPosts = [] }) {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo para demostrar el feed
  const samplePosts = [
    {
      id: '1',
      userId: 'user1',
      userDisplayName: 'Ana García',
      userAvatar: '',
      content: '¡Qué hermoso día para salir a caminar! 🌞 El sol está perfecto y la brisa es increíble. A veces las cosas simples son las que más felicidad nos dan.',
      image: null,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutos atrás
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
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutos atrás
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
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
      likes: ['user1', 'user2', 'user4'],
      comments: [
        {
          userDisplayName: 'Ana García',
          content: 'Yo también soy team café ☕ No puedo empezar el día sin él',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
        },
        {
          userDisplayName: 'Carlos Ruiz',
          content: 'Para mí es hacer ejercicio temprano, me da energía para todo el día',
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: '4',
      userId: 'user4',
      userDisplayName: 'Carlos Ruiz',
      userAvatar: '',
      content: 'Reflexión del día: El éxito no se mide solo por lo que logras, sino por los obstáculos que superas en el camino. 💪\n\nCada desafío es una oportunidad de crecimiento.',
      image: null,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
      likes: ['user1', 'user3'],
      comments: [
        {
          userDisplayName: 'Laura Martín',
          content: 'Muy cierto! Los obstáculos nos hacen más fuertes',
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: '5',
      userId: 'user5',
      userDisplayName: 'Sofia Chen',
      userAvatar: '',
      content: 'Terminando de leer un libro increíble sobre productividad. Una de las mejores inversiones que podemos hacer es en nuestro crecimiento personal 📚\n\n¿Qué libro me recomiendan para leer después?',
      image: null,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 horas atrás
      likes: ['user2', 'user4'],
      comments: []
    },
    {
      id: '6',
      userId: 'user6',
      userDisplayName: 'David López',
      userAvatar: '',
      content: '¡Primer día en mi nuevo trabajo! 🎉 Nervioso pero emocionado por esta nueva etapa. Los cambios siempre traen oportunidades increíbles.',
      image: null,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 horas atrás
      likes: ['user1', 'user2', 'user3', 'user5'],
      comments: [
        {
          userDisplayName: 'Ana García',
          content: '¡Felicidades! Estoy segura de que te irá genial 🎊',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          userDisplayName: 'Miguel Torres',
          content: 'Mucho éxito en esta nueva aventura!',
          timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      // Combinar posts guardados en localStorage con posts de ejemplo
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]')
      const savedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}')
      
      // Aplicar likes guardados a todos los posts
      const allPosts = [...savedPosts, ...samplePosts].map(post => ({
        ...post,
        likes: savedLikes[post.id] || post.likes || []
      }))
      
      // Ordenar por timestamp (más recientes primero)
      const sortedPosts = allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      setPosts(sortedPosts)
      setLoading(false)
    }, 1000)
  }, [])

  // Actualizar posts cuando se crean nuevos
  useEffect(() => {
    if (newPosts.length > 0) {
      setPosts(prev => {
        const allPosts = [...newPosts, ...prev]
        return allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      })
    }
  }, [newPosts])

  const handleLike = (postId) => {
    // Obtener likes actuales del localStorage
    const currentLikes = JSON.parse(localStorage.getItem('postLikes') || '{}')
    const postLikes = currentLikes[postId] || []
    const isLiked = postLikes.includes(user.uid)
    
    // Actualizar likes
    const updatedPostLikes = isLiked 
      ? postLikes.filter(id => id !== user.uid)
      : [...postLikes, user.uid]
    
    // Guardar en localStorage
    currentLikes[postId] = updatedPostLikes
    localStorage.setItem('postLikes', JSON.stringify(currentLikes))
    
    // Actualizar estado local
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: updatedPostLikes }
      }
      return post
    }))
  }

  const handleDelete = (postId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      setPosts(prev => prev.filter(post => post.id !== postId))
      
      // También eliminar de localStorage si es una publicación guardada
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]')
      const updatedSavedPosts = savedPosts.filter(post => post.id !== postId)
      localStorage.setItem('posts', JSON.stringify(updatedSavedPosts))
    }
  }

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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay publicaciones aún</h3>
        <p className="text-gray-600 mb-6">¡Sé el primero en compartir algo increíble!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      ))}
      
      {/* Indicador de final del feed */}
      <div className="text-center py-8">
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-500 text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Estás al día con todas las publicaciones
        </div>
      </div>
    </div>
  )
}

export default Feed