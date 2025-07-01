import { useState } from 'react'
import { registerWithEmail, registerWithGoogle } from '../../services/authService'
import LoadingScreen from '../ui/LoadingScreen'

function Register({ onViewChange }) {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones')
      setIsLoading(false)
      return
    }

    const result = await registerWithEmail(formData.email, formData.password, formData.displayName)
    
    if (!result.success) {
      setTimeout(() => {
        setError(result.error)
        setIsLoading(false)
      }, 2000)
    } else {
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    setError('')
    
    const result = await registerWithGoogle()
    
    if (!result.success) {
      setTimeout(() => {
        setError(result.error)
        setIsLoading(false)
      }, 2000)
    } else {
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">CL</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Únete a CrossLine!</h1>
          <p className="text-gray-600">Crea tu cuenta y conecta con otros</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium text-gray-700 block">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                required
              />
              <span className="ml-2 text-sm text-gray-600">
                Acepto los{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                  política de privacidad
                </a>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o regístrate con</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <button 
              type="button"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Continuar con Google</span>
            </button>
          </div>
        </div>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <button 
            onClick={() => onViewChange('login')}
            className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register