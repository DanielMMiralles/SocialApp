import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../lib/firebase'

// Actualizar perfil del usuario
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId)
    
    const updateData = {
      ...profileData,
      updatedAt: new Date()
    }
    
    await updateDoc(userRef, updateData)
    
    return { success: true, data: updateData }
  } catch (error) {
    console.error('Error actualizando perfil:', error)
    return { success: false, error: error.message }
  }
}

// Subir imagen de perfil
export const uploadProfileImage = async (userId, imageFile) => {
  try {
    // Crear referencia única para la imagen
    const timestamp = Date.now()
    const imageRef = ref(storage, `profiles/${userId}/profile_${timestamp}`)
    
    // Subir imagen
    const snapshot = await uploadBytes(imageRef, imageFile)
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return { success: true, url: downloadURL }
  } catch (error) {
    console.error('Error subiendo imagen:', error)
    return { success: false, error: error.message }
  }
}

// Subir imagen de portada
export const uploadCoverImage = async (userId, imageFile) => {
  try {
    const timestamp = Date.now()
    const imageRef = ref(storage, `profiles/${userId}/cover_${timestamp}`)
    
    const snapshot = await uploadBytes(imageRef, imageFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return { success: true, url: downloadURL }
  } catch (error) {
    console.error('Error subiendo imagen de portada:', error)
    return { success: false, error: error.message }
  }
}

// Eliminar imagen anterior (opcional, para limpiar storage)
export const deleteOldImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('firebase')) return
    
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
    
    return { success: true }
  } catch (error) {
    console.error('Error eliminando imagen anterior:', error)
    return { success: false, error: error.message }
  }
}

// Obtener perfil completo del usuario
export const getUserProfileData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userRef)
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    } else {
      return { success: false, error: 'Usuario no encontrado' }
    }
  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    return { success: false, error: error.message }
  }
}

// Función completa para actualizar perfil con imagen
export const updateProfileWithImage = async (userId, profileData, imageFile = null, coverFile = null) => {
  try {
    let finalProfileData = { ...profileData }
    
    // Subir imagen de perfil si se proporciona
    if (imageFile) {
      const imageResult = await uploadProfileImage(userId, imageFile)
      if (imageResult.success) {
        finalProfileData.profilePicture = imageResult.url
      } else {
        return { success: false, error: 'Error subiendo imagen de perfil' }
      }
    }
    
    // Subir imagen de portada si se proporciona
    if (coverFile) {
      const coverResult = await uploadCoverImage(userId, coverFile)
      if (coverResult.success) {
        finalProfileData.coverImage = coverResult.url
      } else {
        return { success: false, error: 'Error subiendo imagen de portada' }
      }
    }
    
    // Actualizar perfil en Firestore
    const updateResult = await updateUserProfile(userId, finalProfileData)
    
    return updateResult
  } catch (error) {
    console.error('Error en updateProfileWithImage:', error)
    return { success: false, error: error.message }
  }
}

// Validar tamaño y tipo de imagen
export const validateImage = (file) => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  
  if (!file) {
    return { valid: false, error: 'No se seleccionó archivo' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'La imagen debe ser menor a 5MB' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Solo se permiten imágenes JPG, PNG o WebP' }
  }
  
  return { valid: true }
}