import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export const useFollowing = () => {
  const { user } = useAuth()
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])

  useEffect(() => {
    if (user?.uid) {
      // Cargar datos de seguimiento desde localStorage
      const savedFollowing = JSON.parse(localStorage.getItem(`following_${user.uid}`) || '[]')
      const savedFollowers = JSON.parse(localStorage.getItem(`followers_${user.uid}`) || '[]')
      
      setFollowing(savedFollowing)
      setFollowers(savedFollowers)
    }
  }, [user?.uid])

  const toggleFollow = (targetUserId) => {
    if (!user?.uid || targetUserId === user.uid) return

    const isFollowing = following.includes(targetUserId)
    
    if (isFollowing) {
      // Dejar de seguir
      const updatedFollowing = following.filter(id => id !== targetUserId)
      setFollowing(updatedFollowing)
      localStorage.setItem(`following_${user.uid}`, JSON.stringify(updatedFollowing))
      
      // Actualizar seguidores del usuario objetivo
      const targetFollowers = JSON.parse(localStorage.getItem(`followers_${targetUserId}`) || '[]')
      const updatedTargetFollowers = targetFollowers.filter(id => id !== user.uid)
      localStorage.setItem(`followers_${targetUserId}`, JSON.stringify(updatedTargetFollowers))
    } else {
      // Seguir
      const updatedFollowing = [...following, targetUserId]
      setFollowing(updatedFollowing)
      localStorage.setItem(`following_${user.uid}`, JSON.stringify(updatedFollowing))
      
      // Actualizar seguidores del usuario objetivo
      const targetFollowers = JSON.parse(localStorage.getItem(`followers_${targetUserId}`) || '[]')
      const updatedTargetFollowers = [...targetFollowers, user.uid]
      localStorage.setItem(`followers_${targetUserId}`, JSON.stringify(updatedTargetFollowers))
    }
  }

  const isFollowing = (targetUserId) => {
    return following.includes(targetUserId)
  }

  const getFollowersCount = (userId = user?.uid) => {
    if (!userId) return 0
    const userFollowers = JSON.parse(localStorage.getItem(`followers_${userId}`) || '[]')
    return userFollowers.length
  }

  const getFollowingCount = (userId = user?.uid) => {
    if (!userId) return 0
    const userFollowing = JSON.parse(localStorage.getItem(`following_${userId}`) || '[]')
    return userFollowing.length
  }

  return {
    following,
    followers,
    toggleFollow,
    isFollowing,
    getFollowersCount,
    getFollowingCount
  }
}