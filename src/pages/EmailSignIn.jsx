import { useEffect, useState } from 'react'
import { completeEmailSignIn } from '../services/authService'

function EmailSignIn() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const emailLink = window.location.href
        
        // Obtener email guardado
        let email = window.localStorage.getItem('emailForSignIn')
        
        // Si no hay email guardado, pedirlo al usuario
        if (!email) {
          email = window.prompt('Por favor, confirma tu email para completar el inicio de sesión')
        }
        
        if (email) {
          const result = await completeEmailSignIn(email, emailLink)
          
          if (!result.success) {
            setError(result.error)
          }
          // Si es exitoso, AuthContext manejará la redirección
        } else {
          setError('Email requerido para completar el inicio de sesión')
        }
      } catch (error) {
        setError('Error al procesar el enlace de autenticación')
      }
      
      setLoading(false)
    }

    completeSignIn()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl mb-4 shadow-lg animate-pulse">
            <span className="text-2xl font-bold text-white">CL</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Completando inicio de sesión...</h2>
          <p className="text-gray-600">Por favor espera un momento</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-gray-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">✗</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Error de autenticación</h1>
            <p className="text-gray-600">No pudimos completar tu inicio de sesión</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <p className="text-red-600 mb-6">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Volver al login
                </button>
                {error.includes('expirado') || error.includes('usado') ? (
                  <p className="text-sm text-gray-600">
                    Tip: Los enlaces de email solo se pueden usar una vez. Si ya iniciaste sesión y cerraste, usa el login normal.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default EmailSignIn