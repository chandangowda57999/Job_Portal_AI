import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks'
import { logout as logoutAction } from '../../store/slices/authSlice'
import { logout as logoutService, isAuthenticated, getUserData } from '../../services/authService'
import './NavigationBar.css'

/**
 * NavigationBar Component
 * Simple navigation bar with logo on left, user name and logout on right.
 * Can be integrated into any page's header section.
 */
function NavigationBar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authenticated = isAuthenticated()
  const userData = getUserData()

  const handleLogout = async () => {
    try {
      await logoutService()
      dispatch(logoutAction())
      navigate('/signin', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      dispatch(logoutAction())
      navigate('/signin', { replace: true })
    }
  }

  return (
    <div className="nav-bar">
      {/* Left: Logo */}
      <div 
        className="nav-bar__logo"
        onClick={() => navigate('/dashboard')}
        style={{ cursor: 'pointer' }}
      >
        <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1.25rem' }}>
          JobPortal AI
        </div>
      </div>

      {/* Right: User info and Logout */}
      {authenticated && (
        <div className="nav-bar__user-actions">
          {userData && (
            <span className="nav-bar__user-name">
              {userData.firstName || userData.email?.split('@')[0] || 'User'}
            </span>
          )}
          <button
            className="button button--secondary button--medium nav-bar__logout"
            onClick={handleLogout}
            type="button"
            aria-label="Logout"
          >
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default NavigationBar

