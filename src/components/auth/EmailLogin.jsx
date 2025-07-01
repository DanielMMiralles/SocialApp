import { useState } from 'react'
import { sendEmailLink } from '../../services/authService'
import LoadingScreen from '../ui/LoadingScreen'

function EmailLogin({ onViewChange }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await sendEmailLink(email)
    
    if (result.success) {
      setTimeout(() => {
        setEmailSent(true)
        setIsLoading(false)
      }, 2000)
    } else {
      setTimeout(() => {
        setError(result.error)
        setIsLoading(false)
      }, 2000)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Email enviado!</h1>
            <p className="text-gray-600">Revisa tu correo y haz clic en el enlace para iniciar sesión</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Hemos enviado un enlace de inicio de sesión a:
              </p>
              <p className="font-semibold text-blue-600 mb-6">{email}</p>
              <p className="text-sm text-gray-500 mb-6">
                El enlace expirará en 1 hora. Si no ves el email, revisa tu carpeta de spam.
              </p>
              <button
                onClick={() => onViewChange('login')}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Volver al login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">@</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Acceso por Email</h1>
          <p className="text-gray-600">Te enviaremos un enlace de un solo uso para iniciar sesión</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? 'Enviando...' : 'Enviar enlace mágico'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onViewChange('login')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              ← Volver al login tradicional
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailLogin