import { useState, useEffect } from 'react'

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", type = "danger" }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      setTimeout(() => setIsVisible(false), 200)
    }
  }, [isOpen])

  if (!isVisible) return null

  const typeStyles = {
    danger: {
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
      iconColor: "text-red-500",
      buttonColor: "bg-red-600 hover:bg-red-700"
    },
    warning: {
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
      iconColor: "text-yellow-500",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700"
    }
  }

  const currentStyle = typeStyles[type]

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-all duration-200 ${
      isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'
    }`}>
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-200 ${
        isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
      }`}>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center ${currentStyle.iconColor}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentStyle.icon} />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-600 text-sm mt-1">{message}</p>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 text-white rounded-2xl font-medium transition-all transform hover:scale-105 ${currentStyle.buttonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal