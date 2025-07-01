import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Login from '../components/auth/login'
import Register from '../components/auth/Register'
import EmailLogin from '../components/auth/EmailLogin'
import Dashboard from '../pages/Dashboard'
import EmailSignIn from '../pages/EmailSignIn'
import LoadingScreen from '../components/ui/LoadingScreen'

function AppRouter() {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState('login') // 'login' | 'register' | 'email-login'
  const [viewLoading, setViewLoading] = useState(false)
  
  // Detectar si estamos en la página de email sign-in
  useEffect(() => {
    if (window.location.pathname === '/email-signin') {
      setCurrentView('email-signin')
    }
  }, [])

  if (loading || viewLoading) {
    return <LoadingScreen />
  }

  if (user) {
    return <Dashboard />
  }

  const handleViewChange = (view) => {
    setViewLoading(true)
    
    setTimeout(() => {
      setCurrentView(view)
      // Actualizar URL para email-signin
      if (view === 'email-signin') {
        window.history.pushState({}, '', '/email-signin')
      } else {
        window.history.pushState({}, '', '/')
      }
      
      setTimeout(() => {
        setViewLoading(false)
      }, 2500) // Loading screen por 2.5 segundos
    }, 100)
  }

  if (currentView === 'email-signin') {
    return <EmailSignIn />
  }

  if (currentView === 'register') {
    return <Register onViewChange={handleViewChange} />
  }

  if (currentView === 'email-login') {
    return <EmailLogin onViewChange={handleViewChange} />
  }

  return <Login onViewChange={handleViewChange} />
}

export default AppRouter