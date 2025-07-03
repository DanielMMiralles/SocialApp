import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { logout } from '../services/authService'
import { getUserProfileData } from '../services/profileService'
import LoadingScreen from '../components/ui/LoadingScreen'
import EditProfileModal from '../components/profile/EditProfileModal'
import ChangePasswordModal from '../components/profile/ChangePasswordModal'

function Profile({ onBack }) {
  const { user, userProfile } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [profileData, setProfileData] = useState(() => {
    // Intentar cargar desde localStorage al inicializar
    if (user?.uid) {
      const savedProfile = localStorage.getItem(`profile_${user.uid}`)
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile)
          return {
            displayName: parsedProfile.displayName || userProfile?.displayName || '',
            bio: parsedProfile.bio || userProfile?.bio || '',
            profilePicture: parsedProfile.profilePicture || userProfile?.profilePicture || '',
            coverImage: parsedProfile.coverImage || userProfile?.coverImage || ''
          }
        } catch (error) {
          console.log('Error parsing saved profile')
        }
      }
    }
    
    return {
      displayName: userProfile?.displayName || '',
      bio: userProfile?.bio || '',
      profilePicture: userProfile?.profilePicture || '',
      coverImage: userProfile?.coverImage || ''
    }
  })
  
  // Cargar datos del perfil (localStorage primero, luego userProfile)
  useEffect(() => {
    if (user?.uid) {
      // Intentar cargar desde localStorage primero
      const savedProfile = localStorage.getItem(`profile_${user.uid}`)
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile)
          setProfileData({
            displayName: parsedProfile.displayName || '',
            bio: parsedProfile.bio || '',
            profilePicture: parsedProfile.profilePicture || '',
            coverImage: parsedProfile.coverImage || ''
          })
          return
        } catch (error) {
          console.log('Error parsing saved profile')
        }
      }
      
      // Fallback a userProfile si no hay datos guardados
      if (userProfile) {
        setProfileData({
          displayName: userProfile.displayName || '',
          bio: userProfile.bio || '',
          profilePicture: userProfile.profilePicture || '',
          coverImage: userProfile.coverImage || ''
        })
      }
    }
  }, [user?.uid, userProfile])

  const handleSaveProfile = async (newData) => {
    setProfileData(newData)
    // Los cambios ya se ven reflejados inmediatamente
  }
  
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspecto
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Convertir a base64 comprimido
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        // Comprimir imagen antes de guardar
        const compressedImage = await compressImage(file, 1200, 0.8)
        
        const updatedProfile = {
          ...profileData,
          coverImage: compressedImage
        }
        
        setProfileData(updatedProfile)
        
        // Intentar guardar en localStorage con manejo de errores
        try {
          localStorage.setItem(`profile_${user.uid}`, JSON.stringify(updatedProfile))
        } catch (storageError) {
          console.warn('No se pudo guardar en localStorage (imagen muy grande):', storageError)
          // La imagen se mantiene en memoria pero no se persiste
        }
      } catch (error) {
        console.error('Error comprimiendo imagen:', error)
      }
    }
  }
  


  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
  }

  if (isLoggingOut) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header con navegación */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack || (() => window.history.back())}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tarjeta principal del perfil */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Portada con gradiente o imagen personalizada */}
          <div className="h-48 relative overflow-hidden">
            {profileData.coverImage ? (
              <>
                <img 
                  src={profileData.coverImage} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </>
            ) : (
              <>
                <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                <div className="absolute inset-0 bg-black/20"></div>
              </>
            )}
            <div className="absolute bottom-4 right-4">
              <label className="inline-flex items-center px-3 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-700 hover:bg-white hover:shadow-md transition-all cursor-pointer border border-white/50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Cambiar portada</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Información del perfil */}
          <div className="px-8 pb-8">
            {/* Avatar y botón editar */}
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                    {profileData.profilePicture ? (
                      <img 
                        src={profileData.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      profileData.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Editar Perfil
              </button>
            </div>

            {/* Información personal */}
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {profileData.displayName || 'Sin nombre'}
                </h2>
                <p className="text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  {user?.email}
                </p>
              </div>

              <div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {profileData.bio || 'Aún no has agregado una biografía. ¡Cuéntanos sobre ti!'}
                </p>
              </div>

              {/* Estadísticas */}
              <div className="flex space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-gray-600 text-sm">Publicaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-gray-600 text-sm">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-gray-600 text-sm">Siguiendo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secciones adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuración rápida */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0a2 2 0 00-2 2m2-2a2 2 0 012 2m0 0V9a2 2 0 012-2m-2 2a2 2 0 002 2" />
                </svg>
                Cambiar contraseña
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center">
                <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacidad
              </button>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Actividad
            </h3>
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No hay actividad reciente</p>
            </div>
          </div>

          {/* Personas que sigo */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Siguiendo
              </div>
              <span className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700">Ver todos</span>
            </h3>
            <div className="space-y-3">
              {/* Usuario ejemplo 1 */}
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Ana García</div>
                  <div className="text-xs text-gray-500">@ana_garcia</div>
                </div>
              </div>
              
              {/* Usuario ejemplo 2 */}
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                  M
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Miguel Torres</div>
                  <div className="text-xs text-gray-500">@miguel_dev</div>
                </div>
              </div>
              
              {/* Usuario ejemplo 3 */}
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                  L
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Laura Martín</div>
                  <div className="text-xs text-gray-500">@laura_design</div>
                </div>
              </div>
              
              {/* Mensaje cuando no hay usuarios */}
              <div className="text-center py-4 text-gray-500 text-sm hidden">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p>Aún no sigues a nadie</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={profileData}
        onSave={handleSaveProfile}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}

export default Profile