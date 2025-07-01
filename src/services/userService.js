import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

// Crear perfil de usuario después del registro
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      email: userData.email,
      displayName: userData.displayName || '',
      bio: '',
      profilePicture: '',
      followers: [],
      following: [],
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Obtener perfil de usuario
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    } else {
      return { success: false, error: 'Usuario no encontrado' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}