function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-lg animate-pulse">
          <span className="text-3xl font-bold text-white">CL</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-700">Cargando CrossLine...</h2>
          <p className="text-gray-500">Preparando tu experiencia social</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen