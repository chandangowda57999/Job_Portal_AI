import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  updateSignUpField,
  setSignUpErrors,
  setSignUpGeneralError,
  setSignUpLoading,
  resetSignUpForm,
  setUser,
  setToken,
} from '../../store/slices/authSlice'
import { register } from '../../services/authService'
import { validateSignUpForm, sanitizeInput } from '../../utils/validators'
import './SignUp.css'

/**
 * SignUp Page Component
 * Themed to match SignIn with social auth and strong validation
 * Uses Redux for state management.
 */
function SignUp() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { signUpForm } = useAppSelector((state) => state.auth)
  const [hovered, setHovered] = React.useState(null)

  useEffect(() => {
    return () => {
      dispatch(resetSignUpForm())
    }
  }, [dispatch])

  const onChange = (e) => {
    const { name, value } = e.target
    dispatch(updateSignUpField({ field: name, value: sanitizeInput(value) }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    dispatch(setSignUpErrors({}))
    dispatch(setSignUpGeneralError(''))
    
    const formData = {
      name: signUpForm.name,
      email: signUpForm.email,
      password: signUpForm.password,
      confirmPassword: signUpForm.confirmPassword,
    }
    
    const validation = validateSignUpForm(formData)
    if (!validation.isValid) {
      dispatch(setSignUpErrors(validation.errors))
      return
    }
    
    dispatch(setSignUpLoading(true))
    try {
      const res = await register({
        name: signUpForm.name,
        email: signUpForm.email,
        password: signUpForm.password,
      })
      
      // Store user and token in Redux
      dispatch(setUser(res.user))
      dispatch(setToken(res.token))
      
      // Redirect to profile creation after successful registration
      navigate('/profile/create')
    } catch (err) {
      dispatch(setSignUpGeneralError(err.message || 'Failed to sign up. Please try again.'))
    } finally {
      dispatch(setSignUpLoading(false))
    }
  }

  return (
    <div className="signup">
      <div className="signup__background" aria-hidden="true">
        <div className="signup__bg signup__bg--1"></div>
        <div className="signup__bg signup__bg--2"></div>
        <div className="signup__bg signup__bg--3"></div>
      </div>

      <div className="signup__container">
        <div className="signup__header">
          <h1 className="signup__title"><span className="signup__title-text">Create your account</span></h1>
          <p className="signup__subtitle">Join JobPortal AI to get personalized recommendations</p>
        </div>

        <div className={`signup__card ${signUpForm.isLoading ? 'signup__card--loading' : ''}`} onMouseEnter={() => setHovered('card')} onMouseLeave={() => setHovered(null)}>
          {signUpForm.generalError && (
            <div className="signup__error" role="alert">
              <span>{signUpForm.generalError}</span>
            </div>
          )}

          <form className="signup__form" onSubmit={onSubmit} noValidate>
            <div className="input input--floating">
              <div className="input__container">
                <input
                  id="name"
                  name="name"
                  value={signUpForm.name}
                  onChange={onChange}
                  placeholder=" "
                  disabled={signUpForm.isLoading}
                  className={`input__field ${signUpForm.errors.name ? 'input__field--error' : ''}`}
                />
                <label htmlFor="name" className="input__label">Full Name<span className="input__required">*</span></label>
                <div className="input__focus-line"></div>
              </div>
              {signUpForm.errors.name && <p className="input__error" role="alert">{signUpForm.errors.name}</p>}
            </div>

            <div className="input input--floating">
              <div className="input__container">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={signUpForm.email}
                  onChange={onChange}
                  placeholder=" "
                  disabled={signUpForm.isLoading}
                  className={`input__field ${signUpForm.errors.email ? 'input__field--error' : ''}`}
                  autoComplete="email"
                />
                <label htmlFor="email" className="input__label">Email Address<span className="input__required">*</span></label>
                <div className="input__focus-line"></div>
              </div>
              {signUpForm.errors.email && <p className="input__error" role="alert">{signUpForm.errors.email}</p>}
            </div>

            <div className="input input--floating">
              <div className="input__container">
                <input
                  id="password"
                  type={signUpForm.showPassword ? 'text' : 'password'}
                  name="password"
                  value={signUpForm.password}
                  onChange={onChange}
                  placeholder=" "
                  disabled={signUpForm.isLoading}
                  className={`input__field ${signUpForm.errors.password ? 'input__field--error' : ''}`}
                  autoComplete="new-password"
                />
                <label htmlFor="password" className="input__label">Password<span className="input__required">*</span></label>
                <button
                  type="button"
                  className="input__toggle-password"
                  onClick={() => dispatch(updateSignUpField({ field: 'showPassword', value: !signUpForm.showPassword }))}
                  aria-label={signUpForm.showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {signUpForm.showPassword ? '🔒' : '👁️‍🗨️'}
                </button>
                <div className="input__focus-line"></div>
              </div>
              {signUpForm.errors.password && <p className="input__error" role="alert">{signUpForm.errors.password}</p>}
            </div>

            <div className="input input--floating">
              <div className="input__container">
                <input
                  id="confirmPassword"
                  type={signUpForm.showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={signUpForm.confirmPassword}
                  onChange={onChange}
                  placeholder=" "
                  disabled={signUpForm.isLoading}
                  className={`input__field ${signUpForm.errors.confirmPassword ? 'input__field--error' : ''}`}
                  autoComplete="new-password"
                />
                <label htmlFor="confirmPassword" className="input__label">Confirm Password<span className="input__required">*</span></label>
                <div className="input__focus-line"></div>
              </div>
              {signUpForm.errors.confirmPassword && <p className="input__error" role="alert">{signUpForm.errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className={`button button--primary button--medium button--full-width ${signUpForm.isLoading ? 'button--loading' : ''}`}
              disabled={signUpForm.isLoading}
              aria-busy={signUpForm.isLoading}
            >
              <span className={signUpForm.isLoading ? 'button__text--loading' : 'button__text'}>
                {signUpForm.isLoading ? 'Creating account...' : 'Create Account'}
              </span>
              <div className="button__ripple"></div>
            </button>
          </form>

          <div className="signup__footer">
            <p>Already have an account? <button type="button" className="signin__link signin__link--primary" onClick={() => navigate('/signin')}>Sign In</button></p>
          </div>
        </div>
        <div className="signup__page-footer"><p>&copy; 2025 JobPortal AI. All rights reserved.</p></div>
      </div>
    </div>
  )
}

export default SignUp


