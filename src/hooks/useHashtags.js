import { useState, useEffect } from 'react'

export const useHashtags = () => {
  const [trends, setTrends] = useState([])

  useEffect(() => {
    // No hacer nada al inicializar, las tendencias se calculan bajo demanda
  }, [])

  const extractHashtags = (text) => {
    const hashtagRegex = /#[\w\u00C0-\u017F]+/g
    return text.match(hashtagRegex) || []
  }

  const parseTextWithHashtags = (text) => {
    const hashtagRegex = /#([\w\u00C0-\u017F]+)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = hashtagRegex.exec(text)) !== null) {
      // Agregar texto antes del hashtag
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        })
      }
      
      // Agregar hashtag
      parts.push({
        type: 'hashtag',
        content: match[0],
        tag: match[1]
      })
      
      lastIndex = match.index + match[0].length
    }
    
    // Agregar texto restante
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      })
    }
    
    return parts
  }

  const calculateTrendsFromAllSources = () => {
    const hashtagCounts = {}
    
    const countHashtagsFromText = (text) => {
      if (text) {
        const hashtags = extractHashtags(text)
        hashtags.forEach(hashtag => {
          const tag = hashtag.replace('#', '').toLowerCase()
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
        })
      }
    }
    
    // 1. Hashtags de publicaciones guardadas
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    savedPosts.forEach(post => {
      countHashtagsFromText(post.content)
    })
    
    // 2. Hashtags de posts de ejemplo
    const samplePosts = [
      { content: 'Trabajando en un nuevo proyecto de #React. La #programación nunca deja de sorprenderme con sus posibilidades infinitas 💻✨ #JavaScript #desarrollo' },
      { content: '¡Qué hermoso día para salir a caminar! 🌞 El sol está perfecto y la brisa es increíble. A veces las cosas simples son las que más felicidad nos dan. #naturaleza #bienestar' },
      { content: 'Mi café de la mañana ☕ Momento perfecto para reflexionar sobre los objetivos del día. ¿Cuál es su ritual matutino favorito? #café #mañana #productividad' }
    ]
    samplePosts.forEach(post => {
      countHashtagsFromText(post.content)
    })
    
    // 3. Hashtags de comentarios
    const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}')
    Object.values(savedComments).forEach(postComments => {
      if (Array.isArray(postComments)) {
        postComments.forEach(comment => {
          countHashtagsFromText(comment.content)
        })
      }
    })
    
    // 4. Hashtags de biografías de perfiles
    const profileKeys = Object.keys(localStorage).filter(key => key.startsWith('profile_'))
    profileKeys.forEach(key => {
      try {
        const profile = JSON.parse(localStorage.getItem(key) || '{}')
        countHashtagsFromText(profile.bio)
      } catch (error) {
        // Ignorar errores de parsing
      }
    })
    
    return hashtagCounts
  }

  const loadTrends = () => {
    // Calcular tendencias dinámicamente desde todas las fuentes
    const counts = calculateTrendsFromAllSources()
    const sortedTrends = Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))
    
    setTrends(sortedTrends)
  }

  const updateHashtagCounts = (hashtags) => {
    // Solo actualizar las tendencias, no guardar contadores separados
    loadTrends()
  }

  return {
    trends,
    extractHashtags,
    parseTextWithHashtags,
    updateHashtagCounts,
    loadTrends
  }
}