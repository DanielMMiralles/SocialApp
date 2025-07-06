import { useFollowing } from '../../hooks/useFollowing'
import { useAuth } from '../../context/AuthContext'

function FollowButton({ targetUserId, size = 'default', className = '' }) {
  const { user } = useAuth()
  const { toggleFollow, isFollowing } = useFollowing()
  
  // No mostrar botón si es el mismo usuario
  if (!user?.uid || targetUserId === user.uid) return null
  
  const following = isFollowing(targetUserId)
  
  const sizeClasses = {
    small: 'px-3 py-1 text-xs',
    default: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }

  return (
    <button
      onClick={() => toggleFollow(targetUserId)}
      className={`font-medium rounded-2xl transition-all duration-200 transform hover:scale-105 ${
        following
          ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
      } ${sizeClasses[size]} ${className}`}
    >
      {following ? 'Siguiendo' : 'Seguir'}
    </button>
  )
}

export default FollowButton