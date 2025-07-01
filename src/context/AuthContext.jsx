import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Delay para permitir que se vean los loading screens
      setTimeout(() => {
        setUser(user)
        setLoading(false)
        
        if (user) {
          // Usar datos básicos del usuario sin consultar Firestore automáticamente
          setUserProfile({
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            profilePicture: user.photoURL || ''
          })
        } else {
          setUserProfile(null)
        }
      }, 2000) // 2 segundos para permitir que se vean los loading screens
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    userProfile,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}