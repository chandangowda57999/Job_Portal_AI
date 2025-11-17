import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks'
import { logout as logoutAction } from '../../store/slices/authSlice'
import { logout as logoutService, isAuthenticated, getUserData } from '../../services/authService'
import './Navigation.css'

/**
 * Navigation Component
 * Shared navigation bar that appears on all pages
 * Shows logout button when user is authenticated
 * Shows signin/signup links when user is not authenticated
 */
function Navigation() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authenticated = isAuthenticated()
  const userData = getUserData()

  /**
   * Handle logout
   * Clears authentication data and redirects to signin
   */
  const handleLogout = async () => {
    try {
      // Call logout service to clear local storage
      await logoutService()
      
      // Clear Redux auth state
      dispatch(logoutAction())
      
      // Redirect to signin page
      navigate('/signin', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear state and redirect
      dispatch(logoutAction())
      navigate('/signin', { replace: true })
    }
  }

  /**
   * Navigate to signin page
   */
  const handleSignIn = () => {
    navigate('/signin')
  }

  /**
   * Navigate to signup page
   */
  const handleSignUp = () => {
    navigate('/signup')
  }

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {/* Logo/Brand */}
        <div 
          className="navigation__logo"
          onClick={() => authenticated ? navigate('/dashboard') : navigate('/signin')}
          style={{ cursor: 'pointer' }}
        >
          <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1.25rem' }}>
            JobPortal AI
          </div>
        </div>

        {/* Right side actions */}
        <div className="navigation__actions">
          {authenticated ? (
            <>
              {/* User info */}
              {userData && (
                <span className="navigation__user-name">
                  {userData.firstName || userData.email?.split('@')[0] || 'User'}
                </span>
              )}
              {/* Logout button */}
              <button
                className="button button--secondary button--medium navigation__logout"
                onClick={handleLogout}
                type="button"
                aria-label="Logout"
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Sign In button */}
              <button
                className="button button--secondary button--medium"
                onClick={handleSignIn}
                type="button"
                aria-label="Sign In"
              >
                <span>Sign In</span>
              </button>
              {/* Sign Up button */}
              <button
                className="button button--primary button--medium"
                onClick={handleSignUp}
                type="button"
                aria-label="Sign Up"
              >
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation

