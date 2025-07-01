import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const registerWithEmail = async (email, password, displayName = '') => {
  try {
    // 1. Crear cuenta de autenticación
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    // 2. Crear perfil en Firestore con merge para evitar conflictos
    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      displayName: displayName || email.split('@')[0],
      bio: '',
      profilePicture: '',
      followers: [],
      following: [],
      postsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true })
    
    return { success: true, user: result.user }
  } catch (error) {
    let errorMessage = 'Error al crear la cuenta'
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este email ya está registrado'
        break
      case 'auth/weak-password':
        errorMessage = 'La contraseña debe tener al menos 6 caracteres'
        break
      case 'auth/invalid-email':
        errorMessage = 'Email inválido'
        break
      default:
        errorMessage = error.message
    }
    
    return { success: false, error: errorMessage }
  }
}

// Login con Google (solo usuarios existentes)
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    
    // Verificar si el usuario ya existe
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    
    if (!userDoc.exists()) {
      // Si no existe, cerrar sesión y mostrar error
      await signOut(auth)
      return { success: false, error: 'No tienes una cuenta registrada. Regístrate primero.' }
    }
    
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Registro con Google (crear nueva cuenta)
export const registerWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    
    // Verificar si ya existe
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    
    if (userDoc.exists()) {
      return { success: false, error: 'Ya tienes una cuenta. Usa el login normal.' }
    }
    
    // Crear perfil para nuevo usuario
    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      displayName: result.user.displayName || result.user.email.split('@')[0],
      bio: '',
      profilePicture: result.user.photoURL || '',
      followers: [],
      following: [],
      postsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Enviar link de autenticación por email
export const sendEmailLink = async (email) => {
  try {
    // Enviar el email link directamente (Firebase validará internamente)
    // La validación se hará al hacer click en el enlace
    const actionCodeSettings = {
      url: `${window.location.origin}/email-signin`,
      handleCodeInApp: true
    }
    
    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    
    // Guardar email en localStorage para completar el proceso
    window.localStorage.setItem('emailForSignIn', email)
    
    return { success: true }
  } catch (error) {
    console.error('Error enviando email link:', error)
    let errorMessage = 'Error al enviar el enlace'
    
    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido'
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'Dominio no autorizado. Contacta al administrador.'
    }
    
    return { success: false, error: errorMessage }
  }
}

// Completar autenticación con email link
export const completeEmailSignIn = async (email, emailLink) => {
  try {
    if (isSignInWithEmailLink(auth, emailLink)) {
      const result = await signInWithEmailLink(auth, email, emailLink)
      
      // Verificar si el usuario tiene perfil en Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      
      if (!userDoc.exists()) {
        // Si no tiene perfil, significa que no está registrado en nuestra app
        await signOut(auth)
        return { success: false, error: 'No tienes una cuenta registrada. Regístrate primero.' }
      }
      
      // Limpiar email guardado
      window.localStorage.removeItem('emailForSignIn')
      
      return { success: true, user: result.user }
    } else {
      return { success: false, error: 'Link de email inválido' }
    }
  } catch (error) {
    console.error('Error en completeEmailSignIn:', error)
    
    let errorMessage = 'Error al completar el inicio de sesión'
    
    switch (error.code) {
      case 'auth/invalid-action-code':
        errorMessage = 'El enlace de email ha expirado o ya fue usado. Solicita un nuevo enlace.'
        break
      case 'auth/expired-action-code':
        errorMessage = 'El enlace de email ha expirado. Solicita un nuevo enlace.'
        break
      case 'auth/invalid-email':
        errorMessage = 'Email inválido'
        break
      default:
        errorMessage = error.message
    }
    
    return { success: false, error: errorMessage }
  }
}